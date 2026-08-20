import {
  CoDesignScenario,
  EmpiricalBaseline,
  CoDesignSimulationResult,
  EmpiricalAlignmentRecord,
  ParameterSensitivityEntry,
  CoDesignHealthReconciliationRecord,
  CoDesignOpportunity,
  CoDesignLineageTrace,
} from "./co-design.types";
import { CoDesignBaselineEngine } from "./co-design.baseline.engine";
import { CoDesignScenarioEngine } from "./co-design.scenario.engine";
import { CoDesignSimulationEngine } from "./co-design.simulation.engine";
import { CoDesignSensitivityEngine } from "./co-design.sensitivity.engine";
import { CoDesignEmpiricalAlignmentEngine } from "./co-design.empirical-alignment.engine";
import { CoDesignReconciliationEngine } from "./co-design.reconciliation.engine";
import { CoDesignOpportunityEngine } from "./co-design.opportunity.engine";
import { CoDesignValidationBridge } from "./co-design.validation.engine";
import { CoDesignLineageEngine } from "./co-design.lineage.engine";
import { CoDesignSnapshotEngine } from "./co-design.snapshot.engine";
import { CoDesignAuditService } from "./co-design.audit";
import { CoDesignParameterEngine } from "./co-design.parameter.engine";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

export class CoDesignWorkbenchProvider {
  private static scenarioStore: Map<string, CoDesignScenario[]> = new Map();
  private static baselineStore: Map<string, EmpiricalBaseline[]> = new Map();
  private static simulationStore: Map<string, CoDesignSimulationResult[]> = new Map();
  private static opportunityStore: Map<string, CoDesignOpportunity[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  private static initializeStateIfMissing(researchRunId: string, userId: string) {
    const key = this.getPartitionKey(researchRunId, userId);
    let scenarios = this.scenarioStore.get(key);
    let baselines = this.baselineStore.get(key);
    let simulations = this.simulationStore.get(key);
    let opps = this.opportunityStore.get(key);

    if (!baselines) {
      baselines = CoDesignBaselineEngine.createDefaultBaselines(userId, researchRunId);
      this.baselineStore.set(key, baselines);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("baselineStore", "Artifact", key, baselines).catch(e => console.warn(e));
    }

    if (!scenarios) {
      const scenario1 = CoDesignScenarioEngine.createScenario({
        userId,
        researchRunId,
        title: "Blackwell RTX 5090 Memory & Clock Co-Design Scenario",
        description: "Evaluating +10% memory bandwidth scaling and +5% core clock uplift against empirical 4K RT baseline.",
        baselineId: baselines[0].baselineId,
        targetHardware: baselines[0].gpuModel,
      });

      // Adjust parameter to simulate hypothetical intervention
      const updatedParams = CoDesignParameterEngine.updateParameterValue(
        scenario1.parameters,
        "memoryBandwidthGbps",
        2048 // +14.2% bandwidth
      );

      const scenarioWithIntervention = CoDesignScenarioEngine.createRevision(scenario1, updatedParams);
      scenarios = [scenarioWithIntervention];
      this.scenarioStore.set(key, scenarios);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("scenarioStore", "Artifact", key, scenarios).catch(e => console.warn(e));

      CoDesignAuditService.log(
        userId,
        researchRunId,
        "SCENARIO_CREATED",
        scenarioWithIntervention.scenarioId,
        "creator-system",
        "Initialized default Co-Design Workbench scenario."
      );
    }

    return { scenarios, baselines, simulations, opps };
  }

  public static getState(researchRunId: string, userId: string) {
    const { scenarios, baselines } = this.initializeStateIfMissing(researchRunId, userId);

    const simulations: CoDesignSimulationResult[] = [];
    const alignments: EmpiricalAlignmentRecord[] = [];
    const sensitivityList: { scenarioId: string; sensitivities: ParameterSensitivityEntry[] }[] = [];
    const reconciliations: CoDesignHealthReconciliationRecord[] = [];
    const allOpportunities: CoDesignOpportunity[] = [];

    for (const scenario of scenarios) {
      const baseline = baselines.find((b) => b.baselineId === scenario.baselineId) || baselines[0];
      const simulation = CoDesignSimulationEngine.simulateScenario(scenario, baseline);
      const alignment = CoDesignEmpiricalAlignmentEngine.evaluateAlignment(scenario, baseline, simulation);
      const sensitivities = CoDesignSensitivityEngine.computeSensitivity(scenario, baseline);
      const reconciliation = CoDesignReconciliationEngine.reconcileWithResearchHealth(
        scenario,
        simulation,
        alignment,
        researchRunId,
        ["Cyberpunk 2077 4K RT Overdrive Throughput Benchmark"]
      );

      const opps = CoDesignOpportunityEngine.generateOpportunities({
        userId,
        researchRunId,
        scenario,
        simulation,
        alignment,
      });

      simulations.push(simulation);
      alignments.push(alignment);
      sensitivityList.push({ scenarioId: scenario.scenarioId, sensitivities });
      reconciliations.push(reconciliation);
      allOpportunities.push(...opps);
    }

    this.simulationStore.set(this.getPartitionKey(researchRunId, userId), simulations);
    this.opportunityStore.set(this.getPartitionKey(researchRunId, userId), allOpportunities);

    const snapshot = CoDesignSnapshotEngine.createSnapshot(
      userId,
      researchRunId,
      scenarios,
      baselines,
      simulations,
      alignments,
      allOpportunities,
      reconciliations
    );

    const history = CoDesignAuditService.getLedger(researchRunId, userId);

    return {
      scenarios,
      baselines,
      simulations,
      alignments,
      sensitivityList,
      reconciliations,
      opportunities: allOpportunities,
      snapshot,
      history,
    };
  }

  public static createScenario(
    researchRunId: string,
    userId: string,
    params: Partial<CoDesignScenario>
  ): CoDesignScenario {
    const { scenarios } = this.initializeStateIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const scenario = CoDesignScenarioEngine.createScenario({
      userId,
      researchRunId,
      ...params,
    });

    scenarios.push(scenario);
    this.scenarioStore.set(key, scenarios);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("scenarioStore", "Artifact", key, scenarios).catch(e => console.warn(e));

    CoDesignAuditService.log(
      userId,
      researchRunId,
      "SCENARIO_CREATED",
      scenario.scenarioId,
      "creator-lead",
      `Created co-design scenario '${scenario.title}'.`
    );

    return scenario;
  }

  public static updateScenarioParameter(
    researchRunId: string,
    userId: string,
    scenarioId: string,
    parameterId: string,
    newValue: number
  ): CoDesignScenario | null {
    const { scenarios } = this.initializeStateIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const scenarioIndex = scenarios.findIndex((s) => s.scenarioId === scenarioId);
    if (scenarioIndex === -1) return null;

    const currentScenario = scenarios[scenarioIndex];
    const updatedParameters = CoDesignParameterEngine.updateParameterValue(
      currentScenario.parameters,
      parameterId,
      newValue
    );

    const revisedScenario = CoDesignScenarioEngine.createRevision(currentScenario, updatedParameters);
    scenarios[scenarioIndex] = revisedScenario;
    this.scenarioStore.set(key, scenarios);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("scenarioStore", "Artifact", key, scenarios).catch(e => console.warn(e));

    CoDesignAuditService.log(
      userId,
      researchRunId,
      "SCENARIO_MODIFIED",
      revisedScenario.scenarioId,
      "creator-lead",
      `Updated parameter '${parameterId}' to ${newValue} (Revision ${revisedScenario.revision}).`
    );

    return revisedScenario;
  }

  public static validateOpportunity(
    researchRunId: string,
    userId: string,
    opportunityId: string
  ) {
    const state = this.getState(researchRunId, userId);
    const opp = state.opportunities.find((o) => o.opportunityId === opportunityId);

    if (!opp) {
      return { success: false, message: "Co-design opportunity not found." };
    }

    return CoDesignValidationBridge.bridgeOpportunityToCalibration(opp, userId, researchRunId);
  }

  public static getLineage(
    researchRunId: string,
    userId: string,
    simulationId: string
  ): CoDesignLineageTrace | null {
    const state = this.getState(researchRunId, userId);
    const sim = state.simulations.find((s) => s.simulationId === simulationId) || state.simulations[0];
    if (!sim) return null;

    const scenario = state.scenarios.find((s) => s.scenarioId === sim.scenarioId) || state.scenarios[0];
    const baseline = state.baselines.find((b) => b.baselineId === sim.baselineId) || state.baselines[0];
    const alignment = state.alignments.find((a) => a.simulationId === sim.simulationId) || state.alignments[0];
    const healthRec = state.reconciliations[0];

    return CoDesignLineageEngine.generateTrace(scenario, baseline, sim, alignment, healthRec);
  }
}
