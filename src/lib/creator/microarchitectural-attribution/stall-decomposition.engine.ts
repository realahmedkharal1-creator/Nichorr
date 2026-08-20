import crypto from "crypto";
import {
  MicroarchitecturalTrace,
  TraceNormalizationRecord,
  StallDecompositionEntry,
  MicroarchitecturalCategory,
} from "./microarchitectural-attribution.types";

export class StallDecompositionEngine {
  public static decomposeStalls(
    trace: MicroarchitecturalTrace,
    norm: TraceNormalizationRecord
  ): StallDecompositionEntry[] {
    const totalStall = Math.max(1, norm.frontendStallPercentage + norm.backendStallPercentage);

    const categories: {
      category: MicroarchitecturalCategory;
      subCategory?: string;
      observedValue: number;
      unit: string;
      evidenceBasis: string;
    }[] = [
      {
        category: "FRONTEND",
        subCategory: "instruction_fetch_stall",
        observedValue: norm.frontendStallPercentage,
        unit: "% of cycles",
        evidenceBasis: "Frontend stall cycle counter",
      },
      {
        category: "MEMORY_BANDWIDTH",
        subCategory: "memory_bandwidth",
        observedValue: norm.memoryStallPercentage,
        unit: "% of cycles",
        evidenceBasis: "Memory controller and memory stall counters",
      },
      {
        category: "CORE_EXECUTION",
        subCategory: "execution_unit_utilization",
        observedValue: norm.coreStallPercentage,
        unit: "% of cycles",
        evidenceBasis: "Core execution dependency counter",
      },
      {
        category: "CACHE_L3",
        subCategory: "L3_miss",
        observedValue: norm.l3CacheMissRateMPKI,
        unit: "MPKI",
        evidenceBasis: "LLC / L3 cache miss counter",
      },
      {
        category: "CACHE_L1",
        subCategory: "L1_miss",
        observedValue: norm.l1DataCacheMissRateMPKI,
        unit: "MPKI",
        evidenceBasis: "L1 Data cache miss counter",
      },
      {
        category: "BRANCH_PREDICTION",
        subCategory: "branch_misprediction",
        observedValue: norm.branchMispredictionRateMPKI,
        unit: "MPKI",
        evidenceBasis: "Branch misprediction event counter",
      },
    ];

    if (trace.observedTemperatureCelsius && trace.observedTemperatureCelsius > 85) {
      categories.push({
        category: "THERMAL_LIMITATION",
        subCategory: "thermal_throttle",
        observedValue: trace.observedTemperatureCelsius,
        unit: "°C",
        evidenceBasis: "Physical junction temperature sensor",
      });
    }

    if (trace.observedPowerWatts && trace.powerLimitWatts && trace.observedPowerWatts >= trace.powerLimitWatts * 0.98) {
      categories.push({
        category: "POWER_LIMITATION",
        subCategory: "power_limit",
        observedValue: trace.observedPowerWatts,
        unit: "Watts",
        evidenceBasis: "ASIC telemetry power rail sensor",
      });
    }

    return categories.map((cat) => {
      const normalizedPercentage = Number(((cat.observedValue / totalStall) * 100).toFixed(1));
      const entryId = `sde-${crypto
        .createHash("sha256")
        .update(`${trace.traceId}:${cat.category}:${cat.subCategory || ""}`)
        .digest("hex")
        .slice(0, 16)}`;

      return {
        entryId,
        traceId: trace.traceId,
        category: cat.category,
        subCategory: cat.subCategory,
        observedValue: cat.observedValue,
        normalizedPercentage: Math.min(100, Math.max(0, normalizedPercentage)),
        unit: cat.unit,
        evidenceBasis: cat.evidenceBasis,
        confidence: "HIGH",
        methodologyFingerprint: trace.methodologyFingerprint,
      };
    });
  }
}
