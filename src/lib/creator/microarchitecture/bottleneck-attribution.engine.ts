import crypto from "crypto";
import {
  HardwareExecutionTrace,
  NormalizedTraceEvents,
  StallDecompositionRecord,
  BottleneckAttributionRecord,
  BottleneckAttributionType,
  StallCategory,
} from "./microarchitecture.types";
import { AttributionConfidenceEngine } from "./attribution-confidence.engine";

export class BottleneckAttributionEngine {
  public static attributeBottleneck(
    trace: HardwareExecutionTrace,
    norm: NormalizedTraceEvents,
    stalls: StallDecompositionRecord[]
  ): BottleneckAttributionRecord {
    const supportingSignals: string[] = [];
    const contradictingSignals: string[] = [];

    let attributionType: BottleneckAttributionType = "UNACCOUNTED_BOTTLENECK";
    let primaryStallCategory: StallCategory = "UNKNOWN_BOUND";

    if (trace.observedTemperatureCelsius && trace.observedTemperatureCelsius > 90) {
      attributionType = "THERMAL_LIMITATION";
      primaryStallCategory = "THERMAL_BOUND";
      supportingSignals.push(`Observed temperature (${trace.observedTemperatureCelsius}°C) reached throttle envelope.`);
    } else if (norm.memoryStallRate > 25.0 || norm.l3CacheMissRate > 5.0) {
      attributionType = "MEMORY_BANDWIDTH_PRESSURE";
      primaryStallCategory = "MEMORY_BOUND";
      supportingSignals.push(`Memory stall rate (${norm.memoryStallRate}%) exceeds 25% threshold.`);
      supportingSignals.push(`L3 Cache Miss Rate: ${norm.l3CacheMissRate} MPKI.`);
      if (norm.frontendStallRate < 15.0) {
        contradictingSignals.push(`Frontend stalls remain low (${norm.frontendStallRate}%).`);
      }
    } else if (norm.l1DataCacheMissRate > 15.0 || norm.l2CacheMissRate > 8.0) {
      attributionType = "CACHE_MISS_PRESSURE";
      primaryStallCategory = "CACHE_BOUND";
      supportingSignals.push(`L1 Data Cache Miss Rate: ${norm.l1DataCacheMissRate} MPKI.`);
      supportingSignals.push(`L2 Cache Miss Rate: ${norm.l2CacheMissRate} MPKI.`);
    } else if (norm.branchMispredictionRate > 6.0) {
      attributionType = "BRANCH_MISPREDICTION_PRESSURE";
      primaryStallCategory = "BRANCH_BOUND";
      supportingSignals.push(`Branch misprediction rate (${norm.branchMispredictionRate} MPKI) is elevated.`);
    } else if (norm.frontendStallRate > 30.0) {
      attributionType = "FRONTEND_STARVATION";
      primaryStallCategory = "FRONTEND_BOUND";
      supportingSignals.push(`Frontend stall rate (${norm.frontendStallRate}%) is dominant bottleneck.`);
    } else if (norm.coreStallRate > 20.0) {
      attributionType = "EXECUTION_DEPENDENCY_PRESSURE";
      primaryStallCategory = "CORE_EXECUTION_BOUND";
      supportingSignals.push(`Core execution dependency stalls (${norm.coreStallRate}%).`);
    } else {
      attributionType = "MEMORY_BANDWIDTH_PRESSURE";
      primaryStallCategory = "MEMORY_BOUND";
      supportingSignals.push("Baseline execution profiles memory latency bound.");
    }

    const confidence = AttributionConfidenceEngine.calculateConfidence(trace, norm);

    const attributionId = `mcaa-${crypto
      .createHash("sha256")
      .update(`${trace.traceId}:${attributionType}`)
      .digest("hex")
      .slice(0, 16)}`;

    const summary = `Observed PMU execution trace signals are consistent with ${attributionType.replace(/_/g, " ")}.`;

    return {
      attributionId,
      traceId: trace.traceId,
      userId: trace.userId,
      researchRunId: trace.researchRunId,
      attributionType,
      primaryStallCategory,
      supportingSignals,
      contradictingSignals,
      confidence,
      evidenceStatus: "OBSERVED_TRACE_ATTRIBUTION",
      isCausallyEstablished: false, // Strict epistemic boundary
      summary,
      epistemicBoundary: "TRACE_OBSERVATION ≠ BOTTLENECK_ATTRIBUTION ≠ CAUSAL_EXPLANATION (isCausallyEstablished: false)",
      attributedAt: new Date().toISOString(),
    };
  }
}
