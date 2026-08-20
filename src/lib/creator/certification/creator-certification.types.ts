import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ProjectSubsystem, CreatorProjectSnapshot } from "../project/creator-project.types";

export type CertificationStatus =
  | 'NOT_EVALUATED'
  | 'EVALUATING'
  | 'CERTIFIED'
  | 'CERTIFIED_WITH_WARNINGS'
  | 'REVIEW_REQUIRED'
  | 'BLOCKED'
  | 'STALE'
  | 'INVALIDATED';

export type IntegrityDimensionStatus =
  | 'PASS'
  | 'WARNING'
  | 'BLOCKED'
  | 'NOT_CONFIGURED'
  | 'UNAVAILABLE';

export type ReleaseLockStatus =
  | 'UNLOCKED'
  | 'LOCKED'
  | 'STALE_LOCK'
  | 'INVALIDATED_LOCK';

export type ChangeImpactLevel =
  | 'NO_CHANGE'
  | 'LOW_IMPACT'
  | 'MEDIUM_IMPACT'
  | 'HIGH_IMPACT'
  | 'CRITICAL';

export interface CertificationBlocker {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  subsystem: ProjectSubsystem;
  affectedNode: string;
  reason: string;
  upstreamCause: string;
  evidenceReference: string;
  affectedDownstreamAssets: string[];
  requiredAction: string;
}

export interface ReleaseLockRecord {
  lockId: string;
  userId: string;
  researchRunId: string;
  certificateId: string;
  lockedProjectSnapshotHash: string;
  lockedEvidenceSnapshotHash: string;
  lockedScriptVersion: number;
  lockedTimelineFingerprint: string;
  lockedAt: string;
  lockedBy: string;
  lockStatus: ReleaseLockStatus;
  notes?: string;
}

export interface ProjectIntegrityCertificate {
  certificateId: string;
  userId: string;
  researchRunId: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  timelineFingerprint: string;
  distributionPackageId?: string;
  activePublishingTargets: string[];
  activeDistributionTargets: string[];
  status: CertificationStatus;
  overallIntegrityScore: number; // 0 to 100% composite
  readyForHandoff: boolean;
  dimensions: {
    researchIntegrity: {
      status: IntegrityDimensionStatus;
      score: number;
      primaryEvidenceCount: number;
      completedAt: string;
    };
    evidenceIntegrity: {
      status: IntegrityDimensionStatus;
      freshnessScore: number;
      agingCount: number;
      staleCount: number;
    };
    claimSafety: {
      status: IntegrityDimensionStatus;
      verifiedCount: number;
      unbackedCount: number;
      conflictedCount: number;
      doNotSayCount: number;
    };
    scriptIntegrity: {
      status: IntegrityDimensionStatus;
      qualityScore: number;
      qualityGrade: string;
      outputMode: string;
      targetDuration: number;
    };
    productionIntegrity: {
      status: IntegrityDimensionStatus;
      readinessScore: number;
      enabledAssetCount: number;
      missingAssetCount: number;
    };
    publishingIntegrity: {
      status: IntegrityDimensionStatus;
      preflightStatus: string;
      score: number;
      platformCount: number;
    };
    distributionIntegrity: {
      status: IntegrityDimensionStatus;
      readinessScore: number;
      targetCount: number;
      readyCount: number;
    };
    executionIntegrity: {
      status: IntegrityDimensionStatus;
      latestPlanStatus: string;
      validationStatus: string;
      concurrencySafe: boolean;
    };
  };
  blockers: CertificationBlocker[];
  warnings: string[];
  certifiedAt: string;
  certificationVersion: number;
  isReleaseLocked: boolean;
  releaseLockMetadata?: ReleaseLockRecord;
}

export interface HandoffAssetItem {
  name: string;
  type: string;
  subsystem: ProjectSubsystem;
  available: boolean;
  uri?: string;
  sizeBytes?: number;
}

export interface HandoffManifest {
  manifestId: string;
  userId: string;
  researchRunId: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  timelineFingerprint: string;
  certificateId: string;
  certificationStatus: CertificationStatus;
  readyForHandoff: boolean;
  includedAssets: HandoffAssetItem[];
  provenanceSummary: string;
  generatedAt: string;
}

export interface CertificationChangeReport {
  hasChanges: boolean;
  impactLevel: ChangeImpactLevel;
  currentProjectSnapshotHash: string;
  certifiedProjectSnapshotHash: string;
  currentScriptVersion: number;
  certifiedScriptVersion: number;
  changedDimensions: string[];
  details: string[];
  isCertificateInvalidated: boolean;
  checkedAt: string;
}

export interface CertificationAuditEvent {
  auditId: string;
  certificateId: string;
  userId: string;
  researchRunId: string;
  action:
    | 'CERTIFIED'
    | 'CERTIFIED_WITH_WARNINGS'
    | 'CERTIFICATION_BLOCKED'
    | 'RELEASE_LOCKED'
    | 'RELEASE_UNLOCKED'
    | 'CERTIFICATION_INVALIDATED'
    | 'HANDOFF_GENERATED';
  projectSnapshotHash: string;
  scriptVersion: number;
  details: string;
  timestamp: string;
}
