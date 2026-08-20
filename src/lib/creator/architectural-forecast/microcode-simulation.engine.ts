import crypto from "node:crypto";
import {
  MicrocodeSimulationScenario,
  MicrocodeSimulationResult,
} from "./architectural-forecast.types";
import { SiliconRegressionObservation } from "../silicon-regression/silicon-regression.types";

export class MicrocodeSimulationEngine {
  /**
   * Simulates the hypothetical performance overhead of a microcode or security mitigation scenario.
   * Output strictly carries simulationClassification: 'SIMULATED_ESTIMATE' and cannot be converted to research evidence.
   */
  static simulateMitigationImpact(
    researchRunId: string,
    userId: string,
    baseline: SiliconRegressionObservation,
    scenario: MicrocodeSimulationScenario
  ): MicrocodeSimulationResult {
    let effectiveOverhead = scenario.assumedOverheadPercentage;
    const sensitivitiesApplied: string[] = [];

    // Apply workload sensitivity scaling
    if (scenario.sensitivityFactors.includes("BRANCH_SENSITIVITY")) {
      effectiveOverhead *= 1.25;
      sensitivitiesApplied.push("Branch prediction barrier penalty (x1.25)");
    }

    if (scenario.sensitivityFactors.includes("SYSCALL_SENSITIVITY")) {
      effectiveOverhead *= 1.4;
      sensitivitiesApplied.push("Kernel transition & syscall barrier penalty (x1.40)");
    }

    if (scenario.sensitivityFactors.includes("MEMORY_SENSITIVITY")) {
      effectiveOverhead *= 1.15;
      sensitivitiesApplied.push("TLB invalidation & page table isolation overhead (x1.15)");
    }

    if (scenario.sensitivityFactors.includes("RASTER_BOUND")) {
      effectiveOverhead *= 0.6;
      sensitivitiesApplied.push("GPU rasterization bottleneck dampens CPU mitigation impact (x0.60)");
    }

    effectiveOverhead = Number(effectiveOverhead.toFixed(1));

    const simulatedScore = Number(
      (baseline.measuredScore * (1 - effectiveOverhead / 100)).toFixed(1)
    );
    const simulatedDeltaPercentage = -effectiveOverhead;

    const simulationId = `mcs-${crypto
      .createHash("sha256")
      .update(`${baseline.observationId}:${scenario.scenarioId}:${effectiveOverhead}`)
      .digest("hex")
      .substring(0, 10)}`;

    const assumptions: string[] = [
      `Assumes ${scenario.name} mitigation parameters apply uniformly across ${baseline.sku}.`,
      `Base measurement: ${baseline.measuredScore} ${baseline.metricUnit} in ${baseline.benchmarkSuite}.`,
      `Effective modeled mitigation overhead: ${effectiveOverhead}% (${scenario.overheadCategory}).`,
      `Assumes no compensatory microarchitectural clock boost or driver re-optimization.`,
    ];

    return {
      simulationId,
      userId,
      researchRunId,
      scenarioId: scenario.scenarioId,
      sku: baseline.sku,
      benchmarkSuite: baseline.benchmarkSuite,
      baselineMeasuredScore: baseline.measuredScore,
      metricUnit: baseline.metricUnit,
      assumedOverheadPercentage: effectiveOverhead,
      simulatedScore,
      simulatedDeltaPercentage,
      simulationClassification: "SIMULATED_ESTIMATE",
      sensitivitiesApplied,
      assumptions,
      isStale: false,
      evidenceBoundary:
        "EPISTEMIC BOUNDARY: This is a mathematical simulation of hypothetical security mitigation overhead. It is NOT measured empirical evidence and MUST NOT be presented as verified benchmark data.",
      simulatedAt: new Date().toISOString(),
    };
  }
}
