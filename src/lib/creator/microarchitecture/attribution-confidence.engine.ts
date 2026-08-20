import {
  HardwareExecutionTrace,
  NormalizedTraceEvents,
} from "./microarchitecture.types";

export class AttributionConfidenceEngine {
  public static calculateConfidence(
    trace: HardwareExecutionTrace,
    norm: NormalizedTraceEvents,
    confounderCount: number = 0
  ): number {
    let score = 90;

    // Deduct for incomplete counter set
    if (norm.completenessRatio < 1.0) {
      score -= (1.0 - norm.completenessRatio) * 30;
    }

    // Deduct for confounders (e.g. driver or bios transitions)
    if (confounderCount > 0) {
      score -= Math.min(25, confounderCount * 8);
    }

    // Thermal throttling introduces measurement noise
    if (trace.observedTemperatureCelsius && trace.observedTemperatureCelsius > 90) {
      score -= 10;
    }

    // Power limit clipping introduces measurement noise
    if (trace.observedPowerWatts && trace.powerLimitWatts && trace.observedPowerWatts >= trace.powerLimitWatts) {
      score -= 5;
    }

    return Math.max(10, Math.min(99, Number(score.toFixed(1))));
  }
}
