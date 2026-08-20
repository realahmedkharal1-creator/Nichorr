import crypto from "crypto";
import {
  TestbenchSnapshot,
  TestbenchDefinition,
  BenchmarkExecutionPlan,
  PhysicalExperiment,
  PhysicalMeasurement,
  MicroarchitectureSimulation,
  ExperimentComparison,
  TestbenchResearchOpportunity,
} from "./testbench.types";

export class TestbenchSnapshotEngine {
  /**
   * Generates a deterministic SHA-256 snapshot strictly excluding volatile timestamps.
   */
  static generateSnapshot(
    researchRunId: string,
    userId: string,
    testbenches: TestbenchDefinition[],
    plans: BenchmarkExecutionPlan[],
    experiments: PhysicalExperiment[],
    measurements: PhysicalMeasurement[],
    simulations: MicroarchitectureSimulation[],
    comparisons: ExperimentComparison[],
    opportunities: TestbenchResearchOpportunity[],
    projectSnapshotHash: string = "snap-proj-default",
    evidenceSnapshotHash: string = "snap-evid-default",
    isStale: boolean = false
  ): TestbenchSnapshot {
    // Clean and sort all objects to guarantee deterministic hash calculation
    const cleanTestbenches = testbenches
      .map((t) => ({
        id: t.testbenchId,
        hardwareTarget: t.hardwareTarget,
        architecture: t.architecture,
        cpu: t.cpu,
        gpu: t.gpu,
        benchmarkSuite: t.benchmarkSuite,
        status: t.status,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const cleanPlans = plans
      .map((p) => ({
        id: p.planId,
        testbenchId: p.testbenchId,
        suite: p.benchmarkSuite,
        hardware: p.hardware,
        resolution: p.resolution,
        preset: p.preset,
        powerLimitWatts: p.powerLimitWatts,
        planHash: p.executionPlanHash,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const cleanExperiments = experiments
      .map((e) => ({
        id: e.experimentId,
        planId: e.planId,
        state: e.executionState,
        completedRuns: e.completedRuns,
        score: e.consolidatedScore || 0,
        validationState: e.validationState,
        fingerprint: e.reproducibilityFingerprint,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const cleanSimulations = simulations
      .map((s) => ({
        id: s.simulationId,
        arch: s.targetArchitecture,
        sku: s.sku,
        suite: s.benchmarkSuite,
        score: s.simulatedScore,
        params: s.modeledParameters,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const cleanComparisons = comparisons
      .map((c) => ({
        id: c.comparisonId,
        physId: c.physicalExperimentId,
        simId: c.simulationId,
        alignment: c.alignmentState,
        delta: c.deltaPercentage,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const cleanOpportunities = opportunities
      .map((o) => ({
        id: o.opportunityId,
        title: o.title,
        priority: o.priority,
        status: o.status,
        delta: o.observedDeltaPercentage,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const snapshotPayload = {
      userId,
      researchRunId,
      testbenches: cleanTestbenches,
      plans: cleanPlans,
      experiments: cleanExperiments,
      simulations: cleanSimulations,
      comparisons: cleanComparisons,
      opportunities: cleanOpportunities,
      projectSnapshotHash,
      evidenceSnapshotHash,
      isStale,
    };

    const snapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(snapshotPayload))
      .digest("hex");

    return {
      snapshotId: `tbs-${snapshotHash.slice(0, 16)}`,
      snapshotHash,
      userId,
      researchRunId,
      testbenchesCount: testbenches.length,
      plansCount: plans.length,
      experimentsCount: experiments.length,
      measurementsCount: measurements.length,
      simulationsCount: simulations.length,
      comparisonsCount: comparisons.length,
      opportunitiesCount: opportunities.length,
      projectSnapshotHash,
      evidenceSnapshotHash,
      isStale,
      generatedAt: new Date().toISOString(),
    };
  }
}
