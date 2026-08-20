export type ResearchHealthDecisionType =
  | 'NO_ACTION_REQUIRED'
  | 'MONITOR'
  | 'REVALIDATE_SOURCE'
  | 'REVALIDATE_CLAIM'
  | 'REVALIDATE_BENCHMARK'
  | 'REVALIDATE_METHODOLOGY'
  | 'REVALIDATE_HARDWARE'
  | 'REVALIDATE_YOUTUBE'
  | 'REVALIDATE_PROVENANCE'
  | 'INVESTIGATE_CONFLICT'
  | 'REVIEW_AFFECTED_ASSET'
  | 'REGENERATE_AFFECTED_ASSET'
  | 'BLOCK_CREATOR_CONTENT'
  | 'FULL_RESEARCH_RERUN';

export type ResearchHealthDecisionSeverity =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFO';

export type ResearchHealthDecisionConfidence =
  | 'CONFIRMED'
  | 'PROBABLE'
  | 'UNVERIFIED'
  | 'UNKNOWN';

export type ResearchHealthDecisionStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'KEPT_CURRENT'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED';

export interface ResearchHealthAction {
  actionId: string;
  decisionId: string;
  actionType:
    | 'REVALIDATE'
    | 'INVESTIGATE'
    | 'REVIEW_ASSET'
    | 'REGENERATE_AFFECTED'
    | 'KEEP_CURRENT'
    | 'BLOCK_CONTENT';
  targetClaimIds?: string[];
  targetEvidenceIds?: string[];
  targetAssetIds?: string[];
  revalidationMode?: string;
  label: string;
  confirmationPrompt: string;
  consequenceSummary: string;
  isDestructive?: boolean;
}

export interface ResearchHealthActionResult {
  actionId: string;
  decisionId: string;
  success: boolean;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'UNAVAILABLE';
  summaryMessage: string;
  previousEvidenceHash: string;
  newEvidenceHash: string;
  claimsRecovered: string[];
  claimsStillUnhealthy: string[];
  conflictsResolved: string[];
  assetsRequiringRegeneration: string[];
  scriptVersionCreated?: number;
  qualityScoreBefore?: number;
  qualityScoreAfter?: number;
  readinessBefore?: boolean;
  readinessAfter?: boolean;
  executedAt: string;
}

export interface ClaimDecisionContext {
  claimId: string;
  claimText: string;
  claimHealthStatus: string;
  freshnessStatus: string;
  validityStatus: string;
  authorityStatus: string;
  independenceStatus: string;
  methodologyStatus: string;
  reason: string;
  upstreamEvidenceExcerpts: string[];
}

export interface AssetDecisionContext {
  assetType:
    | 'TALKING_POINT'
    | 'SCRIPT_SECTION'
    | 'BENCHMARK_CARD'
    | 'TELEPROMPTER'
    | 'TIMELINE_MARKER'
    | 'PUBLISHING_PREFLIGHT';
  assetId: string;
  assetLabel: string;
  impactStatus: 'HEALTHY' | 'REVIEW_REQUIRED' | 'STALE' | 'BLOCKED' | 'SUPERSEDED' | 'UNAFFECTED';
  explanation: string;
  regenerationRecommended: boolean;
}

export interface DecisionConsequenceExplanation {
  headline: string;
  whatHappened: string;
  whyDoesItMatter: string;
  whichClaimAffected: string;
  whichEvidenceCausedIt: string;
  whichCreatorAssetsAffected: string[];
  publishingConsequence: string;
  recommendedAction: string;
  whatWillHappenIfApproved: string;
}

export interface ResearchHealthDecision {
  id: string;
  decisionType: ResearchHealthDecisionType;
  severity: ResearchHealthDecisionSeverity;
  confidence: ResearchHealthDecisionConfidence;
  status: ResearchHealthDecisionStatus;
  title: string;
  summary: string;
  explanation: DecisionConsequenceExplanation;
  claimContext?: ClaimDecisionContext;
  affectedAssets: AssetDecisionContext[];
  availableActions: ResearchHealthAction[];
  recommendedActionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorDecisionRecord {
  decisionRecordId: string;
  userId: string;
  researchRunId: string;
  decisionId: string;
  decisionType: ResearchHealthDecisionType;
  severity: ResearchHealthDecisionSeverity;
  action: 'ACCEPTED' | 'REJECTED' | 'KEPT_CURRENT' | 'REVALIDATE' | 'INVESTIGATE' | 'REGENERATE_AFFECTED' | 'BLOCK_CONTENT';
  actionResult: string;
  previousState: string;
  newState: string;
  reason: string;
  claimIds: string[];
  assetIds: string[];
  evidenceSnapshotHash: string;
  scriptVersion?: number;
  timestamp: string;
}

export type DecisionAuditEvent = CreatorDecisionRecord;

export interface RevalidationQueueItem {
  queueId: string;
  priority: ResearchHealthDecisionSeverity;
  claimId: string;
  claimText: string;
  evidenceType: string;
  reason: string;
  actionType: string;
  status: string;
}

export interface ResearchHealthDecisionReport {
  reportId: string;
  researchRunId: string;
  userId: string;
  topic: string;
  overallHealthScore: number;
  overallHealthGrade: string;
  monitoringMode: string;
  readyToRecord: boolean;
  actionRequired: boolean;
  actionRequiredBanner: {
    headline: string;
    subtext: string;
    severity: ResearchHealthDecisionSeverity;
    totalCriticalIssues: number;
    totalActionsPending: number;
  };
  criticalIssues: ResearchHealthDecision[];
  decisionsQueue: ResearchHealthDecision[];
  revalidationQueue: RevalidationQueueItem[];
  affectedAssetsSummary: {
    totalAssets: number;
    healthyCount: number;
    reviewRequiredCount: number;
    staleCount: number;
    blockedCount: number;
  };
  affectedAssets: AssetDecisionContext[];
  evidenceSnapshotHash: string;
  lastEvaluatedAt: string;
}
