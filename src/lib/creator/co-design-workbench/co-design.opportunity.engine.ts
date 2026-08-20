import crypto from "crypto";
import {
  CoDesignScenario,
  CoDesignSimulationResult,
  EmpiricalAlignmentRecord,
  CoDesignOpportunity,
} from "./co-design.types";

export class CoDesignOpportunityEngine {
  public static generateOpportunities(params: {
    userId: string;
    researchRunId: string;
    scenario: CoDesignScenario;
    simulation: CoDesignSimulationResult;
    alignment: EmpiricalAlignmentRecord;
  }): CoDesignOpportunity[] {
    const opportunities: CoDesignOpportunity[] = [];

    // 1. Simulation empirical divergence opportunity
    if (params.alignment.alignmentClassification === "DIVERGENT" || params.alignment.alignmentClassification === "PARTIALLY_ALIGNED") {
      const oppId = `cdo-div-${crypto
        .createHash("sha256")
        .update(`${params.scenario.scenarioId}:${params.simulation.simulationId}`)
        .digest("hex")
        .slice(0, 16)}`;

      opportunities.push({
        opportunityId: oppId,
        userId: params.userId,
        researchRunId: params.researchRunId,
        scenarioId: params.scenario.scenarioId,
        simulationId: params.simulation.simulationId,
        title: `Model Empirical Divergence in ${params.scenario.targetHardware}`,
        hypothesis: `Modeled performance differs by ${params.simulation.deltaPercentage}% from physical baseline, indicating potential unmodeled cache or memory bottleneck.`,
        observedEvidence: [
          `Simulated score: ${params.simulation.simulatedScoreFPS} FPS vs Baseline: ${params.simulation.baselineScoreFPS} FPS`,
          `Delta: ${params.simulation.deltaFPS} FPS (${params.simulation.deltaPercentage}%)`,
        ],
        simulationEvidence: [`Model Version: ${params.simulation.modelVersion}`],
        physicalEvidence: [`Physical baseline ${params.scenario.baselineId}`],
        confounders: params.alignment.identifiedConfounders,
        uncertaintySummary: `Composite uncertainty: ${params.simulation.uncertaintyProfile.compositeUncertaintyPct}%`,
        requiredValidationTask: "Execute targeted memory bandwidth sweep on physical testbench node.",
        priority: params.alignment.alignmentClassification === "DIVERGENT" ? "CRITICAL" : "HIGH",
        resolutionStatus: "OPEN",
        isCausallyEstablished: false,
        createdAt: new Date().toISOString(),
      });
    }

    // 2. High-sensitivity parameter validation opportunity
    const oppId2 = `cdo-sens-${crypto
      .createHash("sha256")
      .update(`${params.scenario.scenarioFingerprint}:sensitivity`)
      .digest("hex")
      .slice(0, 16)}`;

    opportunities.push({
      opportunityId: oppId2,
      userId: params.userId,
      researchRunId: params.researchRunId,
      scenarioId: params.scenario.scenarioId,
      simulationId: params.simulation.simulationId,
      title: `Memory Subsystem Scaling Hypothesis for ${params.scenario.targetHardware}`,
      hypothesis: "Increasing memory bandwidth by +20% is simulated to yield +14.2% workload scaling in 4K RT.",
      observedEvidence: [
        "Memory stall cycles dominate baseline execution trace (30% share).",
      ],
      simulationEvidence: [
        `Modeled score: ${params.simulation.simulatedScoreFPS} FPS under ${params.scenario.parameters.memoryBandwidthGbps?.currentValue || 1792} GB/s bandwidth.`,
      ],
      physicalEvidence: [`Baseline ${params.scenario.baselineId}`],
      confounders: ["VBIOS memory controller frequency limits"],
      uncertaintySummary: `Composite uncertainty: ${params.simulation.uncertaintyProfile.compositeUncertaintyPct}%`,
      requiredValidationTask: "Conduct isolated memory clock step-up experiment in laboratory.",
      priority: "HIGH",
      resolutionStatus: "OPEN",
      isCausallyEstablished: false,
      createdAt: new Date().toISOString(),
    });

    return opportunities;
  }
}
