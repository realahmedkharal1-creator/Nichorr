import {
  TestbenchCluster,
  TestbenchClusterNode,
  TestbenchClusterJob,
} from "./testbench-cluster.types";
import { ClusterSafetyEngine } from "./cluster-safety.engine";
import { ClusterCapabilityEngine } from "./cluster-capability.engine";
import { ClusterQueueEngine } from "./queue.engine";

export interface ScheduleAllocationResult {
  allocations: {
    jobId: string;
    nodeId: string;
    reason: string;
  }[];
  unallocatedJobs: {
    jobId: string;
    reason: string;
  }[];
  excludedNodes: {
    nodeId: string;
    reason: string;
  }[];
}

export class ClusterSchedulerEngine {
  public static schedule(
    cluster: TestbenchCluster,
    nodes: TestbenchClusterNode[],
    jobs: TestbenchClusterJob[]
  ): ScheduleAllocationResult {
    const allocations: ScheduleAllocationResult["allocations"] = [];
    const unallocatedJobs: ScheduleAllocationResult["unallocatedJobs"] = [];
    const excludedNodes: ScheduleAllocationResult["excludedNodes"] = [];

    // Stable sort nodes and jobs
    const stableNodes = [...nodes].sort((a, b) => a.nodeId.localeCompare(b.nodeId));
    const sortedJobs = ClusterQueueEngine.sortQueue(
      jobs.filter((j) => j.status === "QUEUED" || j.status === "ELIGIBLE")
    );

    const busyNodeIds = new Set<string>();

    for (const node of stableNodes) {
      if (node.healthStatus !== "HEALTHY") {
        excludedNodes.push({
          nodeId: node.nodeId,
          reason: `Node health is ${node.healthStatus}`,
        });
        busyNodeIds.add(node.nodeId);
      } else if (node.currentJobId) {
        excludedNodes.push({
          nodeId: node.nodeId,
          reason: `Node currently locked on job ${node.currentJobId}`,
        });
        busyNodeIds.add(node.nodeId);
      }
    }

    for (const job of sortedJobs) {
      let matchedNode: TestbenchClusterNode | null = null;
      let rejectionReason = "No available eligible node found";

      // If target node is specified, only consider that node
      const candidates = job.targetNodeId
        ? stableNodes.filter((n) => n.nodeId === job.targetNodeId && !busyNodeIds.has(n.nodeId))
        : stableNodes.filter((n) => !busyNodeIds.has(n.nodeId));

      for (const node of candidates) {
        // Safety check
        const nodeSafety = ClusterSafetyEngine.evaluateNodeSafety(
          node,
          job.userId,
          job.researchRunId
        );
        if (!nodeSafety.isSafe) {
          rejectionReason = `Node safety blocked: ${nodeSafety.blockers.join(", ")}`;
          continue;
        }

        const jobSafety = ClusterSafetyEngine.evaluateJobSafety(job, node);
        if (!jobSafety.isSafe) {
          rejectionReason = `Job safety blocked: ${jobSafety.blockers.join(", ")}`;
          continue;
        }

        // Capability match
        const capMatch = ClusterCapabilityEngine.validateRequiredCapabilities(
          node.capabilities,
          job.requiredCapabilities
        );
        if (!capMatch.isValid) {
          rejectionReason = `Missing capabilities: ${capMatch.missing.join(", ")}`;
          continue;
        }

        matchedNode = node;
        break;
      }

      if (matchedNode) {
        allocations.push({
          jobId: job.jobId,
          nodeId: matchedNode.nodeId,
          reason: `Allocated to ${matchedNode.name} (${matchedNode.siliconIdentity.gpuSku}) with priority ${job.priority}.`,
        });
        busyNodeIds.add(matchedNode.nodeId);
      } else {
        unallocatedJobs.push({
          jobId: job.jobId,
          reason: rejectionReason,
        });
      }
    }

    return {
      allocations,
      unallocatedJobs,
      excludedNodes,
    };
  }
}
