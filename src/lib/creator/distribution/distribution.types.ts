import { ThumbnailCopyCandidate, ShortsScriptAdaptation, PodcastScriptAdaptation } from "../publishing/publishing.types";

export type DistributionPlatform =
  | 'YOUTUBE_LONG_FORM'
  | 'YOUTUBE_SHORTS'
  | 'PODCAST';

export type DistributionTargetStatus =
  | 'DRAFT'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'RELEASED'
  | 'FAILED'
  | 'CANCELLED'
  | 'BLOCKED';

export type DistributionReleaseMode =
  | 'MANUAL_RELEASE'
  | 'SCHEDULED_RELEASE'
  | 'STAGED_ONLY';

export type DistributionConnectionState =
  | 'AVAILABLE'
  | 'STAGING_ONLY'
  | 'NOT_CONFIGURED'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface ReleasePlan {
  target: DistributionPlatform;
  releaseMode: DistributionReleaseMode;
  scheduledAt?: string; // ISO UTC
  localScheduledAt?: string;
  timezone?: string; // IANA timezone e.g. "America/New_York"
  approvalRequired: boolean;
  status: DistributionTargetStatus;
  note?: string;
}

export interface ReleaseConflict {
  conflictType:
    | 'DUPLICATE_SCHEDULE'
    | 'STALE_PACKAGE'
    | 'EVIDENCE_HASH_MISMATCH'
    | 'SCRIPT_VERSION_MISMATCH'
    | 'MISSING_APPROVAL'
    | 'BLOCKED_SAFETY';
  message: string;
  remediation: string;
}

export interface YouTubeLongFormStagingData {
  platform: 'YOUTUBE_LONG_FORM';
  approvedTitle: string;
  titleCandidates: string[];
  description: string;
  chapters: Array<{ timestamp: string; title: string }>;
  tags: string[];
  thumbnailCopyCandidates: ThumbnailCopyCandidate[];
  timelineReference: string;
  provenanceReference: string;
  qualityReportSummary: string;
  publishingPreflightStatus: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
}

export interface YouTubeShortsStagingData {
  platform: 'YOUTUBE_SHORTS';
  approvedTitle: string;
  hookText: string;
  fullSpokenText: string;
  description: string;
  verticalProductionReference: string;
  targetDurationSeconds: number;
  evidenceReference: string;
  safetyStatus: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
}

export interface PodcastStagingData {
  platform: 'PODCAST';
  episodeTitle: string;
  podcastNarration: string;
  showNotes: string;
  chapters: Array<{ timestamp: string; title: string }>;
  audioPreflightResult: string;
  provenanceReference: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
}

export interface PlatformStagingPackage {
  platform: DistributionPlatform;
  status: DistributionTargetStatus;
  connectionState: DistributionConnectionState;
  connectionMessage: string;
  stagingData: YouTubeLongFormStagingData | YouTubeShortsStagingData | PodcastStagingData;
  releasePlan: ReleasePlan;
  readinessScore: number;
  isBlocked: boolean;
  blockingReasons: string[];
}

export type DistributionReadinessDimension =
  | 'RESEARCH_HEALTH'
  | 'SCRIPT_STATE'
  | 'PRODUCTION_STATE'
  | 'PUBLISHING_STATE'
  | 'DISTRIBUTION_STATE';

export interface DistributionReadinessItem {
  dimension: DistributionReadinessDimension;
  label: string;
  status: 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED' | 'STALE' | 'NOT_CONFIGURED';
  score: number; // 0.0 to 100.0
  reasons: string[];
}

export interface DistributionBlockerExplanation {
  blocker: string;
  affectedAsset: string;
  affectedClaim: string;
  evidenceState: string;
  provenanceChain: string;
  scriptVersion: number;
  evidenceSnapshot: string;
  publishingState: string;
  requiredAction: string;
}

export interface DistributionReadinessReport {
  distributionReadinessScore: number; // 0.0 to 100.0
  contentQualityScore: number;
  productionReadinessScore: number;
  publishingReadinessScore: number;
  readyForApproval: boolean;
  readyForRelease: boolean;
  overallStatus: 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED' | 'STAGING_ONLY';
  summaryMessage: string;
  dimensions: DistributionReadinessItem[];
  blockingReasons: string[];
  blockerExplanations: DistributionBlockerExplanation[];
  checkedAt: string;
}

export interface CreatorDistributionPackage {
  packageId: string;
  distributionPackageVersion: number;
  parentPackageVersion?: number;
  researchRunId: string;
  userId: string;
  topic: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
  productionPackageVersion: number;
  publishingPreflightVersion: number;
  contentQualityScore: number;
  productionReadinessScore: number;
  publishingReadinessScore: number;
  distributionReadinessScore: number;
  targets: PlatformStagingPackage[];
  readinessReport: DistributionReadinessReport;
  approvalState: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
  approvalNotes?: string;
  createdAt: string;
  updatedAt: string;
  status: DistributionTargetStatus;
}

export interface DistributionAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  distributionPackageId: string;
  target?: DistributionPlatform | 'ALL';
  action:
    | 'PACKAGE_CREATED'
    | 'PACKAGE_UPDATED'
    | 'TARGET_ENABLED'
    | 'TARGET_DISABLED'
    | 'PREFLIGHT_STARTED'
    | 'PREFLIGHT_COMPLETED'
    | 'APPROVAL_GRANTED'
    | 'APPROVAL_REJECTED'
    | 'RELEASE_SCHEDULED'
    | 'RELEASE_CANCELLED'
    | 'RELEASE_BLOCKED'
    | 'RELEASE_CONFIRMED'
    | 'RELEASE_FAILED';
  previousState: string;
  newState: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
  result: string;
  reason: string;
  timestamp: string;
}
