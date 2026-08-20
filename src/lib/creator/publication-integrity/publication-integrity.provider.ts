export * from "./publication-integrity.types";
export * from "./publication-integrity.audit";
export * from "./publication-integrity.snapshot";
export * from "./publication-blocker.engine";
export * from "./publication-change-detection.engine";
export * from "./publication-lineage.engine";
export * from "./release-health.engine";
export * from "./publication-reconciliation.engine";

import {
  ContinuousReleaseHealthReport,
  ExpectedPublicationState,
  PublicationAuditEvent,
  PublicationChangeRecord,
  PublicationLineageTrace,
  PublicationReconciliationRecord,
} from "./publication-integrity.types";
import { PublishingTargetPlatform } from "../publishing/publishing.types";
import { CreatorPublishingProvider } from "../publishing/creator-publishing.provider";
import { PublicationReconciliationEngine } from "./publication-reconciliation.engine";
import { ReleaseHealthEngine } from "./release-health.engine";
import { PublicationIntegrityAuditService } from "./publication-integrity.audit";

const globalForPubIntegrity = globalThis as unknown as {
  creatorPublicationIntegrityStore: {
    records: Map<string, PublicationReconciliationRecord[]>;
    healthReports: Map<string, ContinuousReleaseHealthReport>;
  } | undefined;
};

const pubIntegrityStore = globalForPubIntegrity.creatorPublicationIntegrityStore ?? {
  records: new Map<string, PublicationReconciliationRecord[]>(),
  healthReports: new Map<string, ContinuousReleaseHealthReport>(),
};
if (process.env.NODE_ENV !== "production")
  globalForPubIntegrity.creatorPublicationIntegrityStore = pubIntegrityStore;

export class PublicationIntegrityProvider {
  /**
   * Reconciles all active publishing targets for a research run against live observations and returns records + release health.
   */
  static reconcilePublications(
    researchRunId: string,
    userId: string = "anonymous-creator",
    context: any = {}
  ): { records: PublicationReconciliationRecord[]; health: ContinuousReleaseHealthReport } {
    const key = `${userId}:${researchRunId}`;
    const plan = CreatorPublishingProvider.getPublishingPlan(researchRunId, userId);
    const receipts = CreatorPublishingProvider.getReceipts(researchRunId, userId);

    const records: PublicationReconciliationRecord[] = [];
    const platforms: PublishingTargetPlatform[] = ["YOUTUBE_LONG_FORM", "YOUTUBE_SHORTS", "PODCAST"];

    for (const platform of platforms) {
      const target = plan.targets.find((t) => t.platform === platform) || plan.targets[0];
      const receipt = receipts.find((r) => r.platform === platform);

      const expectedState: ExpectedPublicationState = {
        publicationTarget: `Target ${platform} [${researchRunId}]`,
        platform,
        publicationIdentifier: receipt?.externalPublicationId,
        expectedTitle: target.metadata.title,
        expectedDescription: target.metadata.description,
        expectedChapters: target.metadata.chapters,
        expectedTags: target.metadata.tags,
        expectedAssetHash: `ast-hash-${platform.toLowerCase()}`,
        expectedScriptVersion: plan.scriptVersion,
        expectedTimelineFingerprint: plan.timelineFingerprint,
        expectedCertificationId: plan.certificationCertificateId || "CERT-VERIFIED-1",
        expectedReleaseLockId: plan.releaseLockId || "LOCK-VERIFIED-1",
        expectedEvidenceSnapshotHash: plan.evidenceSnapshotHash,
        expectedProjectSnapshotHash: plan.projectSnapshotHash,
        expectedPackageSnapshotHash: plan.exportPackageSnapshotHash,
        expectedVisibility: "PUBLIC",
      };

      const record = PublicationReconciliationEngine.reconcilePublication({
        userId,
        researchRunId,
        targetId: target.targetId,
        planId: plan.planId,
        platform,
        expectedState,
        receipt,
        context: {
          activeSafetyBlockers: context.activeSafetyBlockers,
          isCertificationValid: context.isCertificationValid !== false,
          isReleaseLockValid: context.isReleaseLockValid !== false,
          isExportPackageValid: context.isExportPackageValid !== false,
          isEvidenceSnapshotValid: context.isEvidenceSnapshotValid !== false,
          isProjectSnapshotValid: context.isProjectSnapshotValid !== false,
          isStale: plan.isStale,
        },
      });

      records.push(record);
    }

    const health = ReleaseHealthEngine.evaluateHealth(researchRunId, records, {
      isCertificationValid: context.isCertificationValid !== false,
      isReleaseLockValid: context.isReleaseLockValid !== false,
      isExportPackageValid: context.isExportPackageValid !== false,
      isEvidenceSnapshotValid: context.isEvidenceSnapshotValid !== false,
    });

    pubIntegrityStore.records.set(key, records);
    pubIntegrityStore.healthReports.set(key, health);

    return { records, health };
  }

  /**
   * Retrieves reconciled publication records for a research run.
   */
  static getPublications(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): PublicationReconciliationRecord[] {
    const key = `${userId}:${researchRunId}`;
    let records = pubIntegrityStore.records.get(key);
    if (!records) {
      const res = this.reconcilePublications(researchRunId, userId);
      records = res.records;
    }
    return records;
  }

  /**
   * Retrieves a single publication record by ID.
   */
  static getPublicationById(
    publicationId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): PublicationReconciliationRecord | undefined {
    const records = this.getPublications(researchRunId, userId);
    return records.find((r) => r.publicationId === publicationId);
  }

  /**
   * Retrieves changes for a publication.
   */
  static getChanges(
    publicationId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): PublicationChangeRecord[] {
    const pub = this.getPublicationById(publicationId, researchRunId, userId);
    return pub ? pub.changes : [];
  }

  /**
   * Retrieves lineage for a publication.
   */
  static getLineage(
    publicationId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): PublicationLineageTrace | undefined {
    const pub = this.getPublicationById(publicationId, researchRunId, userId);
    return pub ? pub.lineage : undefined;
  }

  /**
   * Retrieves all currently unverifiable publication states.
   */
  static getUnverifiable(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): Array<{ publicationId: string; platform: string; reason: string }> {
    const records = this.getPublications(researchRunId, userId);
    return records
      .filter((r) => r.isUnverifiable)
      .map((r) => ({
        publicationId: r.publicationId,
        platform: r.platform,
        reason: r.unverifiableReasons.join("; ") || "Platform telemetry unavailable",
      }));
  }

  /**
   * Retrieves the latest release health report.
   */
  static getHealthReport(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ContinuousReleaseHealthReport {
    const key = `${userId}:${researchRunId}`;
    let report = pubIntegrityStore.healthReports.get(key);
    if (!report) {
      const res = this.reconcilePublications(researchRunId, userId);
      report = res.health;
    }
    return report;
  }

  /**
   * Retrieves publication integrity audit history.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): PublicationAuditEvent[] {
    return PublicationIntegrityAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory caches.
   */
  static clearCache(): void {
    pubIntegrityStore.records.clear();
    pubIntegrityStore.healthReports.clear();
    PublicationIntegrityAuditService.clearHistory();
  }
}
