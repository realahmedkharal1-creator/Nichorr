import crypto from "node:crypto";
import {
  SiliconRegressionSnapshot,
  SiliconRegressionMatrix,
  RegressionResearchOpportunity,
} from "./silicon-regression.types";

export class SiliconRegressionSnapshotEngine {
  /**
   * Generates a deterministic snapshot for the silicon regression control plane.
   * Strictly excludes volatile timestamps from hash computation.
   */
  static generateSnapshot(
    researchRunId: string,
    userId: string,
    matrix: SiliconRegressionMatrix,
    opportunities: RegressionResearchOpportunity[],
    projectSnapshotHash: string = "snap-proj-default",
    evidenceSnapshotHash: string = "snap-evid-default"
  ): SiliconRegressionSnapshot {
    const hashPayload = {
      userId,
      researchRunId,
      matrixId: matrix.matrixId,
      seriesCount: matrix.series.length,
      pairsCount: matrix.pairs.length,
      regressionsCount: matrix.detectedRegressionsCount,
      improvementsCount: matrix.detectedImprovementsCount,
      confoundedCount: matrix.confoundedCount,
      contradictedCount: matrix.contradictedCount,
      opportunitiesCount: opportunities.length,
      matrixSnapshotHash: matrix.matrixSnapshotHash,
      projectSnapshotHash,
      evidenceSnapshotHash,
      isStale: matrix.isStale,
    };

    const snapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(hashPayload))
      .digest("hex");

    const snapshotId = `srs-${snapshotHash.substring(0, 12)}`;

    return {
      snapshotId,
      snapshotHash,
      userId,
      researchRunId,
      matrixId: matrix.matrixId,
      seriesCount: matrix.series.length,
      pairsCount: matrix.pairs.length,
      regressionsCount: matrix.detectedRegressionsCount,
      improvementsCount: matrix.detectedImprovementsCount,
      confoundedCount: matrix.confoundedCount,
      opportunitiesCount: opportunities.length,
      projectSnapshotHash,
      evidenceSnapshotHash,
      isStale: matrix.isStale,
      generatedAt: new Date().toISOString(),
    };
  }
}
