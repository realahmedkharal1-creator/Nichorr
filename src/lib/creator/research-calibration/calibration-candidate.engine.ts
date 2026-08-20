import {
  CalibrationCandidate,
  CalibrationCandidateSource,
  CalibrationPriority,
  CalibrationStatus,
} from "./research-calibration.types";
import { AudienceSignalRecord, CreatorPerformanceSnapshot } from "../performance/performance.types";
import { PublicationChangeRecord } from "../publication-integrity/publication-integrity.types";
import { BenchmarkDiffRecord } from "../production-matrix/production-matrix.provider";

export class CalibrationCandidateEngine {
  /**
   * Generates a calibration candidate from an audience signal (factual question, objection, or methodology confusion).
   */
  static fromAudienceSignal(
    researchRunId: string,
    signal: AudienceSignalRecord,
    options: {
      affectedClaimId?: string;
      affectedMethodology?: string;
    } = {}
  ): CalibrationCandidate {
    let source: CalibrationCandidateSource = "AUDIENCE_FACTUAL_QUESTION";
    let priority: CalibrationPriority = "MEDIUM";
    let priorityReason = "Audience raised factual questions regarding research conclusions.";

    if (signal.category === "CORRECTION_OBJECTION") {
      source = "AUDIENCE_OBJECTION";
      priority = signal.frequency > 5 ? "HIGH" : "MEDIUM";
      priorityReason = "Multiple audience members raised objections to stated benchmark/claim.";
    } else if (signal.category === "METHODOLOGY_QUESTION") {
      source = "METHODOLOGY_CONFUSION";
      priority = "MEDIUM";
      priorityReason = "Audience inquired about testing environment and methodology parameters.";
    }

    const candidateId = `cand-aud-${signal.signalId}`;
    return {
      candidateId,
      researchRunId,
      source,
      sourceIdentifier: signal.signalId,
      title: `Audience Feedback Calibration: ${signal.rawText.slice(0, 50)}...`,
      description: `Observed ${signal.frequency} audience reactions related to: "${signal.rawText}"`,
      observation: signal.rawText,
      affectedClaimId: options.affectedClaimId,
      affectedMethodology: options.affectedMethodology,
      observedAt: new Date().toISOString(),
      sampleSize: signal.frequency,
      priority,
      priorityReason,
      upstreamLineage: [
        `Research Run: ${researchRunId}`,
        `Audience Signal: ${signal.signalId} (${signal.category})`,
        `Frequency: ${signal.frequency}`,
      ],
      status: "IDENTIFIED",
    };
  }

  /**
   * Generates a calibration candidate from a retention or performance anomaly.
   */
  static fromPerformanceAnomaly(
    researchRunId: string,
    snapshot: CreatorPerformanceSnapshot,
    anomaly: {
      metricName: string;
      observedDelta: number;
      associatedSection?: string;
      affectedClaimId?: string;
    }
  ): CalibrationCandidate {
    const candidateId = `cand-perf-${snapshot.snapshotId}-${anomaly.metricName.toLowerCase()}`;
    const isCritical = Math.abs(anomaly.observedDelta) > 40;

    return {
      candidateId,
      researchRunId,
      source: "RETENTION_ANOMALY",
      sourceIdentifier: snapshot.snapshotId,
      title: `Performance Anomaly Calibration: ${anomaly.metricName} drop (${anomaly.observedDelta}%)`,
      description: `Significant retention/performance drop of ${anomaly.observedDelta}% detected during ${anomaly.associatedSection || "key section"}.`,
      observation: `Metric ${anomaly.metricName} registered ${anomaly.observedDelta}% deviation from expected baseline.`,
      affectedClaimId: anomaly.affectedClaimId,
      observedAt: snapshot.recordedAt,
      sampleSize: snapshot.metrics.views.value || 100,
      priority: isCritical ? "HIGH" : "MEDIUM",
      priorityReason: `Observed ${anomaly.observedDelta}% retention anomaly in video segment associated with research claims.`,
      upstreamLineage: [
        `Research Run: ${researchRunId}`,
        `Performance Snapshot: ${snapshot.snapshotId}`,
        `Platform: ${snapshot.platform}`,
        `Measurement Window: ${snapshot.measurementWindow}`,
      ],
      status: "IDENTIFIED",
    };
  }

  /**
   * Generates a calibration candidate from a benchmark difference discrepancy.
   */
  static fromBenchmarkDiscrepancy(
    researchRunId: string,
    diffRecord: BenchmarkDiffRecord
  ): CalibrationCandidate {
    const candidateId = `cand-diff-${diffRecord.diffId}`;
    return {
      candidateId,
      researchRunId,
      source: "BENCHMARK_DISCREPANCY",
      sourceIdentifier: diffRecord.diffId,
      title: `Benchmark Diff Calibration: ${diffRecord.benchmarkName}`,
      description: `Discrepancy of ${diffRecord.percentageDelta}% observed between baseline and comparison target.`,
      observation: diffRecord.explanation || `Delta: ${diffRecord.percentageDelta}%`,
      affectedBenchmarkId: diffRecord.baseline.benchmarkSuite,
      observedAt: new Date().toISOString(),
      sampleSize: 50,
      priority: diffRecord.diffState === "CONFLICTED" ? "CRITICAL" : "HIGH",
      priorityReason: `Benchmark measurement divergence (${diffRecord.percentageDelta}%) requires lab re-verification.`,
      upstreamLineage: [
        `Research Run: ${researchRunId}`,
        `Benchmark Suite: ${diffRecord.baseline.benchmarkSuite}`,
        `Diff Record: ${diffRecord.diffId}`,
      ],
      status: "IDENTIFIED",
    };
  }

  /**
   * Generates a calibration candidate from a post-publication change.
   */
  static fromPublicationChange(
    researchRunId: string,
    changeRecord: PublicationChangeRecord
  ): CalibrationCandidate {
    const candidateId = `cand-pubchg-${changeRecord.changeId}`;
    return {
      candidateId,
      researchRunId,
      source: "PUBLICATION_CHANGE",
      sourceIdentifier: changeRecord.changeId,
      title: `Publication Discrepancy Calibration: ${changeRecord.fieldName}`,
      description: `Field ${changeRecord.fieldName} modified post-publication. Action: ${changeRecord.recommendedAction}`,
      observation: `Expected: ${String(changeRecord.expectedValue)}, Observed: ${String(changeRecord.observedValue)}`,
      observedAt: changeRecord.detectedAt,
      sampleSize: 1,
      priority: changeRecord.severity === "CRITICAL" ? "HIGH" : "LOW",
      priorityReason: `Post-publication discrepancy detected on live platform (${changeRecord.fieldName}).`,
      upstreamLineage: [
        `Research Run: ${researchRunId}`,
        `Publication Change: ${changeRecord.changeId}`,
        `Category: ${changeRecord.category}`,
      ],
      status: "IDENTIFIED",
    };
  }
}
