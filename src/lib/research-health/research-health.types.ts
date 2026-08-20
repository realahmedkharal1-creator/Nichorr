export type EvidenceFreshnessStatus =
  | 'FRESH'
  | 'AGING'
  | 'STALE'
  | 'EXPIRED'
  | 'UNKNOWN'
  | 'UNAVAILABLE';

export type EvidenceValidityStatus =
  | 'VALID'
  | 'REVALIDATION_REQUIRED'
  | 'CONFLICTED'
  | 'UNVERIFIED'
  | 'UNAVAILABLE';

export type ClaimHealthStatus =
  | 'HEALTHY'
  | 'AGING'
  | 'NEEDS_REVALIDATION'
  | 'CONFLICTED'
  | 'UNBACKED'
  | 'BLOCKED'
  | 'UNKNOWN';

export type RevalidationStatus =
  | 'NOT_REQUIRED'
  | 'READY'
  | 'RUNNING'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'FAILED'
  | 'UNAVAILABLE';

export type FreshnessConfidence =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'UNKNOWN';

export type HealthMonitoringMode =
  | 'LIVE_MONITORING_VERIFIED'
  | 'SNAPSHOT_REVALIDATION'
  | 'LAST_VERIFIED'
  | 'REVALIDATION_REQUIRED'
  | 'REVALIDATION_UNAVAILABLE'
  | 'UNKNOWN';

export type RevalidationActionType =
  | 'RECHECK_PRIMARY_SOURCE'
  | 'RECHECK_LAB_RESULT'
  | 'RECHECK_BENCHMARK_METHODOLOGY'
  | 'RECHECK_HARDWARE_SPEC'
  | 'RECHECK_REVIEWER_CONSENSUS'
  | 'RECHECK_PROVENANCE'
  | 'FULL_RESEARCH_RERUN';

export interface EvidenceFreshnessSignal {
  sourcePublicationDate?: string;
  lastVerifiedAt?: string;
  benchmarkTestDate?: string;
  hardwareSpecDate?: string;
  firmwareOrDriverVersion?: string;
  methodologyVersion?: string;
  productGeneration?: string;
  sourceTier?: number;
  isPrimary?: boolean;
  isSyndicated?: boolean;
  sourceUrl?: string;
}

export interface EvidenceItemHealth {
  evidenceId: string;
  sourceId: string;
  evidenceType: 'BENCHMARK' | 'HARDWARE_SPEC' | 'YOUTUBE_REVIEW' | 'OEM_SPEC' | 'THERMAL' | 'COMMUNITY' | 'GENERAL';
  productEntity: string;
  excerpt: string;
  freshnessStatus: EvidenceFreshnessStatus;
  validityStatus: EvidenceValidityStatus;
  confidence: FreshnessConfidence;
  ageInDays: number | null;
  lastVerifiedAt: string;
  revalidationReason?: string;
  methodologyNote?: string;
  sourcePublisher?: string;
  sourceUrl?: string;
  sourceTier?: number;
}

export interface ClaimHealthRecord {
  claimId: string;
  claimText: string;
  claimType: string;
  healthStatus: ClaimHealthStatus;
  freshnessStatus: EvidenceFreshnessStatus;
  validityStatus: EvidenceValidityStatus;
  authorityStatus: 'TIER_1_PRIMARY' | 'TIER_2_LAB' | 'TIER_3_SECONDARY' | 'TIER_4_COMMUNITY' | 'UNKNOWN';
  independenceStatus: 'INDEPENDENT' | 'PR_SYNDICATED' | 'SPONSORED' | 'UNKNOWN';
  methodologyStatus: 'METHODOLOGY_VERIFIED' | 'METHODOLOGY_UNCERTAIN' | 'METHODOLOGY_CONFLICT' | 'NOT_APPLICABLE';
  supportingEvidenceCount: number;
  primaryEvidenceCount: number;
  conflictingEvidenceCount: number;
  lastVerifiedAt: string;
  revalidationRequired: boolean;
  revalidationAction?: RevalidationActionType;
  reason: string;
  upstreamEvidenceIds: string[];
  provenanceChainSummary?: string;
  affectedCreatorAssets: Array<{
    assetType: 'TALKING_POINT' | 'SCRIPT_SECTION' | 'BENCHMARK_CARD' | 'TELEPROMPTER' | 'TIMELINE_MARKER' | 'PREFLIGHT';
    assetId: string;
    assetLabel: string;
  }>;
}

