import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ScriptQualityProvider } from "../quality/script-quality.provider";
import { PublishingProvider } from "../publishing/publishing.provider";
import { DistributionProvider } from "../distribution/distribution.provider";
import { CreatorProjectProvider } from "../project/creator-project.provider";
import { CreatorWorkflowDependencies } from "../workflow/creator-workflow.dependencies";
import { CreatorExecutionPlan, CreatorStagedExecution } from "./creator-execution.types";
import { CreatorExecutionAuditService } from "./creator-execution.audit";

export class CreatorExecutionStagingEngine {
  /**
   * Executes approved operations into an isolated staged state without modifying the active project.
   */
  static executeStaging(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    plan: CreatorExecutionPlan,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    stagedExecution?: CreatorStagedExecution;
    errorMessage?: string;
  } {
    if (plan.executionStatus !== 'APPROVED' && plan.executionStatus !== 'AWAITING_APPROVAL') {
      return {
        success: false,
        errorMessage: `Cannot stage execution in ${plan.executionStatus} status. Creator approval required.`,
      };
    }

    const nowStr = new Date().toISOString();
    const stagedScriptVersion = plan.targetScriptVersion;
    const newEvidenceSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);

    // 1. Generate Target Staged Studio Report with updated Script Version N+1
    const stagedReport: CreatorStudioReport = {
      ...activeReport,
      scriptVersion: stagedScriptVersion,
      topic: session.topic || activeReport.topic,
    };

    // Run Quality Review on Staged Report
    stagedReport.qualityReview = ScriptQualityProvider.review(
      session,
      stagedReport,
      profile
    );

    // 2. Generate Staged Publishing Preflight
    const stagedPreflight = PublishingProvider.runPreflight(
      session,
      stagedReport,
      preferences,
      profile
    );

    // 3. Generate Staged Distribution Package
    const stagedDistPackage = DistributionProvider.generatePackage(
      session,
      stagedReport,
      stagedPreflight,
      undefined,
      preferences,
      userId,
      1
    );

    // 4. Generate Staged Project Snapshot
    const stagedProjectSnapshot = CreatorProjectProvider.getProjectSnapshot(
      session,
      stagedReport,
      preferences,
      profile,
      undefined,
      stagedPreflight,
      stagedDistPackage
    );

    const stagedExecutionId = `staged-${session.id}-v${stagedScriptVersion}-${Date.now().toString(36)}`;

    const stagedExecution: CreatorStagedExecution = {
      stagedExecutionId,
      executionPlanId: plan.executionPlanId,
      userId,
      researchRunId: session.id,
      stagedScriptVersion,
      stagedReport,
      stagedEvidenceSnapshotHash: newEvidenceSnapshotHash,
      stagedProjectSnapshot,
      stagedPreflight,
      stagedDistributionPackage: stagedDistPackage,
      stagedAt: nowStr,
      status: 'STAGED',
    };

    plan.executionStatus = 'STAGED';

    CreatorExecutionAuditService.recordAuditEvent({
      auditId: `exec-aud-${Date.now().toString(36)}-stage`,
      executionPlanId: plan.executionPlanId,
      userId,
      researchRunId: session.id,
      action: 'STAGING_COMPLETED',
      previousSnapshot: plan.projectSnapshotHash,
      newSnapshot: stagedProjectSnapshot.snapshotHash,
      previousScriptVersion: plan.currentScriptVersion,
      newScriptVersion: stagedScriptVersion,
      affectedNodes: plan.affectedNodes,
      affectedAssets: plan.affectedAssets.map((a) => a.assetId),
      executionResult: `Staged Version ${stagedScriptVersion} prepared successfully in isolated workspace.`,
      timestamp: nowStr,
    });

    return {
      success: true,
      stagedExecution,
    };
  }
}
