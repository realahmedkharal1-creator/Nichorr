export interface MeasurementResult {
  actionId: string;
  metricName: string;
  baseline: number;
  observed: number;
  deltaPercentage: number;
  status: "ACHIEVED" | "MISSED" | "INCONCLUSIVE";
}

export class OutcomeMeasurementEngine {
  static measureOutcome(actionId: string, baseline: number, observed: number, target: number): MeasurementResult {
    const deltaPercentage = ((observed - baseline) / baseline) * 100;
    const achieved = observed >= target;

    return {
      actionId,
      metricName: "Target Metric",
      baseline,
      observed,
      deltaPercentage,
      status: achieved ? "ACHIEVED" : "MISSED",
    };
  }
}
