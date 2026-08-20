import {
  SiliconRegressionObservation,
  RegressionCauseCandidate,
} from "./silicon-regression.types";

export class RegressionCauseEngine {
  /**
   * Evaluates differences between two observations to detect candidate cause explanations.
   * Note: isCausallyEstablished strictly defaults to false (correlation does not equal established causation).
   */
  static detectCauseCandidates(
    baseline: SiliconRegressionObservation,
    candidate: SiliconRegressionObservation
  ): RegressionCauseCandidate[] {
    const candidates: RegressionCauseCandidate[] = [];

    // 1. Driver Change
    if (baseline.driver && candidate.driver && baseline.driver !== candidate.driver) {
      candidates.push({
        category: "DRIVER_CHANGE",
        dimension: "driver",
        baselineValue: baseline.driver,
        candidateValue: candidate.driver,
        plausibility: "HIGH",
        isCausallyEstablished: false,
      });
    }

    // 2. Firmware Change
    if (baseline.firmware && candidate.firmware && baseline.firmware !== candidate.firmware) {
      candidates.push({
        category: "FIRMWARE_CHANGE",
        dimension: "firmware",
        baselineValue: baseline.firmware,
        candidateValue: candidate.firmware,
        plausibility: "HIGH",
        isCausallyEstablished: false,
      });
    }

    // 3. BIOS Change
    if (baseline.bios && candidate.bios && baseline.bios !== candidate.bios) {
      candidates.push({
        category: "BIOS_CHANGE",
        dimension: "bios",
        baselineValue: baseline.bios,
        candidateValue: candidate.bios,
        plausibility: "MEDIUM",
        isCausallyEstablished: false,
      });
    }

    // 4. Benchmark or App Version Change
    if (
      baseline.benchmarkVersion &&
      candidate.benchmarkVersion &&
      baseline.benchmarkVersion !== candidate.benchmarkVersion
    ) {
      candidates.push({
        category: "BENCHMARK_VERSION_CHANGE",
        dimension: "benchmarkVersion",
        baselineValue: baseline.benchmarkVersion,
        candidateValue: candidate.benchmarkVersion,
        plausibility: "HIGH",
        isCausallyEstablished: false,
      });
    }

    if (
      baseline.appGameVersion &&
      candidate.appGameVersion &&
      baseline.appGameVersion !== candidate.appGameVersion
    ) {
      candidates.push({
        category: "APPLICATION_VERSION_CHANGE",
        dimension: "appGameVersion",
        baselineValue: baseline.appGameVersion,
        candidateValue: candidate.appGameVersion,
        plausibility: "HIGH",
        isCausallyEstablished: false,
      });
    }

    // 5. Thermal Conditions Change
    if (
      typeof baseline.thermalConditionsCelsius === "number" &&
      typeof candidate.thermalConditionsCelsius === "number" &&
      Math.abs(baseline.thermalConditionsCelsius - candidate.thermalConditionsCelsius) >= 3
    ) {
      candidates.push({
        category: "THERMAL_CHANGE",
        dimension: "thermalConditionsCelsius",
        baselineValue: `${baseline.thermalConditionsCelsius}°C`,
        candidateValue: `${candidate.thermalConditionsCelsius}°C`,
        plausibility: "MEDIUM",
        isCausallyEstablished: false,
      });
    }

    // 6. Power Limit Change
    if (
      typeof baseline.powerLimitWatts === "number" &&
      typeof candidate.powerLimitWatts === "number" &&
      Math.abs(baseline.powerLimitWatts - candidate.powerLimitWatts) >= 5
    ) {
      candidates.push({
        category: "POWER_LIMIT_CHANGE",
        dimension: "powerLimitWatts",
        baselineValue: `${baseline.powerLimitWatts}W`,
        candidateValue: `${candidate.powerLimitWatts}W`,
        plausibility: "HIGH",
        isCausallyEstablished: false,
      });
    }

    // 7. Memory Configuration Change
    if (
      baseline.memoryConfig &&
      candidate.memoryConfig &&
      baseline.memoryConfig !== candidate.memoryConfig
    ) {
      candidates.push({
        category: "MEMORY_CONFIGURATION_CHANGE",
        dimension: "memoryConfig",
        baselineValue: baseline.memoryConfig,
        candidateValue: candidate.memoryConfig,
        plausibility: "MEDIUM",
        isCausallyEstablished: false,
      });
    }

    // 8. Hardware SKU / Architecture Variance
    if (baseline.sku !== candidate.sku) {
      candidates.push({
        category: "HARDWARE_VARIANCE",
        dimension: "sku",
        baselineValue: baseline.sku,
        candidateValue: candidate.sku,
        plausibility: "HIGH",
        isCausallyEstablished: false,
      });
    }

    return candidates;
  }
}
