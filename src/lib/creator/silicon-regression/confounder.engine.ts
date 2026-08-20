import {
  SiliconRegressionObservation,
  RegressionConfounder,
} from "./silicon-regression.types";

export class RegressionConfounderEngine {
  /**
   * Detects confounding variables between two observations that prevent isolated single-variable attribution.
   */
  static detectConfounders(
    baseline: SiliconRegressionObservation,
    candidate: SiliconRegressionObservation
  ): RegressionConfounder[] {
    const confounders: RegressionConfounder[] = [];

    // Resolution delta
    if (baseline.resolution && candidate.resolution && baseline.resolution !== candidate.resolution) {
      confounders.push({
        dimension: "resolution",
        baselineValue: baseline.resolution,
        candidateValue: candidate.resolution,
        impactDescription: `Resolution shifted from ${baseline.resolution} to ${candidate.resolution}, impacting GPU raster load.`,
      });
    }

    // Quality preset delta
    if (baseline.preset && candidate.preset && baseline.preset !== candidate.preset) {
      confounders.push({
        dimension: "preset",
        baselineValue: baseline.preset,
        candidateValue: candidate.preset,
        impactDescription: `Quality preset changed from ${baseline.preset} to ${candidate.preset}.`,
      });
    }

    // Rendering API delta
    if (baseline.renderingApi && candidate.renderingApi && baseline.renderingApi !== candidate.renderingApi) {
      confounders.push({
        dimension: "renderingApi",
        baselineValue: baseline.renderingApi,
        candidateValue: candidate.renderingApi,
        impactDescription: `Rendering backend delta (${baseline.renderingApi} vs ${candidate.renderingApi}).`,
      });
    }

    // Upscaling technology / mode delta
    if (baseline.upscalingTech !== candidate.upscalingTech || baseline.upscalingMode !== candidate.upscalingMode) {
      confounders.push({
        dimension: "upscaling",
        baselineValue: `${baseline.upscalingTech || "Native"} ${baseline.upscalingMode || ""}`.trim(),
        candidateValue: `${candidate.upscalingTech || "Native"} ${candidate.upscalingMode || ""}`.trim(),
        impactDescription: "Upscaling algorithms and reconstruction quality scale factors diverge.",
      });
    }

    // Ray tracing toggle delta
    if (Boolean(baseline.rayTracing) !== Boolean(candidate.rayTracing)) {
      confounders.push({
        dimension: "rayTracing",
        baselineValue: Boolean(baseline.rayTracing) ? "Enabled" : "Disabled",
        candidateValue: Boolean(candidate.rayTracing) ? "Enabled" : "Disabled",
        impactDescription: "BVH acceleration and ray tracing pipeline active in one observation only.",
      });
    }

    // Frame generation toggle delta
    if (Boolean(baseline.frameGeneration) !== Boolean(candidate.frameGeneration)) {
      confounders.push({
        dimension: "frameGeneration",
        baselineValue: Boolean(baseline.frameGeneration) ? "Enabled" : "Disabled",
        candidateValue: Boolean(candidate.frameGeneration) ? "Enabled" : "Disabled",
        impactDescription: "Optical flow / AI frame generation active in one observation only.",
      });
    }

    // Power limit delta
    if (
      typeof baseline.powerLimitWatts === "number" &&
      typeof candidate.powerLimitWatts === "number" &&
      Math.abs(baseline.powerLimitWatts - candidate.powerLimitWatts) >= 10
    ) {
      confounders.push({
        dimension: "powerLimitWatts",
        baselineValue: `${baseline.powerLimitWatts}W`,
        candidateValue: `${candidate.powerLimitWatts}W`,
        impactDescription: `Package power ceiling delta exceeds 10W (${baseline.powerLimitWatts}W vs ${candidate.powerLimitWatts}W).`,
      });
    }

    return confounders;
  }
}
