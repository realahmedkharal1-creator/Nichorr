import crypto from "crypto";
import {
  TestbenchCluster,
  TestbenchClusterNode,
  TestbenchClusterJob,
  SiliconDifferentialMatrix,
  SiliconDifferentialResearchOpportunity,
  TestbenchClusterSnapshot,
} from "./testbench-cluster.types";

export class TestbenchClusterSnapshotEngine {
  public static createSnapshot(
    cluster: TestbenchCluster,
    nodes: TestbenchClusterNode[],
    jobs: TestbenchClusterJob[],
    matrix?: SiliconDifferentialMatrix,
    opportunities?: SiliconDifferentialResearchOpportunity[]
  ): TestbenchClusterSnapshot {
    const stableNodes = [...nodes].sort((a, b) => a.nodeId.localeCompare(b.nodeId));
    const stableJobs = [...jobs].sort((a, b) => a.jobId.localeCompare(b.jobId));
    const nodeFingerprints = stableNodes.map((n) => n.siliconFingerprint);
    const planHashes = stableJobs.map((j) => j.executionPlanHash);
    const methodologyFingerprints = stableNodes.map((n) => n.methodologyFingerprint);

    // Build canonical deterministic state strictly excluding volatile timestamps
    const canonicalState = {
      clusterId: cluster.clusterId,
      userId: cluster.userId,
      researchRunId: cluster.researchRunId,
      status: cluster.status,
      schedulerState: cluster.schedulerState,
      safetyState: cluster.safetyState,
      methodologyFingerprint: cluster.methodologyFingerprint,
      nodes: stableNodes.map((n) => ({
        nodeId: n.nodeId,
        testbenchId: n.testbenchId,
        hardwareIdentity: n.hardwareIdentity,
        siliconFingerprint: n.siliconFingerprint,
        healthStatus: n.healthStatus,
        runnerStatus: n.runnerStatus,
        authorizationState: n.authorizationState,
        safetyState: n.safetyState,
        blockers: [...n.blockers].sort(),
      })),
      jobs: stableJobs.map((j) => ({
        jobId: j.jobId,
        benchmarkSuite: j.benchmarkSuite,
        executionPlanHash: j.executionPlanHash,
        priority: j.priority,
        status: j.status,
        blockers: [...j.blockers].sort(),
      })),
      matrixSummary: matrix
        ? {
            totalComparisonsCount: matrix.totalComparisonsCount,
            variantCount: matrix.variantCount,
            contradictionCount: matrix.contradictionCount,
            outlierCount: matrix.outlierCount,
          }
        : null,
      opportunityCount: opportunities ? opportunities.length : 0,
    };

    const serialized = JSON.stringify(canonicalState);
    const snapshotHash = crypto.createHash("sha256").update(serialized).digest("hex");
    const snapshotId = `tbcs-${snapshotHash.slice(0, 16)}`;

    return {
      snapshotId,
      clusterId: cluster.clusterId,
      researchRunId: cluster.researchRunId,
      userId: cluster.userId,
      clusterStatus: cluster.status,
      nodeCount: nodes.length,
      jobCount: jobs.length,
      comparisonCount: matrix ? matrix.totalComparisonsCount : 0,
      opportunityCount: opportunities ? opportunities.length : 0,
      nodeFingerprints,
      planHashes,
      methodologyFingerprints,
      snapshotHash,
      createdAt: new Date().toISOString(),
    };
  }

  public static isStale(
    snapshot: TestbenchClusterSnapshot,
    currentCluster: TestbenchCluster,
    currentNodes: TestbenchClusterNode[],
    currentJobs: TestbenchClusterJob[]
  ): boolean {
    const currentSnapshot = this.createSnapshot(currentCluster, currentNodes, currentJobs);
    return snapshot.snapshotHash !== currentSnapshot.snapshotHash;
  }
}
