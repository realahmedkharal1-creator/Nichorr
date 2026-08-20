import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorExecutionPlan, CreatorStagedExecution } from "./creator-execution.types";
import { CreatorExecutionAuditService } from "./creator-execution.audit";

export class CreatorExecutionRollbackEngine {
  /**
   * Safely rolls back a staged or uncommitted execution without destroying historical versions or audit history.
   */
  static rollbackExecution(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    plan: CreatorExecutionPlan,
    staged?: CreatorStagedExecution,
    reason: string = "Creator initiated rollback",
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    restoredReport: CreatorStudioReport;
    message: string;
  } {
    const previousVersion = plan.rollbackMetadata?.previousScriptVersion || plan.currentScriptVersion || 1;
    const nowStr = new Date().toISOString();

    if (staged) {
      staged.status = 'ROLLED_BACK';
    }
    plan.executionStatus = 'ROLLED_BACK';

    const restoredReport: CreatorStudioReport = {
      ...activeReport,
      scriptVersion: previousVersion,
    };

    CreatorExecutionAuditService.recordAuditEvent({
      auditId: `exec-aud-${Date.now().toString(36)}-rollback`,
      executionPlanId: plan.executionPlanId,
      userId,
      researchRunId: session.id,
      action: 'ROLLBACK_EXECUTED',
      previousSnapshot: staged ? staged.stagedProjectSnapshot.snapshotHash : plan.projectSnapshotHash,
      newSnapshot: plan.rollbackMetadata?.previousProjectSnapshotHash || plan.projectSnapshotHash,
      previousScriptVersion: staged ? staged.stagedScriptVersion : plan.targetScriptVersion,
      newScriptVersion: previousVersion,
      affectedNodes: plan.affectedNodes,
      affectedAssets: plan.affectedAssets.map((a) => a.assetId),
      executionResult: `Rollback completed. Restored active reference to Script Version ${previousVersion}. Historical versions remain immutable.`,
      rollbackResult: 'ROLLED_BACK',
      failureReason: reason,
      timestamp: nowStr,
    });

    return {
      success: true,
      restoredReport,
      message: `Rollback completed. Restored active project to Script Version ${previousVersion}.`,
    };
  }
}
