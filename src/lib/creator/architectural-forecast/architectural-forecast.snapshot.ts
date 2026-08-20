import crypto from "node:crypto";
import {
  ForecastSnapshot,
  ArchitecturalDegradationMatrix,
  ForecastResearchOpportunity,
} from "./architectural-forecast.types";

export class ArchitecturalForecastSnapshotEngine {
  /**
   * Generates a deterministic snapshot for the architectural forecast & simulation control plane.
   * Volatile timestamps are strictly excluded from hash generation.
   */
  static generateSnapshot(
    researchRunId: string,
    userId: string,
    matrix: ArchitecturalDegradationMatrix,
    opportunities: ForecastResearchOpportunity[],
    projectSnapshotHash: string = "snap-proj-default",
    evidenceSnapshotHash: string = "snap-evid-default",
    siliconRegressionSnapshotHash: string = "snap-srs-default"
  ): ForecastSnapshot {
    const hashPayload = {
      userId,
      researchRunId,
      matrixId: matrix.matrixId,
      forecastsCount: matrix.forecastsCount,
      simulationsCount: matrix.simulationsCount,
      scenariosCount: matrix.scenariosCount,
      opportunitiesCount: opportunities.length,
      staleCount: matrix.staleCount,
      blockedCount: matrix.blockedCount,
      matrixSnapshotHash: matrix.matrixSnapshotHash,
      projectSnapshotHash,
      evidenceSnapshotHash,
      siliconRegressionSnapshotHash,
    };

    const snapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(hashPayload))
      .digest("hex");

    const snapshotId = `afs-${snapshotHash.substring(0, 12)}`;

    return {
      snapshotId,
      snapshotHash,
      userId,
      researchRunId,
      matrixId: matrix.matrixId,
      forecastsCount: matrix.forecastsCount,
      simulationsCount: matrix.simulationsCount,
      scenariosCount: matrix.scenariosCount,
      opportunitiesCount: opportunities.length,
      projectSnapshotHash,
      evidenceSnapshotHash,
      siliconRegressionSnapshotHash,
      isStale: matrix.staleCount > 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
