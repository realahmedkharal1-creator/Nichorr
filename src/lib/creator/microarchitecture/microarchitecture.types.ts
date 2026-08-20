// ============================================================================
// PHASE 93: AUTOMATED CROSS-GENERATIONAL MICROARCHITECTURAL BOTTLENECK
// ATTRIBUTION & CLOSED-LOOP RESEARCH CALIBRATION RECONCILIATION TYPES
// ============================================================================

export type TraceSourceState =
  | "AVAILABLE"
  | "NOT_CONFIGURED"
  | "UNAVAILABLE"
  | "UNKNOWN"
  | "TRACE_UNAVAILABLE"
  | "INVALID";

export type StallCategory =
  | "FRONTEND_BOUND"
  | "BACKEND_BOUND"
  | "CORE_EXECUTION_BOUND"
  | "MEMORY_BOUND"
  | "CACHE_BOUND"
  | "BRANCH_BOUND"
  | "INTERCONNECT_BOUND"
  | "THERMAL_BOUND"
  | "POWER_BOUND"
  | "FREQUENCY_BOUND"
  | "OCCUPANCY_BOUND"
  | "DEPENDENCY_BOUND"
  | "UNKNOWN_BOUND";

export type BottleneckAttributionType =
  | "MEMORY_BANDWIDTH_PRESSURE"
  | "CACHE_MISS_PRESSURE"
  | "BRANCH_MISPREDICTION_PRESSURE"
  | "EXECUTION_DEPENDENCY_PRESSURE"
  | "FRONTEND_STARVATION"
  | "THERMAL_LIMITATION"
  | "POWER_LIMITATION"
  | "FREQUENCY_LIMITATION"
  | "INTERCONNECT_SATURATION"
  | "SHADER_OCCUPANCY_DEFICIT"
  | "UNACCOUNTED_BOTTLENECK";

export type CrossGenerationClassification =
  | "ARCHITECTURAL_DIFFERENCE"
  | "SILICON_DIFFERENCE"
  | "STEPPING_DIFFERENCE"
  | "CACHE_DIFFERENCE"
  | "MEMORY_SUBSYSTEM_DIFFERENCE"
  | "EXECUTION_DIFFERENCE"
  | "BRANCH_BEHAVIOR_DIFFERENCE"
  | "DRIVER_DIFFERENCE"
  | "FIRMWARE_DIFFERENCE"
  | "THERMAL_DIFFERENCE"
  | "POWER_DIFFERENCE"
  | "MULTI_FACTOR_DIFFERENCE"
  | "METHODOLOGY_VARIANT"
  | "NOT_COMPARABLE"
  | "CONFOUNDED"
  | "INSUFFICIENT_DATA";

export type PhysicalReconciliationStatus =
  | "CONSISTENT_WITH_PHYSICAL_EVIDENCE"
  | "PARTIALLY_CONSISTENT"
  | "DIVERGENT"
  | "CONFOUNDED"
  | "INSUFFICIENT_DATA"
  | "NOT_COMPARABLE";

export type LedgerReconciliationStatus =
  | "SUPPORTED_BY_LEDGER"
  | "PARTIALLY_SUPPORTED"
  | "NEW_EVIDENCE"
  | "CONFLICTS_WITH_LEDGER"
  | "INSUFFICIENT_EVIDENCE"
  | "NOT_COMPARABLE";

export interface HardwareExecutionTrace {
  traceId: string;
  userId: string;
  researchRunId: string;
  sourceType: string;
  sourceState: TraceSourceState;
  hardwareTarget: string;
  cpuModel: string;
  cpuStepping: string;
  gpuModel: string;
  gpuArchitecture: string;
  driverVersion: string;
  firmwareVersion: string;
  biosVersion: string;
  osVersion: string;
  benchmarkSuite: string;
  benchmarkVersion: string;
  workload: string;
  resolution: string;
  preset: string;
  renderingApi: string;
  upscalingTechnology?: string;
  frameGeneration?: boolean;
  rayTracing?: boolean;
  powerLimitWatts?: number;
  observedPowerWatts?: number;
  observedTemperatureCelsius?: number;
  observedClockGhz?: number;
  methodologyFingerprint: string;
  siliconFingerprint: string;
  sourceSnapshotHash: string;
  rawCounters: Record<string, number>;
  capturedAt: string;
}

export interface NormalizedTraceEvents {
  traceId: string;
  ipc: number;
  frontendStallRate: number; // percentage
  backendStallRate: number; // percentage
  coreStallRate: number;
  memoryStallRate: number;
  l1DataCacheMissRate: number;
  l2CacheMissRate: number;
  l3CacheMissRate: number;
  branchMispredictionRate: number;
  gpuComputeUtilization?: number;
  gpuMemoryBandwidthUtilization?: number;
  gpuWarpOccupancy?: number;
  pcieBandwidthUtilization?: number;
  normalizedScore: number;
  metricUnit: string;
  completenessRatio: number; // 0 to 1
  normalizedAt: string;
}

