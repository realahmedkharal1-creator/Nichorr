export interface DetectedMetricAnomaly {
  metricName: string;
  observedValue: number;
  expectedValue: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isAnomaly: boolean;
}

export class AdaptiveAnomalyEngine {
  static detectAnomaly(metricName: string, observedValue: number, expectedValue: number): DetectedMetricAnomaly {
    const deviation = Math.abs(observedValue - expectedValue) / expectedValue;
    const isAnomaly = deviation > 0.05;

    let severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (deviation > 0.25) severity = "CRITICAL";
    else if (deviation > 0.15) severity = "HIGH";
    else if (deviation > 0.08) severity = "MEDIUM";

    return {
      metricName,
      observedValue,
      expectedValue,
      severity,
      isAnomaly,
    };
  }
}
