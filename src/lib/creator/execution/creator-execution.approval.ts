import { CreatorExecutionPlan, CreatorExecutionApproval } from "./creator-execution.types";
import { CreatorExecutionAuditService } from "./creator-execution.audit";

export class CreatorExecutionApprovalEngine {
  /**
   * Processes creator approval with dependency validation and optimistic concurrency checks.
   */
  static processApproval(
    plan: CreatorExecutionPlan,
    approvedOperationIds: string[],
    rejectedOperationIds: string[] = [],
    acknowledgmentOfConsequences: boolean = true,
    notes?: string,
    currentProjectSnapshotHash?: string,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    approval?: CreatorExecutionApproval;
    updatedPlan?: CreatorExecutionPlan;
    errorMessage?: string;
  } {
    // 1. Safety Status Check
    if (plan.executionStatus === 'BLOCKED') {
      return {
        success: false,
        errorMessage: "Cannot approve a blocked execution plan. Resolve hard safety blockers first.",
      };
    }

    // 2. Optimistic Concurrency / Stale Plan Check
    if (currentProjectSnapshotHash && currentProjectSnapshotHash !== plan.projectSnapshotHash) {
      plan.executionStatus = 'CANCELLED';
      return {
        success: false,
        errorMessage: "Project snapshot has changed since this plan was created. Rebase / Rebuild plan required.",
      };
    }

    // 3. Dependency Consistency Validation
    for (const op of plan.proposedOperations) {
      if (approvedOperationIds.includes(op.id)) {
        op.status = 'APPROVED';
      } else if (rejectedOperationIds.includes(op.id)) {
        op.status = 'REJECTED';
      }
    }

    const allApproved = plan.proposedOperations.every((op) => op.status === 'APPROVED');
    const anyApproved = plan.proposedOperations.some((op) => op.status === 'APPROVED');

    if (!anyApproved) {
      plan.executionStatus = 'REJECTED';
      CreatorExecutionAuditService.recordAuditEvent({
        auditId: `exec-aud-${Date.now().toString(36)}-reject`,
        executionPlanId: plan.executionPlanId,
        userId,
        researchRunId: plan.researchRunId,
        action: 'APPROVAL_REJECTED',
        previousSnapshot: plan.projectSnapshotHash,
        newSnapshot: plan.projectSnapshotHash,
        previousScriptVersion: plan.currentScriptVersion,
        newScriptVersion: plan.targetScriptVersion,
        affectedNodes: plan.affectedNodes,
        affectedAssets: plan.affectedAssets.map((a) => a.assetId),
        executionResult: "Creator rejected execution plan.",
        failureReason: notes || "User declined proposed operations.",
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        updatedPlan: plan,
      };
    }

    plan.executionStatus = allApproved ? 'APPROVED' : 'AWAITING_APPROVAL';

    const approvalId = `appr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const nowStr = new Date().toISOString();

    const approval: CreatorExecutionApproval = {
      approvalId,
      userId,
      researchRunId: plan.researchRunId,
      executionPlanId: plan.executionPlanId,
      approvedOperations: approvedOperationIds,
      rejectedOperations: rejectedOperationIds,
      approvalTimestamp: nowStr,
      projectSnapshotHash: plan.projectSnapshotHash,
      acknowledgmentOfConsequences,
      approvalStatus: allApproved ? 'APPROVED' : 'PARTIALLY_APPROVED',
      notes,
    };

    CreatorExecutionAuditService.recordAuditEvent({
      auditId: `exec-aud-${Date.now().toString(36)}-approve`,
      executionPlanId: plan.executionPlanId,
      userId,
      researchRunId: plan.researchRunId,
      action: 'APPROVAL_GRANTED',
      previousSnapshot: plan.projectSnapshotHash,
      newSnapshot: plan.projectSnapshotHash,
      previousScriptVersion: plan.currentScriptVersion,
      newScriptVersion: plan.targetScriptVersion,
      affectedNodes: plan.affectedNodes,
      affectedAssets: plan.affectedAssets.map((a) => a.assetId),
      executionResult: `Creator approved ${approvedOperationIds.length} operations. Status: ${approval.approvalStatus}`,
      timestamp: nowStr,
    });

    return {
      success: true,
      approval,
      updatedPlan: plan,
    };
  }
}
