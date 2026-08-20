import { TestbenchClusterNode, NodeHealthStatus } from "./testbench-cluster.types";

export class NodeHealthEngine {
  public static evaluateHealth(node: TestbenchClusterNode): NodeHealthStatus {
    if (node.blockers && node.blockers.length > 0) {
      return "BLOCKED";
    }

    if (node.authorizationState === "UNAUTHORIZED" || node.authorizationState === "REVOKED") {
      return "UNAUTHORIZED";
    }

    if (node.runnerStatus === "RUNNER_NOT_CONFIGURED" || node.runnerStatus === "UNAVAILABLE") {
      return "UNAVAILABLE";
    }

    if (node.runnerStatus === "RUNNER_ERROR") {
      return "ERROR";
    }

    if (node.runnerStatus === "RUNNER_BUSY" || node.activeLock === "EXCLUSIVE_NODE" && node.currentJobId) {
      return "BUSY";
    }

    if (node.safetyState === "FAIL") {
      return "DEGRADED";
    }

    if (node.runnerStatus === "RUNNER_READY" && node.authorizationState === "AUTHORIZED") {
      return "HEALTHY";
    }

    return "UNKNOWN";
  }
}
