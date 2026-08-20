import { CalibrationQueueItem, ResearchValidationTask } from "./research-calibration.types";

export class ResearchValidationEngine {
  /**
   * Creates a formal research validation task from a calibration queue item.
   * Hard Rule: Does not immediately mutate claims or evidence; routes to independent research evaluation.
   */
  static createValidationTask(
    queueItem: CalibrationQueueItem,
    options: {
      researchHypothesis?: string;
      validationScope?: string;
    } = {}
  ): ResearchValidationTask {
    const taskId = `rvt-${queueItem.queueItemId}-${Date.now().toString(36)}`;
    const hypothesis = options.researchHypothesis || `Investigate calibration candidate: ${queueItem.candidate.title}`;
    const scope = options.validationScope || `Evaluate OEM lab evidence and claim robustness for ${queueItem.candidate.affectedClaimId || "target claim"}`;

    return {
      taskId,
      queueItemId: queueItem.queueItemId,
      researchRunId: queueItem.candidate.researchRunId,
      targetClaimId: queueItem.candidate.affectedClaimId,
      targetEvidenceKey: queueItem.candidate.affectedBenchmarkId,
      researchHypothesis: hypothesis,
      validationScope: scope,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Simulates/executes research task validation lifecycle transition without silent mutations.
   */
  static executeValidationTask(task: ResearchValidationTask): ResearchValidationTask {
    return {
      ...task,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    };
  }
}
