import {
  LaboratoryDataset,
  DatasetIndependenceState,
} from "./cross-lab-regression.types";

export class CrossLabIndependenceEngine {
  public static evaluateDatasetIndependence(
    targetDataset: LaboratoryDataset,
    existingDatasets: LaboratoryDataset[]
  ): {
    state: DatasetIndependenceState;
    duplicateCount: number;
    reason: string;
  } {
    if (existingDatasets.length === 0) {
      return {
        state: "INDEPENDENT",
        duplicateCount: 0,
        reason: "Initial baseline dataset for laboratory.",
      };
    }

    let exactSnapshotDuplicates = 0;
    let matchingObsHashes = 0;

    const targetObsIds = new Set(targetDataset.observations.map((o) => o.observationId));

    for (const existing of existingDatasets) {
      if (existing.datasetId === targetDataset.datasetId) continue;

      if (existing.datasetSnapshotHash === targetDataset.datasetSnapshotHash) {
        exactSnapshotDuplicates++;
      }

      for (const obs of existing.observations) {
        if (targetObsIds.has(obs.observationId)) {
          matchingObsHashes++;
        }
      }
    }

    if (exactSnapshotDuplicates > 0) {
      return {
        state: "DUPLICATE",
        duplicateCount: exactSnapshotDuplicates,
        reason: "Exact dataset snapshot hash already exists in another laboratory submission.",
      };
    }

    if (matchingObsHashes > targetDataset.observations.length * 0.5) {
      return {
        state: "DEPENDENT",
        duplicateCount: matchingObsHashes,
        reason: "Over 50% of observation records match an existing laboratory dataset.",
      };
    }

    if (matchingObsHashes > 0) {
      return {
        state: "POTENTIALLY_DEPENDENT",
        duplicateCount: matchingObsHashes,
        reason: "Partial overlap detected with existing laboratory observations.",
      };
    }

    return {
      state: "INDEPENDENT",
      duplicateCount: 0,
      reason: "Independent physical measurement observations from verified laboratory node.",
    };
  }
}
