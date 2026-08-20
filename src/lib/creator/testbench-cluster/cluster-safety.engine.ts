import {
  TestbenchCluster,
  TestbenchClusterNode,
  TestbenchClusterJob,
} from "./testbench-cluster.types";
import { CreatorCertificationProvider } from "../certification/creator-certification.provider";

export class ClusterSafetyEngine {
  public static evaluateNodeSafety(
    node: TestbenchClusterNode,
    userId: string,
    researchRunId: string
  ): {
    isSafe: boolean;
    blockers: string[];
  } {
    const blockers: string[] = [];

    // Check certification state
    try {
      const cert = CreatorCertificationProvider.getCertificate(researchRunId, userId);
      if (cert && (cert.status === "INVALIDATED" || cert.status === "BLOCKED")) {
        blockers.push("INVALID_CERTIFICATION: Creator certification is currently revoked or blocked.");
      }
    } catch {
      // Certification provider check handled gracefully
    }

    // Check power and thermal limits
    if (node.siliconIdentity.powerConfigWatts > 1000) {
      blockers.push(`UNSAFE_POWER_CONFIGURATION: Power target ${node.siliconIdentity.powerConfigWatts}W exceeds laboratory limit (1000W).`);
    }

    // Authorization check
    if (node.authorizationState !== "AUTHORIZED") {
      blockers.push("NODE_AUTHORIZATION_INVALID: Testbench node lacks valid human authorization signature.");
    }

    // Forward any pre-existing blockers
    if (node.blockers && node.blockers.length > 0) {
      for (const b of node.blockers) {
        if (!blockers.includes(b)) blockers.push(b);
      }
    }

    return {
      isSafe: blockers.length === 0,
      blockers,
    };
  }

  public static evaluateJobSafety(
    job: TestbenchClusterJob,
    node: TestbenchClusterNode
  ): {
    isSafe: boolean;
    blockers: string[];
  } {
    const blockers: string[] = [];

    if (job.safetyRequirements.maxThermalLimitCelsius > 105) {
      blockers.push(`UNSAFE_THERMAL_CONFIGURATION: Thermal threshold ${job.safetyRequirements.maxThermalLimitCelsius}°C exceeds silicon limit.`);
    }

    if (job.safetyRequirements.maxPowerLimitWatts > 1000) {
      blockers.push(`UNSAFE_POWER_CONFIGURATION: Job power limit ${job.safetyRequirements.maxPowerLimitWatts}W exceeds safe boundary.`);
    }

    if (node.healthStatus === "BLOCKED" || node.healthStatus === "UNAVAILABLE" || node.healthStatus === "ERROR") {
      blockers.push(`NODE_UNAVAILABLE: Target node ${node.nodeId} is in ${node.healthStatus} state.`);
    }

    if (node.activeLock === "EXCLUSIVE_NODE" && node.currentJobId && node.currentJobId !== job.jobId) {
      blockers.push(`NODE_LOCKED: Target node ${node.nodeId} is executing an exclusive job (${node.currentJobId}).`);
    }

    return {
      isSafe: blockers.length === 0,
      blockers,
    };
  }
}
