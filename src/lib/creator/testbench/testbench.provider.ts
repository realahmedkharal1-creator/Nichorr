export * from "./testbench.types";
export * from "./testbench.audit";
export * from "./testbench.snapshot";
export * from "./capability-discovery.engine";
export * from "./bench-definition.engine";
export * from "./execution-plan.engine";
export * from "./authorization.engine";
export * from "./safety-interlock.engine";
export * from "./runner.engine";
export * from "./telemetry.engine";
export * from "./power-measurement.engine";
export * from "./thermal-measurement.engine";
export * from "./benchmark-result.engine";
export * from "./simulation-sandbox.engine";
export * from "./comparison.engine";
export * from "./opportunity.engine";
export * from "./validation.engine";
export * from "./lineage.engine";

import {
  TestbenchDefinition,
  BenchmarkExecutionPlan,
  PhysicalExperiment,
  PhysicalMeasurement,
  MicroarchitectureSimulation,
  ExperimentComparison,
  TestbenchResearchOpportunity,
  HardwareCapabilities,
  TestbenchSnapshot,
  TestbenchLineageTrace,
} from "./testbench.types";
import { TestbenchAuditService } from "./testbench.audit";
import { TestbenchSnapshotEngine } from "./testbench.snapshot";
import { HardwareCapabilityDiscoveryEngine } from "./capability-discovery.engine";
import { BenchDefinitionEngine } from "./bench-definition.engine";
import { ExecutionPlanEngine } from "./execution-plan.engine";
import { TestbenchRunnerEngine } from "./runner.engine";
import { MicroarchitectureSimulationSandboxEngine } from "./simulation-sandbox.engine";
import { ExperimentComparisonEngine } from "./comparison.engine";
import { TestbenchOpportunityEngine } from "./opportunity.engine";
import { TestbenchValidationBridgeEngine } from "./validation.engine";
import { TestbenchLineageEngine } from "./lineage.engine";
import { CreatorCertificationProvider } from "../certification/creator-certification.provider";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForTestbenchProvider = globalThis as unknown as {
  testbenchStore: Map<string, TestbenchDefinition[]> | undefined;
  testbenchPlanStore: Map<string, BenchmarkExecutionPlan[]> | undefined;
  testbenchExperimentStore: Map<string, PhysicalExperiment[]> | undefined;
  testbenchMeasurementStore: Map<string, PhysicalMeasurement[]> | undefined;
  testbenchSimulationStore: Map<string, MicroarchitectureSimulation[]> | undefined;
  testbenchComparisonStore: Map<string, ExperimentComparison[]> | undefined;
  testbenchOpportunityStore: Map<string, TestbenchResearchOpportunity[]> | undefined;
};

const testbenchStore =
  globalForTestbenchProvider.testbenchStore ?? new Map<string, TestbenchDefinition[]>();
const planStore =
  globalForTestbenchProvider.testbenchPlanStore ?? new Map<string, BenchmarkExecutionPlan[]>();
const experimentStore =
  globalForTestbenchProvider.testbenchExperimentStore ?? new Map<string, PhysicalExperiment[]>();
const measurementStore =
  globalForTestbenchProvider.testbenchMeasurementStore ?? new Map<string, PhysicalMeasurement[]>();
const simulationStore =
  globalForTestbenchProvider.testbenchSimulationStore ?? new Map<string, MicroarchitectureSimulation[]>();
const comparisonStore =
  globalForTestbenchProvider.testbenchComparisonStore ?? new Map<string, ExperimentComparison[]>();
const opportunityStore =
  globalForTestbenchProvider.testbenchOpportunityStore ?? new Map<string, TestbenchResearchOpportunity[]>();

if (process.env.NODE_ENV !== "production") {
  globalForTestbenchProvider.testbenchStore = testbenchStore;
  globalForTestbenchProvider.testbenchPlanStore = planStore;
  globalForTestbenchProvider.testbenchExperimentStore = experimentStore;
  globalForTestbenchProvider.testbenchMeasurementStore = measurementStore;
  globalForTestbenchProvider.testbenchSimulationStore = simulationStore;
  globalForTestbenchProvider.testbenchComparisonStore = comparisonStore;
  globalForTestbenchProvider.testbenchOpportunityStore = opportunityStore;
}

