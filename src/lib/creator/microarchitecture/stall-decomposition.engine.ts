import crypto from "crypto";
import {
  HardwareExecutionTrace,
  NormalizedTraceEvents,
  StallDecompositionRecord,
  StallCategory,
} from "./microarchitecture.types";

export class StallDecompositionEngine {
  public static decomposeStalls(
    trace: HardwareExecutionTrace,
    norm: NormalizedTraceEvents
  ): StallDecompositionRecord[] {
    const totalStallPercentage = Math.max(1, norm.frontendStallRate + norm.backendStallRate);

    const categories: {
      category: StallCategory;
      observedValue: number;
      unit: string;
      confidence: number;
    }[] = [
      {
        category: "FRONTEND_BOUND",
        observedValue: norm.frontendStallRate,
        unit: "% of cycles",
        confidence: 90,
      },
      {
        category: "MEMORY_BOUND",
        observedValue: norm.memoryStallRate,
        unit: "% of cycles",
        confidence: 92,
      },
      {
        category: "CORE_EXECUTION_BOUND",
        observedValue: norm.coreStallRate,
        unit: "% of cycles",
        confidence: 88,
      },
      {
        category: "CACHE_BOUND",
        observedValue: norm.l3CacheMissRate,
        unit: "MPKI (Misses per 1K Instructions)",
        confidence: 85,
      },
      {
        category: "BRANCH_BOUND",
        observedValue: norm.branchMispredictionRate,
        unit: "MPKI",
        confidence: 89,
      },
    ];

    if (trace.observedTemperatureCelsius && trace.observedTemperatureCelsius > 85) {
      categories.push({
        category: "THERMAL_BOUND",
        observedValue: trace.observedTemperatureCelsius,
        unit: "°C",
        confidence: 95,
      });
    }

    if (trace.observedPowerWatts && trace.powerLimitWatts && trace.observedPowerWatts >= trace.powerLimitWatts * 0.98) {
      categories.push({
        category: "POWER_BOUND",
        observedValue: trace.observedPowerWatts,
        unit: "Watts",
        confidence: 94,
      });
    }

    return categories.map((cat) => {
      const normalizedValue = Number(((cat.observedValue / totalStallPercentage) * 100).toFixed(1));
      const decompositionId = `mdec-${crypto
        .createHash("sha256")
        .update(`${trace.traceId}:${cat.category}`)
        .digest("hex")
        .slice(0, 16)}`;

      return {
        decompositionId,
        traceId: trace.traceId,
        category: cat.category,
        observedValue: cat.observedValue,
        normalizedValue: Math.min(100, Math.max(0, normalizedValue)),
        unit: cat.unit,
        confidence: cat.confidence,
        evidenceStatus: "OBSERVED",
        methodologyFingerprint: trace.methodologyFingerprint,
      };
    });
  }
}
