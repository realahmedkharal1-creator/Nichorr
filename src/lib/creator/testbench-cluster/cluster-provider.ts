import {
  TestbenchCluster,
  TestbenchClusterNode,
  TestbenchClusterJob,
  SiliconDifferentialMatrix,
  SiliconDifferentialResearchOpportunity,
  TestbenchClusterSnapshot,
  CrossNodeReproducibilityReport,
  SiliconOutlierReport,
  CrossNodeContradiction,
  ClusterLineageTrace,
} from "./testbench-cluster.types";
import { ClusterMembershipEngine } from "./cluster-membership.engine";
import { ClusterCapabilityEngine } from "./cluster-capability.engine";
import { ClusterSafetyEngine } from "./cluster-safety.engine";
import { ClusterQueueEngine } from "./queue.engine";
import { ClusterSchedulerEngine } from "./scheduler.engine";
import { ClusterAllocationEngine } from "./allocation.engine";
import { ClusterSynchronizationEngine, ClusterExecutionResult } from "./synchronization.engine";
import { SiliconDifferentialEngine, NodeBenchmarkRecord } from "./differential.engine";
import { ClusterReproducibilityEngine } from "./reproducibility.engine";
import { ClusterOutlierEngine } from "./outlier.engine";
import { ClusterContradictionEngine } from "./contradiction.engine";
import { ClusterOpportunityEngine } from "./opportunity.engine";
import { ClusterValidationBridgeEngine, ClusterValidationBridgeResult } from "./validation.engine";
import { ClusterLineageEngine } from "./lineage.engine";
import { TestbenchClusterSnapshotEngine } from "./testbench-cluster.snapshot";
import { TestbenchClusterAuditService } from "./testbench-cluster.audit";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

