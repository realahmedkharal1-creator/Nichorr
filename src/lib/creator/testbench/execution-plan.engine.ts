import crypto from "crypto";
import { BenchmarkExecutionPlan, TestbenchDefinition } from "./testbench.types";

export class ExecutionPlanEngine {
  /**
   * Generates a deterministic benchmark execution plan.
   */
  static createPlan(
    testbench: TestbenchDefinition,
    overrides: Partial<BenchmarkExecutionPlan> = {}
  ): BenchmarkExecutionPlan {
    const planId = overrides.planId || `bep-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const planData: Omit<BenchmarkExecutionPlan, "executionPlanHash"> = {
      planId,
      userId: testbench.userId,
      researchRunId: testbench.researchRunId,
      testbenchId: testbench.testbenchId,
      benchmarkSuite: overrides.benchmarkSuite || testbench.benchmarkSuite,
      benchmarkVersion: overrides.benchmarkVersion || testbench.benchmarkVersion,
      applicationVersion: overrides.applicationVersion || testbench.applicationVersion,
      hardware: overrides.hardware || testbench.hardwareTarget,
      driver: overrides.driver || testbench.driver,
      bios: overrides.bios || testbench.bios,
      firmware: overrides.firmware || testbench.firmware,
      os: overrides.os || testbench.operatingSystem,
      resolution: overrides.resolution || "3840x2160",
      preset: overrides.preset || "Ray Tracing Overdrive",
      renderingApi: overrides.renderingApi || "DirectX 12",
      upscaling: overrides.upscaling || "DLSS Quality",
      frameGeneration: overrides.frameGeneration ?? true,
      rayTracing: overrides.rayTracing ?? true,
      powerLimitWatts: overrides.powerLimitWatts || 500,
      coolingMode: overrides.coolingMode || "Performance",
      runCount: overrides.runCount || 3,
      warmupRuns: overrides.warmupRuns || 1,
      measurementIntervalMs: overrides.measurementIntervalMs || 100,
      telemetryChannels: overrides.telemetryChannels || [
        "CPU_TEMP",
        "GPU_TEMP",
        "GPU_POWER",
        "FRAME_TIME",
      ],
      requiredSensors: overrides.requiredSensors || [
        "GPU Temperature Sensor",
        "GPU Power Sensor",
      ],
      expectedOutputs: overrides.expectedOutputs || [
        "Average FPS",
        "1% Low FPS",
        "Average Power Draw (W)",
      ],
      methodologyNotes:
        overrides.methodologyNotes ||
        "Deterministic 3-pass test execution with 1 initial discardable warmup pass.",
      createdAt: overrides.createdAt || now,
    };

    // Calculate deterministic hash excluding volatile timestamps
    const hashPayload = {
      testbenchId: planData.testbenchId,
      suite: planData.benchmarkSuite,
      version: planData.benchmarkVersion,
      hardware: planData.hardware,
      driver: planData.driver,
      res: planData.resolution,
      preset: planData.preset,
      api: planData.renderingApi,
      powerLimit: planData.powerLimitWatts,
      runCount: planData.runCount,
      warmup: planData.warmupRuns,
    };

    const executionPlanHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(hashPayload))
      .digest("hex");

    return {
      ...planData,
      executionPlanHash,
    };
  }
}