export interface StallDecompositionRecord {
  decompositionId: string;
  traceId: string;
  category: StallCategory;
  observedValue: number;
  normalizedValue: number; // 0 to 100 percentage of total stall cycles
  unit: string;
  confidence: number;
  evidenceStatus: "OBSERVED" | "ESTIMATED" | "UNKNOWN";
  methodologyFingerprint: string;
}

export interface BottleneckAttributionRecord {
  attributionId: string;
  traceId: string;
  userId: string;
  researchRunId: string;
  attributionType: BottleneckAttributionType;
  primaryStallCategory: StallCategory;
  supportingSignals: string[];
  contradictingSignals: string[];
  confidence: number; // 0 to 100
  evidenceStatus: "OBSERVED_TRACE_ATTRIBUTION" | "ESTIMATED_TRACE_ATTRIBUTION";
  isCausallyEstablished: boolean; // Absolute non-causal guard: defaults to false
  summary: string;
  epistemicBoundary: string;
  attributedAt: string;
}

export interface CrossGenerationComparison {
  comparisonId: string;
  userId: string;
  researchRunId: string;
  baselineTraceId: string;
  candidateTraceId: string;
  baselineSku: string;
  candidateSku: string;
  baselineStepping: string;
  candidateStepping: string;
  baselineAttribution: BottleneckAttributionType;
  candidateAttribution: BottleneckAttributionType;
  performanceDeltaPercentage: number;
  powerDeltaWatts?: number;
  perfPerWattDelta?: number;
  classification: CrossGenerationClassification;
  confounders: string[];
  isCausallyEstablished: boolean;
  notes: string;
  comparedAt: string;
}

export interface PhysicalReconciliationRecord {
  reconciliationId: string;
  traceId: string;
  benchmarkScore: number;
  metricUnit: string;
  observedPowerWatts?: number;
  observedTemperatureCelsius?: number;
  attributedBottleneck: BottleneckAttributionType;
  reconciliationStatus: PhysicalReconciliationStatus;
  divergenceExplanation?: string;
  confounders: string[];
  reconciledAt: string;
}

export interface LedgerReconciliationRecord {
  reconciliationId: string;
  attributionId: string;
  ledgerEntryId?: string;
  ledgerClaim?: string;
  attributionType: BottleneckAttributionType;
  reconciliationStatus: LedgerReconciliationStatus;
  agreementSummary: string;
  conflictDetails?: string;
  requiresCalibration: boolean;
  reconciledAt: string;
}

export interface MicroarchitectureResearchOpportunity {
  opportunityId: string;
  userId: string;
  researchRunId: string;
  title: string;
  hypothesis: string;
  observedSignals: string[];
  supportingEvidence: string[];
  contradictingEvidence: string[];
  confounders: string[];
  requiredValidation: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  resolutionStatus: "OPEN" | "VALIDATION_PENDING" | "VALIDATED" | "REJECTED";
  isCausallyEstablished: boolean;
  evidenceBoundary: string;
  createdAt: string;
}

export interface MicroarchitectureSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  traceCount: number;
  validTraceCount: number;
  rejectedTraceCount: number;
  attributionCount: number;
  comparisonCount: number;
  physicalReconciliationCount: number;
  ledgerReconciliationCount: number;
  opportunityCount: number;
  snapshotHash: string;
  createdAt: string;
}

export type MicroarchitectureLineageStage =
  | "1. SOURCE TRACE"
  | "2. TRACE NORMALIZATION"
  | "3. STALL DECOMPOSITION"
  | "4. BOTTLENECK ATTRIBUTION"
  | "5. PHYSICAL / LEDGER RECONCILIATION"
  | "6. RESEARCH VALIDATION PATH";

export interface MicroarchitectureLineageLink {
  stage: MicroarchitectureLineageStage;
  title: string;
  detail: string;
  status: "VERIFIED" | "EVALUATED" | "CONFOUNDED" | "BLOCKED" | "EXCLUDED";
  metadata?: Record<string, any>;
}

export interface MicroarchitectureLineageTrace {
  lineageId: string;
  attributionOrOpportunityId: string;
  researchRunId: string;
  userId: string;
  stages: MicroarchitectureLineageLink[];
  exclusions: string[];
  generatedAt: string;
}

export interface MicroarchitectureAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  timestamp: string;
  eventType:
    | "TRACE_REGISTERED"
    | "TRACE_VALIDATED"
    | "TRACE_REJECTED"
    | "TRACE_NORMALIZED"
    | "STALL_DECOMPOSED"
    | "BOTTLENECK_ATTRIBUTED"
    | "COMPARISON_CREATED"
    | "RECONCILIATION_CREATED"
    | "LEDGER_CONFLICT_DETECTED"
    | "RESEARCH_OPPORTUNITY_CREATED"
    | "VALIDATION_TASK_CREATED"
    | "SNAPSHOT_CREATED"
    | "SNAPSHOT_INVALIDATED"
    | "BLOCKER_TRIGGERED";
  targetId: string;
  actor: string;
  reason: string;
  beforeState?: string;
  afterState?: string;
  metadata?: Record<string, any>;
  integrityHash: string;
}
