import {
  CalibrationResult,
  CalibrationResultOutcome,
  ResearchValidationTask,
} from "./research-calibration.types";

export class CalibrationResultEngine {
  /**
   * Synthesizes the final calibration result after formal research validation has executed.
   */
  static synthesizeResult(
    task: ResearchValidationTask,
    outcome: CalibrationResultOutcome,
    findings: string,
    evidenceContext: {
      evidenceSnapshotHashBefore: string;
      evidenceSnapshotHashAfter: string;
      reconciledClaimId?: string;
      reconciledEvidenceKey?: string;
    }
  ): CalibrationResult {
    const resultId = `cal-res-${task.taskId}-${Date.now().toString(36)}`;
    const requiresPlan = outcome === "CLAIM_REVALIDATED" || outcome === "CLAIM_REFRAMED" || outcome === "METHODOLOGY_UPDATED" || outcome === "EVIDENCE_REFRESHED";

    return {
      resultId,
      taskId: task.taskId,
      queueItemId: task.queueItemId,
      researchRunId: task.researchRunId,
      outcome,
      findings,
      evidenceSnapshotHashBefore: evidenceContext.evidenceSnapshotHashBefore,
      evidenceSnapshotHashAfter: evidenceContext.evidenceSnapshotHashAfter,
      reconciledClaimId: evidenceContext.reconciledClaimId || task.targetClaimId,
      reconciledEvidenceKey: evidenceContext.reconciledEvidenceKey || task.targetEvidenceKey,
      requiredSafeExecutionPlan: requiresPlan,
      completedAt: new Date().toISOString(),
    };
  }
}
