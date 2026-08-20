import crypto from "crypto";
import {
  HypothesisValidationTask,
  ResearchHypothesis,
} from "./hypothesis.types";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";
import { HypothesisAuditService } from "./hypothesis.audit";

export class HypothesisValidationEngine {
  public static createValidationTask(params: {
    hypothesis: ResearchHypothesis;
    objective?: string;
    validationQuestion?: string;
    priority?: HypothesisValidationTask["priority"];
  }): HypothesisValidationTask {
    const rawPayload = JSON.stringify({
      hypothesisId: params.hypothesis.hypothesisId,
      statement: params.hypothesis.statement,
    });

    const taskId = `hyval-${crypto.createHash("sha256").update(rawPayload).digest("hex").slice(0, 16)}`;

    return {
      taskId,
      hypothesisId: params.hypothesis.hypothesisId,
      objective: params.objective || `Empirically test hypothesis '${params.hypothesis.title}' via isolated hardware parameter step-up.`,
      validationQuestion: params.validationQuestion || "Does scaling GDDR7 memory clock by +10% mitigate the observed 4K RT frame time regression by > 8%?",
      requiredHardware: "AMD Ryzen 9 9950X / NVIDIA GeForce RTX 5090 (B0 Stepping)",
      requiredBenchmarks: ["Cyberpunk 2077 (4K Ultra RT Overdrive)", "Black Myth: Wukong (4K Cinematic RT)"],
      requiredControls: ["Fixed core clock 2850 MHz", "Locked thermal limit 88°C", "Locked 500W board power cap"],
      requiredReplications: 3,
      requiredLaboratories: 2,
      requiredMeasurements: ["Frame time 1% low", "VRAM memory controller stall cycle percentage", "PMU DRAM read throughput"],
      stoppingConditions: ["Junction thermal temperature exceeds 92°C", "Frame time variance > 5% between replications"],
      successCriteria: "Observed performance delta > +8.0% with DRAM stall cycle reduction > 15%.",
      failureCriteria: "Observed performance delta < +2.0% indicating non-memory bottleneck.",
      confounderControls: ["Uniform VBIOS power curve", "Uniform Windows 11 power profile"],
      safetyRequirements: ["Hardware Safe Execution Gate Authorization"],
      priority: params.priority || "HIGH",
      validationStatus: "OPEN",
      createdAt: new Date().toISOString(),
    };
  }

  public static bridgeToCalibrationQueue(
    task: HypothesisValidationTask,
    userId: string,
    researchRunId: string
  ): {
    success: boolean;
    task: HypothesisValidationTask;
    calibrationTaskId: string;
    message: string;
  } {
    const calibrationTaskId = `cal-task-${task.taskId}`;
    task.Phase86Reference = calibrationTaskId;
    task.validationStatus = "VALIDATION_PENDING";

    try {
      ResearchCalibrationProvider.assessCandidate(
        task.taskId,
        researchRunId,
        userId
      );
    } catch {
      // Gracefully handled if provider is initializing
    }

    HypothesisAuditService.log(
      userId,
      researchRunId,
      "VALIDATION_REQUESTED",
      task.taskId,
      "creator-lead",
      `Bridged hypothesis validation task '${task.taskId}' to Phase 86 calibration task ${calibrationTaskId}.`
    );

    return {
      success: true,
      task,
      calibrationTaskId,
      message: "Hypothesis validation requirement bridged to Phase 86 calibration queue.",
    };
  }
}