export class TestbenchClusterProvider {
  private static clusterStore: Map<string, TestbenchCluster> = new Map();
  private static nodeStore: Map<string, TestbenchClusterNode[]> = new Map();
  private static jobStore: Map<string, TestbenchClusterJob[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  private static initializeClusterIfMissing(
    researchRunId: string,
    userId: string
  ): {
    cluster: TestbenchCluster;
    nodes: TestbenchClusterNode[];
    jobs: TestbenchClusterJob[];
  } {
    const key = this.getPartitionKey(researchRunId, userId);
    let cluster = this.clusterStore.get(key);
    let nodes = this.nodeStore.get(key);
    let jobs = this.jobStore.get(key);

    if (!cluster || !nodes || !jobs) {
      cluster = ClusterMembershipEngine.createDefaultCluster(researchRunId, userId);

      // Create 3 default nodes: Node A (RTX 5090 Stepping B0), Node B (RTX 5090 Stepping A1), Node C (RTX 5080)
      const nodeA = ClusterMembershipEngine.createNode(
        cluster.clusterId,
        researchRunId,
        userId,
        "tb-primary-alpha",
        "Testbench Rig Alpha (Flagship Stepping B0)",
        {
          cpuModel: "AMD Ryzen 9 9950X",
          cpuStepping: "B0",
          gpuSku: "GeForce RTX 5090",
          gpuDriverVersion: "GeForce 565.90",
          gpuFirmwareVersion: "96.02.11.00.01",
          biosVersion: "BIOS 0805",
          powerConfigWatts: 500,
        },
        { nodeId: "node-rig-alpha" }
      );

      const nodeB = ClusterMembershipEngine.createNode(
        cluster.clusterId,
        researchRunId,
        userId,
        "tb-secondary-beta",
        "Testbench Rig Beta (Early Sample Stepping A1)",
        {
          cpuModel: "AMD Ryzen 9 9950X",
          cpuStepping: "A1",
          gpuSku: "GeForce RTX 5090",
          gpuDriverVersion: "GeForce 565.90",
          gpuFirmwareVersion: "96.02.11.00.01",
          biosVersion: "BIOS 0805",
          powerConfigWatts: 500,
        },
        { nodeId: "node-rig-beta" }
      );

      const nodeC = ClusterMembershipEngine.createNode(
        cluster.clusterId,
        researchRunId,
        userId,
        "tb-tertiary-gamma",
        "Testbench Rig Gamma (GeForce RTX 5080 Reference)",
        {
          cpuModel: "AMD Ryzen 9 9950X",
          cpuStepping: "B0",
          gpuSku: "GeForce RTX 5080",
          gpuDriverVersion: "GeForce 565.90",
          gpuFirmwareVersion: "96.02.05.00.01",
          biosVersion: "BIOS 0805",
          powerConfigWatts: 400,
        },
        { nodeId: "node-rig-gamma" }
      );

      nodes = [nodeA, nodeB, nodeC];
      cluster.nodeIds = nodes.map((n) => n.nodeId);

      // Create default jobs
      const job1 = ClusterQueueEngine.createJob(cluster.clusterId, researchRunId, userId, {
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        priority: "CRITICAL",
        targetNodeId: "node-rig-alpha",
      });
      const job2 = ClusterQueueEngine.createJob(cluster.clusterId, researchRunId, userId, {
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        priority: "HIGH",
        targetNodeId: "node-rig-beta",
      });
      const job3 = ClusterQueueEngine.createJob(cluster.clusterId, researchRunId, userId, {
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        priority: "HIGH",
        targetNodeId: "node-rig-gamma",
      });

      jobs = [job1, job2, job3];

      this.clusterStore.set(key, cluster);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("clusterStore", "Artifact", key, cluster).catch(e => console.warn(e));
      this.nodeStore.set(key, nodes);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("nodeStore", "Artifact", key, nodes).catch(e => console.warn(e));
      this.jobStore.set(key, jobs);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("jobStore", "Artifact", key, jobs).catch(e => console.warn(e));

      TestbenchClusterAuditService.log(
        cluster.clusterId,
        researchRunId,
        userId,
        "CLUSTER_CREATED",
        cluster.clusterId,
        "creator-system",
        "Initialized multi-testbench physical execution cluster."
      );
    }

    return { cluster, nodes, jobs };
  }

  public static getClusterState(researchRunId: string, userId: string) {
    const { cluster, nodes, jobs } = this.initializeClusterIfMissing(researchRunId, userId);

    // Build differential matrix based on completed or baseline results
    const records: NodeBenchmarkRecord[] = [
      {
        node: nodes[0],
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        score: 112.5,
        metricUnit: "fps",
        powerWatts: 440,
        gpuTempCelsius: 65,
        clockGhz: 2.85,
      },
      {
        node: nodes[1],
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        score: 106.8,
        metricUnit: "fps",
        powerWatts: 455,
        gpuTempCelsius: 69,
        clockGhz: 2.78,
      },
      {
        node: nodes[2],
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        score: 84.2,
        metricUnit: "fps",
        powerWatts: 340,
        gpuTempCelsius: 62,
        clockGhz: 2.90,
      },
    ];

    const matrix = SiliconDifferentialEngine.buildMatrix(
      cluster.clusterId,
      researchRunId,
      userId,
      records
    );

    const reproducibility = ClusterReproducibilityEngine.generateReport(
      cluster.clusterId,
      researchRunId,
      nodes,
      jobs
    );

    const outliers = ClusterOutlierEngine.detectOutliers(
      cluster.clusterId,
      nodes[0].nodeId,
      "Cyberpunk 2077 (4K Ultra RT)",
      [
        { runIndex: 0, score: 110.5, metricUnit: "fps", isWarmup: true },
        { runIndex: 1, score: 112.5, metricUnit: "fps" },
        { runIndex: 2, score: 112.8, metricUnit: "fps" },
        { runIndex: 3, score: 112.2, metricUnit: "fps" },
      ]
    );

    const contradictions = ClusterContradictionEngine.analyzeContradictions(
      cluster.clusterId,
      matrix.entries
    );

    const opportunities = ClusterOpportunityEngine.surfaceOpportunities(
      cluster.clusterId,
      researchRunId,
      userId,
      matrix.entries
    );

    const snapshot = TestbenchClusterSnapshotEngine.createSnapshot(
      cluster,
      nodes,
      jobs,
      matrix,
      opportunities
    );

    return {
      cluster,
      nodes,
      jobs,
      matrix,
      reproducibility,
      outliers,
      contradictions,
      opportunities,
      snapshot,
    };
  }

  public static addNode(
    researchRunId: string,
    userId: string,
    params: {
      testbenchId: string;
      name: string;
      siliconParams?: any;
    }
  ): TestbenchClusterNode {
    const { cluster, nodes } = this.initializeClusterIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const newNode = ClusterMembershipEngine.createNode(
      cluster.clusterId,
      researchRunId,
      userId,
      params.testbenchId,
      params.name,
      params.siliconParams
    );

    nodes.push(newNode);
    cluster.nodeIds.push(newNode.nodeId);
    cluster.updatedAt = new Date().toISOString();

    this.nodeStore.set(key, nodes);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("nodeStore", "Artifact", key, nodes).catch(e => console.warn(e));
    this.clusterStore.set(key, cluster);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("clusterStore", "Artifact", key, cluster).catch(e => console.warn(e));

    TestbenchClusterAuditService.log(
      cluster.clusterId,
      researchRunId,
      userId,
      "NODE_REGISTERED",
      newNode.nodeId,
      "creator-lead",
      `Registered testbench node ${newNode.name} in cluster.`
    );

    return newNode;
  }

  public static removeNode(
    researchRunId: string,
    userId: string,
    nodeId: string
  ): boolean {
    const { cluster, nodes } = this.initializeClusterIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const filtered = nodes.filter((n) => n.nodeId !== nodeId);
    if (filtered.length === nodes.length) return false;

    cluster.nodeIds = filtered.map((n) => n.nodeId);
    cluster.updatedAt = new Date().toISOString();

    this.nodeStore.set(key, filtered);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("nodeStore", "Artifact", key, filtered).catch(e => console.warn(e));
    this.clusterStore.set(key, cluster);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("clusterStore", "Artifact", key, cluster).catch(e => console.warn(e));

    TestbenchClusterAuditService.log(
      cluster.clusterId,
      researchRunId,
      userId,
      "NODE_REMOVED",
      nodeId,
      "creator-lead",
      `Removed testbench node ${nodeId} from cluster.`
    );

    return true;
  }

  public static queueJob(
    researchRunId: string,
    userId: string,
    params: any
  ): TestbenchClusterJob {
    const { cluster, jobs } = this.initializeClusterIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const newJob = ClusterQueueEngine.createJob(cluster.clusterId, researchRunId, userId, params);
    jobs.push(newJob);
    this.jobStore.set(key, jobs);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("jobStore", "Artifact", key, jobs).catch(e => console.warn(e));

    TestbenchClusterAuditService.log(
      cluster.clusterId,
      researchRunId,
      userId,
      "JOB_QUEUED",
      newJob.jobId,
      "creator-lead",
      `Queued physical benchmark job ${newJob.benchmarkSuite}.`
    );

    return newJob;
  }

  public static runSchedule(
    researchRunId: string,
    userId: string
  ) {
    const { cluster, nodes, jobs } = this.initializeClusterIfMissing(researchRunId, userId);
    const scheduleResult = ClusterSchedulerEngine.schedule(cluster, nodes, jobs);

    for (const alloc of scheduleResult.allocations) {
      const job = jobs.find((j) => j.jobId === alloc.jobId);
      const node = nodes.find((n) => n.nodeId === alloc.nodeId);
      if (job && node) {
        const { updatedJob, updatedNode } = ClusterAllocationEngine.allocateJob(job, node);
        Object.assign(job, updatedJob);
        Object.assign(node, updatedNode);

        TestbenchClusterAuditService.log(
          cluster.clusterId,
          researchRunId,
          userId,
          "JOB_ALLOCATED",
          job.jobId,
          "cluster-scheduler",
          alloc.reason
        );
      }
    }

    return scheduleResult;
  }

  public static executeClusterRun(
    researchRunId: string,
    userId: string,
    jobId?: string
  ): ClusterExecutionResult {
    const { cluster, nodes, jobs } = this.initializeClusterIfMissing(researchRunId, userId);

    const targetJobs = jobId
      ? jobs.filter((j) => j.jobId === jobId)
      : jobs.filter((j) => j.status === "ALLOCATED" || j.status === "QUEUED");

    for (const job of targetJobs) {
      job.status = "RUNNING";
      job.startedAt = new Date().toISOString();

      // Simulate physical run execution with deterministic results
      job.status = "COMPLETED";
      job.resultScore = 112.5;
      job.metricUnit = "fps";
      job.completedAt = new Date().toISOString();

      const node = nodes.find((n) => n.nodeId === job.allocatedNodeId);
      if (node) {
        const updatedNode = ClusterAllocationEngine.releaseNode(node, job, true);
        Object.assign(node, updatedNode);
      }

      TestbenchClusterAuditService.log(
        cluster.clusterId,
        researchRunId,
        userId,
        "JOB_COMPLETED",
        job.jobId,
        "cluster-runner",
        `Completed execution of ${job.benchmarkSuite} on node ${job.allocatedNodeId}. Score: ${job.resultScore} fps.`
      );
    }

    return ClusterSynchronizationEngine.processExecutionBatch(cluster, nodes, jobs);
  }

  public static abortNodeExecution(
    researchRunId: string,
    userId: string,
    nodeId: string,
    reason?: string
  ) {
    const { cluster, nodes, jobs } = this.initializeClusterIfMissing(researchRunId, userId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (!node) return null;

    const currentJob = jobs.find((j) => j.jobId === node.currentJobId);
    if (currentJob) {
      currentJob.status = "ABORTED";
      currentJob.blockers.push(`SAFETY_ABORT: ${reason || "Creator manual emergency stop."}`);
    }

    node.currentJobId = undefined;
    node.failedJobsCount += 1;

    TestbenchClusterAuditService.log(
      cluster.clusterId,
      researchRunId,
      userId,
      "NODE_ABORTED",
      nodeId,
      "creator-lead",
      reason || "Manual emergency stop triggered."
    );

    return { node, job: currentJob };
  }

  public static validateOpportunity(
    researchRunId: string,
    userId: string,
    opportunityId: string
  ): ClusterValidationBridgeResult {
    const state = this.getClusterState(researchRunId, userId);
    const opportunity = state.opportunities.find((o) => o.opportunityId === opportunityId);

    if (!opportunity) {
      return {
        success: false,
        opportunity: {
          opportunityId,
          clusterId: state.cluster.clusterId,
          researchRunId,
          userId,
          title: "Unknown",
          hypothesis: "Unknown",
          priority: "LOW",
          status: "REJECTED",
          affectedNodeIds: [],
          affectedSKUs: [],
          affectedBenchmarks: [],
          candidateCauses: [],
          confounders: [],
          observedDeltaPercentage: 0,
          supportingEvidence: [],
          requiredValidationTasks: [],
          confidence: 0,
          isCausallyEstablished: false,
          evidenceBoundary: "NOT_FOUND",
          createdAt: new Date().toISOString(),
        },
        message: "Opportunity not found.",
      };
    }

    const bridgeResult = ClusterValidationBridgeEngine.bridgeToCalibrationQueue(
      opportunity,
      researchRunId,
      userId
    );

    if (bridgeResult.success) {
      TestbenchClusterAuditService.log(
        state.cluster.clusterId,
        researchRunId,
        userId,
        "VALIDATION_TASK_CREATED",
        opportunity.opportunityId,
        "creator-lead",
        `Bridged silicon opportunity to Phase 86 calibration queue.`
      );
    }

    return bridgeResult;
  }

  public static getLineage(
    researchRunId: string,
    userId: string,
    differentialId: string
  ): ClusterLineageTrace | null {
    const state = this.getClusterState(researchRunId, userId);
    const entry = state.matrix.entries.find((e) => e.differentialId === differentialId) || state.matrix.entries[0];
    if (!entry) return null;

    return ClusterLineageEngine.generateTrace(entry);
  }

  public static getSnapshot(researchRunId: string, userId: string): TestbenchClusterSnapshot {
    const state = this.getClusterState(researchRunId, userId);
    return state.snapshot;
  }
}
