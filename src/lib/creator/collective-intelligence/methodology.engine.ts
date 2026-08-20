import {
  NormalizedObservation,
  MethodologyAlignmentReport,
  MethodologyComparabilityState,
} from "./collective-intelligence.types";

export class MethodologyAlignmentEngine {
  /**
   * Evaluates methodology comparability between two normalized observations across 20 dimensions.
   */
  static alignObservations(
    obsA: NormalizedObservation,
    obsB: NormalizedObservation
  ): MethodologyAlignmentReport {
    const dimensionDifferences: string[] = [];
    const warnings: string[] = [];
    const changedCategories = new Set<string>();

    // 1. Suite & Metric Check
    const suiteA = (obsA.software.benchmarkSuite || "").toLowerCase().trim();
    const suiteB = (obsB.software.benchmarkSuite || "").toLowerCase().trim();
    const unitA = (obsA.measurement.unit || "").toLowerCase().trim();
    const unitB = (obsB.measurement.unit || "").toLowerCase().trim();

    if (suiteA !== suiteB) {
      dimensionDifferences.push(`Suite mismatch: "${obsA.software.benchmarkSuite}" vs "${obsB.software.benchmarkSuite}"`);
      changedCategories.add("SUITE");
    }

    if (unitA !== unitB) {
      dimensionDifferences.push(`Metric unit mismatch: "${obsA.measurement.unit}" vs "${obsB.measurement.unit}"`);
      changedCategories.add("SUITE");
    }

    // 2. Version Checks
    if (obsA.software.benchmarkVersion && obsB.software.benchmarkVersion && obsA.software.benchmarkVersion !== obsB.software.benchmarkVersion) {
      dimensionDifferences.push(`Benchmark version delta: v${obsA.software.benchmarkVersion} vs v${obsB.software.benchmarkVersion}`);
      changedCategories.add("VERSION");
    }

    if (obsA.software.appGameVersion && obsB.software.appGameVersion && obsA.software.appGameVersion !== obsB.software.appGameVersion) {
      dimensionDifferences.push(`Application version delta: v${obsA.software.appGameVersion} vs v${obsB.software.appGameVersion}`);
      changedCategories.add("VERSION");
    }

    // 3. Test Configuration Checks
    if (obsA.testConfig.resolution && obsB.testConfig.resolution && obsA.testConfig.resolution !== obsB.testConfig.resolution) {
      dimensionDifferences.push(`Resolution delta: ${obsA.testConfig.resolution} vs ${obsB.testConfig.resolution}`);
      changedCategories.add("CONFIG");
    }

    if (obsA.testConfig.preset && obsB.testConfig.preset && obsA.testConfig.preset !== obsB.testConfig.preset) {
      dimensionDifferences.push(`Quality preset delta: ${obsA.testConfig.preset} vs ${obsB.testConfig.preset}`);
      changedCategories.add("CONFIG");
    }

    if (obsA.testConfig.renderingApi && obsB.testConfig.renderingApi && obsA.testConfig.renderingApi !== obsB.testConfig.renderingApi) {
      dimensionDifferences.push(`Rendering API delta: ${obsA.testConfig.renderingApi} vs ${obsB.testConfig.renderingApi}`);
      changedCategories.add("CONFIG");
    }

    // 4. Feature Flags (Upscaling, FG, RT)
    if (obsA.testConfig.upscalingTechnology !== obsB.testConfig.upscalingTechnology) {
      dimensionDifferences.push(`Upscaling tech delta: ${obsA.testConfig.upscalingTechnology || "None"} vs ${obsB.testConfig.upscalingTechnology || "None"}`);
      changedCategories.add("FEATURES");
    }

    if (obsA.testConfig.upscalingMode !== obsB.testConfig.upscalingMode) {
      dimensionDifferences.push(`Upscaling mode delta: ${obsA.testConfig.upscalingMode || "Native"} vs ${obsB.testConfig.upscalingMode || "Native"}`);
      changedCategories.add("FEATURES");
    }

    if (Boolean(obsA.testConfig.frameGeneration) !== Boolean(obsB.testConfig.frameGeneration)) {
      dimensionDifferences.push(`Frame generation state mismatch: ${Boolean(obsA.testConfig.frameGeneration)} vs ${Boolean(obsB.testConfig.frameGeneration)}`);
      changedCategories.add("FEATURES");
    }

    if (Boolean(obsA.testConfig.rayTracing) !== Boolean(obsB.testConfig.rayTracing)) {
      dimensionDifferences.push(`Ray tracing state mismatch: ${Boolean(obsA.testConfig.rayTracing)} vs ${Boolean(obsB.testConfig.rayTracing)}`);
      changedCategories.add("FEATURES");
    }

    // 5. Environmental & Power Check
    if (obsA.testConfig.powerConditionsWatts && obsB.testConfig.powerConditionsWatts) {
      const pDiff = Math.abs(obsA.testConfig.powerConditionsWatts - obsB.testConfig.powerConditionsWatts);
      if (pDiff > 10) {
        dimensionDifferences.push(`Power condition delta: ${obsA.testConfig.powerConditionsWatts}W vs ${obsB.testConfig.powerConditionsWatts}W`);
        changedCategories.add("ENVIRONMENT");
      }
    }

    // 6. Driver Check
    if (obsA.software.driver && obsB.software.driver && obsA.software.driver !== obsB.software.driver) {
      warnings.push(`Driver version delta: ${obsA.software.driver} vs ${obsB.software.driver}`);
      changedCategories.add("DRIVER");
    }

    // Determine Comparability State
    let alignmentState: MethodologyComparabilityState = "DIRECTLY_COMPARABLE";
    let isDirectlyComparable = true;
    let explanation = "Test conditions and benchmark methodology are aligned across all recorded dimensions.";

    if (changedCategories.has("SUITE")) {
      alignmentState = "NOT_COMPARABLE";
      isDirectlyComparable = false;
      explanation = "Observations use divergent benchmark suites or incompatible metric units.";
    } else if (changedCategories.has("FEATURES") || changedCategories.has("CONFIG")) {
      if (changedCategories.size >= 3) {
        alignmentState = "NOT_COMPARABLE";
        isDirectlyComparable = false;
        explanation = "Multiple critical testing dimensions (resolution/preset/upscaling/RT) diverge significantly.";
      } else {
        alignmentState = "COMPARABLE_WITH_CAVEATS";
        isDirectlyComparable = false;
        explanation = "Observations share benchmark suite but differ in quality preset or upscaling configuration.";
      }
    } else if (dimensionDifferences.length > 0 || warnings.length > 0) {
      alignmentState = "COMPARABLE_WITH_CAVEATS";
      isDirectlyComparable = true;
      explanation = "Minor software or driver discrepancies detected, but core workload configuration is comparable.";
    }

    return {
      alignmentState,
      dimensionDifferences,
      warnings,
      explanation,
      isDirectlyComparable,
    };
  }
}
