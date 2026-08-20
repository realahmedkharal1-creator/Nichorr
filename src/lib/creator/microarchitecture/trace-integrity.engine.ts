import { HardwareExecutionTrace } from "./microarchitecture.types";

export class TraceIntegrityEngine {
  public static validateTrace(trace: HardwareExecutionTrace): {
    isValid: boolean;
    issues: string[];
    completenessRatio: number;
  } {
    const issues: string[] = [];

    if (trace.sourceState === "TRACE_UNAVAILABLE" || trace.sourceState === "UNAVAILABLE") {
      issues.push("Hardware execution trace data is unavailable on target physical node.");
    }

    if (trace.sourceState === "INVALID") {
      issues.push("Trace marked as corrupted or invalid at ingestion.");
    }

    const counterKeys = Object.keys(trace.rawCounters || {});
    if (counterKeys.length === 0 && trace.sourceState === "AVAILABLE") {
      issues.push("Trace contains zero hardware counter events.");
    }

    // Check for negative counter anomalies
    for (const [k, v] of Object.entries(trace.rawCounters || {})) {
      if (typeof v !== "number" || isNaN(v) || v < 0) {
        issues.push(`Malformed PMU counter value for ${k}: ${v}`);
      }
    }

    const expectedCounters = [
      "cycles",
      "instructions",
      "frontend_stalls",
      "backend_stalls",
      "l1_cache_misses",
      "l2_cache_misses",
      "l3_cache_misses",
      "branch_mispredictions",
    ];

    const presentExpected = expectedCounters.filter((c) => counterKeys.includes(c)).length;
    const completenessRatio = counterKeys.length > 0 ? presentExpected / expectedCounters.length : 0;

    if (completenessRatio < 0.4 && trace.sourceState === "AVAILABLE") {
      issues.push("Insufficient PMU counter coverage (< 40% of baseline microarchitectural events present).");
    }

    const isValid = issues.length === 0;

    return {
      isValid,
      issues,
      completenessRatio,
    };
  }
}
