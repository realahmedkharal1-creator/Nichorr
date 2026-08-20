import crypto from "crypto";
import {
  HardwareExecutionTrace,
  BottleneckAttributionRecord,
  CrossGenerationComparison,
  PhysicalReconciliationRecord,
  LedgerReconciliationRecord,
  MicroarchitectureResearchOpportunity,
  MicroarchitectureSnapshot,
} from "./microarchitecture.types";

export class MicroarchitectureSnapshotEngine {
  public static createSnapshot(
    userId: string,
    researchRunId: string,
    traces: HardwareExecutionTrace[],
    attributions: BottleneckAttributionRecord[],
    comparisons: CrossGenerationComparison[],
    physicalReconciliations: PhysicalReconciliationRecord[],
    ledgerReconciliations: LedgerReconciliationRecord[],
    opportunities: MicroarchitectureResearchOpportunity[]
  ): MicroarchitectureSnapshot {
    const validTraces = traces.filter((t) => t.sourceState === "AVAILABLE");
    const rejectedTraces = traces.filter((t) => t.sourceState === "INVALID" || t.sourceState === "TRACE_UNAVAILABLE");

    const stableTraces = [...traces].sort((a, b) => a.traceId.localeCompare(b.traceId));
    const stableAttributions = [...attributions].sort((a, b) => a.attributionId.localeCompare(b.attributionId));
    const stableComparisons = [...comparisons].sort((a, b) => a.comparisonId.localeCompare(b.comparisonId));

    const canonicalState = {
      userId,
      researchRunId,
      traceIds: stableTraces.map((t) => ({ id: t.traceId, hash: t.sourceSnapshotHash, state: t.sourceState })),
      attributions: stableAttributions.map((a) => ({ id: a.attributionId, type: a.attributionType, conf: a.confidence })),
      comparisons: stableComparisons.map((c) => ({ id: c.comparisonId, delta: c.performanceDeltaPercentage, class: c.classification })),
      physicalReconciliationCount: physicalReconciliations.length,
      ledgerReconciliationCount: ledgerReconciliations.length,
      opportunityIds: opportunities.map((o) => o.opportunityId).sort(),
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
      rejectedTraceCount: rejectedTraces.length,
      attributionCount: attributions.length,
      comparisonCount: comparisons.length,
      physicalReconciliationCount: physicalReconciliations.length,
      ledgerReconciliationCount: ledgerReconciliations.length,
      opportunityCount: opportunities.length,
      snapshotHash,
      createdAt: new Date().toISOString(),
    };
  }

  public static isStale(
    snapshot: MicroarchitectureSnapshot,
    currentSnapshot: MicroarchitectureSnapshot
  ): boolean {
    return snapshot.snapshotHash !== currentSnapshot.snapshotHash;
  }
}
