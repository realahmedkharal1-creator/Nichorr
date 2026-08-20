import crypto from "crypto";
import {
  ResearchHypothesis,
  CompetingHypothesisGroup,
  EvidenceAttachment,
  HypothesisPrediction,
  HypothesisValidationTask,
  HypothesisHealthReconciliation,
  HypothesisSnapshot,
} from "./hypothesis.types";

export class HypothesisSnapshotEngine {
  public static createSnapshot(
    userId: string,
    researchRunId: string,
    hypotheses: ResearchHypothesis[],
    competingGroups: CompetingHypothesisGroup[],
    evidence: EvidenceAttachment[],
    predictions: HypothesisPrediction[],
    validationTasks: HypothesisValidationTask[],
    reconciliations: HypothesisHealthReconciliation[]
  ): HypothesisSnapshot {
    const stableHypotheses = [...hypotheses].sort((a, b) => a.hypothesisId.localeCompare(b.hypothesisId));
    const stableGroups = [...competingGroups].sort((a, b) => a.groupId.localeCompare(b.groupId));
    const stableEvidence = [...evidence].sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));

    const canonicalState = {
      userId,
      researchRunId,
      hypothesisIds: stableHypotheses.map((h) => ({
        id: h.hypothesisId,
        st: h.status,
        conf: h.currentConfidence,
        hash: h.snapshotHash,
      })),
      groupIds: stableGroups.map((g) => g.groupId),
      evidenceIds: stableEvidence.map((e) => ({
        id: e.evidenceId,
        rel: e.relationship,
        src: e.sourceEntityId,
      })),
      predictionCount: predictions.length,
      taskCount: validationTasks.length,
      reconciliationCount: reconciliations.length,
    };

    const serialized = JSON.stringify(canonicalState);
    const snapshotHash = crypto.createHash("sha256").update(serialized).digest("hex");
    const snapshotId = `hyss-${snapshotHash.slice(0, 16)}`;

    return {
      snapshotId,
      userId,
      researchRunId,
      hypothesisCount: hypotheses.length,
      competingGroupCount: competingGroups.length,
      evidenceAttachmentCount: evidence.length,
      predictionCount: predictions.length,
      validationTaskCount: validationTasks.length,
      reconciliationCount: reconciliations.length,
      snapshotHash,
      createdAt: new Date().toISOString(),
    };
  }

  public static isStale(
    snapshot: HypothesisSnapshot,
    currentSnapshot: HypothesisSnapshot
  ): boolean {
    return snapshot.snapshotHash !== currentSnapshot.snapshotHash;
  }
}
