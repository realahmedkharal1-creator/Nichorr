import crypto from "crypto";
import {
  MicroarchitecturalTrace,
  MicroarchitecturalAttributionRecord,
  CrossGenerationalAttributionMatrix,
  MicroarchitecturalOpportunity,
  ResearchHealthReconciliationRecord,
  MicroarchitecturalSnapshot,
} from "./microarchitectural-attribution.types";

export class MicroarchitecturalSnapshotEngine {
  public static createSnapshot(
    userId: string,
    researchRunId: string,
    traces: MicroarchitecturalTrace[],
    attributions: MicroarchitecturalAttributionRecord[],
    comparisons: CrossGenerationalAttributionMatrix[],
    opportunities: MicroarchitecturalOpportunity[],
    reconciliations: ResearchHealthReconciliationRecord[]
  ): MicroarchitecturalSnapshot {
    const validTraces = traces.filter((t) => t.sourceState === "AVAILABLE");

    const stableTraces = [...traces].sort((a, b) => a.traceId.localeCompare(b.traceId));
    const stableAttributions = [...attributions].sort((a, b) => a.attributionId.localeCompare(b.attributionId));
    const stableComparisons = [...comparisons].sort((a, b) => a.comparisonId.localeCompare(b.comparisonId));

    const canonicalState = {
      userId,
      researchRunId,
      traceIds: stableTraces.map((t) => ({ id: t.traceId, hash: t.sourceSnapshotHash, state: t.sourceState })),
      attributions: stableAttributions.map((a) => ({ id: a.attributionId, cat: a.attributionClassification, conf: a.evidenceStrength })),
      comparisons: stableComparisons.map((c) => ({ id: c.comparisonId, delta: c.performanceDeltaPercentage, class: c.classification })),
      opportunityIds: opportunities.map((o) => o.opportunityId).sort(),
      reconciliationCount: reconciliations.length,
    };

    const serialized = JSON.stringify(canonicalState);
    const snapshotHash = crypto.createHash("sha256").update(serialized).digest("hex");
    const snapshotId = `mcas-${snapshotHash.slice(0, 16)}`;

    return {
      snapshotId,
      userId,
      researchRunId,
      traceCount: traces.length,
      validTraceCount: validTraces.length,
      attributionCount: attributions.length,
      comparisonCount: comparisons.length,
      opportunityCount: opportunities.length,
      reconciliationCount: reconciliations.length,
      snapshotHash,
      createdAt: new Date().toISOString(),
    };
  }

  public static isStale(
    snapshot: MicroarchitecturalSnapshot,
    currentSnapshot: MicroarchitecturalSnapshot
  ): boolean {
    return snapshot.snapshotHash !== currentSnapshot.snapshotHash;
  }
}
