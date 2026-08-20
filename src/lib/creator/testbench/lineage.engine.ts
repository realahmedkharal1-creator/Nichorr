import {
  TestbenchLineageTrace,
  PhysicalExperiment,
  BenchmarkExecutionPlan,
  TestbenchDefinition,
  MicroarchitectureSimulation,
  ExperimentComparison,
} from "./testbench.types";

export class TestbenchLineageEngine {
  /**
   * Generates a 6-stage deterministic provenance and explainability trace.
   */
  static generateLineage(
    experiment: PhysicalExperiment,
    plan?: BenchmarkExecutionPlan,
    testbench?: TestbenchDefinition,
    simulation?: MicroarchitectureSimulation,
    comparison?: ExperimentComparison
  ): TestbenchLineageTrace {
    const links = [
      {
        stage: "STAGE_1_TESTBENCH_CAPABILITIES",
        title: "Hardware Target & Laboratory Discovery",
        detail: testbench
          ? `${testbench.name} (${testbench.hardwareTarget}) with ${testbench.coolingConfiguration}.`
          : "Standard silicon testbench configuration.",
        status: "VERIFIED",
        targetId: testbench?.testbenchId || "tb-default",
      },
      {
        stage: "STAGE_2_BENCHMARK_PLAN",
        title: "Deterministic Execution Plan",
        detail: plan
          ? `${plan.benchmarkSuite} v${plan.benchmarkVersion} @ ${plan.resolution} ${plan.preset} (${plan.runCount} runs). Hash: ${plan.executionPlanHash.slice(0, 12)}...`
          : "Standard benchmark execution plan.",
        status: "PLANNED",
        targetId: plan?.planId || "plan-default",
      },
      {
        stage: "STAGE_3_AUTHORIZATION_SAFETY",
        title: "Human Authorization & Safety Gate",
        detail: experiment.authorizationRecord
          ? `Authorized by ${experiment.authorizationRecord.authorizedBy} with signature ${experiment.authorizationRecord.authorizationSignature.slice(0, 16)}...`
          : "Awaiting explicit creator authorization.",
        status: experiment.authorizationRecord ? "AUTHORIZED" : "PENDING",
        targetId: experiment.experimentId,
      },
      {
        stage: "STAGE_4_PHYSICAL_EXECUTION",
        title: "Empirical Hardware Run & Telemetry Ingestion",
        detail: `Executed ${experiment.completedRuns} runs. Consolidated score: ${experiment.consolidatedScore || 0} ${experiment.metricUnit} (variance: ${experiment.variancePercentage || 0}%).`,
        status: experiment.executionState,
        targetId: experiment.experimentId,
      },
      {
        stage: "STAGE_5_SIMULATION_SANDBOX",
        title: "Microarchitecture Sandbox & Error Analysis",
        detail: comparison
          ? `Compared against ${comparison.sku} sandbox model (${comparison.simulatedScore} ${comparison.metricUnit}). Alignment: ${comparison.alignmentState} (${comparison.deltaPercentage}% delta).`
          : "Sandbox simulation comparison pending.",
        status: comparison ? comparison.alignmentState : "NOT_COMPARED",
        targetId: comparison?.comparisonId || "cmp-default",
      },
      {
        stage: "STAGE_6_RESEARCH_VALIDATION_BRIDGE",
        title: "Research Calibration Bridge & Health Reconciliation",
        detail: `Validation state: ${experiment.validationState}. Epistemic boundary preserved without automatic claim mutation.`,
        status: experiment.validationState,
        targetId: experiment.experimentId,
      },
    ];

    return {
      experimentId: experiment.experimentId,
      links,
    };
  }
}
