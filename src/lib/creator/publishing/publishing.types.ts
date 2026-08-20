import { ScriptOutputMode, TargetVideoDuration } from "../creator-studio.types";

// ============================================================================
// PHASE 71 PUBLISHING PREFLIGHT & DELIVERY TYPES (PRESERVED FOR COMPATIBILITY)
// ============================================================================

export type PublishingPlatform = 
  | 'YOUTUBE_LONG_FORM' 
  | 'YOUTUBE_SHORTS' 
  | 'PODCAST';

export type PreflightStatus = 
  | 'READY' 
  | 'READY_WITH_WARNINGS' 
  | 'BLOCKED' 
  | 'NOT_CONFIGURED' 
  | 'STALE' 
  | 'UNAVAILABLE';

export type IssueSeverity = 
  | 'BLOCKER' 
  | 'WARNING' 
  | 'INFO';

export interface PreflightIssue {
  id: string;
  severity: IssueSeverity;
  platform?: PublishingPlatform;
  code: string;
  message: string;
  remediation?: string;
}

export interface ThumbnailCopyCandidate {
  id: string;
  phrase: string;
  style: 'BENCHMARK_PROMISE' | 'DIRECT_QUESTION' | 'BOLD_FINDING' | 'SPEC_CLASH';
  verificationStatus: 'SUPPORTED' | 'NEEDS_CONTEXT' | 'DO_NOT_USE';
  verifiedEvidenceExcerpt?: string;
  characterCount: number;
  wordCount: number;
  safeZoneWarning?: string;
}

export interface ShortsScriptAdaptation {
  id: string;
  targetDurationSeconds: number; // e.g. 45-60s
  hookText: string;
  coreClaimStatement: string;
  benchmarkHighlight?: string;
  caveatStatement?: string;
  closingCallout: string;
  fullSpokenText: string;
  estimatedWordCount: number;
  verticalBRollSuggestions: string[];
  verificationStatus: 'SUPPORTED' | 'NEEDS_CONTEXT' | 'BLOCKED';
}

export interface PodcastScriptAdaptation {
  id: string;
  targetDurationMinutes: number;
  spokenIntro: string;
  narrativeSegments: Array<{
    title: string;
    spokenBody: string;
    timestamp: string;
    evidenceRef?: string;
  }>;
  closingTakeaway: string;
  fullSpokenText: string;
  verificationStatus: 'SUPPORTED' | 'NEEDS_CONTEXT' | 'BLOCKED';
}

export interface PlatformPreflightReport {
  platform: PublishingPlatform;
  enabled: boolean;
  status: PreflightStatus;
  score: number; // 0.0 to 100.0
  blockers: PreflightIssue[];
  warnings: PreflightIssue[];
  info: PreflightIssue[];
  validatedAssets: string[];
  missingAssets: string[];
  staleAssets: string[];
  metadataTitle?: string;
  metadataDescription?: string;
}

export interface PublishingPreflightReport {
  researchRunId: string;
  overallPublishingScore: number; // 0.0 to 100.0
  contentQualityScore: number; // from Phase 69
  productionReadinessScore: number; // from Phase 70
  readinessStatus: PreflightStatus;
  readyToPublish: boolean;
  selectedPlatforms: PublishingPlatform[];
  platformReports: PlatformPreflightReport[];
  allIssues: PreflightIssue[];
  thumbnailCopyCandidates: ThumbnailCopyCandidate[];
  shortsAdaptation?: ShortsScriptAdaptation;
  podcastAdaptation?: PodcastScriptAdaptation;
  generatedAt: string;
  evidenceSnapshotHash: string;
}

export interface DeliveryManifestAsset {
  assetId: string;
  assetType: string;
  platform: PublishingPlatform | 'ALL';
  fileName: string;
  status: 'CURRENT' | 'STALE' | 'MISSING';
  required: boolean;
  enabled: boolean;
  validationStatus: 'VALID' | 'WARNING' | 'BLOCKED';
}

export interface CreatorDeliveryManifest {
  manifestId: string;
  researchRunId: string;
  topic: string;
  version: number;
  generatedAt: string;
  overallStatus: PreflightStatus;
  readyToPublish: boolean;
  publishingScore: number;
  assets: DeliveryManifestAsset[];
}

// ============================================================================
// PHASE 84 MULTI-CHANNEL PUBLISHING ORCHESTRATOR & DISTRIBUTION RECEIPT TYPES
// ============================================================================

export type PublishingTargetPlatform = 
  | 'YOUTUBE_LONG_FORM' 
  | 'YOUTUBE_SHORTS' 
  | 'PODCAST';

export type PublishingMode = 
  | 'MANUAL_PUBLISH' 
  | 'SCHEDULED_PUBLISH' 
  | 'STAGING_ONLY';

export type PublishingConnectionState = 
  | 'AVAILABLE' 
  | 'STAGING_ONLY' 
  | 'NOT_CONFIGURED' 
  | 'UNAVAILABLE' 
  | 'ERROR' 
  | 'EXPIRED' 
  | 'INVALID';

export type PublishingTargetStatus = 
  | 'DRAFT' 
  | 'PREFLIGHT_PENDING' 
  | 'PREFLIGHT_PASSED' 
  | 'PREFLIGHT_BLOCKED' 
  | 'APPROVED' 
  | 'STAGED' 
  | 'PUBLISHING' 
  | 'PUBLISHED' 
  | 'STAGING_ONLY' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'STALE';

