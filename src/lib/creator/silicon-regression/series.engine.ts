import crypto from "node:crypto";
import {
  SiliconRegressionObservation,
  SiliconRegressionSeries,
  SiliconRegressionTimelinePoint,
  RegressionState,
} from "./silicon-regression.types";

export class SiliconRegressionSeriesEngine {
  /**
   * Constructs longitudinal benchmark series grouped by hardware SKU and benchmark suite.
   */
  static buildSeries(
    observations: SiliconRegressionObservation[]
  ): SiliconRegressionSeries[] {
    const seriesList: SiliconRegressionSeries[] = [];

    // Group observations by hardware SKU & benchmark suite
    const groupMap = new Map<string, SiliconRegressionObservation[]>();
    for (const obs of observations) {
      const key = `${obs.sku.toLowerCase().trim()}:${obs.benchmarkSuite.toLowerCase().trim()}`;
      const list = groupMap.get(key) || [];
      list.push(obs);
      groupMap.set(key, list);
    }

    for (const [key, obsGroup] of groupMap.entries()) {
      if (obsGroup.length === 0) continue;

      // Sort observations chronologically
      const sorted = [...obsGroup].sort(
        (a, b) => new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime()
      );

      const baseline = sorted[0];
      const seriesId = `srs-${crypto
        .createHash("sha256")
        .update(`${key}:${baseline.observationId}`)
        .digest("hex")
        .substring(0, 10)}`;

      const points: SiliconRegressionTimelinePoint[] = [];
      let isMonotonicRegression = true;
      let previousScore = baseline.measuredScore;
      const confounders: string[] = [];

      for (let i = 0; i < sorted.length; i++) {
        const obs = sorted[i];
        const delta = obs.measuredScore - baseline.measuredScore;
        const deltaPct =
          baseline.measuredScore > 0
            ? Number(((delta / baseline.measuredScore) * 100).toFixed(1))
            : 0;

        let ptState: RegressionState = "NO_REGRESSION";
        if (deltaPct < -3) {
          ptState = deltaPct < -8 ? "CONFIRMED_EMPIRICAL_REGRESSION" : "POSSIBLE_REGRESSION";
        } else if (deltaPct > 3) {
          ptState = "IMPROVEMENT";
        }

        if (i > 0 && obs.measuredScore >= previousScore) {
          isMonotonicRegression = false;
        }
        previousScore = obs.measuredScore;

        const methodologyFingerprint = crypto
          .createHash("sha256")
          .update(
            `${obs.benchmarkSuite}:${obs.benchmarkVersion || ""}:${obs.driver || ""}:${
              obs.resolution || ""
            }:${obs.preset || ""}`
          )
          .digest("hex")
          .substring(0, 12);

        points.push({
          pointId: `pt-${obs.observationId}`,
          observationId: obs.observationId,
          timestamp: obs.observedAt,
          driver: obs.driver,
          firmware: obs.firmware,
          measuredScore: obs.measuredScore,
          metricUnit: obs.metricUnit,
          deltaFromBaseline: Number(delta.toFixed(1)),
          deltaPercentage: deltaPct,
          regressionState: ptState,
          methodologyFingerprint,
        });
      }

      // Determine series overall state
      const latestPoint = points[points.length - 1];
      let seriesState: RegressionState = latestPoint ? latestPoint.regressionState : "NO_REGRESSION";

      if (sorted.length < 2) {
        seriesState = "INSUFFICIENT_DATA";
      }

      seriesList.push({
        seriesId,
        hardwareKey: baseline.sku,
        benchmarkSuite: baseline.benchmarkSuite,
        metricUnit: baseline.metricUnit,
        baselineObservationId: baseline.observationId,
        points,
        totalObservationsCount: sorted.length,
        comparableObservationsCount: sorted.length,
        independentObservationsCount: new Set(sorted.map((o) => o.sourcePublisher)).size,
        isMonotonicRegression: sorted.length >= 2 && isMonotonicRegression,
        isConfounded: confounders.length > 0,
        confounders,
        seriesState,
        updatedAt: new Date().toISOString(),
      });
    }

    return seriesList;
  }
}
