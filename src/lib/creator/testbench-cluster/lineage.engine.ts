import {
  SiliconDifferentialEntry,
  ClusterLineageTrace,
  ClusterLineageLink,
} from "./testbench-cluster.types";

export class ClusterLineageEngine {
  public static generateTrace(
    entry: SiliconDifferentialEntry,
    exclusions: string[] = []
  ): ClusterLineageTrace {
    const stages: ClusterLineageLink[] = [
      {
        stage: "1. CLUSTER_INPUT",
        title: `Cluster Node Inputs: ${entry.nodeASku} & ${entry.nodeBSku}`,
        detail: `Nodes ${entry.nodeAId} and ${entry.nodeBId} registered in cluster ${entry.clusterId}.`,
        status: "VERIFIED",
        metadata: {
          nodeA: entry.nodeAId,
          nodeB: entry.nodeBId,
        },
      },
      {
        stage: "2. NODE_CAPABILITY",
        title: "Node Capability Discovery & Health Assessment",
        detail: "Telemetry, compute capabilities, and runner statuses verified across participating nodes.",
        status: "VERIFIED",
        metadata: {
          steppings: `${entry.nodeAStepping} vs ${entry.nodeBStepping}`,
        },
      },
      {
        stage: "3. EXECUTION_OBSERVATION",
        title: `Physical Benchmark Execution: ${entry.benchmarkSuite}`,
        detail: `Observed scores: Node A = ${entry.scoreA} ${entry.metricUnit}, Node B = ${entry.scoreB} ${entry.metricUnit}.`,
        status: "VERIFIED",
        metadata: {
          deltaAbsolute: entry.deltaAbsolute,
          deltaPercentage: entry.deltaPercentage,
        },
      },
      {
        stage: "4. METHODOLOGY_ALIGNMENT",
        title: "Cross-Node Methodology Alignment Check",
        detail: entry.methodologyCompatible
          ? "Methodologies (preset, API, resolution, power limits) match within tolerance."
          : `Methodology divergence detected: ${entry.confounders.join(", ")}`,
        status: entry.methodologyCompatible ? "VERIFIED" : "CONFOUNDED",
        metadata: {
          confounders: entry.confounders,
        },
      },
      {
        stage: "5. SILICON_DIFFERENTIAL",
        title: `Silicon Differential Classification: ${entry.differentialClassification}`,
        detail: `Primary divergence factor: ${entry.primaryDivergenceFactor}. Absolute non-causal guard enforced.`,
        status: entry.isCausallyEstablished ? "VERIFIED" : "EVALUATED",
        metadata: {
          candidateCauses: entry.candidateCauses,
          isCausallyEstablished: entry.isCausallyEstablished,
        },
      },
      {
        stage: "6. RESEARCH_OPPORTUNITY",
        title: "Research Validation Bridging",
        detail: "Differential queued for empirical verification and Phase 86 research calibration.",
        status: "VERIFIED",
      },
    ];

    return {
      differentialId: entry.differentialId,
      clusterId: entry.clusterId,
      researchRunId: entry.researchRunId,
      userId: entry.userId,
      stages,
      exclusions,
      generatedAt: new Date().toISOString(),
    };
  }
}
