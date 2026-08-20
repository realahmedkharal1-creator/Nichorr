import { CreatorTimelineMarker, TimelineMarkerCategory } from "../timeline/timeline.types";

export type EditorIntegrationStatus = 
  | 'NOT_CONFIGURED' 
  | 'EXPORT_ONLY' 
  | 'IMPORT_AVAILABLE' 
  | 'LOCAL_BRIDGE_REQUIRED' 
  | 'BRIDGE_CONNECTED' 
  | 'BRIDGE_DISCONNECTED' 
  | 'UNSUPPORTED';

export type TimelineSyncStatus = 
  | 'SYNCED' 
  | 'STALE' 
  | 'PENDING_REVIEW' 
  | 'CONFLICTED' 
  | 'BLOCKED';

export type SyncOperationType = 
  | 'ADD_MARKER' 
  | 'REMOVE_MARKER' 
  | 'MOVE_MARKER' 
  | 'UPDATE_METADATA' 
  | 'REVALIDATE_PROVENANCE' 
  | 'PRESERVE_EXTERNAL';

export type SyncResolutionStatus = 
  | 'SAFE_AUTO_UPDATE' 
  | 'USER_REVIEW_REQUIRED' 
  | 'CONFLICTED' 
  | 'UNVERIFIED' 
  | 'BLOCKED';

export interface TimelineProvenanceChain {
  claimId?: string;
  claimStatement?: string;
  evidenceId?: string;
  evidenceExcerpt?: string;
  sourcePublisher?: string;
  authorityTier?: string;
  independenceScore?: number;
}

export interface TimelineSyncOperation {
  id: string;
  operationType: SyncOperationType;
  category: TimelineMarkerCategory;
  markerId: string;
  label: string;
  oldTimestampSeconds?: number;
  newTimestampSeconds?: number;
  oldTimecode?: string;
  newTimecode?: string;
  reason: string;
  resolutionStatus: SyncResolutionStatus;
  provenanceChain?: TimelineProvenanceChain;
  enabled: boolean;
}

export interface TimelineDiffItem {
  markerId: string;
  label: string;
  category: TimelineMarkerCategory;
  changeType: 'ADDED' | 'REMOVED' | 'MOVED' | 'RENAMED' | 'UNCHANGED';
  oldTimecode?: string;
  newTimecode?: string;
  oldTimestampSeconds?: number;
  newTimestampSeconds?: number;
  reason: string;
  safeToAutoSync: boolean;
}

export interface TimelineSnapshot {
  timelineId: string;
  researchRunId: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
  targetDuration: number;
  outputMode: string;
  fingerprint: string;
  generatedAt: string;
  frameRate: number;
  markerCount: number;
  chapterCount: number;
  markers: CreatorTimelineMarker[];
}

export interface ImportedTimelineResult {
  format: 'EDL' | 'FCPXML';
  status: 'VALID' | 'PARTIAL' | 'UNSUPPORTED' | 'INVALID';
  timelineName: string;
  sequenceDurationSeconds?: number;
  frameRate: number;
  markers: CreatorTimelineMarker[];
  warnings: string[];
  rawEventCount: number;
}

export interface TimelineSyncPlan {
  planId: string;
  researchRunId: string;
  currentFingerprint: string;
  importedFingerprint?: string;
  status: TimelineSyncStatus;
  isStale: boolean;
  staleReason?: string;
  operations: TimelineSyncOperation[];
  diffs: TimelineDiffItem[];
  totalChanges: number;
  safeChangesCount: number;
  conflictsCount: number;
  generatedAt: string;
}

export interface TimelineSyncAuditRecord {
  auditId: string;
  researchRunId: string;
  timestamp: string;
  action: 'PREVIEWED' | 'APPLIED' | 'PARTIALLY_APPLIED' | 'REJECTED' | 'BLOCKED';
  operationsCount: number;
  appliedCategories: string[];
  appliedFingerprint: string;
  note?: string;
}
