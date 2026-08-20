import {
  ForecastLineageTrace,
  ArchitecturalDegradationForecast,
} from "./architectural-forecast.types";

export class ForecastLineageEngine {
  /**
   * Generates a 6-stage deterministic provenance and explainability lineage trace for an architectural forecast.
   */
  static generateLineage(forecast: ArchitecturalDegradationForecast): ForecastLineageTrace {
    const lastStep =
      forecast.projectedTrajectory.length > 0
        ? forecast.projectedTrajectory[forecast.projectedTrajectory.length - 1]
        : null;

    return {
      forecastId: forecast.forecastId,
      links: [
        {
          stage: "STAGE_1_OBSERVED_EVIDENCE",
          title: "Stage 1: Verified Empirical Evidence",
          detail: `Initial baseline measurement: ${forecast.baselineObservedScore} ${forecast.metricUnit} in ${forecast.benchmarkSuite}.`,
          status: "OBSERVED",
          targetId: `obs-base-${forecast.sku}`,
        },
        {
          stage: "STAGE_2_NORMALIZED_OBSERVATIONS",
          title: "Stage 2: Longitudinal Observation Normalization",
          detail: `Normalized latest observation: ${forecast.latestObservedScore} ${forecast.metricUnit} (${forecast.historicalDeltaPercentage}% historical delta).`,
          status: "NORMALIZED",
          targetId: `obs-latest-${forecast.sku}`,
        },
        {
          stage: "STAGE_3_REGRESSION_COLLECTIVE_INPUTS",
          title: "Stage 3: Silicon Regression & Collective Inputs",
          detail: `Regression state verified. Known confounders: ${
            forecast.knownConfounders.length > 0 ? forecast.knownConfounders.join(", ") : "None"
          }.`,
          status: forecast.knownConfounders.length > 0 ? "CONFOUNDED" : "ALIGNED",
          targetId: `reg-${forecast.sku}`,
        },
        {
          stage: "STAGE_4_FORECAST_SIMULATION_ASSUMPTIONS",
          title: "Stage 4: Declared Forecast Model Assumptions",
          detail: `Model: ${forecast.forecastModelType}, Horizon: ${forecast.forecastHorizon} (${forecast.forecastHorizonSteps} steps). Confidence: ${forecast.confidenceLevel}.`,
          status: "SIMULATED",
          targetId: `model-${forecast.forecastModelType}`,
        },
        {
          stage: "STAGE_5_DERIVED_PROJECTION_RESULT",
          title: "Stage 5: Derived Degradation Trajectory",
          detail: `Projected final score: ${lastStep ? lastStep.projectedScore : "N/A"} ${
            forecast.metricUnit
          } (${lastStep ? lastStep.projectedDeltaPercentage : 0}% projected delta).`,
          status: "PROJECTED",
          targetId: forecast.forecastId,
        },
        {
          stage: "STAGE_6_RESEARCH_VALIDATION_BRIDGE",
          title: "Stage 6: Phase 86 Research Validation Bridge",
          detail: `Opportunities surfaced for formal laboratory testbench calibration. Claim mutations blocked without physical validation.`,
          status: "EPISTEMIC_GATE",
          targetId: `bridge-p86-${forecast.sku}`,
        },
      ],
    };
  }
}
