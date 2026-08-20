import crypto from "crypto";
import {
  TestbenchClusterNode,
  TestbenchClusterJob,
  CrossNodeReproducibilityReport,
} from "./testbench-cluster.types";

export class ClusterReproducibilityEngine {
  public static createClusterReproducibilityFingerprint(
    nodes: TestbenchClusterNode[],
    jobs: TestbenchClusterJob[]
  ): string {
    const stableNodes = [...nodes].sort((a, b) => a.nodeId.localeCompare(b.nodeId));
    const stableJobs = [...jobs].sort((a, b) => a.jobId.localeCompare(b.jobId));

    const payload = {
      nodeCount: stableNodes.length,
      nodeFingerprints: stableNodes.map((n) => ({
        nodeId: n.nodeId,
        siliconFingerprint: n.siliconFingerprint,
        methodologyFingerprint: n.methodologyFingerprint,
        reproducibilityFingerprint: n.reproducibilityFingerprint,
      })),
      jobHashes: stableJobs.map((j) => ({
        jobId: j.jobId,
        executionPlanHash: j.executionPlanHash,
        methodologyFingerprint: j.methodologyFingerprint,
      })),
    };

    return `crfp-${crypto
      .createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex")
      .slice(0, 16)}`;
  }

  public static generateReport(
    clusterId: string,
    researchRunId: string,
    nodes: TestbenchClusterNode[],
    jobs: TestbenchClusterJob[]
  ): CrossNodeReproducibilityReport {
    const clusterReproducibilityFingerprint = this.createClusterReproducibilityFingerprint(nodes, jobs);

    const firstMethodology = nodes[0]?.methodologyFingerprint;
    const matchingNodes = nodes.filter((n) => n.methodologyFingerprint === firstMethodology);
    const matchedMethodologyCount = matchingNodes.length;
    const totalNodesCount = nodes.length;

    const consistencyScore = totalNodesCount > 0
      ? Number(((matchedMethodologyCount / totalNodesCount) * 100).toFixed(1))
      : 0;

    const excludedDifferences: string[] = [];
    if (matchedMethodologyCount < totalNodesCount) {
      excludedDifferences.push(`${totalNodesCount - matchedMethodologyCount} nodes have divergent methodology fingerprints.`);
    }

    return {
      clusterId,
      researchRunId,
      clusterReproducibilityFingerprint,
      matchedMethodologyCount,
      totalNodesCount,
      consistencyScore,
      isMethodologyAligned: matchedMethodologyCount === totalNodesCount,
      excludedDifferences,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
