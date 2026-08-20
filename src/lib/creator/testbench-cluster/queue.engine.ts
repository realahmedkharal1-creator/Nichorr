import crypto from "crypto";
import { TestbenchClusterJob, ClusterJobPriority, QueueJobStatus } from "./testbench-cluster.types";
import { MethodologyEngine } from "./methodology.engine";

export class ClusterQueueEngine {
  private static priorityScores: Record<ClusterJobPriority, number> = {
    CRITICAL: 100,
    HIGH: 80,
    MEDIUM: 50,
    LOW: 20,
    BACKGROUND: 10,
  };

  public static createJob(
    clusterId: string,
    researchRunId: string,
    userId: string,
    params: {
      benchmarkSuite?: string;
      benchmarkVersion?: string;
      resolution?: string;
      preset?: string;
      renderingApi?: string;
      targetNodeId?: string;
      priority?: ClusterJobPriority;
      dependencies?: string[];
      requiredCapabilities?: string[];
      maxThermalLimitCelsius?: number;
      maxPowerLimitWatts?: number;
    }
  ): TestbenchClusterJob {
    const jobId = `job-${crypto.randomBytes(4).toString("hex")}`;
    const benchmarkSuite = params.benchmarkSuite || "Cyberpunk 2077 (4K Ultra RT)";
    const benchmarkVersion = params.benchmarkVersion || "2.13";
    const resolution = params.resolution || "3840x2160";
    const preset = params.preset || "Ray Tracing Overdrive";
    const renderingApi = params.renderingApi || "DirectX 12";
    const priority = params.priority || "HIGH";
    const priorityScore = this.priorityScores[priority] || 50;

    const methodologyFingerprint = MethodologyEngine.createMethodologyFingerprint({
      benchmarkSuite,
      benchmarkVersion,
      resolution,
      preset,
      renderingApi,
      powerLimitWatts: params.maxPowerLimitWatts || 500,
    });

    const executionPlanHash = `eph-${crypto
      .createHash("sha256")
      .update(JSON.stringify({ benchmarkSuite, benchmarkVersion, resolution, preset, renderingApi, methodologyFingerprint }))
      .digest("hex")
      .slice(0, 16)}`;

    return {
      jobId,
      clusterId,
      userId,
      researchRunId,
      benchmarkSuite,
      benchmarkVersion,
      resolution,
      preset,
      renderingApi,
      targetNodeId: params.targetNodeId,
      executionPlanHash,
      methodologyFingerprint,
      priority,
      priorityScore,
      dependencies: params.dependencies || [],
      requiredCapabilities: params.requiredCapabilities || ["DIRECTX_12_ULTIMATE"],
      safetyRequirements: {
        maxThermalLimitCelsius: params.maxThermalLimitCelsius || 90,
        maxPowerLimitWatts: params.maxPowerLimitWatts || 500,
        requireExclusiveNode: true,
      },
      retryPolicy: {
        maxRetries: 2,
        currentRetry: 0,
      },
      status: "QUEUED",
      blockers: [],
      createdAt: new Date().toISOString(),
    };
  }

  public static sortQueue(jobs: TestbenchClusterJob[]): TestbenchClusterJob[] {
    return [...jobs].sort((a, b) => {
      // 1. Priority score descending
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      // 2. Created at timestamp ascending
      const createdCompare = a.createdAt.localeCompare(b.createdAt);
      if (createdCompare !== 0) {
        return createdCompare;
      }
      // 3. Stable jobId tie-breaker
      return a.jobId.localeCompare(b.jobId);
    });
  }
}
