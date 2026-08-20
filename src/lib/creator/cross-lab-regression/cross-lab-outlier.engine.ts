import crypto from "crypto";
import {
  NormalizedLaboratoryObservation,
  CrossLabOutlierReport,
  CrossLabOutlierStatus,
} from "./cross-lab-regression.types";

export class CrossLabOutlierEngine {
  public static evaluateOutliers(
    observations: NormalizedLaboratoryObservation[]
  ): CrossLabOutlierReport[] {
    if (observations.length === 0) return [];

    const scores = observations.map((o) => o.rawScore);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    return observations.map((obs) => {
      const deviationPercentage = Number(
        (Math.abs((obs.rawScore - mean) / (mean || 1)) * 100).toFixed(2)
      );

      let outlierStatus: CrossLabOutlierStatus = "NORMAL";
      let reason = "Observation falls within normal laboratory variance (< 3.0%).";
      let recommendation = "Include in cross-laboratory synthesis matrix.";

      if (obs.temperatureCelsius && obs.temperatureCelsius > 95) {
        outlierStatus = "THERMAL_DISCARDED";
        reason = `Thermal throttling detected (${obs.temperatureCelsius}°C exceeds safe continuous threshold).`;
        recommendation = "Flag for thermal discard in synthesis, retain in raw audit ledger.";
      } else if (obs.powerWatts && obs.powerWatts > 800) {
        outlierStatus = "SAFETY_DISCARDED";
        reason = `Power draw (${obs.powerWatts}W) exceeded safe electrical limit.`;
        recommendation = "Flag for safety discard in synthesis, retain in raw audit ledger.";
      } else if (deviationPercentage > 12.0) {
        outlierStatus = "HIGH_DEVIATION";
        reason = `High score deviation of ${deviationPercentage}% from laboratory mean (${mean.toFixed(1)}).`;
        recommendation = "Flag for secondary laboratory re-test.";
      } else if (deviationPercentage > 4.0) {
        outlierStatus = "POTENTIAL_OUTLIER";
        reason = `Moderate score deviation of ${deviationPercentage}% from laboratory mean.`;
        recommendation = "Include with caution in synthesis matrix.";
      }

      const outlierId = `clor-${crypto
        .createHash("sha256")
        .update(`${obs.observationId}:${outlierStatus}`)
        .digest("hex")
        .slice(0, 16)}`;

      return {
        outlierId,
        observationId: obs.observationId,
        laboratoryId: obs.laboratoryId,
        benchmarkSuite: obs.benchmarkSuite,
        rawScore: obs.rawScore,
        deviationPercentage,
        outlierStatus,
        reason,
        recommendation,
        preservedRawMeasurement: obs.rawScore, // Always preserved
        detectedAt: new Date().toISOString(),
      };
    });
  }
}
