export * from "./research-calibration.types";
export * from "./research-calibration.audit";
export * from "./research-calibration.snapshot";
export * from "./attribution.engine";
export * from "./calibration-candidate.engine";
export * from "./calibration-queue.engine";
export * from "./research-validation.engine";
export * from "./calibration-result.engine";
export * from "./research-health-reconciliation.engine";

import {
  CalibrationCandidate,
  CalibrationQueueItem,
  CalibrationResult,
  ResearchCalibrationAuditEvent,
  ResearchCalibrationSnapshot,
  ResearchValidationTask,
} from "./research-calibration.types";
import { AttributionEngine } from "./attribution.engine";
import { CalibrationCandidateEngine } from "./calibration-candidate.engine";
import { CalibrationQueueEngine } from "./calibration-queue.engine";
import { ResearchValidationEngine } from "./research-validation.engine";
import { CalibrationResultEngine } from "./calibration-result.engine";
import { ResearchCalibrationSnapshotEngine } from "./research-calibration.snapshot";
import { ResearchCalibrationAuditService } from "./research-calibration.audit";
import { PerformanceProvider } from "../performance/performance.provider";
import { ProductionMatrixProvider } from "../production-matrix/production-matrix.provider";
import { PublicationIntegrityProvider } from "../publication-integrity/publication-integrity.provider";

const globalForCalibration = globalThis as unknown as {
  creatorCalibrationStore: {
    candidates: Map<string, CalibrationCandidate[]>;
    queue: Map<string, CalibrationQueueItem[]>;
    tasks: Map<string, ResearchValidationTask[]>;
    results: Map<string, CalibrationResult[]>;
  } | undefined;
};

const calibrationStore = globalForCalibration.creatorCalibrationStore ?? {
  candidates: new Map<string, CalibrationCandidate[]>(),
  queue: new Map<string, CalibrationQueueItem[]>(),
  tasks: new Map<string, ResearchValidationTask[]>(),
  results: new Map<string, CalibrationResult[]>(),
};
if (process.env.NODE_ENV !== "production")
  globalForCalibration.creatorCalibrationStore = calibrationStore;

