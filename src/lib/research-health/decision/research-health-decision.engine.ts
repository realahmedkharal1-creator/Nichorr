import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "@/lib/creator/creator-studio.types";
import { ResearchHealthReport, ClaimHealthRecord, EvidenceItemHealth } from "../research-health.types";
import { DecisionExplanationEngine } from "./decision-explanation.engine";
import {
  ResearchHealthDecision,
  ResearchHealthDecisionReport,
  ResearchHealthDecisionType,
  ResearchHealthDecisionSeverity,
  ResearchHealthAction,
  AssetDecisionContext,
  ClaimDecisionContext,
  RevalidationQueueItem,
} from "./research-health-decision.types";

export class ResearchHealthDecisionEngine {
  /**
   * Transforms Phase 74 Research Health Reports into actionable, prioritized creator decisions.
   * Deterministic, explainable, and non-fabricating.
   */
  static evaluateDecisions(
    session: ResearchRunSession,
    healthReport: ResearchHealthReport,
    report?: CreatorStudioReport,
    userId: string = "anonymous-creator"
  ): ResearchHealthDecisionReport {
    const decisionsQueue: ResearchHealthDecision[] = [];
    const criticalIssues: ResearchHealthDecision[] = [];
    const revalidationQueue: RevalidationQueueItem[] = [];
    const evidenceMap = new Map(healthReport.evidenceHealth.map((e) => [e.evidenceId, e]));
    const nowStr = new Date().toISOString();

    // Evaluate each claim in health report
    for (const clm of healthReport.claimsHealth) {
      const primaryEviId = clm.upstreamEvidenceIds[0];
      const evidence = primaryEviId ? evidenceMap.get(primaryEviId) : undefined;
      const affectedAssets: AssetDecisionContext[] = (clm.affectedCreatorAssets || []).map((a) => ({
        assetType: a.assetType as any,
        assetId: a.assetId,
        assetLabel: a.assetLabel,
        impactStatus: clm.healthStatus === 'BLOCKED' || clm.healthStatus === 'UNBACKED' ? 'BLOCKED' :
                      clm.healthStatus === 'CONFLICTED' || clm.healthStatus === 'NEEDS_REVALIDATION' ? 'STALE' :
                      clm.healthStatus === 'AGING' ? 'REVIEW_REQUIRED' : 'HEALTHY',
        explanation: `Relies on claim "${clm.claimText}" (${clm.healthStatus}).`,
        regenerationRecommended: clm.healthStatus !== 'HEALTHY' && clm.healthStatus !== 'AGING',
      }));

      const claimContext: ClaimDecisionContext = {
        claimId: clm.claimId,
        claimText: clm.claimText,
        claimHealthStatus: clm.healthStatus,
        freshnessStatus: clm.freshnessStatus,
        validityStatus: clm.validityStatus,
        authorityStatus: clm.authorityStatus,
        independenceStatus: clm.independenceStatus,
        methodologyStatus: clm.methodologyStatus,
        reason: clm.reason,
        upstreamEvidenceExcerpts: evidence ? [evidence.excerpt] : [],
      };

      // Deterministically determine decision type and severity
      let decisionType: ResearchHealthDecisionType = 'NO_ACTION_REQUIRED';
      let severity: ResearchHealthDecisionSeverity = 'INFO';

      if (clm.healthStatus === 'BLOCKED') {
        decisionType = 'BLOCK_CREATOR_CONTENT';
        severity = 'CRITICAL';
      } else if (clm.healthStatus === 'UNBACKED') {
        decisionType = 'BLOCK_CREATOR_CONTENT';
        severity = 'CRITICAL';
      } else if (clm.healthStatus === 'CONFLICTED') {
        decisionType = 'INVESTIGATE_CONFLICT';
        severity = 'CRITICAL';
      } else if (clm.healthStatus === 'NEEDS_REVALIDATION') {
        if (clm.methodologyStatus === 'METHODOLOGY_CONFLICT') {
          decisionType = 'REVALIDATE_METHODOLOGY';
          severity = 'HIGH';
        } else if (evidence?.evidenceType === 'BENCHMARK' || clm.claimType === 'BENCHMARK') {
          decisionType = 'REVALIDATE_BENCHMARK';
          severity = 'HIGH';
        } else if (evidence?.evidenceType === 'HARDWARE_SPEC' || clm.claimType === 'HARDWARE_SPEC') {
          decisionType = 'REVALIDATE_HARDWARE';
          severity = 'MEDIUM';
        } else if (evidence?.evidenceType === 'YOUTUBE_REVIEW' || clm.claimType === 'YOUTUBE_REVIEW') {
          decisionType = 'REVALIDATE_YOUTUBE';
          severity = 'MEDIUM';
        } else {
          decisionType = 'REVALIDATE_CLAIM';
          severity = 'MEDIUM';
        }
      } else if (clm.healthStatus === 'AGING') {
        decisionType = 'MONITOR';
        severity = 'LOW';
      }

      // Generate structured explanation
      const explanation = DecisionExplanationEngine.generateExplanation(
        decisionType,
        severity,
        clm,
        evidence,
        affectedAssets
      );

      // Generate creator actions
      const availableActions = this.generateAvailableActions(
        `dec-${clm.claimId}`,
        decisionType,
        clm,
        affectedAssets
      );

      const decision: ResearchHealthDecision = {
        id: `dec-${clm.claimId}`,
        decisionType,
        severity,
        confidence: 'CONFIRMED',
        status: severity === 'CRITICAL' ? 'BLOCKED' : severity === 'HIGH' || severity === 'MEDIUM' ? 'PENDING' : 'COMPLETED',
        title: explanation.headline,
        summary: explanation.whatHappened,
        explanation,
        claimContext,
        affectedAssets,
        availableActions,
        recommendedActionId: availableActions[0]?.actionId || `act-default-${clm.claimId}`,
        createdAt: nowStr,
        updatedAt: nowStr,
      };

      decisionsQueue.push(decision);

      if (severity === 'CRITICAL') {
        criticalIssues.push(decision);
      }

      // Add to Revalidation Queue if revalidation is required
      if (clm.revalidationRequired) {
        revalidationQueue.push({
          queueId: `q-${clm.claimId}`,
          priority: severity,
          claimId: clm.claimId,
          claimText: clm.claimText,
          evidenceType: evidence?.evidenceType || 'BENCHMARK',
          reason: clm.reason,
          actionType: clm.revalidationAction || 'RECHECK_PRIMARY_SOURCE',
          status: 'READY',
        });
      }
    }

    // Compile Affected Assets Across All Decisions
    const allAffectedAssetsMap = new Map<string, AssetDecisionContext>();
    for (const dec of decisionsQueue) {
      for (const asset of dec.affectedAssets) {
        const key = `${asset.assetType}-${asset.assetId}`;
        const existing = allAffectedAssetsMap.get(key);
        if (!existing || (asset.impactStatus === 'BLOCKED' && existing.impactStatus !== 'BLOCKED')) {
          allAffectedAssetsMap.set(key, asset);
        }
      }
    }

    const affectedAssets = Array.from(allAffectedAssetsMap.values());
    const affectedAssetsSummary = {
      totalAssets: affectedAssets.length,
      healthyCount: affectedAssets.filter((a) => a.impactStatus === 'HEALTHY' || a.impactStatus === 'UNAFFECTED').length,
      reviewRequiredCount: affectedAssets.filter((a) => a.impactStatus === 'REVIEW_REQUIRED').length,
      staleCount: affectedAssets.filter((a) => a.impactStatus === 'STALE').length,
      blockedCount: affectedAssets.filter((a) => a.impactStatus === 'BLOCKED').length,
    };

    // Action Required Banner Details
    const totalCritical = criticalIssues.length;
    const totalPending = decisionsQueue.filter((d) => d.severity === 'CRITICAL' || d.severity === 'HIGH' || d.severity === 'MEDIUM').length;
    const actionRequired = totalCritical > 0 || totalPending > 0;

    let bannerSeverity: ResearchHealthDecisionSeverity = 'INFO';
    let bannerHeadline = "Research Health Verified & Production-Ready";
    let bannerSubtext = "All supporting laboratory evidence, benchmarks, and specs are fresh and valid. Ready to record.";

    if (totalCritical > 0) {
      bannerSeverity = 'CRITICAL';
      bannerHeadline = `${totalCritical} Critical Research Health Issue${totalCritical > 1 ? 's' : ''} Require Attention`;
      bannerSubtext = "Factual contradictions or unbacked statements are blocking the Ready-to-Record gate.";
    } else if (totalPending > 0) {
      bannerSeverity = 'HIGH';
      bannerHeadline = `${totalPending} Evidence Revalidation Recommendation${totalPending > 1 ? 's' : ''}`;
      bannerSubtext = "Supporting benchmarks or hardware specs are aging and recommended for re-checking before recording.";
    }

    return {
      reportId: `dec-rep-${session.id}-${Date.now().toString(36)}`,
      researchRunId: session.id,
      userId,
      topic: session.topic || "Hardware Research Topic",
      overallHealthScore: healthReport.overallHealthScore,
      overallHealthGrade: healthReport.overallHealthGrade,
      monitoringMode: healthReport.monitoringMode,
      readyToRecord: healthReport.readyToSupportCreatorContent && totalCritical === 0,
      actionRequired,
      actionRequiredBanner: {
        headline: bannerHeadline,
        subtext: bannerSubtext,
        severity: bannerSeverity,
        totalCriticalIssues: totalCritical,
        totalActionsPending: totalPending,
      },
      criticalIssues,
      decisionsQueue,
      revalidationQueue,
      affectedAssetsSummary,
      affectedAssets,
      evidenceSnapshotHash: healthReport.evidenceSnapshotHash,
      lastEvaluatedAt: nowStr,
    };
  }

