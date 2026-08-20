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
  | "COUNTERS_UNAVAILABLE"
  | "PROFILER_NOT_CONFIGURED"
  | "LIVE_TELEMETRY_UNAVAILABLE"
  | "INVALID";

export type MicroarchitecturalCategory =
  | "CORE_EXECUTION"
  | "FRONTEND"
  | "BRANCH_PREDICTION"
  | "SIMD_VECTOR_EXECUTION"
  | "CACHE_L1"
  | "CACHE_L2"
  | "CACHE_L3"
  | "MEMORY_LATENCY"
  | "MEMORY_BANDWIDTH"
  | "INTERCONNECT"
  | "SYNCHRONIZATION"
  | "SYSTEM_CALL_OVERHEAD"
  | "THERMAL_LIMITATION"
  | "POWER_LIMITATION"
  | "CLOCK_LIMITATION"
  | "DRIVER_OVERHEAD"
  | "FIRMWARE_EFFECT"
  | "PLATFORM_EFFECT"
  | "UNKNOWN"
  | "INSUFFICIENT_DATA"
  | "CONFOUNDED";

export type EvidenceStrength =
  | "NONE"
  | "VERY_LOW"
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "VERY_HIGH";

export type ConfounderLevel =
  | "NO_CONFOUNDERS"
  | "LOW_CONFOUNDING"
  | "MODERATE_CONFOUNDING"
  | "HIGH_CONFOUNDING"
  | "CONFOUNDED";

export type CrossGenerationalClassification =
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

export type ResearchHealthEffect =
  | "SUPPORTS_EXISTING_FINDING"
  | "WEAKENS_EXISTING_FINDING"
  | "CONTRADICTS_EXISTING_FINDING"
  | "REQUIRES_REVIEW"
  | "NO_CHANGE"
  | "INSUFFICIENT_DATA";

export type AttributionValidationStatus =
  | "OPEN"
  | "VALIDATION_PENDING"
  | "VALIDATED"
  | "REJECTED"
  | "INCONCLUSIVE";

export interface CounterSample {
  counterName: string;
  rawValue: number;
  normalizedValue: number;
  unit: string;
  confidence: EvidenceStrength;
  isAvailable: boolean;
}

export interface MicroarchitecturalTrace {
  traceId: string;
  userId: string;
  researchRunId: string;
  source: string;
  sourceType: "PHYSICAL_PMU_COUNTERS" | "PROFILER_TRACE" | "BENCHMARK_EXECUTION" | "SIMULATION_TRACE";
  sourceState: TraceSourceState;
  laboratoryId?: string;
  clusterId?: string;
  nodeId?: string;
  experimentId?: string;
  datasetId?: string;
  hardwareTarget: string;
  cpuModel: string;
  cpuStepping: string;
  cpuArchitecture?: string;
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
  counters: Record<string, number>;
  counterSamples: CounterSample[];
  capturedAt: string;
}

export interface TraceNormalizationRecord {
  traceId: string;
  ipc: number;
  instructions: number;
  cycles: number;
  frontendStallPercentage: number;
  backendStallPercentage: number;
  memoryStallPercentage: number;
  coreStallPercentage: number;
  l1DataCacheMissRateMPKI: number;
  l2CacheMissRateMPKI: number;
  l3CacheMissRateMPKI: number;
  branchMispredictionRateMPKI: number;
  gpuComputeUtilization?: number;
  gpuMemoryBandwidthUtilization?: number;
  gpuWarpOccupancy?: number;
  pcieBandwidthUtilization?: number;
  completenessRatio: number;
  normalizedAt: string;
}

export interface StallDecompositionEntry {
  entryId: string;
  traceId: string;
  category: MicroarchitecturalCategory;
  subCategory?: string;
  observedValue: number;
  normalizedPercentage: number;
  unit: string;
  evidenceBasis: string;
  confidence: EvidenceStrength;
  methodologyFingerprint: string;
}

export interface ConfounderAssessment {
  confounderLevel: ConfounderLevel;
  identifiedConfounders: string[];
  driverVariance: boolean;
  firmwareVariance: boolean;
  biosVariance: boolean;
  thermalVariance: boolean;
  powerLimitVariance: boolean;
  methodologyVariance: boolean;
}

