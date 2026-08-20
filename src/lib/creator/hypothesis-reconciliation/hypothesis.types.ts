// ============================================================================
// PHASE 95: AUTOMATED COMPETING HYPOTHESIS, FALSIFICATION & EMPIRICAL
// CALIBRATION RECONCILIATION ENGINE TYPES
// ============================================================================

export type HypothesisDomain =
  | "MICROARCHITECTURAL"
  | "CACHE"
  | "MEMORY"
  | "INTERCONNECT"
  | "THERMAL"
  | "POWER"
  | "DRIVER"
  | "FIRMWARE"
  | "SOFTWARE_RUNTIME"
  | "PLATFORM_CONFIGURATION"
  | "SILICON_VARIANT"
  | "METHODOLOGY"
  | "PERFORMANCE"
  | "EFFICIENCY"
  | "REGRESSION"
  | "IMPROVEMENT"
  | "CO_DESIGN"
  | "MULTI_FACTOR"
  | "UNKNOWN";

export type HypothesisStatus =
  | "DRAFT"
  | "FORMULATED"
  | "EVIDENCE_ATTACHED"
  | "COMPETING_SET"
  | "VALIDATION_REQUIRED"
  | "VALIDATION_PENDING"
  | "PARTIALLY_SUPPORTED"
  | "SUPPORTED"
  | "WEAKENED"
  | "FALSIFICATION_PENDING"
  | "FALSIFIED"
  | "INCONCLUSIVE"
  | "CONFOUNDED"
  | "SUPERSEDED"
  | "REOPENED"
  | "VERIFIED_CANDIDATE";

export type EvidenceRelationshipType =
  | "SUPPORTING"
  | "CONTRADICTING"
  | "COMPATIBLE"
  | "NON_DIAGNOSTIC"
  | "INSUFFICIENT"
  | "CONFOUNDED"
  | "EXCLUDED";

export type EvidenceSourceType =
  | "OBSERVED_EVIDENCE"
  | "PHYSICAL_MEASUREMENT"
  | "EXECUTION_TRACE"
  | "HARDWARE_COUNTER"
  | "SIMULATION_RESULT"
  | "FORECAST"
  | "CORRELATION"
  | "EMPIRICAL_SYNTHESIS"
  | "MICROARCHITECTURAL_ATTRIBUTION"
  | "CO_DESIGN_SIMULATION"
  | "VALIDATION_RESULT"
  | "VERIFIED_RESEARCH_EVIDENCE";

export type ConfidenceBand =
  | "VERY_LOW"
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "VERY_HIGH";

export type FalsificationStrength =
  | "WEAK"
  | "MODERATE"
  | "STRONG"
  | "VERY_STRONG"
  | "INSUFFICIENT";

export type PredictionResult =
  | "MATCHED"
  | "PARTIALLY_MATCHED"
  | "MISSED"
  | "INCONCLUSIVE"
  | "BLOCKED"
  | "NOT_TESTED";

export type ConfounderCategory =
  | "THERMAL"
  | "POWER"
  | "DRIVER"
  | "FIRMWARE"
  | "BIOS"
  | "METHODOLOGY"
  | "MEMORY"
  | "CACHE"
  | "INTERCONNECT"
  | "SOFTWARE"
  | "SILICON"
  | "MULTI_FACTOR"
  | "UNKNOWN";

export type ValidationImpact =
  | "STRONGLY_SUPPORTS"
  | "SUPPORTS"
  | "WEAKLY_SUPPORTS"
  | "NON_DIAGNOSTIC"
  | "WEAKENS"
  | "STRONGLY_WEAKENS"
  | "FALSIFIES"
  | "INCONCLUSIVE"
  | "CONFOUNDED"
  | "BLOCKED";

export type ResearchHealthImpact =
  | "NO_CHANGE"
  | "INCREASE_CONFIDENCE"
  | "DECREASE_CONFIDENCE"
  | "REQUIRES_REVIEW"
  | "CONFLICT_DETECTED"
  | "FALSIFICATION_DETECTED"
  | "VALIDATION_REQUIRED"
  | "BLOCKED";

export interface EvidenceAttachment {
  evidenceId: string;
  hypothesisId: string;
  relationship: EvidenceRelationshipType;
  rationale: string;
  evidenceType: EvidenceSourceType;
  sourcePhase: string;
  sourceEntityId: string;
  methodologyFingerprint: string;
  snapshotHash: string;
  confidenceImpact: number; // e.g. +10, -15
  causalRelevance: boolean;
  createdAt: string;
}

export interface HypothesisPrediction {
  predictionId: string;
  hypothesisId: string;
  expectedMetric: string;
  expectedDirection: "INCREASE" | "DECREASE" | "UNCHANGED" | "WITHIN_RANGE";
  expectedRange?: [number, number];
  tolerancePercentage: number;
  requiredConditions: string[];
  requiredControls: string[];
  validationMethod: string;
  status: "PENDING" | "EVALUATED";
  observedValue?: number;
  observedRange?: [number, number];
  result: PredictionResult;
  snapshotHash: string;
}