export class TestbenchProvider {
  /**
   * Discovers hardware and laboratory capabilities.
   */
  static getCapabilities(): HardwareCapabilities {
    return HardwareCapabilityDiscoveryEngine.discoverCapabilities();
  }

  /**
   * Retrieves testbenches for a given research run and user.
   */
  static getTestbenches(researchRunId: string, userId: string): TestbenchDefinition[] {
    const key = `${userId}:${researchRunId}`;
    let list = testbenchStore.get(key);
    if (!list || list.length === 0) {
      list = [
        BenchDefinitionEngine.createDefaultTestbench(researchRunId, userId, {
          testbenchId: "tb-primary-alpha",
          name: "Primary Silicon Testbench Rig Alpha",
          hardwareTarget: "GeForce RTX 5090 / Ryzen 9 9950X",
          architecture: "Blackwell / Zen 5",
        }),
      ];
      testbenchStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("testbenchStore", "Artifact", key, list).catch(e => console.warn(e));
      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "TESTBENCH_CREATED",
        targetId: list[0].testbenchId,
        afterState: list[0].status,
        reason: "Initialized baseline physical silicon testbench definition.",
      });
    }
    return list;
  }

  /**
   * Creates a new testbench definition.
   */
  static createTestbench(
    researchRunId: string,
    userId: string,
    definition: Partial<TestbenchDefinition>
  ): TestbenchDefinition {
    const key = `${userId}:${researchRunId}`;
    const list = this.getTestbenches(researchRunId, userId);
    const tb = BenchDefinitionEngine.createDefaultTestbench(researchRunId, userId, definition);
    list.push(tb);
    testbenchStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("testbenchStore", "Artifact", key, list).catch(e => console.warn(e));

    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "TESTBENCH_CREATED",
      targetId: tb.testbenchId,
      afterState: tb.status,
      reason: `Created custom testbench definition: ${tb.name}`,
    });

    return tb;
  }

  /**
   * Retrieves benchmark plans for a research run and user.
   */
  static getPlans(researchRunId: string, userId: string): BenchmarkExecutionPlan[] {
    const key = `${userId}:${researchRunId}`;
    let list = planStore.get(key);
    if (!list || list.length === 0) {
      const tbList = this.getTestbenches(researchRunId, userId);
      const plan = ExecutionPlanEngine.createPlan(tbList[0], {
        planId: "plan-cyberpunk-4k",
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        resolution: "3840x2160",
        preset: "Ray Tracing Overdrive",
        runCount: 3,
        warmupRuns: 1,
      });
      list = [plan];
      planStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("planStore", "Artifact", key, list).catch(e => console.warn(e));

      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "PLAN_CREATED",
        targetId: plan.planId,
        afterState: "CREATED",
        reason: `Generated execution plan with hash ${plan.executionPlanHash.slice(0, 12)}...`,
      });
    }
    return list;
  }

  /**
   * Creates a new execution plan.
   */
  static createPlan(
    researchRunId: string,
    userId: string,
    planData: Partial<BenchmarkExecutionPlan>
  ): BenchmarkExecutionPlan {
    const key = `${userId}:${researchRunId}`;
    const tbList = this.getTestbenches(researchRunId, userId);
    const targetTb = tbList.find((t) => t.testbenchId === planData.testbenchId) || tbList[0];
    const plan = ExecutionPlanEngine.createPlan(targetTb, planData);

    const list = this.getPlans(researchRunId, userId);
    list.push(plan);
    planStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("planStore", "Artifact", key, list).catch(e => console.warn(e));

    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "PLAN_CREATED",
      targetId: plan.planId,
      afterState: "CREATED",
      reason: `Created custom execution plan for ${plan.benchmarkSuite}`,
    });

    return plan;
  }

  /**
   * Retrieves physical experiments for a research run and user.
   */
  static getExperiments(researchRunId: string, userId: string): PhysicalExperiment[] {
    const key = `${userId}:${researchRunId}`;
    let list = experimentStore.get(key);
    if (!list || list.length === 0) {
      const plans = this.getPlans(researchRunId, userId);
      const tbList = this.getTestbenches(researchRunId, userId);

      const exp = TestbenchRunnerEngine.initializeExperiment(plans[0], tbList[0]);
      // Stage and execute baseline run
      const staged = TestbenchRunnerEngine.stageExperiment(exp, tbList[0], plans[0]);
      const authorized = TestbenchRunnerEngine.authorizeExperiment(staged, plans[0], "creator-lead");
      const executed = TestbenchRunnerEngine.runExperiment(authorized, plans[0], tbList[0]);

      list = [executed];
      experimentStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("experimentStore", "Artifact", key, list).catch(e => console.warn(e));

      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "EXPERIMENT_COMPLETED",
        targetId: executed.experimentId,
        afterState: executed.executionState,
        reason: `Completed physical baseline experiment (${executed.consolidatedScore} ${executed.metricUnit}).`,
      });
    }
    return list;
  }

  /**
   * Stages and authorizes an experiment, then runs it.
   */
  static runExperiment(
    researchRunId: string,
    userId: string,
    planId: string,
    authorizedBy: string = "creator-lead"
  ): PhysicalExperiment {
    const key = `${userId}:${researchRunId}`;
    const plans = this.getPlans(researchRunId, userId);
    const plan = plans.find((p) => p.planId === planId) || plans[0];
    const tbList = this.getTestbenches(researchRunId, userId);
    const tb = tbList.find((t) => t.testbenchId === plan.testbenchId) || tbList[0];

    // Check Phase 79 certification & blockers
    const cert = CreatorCertificationProvider.getCertificate(researchRunId, userId);
    const isCertificationValid = !cert || (cert.status !== "BLOCKED" && cert.status !== "INVALIDATED");

    const exp = TestbenchRunnerEngine.initializeExperiment(plan, tb);
    const staged = TestbenchRunnerEngine.stageExperiment(exp, tb, plan, {
      isCertificationValid,
    });

    if (staged.executionState === "BLOCKED") {
      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "SAFETY_BLOCKER_TRIGGERED",
        targetId: exp.experimentId,
        afterState: "BLOCKED",
        reason: `Experiment blocked by safety gate: ${staged.blockers.join(", ")}`,
      });
      return staged;
    }

    const authorized = TestbenchRunnerEngine.authorizeExperiment(staged, plan, authorizedBy);
    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "EXPERIMENT_AUTHORIZED",
      targetId: authorized.experimentId,
      afterState: "AUTHORIZED",
      reason: `Experiment authorized by ${authorizedBy}.`,
    });

    const executed = TestbenchRunnerEngine.runExperiment(authorized, plan, tb);

    const list = this.getExperiments(researchRunId, userId);
    list.push(executed);
    experimentStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("experimentStore", "Artifact", key, list).catch(e => console.warn(e));

    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "EXPERIMENT_COMPLETED",
      targetId: executed.experimentId,
      afterState: executed.executionState,
      reason: `Completed physical experiment (${executed.consolidatedScore} ${executed.metricUnit}).`,
    });

    return executed;
  }

  /**
   * Aborts an active experiment.
   */
  static abortExperiment(
    researchRunId: string,
    userId: string,
    experimentId: string,
    reason: string = "Creator manual emergency stop."
  ): PhysicalExperiment | null {
    const key = `${userId}:${researchRunId}`;
    const list = this.getExperiments(researchRunId, userId);
    const exp = list.find((e) => e.experimentId === experimentId);
    if (!exp) return null;

    const aborted = TestbenchRunnerEngine.abortExperiment(exp, reason);
    const idx = list.findIndex((e) => e.experimentId === experimentId);
    list[idx] = aborted;
    experimentStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("experimentStore", "Artifact", key, list).catch(e => console.warn(e));

    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "EXPERIMENT_ABORTED",
      targetId: aborted.experimentId,
      afterState: "FAILED",
      reason: `Emergency stop: ${reason}`,
    });

    return aborted;
  }

  /**
   * Retrieves microarchitectural sandbox simulations.
   */
  static getSimulations(researchRunId: string, userId: string): MicroarchitectureSimulation[] {
    const key = `${userId}:${researchRunId}`;
    let list = simulationStore.get(key);
    if (!list || list.length === 0) {
      const sim = MicroarchitectureSimulationSandboxEngine.runSimulation(researchRunId, userId, {
        targetArchitecture: "Blackwell",
        generation: "RTX 50 Series",
        sku: "GeForce RTX 5090",
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        baselinePhysicalScore: 112.5,
        modeledParameters: {
          branchMispredictPenaltyCycles: 16,
          vectorExecutionWidthBits: 512,
          l1DataCacheLatencyCycles: 4,
          l2CacheLatencyCycles: 14,
          l3CacheLatencyCycles: 45,
          memoryBandwidthGbps: 1792,
          syscallOverheadCycles: 300,
          clockFrequencyGhz: 5.7,
          powerCapWatts: 500,
        },
      });
      list = [sim];
      simulationStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("simulationStore", "Artifact", key, list).catch(e => console.warn(e));

      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "SIMULATION_EXECUTED",
        targetId: sim.simulationId,
        afterState: "COMPLETED",
        reason: `Executed sandbox simulation for ${sim.sku} (${sim.simulatedScore} ${sim.metricUnit}).`,
      });
    }
    return list;
  }

  /**
   * Runs a new microarchitectural sandbox simulation.
   */
  static runSimulation(
    researchRunId: string,
    userId: string,
    params: Parameters<typeof MicroarchitectureSimulationSandboxEngine.runSimulation>[2]
  ): MicroarchitectureSimulation {
    const key = `${userId}:${researchRunId}`;
    const sim = MicroarchitectureSimulationSandboxEngine.runSimulation(
      researchRunId,
      userId,
      params
    );

    const list = this.getSimulations(researchRunId, userId);
    list.push(sim);
    simulationStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("simulationStore", "Artifact", key, list).catch(e => console.warn(e));

    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "SIMULATION_EXECUTED",
      targetId: sim.simulationId,
      afterState: "COMPLETED",
      reason: `Executed custom sandbox simulation for ${sim.sku}`,
    });

    return sim;
  }

  /**
   * Retrieves comparisons between physical measurements and sandbox simulations.
   */
  static getComparisons(researchRunId: string, userId: string): ExperimentComparison[] {
    const key = `${userId}:${researchRunId}`;
    let list = comparisonStore.get(key);
    if (!list || list.length === 0) {
      const exps = this.getExperiments(researchRunId, userId);
      const sims = this.getSimulations(researchRunId, userId);

      const cmp = ExperimentComparisonEngine.compare(exps[0], sims[0]);
      list = [cmp];
      comparisonStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("comparisonStore", "Artifact", key, list).catch(e => console.warn(e));

      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "COMPARISON_EVALUATED",
        targetId: cmp.comparisonId,
        afterState: cmp.alignmentState,
        reason: `Evaluated physical vs simulated comparison (${cmp.deltaPercentage}% delta).`,
      });
    }
    return list;
  }

  /**
   * Compares a specific physical experiment against a simulation.
   */
  static compareExperiment(
    researchRunId: string,
    userId: string,
    experimentId: string,
    simulationId: string,
    confounders: string[] = []
  ): ExperimentComparison | null {
    const key = `${userId}:${researchRunId}`;
    const exps = this.getExperiments(researchRunId, userId);
    const sims = this.getSimulations(researchRunId, userId);

    const exp = exps.find((e) => e.experimentId === experimentId) || exps[0];
    const sim = sims.find((s) => s.simulationId === simulationId) || sims[0];
    if (!exp || !sim) return null;

    const cmp = ExperimentComparisonEngine.compare(exp, sim, confounders);
    const list = this.getComparisons(researchRunId, userId);
    list.push(cmp);
    comparisonStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("comparisonStore", "Artifact", key, list).catch(e => console.warn(e));

    TestbenchAuditService.record(researchRunId, userId, {
      eventType: "COMPARISON_EVALUATED",
      targetId: cmp.comparisonId,
      afterState: cmp.alignmentState,
      reason: `Evaluated comparison: ${cmp.alignmentState}`,
    });

    return cmp;
  }

  /**
   * Retrieves research opportunities surfaced from testbench experiments and simulations.
   */
  static getOpportunities(researchRunId: string, userId: string): TestbenchResearchOpportunity[] {
    const key = `${userId}:${researchRunId}`;
    let list = opportunityStore.get(key);
    if (!list || list.length === 0) {
      const exps = this.getExperiments(researchRunId, userId);
      const cmps = this.getComparisons(researchRunId, userId);
      const tbList = this.getTestbenches(researchRunId, userId);

      list = TestbenchOpportunityEngine.generateOpportunities(
        researchRunId,
        userId,
        exps,
        cmps,
        tbList
      );
      opportunityStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunityStore", "Artifact", key, list).catch(e => console.warn(e));

      for (const opp of list) {
        TestbenchAuditService.record(researchRunId, userId, {
          eventType: "OPPORTUNITY_CREATED",
          targetId: opp.opportunityId,
          afterState: opp.status,
          reason: `Generated testbench research opportunity: ${opp.title}`,
        });
      }
    }
    return list;
  }

  /**
   * Bridges a research opportunity into the Phase 86 Research Validation Queue.
   */
  static validateOpportunity(
    researchRunId: string,
    userId: string,
    opportunityId: string
  ): {
    success: boolean;
    opportunity?: TestbenchResearchOpportunity;
    calibrationQueueItemId?: string;
    message: string;
  } {
    const list = this.getOpportunities(researchRunId, userId);
    const opp = list.find((o) => o.opportunityId === opportunityId);
    if (!opp) {
      return { success: false, message: "Opportunity not found." };
    }

    const res = TestbenchValidationBridgeEngine.bridgeOpportunityToValidationQueue(
      opp,
      researchRunId,
      userId
    );

    if (res.success) {
      const key = `${userId}:${researchRunId}`;
      const idx = list.findIndex((o) => o.opportunityId === opportunityId);
      list[idx] = res.opportunity;
      opportunityStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunityStore", "Artifact", key, list).catch(e => console.warn(e));

      TestbenchAuditService.record(researchRunId, userId, {
        eventType: "VALIDATION_TASK_CREATED",
        targetId: res.opportunity.opportunityId,
        afterState: "QUEUED",
        reason: `Bridged opportunity to Phase 86 calibration queue: ${res.opportunity.title}`,
      });
    }

    return res;
  }

  /**
   * Generates a 6-stage deterministic lineage trace for an experiment.
   */
  static getLineage(researchRunId: string, userId: string, experimentId: string): TestbenchLineageTrace {
    const exps = this.getExperiments(researchRunId, userId);
    const plans = this.getPlans(researchRunId, userId);
    const tbList = this.getTestbenches(researchRunId, userId);
    const sims = this.getSimulations(researchRunId, userId);
    const cmps = this.getComparisons(researchRunId, userId);

    const exp = exps.find((e) => e.experimentId === experimentId) || exps[0];
    const plan = plans.find((p) => p.planId === exp?.planId) || plans[0];
    const tb = tbList.find((t) => t.testbenchId === exp?.testbenchId) || tbList[0];
    const cmp = cmps.find((c) => c.physicalExperimentId === exp?.experimentId) || cmps[0];
    const sim = sims.find((s) => s.simulationId === cmp?.simulationId) || sims[0];

    return TestbenchLineageEngine.generateLineage(exp, plan, tb, sim, cmp);
  }

  /**
   * Generates a deterministic snapshot for the testbench module.
   */
  static getSnapshot(researchRunId: string, userId: string): TestbenchSnapshot {
    const tbList = this.getTestbenches(researchRunId, userId);
    const plans = this.getPlans(researchRunId, userId);
    const exps = this.getExperiments(researchRunId, userId);
    const meas: PhysicalMeasurement[] = [];
    const sims = this.getSimulations(researchRunId, userId);
    const cmps = this.getComparisons(researchRunId, userId);
    const opps = this.getOpportunities(researchRunId, userId);

    return TestbenchSnapshotEngine.generateSnapshot(
      researchRunId,
      userId,
      tbList,
      plans,
      exps,
      meas,
      sims,
      cmps,
      opps
    );
  }
}