export interface MicroarchitecturalAttributionRecord {
  attributionId: string;
  traceId: string;
  userId: string;
  researchRunId: string;
  attributionClassification: MicroarchitecturalCategory;
  evidenceStrength: EvidenceStrength;
  evidenceSources: string[];
  supportingMeasurements: string[];
  excludedMeasurements: string[];
  confounders: string[];
  methodologyCompatibility: string;
  reproducibilityStatus: "REPRODUCIBLE" | "SINGLE_LAB_OBSERVED" | "CONFLICTED" | "UNKNOWN";
  causalStatus: "HYPOTHESIS_ONLY" | "CORRELATED" | "CAUSALLY_ESTABLISHED";
  isCausallyEstablished: boolean; // Permanent non-causal default: false
  validationStatus: AttributionValidationStatus;
  summary: string;
  epistemicBoundary: string;
  attributedAt: string;
}

export interface CrossGenerationalAttributionMatrix {
  comparisonId: string;
  userId: string;
  researchRunId: string;
  baselineGeneration: string;
  candidateGeneration: string;
  baselineSku: string;
  candidateSku: string;
  baselineStepping: string;
  candidateStepping: string;
  baselineAttribution: MicroarchitecturalCategory;
  candidateAttribution: MicroarchitecturalCategory;
  performanceDeltaPercentage: number;
  powerDeltaWatts?: number;
  perfPerWattDelta?: number;
  cacheDeltaPercentage?: number;
  memoryDeltaPercentage?: number;
  branchDeltaPercentage?: number;
  frontendDeltaPercentage?: number;
  backendDeltaPercentage?: number;
  classification: CrossGenerationalClassification;
  confounderAssessment: ConfounderAssessment;
  methodologyCompatibility: string;
  isCausallyEstablished: boolean;
  notes: string;
  comparedAt: string;
}

export interface ResearchHealthReconciliationRecord {
  reconciliationId: string;
  attributionId: string;
  targetResearchRunId: string;
  previousHealthStatus: string;
  newHealthEffect: ResearchHealthEffect;
  evidenceDeltaSummary: string;
  affectedClaimsCount: number;
  affectedClaims: string[];
  recommendedHumanAction: string;
  reconciledAt: string;
}

export interface MicroarchitecturalOpportunity {
  opportunityId: string;
  userId: string;
  researchRunId: string;
  title: string;
  hypothesis: string;
  observedEvidence: string[];
  supportingTraces: string[];
  supportingMeasurements: string[];
  confounders: string[];
  missingEvidence: string[];
  requiredValidation: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  epistemicClassification: "HYPOTHESIS" | "CALIBRATION_OPPORTUNITY" | "CONFLICTED_EVIDENCE";
  resolutionStatus: AttributionValidationStatus;
  isCausallyEstablished: boolean;
  createdAt: string;
}

export interface MicroarchitecturalSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  traceCount: number;
  validTraceCount: number;
  attributionCount: number;
  comparisonCount: number;
  opportunityCount: number;
  reconciliationCount: number;
  snapshotHash: string;
  createdAt: string;
}

export type MicroarchitecturalLineageStage =
  | "1. SOURCE TRACE / MEASUREMENT"
  | "2. NORMALIZATION"
  | "3. MICROARCHITECTURAL DECOMPOSITION"
  | "4. ATTRIBUTION"
  | "5. VALIDATION / CALIBRATION"
  | "6. RESEARCH HEALTH / VERIFIED LEDGER RECONCILIATION";

export interface MicroarchitecturalLineageLink {
  stage: MicroarchitecturalLineageStage;
  title: string;
  input: string;
  transformation: string;
  output: string;
  status: "VERIFIED" | "EVALUATED" | "CONFOUNDED" | "BLOCKED" | "EXCLUDED";
  excludedEvidence?: string[];
  blockers?: string[];
  provenance: Record<string, any>;
}

export interface MicroarchitecturalLineageTrace {
  lineageId: string;
  attributionId: string;
  userId: string;
  researchRunId: string;
  stages: MicroarchitecturalLineageLink[];
  exclusions: string[];
  generatedAt: string;
}

export interface MicroarchitecturalAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  timestamp: string;
  eventType:
    | "TRACE_INGESTION"
    | "TRACE_NORMALIZED"
    | "COUNTER_INGESTION"
    | "STALL_DECOMPOSITION"
    | "ATTRIBUTION_CREATED"
    | "ATTRIBUTION_UPDATED"
    | "COMPARISON_CREATED"
    | "CONFOUNDER_DETECTED"
    | "VALIDATION_REQUESTED"
    | "VALIDATION_RESULT"
    | "CALIBRATION_RECONCILED"
    | "RESEARCH_HEALTH_RECONCILED"
    | "LEDGER_PROMOTION_EVALUATED"
    | "BLOCKER_ACTIVATED"
    | "BLOCKER_RESOLVED"
    | "SNAPSHOT_CREATED";
  targetId: string;
  actor: string;
  reason: string;
  metadata?: Record<string, any>;
  integrityHash: string;
}
