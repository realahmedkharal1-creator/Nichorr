import {
  ObservedPublicationState,
  PublicationIntegritySnapshot,
  ReconciliationStatus,
} from "./publication-integrity.types";
import { PublishingTargetPlatform } from "../publishing/publishing.types";

export class PublicationIntegritySnapshotEngine {
  /**
   * Computes a deterministic snapshot hash excluding volatile timestamps.
   */
  static computeDeterministicSnapshotHash(params: {
    userId: string;
    researchRunId: string;
    projectSnapshotHash: string;
    evidenceSnapshotHash: string;
    scriptVersion: number;
    certificationCertificateId: string;
    releaseLockId: string;
    exportPackageId: string;
    distributionReceiptId: string;
    platform: PublishingTargetPlatform;
    publicationTarget: string;
    publicationIdentifier?: string;
    assetFingerprint: string;
    metadataFingerprint: string;
    reconciliationStatus: ReconciliationStatus;
  }): string {
    const raw = [
      params.userId,
      params.researchRunId,
      params.projectSnapshotHash,
      params.evidenceSnapshotHash,
      `v${params.scriptVersion}`,
      params.certificationCertificateId,
      params.releaseLockId,
      params.exportPackageId,
      params.distributionReceiptId,
      params.platform,
      params.publicationTarget,
      params.publicationIdentifier || "no-id",
      params.assetFingerprint,
      params.metadataFingerprint,
      params.reconciliationStatus,
    ].join("::");

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `pisnap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Creates a deterministic publication integrity snapshot.
   */
  static createSnapshot(params: {
    userId: string;
    researchRunId: string;
    projectSnapshotHash: string;
    evidenceSnapshotHash: string;
    scriptVersion: number;
    certificationCertificateId: string;
    releaseLockId: string;
    exportPackageId: string;
    distributionReceiptId: string;
    platform: PublishingTargetPlatform;
    publicationTarget: string;
    publicationIdentifier?: string;
    observedState: ObservedPublicationState;
    observedMetadata: Record<string, any>;
    assetFingerprint: string;
    metadataFingerprint: string;
    reconciliationStatus: ReconciliationStatus;
  }): PublicationIntegritySnapshot {
    const snapshotHash = this.computeDeterministicSnapshotHash(params);
    const nowStr = new Date().toISOString();

    return Object.freeze({
      snapshotId: `pis-${params.platform.toLowerCase()}-${Date.now().toString(36)}`,
      researchRunId: params.researchRunId,
      userId: params.userId,
      projectSnapshotHash: params.projectSnapshotHash,
      evidenceSnapshotHash: params.evidenceSnapshotHash,
      scriptVersion: params.scriptVersion,
      certificationCertificateId: params.certificationCertificateId,
      releaseLockId: params.releaseLockId,
      exportPackageId: params.exportPackageId,
      distributionReceiptId: params.distributionReceiptId,
      platform: params.platform,
      publicationTarget: params.publicationTarget,
      publicationIdentifier: params.publicationIdentifier,
      observedState: params.observedState,
      observedMetadata: params.observedMetadata,
      assetFingerprint: params.assetFingerprint,
      metadataFingerprint: params.metadataFingerprint,
      reconciliationStatus: params.reconciliationStatus,
      snapshotHash,
      createdAt: nowStr,
    });
  }
}
