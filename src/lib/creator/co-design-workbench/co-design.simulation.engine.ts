import crypto from "crypto";
import {
  CoDesignScenario,
  EmpiricalBaseline,
  CoDesignSimulationResult,
} from "./co-design.types";
import { CoDesignUncertaintyEngine } from "./co-design.uncertainty.engine";

export class CoDesignSimulationEngine {
  public static simulateScenario(
    scenario: CoDesignScenario,
    baseline: EmpiricalBaseline
  ): CoDesignSimulationResult {
    const params = scenario.parameters;

    const clock = params.clockFrequencyGhz?.currentValue || 2.85;
    const baseClock = params.clockFrequencyGhz?.baselineValue || 2.85;
    const clockScalingFactor = clock / (baseClock || 1);

    const ipc = params.baseIpc?.currentValue || 2.15;
    const baseIpc = params.baseIpc?.baselineValue || 2.15;
    const ipcScalingFactor = ipc / (baseIpc || 1);

    const memBw = params.memoryBandwidthGbps?.currentValue || 1792;
    const baseMemBw = params.memoryBandwidthGbps?.baselineValue || 1792;
    const memBwFactor = 1.0 + 0.35 * ((memBw - baseMemBw) / (baseMemBw || 1));

    const l3Lat = params.l3CacheLatencyCycles?.currentValue || 38;
    const baseL3Lat = params.l3CacheLatencyCycles?.baselineValue || 38;
    const l3LatFactor = 1.0 - 0.15 * ((l3Lat - baseL3Lat) / (baseL3Lat || 1));

    const driverOverhead = params.driverOverheadCyclesPct?.currentValue || 5.5;
    const baseDriverOverhead = params.driverOverheadCyclesPct?.baselineValue || 5.5;
    const driverFactor = 1.0 - 0.5 * ((driverOverhead - baseDriverOverhead) / 100);

    const compositeSpeedup =
      clockScalingFactor * 0.45 +
      ipcScalingFactor * 0.25 +
      memBwFactor * 0.20 +
      l3LatFactor * 0.05 +
      driverFactor * 0.05;

    const baselineScore = baseline.measuredScoreFPS || 100.0;
    const simulatedScoreFPS = Number((baselineScore * compositeSpeedup).toFixed(1));
    const deltaFPS = Number((simulatedScoreFPS - baselineScore).toFixed(1));
    const deltaPercentage = Number((((simulatedScoreFPS - baselineScore) / (baselineScore || 1)) * 100).toFixed(2));

    // Power simulation: dynamic clock scaling (f * V^2 approx f^1.6)
    const basePower = baseline.measuredPowerWatts || 440;
    const powerScaling = Math.pow(clockScalingFactor, 1.6);
    const powerLimit = params.powerLimitWatts?.currentValue || 500;
    const rawSimulatedPower = basePower * powerScaling;
    const simulatedPowerWatts = Number(Math.min(powerLimit, rawSimulatedPower).toFixed(1));

    const simulatedPerfPerWatt = Number((simulatedScoreFPS / (simulatedPowerWatts || 1)).toFixed(3));

    // Temperature modeling
    const baseTemp = baseline.measuredTemperatureCelsius || 65;
    const simulatedTemperatureCelsius = Number(
      Math.min(
        params.thermalCeilingCelsius?.currentValue || 88,
        baseTemp + (simulatedPowerWatts - basePower) * 0.15
      ).toFixed(1)
    );

    // Bottleneck distribution
    const rawMemStall = Math.max(5, 30.0 - (memBwFactor - 1.0) * 20.0);
    const rawCoreStall = Math.max(5, 25.0 * (1 / (ipcScalingFactor || 1)));
    const rawFrontendStall = Math.max(5, 18.0 * (1 / (driverFactor || 1)));
    const rawCacheStall = Math.max(5, 15.0 * (1 / (l3LatFactor || 1)));
    const rawBranchStall = 12.0;

    const totalStallRaw = rawMemStall + rawCoreStall + rawFrontendStall + rawCacheStall + rawBranchStall;

    const bottleneckDistribution: Record<string, number> = {
      MEMORY_BANDWIDTH: Number(((rawMemStall / totalStallRaw) * 100).toFixed(1)),
      CORE_EXECUTION: Number(((rawCoreStall / totalStallRaw) * 100).toFixed(1)),
      FRONTEND: Number(((rawFrontendStall / totalStallRaw) * 100).toFixed(1)),
      CACHE_HIERARCHY: Number(((rawCacheStall / totalStallRaw) * 100).toFixed(1)),
      BRANCH_PREDICTION: Number(((rawBranchStall / totalStallRaw) * 100).toFixed(1)),
    };

    const uncertaintyProfile = CoDesignUncertaintyEngine.calculateUncertainty(
      params,
      simulatedScoreFPS
    );

    const simulationId = `cdsim-${crypto
      .createHash("sha256")
      .update(`${scenario.scenarioFingerprint}:${baseline.baselineId}:${scenario.modelVersion}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      simulationId,
      scenarioId: scenario.scenarioId,
      scenarioRevision: scenario.revision,
      scenarioFingerprint: scenario.scenarioFingerprint,
      baselineId: baseline.baselineId,
      userId: scenario.userId,
      researchRunId: scenario.researchRunId,
      modelVersion: scenario.modelVersion,
      simulationClassification: "CO_DESIGN_SIMULATED_ESTIMATE",
      simulatedScoreFPS,
      simulatedPowerWatts,
      simulatedPerfPerWatt,
      simulatedTemperatureCelsius,
      baselineScoreFPS: baselineScore,
      deltaFPS,
      deltaPercentage,
      bottleneckDistribution,
      uncertaintyProfile,
      isCausallyEstablished: false, // Strict non-causal default
      epistemicBoundary: "OBSERVED EVIDENCE ≠ PHYSICAL MEASUREMENT ≠ SIMULATION ≠ CO-DESIGN SIMULATION ≠ VERIFIED RESEARCH EVIDENCE (isCausallyEstablished: false)",
      simulatedAt: new Date().toISOString(),
    };
  }
}
