import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorExecutionPlan, CreatorStagedExecution } from "./creator-execution.types";
import { CreatorExecutionAuditService } from "./creator-execution.audit";

export class CreatorExecutionCommitEngine {
  /**
   * Commits a validated staged execution to active project state with optimistic concurrency protection.
   */
  static commitExecution(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    staged: CreatorStagedExecution,
    plan: CreatorExecutionPlan,
    currentProjectSnapshotHash: string,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    committedReport?: CreatorStudioReport;
    errorMessage?: string;
    rebaseRequired?: boolean;
  } {
    // 1. Validate Execution Status
    if (plan.executionStatus !== 'VALIDATED') {
      return {
        success: false,
        errorMessage: `Cannot commit execution in ${plan.executionStatus} status. Staged execution must be VALIDATED first.`,
      };
    }

    // 2. Optimistic Concurrency Check
    if (currentProjectSnapshotHash !== plan.projectSnapshotHash) {
      plan.executionStatus = 'BLOCKED';
      CreatorExecutionAuditService.recordAuditEvent({
        auditId: `exec-aud-${Date.now().toString(36)}-commit-stale`,
        executionPlanId: plan.executionPlanId,
        userId,
        researchRunId: session.id,
        action: 'COMMIT_BLOCKED_STALE',
        previousSnapshot: plan.projectSnapshotHash,
        newSnapshot: currentProjectSnapshotHash,
        previousScriptVersion: plan.currentScriptVersion,
        newScriptVersion: staged.stagedScriptVersion,
        affectedNodes: plan.affectedNodes,
        affectedAssets: plan.affectedAssets.map((a) => a.assetId),
        executionResult: "Commit blocked: Active project state was modified while execution was staged.",
        failureReason: "Optimistic concurrency collision. REBASE_REQUIRED.",
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        rebaseRequired: true,
        errorMessage: "Active project state was modified while execution was staged. Plan must be rebased/rebuilt.",
      };
    }

    const nowStr = new Date().toISOString();
    const committedReport: CreatorStudioReport = {
      ...staged.stagedReport,
      scriptVersion: staged.stagedScriptVersion,
    };

    plan.executionStatus = 'COMMITTED';
    staged.status = 'COMMITTED';

    CreatorExecutionAuditService.recordAuditEvent({
      auditId: `exec-aud-${Date.now().toString(36)}-commit-ok`,
      executionPlanId: plan.executionPlanId,
      userId,
      researchRunId: session.id,
      action: 'COMMIT_SUCCESS',
      previousSnapshot: plan.projectSnapshotHash,
      newSnapshot: staged.stagedProjectSnapshot.snapshotHash,
      previousScriptVersion: plan.currentScriptVersion,
      newScriptVersion: staged.stagedScriptVersion,
      affectedNodes: plan.affectedNodes,
      affectedAssets: plan.affectedAssets.map((a) => a.assetId),
      executionResult: `Script Version ${staged.stagedScriptVersion} committed successfully as active project state.`,
      commitResult: 'COMMITTED',
      timestamp: nowStr,
    });

    return {
      success: true,
      committedReport,
    };
  }
}
