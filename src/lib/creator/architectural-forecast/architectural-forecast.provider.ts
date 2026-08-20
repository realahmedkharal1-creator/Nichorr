export * from "./architectural-forecast.types";
import {
  ArchitecturalDegradationForecast,
  MicrocodeSimulationScenario,
  MicrocodeSimulationResult,
  InstructionSetDeprecationSimulation,
  ForecastResearchOpportunity,
  ArchitecturalDegradationMatrix,
  ForecastSnapshot,
  ForecastLineageTrace,
  ForecastAuditEvent,
} from "./architectural-forecast.types";
import { ArchitecturalForecastEngine } from "./forecast.engine";
import { MicrocodeSimulationEngine } from "./microcode-simulation.engine";
import { InstructionSetDeprecationEngine } from "./instruction-set-simulation.engine";
import { ScenarioEngine } from "./scenario.engine";
import { ArchitecturalDegradationMatrixEngine } from "./matrix.engine";
import { ForecastResearchOpportunityEngine } from "./opportunity.engine";
import { ForecastLineageEngine } from "./lineage.engine";
import { ArchitecturalForecastSnapshotEngine } from "./architectural-forecast.snapshot";
import { ArchitecturalForecastAuditService } from "./architectural-forecast.audit";
import { SiliconRegressionProvider } from "../silicon-regression/silicon-regression.provider";
import { CreatorCertificationProvider } from "../certification/creator-certification.provider";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForForecast = globalThis as unknown as {
  forecastsStore: Map<string, ArchitecturalDegradationForecast[]> | undefined;
  simulationsStore: Map<string, MicrocodeSimulationResult[]> | undefined;
  scenariosStore: Map<string, MicrocodeSimulationScenario[]> | undefined;
  deprecationsStore: Map<string, InstructionSetDeprecationSimulation[]> | undefined;
  opportunitiesStore: Map<string, ForecastResearchOpportunity[]> | undefined;
};

const forecastsStore =
  globalForForecast.forecastsStore ?? new Map<string, ArchitecturalDegradationForecast[]>();
const simulationsStore =
  globalForForecast.simulationsStore ?? new Map<string, MicrocodeSimulationResult[]>();
const scenariosStore =
  globalForForecast.scenariosStore ?? new Map<string, MicrocodeSimulationScenario[]>();
const deprecationsStore =
  globalForForecast.deprecationsStore ??
  new Map<string, InstructionSetDeprecationSimulation[]>();
const opportunitiesStore =
  globalForForecast.opportunitiesStore ??
  new Map<string, ForecastResearchOpportunity[]>();

if (process.env.NODE_ENV !== "production") {
  globalForForecast.forecastsStore = forecastsStore;
  globalForForecast.simulationsStore = simulationsStore;
  globalForForecast.scenariosStore = scenariosStore;
  globalForForecast.deprecationsStore = deprecationsStore;
  globalForForecast.opportunitiesStore = opportunitiesStore;
}

export class ArchitecturalForecastProvider {
  /**
   * Retrieves or initializes scenarios for a user workspace and research run.
   */
  static getScenarios(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): MicrocodeSimulationScenario[] {
    const key = `${userId}:${researchRunId}`;
    let list = scenariosStore.get(key);
    if (!list || list.length === 0) {
      list = ScenarioEngine.getDefaultScenarios(researchRunId, userId);
      scenariosStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("scenariosStore", "Artifact", key, list).catch(e => console.warn(e));
    }
    return [...list];
  }

  /**
   * Creates a custom simulation scenario.
   */
  static createScenario(
    researchRunId: string,
    userId: string = "anonymous-creator",
    name: string,
    assumedOverheadPercentage: number,
    sensitivityFactors: any[] = [],
    description: string = "Custom user scenario"
  ): MicrocodeSimulationScenario {
    const key = `${userId}:${researchRunId}`;
    const list = this.getScenarios(researchRunId, userId);
    const scenario = ScenarioEngine.createCustomScenario(
      researchRunId,
      userId,
      name,
      assumedOverheadPercentage,
      sensitivityFactors,
      description
    );
    list.push(scenario);
    scenariosStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("scenariosStore", "Artifact", key, list).catch(e => console.warn(e));

    ArchitecturalForecastAuditService.logEvent(
      userId,
      researchRunId,
      "SCENARIO_CREATED",
      scenario.scenarioId,
      `Custom scenario created with ${assumedOverheadPercentage}% overhead.`,
      { afterState: scenario.overheadCategory }
    );

    return scenario;
  }

