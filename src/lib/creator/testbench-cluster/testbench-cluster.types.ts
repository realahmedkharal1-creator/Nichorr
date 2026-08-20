// ============================================================================
// PHASE 91: MULTI-TESTBENCH CLUSTER ORCHESTRATION &
// SILICON-TO-SILICON DIFFERENTIAL MATRIX ENGINE TYPES
// ============================================================================

import {
  HardwareCapabilityState,
  TestbenchEvidenceClassification,
  MeasurementSourceType,
} from "../testbench/testbench.types";

export type ClusterStatus =
  | "DRAFT"
  | "DISCOVERING"
  | "READY"
  | "PARTIALLY_READY"
  | "RUNNING"
  | "DEGRADED"
  | "PAUSED"
  | "BLOCKED"
  | "COMPLETED"
  | "FAILED";

export type NodeHealthStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "BUSY"
  | "OFFLINE"
  | "UNAVAILABLE"
  | "UNAUTHORIZED"
  | "BLOCKED"
  | "ERROR"
  | "UNKNOWN";

export type ClusterSchedulerState =
  | "IDLE"
  | "SCHEDULING"
  | "PAUSED"
  | "DRAINING"
  | "BLOCKED";

export type QueueJobStatus =
  | "QUEUED"
  | "ELIGIBLE"
  | "ALLOCATED"
  | "STAGED"
  | "AUTHORIZED"
  | "RUNNING"
  | "COLLECTING"
  | "FINALIZING"
  | "COMPLETED"
  | "FAILED"
  | "ABORTED"
  | "BLOCKED"
  | "CANCELLED";

export type NodeExecutionLock =
  | "EXCLUSIVE_NODE"
  | "SHARED_READ_ONLY"
  | "TELEMETRY_ONLY"
  | "SIMULATION_ONLY";

export type DifferentialClassification =
  | "IDENTICAL_CONFIGURATION"
  | "SILICON_VARIANT"
  | "FIRMWARE_VARIANT"
  | "DRIVER_VARIANT"
  | "PLATFORM_VARIANT"
  | "METHODOLOGY_VARIANT"
  | "THERMAL_VARIANT"
  | "POWER_VARIANT"
  | "MULTI_FACTOR_DIFFERENCE"
  | "INSUFFICIENT_DATA"
  | "NOT_COMPARABLE"
  | "CONFOUNDED"
  | "CONTRADICTED"
  | "BLOCKED";

export type ContradictionStatus =
  | "CONSISTENT"
  | "MINOR_VARIANCE"
  | "DIVERGENT"
  | "CONTRADICTED"
  | "CONFOUNDED"
  | "INSUFFICIENT_DATA";

export type OutlierStatus =
  | "NORMAL"
  | "POTENTIAL_OUTLIER"
  | "HIGH_DEVIATION"
  | "INVALID_RUN"
  | "SAFETY_DISCARDED"
  | "THERMAL_DISCARDED"
  | "PROCESS_FAILURE"
  | "UNKNOWN";

export type ClusterJobPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "BACKGROUND";

export interface SiliconIdentity {
  cpuVendor: string;
  cpuFamily: string;
  cpuModel: string;
  cpuStepping: string;
  cpuArchitecture: string;
  cpuCores: number;
  cpuThreads: number;
  cpuCacheTopology: string;
  cpuSupportedInstructionSets: string[];
  gpuVendor: string;
  gpuArchitecture: string;
  gpuSku: string;
  gpuVramGb: number;
  gpuDriverVersion: string;
  gpuFirmwareVersion: string;
  motherboard: string;
  biosVersion: string;
  ramGb: number;
  ramSpeedMhz: number;
  operatingSystem: string;
  kernelVersion: string;
  powerConfigWatts: number;
  siliconFingerprint: string;
}

export interface NodeCapabilities {
  cpuTelemetry: HardwareCapabilityState;
  gpuTelemetry: HardwareCapabilityState;
  externalPowerMeter: HardwareCapabilityState;
  oscilloscope: HardwareCapabilityState;
  daqSystem: HardwareCapabilityState;
  thermalChamber: HardwareCapabilityState;
  directX12Ultimate: HardwareCapabilityState;
  vulkanRayTracing: HardwareCapabilityState;
}

