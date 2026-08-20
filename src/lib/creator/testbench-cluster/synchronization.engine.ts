import {
  TestbenchCluster,
  TestbenchClusterNode,
  TestbenchClusterJob,
} from "./testbench-cluster.types";

export interface ClusterExecutionResult {
  clusterId: string;
  totalJobsCount: number;
  completedJobsCount: number;
  failedJobsCount: number;
  nodeResults: {
    nodeId: string;
    jobId: string;
    status: "COMPLETED" | "FAILED" | "ABORTED" | "BLOCKED";
    score?: number;
    metricUnit?: string;
    failureReason?: string;
  }[];
  isPartialFailure: boolean;
  synchronizedAt: string;
}

export class ClusterSynchronizationEngine {
  public static processExecutionBatch(
    cluster: TestbenchCluster,
    nodes: TestbenchClusterNode[],
    jobs: TestbenchClusterJob[]
  ): ClusterExecutionResult {
    const nodeResults: ClusterExecutionResult["nodeResults"] = [];
    let completedCount = 0;
    let failedCount = 0;

    for (const job of jobs) {
      if (job.status === "COMPLETED" && job.resultScore !== undefined) {
        completedCount++;
        nodeResults.push({
          nodeId: job.allocatedNodeId || "unknown-node",
          jobId: job.jobId,
          status: "COMPLETED",
          score: job.resultScore,
          metricUnit: job.metricUnit || "fps",
        });
      } else if (job.status === "FAILED" || job.status === "ABORTED" || job.status === "BLOCKED") {
        failedCount++;
        nodeResults.push({
          nodeId: job.allocatedNodeId || "unknown-node",
          jobId: job.jobId,
          status: job.status,
          failureReason: job.blockers.join(", ") || "Execution interrupted or safety constraint breached.",
        });
      }
    }

    return {
      clusterId: cluster.clusterId,
      totalJobsCount: jobs.length,
      completedJobsCount: completedCount,
      failedJobsCount: failedCount,
      nodeResults,
      isPartialFailure: failedCount > 0 && completedCount > 0,
      synchronizedAt: new Date().toISOString(),
    };
  }
}
