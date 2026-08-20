import crypto from "crypto";
import { SiliconOutlierReport, OutlierStatus } from "./testbench-cluster.types";

export class ClusterOutlierEngine {
  public static detectOutliers(
    clusterId: string,
    nodeId: string,
    benchmarkSuite: string,
    runs: { runIndex: number; score: number; metricUnit: string; isWarmup?: boolean; discardedReason?: string }[]
  ): SiliconOutlierReport[] {
    const measurementRuns = runs.filter((r) => !r.isWarmup);
    if (measurementRuns.length === 0) return [];

    const scores = measurementRuns.map((r) => r.score);
    const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;

    const reports: SiliconOutlierReport[] = [];

    for (const run of runs) {
      if (run.isWarmup) continue;

      const deviation = mean > 0 ? Number((((run.score - mean) / mean) * 100).toFixed(2)) : 0;
      const absDeviation = Math.abs(deviation);

      let outlierStatus: OutlierStatus = "NORMAL";
      let reason = "Run is within normal measurement variance (< 3%).";
      let recommendation = "Include in consolidated benchmark calculations.";
      let confidenceScore = 0.95;

      if (run.discardedReason === "THERMAL_THROTTLING") {
        outlierStatus = "THERMAL_DISCARDED";
        reason = "Run hit silicon thermal junction ceiling (> 90°C), triggering clock throttle.";
        recommendation = "Discard from official average; verify testbench cooling loop.";
        confidenceScore = 0.98;
      } else if (run.discardedReason === "SAFETY_ABORT") {
        outlierStatus = "SAFETY_DISCARDED";
        reason = "Run was manually aborted by safety interlock.";
        recommendation = "Do not include in benchmark score.";
        confidenceScore = 1.0;
      } else if (absDeviation > 12) {
        outlierStatus = "HIGH_DEVIATION";
        reason = `Extreme score divergence (${absDeviation}% from node mean). Potential background process or power spike.`;
        recommendation = "Flag for creator review and rerun benchmark pass.";
        confidenceScore = 0.88;
      } else if (absDeviation > 5) {
        outlierStatus = "POTENTIAL_OUTLIER";
        reason = `Moderate score deviation (${absDeviation}% from node mean).`;
        recommendation = "Review repeated run variance.";
        confidenceScore = 0.75;
      }

      reports.push({
        outlierId: `outlier-${crypto.randomBytes(4).toString("hex")}`,
        clusterId,
        nodeId,
        runIndex: run.runIndex,
        benchmarkSuite,
        rawScore: run.score,
        normalizedScore: mean > 0 ? Number(((run.score / mean) * 100).toFixed(1)) : 100,
        metricUnit: run.metricUnit,
        deviationPercentage: deviation,
        outlierStatus,
        reason,
        detectionMethod: "Mean Deviation & Thermal Ceiling Clamping Filter",
        confidenceScore,
        recommendation,
        preservedRawMeasurement: run.score, // Absolute preservation
        detectedAt: new Date().toISOString(),
      });
    }

    return reports;
  }
}
