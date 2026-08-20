import {
  MicroarchitecturalTrace,
  ConfounderAssessment,
} from "./microarchitectural-attribution.types";

export class ConfounderEngine {
  public static assessConfounders(
    traceA: MicroarchitecturalTrace,
    traceB: MicroarchitecturalTrace
  ): ConfounderAssessment {
    const identifiedConfounders: string[] = [];

    const driverVariance = traceA.driverVersion !== traceB.driverVersion;
    if (driverVariance) {
      identifiedConfounders.push(`Driver Version Delta: ${traceA.driverVersion} vs ${traceB.driverVersion}`);
    }

    const firmwareVariance = traceA.firmwareVersion !== traceB.firmwareVersion;
    if (firmwareVariance) {
      identifiedConfounders.push(`Firmware Delta: ${traceA.firmwareVersion} vs ${traceB.firmwareVersion}`);
    }

    const biosVariance = traceA.biosVersion !== traceB.biosVersion;
    if (biosVariance) {
      identifiedConfounders.push(`BIOS Delta: ${traceA.biosVersion} vs ${traceB.biosVersion}`);
    }

    const thermalVariance =
      traceA.observedTemperatureCelsius && traceB.observedTemperatureCelsius
        ? Math.abs(traceA.observedTemperatureCelsius - traceB.observedTemperatureCelsius) > 10
        : false;
    if (thermalVariance) {
      identifiedConfounders.push(`Thermal Delta: ${traceA.observedTemperatureCelsius}°C vs ${traceB.observedTemperatureCelsius}°C`);
    }

    const powerLimitVariance =
      traceA.powerLimitWatts && traceB.powerLimitWatts
        ? traceA.powerLimitWatts !== traceB.powerLimitWatts
        : false;
    if (powerLimitVariance) {
      identifiedConfounders.push(`Power Limit Delta: ${traceA.powerLimitWatts}W vs ${traceB.powerLimitWatts}W`);
    }

    const methodologyVariance =
      traceA.benchmarkSuite !== traceB.benchmarkSuite ||
      traceA.resolution !== traceB.resolution ||
      traceA.preset !== traceB.preset;
    if (methodologyVariance) {
      identifiedConfounders.push(`Methodology Variance: ${traceA.benchmarkSuite} (${traceA.resolution}) vs ${traceB.benchmarkSuite} (${traceB.resolution})`);
    }

    let confounderLevel: ConfounderAssessment["confounderLevel"] = "NO_CONFOUNDERS";
    if (methodologyVariance || identifiedConfounders.length > 3) {
      confounderLevel = "CONFOUNDED";
    } else if (identifiedConfounders.length === 3) {
      confounderLevel = "HIGH_CONFOUNDING";
    } else if (identifiedConfounders.length === 2) {
      confounderLevel = "MODERATE_CONFOUNDING";
    } else if (identifiedConfounders.length === 1) {
      confounderLevel = "LOW_CONFOUNDING";
    }

    return {
      confounderLevel,
      identifiedConfounders,
      driverVariance,
      firmwareVariance,
      biosVariance,
      thermalVariance,
      powerLimitVariance,
      methodologyVariance,
    };
  }
}
