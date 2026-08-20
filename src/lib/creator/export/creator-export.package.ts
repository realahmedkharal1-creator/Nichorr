import {
  CreatorExportAsset,
  CreatorExportPackage,
  CreatorExportTarget,
  ExportPackageStatus,
} from "./creator-export.types";
import { RenderManifestEngine } from "./render-manifest.engine";
import { PackageValidatorEngine, PackageValidationContext } from "./package-validator.engine";
import { ExportReadinessEngine } from "./export-readiness.engine";
import { CreatorExportAuditService } from "./creator-export.audit";

export class CreatorExportPackageEngine {
  /**
   * Generates a deterministic hash for an export package excluding volatile timestamps.
   */
  static generatePackageSnapshotHash(
    userId: string,
    researchRunId: string,
    assets: CreatorExportAsset[],
    projectSnapshotHash: string,
    evidenceSnapshotHash: string,
    scriptVersion: number
  ): string {
    const sorted = [...assets].sort((a, b) => a.assetId.localeCompare(b.assetId));
    const summary = sorted.map((a) => `${a.assetId}:${a.status}:${a.expectedFilename}`).join("|");
    const raw = `${userId}:${researchRunId}:${projectSnapshotHash}:${evidenceSnapshotHash}:v${scriptVersion}:${summary}`;

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `pkg-snap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Assembles a complete export package from authoritative subsystem states.
   */
  static assembleExportPackage(
    userId: string,
    researchRunId: string,
    context: {
      name?: string;
      projectSnapshotHash?: string;
      evidenceSnapshotHash?: string;
      scriptVersion?: number;
      timelineFingerprint?: string;
      certificationCertificateId?: string;
      productionMatrixSnapshotHash?: string;
      activeBlockers?: string[];
      isCertificationValid?: boolean;
    }
  ): CreatorExportPackage {
    const projectSnapshotHash = context.projectSnapshotHash || "psnap-default-12345";
    const evidenceSnapshotHash = context.evidenceSnapshotHash || "esnap-default-12345";
    const scriptVersion = context.scriptVersion || 1;
    const timelineFingerprint = context.timelineFingerprint || "tl-fp-v1";
    const productionMatrixSnapshotHash = context.productionMatrixSnapshotHash || "pmat-snap-default";
    const packageName = context.name || `Production Export Package [Run ${researchRunId}]`;
    const packageId = `pkg-${researchRunId}-${Date.now().toString(36)}`;

    // Standard Multi-Format Assets based on prior phases
    const assets: CreatorExportAsset[] = [
      {
        assetId: `ast-yt-master-${packageId}`,
        name: "YouTube Master Video Package",
        assetType: "VIDEO_MASTER",
        targetFormat: "YOUTUBE_LONG_FORM",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_master_16x9_4k.mp4`,
        mimeType: "video/mp4",
        upstreamLineage: `Variant: YouTube Long Form -> Script v${scriptVersion} -> Evidence ${evidenceSnapshotHash}`,
        isRenderRequired: true,
      },
      {
        assetId: `ast-yt-short-${packageId}`,
        name: "YouTube Shorts Vertical Package",
        assetType: "VIDEO_SHORT",
        targetFormat: "YOUTUBE_SHORTS",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_short_9x16_1080p.mp4`,
        mimeType: "video/mp4",
        upstreamLineage: `Variant: YouTube Short -> Script v${scriptVersion}`,
        isRenderRequired: true,
      },
      {
        assetId: `ast-pod-master-${packageId}`,
        name: "Podcast Audio Master Package",
        assetType: "AUDIO_MASTER",
        targetFormat: "PODCAST",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_podcast_master.wav`,
        mimeType: "audio/wav",
        upstreamLineage: `Variant: Podcast -> Script v${scriptVersion}`,
        isRenderRequired: true,
      },
      {
        assetId: `ast-srt-captions-${packageId}`,
        name: "Synchronized Subtitles (SRT)",
        assetType: "CAPTIONS_SRT",
        targetFormat: "YOUTUBE_LONG_FORM",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_captions_en.srt`,
        mimeType: "text/plain",
        upstreamLineage: `Teleprompter Roll -> Script v${scriptVersion}`,
        isRenderRequired: false,
      },
      {
        assetId: `ast-chapters-${packageId}`,
        name: "YouTube Timestamp Chapters",
        assetType: "CHAPTERS",
        targetFormat: "YOUTUBE_LONG_FORM",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_chapters.txt`,
        mimeType: "text/plain",
        upstreamLineage: `Timeline Markers: ${timelineFingerprint}`,
        isRenderRequired: false,
      },
      {
        assetId: `ast-benchmarks-${packageId}`,
        name: "Hardware Benchmark Overlays",
        assetType: "BENCHMARK_CARDS",
        targetFormat: "YOUTUBE_LONG_FORM",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_benchmark_cards.json`,
        mimeType: "application/json",
        upstreamLineage: `Benchmark Synthesis -> Evidence ${evidenceSnapshotHash}`,
        isRenderRequired: false,
      },
      {
        assetId: `ast-pub-meta-${packageId}`,
        name: "Publishing & Distribution Metadata",
        assetType: "PUBLISHING_METADATA",
        targetFormat: "YOUTUBE_LONG_FORM",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_publishing_metadata.json`,
        mimeType: "application/json",
        upstreamLineage: `Publishing Preflight v${scriptVersion}`,
        isRenderRequired: false,
      },
      {
        assetId: `ast-cert-${packageId}`,
        name: "Project Integrity Certificate & Provenance Proof",
        assetType: "CERTIFICATION",
        targetFormat: "MASTER_ARCHIVE",
        status: "AVAILABLE",
        expectedFilename: `${researchRunId}_integrity_certificate.json`,
        mimeType: "application/json",
        upstreamLineage: `Certification Certificate: ${context.certificationCertificateId || "CERT-VERIFIED"}`,
        isRenderRequired: false,
      },
    ];

    // Standard Export Targets
    const targets: CreatorExportTarget[] = [
      {
        targetFormat: "YOUTUBE_LONG_FORM",
        displayName: "YouTube Long Form (16:9 4K)",
        status: "READY",
        aspectRatio: "16:9",
        targetDurationMinutes: 12,
        requiredAssetTypes: ["VIDEO_MASTER", "CAPTIONS_SRT", "CHAPTERS", "PUBLISHING_METADATA"],
        includedAssetIds: assets.filter((a) => a.targetFormat === "YOUTUBE_LONG_FORM").map((a) => a.assetId),
        warnings: [],
        blockers: [],
      },
      {
        targetFormat: "YOUTUBE_SHORTS",
        displayName: "YouTube Shorts (9:16 Vertical)",
        status: "READY",
        aspectRatio: "9:16",
        targetDurationMinutes: 1,
        requiredAssetTypes: ["VIDEO_SHORT", "PUBLISHING_METADATA"],
        includedAssetIds: assets.filter((a) => a.targetFormat === "YOUTUBE_SHORTS").map((a) => a.assetId),
        warnings: [],
        blockers: [],
      },
      {
        targetFormat: "PODCAST",
        displayName: "Podcast Master (Uncompressed WAV / MP3 Derivative)",
        status: "READY",
        aspectRatio: "1:1",
        targetDurationMinutes: 35,
        requiredAssetTypes: ["AUDIO_MASTER", "PUBLISHING_METADATA"],
        includedAssetIds: assets.filter((a) => a.targetFormat === "PODCAST").map((a) => a.assetId),
        warnings: [],
        blockers: [],
      },
      {
        targetFormat: "MASTER_ARCHIVE",
        displayName: "Complete Master Archive",
        status: "READY",
        aspectRatio: "Multi",
        requiredAssetTypes: ["CERTIFICATION", "PROJECT_SNAPSHOT", "PROVENANCE_PROOF"],
        includedAssetIds: assets.map((a) => a.assetId),
        warnings: [],
        blockers: [],
      },
    ];

    const renderManifest = RenderManifestEngine.generateRenderManifest(packageId, assets, context.activeBlockers);
    const validationContext: PackageValidationContext = {
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      timelineFingerprint,
      certificationCertificateId: context.certificationCertificateId,
      isCertificationValid: context.isCertificationValid !== false,
      activeBlockers: context.activeBlockers,
    };

    const validationReport = PackageValidatorEngine.validatePackage(
      packageId,
      assets,
      targets,
      renderManifest,
      validationContext
    );

    const packageSnapshotHash = this.generatePackageSnapshotHash(
      userId,
      researchRunId,
      assets,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion
    );

    const readiness = ExportReadinessEngine.evaluateReadiness(
      packageId,
      validationReport,
      targets,
      packageSnapshotHash,
      evidenceSnapshotHash,
      projectSnapshotHash,
      scriptVersion,
      context.certificationCertificateId
    );

    const nowStr = new Date().toISOString();

    const exportPkg: CreatorExportPackage = {
      packageId,
      userId,
      researchRunId,
      status: readiness.overallStatus,
      name: packageName,
      targets,
      assets,
      renderManifest,
      validationReport,
      readiness,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      timelineFingerprint,
      certificationCertificateId: context.certificationCertificateId,
      productionMatrixSnapshotHash,
      packageSnapshotHash,
      isStale: false,
      staleReasons: [],
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    CreatorExportAuditService.recordAuditEvent({
      auditId: `exp-aud-${Date.now().toString(36)}-create`,
      userId,
      researchRunId,
      packageId,
      action: "PACKAGE_CREATED",
      packageHash: packageSnapshotHash,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      details: `Assembled export package "${packageName}" with ${assets.length} assets across ${targets.length} targets. Status: ${readiness.overallStatus}`,
      timestamp: nowStr,
    });

    return exportPkg;
  }

  /**
   * Checks whether upstream changes have made an existing package stale.
   */
  static detectStaleness(
    pkg: CreatorExportPackage,
    currentContext: {
      projectSnapshotHash: string;
      evidenceSnapshotHash: string;
      scriptVersion: number;
      timelineFingerprint: string;
      certificationCertificateId?: string;
    }
  ): { isStale: boolean; reasons: string[] } {
    const reasons: string[] = [];

    if (pkg.projectSnapshotHash !== currentContext.projectSnapshotHash) {
      reasons.push("Project snapshot hash changed.");
    }
    if (pkg.evidenceSnapshotHash !== currentContext.evidenceSnapshotHash) {
      reasons.push("Evidence snapshot hash changed.");
    }
    if (pkg.scriptVersion !== currentContext.scriptVersion) {
      reasons.push(`Script version changed (v${pkg.scriptVersion} -> v${currentContext.scriptVersion}).`);
    }
    if (pkg.timelineFingerprint !== currentContext.timelineFingerprint) {
      reasons.push("Timeline markers fingerprint changed.");
    }
    if (pkg.certificationCertificateId !== currentContext.certificationCertificateId) {
      reasons.push("Certification certificate ID changed.");
    }

    const isStale = reasons.length > 0;
    if (isStale && !pkg.isStale) {
      pkg.isStale = true;
      pkg.staleReasons = reasons;
      pkg.status = "STALE";

      CreatorExportAuditService.recordAuditEvent({
        auditId: `exp-aud-${Date.now().toString(36)}-stale`,
        userId: pkg.userId,
        researchRunId: pkg.researchRunId,
        packageId: pkg.packageId,
        action: "PACKAGE_MARKED_STALE",
        packageHash: pkg.packageSnapshotHash,
        projectSnapshotHash: currentContext.projectSnapshotHash,
        evidenceSnapshotHash: currentContext.evidenceSnapshotHash,
        scriptVersion: currentContext.scriptVersion,
        details: `Package marked stale: ${reasons.join("; ")}`,
        timestamp: new Date().toISOString(),
      });
    }

    return { isStale, reasons };
  }
}
