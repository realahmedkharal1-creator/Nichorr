import crypto from "crypto";
import {
  HardwareExecutionTrace,
  BottleneckAttributionRecord,
  CrossGenerationComparison,
  CrossGenerationClassification,
} from "./microarchitecture.types";

export class CrossGenerationEngine {
  public static compareTraces(
    traceA: HardwareExecutionTrace,
    attribA: BottleneckAttributionRecord,
    traceB: HardwareExecutionTrace,
    attribB: BottleneckAttributionRecord
  ): CrossGenerationComparison {
    const confounders: string[] = [];

    if (traceA.benchmarkSuite !== traceB.benchmarkSuite) {
      confounders.push(`Suite Mismatch: ${traceA.benchmarkSuite} vs ${traceB.benchmarkSuite}`);
    }
    if (traceA.resolution !== traceB.resolution) {
      confounders.push(`Resolution Mismatch: ${traceA.resolution} vs ${traceB.resolution}`);
    }
    if (traceA.driverVersion !== traceB.driverVersion) {
      confounders.push(`Driver Difference: ${traceA.driverVersion} vs ${traceB.driverVersion}`);
    }
    if (traceA.cpuStepping !== traceB.cpuStepping) {
      confounders.push(`Stepping Shift: ${traceA.cpuStepping} vs ${traceB.cpuStepping}`);
    }

    const perfA = traceA.rawCounters.instructions || 1;
    const perfB = traceB.rawCounters.instructions || 1;
    const performanceDeltaPercentage = Number((((perfB - perfA) / (perfA || 1)) * 100).toFixed(2));

    const powerDeltaWatts =
      traceA.observedPowerWatts && traceB.observedPowerWatts
        ? Number((traceB.observedPowerWatts - traceA.observedPowerWatts).toFixed(1))
        : undefined;

    let classification: CrossGenerationClassification = "ARCHITECTURAL_DIFFERENCE";

    if (confounders.some((c) => c.includes("Suite") || c.includes("Resolution"))) {
      classification = "NOT_COMPARABLE";
    } else if (confounders.length > 2) {
      classification = "MULTI_FACTOR_DIFFERENCE";
    } else if (traceA.cpuStepping !== traceB.cpuStepping && traceA.gpuModel === traceB.gpuModel) {
      classification = "STEPPING_DIFFERENCE";
    } else if (traceA.gpuArchitecture !== traceB.gpuArchitecture) {
      classification = "ARCHITECTURAL_DIFFERENCE";
    } else if (traceA.gpuModel !== traceB.gpuModel) {
      classification = "SILICON_DIFFERENCE";
    } else if (attribA.attributionType !== attribB.attributionType) {
      classification = "MEMORY_SUBSYSTEM_DIFFERENCE";
    }

    const comparisonId = `cgmc-${crypto
      .createHash("sha256")
      .update(`${traceA.traceId}:${traceB.traceId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      comparisonId,
      userId: traceA.userId,
      researchRunId: traceA.researchRunId,
      baselineTraceId: traceA.traceId,
      candidateTraceId: traceB.traceId,
      baselineSku: traceA.gpuModel,
      candidateSku: traceB.gpuModel,
      baselineStepping: traceA.cpuStepping,
      candidateStepping: traceB.cpuStepping,
      baselineAttribution: attribA.attributionType,
      candidateAttribution: attribB.attributionType,
      performanceDeltaPercentage,
      powerDeltaWatts,
      classification,
      confounders,
      isCausallyEstablished: false, // Strict non-causal guard
      notes: `Observed cross-generation bottleneck transition from ${attribA.attributionType} to ${attribB.attributionType}.`,
      comparedAt: new Date().toISOString(),
    };
  }
}