export interface ResearchHypothesis {
  hypothesisId: string;
  userId: string;
  researchRunId: string;
  title: string;
  statement: string;
  normalizedStatement: string;
  domain: HypothesisDomain;
  sourceType: EvidenceSourceType;
  originatingPhase: string;
  originatingEntityId: string;
  priorConfidence: number; // 0 - 100
  currentConfidence: number; // 0 - 100
  confidenceBand: ConfidenceBand;
  confidenceFactors: string[];
  falsificationStrength: FalsificationStrength;
  causalStatus: boolean; // Permanent non-causal default: false
  status: HypothesisStatus;
  assumptions: string[];
  expectedObservations: string[];
  disconfirmingObservations: string[];
  supportingEvidenceIds: string[];
  contradictoryEvidenceIds: string[];
  compatibleEvidenceIds: string[];
  unresolvedEvidenceIds: string[];
  competingHypothesisIds: string[];
  activeConfounders: ConfounderCategory[];
  requiredValidationTasks: string[];
  completedValidationTasks: string[];
  snapshotHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetingHypothesisGroup {
  groupId: string;
  title: string;
  targetObservation: string;
  hypotheses: {
    hypothesisId: string;
    title: string;
    domain: HypothesisDomain;
    status: HypothesisStatus;
    confidenceBand: ConfidenceBand;
    supportingCount: number;
    contradictingCount: number;
    isMutuallyExclusive: boolean;
  }[];
  primaryDiagnosticDifferentiator: string;
  unresolvedAlternativesCount: number;
}

export interface HypothesisValidationTask {
  taskId: string;
  hypothesisId: string;
  objective: string;
  validationQuestion: string;
  requiredHardware: string;
  requiredBenchmarks: string[];
  requiredControls: string[];
  requiredReplications: number;
  requiredLaboratories: number;
  requiredMeasurements: string[];
  stoppingConditions: string[];
  successCriteria: string;
  failureCriteria: string;
  confounderControls: string[];
  safetyRequirements: string[];
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  Phase86Reference?: string;
  validationStatus: "OPEN" | "VALIDATION_PENDING" | "VALIDATED" | "FALSIFIED" | "INCONCLUSIVE";
  validationImpact?: ValidationImpact;
  createdAt: string;
}

export interface HypothesisHealthReconciliation {
  reconciliationId: string;
  hypothesisId: string;
  targetResearchRunId: string;
  previousHealthStatus: string;
  newHealthImpact: ResearchHealthImpact;
  affectedClaimsCount: number;
  affectedClaims: string[];
  reasoning: string;
  recommendedAction: string;
  reconciledAt: string;
}

export type GraphNodeType =
  | "EVIDENCE"
  | "HYPOTHESIS"
  | "PREDICTION"
  | "VALIDATION_TASK"
  | "VALIDATION_RESULT"
  | "CONFOUNDER"
  | "RESEARCH_FINDING"
  | "LEDGER_CANDIDATE";

export type GraphEdgeType =
  | "SUPPORTS"
  | "CONTRADICTS"
  | "PREDICTS"
  | "VALIDATES"
  | "FALSIFIES"
  | "CONFOUNDS"
  | "DERIVED_FROM"
  | "RECONCILES"
  | "COMPETES_WITH"
  | "SUPERSEDES";

export interface HypothesisGraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  status?: string;
  data: Record<string, any>;
}

export interface HypothesisGraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  label?: string;
  weight?: number;
}

export interface HypothesisGraph {
  nodes: HypothesisGraphNode[];
  edges: HypothesisGraphEdge[];
  generatedAt: string;
}

export type HypothesisLineageStage =
  | "1. SOURCE EVIDENCE"
  | "2. HYPOTHESIS FORMULATION"
  | "3. COMPETING EXPLANATION ANALYSIS"
  | "4. PREDICTION / VALIDATION DESIGN"
  | "5. VALIDATION RECONCILIATION"
  | "6. RESEARCH HEALTH / LEDGER DECISION";

export interface HypothesisLineageLink {
  stage: HypothesisLineageStage;
  title: string;
  input: string;
  transformation: string;
  output: string;
  status: "VERIFIED" | "EVALUATED" | "CONFOUNDED" | "BLOCKED" | "EXCLUDED";
  excludedEvidence?: string[];
  blockers?: string[];
  provenance: Record<string, any>;
}

export interface HypothesisLineageTrace {
  lineageId: string;
  hypothesisId: string;
  userId: string;
  researchRunId: string;
  stages: HypothesisLineageLink[];
  exclusions: string[];
  generatedAt: string;
}

export interface HypothesisSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  hypothesisCount: number;
  competingGroupCount: number;
  evidenceAttachmentCount: number;
  predictionCount: number;
  validationTaskCount: number;
  reconciliationCount: number;
  snapshotHash: string;
  createdAt: string;
}

export interface HypothesisAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  timestamp: string;
  eventType:
    | "HYPOTHESIS_FORMULATED"
    | "HYPOTHESIS_UPDATED"
    | "EVIDENCE_ATTACHED"
    | "COMPETING_SET_CREATED"
    | "PREDICTION_REGISTERED"
    | "PREDICTION_EVALUATED"
    | "FALSIFICATION_EVALUATED"
    | "CONFIDENCE_RECONCILED"
    | "VALIDATION_REQUESTED"
    | "VALIDATION_RECONCILED"
    | "RESEARCH_HEALTH_RECONCILED"
    | "PROMOTION_EVALUATED"
    | "BLOCKER_ACTIVATED"
    | "BLOCKER_RESOLVED"
    | "SNAPSHOT_CREATED";
  targetId: string;
  actor: string;
  reason: string;
  metadata?: Record<string, any>;
  integrityHash: string;
}
