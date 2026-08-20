import {
  CreatorPerformanceSnapshot,
  PerformanceMetricItem,
} from "./performance.types";
import { PerformanceAuditService } from "./performance-audit.service";

export class PerformanceSnapshotEngine {
  /**
   * Generates a deterministic hash for a performance snapshot excluding volatile timestamps.
   */
  static generatePerformanceSnapshotHash(
    researchRunId: string,
    projectSnapshotHash: string,
    evidenceSnapshotHash: string,
    scriptVersion: number,
    platform: string,
    contentIdentifier: string,
    measurementWindow: string,
    metrics: Record<string, PerformanceMetricItem | undefined>
  ): string {
    const keys = Object.keys(metrics).sort();
    const metricSummary = keys
      .map((k) => {
        const item = metrics[k];
        return item ? `${k}:${item.value}:${item.availability}` : `${k}:null`;
      })
      .join("|");

    const raw = `${researchRunId}:${projectSnapshotHash}:${evidenceSnapshotHash}:${scriptVersion}:${platform}:${contentIdentifier}:${measurementWindow}:${metricSummary}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `perf-snap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Constructs an authoritative performance snapshot from observed or imported metrics.
   */
  static createSnapshot(
    researchRunId: string,
    projectSnapshotHash: string,
    evidenceSnapshotHash: string,
    scriptVersion: number,
    platform: 'YOUTUBE_LONG_FORM' | 'YOUTUBE_SHORTS' | 'PODCAST',
    contentIdentifier: string,
    measurementWindow: string,
    publicationTimestamp: string,
    metrics: CreatorPerformanceSnapshot['metrics'],
    certificationCertificateId?: string,
    distributionPackageId?: string,
    userId: string = "anonymous-creator"
  ): CreatorPerformanceSnapshot {
    const snapshotHash = this.generatePerformanceSnapshotHash(
      researchRunId,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      platform,
      contentIdentifier,
      measurementWindow,
      metrics
    );

    const nowStr = new Date().toISOString();
    const snapshotId = `psnap-${researchRunId}-${platform}-${measurementWindow}-${Date.now().toString(36)}`;

    const snapshot: CreatorPerformanceSnapshot = {
      snapshotId,
      userId,
      researchRunId,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      certificationCertificateId,
      distributionPackageId,
      platform,
      contentIdentifier,
      measurementWindow,
      publicationTimestamp,
      metrics,
      snapshotHash,
      recordedAt: nowStr,
    };

    PerformanceAuditService.recordAuditEvent({
      auditId: `perf-aud-${Date.now().toString(36)}-snap`,
      userId,
      researchRunId,
      action: 'SNAPSHOT_RECORDED',
      details: `Performance Snapshot recorded for ${platform} (${measurementWindow}). Views: ${metrics.views?.value || 0} (${metrics.views?.availability}). Hash: ${snapshotHash}`,
      timestamp: nowStr,
    });

    return snapshot;
  }
}
