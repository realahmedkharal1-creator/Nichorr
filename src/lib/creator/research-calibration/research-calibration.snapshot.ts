import { ResearchCalibrationSnapshot } from "./research-calibration.types";

export class ResearchCalibrationSnapshotEngine {
  /**
   * Computes a deterministic calibration snapshot hash excluding volatile timestamps.
   */
  static computeDeterministicSnapshotHash(params: {
    userId: string;
    researchRunId: string;
    projectSnapshotHash: string;
    evidenceSnapshotHash: string;
    certificationCertificateId: string;
    publicationIntegritySnapshotHash: string;
    performanceSnapshotHash: string;
    candidatesCount: number;
    queueCount: number;
    validatedCount: number;
  }): string {
    const raw = [
      params.userId,
      params.researchRunId,
      params.projectSnapshotHash,
      params.evidenceSnapshotHash,
      params.certificationCertificateId,
      params.publicationIntegritySnapshotHash,
      params.performanceSnapshotHash,
      `cand:${params.candidatesCount}`,
      `q:${params.queueCount}`,
      `val:${params.validatedCount}`,
    ].join("::");

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `rcsnap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Creates a frozen deterministic calibration snapshot.
   */
  static createSnapshot(params: {
    userId: string;
    researchRunId: string;
    projectSnapshotHash: string;
    evidenceSnapshotHash: string;
    certificationCertificateId: string;
    publicationIntegritySnapshotHash: string;
    performanceSnapshotHash: string;
    candidatesCount: number;
    queueCount: number;
    validatedCount: number;
  }): ResearchCalibrationSnapshot {
    const snapshotHash = this.computeDeterministicSnapshotHash(params);
    const nowStr = new Date().toISOString();

    return Object.freeze({
      snapshotId: `rcs-${params.researchRunId}-${Date.now().toString(36)}`,
      researchRunId: params.researchRunId,
      userId: params.userId,
      projectSnapshotHash: params.projectSnapshotHash,
      evidenceSnapshotHash: params.evidenceSnapshotHash,
      certificationCertificateId: params.certificationCertificateId,
      publicationIntegritySnapshotHash: params.publicationIntegritySnapshotHash,
      performanceSnapshotHash: params.performanceSnapshotHash,
      candidatesCount: params.candidatesCount,
      queueCount: params.queueCount,
      validatedCount: params.validatedCount,
      snapshotHash,
      createdAt: nowStr,
    });
  }
}
