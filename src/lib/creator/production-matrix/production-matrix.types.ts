export type ProductionVariantType =
  | 'YOUTUBE_LONG_FORM'
  | 'YOUTUBE_SHORT'
  | 'PODCAST'
  | 'CUSTOM_CREATOR_VARIANT';

export type ProductionVariantStatus =
  | 'DRAFT'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'STAGED'
  | 'CERTIFIED'
  | 'ARCHIVED'
  | 'BLOCKED';

export interface VariantEvidenceBinding {
  claimId: string;
  claimText: string;
  evidenceId: string;
  sourceId: string;
  isPrimary: boolean;
  status: 'VERIFIED' | 'SUPPORTED' | 'UNBACKED' | 'DO_NOT_SAY' | 'CONFLICTED';
}

export interface VariantAssetBinding {
  assetId: string;
  assetName: string;
  assetType:
    | 'TALKING_POINT'
    | 'SCRIPT_SECTION'
    | 'HOOK'
    | 'BENCHMARK_CARD'
    | 'BROLL_SHOT'
    | 'TELEPROMPTER_ROLL'
    | 'TIMELINE_MARKER'
    | 'PUBLISHING_METADATA'
    | 'DISTRIBUTION_PACKAGE';
  assemblyState:
    | 'REQUIRED'
    | 'AVAILABLE'
    | 'MISSING'
    | 'OPTIONAL'
    | 'INCOMPATIBLE'
    | 'STALE'
    | 'BLOCKED'
    | 'SUPERSEDED'
    | 'NOT_APPLICABLE';
  evidenceLineageRef?: string;
}

export interface ProductionVariant {
  variantId: string;
  userId: string;
  researchRunId: string;
  name: string;
  variantType: ProductionVariantType;
  status: ProductionVariantStatus;
  targetDurationMinutes: number;
  scriptVersion: number;
  sharedEvidenceSnapshotHash: string;
  hookText?: string;
  titleCandidate?: string;
  talkingPointIds: string[];
  benchmarkCardIds: string[];
  evidenceBindings: VariantEvidenceBinding[];
  assetBindings: VariantAssetBinding[];
  readinessScore: number;
  blockers: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionMatrix {
  matrixId: string;
  userId: string;
  researchRunId: string;
  sharedEvidenceSnapshotHash: string;
  variants: ProductionVariant[];
  totalVariantsCount: number;
  activeVariantsCount: number;
  readyVariantsCount: number;
  blockedVariantsCount: number;
  matrixSnapshotHash: string;
  lastEvaluatedAt: string;
}

export interface ProductionMatrixSnapshot {
  snapshotId: string;
  matrixId: string;
  researchRunId: string;
  sharedEvidenceSnapshotHash: string;
  variantFingerprints: Record<string, string>;
  snapshotHash: string;
  recordedAt: string;
}

export interface ProductionMatrixAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  action:
    | 'VARIANT_CREATED'
    | 'VARIANT_DUPLICATED'
    | 'VARIANT_COMPARED'
    | 'BENCHMARK_DIFF_EVALUATED'
    | 'ASSETS_ASSEMBLED'
    | 'VARIANT_STATUS_CHANGED'
    | 'MATRIX_EVALUATED';
  details: string;
  timestamp: string;
}
