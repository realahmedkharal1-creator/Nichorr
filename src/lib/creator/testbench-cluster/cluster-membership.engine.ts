import crypto from "crypto";
import {
  TestbenchCluster,
  TestbenchClusterNode,
  SiliconIdentity,
} from "./testbench-cluster.types";
import { SiliconIdentityEngine } from "./silicon-identity.engine";
import { ClusterCapabilityEngine } from "./cluster-capability.engine";
import { MethodologyEngine } from "./methodology.engine";
import { NodeHealthEngine } from "./node-health.engine";

export class ClusterMembershipEngine {
  public static createDefaultCluster(
    researchRunId: string,
    userId: string,
    overrides?: Partial<TestbenchCluster>
  ): TestbenchCluster {
    const clusterId = overrides?.clusterId || `cluster-${crypto.randomBytes(4).toString("hex")}`;
    const name = overrides?.name || "Silicon Validation Laboratory Cluster Alpha";
    const description =
      overrides?.description ||
      "Multi-testbench physical execution and silicon differential analysis cluster.";

    return {
      clusterId,
      userId,
      researchRunId,
      name,
      description,
      status: "READY",
      nodeIds: [],
      schedulerState: "IDLE",
      safetyState: "PASS",
      methodologyFingerprint: "mfp-default-cluster",
      clusterReproducibilityFingerprint: "crfp-default-cluster",
      activeLock: "EXCLUSIVE_NODE",
      blockers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public static createNode(
    clusterId: string,
    researchRunId: string,
    userId: string,
    testbenchId: string,
    name: string,
    siliconParams?: Partial<SiliconIdentity>,
    overrides?: Partial<TestbenchClusterNode>
  ): TestbenchClusterNode {
    const nodeId = overrides?.nodeId || `node-${crypto.randomBytes(4).toString("hex")}`;
    const siliconIdentity = SiliconIdentityEngine.createSiliconIdentity(siliconParams || {});
    const capabilities = ClusterCapabilityEngine.discoverCapabilities({ siliconIdentity });

    const methodologyFingerprint = MethodologyEngine.createMethodologyFingerprint({
      benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
      benchmarkVersion: "2.13",
      resolution: "3840x2160",
      preset: "Ray Tracing Overdrive",
      renderingApi: "DirectX 12",
      upscaling: "DLSS Quality",
      frameGeneration: true,
      rayTracing: true,
      powerLimitWatts: siliconIdentity.powerConfigWatts,
    });

    const reproducibilityFingerprint = `rfp-${crypto
      .createHash("sha256")
      .update(JSON.stringify({ testbenchId, siliconIdentity, capabilities, methodologyFingerprint }))
      .digest("hex")
      .slice(0, 16)}`;

    const node: TestbenchClusterNode = {
      nodeId,
      testbenchId,
      clusterId,
      userId,
      researchRunId,
      name,
      hardwareIdentity: `${siliconIdentity.cpuModel} / ${siliconIdentity.gpuSku}`,
      siliconIdentity,
      capabilities,
      healthStatus: "HEALTHY",
      runnerStatus: "RUNNER_READY",
      runnerVersion: "agy-bench-runner-v2.1",
      authorizationState: "AUTHORIZED",
      safetyState: "PASS",
      methodologyFingerprint,
      siliconFingerprint: siliconIdentity.siliconFingerprint,
      reproducibilityFingerprint,
      activeLock: "EXCLUSIVE_NODE",
      completedJobsCount: 0,
      failedJobsCount: 0,
      blockers: [],
      lastHeartbeatAt: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      ...overrides,
    };

    node.healthStatus = NodeHealthEngine.evaluateHealth(node);
    return node;
  }
}
