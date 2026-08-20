// ============================================================================
// PHASE 87: MULTI-PROJECT COLLECTIVE INTELLIGENCE FEDERATION DATA MODELS
// ============================================================================

import { IntelligenceClassification } from "../intelligence/intelligence.types";

export type FederatedDataClassification =
  | IntelligenceClassification
  | 'FEDERATED_OBSERVATION'
  | 'CROSS_PROJECT_CORRELATION'
  | 'COLLECTIVE_PATTERN'
  | 'COLLECTIVE_CONTRADICTION'
  | 'COLLECTIVE_RESEARCH_SIGNAL';

export type FederationEligibilityState =
  | 'ELIGIBLE'
  | 'ELIGIBLE_WITH_LIMITATIONS'
  | 'NOT_ELIGIBLE'
  | 'BLOCKED'
  | 'STALE'
  | 'INVALIDATED'
  | 'INSUFFICIENT_DATA'
  | 'PRIVACY_RESTRICTED';

export type ProjectPrivacyState =
  | 'PRIVATE'
  | 'FEDERATED'
  | 'DERIVED_COLLECTIVE'
  | 'PUBLIC';

export type SourceIndependenceState =
  | 'INDEPENDENT'
  | 'LIKELY_INDEPENDENT'
  | 'DEPENDENT'
  | 'DUPLICATE'
  | 'UNKNOWN'
  | 'CONFLICTED';

export type MethodologyComparabilityState =
  | 'DIRECTLY_COMPARABLE'
  | 'COMPARABLE_WITH_CAVEATS'
  | 'PARTIALLY_COMPARABLE'
  | 'NOT_COMPARABLE'
  | 'INSUFFICIENT_DATA'
  | 'CONFLICTED';

export type CorrelationState =
  | 'NO_RELATIONSHIP'
  | 'INSUFFICIENT_DATA'
  | 'WEAK_ASSOCIATION'
  | 'POSSIBLE_ASSOCIATION'
  | 'REPEATED_ASSOCIATION'
  | 'STRONG_ASSOCIATION'
  | 'CONFOUNDED'
  | 'CONTRADICTED'
  | 'NOT_COMPARABLE'
  | 'INVALIDATED';

export type CollectiveConfidenceLevel =
  | 'VERY_LOW'
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'VERY_HIGH';

export type CollectiveOpportunityPriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFORMATIONAL';

