import crypto from "node:crypto";
import {
  ForecastResearchOpportunity,
  ArchitecturalDegradationForecast,
  MicrocodeSimulationResult,
} from "./architectural-forecast.types";

export class ForecastResearchOpportunityEngine {
  /**
   * Identifies research opportunities from projected degradation trajectories.
   */
  static generateFromForecast(
    forecast: ArchitecturalDegradationForecast
  ): ForecastResearchOpportunity | null {
    if (forecast.projectedTrajectory.length === 0) return null;

    const lastStep = forecast.projectedTrajectory[forecast.projectedTrajectory.length - 1];
    if (lastStep.projectedDeltaPercentage >= -3) return null;

    const oppId = `fro-f-${crypto
      .createHash("sha256")
      .update(`${forecast.forecastId}:${lastStep.projectedDeltaPercentage}`)
      .digest("hex")
      .substring(0, 10)}`;

    let priority: ForecastResearchOpportunity["priority"] = "MEDIUM";
    if (lastStep.projectedDeltaPercentage < -10) priority = "CRITICAL";
    else if (lastStep.projectedDeltaPercentage < -6) priority = "HIGH";

    return {
      opportunityId: oppId,
      title: `Investigate Projected ${Math.abs(lastStep.projectedDeltaPercentage)}% Degradation on ${
        forecast.sku
      }`,
      description: `Longitudinal trajectory extrapolates an empirical delta of ${lastStep.projectedDeltaPercentage}% in ${forecast.benchmarkSuite}.`,
      triggeringForecastId: forecast.forecastId,
      affectedArchitecture: forecast.architecture,
      affectedSKUs: [forecast.sku],
      affectedBenchmarks: [forecast.benchmarkSuite],
      modeledDeltaPercentage: lastStep.projectedDeltaPercentage,
      hypothesis: `Future compiler or driver scheduler changes may exacerbate pipeline stalls on ${forecast.sku}.`,
      evidenceGap: `Extrapolated trajectory requires formal hardware testbench validation across future driver releases.`,
      priority,
      status: "IDENTIFIED",
      evidenceBoundary:
        "EPISTEMIC BOUNDARY: This research opportunity originates from a predictive model. It does not constitute a verified claim or citation.",
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Identifies research opportunities from severe microcode simulation overheads.
   */
  static generateFromSimulation(
    simulation: MicrocodeSimulationResult
  ): ForecastResearchOpportunity | null {
    if (simulation.simulatedDeltaPercentage > -5) return null;

    const oppId = `fro-s-${crypto
      .createHash("sha256")
      .update(`${simulation.simulationId}:${simulation.simulatedDeltaPercentage}`)
      .digest("hex")
      .substring(0, 10)}`;

    let priority: ForecastResearchOpportunity["priority"] = "HIGH";
    if (simulation.simulatedDeltaPercentage < -12) priority = "CRITICAL";

    return {
      opportunityId: oppId,
      title: `Validate Simulated ${Math.abs(simulation.simulatedDeltaPercentage)}% Mitigation Overhead on ${
        simulation.sku
      }`,
      description: `Scenario ${simulation.scenarioId} simulates severe throughput reduction on ${simulation.benchmarkSuite}.`,
      triggeringSimulationId: simulation.simulationId,
      affectedArchitecture: "Target Architecture",
      affectedSKUs: [simulation.sku],
      affectedBenchmarks: [simulation.benchmarkSuite],
      modeledDeltaPercentage: simulation.simulatedDeltaPercentage,
      hypothesis: `Mitigation barrier invalidates transient vector state, degrading branch-heavy workload throughput.`,
      evidenceGap: `Simulated mitigation overhead requires controlled physical testbench measurement with microcode patch loaded.`,
      priority,
      status: "IDENTIFIED",
      evidenceBoundary:
        "EPISTEMIC BOUNDARY: This opportunity originates from a simulated scenario. It MUST NOT mutate verified factual claims without laboratory proof.",
      createdAt: new Date().toISOString(),
    };
  }
}
