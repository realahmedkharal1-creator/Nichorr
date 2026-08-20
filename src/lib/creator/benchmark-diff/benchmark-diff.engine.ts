import {
  BenchmarkMeasurement,
  BenchmarkDiffRecord,
  BenchmarkDiffState,
} from "./benchmark-diff.types";

export class BenchmarkDiffEngine {
  /**
   * Evaluates benchmark differences across 20 dimensions deterministically.
   */
  static compareBenchmarks(
    baseline: BenchmarkMeasurement,
    candidate: BenchmarkMeasurement
  ): BenchmarkDiffRecord {
    const dimensionDifferences: string[] = [];
    const warnings: string[] = [];
    const changedCategories = new Set<string>();

    // 1. Suite & Metric Check
    const suiteA = (baseline.benchmarkSuite || "").toLowerCase().trim();
    const suiteB = (candidate.benchmarkSuite || "").toLowerCase().trim();
    const unitA = (baseline.metricUnit || "").toLowerCase().trim();
    const unitB = (candidate.metricUnit || "").toLowerCase().trim();

    if (suiteA !== suiteB) {
      dimensionDifferences.push(`Suite mismatch: "${baseline.benchmarkSuite}" vs "${candidate.benchmarkSuite}"`);
      changedCategories.add("SUITE");
    }

    if (unitA !== unitB) {
      dimensionDifferences.push(`Metric unit mismatch: "${baseline.metricUnit}" vs "${candidate.metricUnit}"`);
      changedCategories.add("SUITE");
    }

    // 2. Hardware Identity Check
    if (baseline.hardwareIdentity !== candidate.hardwareIdentity) {
      dimensionDifferences.push(`Hardware identity mismatch: "${baseline.hardwareIdentity}" vs "${candidate.hardwareIdentity}"`);
      changedCategories.add("HARDWARE");
    }

    if (baseline.gpuModel && candidate.gpuModel && baseline.gpuModel !== candidate.gpuModel) {
      dimensionDifferences.push(`GPU mismatch: "${baseline.gpuModel}" vs "${candidate.gpuModel}"`);
      changedCategories.add("HARDWARE");
    }

    if (baseline.cpuModel && candidate.cpuModel && baseline.cpuModel !== candidate.cpuModel) {
      dimensionDifferences.push(`CPU mismatch: "${baseline.cpuModel}" vs "${candidate.cpuModel}"`);
      changedCategories.add("HARDWARE");
    }

    // 3. Methodology & Versions Check
    if (baseline.benchmarkVersion && candidate.benchmarkVersion && baseline.benchmarkVersion !== candidate.benchmarkVersion) {
      dimensionDifferences.push(`Benchmark version mismatch: v${baseline.benchmarkVersion} vs v${candidate.benchmarkVersion}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.appGameVersion && candidate.appGameVersion && baseline.appGameVersion !== candidate.appGameVersion) {
      dimensionDifferences.push(`Application version mismatch: v${baseline.appGameVersion} vs v${candidate.appGameVersion}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.resolution && candidate.resolution && baseline.resolution !== candidate.resolution) {
      dimensionDifferences.push(`Resolution mismatch: ${baseline.resolution} vs ${candidate.resolution}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.preset && candidate.preset && baseline.preset !== candidate.preset) {
      dimensionDifferences.push(`Quality preset mismatch: ${baseline.preset} vs ${candidate.preset}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.renderingApi && candidate.renderingApi && baseline.renderingApi !== candidate.renderingApi) {
      dimensionDifferences.push(`Rendering API mismatch: ${baseline.renderingApi} vs ${candidate.renderingApi}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.upscalingTechnology && candidate.upscalingTechnology && baseline.upscalingTechnology !== candidate.upscalingTechnology) {
      dimensionDifferences.push(`Upscaling tech mismatch: ${baseline.upscalingTechnology} vs ${candidate.upscalingTechnology}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.upscalingMode && candidate.upscalingMode && baseline.upscalingMode !== candidate.upscalingMode) {
      dimensionDifferences.push(`Upscaling mode mismatch: ${baseline.upscalingMode} vs ${candidate.upscalingMode}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.frameGeneration !== undefined && candidate.frameGeneration !== undefined && baseline.frameGeneration !== candidate.frameGeneration) {
      dimensionDifferences.push(`Frame generation differs: FG ${baseline.frameGeneration ? "ON" : "OFF"} vs FG ${candidate.frameGeneration ? "ON" : "OFF"}`);
      changedCategories.add("METHODOLOGY");
    }

    if (baseline.rayTracing !== undefined && candidate.rayTracing !== undefined && baseline.rayTracing !== candidate.rayTracing) {
      dimensionDifferences.push(`Ray tracing differs: RT ${baseline.rayTracing ? "ON" : "OFF"} vs RT ${candidate.rayTracing ? "ON" : "OFF"}`);
      changedCategories.add("METHODOLOGY");
    }

    // 4. Software Environment Check
    if (baseline.driverVersion && candidate.driverVersion && baseline.driverVersion !== candidate.driverVersion) {
      dimensionDifferences.push(`Driver version mismatch: ${baseline.driverVersion} vs ${candidate.driverVersion}`);
      changedCategories.add("SOFTWARE_ENVIRONMENT");
    }

    // 5. Test Conditions Check
    if (baseline.powerLimitWatts && candidate.powerLimitWatts && Math.abs(baseline.powerLimitWatts - candidate.powerLimitWatts) > 5) {
      dimensionDifferences.push(`Power limit discrepancy: ${baseline.powerLimitWatts}W vs ${candidate.powerLimitWatts}W`);
      changedCategories.add("TEST_CONDITION");
    }

    if (baseline.thermalConditionsCelsius && candidate.thermalConditionsCelsius && Math.abs(baseline.thermalConditionsCelsius - candidate.thermalConditionsCelsius) > 5) {
      dimensionDifferences.push(`Thermal discrepancy: ${baseline.thermalConditionsCelsius}°C vs ${candidate.thermalConditionsCelsius}°C`);
      changedCategories.add("TEST_CONDITION");
    }

    if (baseline.cpuRamConfig && candidate.cpuRamConfig && baseline.cpuRamConfig !== candidate.cpuRamConfig) {
      dimensionDifferences.push(`Memory/RAM configuration differs: ${baseline.cpuRamConfig} vs ${candidate.cpuRamConfig}`);
      changedCategories.add("TEST_CONDITION");
    }

    // 6. Source Check
    if (baseline.sourcePublisher !== candidate.sourcePublisher) {
      dimensionDifferences.push(`Source mismatch: ${baseline.sourcePublisher} vs ${candidate.sourcePublisher}`);
      changedCategories.add("SOURCE");
    }

    // Deltas
    const numericDelta = candidate.score - baseline.score;
    const percentageDelta = baseline.score !== 0 ? Math.round((numericDelta / baseline.score) * 100) : 0;

    // Diff State Determination
    let diffState: BenchmarkDiffState = "IDENTICAL";
    let isComparable = true;

    if (changedCategories.has("SUITE")) {
      diffState = "INSUFFICIENT_DATA";
      isComparable = false;
      warnings.push("Incompatible benchmark suites cannot be compared.");
    } else if (changedCategories.size > 1) {
      diffState = "MULTIPLE_DIMENSIONS_CHANGED";
      isComparable = false;
      warnings.push(`Multiple dimension categories changed: ${Array.from(changedCategories).join(", ")}`);
    } else if (changedCategories.has("HARDWARE")) {
      diffState = "HARDWARE_CHANGE";
    } else if (changedCategories.has("METHODOLOGY")) {
      diffState = "METHODOLOGY_CHANGE";
      isComparable = false;
      warnings.push("Methodology variation requires explicit creator caveat.");
    } else if (changedCategories.has("SOFTWARE_ENVIRONMENT")) {
      diffState = "SOFTWARE_ENVIRONMENT_CHANGE";
    } else if (changedCategories.has("TEST_CONDITION")) {
      diffState = "TEST_CONDITION_CHANGE";
    } else if (changedCategories.has("SOURCE")) {
      if (Math.abs(percentageDelta) > 25) {
        diffState = "CONFLICTED";
        isComparable = false;
        warnings.push(`Significant unexplained divergence (${percentageDelta}%) across sources.`);
      } else {
        diffState = "SOURCE_CHANGE";
      }
    } else if (numericDelta !== 0) {
      diffState = "NUMERIC_CHANGE_ONLY";
    }

    let explanation = `${candidate.hardwareIdentity} scored ${candidate.score} ${candidate.metricUnit} vs ${baseline.hardwareIdentity} (${baseline.score} ${baseline.metricUnit}) [Delta: ${percentageDelta >= 0 ? `+${percentageDelta}%` : `${percentageDelta}%`}].`;
    if (!isComparable) {
      explanation += ` Comparability warning: ${diffState}.`;
    }

    let recommendedAction = "Include benchmark in variant presentation.";
    if (diffState === "CONFLICTED") {
      recommendedAction = "Do not state as verified claim; queue research re-validation.";
    } else if (!isComparable) {
      recommendedAction = "Present only with explicit methodology caveat overlay.";
    }

    const diffId = `bdiff-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    return {
      diffId,
      benchmarkName: baseline.benchmarkSuite,
      baseline,
      candidate,
      diffState,
      numericDelta,
      percentageDelta,
      isComparable,
      dimensionDifferences,
      warnings,
      explanation,
      recommendedAction,
    };
  }
}
