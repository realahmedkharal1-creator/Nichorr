import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "@/lib/creator/creator-studio.types";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { ScriptQualityProvider } from "@/lib/creator/quality/script-quality.provider";
import { TargetedRegenerationEngine } from "@/lib/creator/changes/targeted-regeneration.engine";
import { ResearchChangesProvider } from "@/lib/creator/changes/research-changes.provider";
import { CreatorWorkflowDependencies } from "@/lib/creator/workflow/creator-workflow.dependencies";
import { DEFAULT_PRODUCTION_PREFERENCES, CreatorProductionPreferences } from "@/lib/creator/production-preferences.types";
import { RevalidationEngine } from "../revalidation.engine";
import { ResearchHealthEngine } from "../research-health.engine";
import { DecisionHistoryService } from "./decision-history.service";
import {
  ResearchHealthAction,
  ResearchHealthActionResult,
  CreatorDecisionRecord,
  ResearchHealthDecisionType,
} from "./research-health-decision.types";

export class DecisionOrchestratorEngine {
  /**
   * Records a user review choice (ACCEPTED, REJECTED, KEPT_CURRENT) and logs it to immutable audit history.
   */
  static recordUserReview(
    session: ResearchRunSession,
    decisionId: string,
    decisionType: ResearchHealthDecisionType,
    action: 'ACCEPTED' | 'REJECTED' | 'KEPT_CURRENT',
    note?: string,
    userId: string = "anonymous-creator",
    targetClaimIds: string[] = [],
    targetAssetIds: string[] = []
  ): CreatorDecisionRecord {
    const snapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);

