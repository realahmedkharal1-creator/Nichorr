import {
  CreatorApprovalState,
  PublishingMode,
  PublishingPlan,
  PublishingTargetPlan,
  PublishingTargetPlatform,
} from "./publishing.types";
import { CreatorPublishingPreflightEngine, PublishingPreflightContext } from "./publishing.preflight";
import { PublishingConnectionService } from "./publishing.connection";
import { PublishingAuditService } from "./publishing.audit";

export class PublishingPlanEngine {
  /**
   * Generates a deterministic hash for a publishing plan excluding volatile timestamps.
   */
  static generatePlanSnapshotHash(
    userId: string,
    researchRunId: string,
    targets: PublishingTargetPlan[],
    projectSnapshotHash: string,
    evidenceSnapshotHash: string,
    scriptVersion: number,
    exportPackageSnapshotHash: string
  ): string {
    const sorted = [...targets].sort((a, b) => a.platform.localeCompare(b.platform));
    const summary = sorted
      .map(
        (t) =>
          `${t.platform}:${t.mode}:${t.metadata.title}:${t.metadata.audioCodec || "none"}:${t.metadata.isUncompressedMaster}:${t.selectedAssetIds.join(",")}`
      )
      .join("|");
    const raw = `${userId}:${researchRunId}:${projectSnapshotHash}:${evidenceSnapshotHash}:v${scriptVersion}:${exportPackageSnapshotHash}:${summary}`;

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `pplan-snap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Creates a deterministic publishing plan from the validated Phase 83 export package and project state.
   */
  static createPublishingPlan(
    userId: string,
    researchRunId: string,
    context: {
      exportPackageId?: string;
      exportPackageSnapshotHash?: string;
      projectSnapshotHash?: string;
      evidenceSnapshotHash?: string;
      scriptVersion?: number;
      timelineFingerprint?: string;
      certificationCertificateId?: string;
      releaseLockId?: string;
      title?: string;
      description?: string;
      activeBlockers?: string[];
      isCertificationValid?: boolean;
      isReleaseLockValid?: boolean;
      isExportPackageValid?: boolean;
      requestedModes?: Partial<Record<PublishingTargetPlatform, PublishingMode>>;
    } = {}
  ): PublishingPlan {
    const planId = `pplan-${researchRunId}-${Date.now().toString(36)}`;
    const exportPackageId = context.exportPackageId || `pkg-${researchRunId}-default`;
    const exportPackageSnapshotHash = context.exportPackageSnapshotHash || "pkg-snap-default";
    const projectSnapshotHash = context.projectSnapshotHash || "psnap-default-12345";
    const evidenceSnapshotHash = context.evidenceSnapshotHash || "esnap-default-12345";
    const scriptVersion = context.scriptVersion || 1;
    const timelineFingerprint = context.timelineFingerprint || "tl-fp-v1";
    const certificationCertificateId = context.certificationCertificateId || "CERT-VERIFIED-1";
    const releaseLockId = context.releaseLockId || "LOCK-VERIFIED-1";
    const baseTitle = context.title || `Hardware Review & Benchmark Analysis [Run ${researchRunId}]`;
    const baseDesc = context.description || `Comprehensive evidence-first benchmark breakdown and methodology analysis. Research Run ${researchRunId}.`;

    const platforms: PublishingTargetPlatform[] = ["YOUTUBE_LONG_FORM", "YOUTUBE_SHORTS", "PODCAST"];
    const targets: PublishingTargetPlan[] = [];

    const defaultApprovalState: CreatorApprovalState = {
      isApproved: false,
      isStale: false,
    };

    for (const platform of platforms) {
      const targetId = `ptgt-${platform.toLowerCase()}-${researchRunId}`;
      const requestedMode = context.requestedModes?.[platform] || "STAGING_ONLY";
      const { effectiveMode, connectionState } = PublishingConnectionService.resolveEffectivePublishMode(
        platform,
        requestedMode
      );

      let isUncompressedMaster = false;
      let audioCodec: 'WAV_PCM' | 'MP3' | 'AAC' | undefined;
      let audioBitrateKbps: number | undefined;

      if (platform === "PODCAST") {
        // Phase 84 Requirement 24: Uncompressed archival master WAV
        isUncompressedMaster = true;
        audioCodec = "WAV_PCM";
        audioBitrateKbps = undefined; // Uncompressed PCM does not have lossy bitrate constraint
      }

      const targetPlan: PublishingTargetPlan = {
        targetId,
        platform,
        mode: effectiveMode,
        status: "DRAFT",
        selectedAssetIds: [`ast-${platform.toLowerCase()}-pkg`],
        metadata: {
          title: platform === "YOUTUBE_SHORTS" ? `${baseTitle} #Shorts` : baseTitle,
          description: baseDesc,
          chapters: platform === "YOUTUBE_LONG_FORM" ? ["0:00 Intro", "1:30 Benchmarks", "8:45 Conclusion"] : undefined,
          tags: ["hardware", "benchmarks", "tech-review", "nichorr"],
          hashtags: ["#tech", "#benchmarks", "#hardware"],
          thumbnailRef: `thumb-${platform.toLowerCase()}.png`,
          mediaAssetRef: `${researchRunId}_${platform.toLowerCase()}_master`,
          showNotes: platform === "PODCAST" ? baseDesc : undefined,
          audioCodec,
          audioBitrateKbps,
          isUncompressedMaster,
        },
        connectionState,
        approvalState: { ...defaultApprovalState },
        attemptCount: 0,
      };

      const preflightCtx: PublishingPreflightContext = {
        projectSnapshotHash,
        expectedProjectSnapshotHash: projectSnapshotHash,
        evidenceSnapshotHash,
        expectedEvidenceSnapshotHash: evidenceSnapshotHash,
        scriptVersion,
        expectedScriptVersion: scriptVersion,
        timelineFingerprint,
        expectedTimelineFingerprint: timelineFingerprint,
        certificationCertificateId,
        isCertificationValid: context.isCertificationValid !== false,
        releaseLockId,
        isReleaseLockValid: context.isReleaseLockValid !== false,
        exportPackageId,
        exportPackageSnapshotHash,
        expectedPackageSnapshotHash: exportPackageSnapshotHash,
        isExportPackageValid: context.isExportPackageValid !== false,
        activeBlockers: context.activeBlockers,
      };

      const preflight = CreatorPublishingPreflightEngine.runPreflight(targetId, platform, targetPlan, preflightCtx);
      targetPlan.preflightResult = preflight;
      targetPlan.status = preflight.status === "BLOCKED" ? "PREFLIGHT_BLOCKED" : "PREFLIGHT_PASSED";
      if (preflight.status === "BLOCKED") {
        targetPlan.blockerDetails = preflight.blockers;
      }

      targets.push(targetPlan);
    }

    const planSnapshotHash = this.generatePlanSnapshotHash(
      userId,
      researchRunId,
      targets,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      exportPackageSnapshotHash
    );

    const hasBlockers = targets.some((t) => t.status === "PREFLIGHT_BLOCKED");
    const nowStr = new Date().toISOString();

    const plan: PublishingPlan = {
      planId,
      userId,
      researchRunId,
      exportPackageId,
      exportPackageSnapshotHash,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      timelineFingerprint,
      certificationCertificateId,
      releaseLockId,
      targets,
      planSnapshotHash,
      status: hasBlockers ? "PREFLIGHT_BLOCKED" : "PREFLIGHT_PASSED",
      isStale: false,
      staleReasons: [],
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    PublishingAuditService.recordAuditEvent({
      auditId: `pub-aud-${Date.now().toString(36)}-plan`,
      userId,
      researchRunId,
      planId,
      action: "PUBLISHING_PLAN_CREATED",
      planHash: planSnapshotHash,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      details: `Created multi-channel publishing plan for ${targets.length} targets. Status: ${plan.status}`,
      timestamp: nowStr,
    });

    return plan;
  }

  /**
   * Detects whether upstream state changes (evidence, script, snapshot, certification, release lock) have made a plan stale.
   */
  static detectStaleness(
    plan: PublishingPlan,
    currentContext: {
      projectSnapshotHash: string;
      evidenceSnapshotHash: string;
      scriptVersion: number;
      timelineFingerprint: string;
      exportPackageSnapshotHash: string;
      certificationCertificateId?: string;
      releaseLockId?: string;
    }
  ): { isStale: boolean; reasons: string[] } {
    const reasons: string[] = [];

    if (plan.projectSnapshotHash !== currentContext.projectSnapshotHash) {
      reasons.push("Project snapshot hash changed.");
    }
    if (plan.evidenceSnapshotHash !== currentContext.evidenceSnapshotHash) {
      reasons.push("Evidence snapshot hash changed.");
    }
    if (plan.scriptVersion !== currentContext.scriptVersion) {
      reasons.push(`Script version changed (v${plan.scriptVersion} -> v${currentContext.scriptVersion}).`);
    }
    if (plan.timelineFingerprint !== currentContext.timelineFingerprint) {
      reasons.push("Timeline fingerprint changed.");
    }
    if (plan.exportPackageSnapshotHash !== currentContext.exportPackageSnapshotHash) {
      reasons.push("Export package snapshot hash changed.");
    }
    if (plan.certificationCertificateId !== currentContext.certificationCertificateId) {
      reasons.push("Certification certificate changed.");
    }
    if (plan.releaseLockId !== currentContext.releaseLockId) {
      reasons.push("Release lock changed.");
    }

    const isStale = reasons.length > 0;
    if (isStale && !plan.isStale) {
      plan.isStale = true;
      plan.staleReasons = reasons;
      plan.status = "STALE";

      for (const target of plan.targets) {
        target.status = "STALE";
        target.approvalState.isStale = true;
      }

      PublishingAuditService.recordAuditEvent({
        auditId: `pub-aud-${Date.now().toString(36)}-stale`,
        userId: plan.userId,
        researchRunId: plan.researchRunId,
        planId: plan.planId,
        action: "PUBLISHING_MARKED_STALE",
        planHash: plan.planSnapshotHash,
        projectSnapshotHash: currentContext.projectSnapshotHash,
        evidenceSnapshotHash: currentContext.evidenceSnapshotHash,
        scriptVersion: currentContext.scriptVersion,
        details: `Publishing plan marked stale: ${reasons.join("; ")}`,
        timestamp: new Date().toISOString(),
      });
    }

    return { isStale, reasons };
  }
}
