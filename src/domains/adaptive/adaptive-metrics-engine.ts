export interface EvaluatedSystemMetric {
  metricName: string;
  metricCategory: "RETRIEVAL" | "RESEARCH" | "AGENT" | "EXECUTION" | "COST";
  value: number;
  unit: string;
  baselineValue: number;
  isDegraded: boolean;
}

export class AdaptiveMetricsEngine {
  static evaluateMetric(
    metricName: string,
    metricCategory: "RETRIEVAL" | "RESEARCH" | "AGENT" | "EXECUTION" | "COST",
    value: number,
    baselineValue: number
  ): EvaluatedSystemMetric {
    const isLowerBetter = metricName.includes("latency") || metricName.includes("error") || metricName.includes("cost");
    const isDegraded = isLowerBetter ? value > baselineValue * 1.1 : value < baselineValue * 0.95;

    return {
      metricName,
      metricCategory,
      value,
      unit: isLowerBetter ? "ms" : "ratio",
      baselineValue,
      isDegraded,
    };
  }
}