    return DecisionHistoryService.recordDecision({
      decisionRecordId: `drec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      researchRunId: session.id,
      decisionId,
      decisionType,
      severity: 'MEDIUM',
      action,
      actionResult: `User marked decision as ${action}.${note ? ` Note: ${note}` : ''}`,
      previousState: 'PENDING',
      newState: action,
      reason: note || `Creator selected ${action} in Research Health Control Center.`,
      claimIds: targetClaimIds,
      assetIds: targetAssetIds,
      evidenceSnapshotHash: snapshotHash,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Executes a creator-approved action (REVALIDATE, REGENERATE_AFFECTED, KEEP_CURRENT, BLOCK_CONTENT).
   * Strictly connects upstream evidence revalidation to downstream asset updates.
   */
  static async executeAction(
    session: ResearchRunSession,
    report: CreatorStudioReport | undefined,
    action: ResearchHealthAction,
    userId: string = "anonymous-creator",
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES
  ): Promise<{
    updatedSession: ResearchRunSession;
    updatedReport?: CreatorStudioReport;
    actionResult: ResearchHealthActionResult;
  }> {
    const previousSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const initialHealth = ResearchHealthEngine.evaluateHealth(session, report);
    const qualityScoreBefore = report?.qualityReview?.overallQualityScore || 90;
    const readinessBefore = initialHealth.readyToSupportCreatorContent;
    const nowStr = new Date().toISOString();

    let updatedSession = JSON.parse(JSON.stringify(session)) as ResearchRunSession;
    let updatedReport = report ? JSON.parse(JSON.stringify(report)) as CreatorStudioReport : undefined;
    let scriptVersionCreated: number | undefined = undefined;

    const claimsRecovered: string[] = [];
    const claimsStillUnhealthy: string[] = [];
    const conflictsResolved: string[] = [];
    const assetsRequiringRegeneration: string[] = [];

    switch (action.actionType) {
      case 'REVALIDATE': {
        const targetIds = action.targetClaimIds && action.targetClaimIds.length > 0
          ? action.targetClaimIds
          : initialHealth.claimsHealth.filter((c) => c.revalidationRequired).map((c) => c.claimId);

        const plan = RevalidationEngine.generateRevalidationPlan(
          updatedSession,
          initialHealth.claimsHealth,
          { mode: 'AFFECTED_CLAIMS_ONLY', claimIds: targetIds }
        );

        const revResult = RevalidationEngine.executeRevalidation(updatedSession, plan);
        updatedSession = revResult.updatedSession;

        // Post-revalidation health comparison
        const postHealth = ResearchHealthEngine.evaluateHealth(updatedSession, updatedReport);

        for (const cid of targetIds) {
          const pre = initialHealth.claimsHealth.find((c) => c.claimId === cid);
          const post = postHealth.claimsHealth.find((c) => c.claimId === cid);

          if (pre?.healthStatus !== 'HEALTHY' && post?.healthStatus === 'HEALTHY') {
            claimsRecovered.push(cid);
          } else if (post?.healthStatus === 'BLOCKED' || post?.healthStatus === 'UNBACKED' || post?.healthStatus === 'CONFLICTED') {
            claimsStillUnhealthy.push(cid);
          }
        }

        // Identify downstream assets that require regeneration
        if (updatedReport) {
          const impact = ResearchChangesProvider.detectAndEvaluateChanges(
            session,
            updatedSession,
            updatedReport,
            preferences
          );
          for (const a of impact.changeSet.assetImpacts) {
            if (a.regenerationRecommended) {
              assetsRequiringRegeneration.push(a.assetId);
            }
          }
        }
        break;
      }

      case 'REGENERATE_AFFECTED': {
        if (updatedReport) {
          const changeSet = ResearchChangesProvider.detectAndEvaluateChanges(
            session,
            updatedSession,
            updatedReport,
            preferences
          ).changeSet;

          const regenResult = TargetedRegenerationEngine.regenerateAssets(
            updatedSession,
            updatedReport,
            changeSet,
            action.targetAssetIds,
            preferences
          );

          updatedReport = regenResult.updatedReport;
          scriptVersionCreated = regenResult.newScriptVersion?.version || 2;
        }
        break;
      }

      case 'KEEP_CURRENT': {
        // Preserves creator assets without changing underlying factual health
        break;
      }

      case 'BLOCK_CONTENT': {
        // Enforces content isolation
        if (action.targetClaimIds) {
          for (const cid of action.targetClaimIds) {
            const clm = updatedSession.claims?.find((c) => c.id === cid);
            if (clm) {
              clm.status = 'DO_NOT_SAY';
            }
          }
        }
        break;
      }
    }

    const newSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(updatedSession);
    const postHealth = ResearchHealthEngine.evaluateHealth(updatedSession, updatedReport);
    const qualityScoreAfter = updatedReport?.qualityReview?.overallQualityScore || qualityScoreBefore;
    const readinessAfter = postHealth.readyToSupportCreatorContent;

    const actionResult: ResearchHealthActionResult = {
      actionId: action.actionId,
      decisionId: action.decisionId,
      success: true,
      status: 'COMPLETED',
      summaryMessage: `Action ${action.actionType} executed successfully at ${nowStr}.`,
      previousEvidenceHash: previousSnapshotHash,
      newEvidenceHash: newSnapshotHash,
      claimsRecovered,
      claimsStillUnhealthy,
      conflictsResolved,
      assetsRequiringRegeneration,
      scriptVersionCreated,
      qualityScoreBefore,
      qualityScoreAfter,
      readinessBefore,
      readinessAfter,
      executedAt: nowStr,
    };

    // Record in decision history
    DecisionHistoryService.recordDecision({
      decisionRecordId: `drec-${Date.now().toString(36)}-${action.actionId}`,
      userId,
      researchRunId: session.id,
      decisionId: action.decisionId,
      decisionType: 'REVALIDATE_CLAIM',
      severity: 'MEDIUM',
      action: action.actionType as any,
      actionResult: actionResult.summaryMessage,
      previousState: previousSnapshotHash,
      newState: newSnapshotHash,
      reason: action.consequenceSummary,
      claimIds: action.targetClaimIds || [],
      assetIds: action.targetAssetIds || [],
      evidenceSnapshotHash: newSnapshotHash,
      scriptVersion: scriptVersionCreated,
      timestamp: nowStr,
    });

    return {
      updatedSession,
      updatedReport,
      actionResult,
    };
  }
}
