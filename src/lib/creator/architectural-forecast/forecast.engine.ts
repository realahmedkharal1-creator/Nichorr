import crypto from "node:crypto";
import {
  ArchitecturalDegradationForecast,
  ForecastDataPoint,
  ForecastHorizon,
  ForecastModelType,
  ForecastState,
  ForecastConfidenceLevel,
} from "./architectural-forecast.types";
import { SiliconRegressionObservation } from "../silicon-regression/silicon-regression.types";

export class ArchitecturalForecastEngine {
  /**
   * Generates a deterministic architectural degradation forecast for a hardware SKU and benchmark suite.
   */
  static generateForecast(
    researchRunId: string,
    userId: string,
    observations: SiliconRegressionObservation[],
    options?: {
      horizon?: ForecastHorizon;
      modelType?: ForecastModelType;
      blockers?: string[];
      confounders?: string[];
    }
  ): ArchitecturalDegradationForecast {
    const horizon: ForecastHorizon = options?.horizon || "MEDIUM_TERM";
    const modelType: ForecastModelType = options?.modelType || "SCENARIO_BOUNDED_PROJECTION";
    const blockers = options?.blockers || [];
    const knownConfounders = options?.confounders || [];

    const horizonSteps = horizon === "SHORT_TERM" ? 3 : horizon === "MEDIUM_TERM" ? 6 : 12;

    if (observations.length === 0) {
      const forecastId = `adf-empty-${Date.now().toString(36)}`;
      return {
        forecastId,
        userId,
        researchRunId,
        architecture: "UNKNOWN",
        generation: "UNKNOWN",
        sku: "UNKNOWN",
        benchmarkSuite: "UNKNOWN",
        metricUnit: "pts",
        baselineObservedScore: 0,
        latestObservedScore: 0,
        historicalDeltaPercentage: 0,
        forecastHorizon: horizon,
        forecastHorizonSteps: horizonSteps,
        forecastModelType: "INSUFFICIENT_EVIDENCE_MODE",
        forecastState: "FORECAST_INSUFFICIENT_DATA",
        confidenceLevel: "VERY_LOW",
        projectedTrajectory: [],
        assumptions: ["No historical observations available to establish baseline."],
        knownConfounders: [],
        evidenceQualityNotes: ["Zero empirical measurements recorded."],
        isStale: false,
        evidenceBoundary:
          "EPISTEMIC BOUNDARY: Extrapolated model output is NOT verified empirical research evidence.",
        forecastedAt: new Date().toISOString(),
      };
    }

    // Sort observations chronologically
    const sorted = [...observations].sort(
      (a, b) => new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime()
    );

    const baseline = sorted[0];
    const latest = sorted[sorted.length - 1];

    const historicalDelta = latest.measuredScore - baseline.measuredScore;
    const historicalDeltaPct =
      baseline.measuredScore > 0
        ? Number(((historicalDelta / baseline.measuredScore) * 100).toFixed(1))
        : 0;

    // Check Forecast State & Blockers
    let forecastState: ForecastState = "FORECAST_AVAILABLE";
    let confidenceLevel: ForecastConfidenceLevel = "MODERATE";

    if (blockers.length > 0) {
      forecastState = "FORECAST_BLOCKED";
      confidenceLevel = "VERY_LOW";
    } else if (sorted.length < 2) {
      forecastState = "FORECAST_INSUFFICIENT_DATA";
      confidenceLevel = "VERY_LOW";
    } else if (knownConfounders.length >= 2) {
      forecastState = "FORECAST_CONFOUNDED";
      confidenceLevel = "LOW";
    } else if (sorted.length >= 4 && knownConfounders.length === 0) {
      confidenceLevel = "HIGH";
    }

    // Calculate Step Degradation Rate (Average delta per observed revision)
    const revisionCount = Math.max(1, sorted.length - 1);
    const avgStepDeltaPct = historicalDeltaPct / revisionCount;

    // Generate Trajectory Points
    const projectedTrajectory: ForecastDataPoint[] = [];
    let currentScore = latest.measuredScore;

    for (let step = 1; step <= horizonSteps; step++) {
      let stepDeltaPct = avgStepDeltaPct;

      if (modelType === "CONSERVATIVE_PROJECTION") {
        stepDeltaPct = avgStepDeltaPct * 0.5;
      }

      const projectedScore = Number(
        (currentScore * (1 + stepDeltaPct / 100)).toFixed(1)
      );

      // Uncertainty bounds widen as horizon increases
      const uncertaintyBand = Math.min(15, 2.0 * step);
      const lowerBound = Number((projectedScore * (1 - uncertaintyBand / 100)).toFixed(1));
      const upperBound = Number((projectedScore * (1 + uncertaintyBand / 100)).toFixed(1));

      const cumulativeDeltaPct =
        baseline.measuredScore > 0
          ? Number(
              (((projectedScore - baseline.measuredScore) / baseline.measuredScore) * 100).toFixed(1)
            )
          : 0;

      projectedTrajectory.push({
        horizonStep: step,
        stepLabel: `Driver/Microcode Update +${step}`,
        projectedScore,
        metricUnit: latest.metricUnit,
        lowerBoundScore: lowerBound,
        upperBoundScore: upperBound,
        projectedDeltaPercentage: cumulativeDeltaPct,
        modelStrategy: modelType,
        uncertaintyReason: `Variance spread ±${uncertaintyBand}% at step +${step} due to unobserved future compiler/driver optimizations.`,
      });

      currentScore = projectedScore;
    }

    const forecastId = `adf-${crypto
      .createHash("sha256")
      .update(`${latest.sku}:${latest.benchmarkSuite}:${horizon}:${modelType}`)
      .digest("hex")
      .substring(0, 10)}`;

    const assumptions: string[] = [
      `Assumes workload characteristics in ${latest.benchmarkSuite} remain constant across future driver branches.`,
      `Assumes thermal ambient condition stays within nominal ${latest.thermalConditionsCelsius || 22}°C environment.`,
      `Assumes no unmitigated architectural hardware fault overrides microcode scheduling.`,
    ];

    const evidenceQualityNotes: string[] = [
      `Grounded on ${sorted.length} historical verified observations across ${
        new Set(sorted.map((s) => s.driver)).size
      } driver revisions.`,
      `Initial baseline: ${baseline.measuredScore} ${baseline.metricUnit} -> Latest: ${latest.measuredScore} ${latest.metricUnit} (${historicalDeltaPct}% delta).`,
    ];

    return {
      forecastId,
      userId,
      researchRunId,
      architecture: latest.architecture,
      generation: latest.generation,
      sku: latest.sku,
      benchmarkSuite: latest.benchmarkSuite,
      metricUnit: latest.metricUnit,
      baselineObservedScore: baseline.measuredScore,
      latestObservedScore: latest.measuredScore,
      historicalDeltaPercentage: historicalDeltaPct,
      forecastHorizon: horizon,
      forecastHorizonSteps: horizonSteps,
      forecastModelType: modelType,
      forecastState,
      confidenceLevel,
      projectedTrajectory,
      assumptions,
      knownConfounders,
      evidenceQualityNotes,
      isStale: false,
      evidenceBoundary:
        "EPISTEMIC BOUNDARY: Architectural degradation forecasts are speculative mathematical models. They MUST NOT be classified as verified empirical evidence or used as factual citations without laboratory verification.",
      forecastedAt: new Date().toISOString(),
    };
  }
}