  /**
   * Retrieves or computes forecasts for a user workspace and research run.
   */
  static getForecasts(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ArchitecturalDegradationForecast[] {
    const key = `${userId}:${researchRunId}`;
    let list = forecastsStore.get(key);

    if (!list || list.length === 0) {
      list = [];
      const observations = SiliconRegressionProvider.getObservations(researchRunId, userId);

      // Check Phase 79 certification & release locks
      const cert = CreatorCertificationProvider.getCertificate(researchRunId, userId);
      const blockers =
        cert && (cert.status === "BLOCKED" || cert.status === "INVALIDATED")
          ? ["CERTIFICATION_INVALIDATED"]
          : [];

      // Group observations by (sku, benchmarkSuite)
      const groupMap = new Map<string, typeof observations>();
      for (const obs of observations) {
        const gKey = `${obs.sku}:${obs.benchmarkSuite}`;
        const gList = groupMap.get(gKey) || [];
        gList.push(obs);
        groupMap.set(gKey, gList);
      }

      for (const [, obsList] of groupMap.entries()) {
        const forecast = ArchitecturalForecastEngine.generateForecast(
          researchRunId,
          userId,
          obsList,
          { blockers }
        );
        list.push(forecast);

        // Generate research opportunity if degradation exceeds threshold
        const opp = ForecastResearchOpportunityEngine.generateFromForecast(forecast);
        if (opp) {
          const currentOpps = opportunitiesStore.get(key) || [];
          if (!currentOpps.some((o) => o.opportunityId === opp.opportunityId)) {
            currentOpps.push(opp);
            opportunitiesStore.set(key, currentOpps);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, currentOpps).catch(e => console.warn(e));
          }
        }
      }

      forecastsStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("forecastsStore", "Artifact", key, list).catch(e => console.warn(e));

      ArchitecturalForecastAuditService.logEvent(
        userId,
        researchRunId,
        "FORECAST_CREATED",
        `forecast-batch-${researchRunId}`,
        `Initialized ${list.length} architectural degradation forecasts.`
      );
    }

    return [...list];
  }

  /**
   * Retrieves a single forecast by ID.
   */
  static getForecastById(
    researchRunId: string,
    userId: string = "anonymous-creator",
    forecastId: string
  ): ArchitecturalDegradationForecast | undefined {
    const list = this.getForecasts(researchRunId, userId);
    return list.find((f) => f.forecastId === forecastId);
  }

  /**
   * Retrieves microcode simulation results.
   */
  static getSimulations(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): MicrocodeSimulationResult[] {
    const key = `${userId}:${researchRunId}`;
    let list = simulationsStore.get(key);

    if (!list || list.length === 0) {
      list = [];
      const observations = SiliconRegressionProvider.getObservations(researchRunId, userId);
      const scenarios = this.getScenarios(researchRunId, userId);

      if (observations.length > 0 && scenarios.length > 0) {
        const baselineObs = observations[0];
        const scenario = scenarios[2] || scenarios[0]; // moderate or baseline

        const simResult = MicrocodeSimulationEngine.simulateMitigationImpact(
          researchRunId,
          userId,
          baselineObs,
          scenario
        );
        list.push(simResult);

        const opp = ForecastResearchOpportunityEngine.generateFromSimulation(simResult);
        if (opp) {
          const currentOpps = opportunitiesStore.get(key) || [];
          if (!currentOpps.some((o) => o.opportunityId === opp.opportunityId)) {
            currentOpps.push(opp);
            opportunitiesStore.set(key, currentOpps);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, currentOpps).catch(e => console.warn(e));
          }
        }
      }

      simulationsStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("simulationsStore", "Artifact", key, list).catch(e => console.warn(e));
    }