export interface ProjectFederationRecord {
  federationRecordId: string;
  userId: string;
  researchRunId: string;
  projectTitle: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  benchmarkSnapshotHash: string;
  certificationCertificateId?: string;
  publicationIntegritySnapshotHash?: string;
  methodologyFingerprint: string;
  hardwareFingerprint: string;
  observationSummary: string;
  eligibilityState: FederationEligibilityState;
  privacyState: ProjectPrivacyState;
  sourceIndependenceState: SourceIndependenceState;
  evidenceClassificationSummary: string;
  availableBenchmarkDimensions: string[];
  blockers: string[];
  isStale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NormalizedHardwareSpecification {
  manufacturer: string;
  hardwareFamily: string;
  exactModel: string;
  gpu?: string;
  cpu?: string;
  vramGb?: number;
  ramGb?: number;
  memoryConfig?: string;
  powerLimitWatts?: number;
}

export interface NormalizedSoftwareSpecification {
  driver?: string;
  os?: string;
  appGameVersion?: string;
  benchmarkSuite: string;
  benchmarkVersion?: string;
}

export interface NormalizedTestConfiguration {
  resolution?: string;
  preset?: string;
  renderingApi?: string;
  upscalingTechnology?: string;
  upscalingMode?: string;
  frameGeneration?: boolean;
  rayTracing?: boolean;
  thermalConditionsCelsius?: number;
  powerConditionsWatts?: number;
  methodologyNotes?: string;
}

export interface NormalizedMeasurement {
  metric: string;
  value: number;
  unit: string;
  measurementWindow?: string;
  sourcePublisher: string;
  evidenceSnapshotHash: string;
  classification: FederatedDataClassification;
}

export interface NormalizedObservation {
  observationId: string;
  federationRecordId: string;
  userId: string;
  researchRunId: string;
  hardware: NormalizedHardwareSpecification;
  software: NormalizedSoftwareSpecification;
  testConfig: NormalizedTestConfiguration;
  measurement: NormalizedMeasurement;
  methodologyFingerprint: string;
  hardwareFingerprint: string;
  normalizedAt: string;
}

export interface MethodologyAlignmentReport {
  alignmentState: MethodologyComparabilityState;
  dimensionDifferences: string[];
  warnings: string[];
  explanation: string;
  isDirectlyComparable: boolean;
}

export interface IndependenceDeterminationReport {
  state: SourceIndependenceState;
  duplicateOfRecordId?: string;
  sharedSources: string[];
  reasoning: string;
}

export interface ContradictionRecord {
  contradictionId: string;
  correlationId: string;
  projectAId: string;
  projectBId: string;
  deltaDiffPercentage: number;
  identifiedDimensionDifferences: string[];
  explanation: string;
}

export interface CrossHardwareCorrelationRecord {
  correlationId: string;
  hardwareA: string;
  hardwareB: string;
  benchmarkSuite: string;
  metric: string;
  observedDeltaPercentage: number;
  totalObservationsCount: number;
  comparableObservationsCount: number;
  independentProjectsCount: number;
  independentSourcesCount: number;
  correlationState: CorrelationState;
  confidenceLevel: CollectiveConfidenceLevel;
  methodologyAlignment: MethodologyComparabilityState;
  contradictionCount: number;
  contradictions: ContradictionRecord[];
  confounders: string[];
  contributingProjectIds: string[];
  contributingObservationIds: string[];
  excludedProjectIds: string[];
  excludedObservationIds: string[];
  exclusionReasons: Record<string, string>;
  provenanceChain: string[];
  isStale: boolean;
  computedAt: string;
}

export interface CollectiveResearchOpportunity {
  opportunityId: string;
  title: string;
  description: string;
  triggeringProjectIds: string[];
  triggeringObservationIds: string[];
  correlationState: CorrelationState;
  methodologyState: MethodologyComparabilityState;
  independenceState: SourceIndependenceState;
  confidenceLevel: CollectiveConfidenceLevel;
  hypothesis: string;
  knownConfounders: string[];
  evidenceBoundaryBanner: string;
  requiredValidationType: string;
  priority: CollectiveOpportunityPriority;
  affectedHardware: string[];
  affectedBenchmarks: string[];
  provenance: string[];
  status: 'IDENTIFIED' | 'QUEUED' | 'VALIDATED' | 'BLOCKED' | 'STALE';
  createdAt: string;
}

export interface CollectiveLineageLink {
  stage: string;
  title: string;
  detail: string;
  status: string;
  targetId: string;
}

export interface CollectiveLineageTrace {
  correlationId: string;
  links: CollectiveLineageLink[];
}

export interface CollectiveIntelligenceSnapshot {
  snapshotId: string;
  snapshotHash: string;
  userId: string;
  researchRunId: string;
  federatedProjectsCount: number;
  eligibleProjectsCount: number;
  normalizedObservationsCount: number;
  activeCorrelationsCount: number;
  contradictionsCount: number;
  opportunitiesCount: number;
  projectFingerprintsHash: string;
  observationFingerprintsHash: string;
  isStale: boolean;
  generatedAt: string;
}

export interface CollectiveIntelligenceAuditEvent {
  auditId: string;
  timestamp: string;
  userId: string;
  researchRunId: string;
  eventType:
    | 'FEDERATION_ELIGIBILITY_EVALUATED'
    | 'PROJECT_FEDERATED'
    | 'PROJECT_EXCLUDED'
    | 'OBSERVATION_NORMALIZED'
    | 'INDEPENDENCE_DETERMINED'
    | 'METHODOLOGY_ALIGNED'
    | 'CORRELATION_COMPUTED'
    | 'CONTRADICTION_DETECTED'
    | 'COLLECTIVE_OPPORTUNITY_GENERATED'
    | 'RESEARCH_VALIDATION_BRIDGED'
    | 'SNAPSHOT_GENERATED'
    | 'STALE_STATE_DETECTED'
    | 'PRIVACY_RESTRICTION_ENFORCED'
    | 'HARD_BLOCKER_PROPAGATED';
  targetId: string;
  beforeState?: string;
  afterState?: string;
  reason: string;
  metadata?: Record<string, any>;
}
