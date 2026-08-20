import crypto from "crypto";
import {
  HardwareExecutionTrace,
  BottleneckAttributionRecord,
  PhysicalReconciliationRecord,
  PhysicalReconciliationStatus,
} from "./microarchitecture.types";

export class PhysicalReconciliationEngine {
  public static reconcileTraceWithPhysicalScore(
    trace: HardwareExecutionTrace,
    attrib: BottleneckAttributionRecord,
    physicalScore: number,
    metricUnit: string = "fps"
  ): PhysicalReconciliationRecord {
    const confounders: string[] = [];
    let reconciliationStatus: PhysicalReconciliationStatus = "CONSISTENT_WITH_PHYSICAL_EVIDENCE";
    let divergenceExplanation: string | undefined = undefined;

    if (attrib.attributionType === "THERMAL_LIMITATION" && trace.observedTemperatureCelsius && trace.observedTemperatureCelsius < 75) {
      reconciliationStatus = "DIVERGENT";
      divergenceExplanation = "Trace suggests thermal limitation, but physical testbench temperature remained well within safe envelope.";
    } else if (attrib.attributionType === "MEMORY_BANDWIDTH_PRESSURE" && physicalScore > 120) {
      reconciliationStatus = "PARTIALLY_CONSISTENT";
      divergenceExplanation = "High frame rate observed despite high memory stall cycles; memory pressure may be partially hidden by compute latency.";
    }

    const reconciliationId = `mprc-${crypto
      .createHash("sha256")
      .update(`${trace.traceId}:${physicalScore}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      reconciliationId,
      traceId: trace.traceId,
      benchmarkScore: physicalScore,
      metricUnit,
      observedPowerWatts: trace.observedPowerWatts,
      observedTemperatureCelsius: trace.observedTemperatureCelsius,
      attributedBottleneck: attrib.attributionType,
      reconciliationStatus,
      divergenceExplanation,
      confounders,
      reconciledAt: new Date().toISOString(),
    };
  }
}
