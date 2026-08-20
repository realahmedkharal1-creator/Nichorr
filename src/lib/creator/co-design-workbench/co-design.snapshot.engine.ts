import crypto from "crypto";
import {
  CoDesignScenario,
  EmpiricalBaseline,
  CoDesignSimulationResult,
  EmpiricalAlignmentRecord,
  CoDesignOpportunity,
  CoDesignHealthReconciliationRecord,
  CoDesignSnapshot,
} from "./co-design.types";

export class CoDesignSnapshotEngine {
  public static createSnapshot(
    userId: string,
    researchRunId: string,
    scenarios: CoDesignScenario[],
    baselines: EmpiricalBaseline[],
    simulations: CoDesignSimulationResult[],
    alignments: EmpiricalAlignmentRecord[],
    opportunities: CoDesignOpportunity[],
    reconciliations: CoDesignHealthReconciliationRecord[]
  ): CoDesignSnapshot {
    const stableScenarios = [...scenarios].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId));
    const stableBaselines = [...baselines].sort((a, b) => a.baselineId.localeCompare(b.baselineId));
    const stableSimulations = [...simulations].sort((a, b) => a.simulationId.localeCompare(b.simulationId));

    const canonicalState = {
      userId,
      researchRunId,
      scenarioIds: stableScenarios.map((s) => ({ id: s.scenarioId, fp: s.scenarioFingerprint, rev: s.revision })),
      baselineIds: stableBaselines.map((b) => ({ id: b.baselineId, hash: b.sourceSnapshotHash })),
      simulationIds: stableSimulations.map((s) => ({ id: s.simulationId, score: s.simulatedScoreFPS, model: s.modelVersion })),
      alignmentCount: alignments.length,
      opportunityIds: opportunities.map((o) => o.opportunityId).sort(),
      reconciliationCount: reconciliations.length,
    };

    const serialized = JSON.stringify(canonicalState);
    const snapshotHash = crypto.createHash("sha256").update(serialized).digest("hex");
    const snapshotId = `cdss-${snapshotHash.slice(0, 16)}`;

    return {
      snapshotId,
      userId,
      researchRunId,
      scenarioCount: scenarios.length,
      baselineCount: baselines.length,
      simulationCount: simulations.length,
      alignmentCount: alignments.length,
      opportunityCount: opportunities.length,
      reconciliationCount: reconciliations.length,
      snapshotHash,
      createdAt: new Date().toISOString(),
    };
  }

  public static isStale(
    snapshot: CoDesignSnapshot,
    currentSnapshot: CoDesignSnapshot
  ): boolean {
    return snapshot.snapshotHash !== currentSnapshot.snapshotHash;
  }
}