    return [...list];
  }

  /**
   * Runs a microcode simulation scenario against an observation.
   */
  static runSimulation(
    researchRunId: string,
    userId: string = "anonymous-creator",
    scenarioId: string,
    sku?: string,
    benchmarkSuite?: string
  ): MicrocodeSimulationResult {
    const key = `${userId}:${researchRunId}`;
    const observations = SiliconRegressionProvider.getObservations(researchRunId, userId);
    const scenarios = this.getScenarios(researchRunId, userId);

    const scenario = scenarios.find((s) => s.scenarioId === scenarioId) || scenarios[0];
    let obs = observations.find(
      (o) =>
        (!sku || o.sku.toLowerCase() === sku.toLowerCase()) &&
        (!benchmarkSuite || o.benchmarkSuite.toLowerCase() === benchmarkSuite.toLowerCase())
    );

    if (!obs && observations.length > 0) {
      obs = observations[0];
    }

    if (!obs) {
      obs = {
        observationId: "obs-fallback",
        researchRunId,
        userId,
        architecture: "Blackwell",
        generation: "RTX 50 Series",
        sku: sku || "GeForce RTX 5090",
        hardwareFingerprint: "hw-5090-001",
        driver: "565.90",
        benchmarkSuite: benchmarkSuite || "Cyberpunk 2077 (4K Ultra RT)",
        resolution: "3840x2160",
        preset: "Ray Tracing Overdrive",
        renderingApi: "DirectX 12",
        measuredScore: 112.5,
        metricUnit: "fps",
        sourcePublisher: "VeritasTech Hardware Lab",
        evidenceSnapshotHash: "snap-evid-default",
        observedAt: new Date().toISOString(),
      };
    }

    const sim = MicrocodeSimulationEngine.simulateMitigationImpact(
      researchRunId,
      userId,
      obs,
      scenario
    );

    const list = this.getSimulations(researchRunId, userId);
    list.push(sim);
    simulationsStore.set(key, list);
    CreatorIntelligenceRepo.saveArtifact("simulationsStore", "Artifact", key, list).catch(e => console.warn(e));

    // Check opportunity
    const opp = ForecastResearchOpportunityEngine.generateFromSimulation(sim);
    if (opp) {
      const opps = this.getOpportunities(researchRunId, userId);
      if (!opps.some((o) => o.opportunityId === opp.opportunityId)) {
        opps.push(opp);
        opportunitiesStore.set(key, opps);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, opps).catch(e => console.warn(e));
      }
    }

    ArchitecturalForecastAuditService.logEvent(
      userId,
      researchRunId,
      "SIMULATION_CREATED",
      sim.simulationId,
      `Simulated ${sim.assumedOverheadPercentage}% mitigation impact on ${sim.sku}.`,
      { afterState: "SIMULATED_ESTIMATE" }
    );

    return sim;
  }

  /**
   * Retrieves instruction-set deprecation simulations.
   */
  static getDeprecationSimulations(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): InstructionSetDeprecationSimulation[] {
    const key = `${userId}:${researchRunId}`;
    let list = deprecationsStore.get(key);

    if (!list || list.length === 0) {
      list = [
        InstructionSetDeprecationEngine.simulateDeprecation(
          researchRunId,
          userId,
          "AVX-512 (Vector Intrinsic Emulation)",
          ["Intel Core Ultra 9 285K", "AMD Ryzen 9 9950X"],
          ["Cinebench 2024", "Blender Benchmark"],
          {
            fallbackPath: "AVX2 256-bit Vector Split Execution",
            modeledOverhead: 11.2,
          }
        ),
      ];
      deprecationsStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("deprecationsStore", "Artifact", key, list).catch(e => console.warn(e));
    }

    return [...list];
  }

  /**
   * Retrieves research validation opportunities.
   */
  static getOpportunities(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ForecastResearchOpportunity[] {
    const key = `${userId}:${researchRunId}`;
    let list = opportunitiesStore.get(key);
    if (!list) {
      list = [];
      opportunitiesStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, list).catch(e => console.warn(e));
    }
    return [...list];
  }

  /**
   * Bridges a forecast research opportunity to Phase 86 Research Validation Queue.
   */
  static validateOpportunity(
    researchRunId: string,
    userId: string = "anonymous-creator",
    opportunityId: string
  ): { success: boolean; opportunity: ForecastResearchOpportunity; validationTaskId: string } {
    const key = `${userId}:${researchRunId}`;
    const opps = this.getOpportunities(researchRunId, userId);
    const opp = opps.find((o) => o.opportunityId === opportunityId);

    if (!opp) {
      throw new Error(`Research opportunity "${opportunityId}" not found for user "${userId}".`);
    }

    opp.status = "QUEUED";
    opportunitiesStore.set(key, opps);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, opps).catch(e => console.warn(e));

    const validationTaskId = `val-task-${opportunityId.substring(0, 10)}`;

    ArchitecturalForecastAuditService.logEvent(
      userId,
      researchRunId,
      "VALIDATION_TASK_CREATED",
      opportunityId,
      `Opportunity bridged to Phase 86 Research Validation Queue.`,
      { afterState: "QUEUED", metadata: { validationTaskId } }
    );

    return {
      success: true,
      opportunity: opp,
      validationTaskId,
    };
  }

  /**
   * Compiles the complete Architectural Degradation Matrix.
   */
  static getMatrix(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ArchitecturalDegradationMatrix {
    const observations = SiliconRegressionProvider.getObservations(researchRunId, userId);
    const forecasts = this.getForecasts(researchRunId, userId);
    const simulations = this.getSimulations(researchRunId, userId);
    const opportunities = this.getOpportunities(researchRunId, userId);

    return ArchitecturalDegradationMatrixEngine.buildMatrix(
      researchRunId,
      userId,
      observations,
      forecasts,
      simulations,
      opportunities
    );
  }

  /**
   * Generates deterministic snapshot for the architectural forecast control plane.
   */
  static getSnapshot(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ForecastSnapshot {
    const matrix = this.getMatrix(researchRunId, userId);
    const opportunities = this.getOpportunities(researchRunId, userId);

    return ArchitecturalForecastSnapshotEngine.generateSnapshot(
      researchRunId,
      userId,
      matrix,
      opportunities
    );
  }

  /**
   * Generates 6-stage deterministic lineage trace for a forecast.
   */
  static getLineage(
    researchRunId: string,
    userId: string = "anonymous-creator",
    forecastId: string
  ): ForecastLineageTrace {
    const forecast = this.getForecastById(researchRunId, userId, forecastId);
    if (!forecast) {
      throw new Error(`Forecast "${forecastId}" not found for user "${userId}".`);
    }
    return ForecastLineageEngine.generateLineage(forecast);
  }

  /**
   * Retrieves immutable audit history.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ForecastAuditEvent[] {
    return ArchitecturalForecastAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears state (for testing).
   */
  static clearStore(): void {
    forecastsStore.clear();
    simulationsStore.clear();
    scenariosStore.clear();
    deprecationsStore.clear();
    opportunitiesStore.clear();
    ArchitecturalForecastAuditService.clearHistory();
  }
}
