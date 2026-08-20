import { TraceNormalizationRecord } from "./microarchitectural-attribution.types";

export class FrontendAttributionEngine {
  public static evaluate(norm: TraceNormalizationRecord): {
    isTriggered: boolean;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    const isTriggered = norm.frontendStallPercentage > 28.0;
    if (isTriggered) {
      supporting.push(`Frontend stall rate (${norm.frontendStallPercentage}%) exceeds 28% threshold.`);
    } else {
      contradicting.push(`Frontend stall rate remains nominal (${norm.frontendStallPercentage}%).`);
    }

    return { isTriggered, supporting, contradicting };
  }
}
