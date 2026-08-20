export type ExportPackageStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'VALIDATING'
  | 'READY'
  | 'READY_WITH_WARNINGS'
  | 'BLOCKED'
  | 'STALE'
  | 'EXPIRED'
  | 'EXPORTED'
  | 'EXPORT_FAILED'
  | 'CANCELLED';

export type ExportAssetType =
  | 'VIDEO_MASTER'
  | 'VIDEO_SHORT'
  | 'AUDIO_MASTER'
  | 'THUMBNAIL'
  | 'CAPTIONS_SRT'
  | 'CAPTIONS_VTT'
  | 'TRANSCRIPT'
  | 'SCRIPT'
  | 'TELEPROMPTER'
  | 'CHAPTERS'
  | 'TIMELINE_EDL'
  | 'TIMELINE_FCPXML'
  | 'BENCHMARK_CARDS'
  | 'B_ROLL_PLAN'
  | 'SHOW_NOTES'
  | 'DESCRIPTION'
  | 'TAGS'
  | 'PUBLISHING_METADATA'
  | 'CERTIFICATION'
  | 'PROJECT_SNAPSHOT'
  | 'PROVENANCE_PROOF';

export type ExportTargetFormat =
  | 'YOUTUBE_LONG_FORM'
  | 'YOUTUBE_SHORTS'
  | 'PODCAST'
  | 'MASTER_ARCHIVE';

export type ExportAssetStatus =
  | 'AVAILABLE'
  | 'MISSING'
  | 'STALE'
  | 'BLOCKED'
  | 'INCOMPATIBLE'
  | 'SUPERSEDED'
  | 'NOT_APPLICABLE'
  | 'UNAVAILABLE';

export type RenderManifestStatus =
  | 'DRAFT'
  | 'VALID'
  | 'INVALID'
  | 'BLOCKED'
  | 'STALE';

export type PackageValidationStatus =
  | 'PASS'
  | 'WARNING'
  | 'BLOCKED'
  | 'UNAVAILABLE';

export interface CreatorExportAsset {
  assetId: string;
  name: string;
  assetType: ExportAssetType;
  targetFormat: ExportTargetFormat;
  status: ExportAssetStatus;
  sourceFileRef?: string;
  expectedFilename: string;
  fileSizeBytes?: number;
  mimeType: string;
  upstreamLineage: string;
  isRenderRequired: boolean;
  blockerDetails?: string;
}

export interface CreatorExportTarget {
  targetFormat: ExportTargetFormat;
  displayName: string;
  status: 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED' | 'UNAVAILABLE';
  aspectRatio: string;
  targetDurationMinutes?: number;
  requiredAssetTypes: ExportAssetType[];
  includedAssetIds: string[];
  warnings: string[];
  blockers: string[];
}

export interface RenderManifestEntry {
  entryId: string;
  assetId: string;
  assetType: ExportAssetType;
  variantId?: string;
  targetPlatform: ExportTargetFormat;
  outputFormat: string;
  resolution?: string;
  aspectRatio: string;
  frameRate?: number;
  durationSeconds?: number;
  expectedFilename: string;
  renderCapabilityState: 'AVAILABLE' | 'NOT_CONFIGURED' | 'UNAVAILABLE' | 'STAGING_ONLY' | 'LOCAL_ONLY' | 'BLOCKED';
  dependencies: string[];
  validationRequirements: string[];
  blockerReason?: string;
}

export interface RenderManifest {
  manifestId: string;
  packageId: string;
  status: RenderManifestStatus;
  entries: RenderManifestEntry[];
  totalEntriesCount: number;
  existingAssetsCount: number;
  renderRequiredCount: number;
  unavailableRenderersCount: number;
  blockedEntriesCount: number;
  manifestHash: string;
  generatedAt: string;
}

export interface PackageValidationIssue {
  issueId: string;
  severity: 'CRITICAL_BLOCKER' | 'WARNING' | 'INFO';
  category: 'EVIDENCE' | 'CERTIFICATION' | 'ASSET' | 'RENDER' | 'METADATA' | 'VERSION_MISMATCH';
  affectedAssetId?: string;
  affectedTarget?: ExportTargetFormat;
  reason: string;
  upstreamCause?: string;
  requiredAction: string;
  isBlocking: boolean;
}

export interface PackageValidationReport {
  reportId: string;
  packageId: string;
  validationStatus: PackageValidationStatus;
  issues: PackageValidationIssue[];
  criticalBlockersCount: number;
  warningsCount: number;
  evaluatedAt: string;
}

export interface ExportReadinessReport {
  packageId: string;
  overallStatus: ExportPackageStatus;
  readinessScore: number;
  isExportable: boolean;
  criticalBlockers: string[];
  warnings: string[];
  requiredActions: string[];
  targetsReadiness: Record<ExportTargetFormat, CreatorExportTarget['status']>;
  packageHash: string;
  certificationCertificateId?: string;
  evidenceSnapshotHash: string;
  projectSnapshotHash: string;
  scriptVersion: number;
  evaluatedAt: string;
}

export interface CreatorExportPackage {
  packageId: string;
  userId: string;
  researchRunId: string;
  status: ExportPackageStatus;
  name: string;
  targets: CreatorExportTarget[];
  assets: CreatorExportAsset[];
  renderManifest: RenderManifest;
  validationReport: PackageValidationReport;
  readiness: ExportReadinessReport;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  timelineFingerprint: string;
  certificationCertificateId?: string;
  productionMatrixSnapshotHash: string;
  packageSnapshotHash: string;
  isStale: boolean;
  staleReasons: string[];
  exportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  packageId: string;
  action:
    | 'PACKAGE_CREATED'
    | 'PACKAGE_VALIDATED'
    | 'PACKAGE_INVALIDATED'
    | 'EXPORT_APPROVAL_GRANTED'
    | 'EXPORT_STARTED'
    | 'EXPORT_COMPLETED'
    | 'EXPORT_FAILED'
    | 'EXPORT_CANCELLED'
    | 'PACKAGE_MARKED_STALE'
    | 'REVALIDATION_REQUIRED';
  packageHash: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  details: string;
  timestamp: string;
}
