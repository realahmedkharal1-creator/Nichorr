import crypto from "node:crypto";
import {
  ArchitecturalDegradationMatrix,
  ArchitecturalDegradationMatrixRow,
  ArchitecturalDegradationForecast,
  MicrocodeSimulationResult,
  ForecastResearchOpportunity,
} from "./architectural-forecast.types";
import { SiliconRegressionObservation } from "../silicon-regression/silicon-regression.types";

export class ArchitecturalDegradationMatrixEngine {
  /**
   * Compiles the complete Architectural Degradation Matrix combining observed, forecast, and simulated data.
   */
  static buildMatrix(
    researchRunId: string,
    userId: string,
    observations: SiliconRegressionObservation[],
    forecasts: ArchitecturalDegradationForecast[],
    simulations: MicrocodeSimulationResult[],
    opportunities: ForecastResearchOpportunity[]
  ): ArchitecturalDegradationMatrix {
    const rows: ArchitecturalDegradationMatrixRow[] = [];

    // Group observations by (sku, benchmarkSuite)
    const groupMap = new Map<string, SiliconRegressionObservation[]>();
    for (const obs of observations) {
      const key = `${obs.sku.toLowerCase().trim()}:${obs.benchmarkSuite.toLowerCase().trim()}`;
      const list = groupMap.get(key) || [];
      list.push(obs);
      groupMap.set(key, list);
    }

    for (const [key, obsList] of groupMap.entries()) {
      if (obsList.length === 0) continue;

      const sorted = [...obsList].sort(
        (a, b) => new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime()
      );

      const baseline = sorted[0];
      const latest = sorted[sorted.length - 1];

      const histDelta = latest.measuredScore - baseline.measuredScore;
      const histDeltaPct =
        baseline.measuredScore > 0
          ? Number(((histDelta / baseline.measuredScore) * 100).toFixed(1))
          : 0;

      // Find matching forecast
      const forecast = forecasts.find(
        (f) =>
          f.sku.toLowerCase().trim() === latest.sku.toLowerCase().trim() &&
          f.benchmarkSuite.toLowerCase().trim() === latest.benchmarkSuite.toLowerCase().trim()
      );

      let forecastDirection: ArchitecturalDegradationMatrixRow["forecastDirection"] = "STABLE";
      if (forecast && forecast.projectedTrajectory.length > 0) {
        const lastPt = forecast.projectedTrajectory[forecast.projectedTrajectory.length - 1];
        if (lastPt.projectedDeltaPercentage < -3) forecastDirection = "REGRESSION";
        else if (lastPt.projectedDeltaPercentage > 3) forecastDirection = "IMPROVEMENT";
      }

      // Count matching simulations and opportunities
      const matchingSims = simulations.filter(
        (s) =>
          s.sku.toLowerCase().trim() === latest.sku.toLowerCase().trim() &&
          s.benchmarkSuite.toLowerCase().trim() === latest.benchmarkSuite.toLowerCase().trim()
      ).length;

      const matchingOpps = opportunities.filter((o) =>
        o.affectedSKUs.some((s) => s.toLowerCase().trim() === latest.sku.toLowerCase().trim())
      ).length;

      const rowId = `admr-${crypto
        .createHash("sha256")
        .update(`${latest.sku}:${latest.benchmarkSuite}`)
        .digest("hex")
        .substring(0, 10)}`;

      rows.push({
        rowId,
        architecture: latest.architecture,
        generation: latest.generation,
        sku: latest.sku,
        benchmarkSuite: latest.benchmarkSuite,
        baselineScore: baseline.measuredScore,
        latestObservedScore: latest.measuredScore,
        historicalDeltaPercentage: histDeltaPct,
        regressionState:
          histDeltaPct < -8
            ? "CONFIRMED_EMPIRICAL_REGRESSION"
            : histDeltaPct < -3
            ? "LIKELY_REGRESSION"
            : histDeltaPct > 3
            ? "IMPROVEMENT"
            : "NO_REGRESSION",
        forecastState: forecast ? forecast.forecastState : "FORECAST_INSUFFICIENT_DATA",
        forecastDirection,
        forecastConfidence: forecast ? forecast.confidenceLevel : "VERY_LOW",
        primaryConfounder:
          forecast && forecast.knownConfounders.length > 0
            ? forecast.knownConfounders[0]
            : "None detected",
        activeSimulationsCount: matchingSims,
        activeOpportunitiesCount: matchingOpps,
        validationState: matchingOpps > 0 ? "QUEUED" : "VALIDATED",
      });
    }

    const matrixSnapshotHash = crypto
      .createHash("sha256")
      .update(
        `${researchRunId}:${rows.length}:${forecasts.length}:${simulations.length}:${opportunities.length}`
      )
      .digest("hex");

    return {
      matrixId: `adm-${researchRunId}-${matrixSnapshotHash.substring(0, 8)}`,
      userId,
      researchRunId,
      rows,
      forecastsCount: forecasts.length,
      simulationsCount: simulations.length,
      scenariosCount: 4,
      staleCount: forecasts.filter((f) => f.isStale).length,
      blockedCount: forecasts.filter((f) => f.forecastState === "FORECAST_BLOCKED").length,
      matrixSnapshotHash,
      updatedAt: new Date().toISOString(),
    };
  }
}