  private static generateAvailableActions(
    decisionId: string,
    decisionType: ResearchHealthDecisionType,
    claim: ClaimHealthRecord,
    affectedAssets: AssetDecisionContext[]
  ): ResearchHealthAction[] {
    const targetClaimIds = [claim.claimId];
    const targetAssetIds = affectedAssets.map((a) => a.assetId);

    switch (decisionType) {
      case 'BLOCK_CREATOR_CONTENT': {
        return [
          {
            actionId: `act-block-${claim.claimId}`,
            decisionId,
            actionType: 'BLOCK_CONTENT',
            targetClaimIds,
            targetAssetIds,
            label: "Enforce Content Block",
            confirmationPrompt: "Keep this unverified or prohibited claim isolated from all creator script exports?",
            consequenceSummary: "Claim remains quarantined. Script sections referencing it will display a blocked placeholder.",
          },
          {
            actionId: `act-investigate-${claim.claimId}`,
            decisionId,
            actionType: 'INVESTIGATE',
            targetClaimIds,
            label: "Investigate Safety Blocker",
            confirmationPrompt: "Open evidence inspector to review why this claim is flagged?",
            consequenceSummary: "Inspects full provenance chain and conflict disclosures.",
          },
        ];
      }

      case 'INVESTIGATE_CONFLICT': {
        return [
          {
            actionId: `act-revalidate-${claim.claimId}`,
            decisionId,
            actionType: 'REVALIDATE',
            targetClaimIds,
            revalidationMode: 'AFFECTED_CLAIMS_ONLY',
            label: "Revalidate Conflicting Sources",
            confirmationPrompt: "Re-query laboratory sources to resolve the conflicting measurements?",
            consequenceSummary: "Refreshes evidence graph and updates conflict resolution status.",
          },
          {
            actionId: `act-investigate-${claim.claimId}`,
            decisionId,
            actionType: 'INVESTIGATE',
            targetClaimIds,
            label: "Inspect Conflict Context",
            confirmationPrompt: "Review differing test configurations between reporting labs?",
            consequenceSummary: "Opens detailed comparability notes.",
          },
          {
            actionId: `act-keep-${claim.claimId}`,
            decisionId,
            actionType: 'KEEP_CURRENT',
            targetClaimIds,
            targetAssetIds,
            label: "Keep Current (Note Conflict in Script)",
            confirmationPrompt: "Retain current script while acknowledging the conflict in talking points?",
            consequenceSummary: "Retains script text with an informational caveat warning.",
          },
        ];
      }

      case 'REVALIDATE_BENCHMARK':
      case 'REVALIDATE_METHODOLOGY':
      case 'REVALIDATE_HARDWARE':
      case 'REVALIDATE_YOUTUBE':
      case 'REVALIDATE_CLAIM': {
        return [
          {
            actionId: `act-revalidate-${claim.claimId}`,
            decisionId,
            actionType: 'REVALIDATE',
            targetClaimIds,
            revalidationMode: 'AFFECTED_CLAIMS_ONLY',
            label: "Revalidate Evidence Now",
            confirmationPrompt: "Re-query latest laboratory benchmarks and spec databases for this claim?",
            consequenceSummary: "Updates evidence snapshot and marks downstream assets as ready for regeneration review.",
          },
          {
            actionId: `act-keep-${claim.claimId}`,
            decisionId,
            actionType: 'KEEP_CURRENT',
            targetClaimIds,
            targetAssetIds,
            label: "Keep Current (Proceed with Aging Evidence)",
            confirmationPrompt: "Retain current script without refreshing this aging evidence?",
            consequenceSummary: "Preserves existing script outline without rewriting.",
          },
          {
            actionId: `act-review-${claim.claimId}`,
            decisionId,
            actionType: 'REVIEW_ASSET',
            targetClaimIds,
            targetAssetIds,
            label: "Review Affected Assets",
            confirmationPrompt: "Inspect which script sections and cards rely on this aging evidence?",
            consequenceSummary: "Highlights affected sections in Creator Studio.",
          },
        ];
      }

      case 'REGENERATE_AFFECTED_ASSET':
      case 'REVIEW_AFFECTED_ASSET': {
        return [
          {
            actionId: `act-regenerate-${claim.claimId}`,
            decisionId,
            actionType: 'REGENERATE_AFFECTED',
            targetClaimIds,
            targetAssetIds,
            label: "Regenerate Affected Assets (Version N+1)",
            confirmationPrompt: "Create Script Version N+1 with updated evidence grounding for affected sections?",
            consequenceSummary: "Updates only affected talking points and cards. Previous script versions remain intact.",
            isDestructive: false,
          },
          {
            actionId: `act-keep-${claim.claimId}`,
            decisionId,
            actionType: 'KEEP_CURRENT',
            targetClaimIds,
            targetAssetIds,
            label: "Keep Current Script",
            confirmationPrompt: "Keep current script text despite updated research evidence?",
            consequenceSummary: "Retains current script version without regeneration.",
          },
        ];
      }

      default: {
        return [
          {
            actionId: `act-keep-${claim.claimId}`,
            decisionId,
            actionType: 'KEEP_CURRENT',
            targetClaimIds,
            label: "No Action Needed",
            confirmationPrompt: "Evidence is verified and healthy.",
            consequenceSummary: "Proceed with recording.",
          },
        ];
      }
    }
  }
}
