export * from "./creator-export.types";
export * from "./creator-export.audit";
export * from "./render-manifest.engine";
export * from "./package-validator.engine";
export * from "./export-readiness.engine";
export * from "./creator-export.package";

import {
  CreatorExportPackage,
  ExportReadinessReport,
  PackageValidationReport,
} from "./creator-export.types";
import { CreatorExportPackageEngine } from "./creator-export.package";
import { PackageValidatorEngine, PackageValidationContext } from "./package-validator.engine";
import { CreatorExportAuditService } from "./creator-export.audit";

const globalForExportProvider = globalThis as unknown as {
  creatorExportStore: {
    packages: Map<string, CreatorExportPackage>;
  } | undefined;
};

const exportStore = globalForExportProvider.creatorExportStore ?? {
  packages: new Map<string, CreatorExportPackage>(),
};
if (process.env.NODE_ENV !== "production")
  globalForExportProvider.creatorExportStore = exportStore;

export class CreatorExportProvider {
  /**
   * Retrieves or initializes the active export package for a research run.
   */
  static getExportPackage(
    researchRunId: string,
    userId: string = "anonymous-creator",
    context: any = {}
  ): CreatorExportPackage {
    const key = `${userId}:${researchRunId}`;
    let pkg = exportStore.packages.get(key);
    if (!pkg) {
      pkg = CreatorExportPackageEngine.assembleExportPackage(userId, researchRunId, context);
      exportStore.packages.set(key, pkg);
    }
    return pkg;
  }

  /**
   * Creates or regenerates an export package.
   */
  static createPackage(
    userId: string,
    researchRunId: string,
    context: any = {}
  ): CreatorExportPackage {
    const pkg = CreatorExportPackageEngine.assembleExportPackage(userId, researchRunId, context);
    const key = `${userId}:${researchRunId}`;
    exportStore.packages.set(key, pkg);
    return pkg;
  }

  /**
   * Validates a package against current context.
   */
  static validatePackage(
    pkg: CreatorExportPackage,
    context: PackageValidationContext
  ): PackageValidationReport {
    const report = PackageValidatorEngine.validatePackage(
      pkg.packageId,
      pkg.assets,
      pkg.targets,
      pkg.renderManifest,
      context
    );
    pkg.validationReport = report;
    pkg.status = report.validationStatus === "BLOCKED" ? "BLOCKED" : report.validationStatus === "WARNING" ? "READY_WITH_WARNINGS" : "READY";
    return report;
  }

  /**
   * Retrieves export readiness.
   */
  static getReadiness(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ExportReadinessReport {
    const pkg = this.getExportPackage(researchRunId, userId);
    return pkg.readiness;
  }

  /**
   * Executes explicit creator export action.
   */
  static exportPackage(
    packageId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): { success: boolean; package?: CreatorExportPackage; error?: string } {
    const pkg = this.getExportPackage(researchRunId, userId);
    if (pkg.packageId !== packageId) {
      return { success: false, error: "Package ID mismatch or package not found." };
    }

    if (!pkg.readiness.isExportable || pkg.status === "BLOCKED") {
      CreatorExportAuditService.recordAuditEvent({
        auditId: `exp-aud-${Date.now().toString(36)}-fail`,
        userId,
        researchRunId,
        packageId,
        action: "EXPORT_FAILED",
        packageHash: pkg.packageSnapshotHash,
        projectSnapshotHash: pkg.projectSnapshotHash,
        evidenceSnapshotHash: pkg.evidenceSnapshotHash,
        scriptVersion: pkg.scriptVersion,
        details: `Export failed due to active blockers: ${pkg.readiness.criticalBlockers.join("; ")}`,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: "Export blocked by active critical blockers." };
    }

    const nowStr = new Date().toISOString();
    pkg.status = "EXPORTED";
    pkg.exportedAt = nowStr;

    CreatorExportAuditService.recordAuditEvent({
      auditId: `exp-aud-${Date.now().toString(36)}-comp`,
      userId,
      researchRunId,
      packageId,
      action: "EXPORT_COMPLETED",
      packageHash: pkg.packageSnapshotHash,
      projectSnapshotHash: pkg.projectSnapshotHash,
      evidenceSnapshotHash: pkg.evidenceSnapshotHash,
      scriptVersion: pkg.scriptVersion,
      details: `Export completed for package "${pkg.name}". Assets exported: ${pkg.assets.length}`,
      timestamp: nowStr,
    });

    return { success: true, package: pkg };
  }

  /**
   * Cancels an export package.
   */
  static cancelExport(
    packageId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): boolean {
    const pkg = this.getExportPackage(researchRunId, userId);
    if (pkg.packageId === packageId) {
      pkg.status = "CANCELLED";

      CreatorExportAuditService.recordAuditEvent({
        auditId: `exp-aud-${Date.now().toString(36)}-canc`,
        userId,
        researchRunId,
        packageId,
        action: "EXPORT_CANCELLED",
        packageHash: pkg.packageSnapshotHash,
        projectSnapshotHash: pkg.projectSnapshotHash,
        evidenceSnapshotHash: pkg.evidenceSnapshotHash,
        scriptVersion: pkg.scriptVersion,
        details: `Export cancelled by user.`,
        timestamp: new Date().toISOString(),
      });

      return true;
    }
    return false;
  }

  /**
   * Retrieves audit ledger history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator") {
    return CreatorExportAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory cache.
   */
  static clearCache(): void {
    exportStore.packages.clear();
    CreatorExportAuditService.clearHistory();
  }
}