export interface TestbenchClusterNode {
  nodeId: string;
  testbenchId: string;
  clusterId: string;
  userId: string;
  researchRunId: string;
  name: string;
  hardwareIdentity: string;
  siliconIdentity: SiliconIdentity;
  capabilities: NodeCapabilities;
  healthStatus: NodeHealthStatus;
  runnerStatus: string;
  runnerVersion: string;
  authorizationState: "AUTHORIZED" | "AWAITING_AUTHORIZATION" | "UNAUTHORIZED" | "REVOKED";
  safetyState: "PASS" | "FAIL" | "BLOCKED" | "UNCHECKED";
  methodologyFingerprint: string;
  siliconFingerprint: string;
  reproducibilityFingerprint: string;
  activeLock: NodeExecutionLock;
  currentJobId?: string;
  completedJobsCount: number;
  failedJobsCount: number;
  blockers: string[];
  lastHeartbeatAt: string;
  registeredAt: string;
}

export interface TestbenchClusterJob {
  jobId: string;
  clusterId: string;
  userId: string;
  researchRunId: string;
  benchmarkSuite: string;
  benchmarkVersion: string;
  resolution: string;
  preset: string;
  renderingApi: string;
  targetNodeId?: string;
  allocatedNodeId?: string;
  executionPlanHash: string;
  methodologyFingerprint: string;
  priority: ClusterJobPriority;
  priorityScore: number;
  dependencies: string[];
  requiredCapabilities: string[];
  safetyRequirements: {
    maxThermalLimitCelsius: number;
    maxPowerLimitWatts: number;
    requireExclusiveNode: boolean;
  };
  expectedDurationSeconds?: number;
  retryPolicy: {
    maxRetries: number;
    currentRetry: number;
  };
  status: QueueJobStatus;
  experimentId?: string;
  resultScore?: number;
  metricUnit?: string;
  blockers: string[];
  createdAt: string;
  stagedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface TestbenchCluster {
  clusterId: string;
  userId: string;
  researchRunId: string;
  name: string;
  description: string;
  status: ClusterStatus;
  nodeIds: string[];
  schedulerState: ClusterSchedulerState;
  safetyState: "PASS" | "FAIL" | "BLOCKED";
  methodologyFingerprint: string;
  clusterReproducibilityFingerprint: string;
  activeLock: NodeExecutionLock;
  blockers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SiliconDifferentialEntry {
  differentialId: string;
  clusterId: string;
  userId: string;
  researchRunId: string;
  benchmarkSuite: string;
  nodeAId: string;
  nodeBId: string;
  nodeASku: string;
  nodeBSku: string;
  nodeAStepping: string;
  nodeBStepping: string;
  nodeADriver: string;
  nodeBDriver: string;
  nodeABios: string;
  nodeBBios: string;
  scoreA: number;
  scoreB: number;
  metricUnit: string;
  deltaAbsolute: number;
  deltaPercentage: number;
  powerDeltaWatts?: number;
  perfPerWattDelta?: number;
  thermalDeltaCelsius?: number;
  clockDeltaGhz?: number;
  differentialClassification: DifferentialClassification;
  primaryDivergenceFactor: string;
  candidateCauses: string[];
  confounders: string[];
  isCausallyEstablished: boolean;
  observedDifferenceNote: string;
  methodologyCompatible: boolean;
  evidenceBoundary: string;
  comparedAt: string;
}

export interface SiliconDifferentialMatrix {
  matrixId: string;
  clusterId: string;
  researchRunId: string;
  userId: string;
  entries: SiliconDifferentialEntry[];
  totalComparisonsCount: number;
  variantCount: number;
  contradictionCount: number;
  outlierCount: number;
  evidenceBoundary: string;
  generatedAt: string;
}

export interface CrossNodeReproducibilityReport {
  clusterId: string;
  researchRunId: string;
  clusterReproducibilityFingerprint: string;
  matchedMethodologyCount: number;
  totalNodesCount: number;
  consistencyScore: number;
  isMethodologyAligned: boolean;
  excludedDifferences: string[];
  evaluatedAt: string;
}

export interface SiliconOutlierReport {
  outlierId: string;
  clusterId: string;
  nodeId: string;
  runIndex: number;
  benchmarkSuite: string;
  rawScore: number;
  normalizedScore: number;
  metricUnit: string;
  deviationPercentage: number;
  outlierStatus: OutlierStatus;
  reason: string;
  detectionMethod: string;
  confidenceScore: number;
  recommendation: string;
  preservedRawMeasurement: number;
  detectedAt: string;
}

export interface CrossNodeContradiction {
  contradictionId: string;
  clusterId: string;
  benchmarkSuite: string;
  conflictingNodeIds: string[];
  observedScores: { nodeId: string; score: number; metricUnit: string }[];
  variancePercentage: number;
  contradictionStatus: ContradictionStatus;
  possibleExplanations: string[];
  confounders: string[];
  validationRequired: boolean;
  surfacedAt: string;
}

export interface SiliconDifferentialResearchOpportunity {
  opportunityId: string;
  clusterId: string;
  researchRunId: string;
  userId: string;
  title: string;
  hypothesis: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "IDENTIFIED" | "TRIAGED" | "QUEUED" | "VALIDATED" | "REJECTED";
  affectedNodeIds: string[];
  affectedSKUs: string[];
  affectedBenchmarks: string[];
  candidateCauses: string[];
  confounders: string[];
  observedDeltaPercentage: number;
  supportingEvidence: string[];
  requiredValidationTasks: string[];
  confidence: number;
  isCausallyEstablished: boolean;
  evidenceBoundary: string;
  createdAt: string;
}

export interface TestbenchClusterSnapshot {
  snapshotId: string;
  clusterId: string;
  researchRunId: string;
  userId: string;
  clusterStatus: ClusterStatus;
  nodeCount: number;
  jobCount: number;
  comparisonCount: number;
  opportunityCount: number;
  nodeFingerprints: string[];
  planHashes: string[];
  methodologyFingerprints: string[];
  snapshotHash: string;
  createdAt: string;
}

export type ClusterLineageStage =
  | "1. CLUSTER_INPUT"
  | "2. NODE_CAPABILITY"
  | "3. EXECUTION_OBSERVATION"
  | "4. METHODOLOGY_ALIGNMENT"
  | "5. SILICON_DIFFERENTIAL"
  | "6. RESEARCH_OPPORTUNITY";

export interface ClusterLineageLink {
  stage: ClusterLineageStage;
  title: string;
  detail: string;
  status: "VERIFIED" | "EVALUATED" | "CONFOUNDED" | "BLOCKED" | "EXCLUDED";
  metadata?: Record<string, any>;
}

export interface ClusterLineageTrace {
  differentialId: string;
  clusterId: string;
  researchRunId: string;
  userId: string;
  stages: ClusterLineageLink[];
  exclusions: string[];
  generatedAt: string;
}

export interface TestbenchClusterAuditEvent {
  auditId: string;
  clusterId: string;
  userId: string;
  researchRunId: string;
  timestamp: string;
  eventType:
    | "CLUSTER_CREATED"
    | "CLUSTER_UPDATED"
    | "NODE_REGISTERED"
    | "NODE_REMOVED"
    | "CAPABILITY_DISCOVERED"
    | "SAFETY_CHECK_PASSED"
    | "SAFETY_CHECK_FAILED"
    | "AUTHORIZATION_GRANTED"
    | "AUTHORIZATION_REVOKED"
    | "JOB_QUEUED"
    | "JOB_ALLOCATED"
    | "JOB_STARTED"
    | "JOB_COMPLETED"
    | "JOB_FAILED"
    | "JOB_ABORTED"
    | "NODE_FAILED"
    | "NODE_ABORTED"
    | "TELEMETRY_COMPLETED"
    | "DIFFERENTIAL_COMPUTED"
    | "CONTRADICTION_DETECTED"
    | "OUTLIER_DETECTED"
    | "CLUSTER_MARKED_STALE"
    | "VALIDATION_TASK_CREATED"
    | "SNAPSHOT_CREATED"
    | "BLOCKER_PROPAGATED";
  targetId: string;
  actor: string;
  beforeState?: string;
  afterState?: string;
  reason: string;
  metadata?: Record<string, any>;
  integrityHash: string;
}
