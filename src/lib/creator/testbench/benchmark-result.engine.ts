import { BenchmarkRunResult } from "./testbench.types";

export class BenchmarkResultEngine {
  /**
   * Consolidates multiple valid benchmark runs into a final score, variance, and statistics.
   * Discarded runs are never silently erased; their reasons and raw measurements are preserved.
   */
  static consolidateRuns(runs: BenchmarkRunResult[]): {
    consolidatedScore: number;
    validRunCount: number;
    discardedRunCount: number;
    variancePercentage: number;
    standardDeviation: number;
  } {
    const validRuns = runs.filter((r) => !r.isWarmup && r.status === "VALID");
    const discardedRuns = runs.filter((r) => r.status === "DISCARDED" || r.status === "FAILED");

    if (validRuns.length === 0) {
      return {
        consolidatedScore: 0,
        validRunCount: 0,
        discardedRunCount: discardedRuns.length,
        variancePercentage: 0,
        standardDeviation: 0,
      };
    }

    const scores = validRuns.map((r) => r.rawScore);
    const sum = scores.reduce((acc, val) => acc + val, 0);
    const mean = sum / scores.length;

    // Variance & Standard Deviation
    const squareDiffs = scores.map((val) => Math.pow(val - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / scores.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    const variancePct = mean > 0 ? (stdDev / mean) * 100 : 0;

    return {
      consolidatedScore: Number(mean.toFixed(2)),
      validRunCount: validRuns.length,
      discardedRunCount: discardedRuns.length,
      variancePercentage: Number(variancePct.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
    };
  }

  /**
   * Normalizes raw performance score based on standard reference baselines without overwriting raw values.
   */
  static normalizeScore(rawScore: number, baselineScore: number): number {
    if (baselineScore <= 0) return 100;
    return Number(((rawScore / baselineScore) * 100).toFixed(1));
  }
}
