import {
  CreatorExportTarget,
  ExportPackageStatus,
  ExportReadinessReport,
  ExportTargetFormat,
  PackageValidationReport,
} from "./creator-export.types";

export class ExportReadinessEngine {
  /**
   * Evaluates overall export readiness deterministically from validation reports and target statuses.
   */
  static evaluateReadiness(
    packageId: string,
    validationReport: PackageValidationReport,
    targets: CreatorExportTarget[],
    packageHash: string,
    evidenceSnapshotHash: string,
    projectSnapshotHash: string,
    scriptVersion: number,
    certificationCertificateId?: string
  ): ExportReadinessReport {
    const isExportable = validationReport.criticalBlockersCount === 0;
    let overallStatus: ExportPackageStatus = "READY";

    if (validationReport.criticalBlockersCount > 0) {
      overallStatus = "BLOCKED";
    } else if (validationReport.warningsCount > 0) {
      overallStatus = "READY_WITH_WARNINGS";
    }

    const criticalBlockers = validationReport.issues
      .filter((i) => i.isBlocking)
      .map((i) => i.reason);

    const warnings = validationReport.issues
      .filter((i) => !i.isBlocking)
      .map((i) => i.reason);

    const requiredActions = Array.from(
      new Set(validationReport.issues.map((i) => i.requiredAction))
    );

    const targetsReadiness: Record<ExportTargetFormat, CreatorExportTarget["status"]> = {
      YOUTUBE_LONG_FORM: "READY",
      YOUTUBE_SHORTS: "READY",
      PODCAST: "READY",
      MASTER_ARCHIVE: "READY",
    };

    for (const target of targets) {
      if (validationReport.issues.some((i) => i.affectedTarget === target.targetFormat && i.isBlocking)) {
        targetsReadiness[target.targetFormat] = "BLOCKED";
      } else if (validationReport.issues.some((i) => i.affectedTarget === target.targetFormat && !i.isBlocking)) {
        targetsReadiness[target.targetFormat] = "READY_WITH_WARNINGS";
      } else {
        targetsReadiness[target.targetFormat] = target.status;
      }
    }

    let readinessScore = 100;
    if (validationReport.criticalBlockersCount > 0) {
      readinessScore = Math.max(0, 100 - validationReport.criticalBlockersCount * 25);
    } else if (validationReport.warningsCount > 0) {
      readinessScore = Math.max(70, 100 - validationReport.warningsCount * 5);
    }

    const nowStr = new Date().toISOString();

    return {
      packageId,
      overallStatus,
      readinessScore,
      isExportable,
      criticalBlockers,
      warnings,
      requiredActions,
      targetsReadiness,
      packageHash,
      certificationCertificateId,
      evidenceSnapshotHash,
      projectSnapshotHash,
      scriptVersion,
      evaluatedAt: nowStr,
    };
  }
}
