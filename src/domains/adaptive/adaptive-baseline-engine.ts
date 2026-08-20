export interface BaselineValidationResult {
  metricName: string;
  baselineValue: number;
  sampleSize: number;
  isValid: boolean;
  reason: string;
}

export class AdaptiveBaselineEngine {
  static validateBaseline(metricName: string, baselineValue: number, sampleSize: number): BaselineValidationResult {
    const isValid = sampleSize >= 100;
    return {
      metricName,
      baselineValue,
      sampleSize,
      isValid,
      reason: isValid
        ? "Sample size sufficient for baseline comparison."
        : "Sample size too small (<100) to form authoritative baseline.",
    };
  }
}
