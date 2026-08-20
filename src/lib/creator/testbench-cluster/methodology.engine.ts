import crypto from "crypto";

export interface MethodologyParams {
  benchmarkSuite: string;
  benchmarkVersion: string;
  resolution: string;
  preset: string;
  renderingApi: string;
  upscaling?: string;
  frameGeneration?: boolean;
  rayTracing?: boolean;
  powerLimitWatts?: number;
  warmupRuns?: number;
  measurementRuns?: number;
}

export class MethodologyEngine {
  public static createMethodologyFingerprint(params: MethodologyParams): string {
    const canonical = {
      benchmarkSuite: params.benchmarkSuite,
      benchmarkVersion: params.benchmarkVersion,
      resolution: params.resolution,
      preset: params.preset,
      renderingApi: params.renderingApi,
      upscaling: params.upscaling || "NONE",
      frameGeneration: params.frameGeneration ?? false,
      rayTracing: params.rayTracing ?? false,
      powerLimitWatts: params.powerLimitWatts ?? 500,
      warmupRuns: params.warmupRuns ?? 1,
      measurementRuns: params.measurementRuns ?? 3,
    };

    return `mfp-${crypto
      .createHash("sha256")
      .update(JSON.stringify(canonical))
      .digest("hex")
      .slice(0, 16)}`;
  }

  public static evaluateCompatibility(
    a: MethodologyParams,
    b: MethodologyParams
  ): {
    isCompatible: boolean;
    confounders: string[];
  } {
    const confounders: string[] = [];

    if (a.benchmarkSuite !== b.benchmarkSuite) {
      confounders.push(`Suite Mismatch: ${a.benchmarkSuite} vs ${b.benchmarkSuite}`);
    }
    if (a.benchmarkVersion !== b.benchmarkVersion) {
      confounders.push(`Version Mismatch: ${a.benchmarkVersion} vs ${b.benchmarkVersion}`);
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

    return {
      isCompatible: confounders.length === 0,
      confounders,
    };
  }
}
