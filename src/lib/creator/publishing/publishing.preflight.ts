import {
  PreflightCheckCategory,
  PreflightCheckItem,
  PreflightCheckStatus,
  PreflightResult,
  PublishingTargetPlan,
  PublishingTargetPlatform,
} from "./publishing.types";

export interface PublishingPreflightContext {
  projectSnapshotHash: string;
  expectedProjectSnapshotHash?: string;
  evidenceSnapshotHash: string;
  expectedEvidenceSnapshotHash?: string;
  scriptVersion: number;
  expectedScriptVersion?: number;
  timelineFingerprint: string;
  expectedTimelineFingerprint?: string;
  certificationCertificateId?: string;
  isCertificationValid?: boolean;
  releaseLockId?: string;
  isReleaseLockValid?: boolean;
  exportPackageId?: string;
  exportPackageSnapshotHash: string;
  expectedPackageSnapshotHash?: string;
  isExportPackageValid?: boolean;
  isExportPackageStale?: boolean;
  activeBlockers?: string[];
  availableAssetIds?: string[];
}

export class CreatorPublishingPreflightEngine {
  /**
   * Evaluates all 8 dimensions of publishing preflight with full explainability lineage.
   */
  static runPreflight(
    targetId: string,
    platform: PublishingTargetPlatform,
    targetPlan: PublishingTargetPlan,
    context: PublishingPreflightContext
  ): PreflightResult {
    const checks: PreflightCheckItem[] = [];

    // 1. A. PROJECT INTEGRITY CHECKS
    if (context.expectedProjectSnapshotHash && context.projectSnapshotHash !== context.expectedProjectSnapshotHash) {
      checks.push({
        checkId: `chk-psnap-${Date.now().toString(36)}`,
        category: "PROJECT_INTEGRITY",
        name: "Project Snapshot Hash Integrity",
        status: "BLOCKED",
        reason: "Project snapshot hash mismatch: project state drifted since export package generation.",
        upstreamDependency: "Phase 77 Creator Project Graph",
        originalCause: `Expected ${context.expectedProjectSnapshotHash} but found ${context.projectSnapshotHash}`,
        affectedPlatform: platform,
        requiredAction: "Re-generate Phase 83 export package and publishing plan against current project state.",
        isBlocking: true,
      });
    }

    if (context.expectedEvidenceSnapshotHash && context.evidenceSnapshotHash !== context.expectedEvidenceSnapshotHash) {
      checks.push({
        checkId: `chk-esnap-${Date.now().toString(36)}`,
        category: "PROJECT_INTEGRITY",
        name: "Verified Evidence Graph Integrity",
        status: "BLOCKED",
        reason: "Evidence snapshot hash mismatch: verified facts or benchmark records changed upstream.",
        upstreamDependency: "Phase 74-75 Research Health & Evidence System",
        originalCause: `Expected ${context.expectedEvidenceSnapshotHash} but found ${context.evidenceSnapshotHash}`,
        affectedPlatform: platform,
        requiredAction: "Re-validate claims and re-certify project integrity before publishing.",
        isBlocking: true,
      });
    }

    if (context.expectedScriptVersion && context.scriptVersion !== context.expectedScriptVersion) {
      checks.push({
        checkId: `chk-sver-${Date.now().toString(36)}`,
        category: "PROJECT_INTEGRITY",
        name: "Script Version Sync",
        status: "BLOCKED",
        reason: `Script version changed (v${context.expectedScriptVersion} -> v${context.scriptVersion}).`,
        upstreamDependency: "Script Intelligence Engine",
        originalCause: "Script mutated after export package planning",
        affectedPlatform: platform,
        requiredAction: "Synchronize publishing plan to reference active script version v" + context.scriptVersion,
        isBlocking: true,
      });
    }

    if (context.expectedTimelineFingerprint && context.timelineFingerprint !== context.expectedTimelineFingerprint) {
      checks.push({
        checkId: `chk-tlfp-${Date.now().toString(36)}`,
        category: "PROJECT_INTEGRITY",
        name: "Timeline Markers & Chapter Sync",
        status: "BLOCKED",
        reason: "Timeline markers or EDL fingerprint changed after package export.",
        upstreamDependency: "Phase 72 Timeline Sync",
        originalCause: "Timeline drifted post-export",
        affectedPlatform: platform,
        requiredAction: "Synchronize chapters and timeline markers before publishing.",
        isBlocking: true,
      });
    }

    // 2. B. CERTIFICATION INTEGRITY
    if (context.isCertificationValid === false || !context.certificationCertificateId) {
      checks.push({
        checkId: `chk-cert-${Date.now().toString(36)}`,
        category: "CERTIFICATION",
        name: "Project Integrity Certification",
        status: "BLOCKED",
        reason: "Project integrity certificate is missing, stale, or invalidated.",
        upstreamDependency: "Phase 79 Final Integrity Certification",
        originalCause: "Certification lock not established or broken by upstream edits",
        affectedPlatform: platform,
        requiredAction: "Certify project integrity in Phase 79 control plane.",
        isBlocking: true,
      });
    }

    // 3. C. RELEASE LOCK INTEGRITY
    if (context.isReleaseLockValid === false) {
      checks.push({
        checkId: `chk-rlock-${Date.now().toString(36)}`,
        category: "RELEASE_LOCK",
        name: "Immutable Release Lock",
        status: "BLOCKED",
        reason: "Release lock is invalidated or drifted from certified project state.",
        upstreamDependency: "Phase 79 Release Lock Engine",
        originalCause: "Release lock mismatch",
        affectedPlatform: platform,
        requiredAction: "Engage release lock before publishing.",
        isBlocking: true,
      });
    }

    // 4. D. EXPORT PACKAGE INTEGRITY
    if (context.isExportPackageStale || context.isExportPackageValid === false) {
      checks.push({
        checkId: `chk-pkg-stale-${Date.now().toString(36)}`,
        category: "EXPORT_PACKAGE",
        name: "Export Package Freshness",
        status: "BLOCKED",
        reason: "Phase 83 export package is stale or failed package validation.",
        upstreamDependency: "Phase 83 Creator Export Package",
        originalCause: "Export package out of sync with current project state",
        affectedPlatform: platform,
        requiredAction: "Re-generate and validate Phase 83 export package.",
        isBlocking: true,
      });
    }

    if (context.expectedPackageSnapshotHash && context.exportPackageSnapshotHash !== context.expectedPackageSnapshotHash) {
      checks.push({
        checkId: `chk-pkg-hash-${Date.now().toString(36)}`,
        category: "EXPORT_PACKAGE",
        name: "Export Package Snapshot Hash Match",
        status: "BLOCKED",
        reason: "Export package snapshot hash mismatch.",
        upstreamDependency: "Phase 83 Creator Export Package",
        originalCause: `Expected ${context.expectedPackageSnapshotHash} but found ${context.exportPackageSnapshotHash}`,
        affectedPlatform: platform,
        requiredAction: "Re-bind publishing plan to active export package.",
        isBlocking: true,
      });
    }

    // 5. E. ASSETS & METADATA CHECKS
    if (!targetPlan.metadata.title || targetPlan.metadata.title.trim() === "") {
      checks.push({
        checkId: `chk-meta-title-${Date.now().toString(36)}`,
        category: "ASSETS",
        name: "Publishing Metadata Title",
        status: "BLOCKED",
        reason: "Missing title for publishing target.",
        upstreamDependency: "Publishing Metadata",
        originalCause: "Title field is empty",
        affectedPlatform: platform,
        requiredAction: "Provide a verified title before publishing.",
        isBlocking: true,
      });
    }

    if (!targetPlan.metadata.description || targetPlan.metadata.description.trim() === "") {
      checks.push({
        checkId: `chk-meta-desc-${Date.now().toString(36)}`,
        category: "ASSETS",
        name: "Publishing Metadata Description",
        status: "BLOCKED",
        reason: "Missing description/show notes for publishing target.",
        upstreamDependency: "Publishing Metadata",
        originalCause: "Description field is empty",
        affectedPlatform: platform,
        requiredAction: "Provide verified description or show notes.",
        isBlocking: true,
      });
    }

    if (platform === "YOUTUBE_LONG_FORM" && (!targetPlan.metadata.chapters || targetPlan.metadata.chapters.length === 0)) {
      checks.push({
        checkId: `chk-meta-chap-${Date.now().toString(36)}`,
        category: "ASSETS",
        name: "YouTube Timestamp Chapters",
        status: "PASS_WITH_WARNINGS",
        reason: "No timestamp chapters specified for YouTube Long Form.",
        upstreamDependency: "Timeline Markers",
        originalCause: "Chapters list empty",
        affectedPlatform: platform,
        requiredAction: "Generate chapters from timeline markers for better audience navigation.",
        isBlocking: false,
      });
    }

    // Phase 84 Requirement 24: Podcast Audio Specification Check
    if (platform === "PODCAST") {
      if (targetPlan.metadata.isUncompressedMaster && targetPlan.metadata.audioCodec !== "WAV_PCM") {
        checks.push({
          checkId: `chk-pod-codec-${Date.now().toString(36)}`,
          category: "ASSETS",
          name: "Podcast Master Audio Format",
          status: "BLOCKED",
          reason: "Archival Podcast master must specify WAV_PCM uncompressed audio codec.",
          upstreamDependency: "Production Asset Definitions",
          originalCause: `Master audio marked uncompressed but codec is ${targetPlan.metadata.audioCodec || "unspecified"}`,
          affectedPlatform: platform,
          requiredAction: "Set archival master audio codec to WAV_PCM (24-bit/48kHz).",
          isBlocking: true,
        });
      }
    }

    // 6. F. HARD SAFETY BLOCKERS
    if (context.activeBlockers && context.activeBlockers.length > 0) {
      for (const blk of context.activeBlockers) {
        checks.push({
          checkId: `chk-blk-${Math.random().toString(36).slice(2, 7)}`,
          category: "SAFETY",
          name: "Hard Evidence Safety Gate",
          status: "BLOCKED",
          reason: `Non-bypassable blocker active: ${blk}`,
          upstreamDependency: "Research Evidence & Claims Safety Plane",
          originalCause: blk,
          affectedPlatform: platform,
          requiredAction: "Resolve safety violation (DO_NOT_SAY, UNBACKED, CONFLICTED).",
          isBlocking: true,
        });
      }
    }

    // 7. G. PLATFORM COMPATIBILITY CHECKS
    if (platform === "YOUTUBE_SHORTS" && targetPlan.metadata.chapters && targetPlan.metadata.chapters.length > 5) {
      checks.push({
        checkId: `chk-short-chap-${Date.now().toString(36)}`,
        category: "PLATFORM_COMPATIBILITY",
        name: "Shorts Video Constraints",
        status: "PASS_WITH_WARNINGS",
        reason: "Excessive chapter markers configured for vertical Short.",
        upstreamDependency: "Platform Formatting",
        originalCause: "Shorts format does not utilize multi-chapter timestamps",
        affectedPlatform: platform,
        requiredAction: "Limit chapter markers on vertical short-form content.",
        isBlocking: false,
      });
    }

    // 8. H. SCHEDULING CHECKS
    if (targetPlan.mode === "SCHEDULED_PUBLISH" && targetPlan.schedulingConfig) {
      const sched = targetPlan.schedulingConfig;
      if (!sched.timezoneIana || sched.timezoneIana.trim() === "") {
        checks.push({
          checkId: `chk-sched-tz-${Date.now().toString(36)}`,
          category: "SCHEDULING",
          name: "Timezone Specification",
          status: "BLOCKED",
          reason: "Scheduled publishing requires a valid IANA timezone identifier (e.g. 'America/New_York', 'UTC').",
          upstreamDependency: "Publishing Scheduling",
          originalCause: "Timezone identifier missing",
          affectedPlatform: platform,
          requiredAction: "Select a valid IANA timezone.",
          isBlocking: true,
        });
      }

      const scheduledDate = new Date(sched.scheduledTimestamp);
      if (isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
        checks.push({
          checkId: `chk-sched-time-${Date.now().toString(36)}`,
          category: "SCHEDULING",
          name: "Future Timestamp Validation",
          status: "BLOCKED",
          reason: "Scheduled publish timestamp must be a valid future ISO-8601 date.",
          upstreamDependency: "Publishing Scheduling",
          originalCause: "Scheduled timestamp is in the past or invalid",
          affectedPlatform: platform,
          requiredAction: "Set scheduled publish time to a future timestamp.",
          isBlocking: true,
        });
      }
    }

    const blockers = checks.filter((c) => c.isBlocking).map((c) => `${c.name}: ${c.reason}`);
    const warnings = checks.filter((c) => !c.isBlocking && c.status === "PASS_WITH_WARNINGS").map((c) => `${c.name}: ${c.reason}`);
    const requiredActions = Array.from(new Set(checks.map((c) => c.requiredAction)));

    let status: PreflightCheckStatus = "PASS";
    if (blockers.length > 0) {
      status = "BLOCKED";
    } else if (warnings.length > 0) {
      status = "PASS_WITH_WARNINGS";
    }

    // Score calculation only when mathematically sound
    let score: number | undefined;
    if (blockers.length === 0) {
      score = warnings.length === 0 ? 100 : Math.max(75, 100 - warnings.length * 5);
    } else {
      score = Math.max(0, 100 - blockers.length * 30);
    }

    const nowStr = new Date().toISOString();

    return {
      preflightId: `pfl-${targetId}-${Date.now().toString(36)}`,
      targetId,
      status,
      score,
      checks,
      blockers,
      warnings,
      requiredActions,
      projectSnapshotHash: context.projectSnapshotHash,
      evidenceSnapshotHash: context.evidenceSnapshotHash,
      scriptVersion: context.scriptVersion,
      packageSnapshotHash: context.exportPackageSnapshotHash,
      certificationCertificateId: context.certificationCertificateId,
      releaseLockId: context.releaseLockId,
      generatedAt: nowStr,
    };
  }
}
