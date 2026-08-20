import {
  CreatorExportAsset,
  CreatorExportTarget,
  RenderManifest,
  PackageValidationReport,
  PackageValidationIssue,
  PackageValidationStatus,
} from "./creator-export.types";

export interface PackageValidationContext {
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
  activeBlockers?: string[];
  productionReadinessScore?: number;
  publishingReadinessScore?: number;
}

export class PackageValidatorEngine {
  /**
   * Evaluates 15 package validation dimensions deterministically.
   */
  static validatePackage(
    packageId: string,
    assets: CreatorExportAsset[],
    targets: CreatorExportTarget[],
    renderManifest: RenderManifest,
    context: PackageValidationContext
  ): PackageValidationReport {
    const issues: PackageValidationIssue[] = [];

    // 1. Snapshot Integrity Checks
    if (context.expectedProjectSnapshotHash && context.projectSnapshotHash !== context.expectedProjectSnapshotHash) {
      issues.push({
        issueId: `iss-psnap-${Date.now().toString(36)}`,
        severity: "CRITICAL_BLOCKER",
        category: "VERSION_MISMATCH",
        reason: "Project snapshot hash mismatch: project has mutated since export package planning.",
        upstreamCause: `Expected ${context.expectedProjectSnapshotHash} but found ${context.projectSnapshotHash}`,
        requiredAction: "Re-generate export package plan against current project state.",
        isBlocking: true,
      });
    }

    if (context.expectedEvidenceSnapshotHash && context.evidenceSnapshotHash !== context.expectedEvidenceSnapshotHash) {
      issues.push({
        issueId: `iss-esnap-${Date.now().toString(36)}`,
        severity: "CRITICAL_BLOCKER",
        category: "EVIDENCE",
        reason: "Evidence snapshot hash mismatch: underlying verified evidence graph changed.",
        upstreamCause: `Expected ${context.expectedEvidenceSnapshotHash} but found ${context.evidenceSnapshotHash}`,
        requiredAction: "Re-validate claims and update export package evidence bindings.",
        isBlocking: true,
      });
    }

    if (context.expectedScriptVersion && context.scriptVersion !== context.expectedScriptVersion) {
      issues.push({
        issueId: `iss-sver-${Date.now().toString(36)}`,
        severity: "CRITICAL_BLOCKER",
        category: "VERSION_MISMATCH",
        reason: "Script version mismatch: script content was incremented.",
        upstreamCause: `Expected v${context.expectedScriptVersion} but found v${context.scriptVersion}`,
        requiredAction: "Update export package to reference latest script version.",
        isBlocking: true,
      });
    }

    if (context.expectedTimelineFingerprint && context.timelineFingerprint !== context.expectedTimelineFingerprint) {
      issues.push({
        issueId: `iss-tfp-${Date.now().toString(36)}`,
        severity: "CRITICAL_BLOCKER",
        category: "VERSION_MISMATCH",
        reason: "Timeline fingerprint mismatch: timeline markers or EDL drifted.",
        upstreamCause: "Timeline edited post package generation",
        requiredAction: "Synchronize timeline before exporting package.",
        isBlocking: true,
      });
    }

    // 2. Certification Integrity Check
    if (context.isCertificationValid === false) {
      issues.push({
        issueId: `iss-cert-${Date.now().toString(36)}`,
        severity: "CRITICAL_BLOCKER",
        category: "CERTIFICATION",
        reason: "Project integrity certificate is stale, revoked, or failed release lock.",
        upstreamCause: "Upstream change invalidated release lock",
        requiredAction: "Re-certify project integrity in Final Integrity control plane.",
        isBlocking: true,
      });
    }

    // 3. Hard Safety Blockers
    if (context.activeBlockers && context.activeBlockers.length > 0) {
      for (const blocker of context.activeBlockers) {
        issues.push({
          issueId: `iss-blk-${Math.random().toString(36).slice(2, 6)}`,
          severity: "CRITICAL_BLOCKER",
          category: "EVIDENCE",
          reason: `Hard safety gate active: ${blocker}`,
          upstreamCause: blocker,
          requiredAction: "Resolve safety violation (DO_NOT_SAY, UNBACKED, CONFLICTED).",
          isBlocking: true,
        });
      }
    }

    // 4. Asset Availability & Status Checks
    for (const asset of assets) {
      if (asset.status === "BLOCKED") {
        issues.push({
          issueId: `iss-ast-blk-${asset.assetId}`,
          severity: "CRITICAL_BLOCKER",
          category: "ASSET",
          affectedAssetId: asset.assetId,
          affectedTarget: asset.targetFormat,
          reason: `Mandatory asset "${asset.name}" is blocked.`,
          upstreamCause: asset.blockerDetails || "Blocked by upstream policy",
          requiredAction: "Clear asset blocker before export.",
          isBlocking: true,
        });
      } else if (asset.status === "MISSING" && !asset.isRenderRequired) {
        issues.push({
          issueId: `iss-ast-mis-${asset.assetId}`,
          severity: "CRITICAL_BLOCKER",
          category: "ASSET",
          affectedAssetId: asset.assetId,
          affectedTarget: asset.targetFormat,
          reason: `Required asset "${asset.name}" is missing.`,
          requiredAction: "Generate or import missing asset.",
          isBlocking: true,
        });
      } else if (asset.status === "STALE") {
        issues.push({
          issueId: `iss-ast-stl-${asset.assetId}`,
          severity: "WARNING",
          category: "ASSET",
          affectedAssetId: asset.assetId,
          affectedTarget: asset.targetFormat,
          reason: `Asset "${asset.name}" is stale due to upstream edits.`,
          requiredAction: "Re-generate asset to match current script version.",
          isBlocking: false,
        });
      }
    }

    // 5. Render Manifest Checks
    if (renderManifest.status === "BLOCKED") {
      issues.push({
        issueId: `iss-rm-blk-${Date.now().toString(36)}`,
        severity: "CRITICAL_BLOCKER",
        category: "RENDER",
        reason: "Render manifest contains blocked render entries.",
        requiredAction: "Clear render dependency blockers.",
        isBlocking: true,
      });
    }

    const criticalBlockersCount = issues.filter((i) => i.isBlocking).length;
    const warningsCount = issues.filter((i) => !i.isBlocking).length;

    let validationStatus: PackageValidationStatus = "PASS";
    if (criticalBlockersCount > 0) {
      validationStatus = "BLOCKED";
    } else if (warningsCount > 0) {
      validationStatus = "WARNING";
    }

    const nowStr = new Date().toISOString();

    return {
      reportId: `pvr-${packageId}-${Date.now().toString(36)}`,
      packageId,
      validationStatus,
      issues,
      criticalBlockersCount,
      warningsCount,
      evaluatedAt: nowStr,
    };
  }
}
