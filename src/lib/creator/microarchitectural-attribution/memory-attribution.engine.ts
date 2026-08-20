import { TraceNormalizationRecord } from "./microarchitectural-attribution.types";

export class MemoryAttributionEngine {
  public static evaluate(norm: TraceNormalizationRecord): {
    isTriggered: boolean;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    const isTriggered =
      norm.memoryStallPercentage > 25.0 ||
      Boolean(norm.gpuMemoryBandwidthUtilization && norm.gpuMemoryBandwidthUtilization > 85);
    if (isTriggered) {
      if (norm.memoryStallPercentage > 25.0) {
        supporting.push(`Memory stall cycles (${norm.memoryStallPercentage}%) exceed 25% threshold.`);
      }
      if (norm.gpuMemoryBandwidthUtilization && norm.gpuMemoryBandwidthUtilization > 85) {
        supporting.push(`GPU Memory Bandwidth Utilization (${norm.gpuMemoryBandwidthUtilization}%) saturated.`);
      }
    } else {
      contradicting.push(`Memory stall rate (${norm.memoryStallPercentage}%) is within expected non-saturating bounds.`);
    }

    return { isTriggered, supporting, contradicting };
  }
}
