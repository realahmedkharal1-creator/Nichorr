import { TraceNormalizationRecord } from "./microarchitectural-attribution.types";

export class BranchAttributionEngine {
  public static evaluate(norm: TraceNormalizationRecord): {
    isTriggered: boolean;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    const isTriggered = norm.branchMispredictionRateMPKI > 5.0;
    if (isTriggered) {
      supporting.push(`Branch misprediction rate (${norm.branchMispredictionRateMPKI} MPKI) exceeds 5.0 MPKI threshold.`);
    } else {
      contradicting.push(`Branch misprediction rate (${norm.branchMispredictionRateMPKI} MPKI) remains low.`);
    }

    return { isTriggered, supporting, contradicting };
  }
}
