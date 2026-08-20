import {
  AttributionAssessment,
  CalibrationCandidate,
  CalibrationPriority,
  CalibrationQueueItem,
  CalibrationStatus,
  EvidenceImpactRecommendation,
} from "./research-calibration.types";

export interface QueueEvaluationContext {
  activeBlockers?: string[];
  isEvidenceSnapshotValid?: boolean;
  isCertificationValid?: boolean;
  isReleaseLockValid?: boolean;
  isStale?: boolean;
}

export class CalibrationQueueEngine {
  /**
   * Evaluates the recommended evidence impact for a candidate and its attribution assessment.
   */
  static evaluateEvidenceImpact(
    candidate: CalibrationCandidate,
    attribution: AttributionAssessment
  ): EvidenceImpactRecommendation {
    if (candidate.source === "BENCHMARK_DISCREPANCY" && attribution.state === "SUPPORTED_BY_MULTIPLE_SIGNALS") {
      return "CLAIM_REVALIDATION_RECOMMENDED";
    }
    if (candidate.source === "METHODOLOGY_CONFUSION" || candidate.affectedMethodology) {
      return "METHODOLOGY_REVIEW_RECOMMENDED";
    }
    if (candidate.source === "EVIDENCE_FRESHNESS_WARNING") {
      return "EVIDENCE_REFRESH_RECOMMENDED";
    }
    if (candidate.source === "AUDIENCE_OBJECTION" && attribution.sampleSize > 10) {
      return "SOURCE_RECHECK_RECOMMENDED";
    }
    if (candidate.source === "RETENTION_ANOMALY" && attribution.state === "CORRELATED") {
      return "REVIEW_RECOMMENDED";
    }
    return "REVIEW_RECOMMENDED";
  }

  /**
   * Enqueues and prioritizes a calibration candidate into the evidence-bound research calibration queue.
   */
  static enqueueCandidate(
    candidate: CalibrationCandidate,
    attribution: AttributionAssessment,
    context: QueueEvaluationContext = {}
  ): CalibrationQueueItem {
    const queueItemId = `cq-${candidate.candidateId}`;
    const blockers: string[] = [];

    // 1. Evaluate Hard Blockers (Section 17)
    if (context.activeBlockers && context.activeBlockers.length > 0) {
      blockers.push(...context.activeBlockers);
    }
    if (context.isEvidenceSnapshotValid === false) {
      blockers.push("EVIDENCE_SNAPSHOT_MISMATCH: Upstream evidence graph mutated");
    }
    if (context.isCertificationValid === false) {
      blockers.push("CERTIFICATION_INVALIDATED: Certificate invalid or broken");
    }
    if (context.isReleaseLockValid === false) {
      blockers.push("RELEASE_LOCK_INVALIDATED: Release lock mismatched");
    }

    let status: CalibrationStatus = "QUEUED";
    let evidenceImpact = this.evaluateEvidenceImpact(candidate, attribution);

    if (blockers.length > 0) {
      status = "BLOCKED";
      evidenceImpact = "BLOCKED";
    } else if (context.isStale) {
      status = "STALE";
    }

    return {
      queueItemId,
      candidate,
      attribution,
      priority: candidate.priority,
      evidenceImpact,
      status,
      blockers,
      isStale: !!context.isStale,
      queuedAt: new Date().toISOString(),
    };
  }

  /**
   * Sorts the calibration queue by explainable priority order (CRITICAL > HIGH > MEDIUM > LOW > INFORMATIONAL).
   */
  static sortQueue(items: CalibrationQueueItem[]): CalibrationQueueItem[] {
    const priorityWeight: Record<CalibrationPriority, number> = {
      CRITICAL: 5,
      HIGH: 4,
      MEDIUM: 3,
      LOW: 2,
      INFORMATIONAL: 1,
    };

    return [...items].sort((a, b) => {
      // Unblocked items first, then priority weight
      if (a.status === "BLOCKED" && b.status !== "BLOCKED") return 1;
      if (b.status === "BLOCKED" && a.status !== "BLOCKED") return -1;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }
}
