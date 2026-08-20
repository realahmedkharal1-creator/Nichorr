// ============================================================================
// PHASE 92: AUTOMATED CONTINUOUS CROSS-LABORATORY EMPIRICAL REGRESSION
// SYNTHESIS & VERIFIED RESEARCH LEDGER CONSOLIDATION TYPES
// ============================================================================

export type EpistemicLayer =
  | "OBSERVED_EVIDENCE"
  | "PHYSICAL_MEASUREMENT"
  | "SIMULATION_RESULT"
  | "FORECAST"
  | "CORRELATION"
  | "EMPIRICAL_SYNTHESIS"
  | "VALIDATED_RESEARCH_EVIDENCE";

export type CrossLabMethodologyCompatibility =
  | "IDENTICAL"
  | "HIGHLY_COMPARABLE"
  | "COMPARABLE"
  | "PARTIALLY_COMPARABLE"
  | "CONFOUNDED"
  | "NOT_COMPARABLE"
  | "UNKNOWN";

export type DatasetIndependenceState =
  | "INDEPENDENT"
  | "POTENTIALLY_DEPENDENT"
  | "DEPENDENT"
  | "DUPLICATE"
  | "UNKNOWN";

export type SiliconDriftClassification =
  | "OBSERVED_DRIFT"
  | "REPEATED_REGRESSION"
  | "REPEATED_IMPROVEMENT"
  | "STABLE"
  | "MIXED"
  | "CONFOUNDED"
  | "INSUFFICIENT_DATA";

export type CrossLabSynthesisClassification =
  | "REPEATED_IMPROVEMENT"
  | "REPEATED_REGRESSION"
  | "MIXED_RESULT"
  | "NO_MATERIAL_CHANGE"
  | "CONFOUNDED"
  | "CONTRADICTED"
  | "INSUFFICIENT_DATA"
  | "NOT_COMPARABLE"
  | "BLOCKED";

export type CrossLabOutlierStatus =
  | "NORMAL"
  | "POTENTIAL_OUTLIER"
  | "HIGH_DEVIATION"
  | "THERMAL_DISCARDED"
  | "SAFETY_DISCARDED"
  | "METHODOLOGY_OUTLIER"
  | "UNKNOWN";

export type ResearchCalibrationResolutionStatus =
  | "OPEN"
  | "VALIDATION_PENDING"
  | "VALIDATED"
  | "REJECTED"
  | "INCONCLUSIVE"
  | "STALE"
  | "BLOCKED";

export type CanonicalMetricType =
  | "FPS"
  | "AVG_FPS"
  | "P1_LOW"
  | "P0_1_LOW"
  | "FRAME_TIME"
  | "POWER_W"
  | "ENERGY_J"
  | "PERFORMANCE_PER_WATT"
  | "TEMPERATURE_C"
  | "CLOCK_GHZ"
  | "MEMORY_BANDWIDTH_GBPS";

export interface LaboratoryIdentity {
  laboratoryId: string;
  clusterId: string;
  name: string;
  location?: string;
  hardwareSummary: string;
  laboratoryFingerprint: string;
  clusterFingerprint: string;
  status: "ACTIVE" | "DEGRADED" | "OFFLINE" | "UNAVAILABLE";
  registeredAt: string;
}

export interface NormalizedLaboratoryObservation {
  observationId: string;
  laboratoryId: string;
  clusterId: string;
  nodeId: string;
  experimentId?: string;
  runIndex: number;
  benchmarkSuite: string;
  benchmarkVersion: string;
  metricType: CanonicalMetricType;
  rawScore: number;
  normalizedScore: number;
  metricUnit: string;
  powerWatts?: number;
  temperatureCelsius?: number;
  clockFrequencyGhz?: number;
  sourceSnapshotHash: string;
  methodologyFingerprint: string;
  siliconFingerprint: string;
  clusterReproducibilityFingerprint: string;
  epistemicLayer: EpistemicLayer;
  evidenceClassification: string;
  observedAt: string;
}

export interface LaboratoryDataset {
  datasetId: string;
  laboratoryId: string;
  clusterId: string;
  userId: string;
  researchRunId: string;
  name: string;
  description: string;
  observations: NormalizedLaboratoryObservation[];
  independenceState: DatasetIndependenceState;
  datasetSnapshotHash: string;
  createdAt: string;
}

export interface LongitudinalSiliconPoint {
  timestamp: string;
  observationId: string;
  laboratoryId: string;
  driverVersion: string;
  firmwareVersion: string;
  biosVersion: string;
  score: number;
  metricUnit: string;
  powerWatts?: number;
  perfPerWatt?: number;
}

export interface LongitudinalSiliconSeries {
  seriesId: string;
  siliconFingerprint: string;
  architecture: string;
  sku: string;
  stepping: string;
  benchmarkSuite: string;
  metricType: CanonicalMetricType;
  baselineScore: number;
  latestScore: number;
  minimumScore: number;
  maximumScore: number;
  medianScore: number;
  totalDataPoints: number;
  driftDeltaPercentage: number;
  driftClassification: SiliconDriftClassification;
  driverTransitions: string[];
  firmwareTransitions: string[];
  biosTransitions: string[];
  points: LongitudinalSiliconPoint[];
  epistemicBoundary: string;
  lastEvaluatedAt: string;
}