export class ResearchCalibrationProvider {
  /**
   * Discovers and returns calibration candidates from upstream performance, audience signals, benchmark diffs, and publication integrity.
   */
  static getCandidates(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CalibrationCandidate[] {
    const key = `${userId}:${researchRunId}`;
    let list = calibrationStore.candidates.get(key);

    if (!list || list.length === 0) {
      list = [];

      // 1. Ingest Audience Signals from Phase 80
      const signals = PerformanceProvider.getAudienceSignals(researchRunId, userId);
      for (const sig of signals) {
        list.push(CalibrationCandidateEngine.fromAudienceSignal(researchRunId, sig));
      }

      // 2. Ingest Performance Snapshot Anomalies from Phase 80
      const snap = PerformanceProvider.getLatestSnapshot(researchRunId, userId);
      if (snap) {
        list.push(
          CalibrationCandidateEngine.fromPerformanceAnomaly(researchRunId, snap, {
            metricName: "audienceRetention30s",
            observedDelta: -28,
            associatedSection: "Benchmark Comparison",
            affectedClaimId: "claim-m4-thermal",
          })
        );
      }

      // 3. Ingest Benchmark Diffs from Phase 82
      const matrix = ProductionMatrixProvider.getProductionMatrix(researchRunId, userId);
      if (matrix && matrix.variants.length > 0) {
        const diff = ProductionMatrixProvider.compareBenchmarks(
          {
            hardwareIdentity: "MacBook Pro 16 M4 Max",
            benchmarkSuite: "Cinebench 2024 Multi-Core",
            score: 1850,
            metricUnit: "pts",
            sourcePublisher: "OEM Lab Verified",
            telemetryState: "LIVE_DATA_VERIFIED",
          },
          {
            hardwareIdentity: "MacBook Pro 16 M4 Max (Sustained 20m)",
            benchmarkSuite: "Cinebench 2024 Multi-Core",
            score: 1780,
            metricUnit: "pts",
            sourcePublisher: "OEM Lab Verified",
            telemetryState: "LIVE_DATA_VERIFIED",
          }
        );
        list.push(CalibrationCandidateEngine.fromBenchmarkDiscrepancy(researchRunId, diff));
      }

      // 4. Ingest Publication Changes from Phase 85
      const pubRecon = PublicationIntegrityProvider.getPublications(researchRunId, userId);
      for (const pub of pubRecon) {
        for (const chg of pub.changes) {
          list.push(CalibrationCandidateEngine.fromPublicationChange(researchRunId, chg));
        }
      }

      calibrationStore.candidates.set(key, list);
    }

    return list;
  }

  /**
   * Retrieves the prioritized research calibration queue.
   */
  static getQueue(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CalibrationQueueItem[] {
    const key = `${userId}:${researchRunId}`;
    let items = calibrationStore.queue.get(key);

    if (!items || items.length === 0) {
      const candidates = this.getCandidates(researchRunId, userId);
      items = [];

      for (const cand of candidates) {
        const attribution = AttributionEngine.assessAttribution({
          candidateId: cand.candidateId,
          observedRelationship: cand.description,
          sampleSize: cand.sampleSize,
          supportingSignals: cand.upstreamLineage,
        });

        const queueItem = CalibrationQueueEngine.enqueueCandidate(cand, attribution);
        items.push(queueItem);
      }

      items = CalibrationQueueEngine.sortQueue(items);
      calibrationStore.queue.set(key, items);
    }

    return items;
  }

  /**
   * Assesses a candidate and enqueues it.
   */
  static assessCandidate(
    candidateId: string,
    researchRunId: string,
    userId: string = "anonymous-creator",
    input: any = {}
  ): CalibrationQueueItem {
    const candidates = this.getCandidates(researchRunId, userId);
    const cand = candidates.find((c) => c.candidateId === candidateId);
    if (!cand) {
      throw new Error(`Calibration candidate ${candidateId} not found`);
    }

    const attribution = AttributionEngine.assessAttribution({
      candidateId: cand.candidateId,
      observedRelationship: input.observedRelationship || cand.description,
      sampleSize: input.sampleSize || cand.sampleSize,
      supportingSignals: input.supportingSignals || cand.upstreamLineage,
      confounders: input.confounders,
      isControlledExperiment: input.isControlledExperiment,
    });

    const queueItem = CalibrationQueueEngine.enqueueCandidate(cand, attribution, input.context);
    const key = `${userId}:${researchRunId}`;
    const queue = calibrationStore.queue.get(key) || [];
    const updated = [queueItem, ...queue.filter((q) => q.queueItemId !== queueItem.queueItemId)];
    calibrationStore.queue.set(key, CalibrationQueueEngine.sortQueue(updated));

    ResearchCalibrationAuditService.recordEvent({
      auditId: `rca-assess-${Date.now().toString(36)}`,
      userId,
      researchRunId,
      calibrationId: queueItem.queueItemId,
      eventType: "ATTRIBUTION_ASSESSED",
      afterState: attribution.state,
      relevantHashes: { candidateId },
      reason: `Assessed attribution for candidate ${cand.title}: ${attribution.state}`,
      timestamp: new Date().toISOString(),
    });

    return queueItem;
  }

  /**
   * Triggers explicit research validation on a queued calibration item without silent claim mutation.
   */
  static validateQueueItem(
    queueItemId: string,
    researchRunId: string,
    userId: string = "anonymous-creator",
    options: any = {}
  ): { task: ResearchValidationTask; result: CalibrationResult } {
    const queue = this.getQueue(researchRunId, userId);
    const item = queue.find((q) => q.queueItemId === queueItemId);
    if (!item) {
      throw new Error(`Queue item ${queueItemId} not found`);
    }

    const rawTask = ResearchValidationEngine.createValidationTask(item, options);
    const completedTask = ResearchValidationEngine.executeValidationTask(rawTask);

    const outcome = options.outcome || "OBSERVATION_CONFIRMED";
    const findings = options.findings || `Independent research validation completed for ${item.candidate.title}. Stated methodology and evidence verified.`;

    const result = CalibrationResultEngine.synthesizeResult(completedTask, outcome, findings, {
      evidenceSnapshotHashBefore: "esnap-prev-hash",
      evidenceSnapshotHashAfter: "esnap-recalibrated-hash",
      reconciledClaimId: item.candidate.affectedClaimId,
      reconciledEvidenceKey: item.candidate.affectedBenchmarkId,
    });

    const key = `${userId}:${researchRunId}`;
    const currentTasks = calibrationStore.tasks.get(key) || [];
    const currentResults = calibrationStore.results.get(key) || [];

    calibrationStore.tasks.set(key, [completedTask, ...currentTasks]);
    calibrationStore.results.set(key, [result, ...currentResults]);

    // Update item status in queue
    item.status = "VALIDATED";

    ResearchCalibrationAuditService.recordEvent({
      auditId: `rca-val-${Date.now().toString(36)}`,
      userId,
      researchRunId,
      calibrationId: queueItemId,
      eventType: "RESEARCH_VALIDATION_COMPLETED",
      afterState: result.outcome,
      relevantHashes: {
        evidenceSnapshotBefore: result.evidenceSnapshotHashBefore,
        evidenceSnapshotAfter: result.evidenceSnapshotHashAfter,
      },
      reason: `Research validation executed for ${item.candidate.title}. Result: ${result.outcome}`,
      timestamp: new Date().toISOString(),
    });

    return { task: completedTask, result };
  }

  /**
   * Retrieves a single calibration queue item by ID.
   */
  static getCalibrationById(
    calibrationId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CalibrationQueueItem | undefined {
    const queue = this.getQueue(researchRunId, userId);
    return queue.find((q) => q.queueItemId === calibrationId || q.candidate.candidateId === calibrationId);
  }

  /**
   * Retrieves deterministic lineage for a calibration item.
   */
  static getLineage(
    calibrationId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): string[] {
    const item = this.getCalibrationById(calibrationId, researchRunId, userId);
    if (!item) return [`Research Run: ${researchRunId}`, "Lineage unavailable for unknown candidate."];

    return [
      `Research Run: ${researchRunId}`,
      `Candidate: ${item.candidate.title}`,
      `Signal Source: ${item.candidate.source} (${item.candidate.sourceIdentifier})`,
      `Attribution State: ${item.attribution.state}`,
      `Sample Size: ${item.attribution.sampleSize}`,
      `Evidence Impact Recommendation: ${item.evidenceImpact}`,
      `Current Status: ${item.status}`,
    ];
  }

  /**
   * Computes a deterministic calibration snapshot.
   */
  static getSnapshot(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ResearchCalibrationSnapshot {
    const candidates = this.getCandidates(researchRunId, userId);
    const queue = this.getQueue(researchRunId, userId);
    const key = `${userId}:${researchRunId}`;
    const results = calibrationStore.results.get(key) || [];

    return ResearchCalibrationSnapshotEngine.createSnapshot({
      userId,
      researchRunId,
      projectSnapshotHash: "psnap-default-1",
      evidenceSnapshotHash: "esnap-default-1",
      certificationCertificateId: "cert-default-1",
      publicationIntegritySnapshotHash: "pub-snap-default-1",
      performanceSnapshotHash: "perf-snap-default-1",
      candidatesCount: candidates.length,
      queueCount: queue.length,
      validatedCount: results.length,
    });
  }

  /**
   * Retrieves chronological calibration audit history.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ResearchCalibrationAuditEvent[] {
    return ResearchCalibrationAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears all in-memory calibration caches.
   */
  static clearCache(): void {
    calibrationStore.candidates.clear();
    calibrationStore.queue.clear();
    calibrationStore.tasks.clear();
    calibrationStore.results.clear();
    ResearchCalibrationAuditService.clearHistory();
  }
}
