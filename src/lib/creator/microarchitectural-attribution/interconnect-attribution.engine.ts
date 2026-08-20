import { TraceNormalizationRecord } from "./microarchitectural-attribution.types";

export class InterconnectAttributionEngine {
  public static evaluate(norm: TraceNormalizationRecord): {
    isTriggered: boolean;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    const isTriggered = norm.pcieBandwidthUtilization !== undefined && norm.pcieBandwidthUtilization > 80;
    if (isTriggered) {
      supporting.push(`PCIe / Interconnect Bandwidth utilization (${norm.pcieBandwidthUtilization}%) saturated.`);
    } else {
      contradicting.push(`Interconnect bandwidth metrics indicate no bus bottleneck.`);
    }

    return { isTriggered, supporting, contradicting };
  }
}
