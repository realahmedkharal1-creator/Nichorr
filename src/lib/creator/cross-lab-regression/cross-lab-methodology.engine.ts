import { CrossLabMethodologyCompatibility } from "./cross-lab-regression.types";

export interface LabMethodologyConfig {
  benchmarkSuite: string;
  benchmarkVersion: string;
  metricType: string;
  resolution: string;
  preset: string;
  renderingApi: string;
  upscalingTechnology?: string;
  frameGeneration?: boolean;
  rayTracing?: boolean;
  powerLimitWatts?: number;
  driverVersion?: string;
  biosVersion?: string;
}

export class CrossLabMethodologyEngine {
  public static evaluateCompatibility(
    a: LabMethodologyConfig,
    b: LabMethodologyConfig
  ): {
    compatibility: CrossLabMethodologyCompatibility;
    isComparable: boolean;
    confounders: string[];
  } {
    const confounders: string[] = [];

    if (a.benchmarkSuite !== b.benchmarkSuite) {
      confounders.push(`Suite Mismatch: ${a.benchmarkSuite} vs ${b.benchmarkSuite}`);
    }
    if (a.benchmarkVersion !== b.benchmarkVersion) {
      confounders.push(`Version Mismatch: ${a.benchmarkVersion} vs ${b.benchmarkVersion}`);
    }
    if (a.metricType !== b.metricType) {
      confounders.push(`Metric Mismatch: ${a.metricType} vs ${b.metricType}`);
    }
    if (a.resolution !== b.resolution) {
      confounders.push(`Resolution Mismatch: ${a.resolution} vs ${b.resolution}`);
    }
    if (a.preset !== b.preset) {
      confounders.push(`Preset Mismatch: ${a.preset} vs ${b.preset}`);
    }
    if (a.renderingApi !== b.renderingApi) {
      confounders.push(`API Mismatch: ${a.renderingApi} vs ${b.renderingApi}`);
    }
    if ((a.rayTracing ?? false) !== (b.rayTracing ?? false)) {
      confounders.push(`Ray Tracing Mismatch: ${a.rayTracing} vs ${b.rayTracing}`);
    }
    if ((a.frameGeneration ?? false) !== (b.frameGeneration ?? false)) {
      confounders.push(`Frame Gen Mismatch: ${a.frameGeneration} vs ${b.frameGeneration}`);
    }

    if (a.driverVersion && b.driverVersion && a.driverVersion !== b.driverVersion) {
      confounders.push(`Driver Revision Delta: ${a.driverVersion} vs ${b.driverVersion}`);
    }

    if (a.powerLimitWatts && b.powerLimitWatts && a.powerLimitWatts !== b.powerLimitWatts) {
      confounders.push(`Power Limit Delta: ${a.powerLimitWatts}W vs ${b.powerLimitWatts}W`);
    }

    if (confounders.length === 0) {
      return { compatibility: "IDENTICAL", isComparable: true, confounders: [] };
    }

    const majorMismatches = confounders.filter(
      (c) => c.includes("Suite") || c.includes("Resolution") || c.includes("Preset") || c.includes("API")
    );

    if (majorMismatches.length > 0) {
      return { compatibility: "NOT_COMPARABLE", isComparable: false, confounders };
    }

    if (confounders.length === 1 && (confounders[0].includes("Driver") || confounders[0].includes("Power"))) {
      return { compatibility: "COMPARABLE", isComparable: true, confounders };
    }

    if (confounders.length <= 2) {
      return { compatibility: "PARTIALLY_COMPARABLE", isComparable: true, confounders };
    }

    return { compatibility: "CONFOUNDED", isComparable: false, confounders };
  }
}
