export type ResearchChangeType = 
  | 'SOURCE_ADDED'
  | 'SOURCE_REMOVED'
  | 'SOURCE_UPDATED'
  | 'SOURCE_AUTHORITY_CHANGED'
  | 'SOURCE_INDEPENDENCE_CHANGED'
  | 'CLAIM_ADDED'
  | 'CLAIM_REMOVED'
  | 'CLAIM_UPDATED'
  | 'CLAIM_STATUS_CHANGED'
  | 'CLAIM_CONFLICT_DETECTED'
  | 'CLAIM_CONFLICT_RESOLVED'
  | 'EVIDENCE_ADDED'
  | 'EVIDENCE_REMOVED'
  | 'EVIDENCE_UPDATED'
  | 'EVIDENCE_VALUE_CHANGED'
  | 'EVIDENCE_METHODOLOGY_CHANGED'
  | 'BENCHMARK_ADDED'
  | 'BENCHMARK_UPDATED'
  | 'BENCHMARK_INVALIDATED'
  | 'BENCHMARK_METHODOLOGY_CHANGED'
  | 'HARDWARE_SPEC_CHANGED'
  | 'REGIONAL_VARIANT_DISCOVERED'
  | 'REVIEWER_FINDING_ADDED'
  | 'REVIEWER_FINDING_UPDATED'
  | 'REVIEWER_DISAGREEMENT_CHANGED'
  | 'PROVENANCE_CHAIN_CHANGED';

export type ChangeSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ChangeConfidence = 'CONFIRMED' | 'PROBABLE' | 'UNVERIFIED';

export type ClaimImpactStatus = 
  | 'UNCHANGED' 
  | 'SUPPORTED' 
  | 'NEEDS_REVIEW' 
  | 'NEEDS_CONTEXT' 
  | 'CONFLICTED' 
  | 'UNBACKED' 
  | 'BLOCKED';

export type AssetImpactStatus = 
  | 'UNAFFECTED' 
  | 'INFORMATIONAL' 
  | 'STALE' 
  | 'REVIEW_REQUIRED' 
  | 'BLOCKED';

export type CreatorAssetType = 
  | 'HOOK'
  | 'TITLE'
  | 'TALKING_POINT'
  | 'SCRIPT'
  | 'FULL_NARRATION'
  | 'B_ROLL'
  | 'BENCHMARK_CARD'
  | 'CHAPTER'
  | 'TELEPROMPTER'
  | 'TIMELINE_MARKER'
  | 'SHORTS_SCRIPT'
  | 'PODCAST_SCRIPT'
  | 'THUMBNAIL_COPY'
  | 'QUALITY_REPORT'
  | 'PUBLISHING_PREFLIGHT'
  | 'DELIVERY_MANIFEST'
  | 'EDITOR_SYNC_PLAN';

export interface ResearchChange {
  id: string;
  changeType: ResearchChangeType;
  entityId: string; // e.g. source id, claim id, benchmark id
  entityName: string;
  previousValue?: string | number | boolean | null;
  currentValue?: string | number | boolean | null;
  severity: ChangeSeverity;
  confidence: ChangeConfidence;
  summary: string;
  detailedReason: string;
  sourcePublisher?: string;
  authorityTier?: string;
  methodologyNotes?: string;
  provenanceRef?: string;
  affectedClaimIds: string[];
  detectedAt: string;
}

export interface ClaimImpact {
  claimId: string;
  claimStatement: string;
  previousStatus: string;
  currentStatus: ClaimImpactStatus;
  severity: ChangeSeverity;
  causingChangeIds: string[];
  reason: string;
  hasAlternateEvidence: boolean;
  alternateEvidenceExcerpt?: string;
  actionRequired: boolean;
}

export interface CreatorAssetImpact {
  assetType: CreatorAssetType;
  assetId: string;
  assetLabel: string;
  status: AssetImpactStatus;
  severity: ChangeSeverity;
  affectedClaimIds: string[];
  causingChangeIds: string[];
  explanation: string;
  regenerationRecommended: boolean;
  safeToAutoUpdate: boolean;
}

export interface ResearchChangeSummary {
  totalChanges: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  affectedClaimsCount: number;
  affectedAssetsCount: number;
  requiresUserReview: boolean;
}

export interface ResearchChangeSet {
  changeSetId: string;
  researchRunId: string;
  previousSnapshotHash: string;
  currentSnapshotHash: string;
  generatedAt: string;
  summary: ResearchChangeSummary;
  changes: ResearchChange[];
  claimImpacts: ClaimImpact[];
  assetImpacts: CreatorAssetImpact[];
}

export interface ChangeReviewDecision {
  decisionId: string;
  changeSetId: string;
  action: 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'REGENERATED' | 'KEPT_CURRENT';
  reviewedBy: string;
  reviewedAt: string;
  note?: string;
  targetAssetIds?: string[];
}

export interface ResearchChangeTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'RESEARCH_INITIAL' | 'CHANGE_DETECTED' | 'IMPACT_EVALUATED' | 'USER_REVIEW' | 'REGENERATION' | 'PRODUCTION_READY';
  severity?: ChangeSeverity;
  versionNumber?: number;
}

export interface CreatorImpactReport {
  reportId: string;
  researchRunId: string;
  changeSet: ResearchChangeSet;
  timelineEvents: ResearchChangeTimelineEvent[];
  monitoringStatus: 'SNAPSHOT_DIFF_VERIFIED' | 'LIVE_MONITORING_UNAVAILABLE';
  generatedAt: string;
}
