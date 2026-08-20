import { TraceNormalizationRecord } from "./microarchitectural-attribution.types";

export class BackendAttributionEngine {
  public static evaluate(norm: TraceNormalizationRecord): {
    isTriggered: boolean;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    const isTriggered = norm.coreStallPercentage > 20.0;
    if (isTriggered) {
      supporting.push(`Core execution stall rate (${norm.coreStallPercentage}%) indicates execution port/dependency pressure.`);
    } else {
      contradicting.push(`Core execution stalls within baseline envelope (${norm.coreStallPercentage}%).`);
    }

    return { isTriggered, supporting, contradicting };
  }
}