export interface CrossLabSynthesisComparison {
  comparisonId: string;
  userId: string;
  researchRunId: string;
  benchmarkSuite: string;
  metricType: CanonicalMetricType;
  labAId: string;
  labBId: string;
  labASku: string;
  labBSku: string;
  labAScore: number;
  labBScore: number;
  metricUnit: string;
  absoluteDelta: number;
  percentageDelta: number;
  powerDeltaWatts?: number;
  perfPerWattDelta?: number;
  thermalDeltaCelsius?: number;
  clockDeltaGhz?: number;
  methodologyCompatibility: CrossLabMethodologyCompatibility;
  synthesisClassification: CrossLabSynthesisClassification;
  confounders: string[];
  candidateCauses: string[];
  isCausallyEstablished: boolean; // Absolute epistemic guard
  isContradicted: boolean;
  contradictionExplanation?: string;
  reproducibilityScore: number;
  evidenceBoundary: string;
  synthesizedAt: string;
}

export interface CrossLabSynthesisMatrix {
  matrixId: string;
  userId: string;
  researchRunId: string;
  comparisons: CrossLabSynthesisComparison[];
  totalComparisonsCount: number;
  repeatedRegressionsCount: number;
  repeatedImprovementsCount: number;
  contradictionsCount: number;
  confoundedCount: number;
  evidenceBoundary: string;
  generatedAt: string;
}

export interface CrossLabContradictionReport {
  contradictionId: string;
  benchmarkSuite: string;
  labAId: string;
  labBId: string;
  labAScore: number;
  labBScore: number;
  metricUnit: string;
  variancePercentage: number;
  explanation: string;
  confounders: string[];
  requiresValidation: boolean;
  surfacedAt: string;
}

export interface CrossLabReproducibilityReport {
  reproducibilityId: string;
  userId: string;
  researchRunId: string;
  crossLabReproducibilityFingerprint: string;
  matchedLaboratoriesCount: number;
  totalLaboratoriesCount: number;
  independentObservationsCount: number;
  consistencyScore: number;
  excludedDatasets: string[];
  exclusionReasons: string[];
  evaluatedAt: string;
}

export interface CrossLabOutlierReport {
  outlierId: string;
  observationId: string;
  laboratoryId: string;
  benchmarkSuite: string;
  rawScore: number;
  deviationPercentage: number;
  outlierStatus: CrossLabOutlierStatus;
  reason: string;
  recommendation: string;
  preservedRawMeasurement: number;
  detectedAt: string;
}

export interface CrossLabValidationOpportunity {
  opportunityId: string;
  userId: string;
  researchRunId: string;
  title: string;
  hypothesis: string;
  affectedSKUs: string[];
  affectedLaboratories: string[];
  affectedBenchmarks: string[];
  observedDeltaPercentage: number;
  candidateCauses: string[];
  confounders: string[];
  confidenceScore: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  resolutionStatus: ResearchCalibrationResolutionStatus;
  isCausallyEstablished: boolean;
  evidenceBoundary: string;
  createdAt: string;
}

export interface VerifiedResearchLedgerEntry {
  ledgerEntryId: string;
  researchRunId: string;
  userId: string;
  claimOrFinding: string;
  evidenceRefs: string[];
  sourceSnapshotHashes: string[];
  validationTaskId: string;
  validationOutcome: "VALIDATED";
  methodologyFingerprint: string;
  laboratoryFingerprints: string[];
  clusterFingerprints: string[];
  siliconFingerprints: string[];
  confidence: number;
  isCausallyEstablished: boolean;
  createdFromPhase: "PHASE_92_CROSS_LAB_REGRESSION";
  lineageId: string;
  ledgerSnapshotHash: string;
  promotedAt: string;
}

export interface EvidencePromotionDecision {
  canPromote: boolean;
  opportunityId: string;
  rejectionReasons: string[];
  activeBlockers: string[];
  evaluatedAt: string;
}

export interface CrossLabRegressionSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  laboratoryCount: number;
  clusterCount: number;
  observationCount: number;
  independentObservationCount: number;
  seriesCount: number;
  regressionCount: number;
  improvementCount: number;
  contradictionCount: number;
  confoundedCount: number;
  opportunityCount: number;
  ledgerEntryCount: number;
  snapshotHash: string;
  createdAt: string;
}

export type CrossLabLineageStage =
  | "Stage 1 — Source Measurement"
  | "Stage 2 — Normalization"
  | "Stage 3 — Comparability & Independence"
  | "Stage 4 — Empirical Synthesis"
  | "Stage 5 — Research Validation"
  | "Stage 6 — Verified Research Ledger Decision";

export interface CrossLabLineageLink {
  stage: CrossLabLineageStage;
  title: string;
  detail: string;
  status: "VERIFIED" | "EVALUATED" | "CONFOUNDED" | "BLOCKED" | "EXCLUDED";
  metadata?: Record<string, any>;
}

export interface CrossLabLineageTrace {
  lineageId: string;
  comparisonOrEntryId: string;
  researchRunId: string;
  userId: string;
  stages: CrossLabLineageLink[];
  exclusions: string[];
  generatedAt: string;
}

export interface CrossLabRegressionAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  timestamp: string;
  eventType:
    | "LABORATORY_REGISTERED"
    | "DATASET_IMPORTED"
    | "DATASET_NORMALIZED"
    | "OBSERVATION_EXCLUDED"
    | "METHODOLOGY_MISMATCH"
    | "INDEPENDENCE_EVALUATED"
    | "REGRESSION_DETECTED"
    | "CONTRADICTION_DETECTED"
    | "OPPORTUNITY_CREATED"
    | "VALIDATION_REQUESTED"
    | "VALIDATION_RESOLVED"
    | "EVIDENCE_PROMOTION_ATTEMPTED"
    | "EVIDENCE_PROMOTION_REJECTED"
    | "LEDGER_ENTRY_CREATED"
    | "SNAPSHOT_GENERATED"
    | "STALE_STATE_DETECTED"
    | "BLOCKER_PROPAGATED";
  targetId: string;
  actor: string;
  beforeState?: string;
  afterState?: string;
  reason: string;
  metadata?: Record<string, any>;
  integrityHash: string;
}