export type PreflightCheckStatus = 
  | 'PASS' 
  | 'PASS_WITH_WARNINGS' 
  | 'BLOCKED' 
  | 'STALE' 
  | 'INVALID' 
  | 'NOT_CONFIGURED';

export type PreflightCheckCategory = 
  | 'PROJECT_INTEGRITY' 
  | 'CERTIFICATION' 
  | 'RELEASE_LOCK' 
  | 'EXPORT_PACKAGE' 
  | 'ASSETS' 
  | 'SAFETY' 
  | 'PLATFORM_COMPATIBILITY' 
  | 'SCHEDULING';

export interface PreflightCheckItem {
  checkId: string;
  category: PreflightCheckCategory;
  name: string;
  status: PreflightCheckStatus;
  reason: string;
  upstreamDependency: string;
  originalCause: string;
  affectedAsset?: string;
  affectedPlatform: PublishingTargetPlatform;
  requiredAction: string;
  isBlocking: boolean;
}

export interface PreflightResult {
  preflightId: string;
  targetId: string;
  status: PreflightCheckStatus;
  score?: number; // Surface score only when mathematically justified
  checks: PreflightCheckItem[];
  blockers: string[];
  warnings: string[];
  requiredActions: string[];
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  packageSnapshotHash: string;
  certificationCertificateId?: string;
  releaseLockId?: string;
  generatedAt: string;
}

export interface PublishingTargetMetadata {
  title: string;
  description: string;
  chapters?: string[];
  tags: string[];
  hashtags: string[];
  thumbnailRef?: string;
  mediaAssetRef?: string;
  showNotes?: string;
  // Phase 84 Requirement 24: Uncompressed archival audio (WAV) is distinct from compressed bitrate
  audioCodec?: 'WAV_PCM' | 'MP3' | 'AAC';
  audioBitrateKbps?: number;
  isUncompressedMaster: boolean;
}

export interface SchedulingConfig {
  scheduledTimestamp: string; // ISO-8601 future timestamp
  timezoneIana: string;       // e.g. "America/New_York", "UTC"
  isScheduled: boolean;
}

export interface CreatorApprovalState {
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  boundPlanSnapshotHash?: string;
  boundProjectSnapshotHash?: string;
  boundEvidenceSnapshotHash?: string;
  boundScriptVersion?: number;
  boundPackageSnapshotHash?: string;
  boundCertificationId?: string;
  boundReleaseLockId?: string;
  isStale: boolean;
}

export interface PublishingTargetPlan {
  targetId: string;
  platform: PublishingTargetPlatform;
  mode: PublishingMode;
  status: PublishingTargetStatus;
  selectedAssetIds: string[];
  metadata: PublishingTargetMetadata;
  schedulingConfig?: SchedulingConfig;
  preflightResult?: PreflightResult;
  connectionState: PublishingConnectionState;
  approvalState: CreatorApprovalState;
  attemptCount: number;
  lastAttemptAt?: string;
  publishedAt?: string;
  receiptId?: string;
  blockerDetails?: string[];
}

export interface PublishingPlan {
  planId: string;
  userId: string;
  researchRunId: string;
  exportPackageId: string;
  exportPackageSnapshotHash: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  timelineFingerprint: string;
  certificationCertificateId?: string;
  releaseLockId?: string;
  targets: PublishingTargetPlan[];
  planSnapshotHash: string;
  status: PublishingTargetStatus;
  isStale: boolean;
  staleReasons: string[];
  createdAt: string;
  updatedAt: string;
}

export type PublishingReceiptEventType =
  | 'PUBLISHING_PLAN_CREATED'
  | 'PREFLIGHT_COMPLETED'
  | 'PREFLIGHT_BLOCKED'
  | 'CREATOR_APPROVAL_GRANTED'
  | 'CREATOR_APPROVAL_INVALIDATED'
  | 'PUBLISHING_STAGED'
  | 'PUBLISH_ATTEMPTED'
  | 'PUBLISHING_CONFIRMED'
  | 'PUBLISHING_FAILED'
  | 'PUBLISHING_CANCELLED'
  | 'PUBLISHING_MARKED_STALE'
  | 'POST_PUBLISH_VERIFICATION_COMPLETED';

export interface DistributionReceipt {
  receiptId: string;
  userId: string;
  researchRunId: string;
  planId: string;
  targetId: string;
  platform: PublishingTargetPlatform;
  eventType: PublishingReceiptEventType;
  status: 'SUCCESS' | 'STAGING_ONLY' | 'FAILED' | 'BLOCKED' | 'CANCELLED';
  details: string;
  externalPublicationId?: string;
  publicationUrl?: string;
  platformResponseRef?: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  packageSnapshotHash: string;
  scriptVersion: number;
  timestamp: string;
}

export interface PostPublishVerificationReport {
  verificationId: string;
  receiptId: string;
  targetId: string;
  platform: PublishingTargetPlatform;
  status: 'VERIFIED' | 'FAILED' | 'VERIFICATION_UNAVAILABLE';
  externalIdConfirmed: boolean;
  assetMatchConfirmed: boolean;
  metadataMatchConfirmed: boolean;
  publicationUrl?: string;
  checkedAt: string;
  notes: string;
}

export interface PublishingAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  planId: string;
  targetId?: string;
  action: PublishingReceiptEventType;
  planHash: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  details: string;
  timestamp: string;
}