export interface RevalidationPlanItem {
  id: string;
  claimId: string;
  evidenceId?: string;
  actionType: RevalidationActionType;
  targetEntity: string;
  reason: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sourceUrl?: string;
  estimatedEffort: 'FAST' | 'DEEP';
}

export interface RevalidationPlan {
  planId: string;
  researchRunId: string;
  status: RevalidationStatus;
  totalActions: number;
  items: RevalidationPlanItem[];
  createdAt: string;
  executionSummary?: string;
}

export interface ResearchHealthDimensions {
  evidenceFreshness: {
    score: number; // 0.0 to 100.0
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    freshCount: number;
    agingCount: number;
    staleCount: number;
    expiredCount: number;
  };
  evidenceValidity: {
    score: number;
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    validCount: number;
    revalidationRequiredCount: number;
    conflictedCount: number;
    unverifiedCount: number;
  };
  sourceAuthority: {
    score: number;
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    primaryLabPercentage: number;
    tier1Count: number;
    tier2Count: number;
  };
  sourceIndependence: {
    score: number;
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    independentCount: number;
    syndicatedCount: number;
  };
  methodologyIntegrity: {
    score: number;
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    verifiedCount: number;
    uncertainCount: number;
    conflictCount: number;
  };
  provenanceIntegrity: {
    score: number;
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    groundingScore: number;
  };
  conflictState: {
    score: number;
    status: 'EXCELLENT' | 'ACCEPTABLE' | 'DEGRADED' | 'CRITICAL';
    activeConflictsCount: number;
  };
}

export interface ResearchHealthReport {
  reportId: string;
  researchRunId: string;
  topic: string;
  overallHealthScore: number; // 0 to 100.0
  overallHealthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  readyToSupportCreatorContent: boolean;
  hardBlockers: string[];
  monitoringMode: HealthMonitoringMode;
  lastCheckedAt: string;
  evidenceSnapshotHash: string;
  claimsSummary: {
    total: number;
    healthy: number;
    aging: number;
    needsRevalidation: number;
    conflicted: number;
    unbacked: number;
    blocked: number;
  };
  evidenceSummary: {
    total: number;
    fresh: number;
    aging: number;
    stale: number;
    expired: number;
    unknown: number;
    unavailable: number;
  };
  dimensions: ResearchHealthDimensions;
  claimsHealth: ClaimHealthRecord[];
  evidenceHealth: EvidenceItemHealth[];
  revalidationPlan?: RevalidationPlan;
}

export interface HealthAuditEvent {
  healthCheckId: string;
  researchRunId: string;
  claimId?: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  evidenceSnapshotHash: string;
  timestamp: string;
  trigger: 'SYSTEM_CHECK' | 'USER_REVALIDATION' | 'SNAPSHOT_DIFF' | 'SOURCE_UPDATE';
  revalidationAction?: RevalidationActionType;
}

export interface RevalidationOptions {
  mode: 'AFFECTED_CLAIMS_ONLY' | 'ALL_CLAIMS' | 'PRIMARY_SOURCES_ONLY' | 'BENCHMARKS_ONLY' | 'HARDWARE_ONLY' | 'YOUTUBE_ONLY';
  claimIds?: string[];
  includePrimaryOEM?: boolean;
  includeIndependentLab?: boolean;
  includeYouTubeConsensus?: boolean;
  includeHardwareBenchmarks?: boolean;
}
