import { PublishingTargetPlatform } from "../publishing/publishing.types";

// ============================================================================
// PHASE 85: POST-PUBLICATION INTEGRITY & RECONCILIATION DATA MODELS
// ============================================================================

export type EvidenceClassification =
  | 'VERIFIED_RESEARCH_EVIDENCE'
  | 'PUBLICATION_OBSERVATION'
  | 'DISTRIBUTION_RECEIPT'
  | 'PLATFORM_STATE'
  | 'PERFORMANCE_METRIC'
  | 'AUDIENCE_SIGNAL'
  | 'DERIVED_INTEGRITY_FINDING'
  | 'CREATOR_PREFERENCE'
  | 'ESTIMATED_VALUE'
  | 'UNAVAILABLE'
  | 'UNVERIFIABLE';

export type ReconciliationStatus =
  | 'MATCHED'
  | 'CHANGED'
  | 'MISSING'
  | 'STALE'
  | 'UNAVAILABLE'
  | 'UNVERIFIABLE'
  | 'CONFLICTED'
  | 'BLOCKED';

export type ReceiptReconciliationState =
  | 'RECEIPT_CONFIRMED'
  | 'RECEIPT_RECONCILED'
  | 'RECEIPT_PENDING_VERIFICATION'
  | 'RECEIPT_CONFLICTED'
  | 'RECEIPT_STALE'
  | 'RECEIPT_UNVERIFIABLE';

export type PublicationChangeCategory =
  | 'NO_CHANGE'
  | 'METADATA_CHANGE'
  | 'CONTENT_CHANGE'
  | 'VISIBILITY_CHANGE'
  | 'IDENTITY_CHANGE'
  | 'CERTIFICATION_BINDING_CHANGE'
  | 'EVIDENCE_BINDING_CHANGE'
  | 'PACKAGE_CHANGE'
  | 'MULTIPLE_CHANGES'
  | 'INSUFFICIENT_DATA'
  | 'CONFLICTED';

export type DimensionHealthStatus =
  | 'PASS'
  | 'WARNING'
  | 'BLOCKED'
  | 'STALE'
  | 'UNAVAILABLE'
  | 'UNVERIFIABLE'
  | 'NOT_CONFIGURED';

export interface ExpectedPublicationState {
  publicationTarget: string;
  platform: PublishingTargetPlatform;
  publicationIdentifier?: string;
  expectedTitle: string;
  expectedDescription: string;
  expectedChapters?: string[];
  expectedTags?: string[];
  expectedAssetHash: string;
  expectedScriptVersion: number;
  expectedTimelineFingerprint: string;
  expectedCertificationId: string;
  expectedReleaseLockId: string;
  expectedEvidenceSnapshotHash: string;
  expectedProjectSnapshotHash: string;
  expectedPackageSnapshotHash: string;
  expectedVisibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'SCHEDULED';
  expectedScheduledTime?: string;
}

export interface ObservedPublicationState {
  observationId: string;
  platform: PublishingTargetPlatform;
  publicationIdentifier?: string;
  observedUrl?: string;
  observedTitle?: string;
  observedDescription?: string;
  observedChapters?: string[];
  observedTags?: string[];
  observedVisibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'SCHEDULED' | 'UNKNOWN';
  observedScheduledTime?: string;
  observedAssetFingerprint?: string;
  observedMetadataFingerprint?: string;
  observedAt: string;
  isAvailable: boolean;
  isVerifiable: boolean;
  unavailabilityReason?: string;
}

export interface PublicationChangeRecord {
  changeId: string;
  fieldName: string;
  category: PublicationChangeCategory;
  expectedValue: any;
  observedValue: any;
  observationSource: string;
  detectedAt: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  affectedSubsystem: string;
  recommendedAction: string;
}

export interface CertificationDriftRecord {
  driftId: string;
  originalCertificationId: string;
  currentObservedState: string;
  changedFields: string[];
  affectedAssets: string[];
  affectedClaims: string[];
  affectedEvidenceBindings: string[];
  severity: 'WARNING' | 'CRITICAL';
  requiredAction: string;
}

