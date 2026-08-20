import {
  TestbenchClusterNode,
  TestbenchClusterJob,
} from "./testbench-cluster.types";

export class ClusterAllocationEngine {
  public static allocateJob(
    job: TestbenchClusterJob,
    node: TestbenchClusterNode
  ): {
    updatedJob: TestbenchClusterJob;
    updatedNode: TestbenchClusterNode;
  } {
    const updatedJob: TestbenchClusterJob = {
      ...job,
      allocatedNodeId: node.nodeId,
      status: "ALLOCATED",
      stagedAt: new Date().toISOString(),
    };

    const updatedNode: TestbenchClusterNode = {
      ...node,
      currentJobId: job.jobId,
      activeLock: "EXCLUSIVE_NODE",
    };

    return {
      updatedJob,
      updatedNode,
    };
  }

  public static releaseNode(
    node: TestbenchClusterNode,
    completedJob: TestbenchClusterJob,
    success: boolean
  ): TestbenchClusterNode {
    return {
      ...node,
      currentJobId: undefined,
      activeLock: "EXCLUSIVE_NODE",
      completedJobsCount: success ? node.completedJobsCount + 1 : node.completedJobsCount,
      failedJobsCount: !success ? node.failedJobsCount + 1 : node.failedJobsCount,
      lastHeartbeatAt: new Date().toISOString(),
    };
  }
}
