// ============================================================================
// PHASE 86: CLOSED-LOOP RESEARCH CALIBRATION DATA MODELS
// ============================================================================

export type AttributionState =
  | 'NOT_ASSESSED'
  | 'OBSERVATIONAL_ONLY'
  | 'TEMPORALLY_ASSOCIATED'
  | 'CORRELATED'
  | 'POSSIBLE_CONTRIBUTOR'
  | 'SUPPORTED_BY_MULTIPLE_SIGNALS'
  | 'INSUFFICIENT_DATA'
  | 'CONFOUNDED'
  | 'NOT_DETERMINABLE'
  | 'REJECTED';

export type CalibrationCandidateSource =
  | 'AUDIENCE_FACTUAL_QUESTION'
  | 'AUDIENCE_OBJECTION'
  | 'RETENTION_ANOMALY'
  | 'PERFORMANCE_ANOMALY'
  | 'BENCHMARK_DISCREPANCY'
  | 'PUBLICATION_CHANGE'
  | 'EVIDENCE_FRESHNESS_WARNING'
  | 'CONFLICTING_POST_PUBLISH_OBSERVATION'
  | 'REPEATED_RESEARCH_REQUEST'
  | 'METHODOLOGY_CONFUSION';

export type CalibrationStatus =
  | 'IDENTIFIED'
  | 'TRIAGED'
  | 'QUEUED'
  | 'AWAITING_RESEARCH'
  | 'RESEARCH_IN_PROGRESS'
  | 'VALIDATION_REQUIRED'
  | 'VALIDATED'
  | 'REJECTED'
  | 'INCONCLUSIVE'
  | 'MERGED'
  | 'STALE'
  | 'BLOCKED';

export type EvidenceImpactRecommendation =
  | 'NO_IMPACT'
  | 'REVIEW_RECOMMENDED'
  | 'EVIDENCE_REFRESH_RECOMMENDED'
  | 'CLAIM_REVALIDATION_RECOMMENDED'
  | 'METHODOLOGY_REVIEW_RECOMMENDED'
  | 'SOURCE_RECHECK_RECOMMENDED'
  | 'RESEARCH_REOPEN_REQUIRED'
  | 'BLOCKED';

export type CalibrationPriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFORMATIONAL';

export interface CalibrationCandidate {
  candidateId: string;
  researchRunId: string;
  source: CalibrationCandidateSource;
  sourceIdentifier: string;
  title: string;
  description: string;
  observation: string;
  affectedClaimId?: string;
  affectedBenchmarkId?: string;
  affectedMethodology?: string;
  observedAt: string;
  sampleSize: number;
  priority: CalibrationPriority;
  priorityReason: string;
  upstreamLineage: string[];
  status: CalibrationStatus;
}

export interface AttributionAssessment {
  assessmentId: string;
  candidateId: string;
  state: AttributionState;
  observedRelationship: string;
  supportingSignals: string[];
  confounders: string[];
  sampleSize: number;
  confidenceLimitations: string[];
  assessedAt: string;
}

export interface CalibrationQueueItem {
  queueItemId: string;
  candidate: CalibrationCandidate;
  attribution: AttributionAssessment;
  priority: CalibrationPriority;
  evidenceImpact: EvidenceImpactRecommendation;
  status: CalibrationStatus;
  blockers: string[];
  isStale: boolean;
  queuedAt: string;
}

export interface ResearchValidationTask {
  taskId: string;
  queueItemId: string;
  researchRunId: string;
  targetClaimId?: string;
  targetEvidenceKey?: string;
  researchHypothesis: string;
  validationScope: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
}

export type CalibrationResultOutcome =
  | 'NO_CHANGE_REQUIRED'
  | 'OBSERVATION_CONFIRMED'
  | 'EVIDENCE_REFRESHED'
  | 'CLAIM_REVALIDATED'
  | 'CLAIM_REJECTED'
  | 'CLAIM_REFRAMED'
  | 'METHODOLOGY_UPDATED'
  | 'SOURCE_REPLACEMENT_REQUIRED'
  | 'INCONCLUSIVE';

export interface CalibrationResult {
  resultId: string;
  taskId: string;
  queueItemId: string;
  researchRunId: string;
  outcome: CalibrationResultOutcome;
  findings: string;
  evidenceSnapshotHashBefore: string;
  evidenceSnapshotHashAfter: string;
  reconciledClaimId?: string;
  reconciledEvidenceKey?: string;
  requiredSafeExecutionPlan: boolean;
  completedAt: string;
}

export interface ResearchCalibrationSnapshot {
  snapshotId: string;
  researchRunId: string;
  userId: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  certificationCertificateId: string;
  publicationIntegritySnapshotHash: string;
  performanceSnapshotHash: string;
  candidatesCount: number;
  queueCount: number;
  validatedCount: number;
  snapshotHash: string;
  createdAt: string;
}

export interface ResearchCalibrationAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  calibrationId: string;
  eventType: string;
  beforeState?: string;
  afterState: string;
  relevantHashes: Record<string, string>;
  reason: string;
  timestamp: string;
}