export interface PublicationIntegrityBlocker {
  blockerId: string;
  severity: 'CRITICAL' | 'HIGH';
  subsystem: string;
  affectedPublicationId: string;
  affectedAssetId?: string;
  reason: string;
  upstreamCause: string;
  evidence: string;
  requiredAction: string;
}

export type LineageStageType =
  | 'RESEARCH_RUN'
  | 'EVIDENCE_SNAPSHOT'
  | 'CLAIM'
  | 'SCRIPT_VERSION'
  | 'CERTIFICATION'
  | 'RELEASE_LOCK'
  | 'EXPORT_PACKAGE'
  | 'PUBLISHING_PLAN'
  | 'DISTRIBUTION_RECEIPT'
  | 'PUBLICATION'
  | 'OBSERVED_PLATFORM_STATE'
  | 'INTEGRITY_RESULT';

export interface PublicationLineageLink {
  stage: LineageStageType;
  identifier: string;
  status: 'VALID' | 'DRIFTED' | 'STALE' | 'UNVERIFIABLE' | 'UNAVAILABLE';
  summary: string;
  upstreamId?: string;
}

export interface PublicationLineageTrace {
  publicationId: string;
  platform: PublishingTargetPlatform;
  isLineageAvailable: boolean;
  links: PublicationLineageLink[];
  unavailabilityReason?: string;
}

export interface PublicationIntegritySnapshot {
  snapshotId: string;
  researchRunId: string;
  userId: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  certificationCertificateId: string;
  releaseLockId: string;
  exportPackageId: string;
  distributionReceiptId: string;
  platform: PublishingTargetPlatform;
  publicationTarget: string;
  publicationIdentifier?: string;
  observedState: ObservedPublicationState;
  observedMetadata: Record<string, any>;
  assetFingerprint: string;
  metadataFingerprint: string;
  reconciliationStatus: ReconciliationStatus;
  snapshotHash: string;
  createdAt: string;
}

export interface PublicationReconciliationRecord {
  publicationId: string;
  platform: PublishingTargetPlatform;
  targetId: string;
  planId: string;
  receiptId?: string;
  reconciliationStatus: ReconciliationStatus;
  receiptState: ReceiptReconciliationState;
  expectedState: ExpectedPublicationState;
  observedState: ObservedPublicationState;
  changes: PublicationChangeRecord[];
  certificationDrift?: CertificationDriftRecord;
  blockers: PublicationIntegrityBlocker[];
  lineage: PublicationLineageTrace;
  isUnverifiable: boolean;
  unverifiableReasons: string[];
  lastReconciledAt: string;
}

export interface DimensionHealthItem {
  dimensionKey: string;
  dimensionName: string;
  status: DimensionHealthStatus;
  details: string;
  upstreamDependency: string;
}

export interface ContinuousReleaseHealthReport {
  reportId: string;
  researchRunId: string;
  overallStatus: DimensionHealthStatus;
  dimensions: {
    certificationIntegrity: DimensionHealthItem;
    releaseLockIntegrity: DimensionHealthItem;
    exportPackageIntegrity: DimensionHealthItem;
    distributionReceiptIntegrity: DimensionHealthItem;
    publicationStateIntegrity: DimensionHealthItem;
    metadataIntegrity: DimensionHealthItem;
    assetIntegrity: DimensionHealthItem;
    evidenceBindingIntegrity: DimensionHealthItem;
    platformObservability: DimensionHealthItem;
    reconciliationIntegrity: DimensionHealthItem;
  };
  activeBlockersCount: number;
  unverifiableCount: number;
  staleCount: number;
  reconciledCount: number;
  totalPublicationsCount: number;
  generatedAt: string;
}

export interface PublicationAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  publicationId: string;
  eventType: string;
  beforeState?: string;
  afterState: string;
  relevantHashes: Record<string, string>;
  reason: string;
  timestamp: string;
}
