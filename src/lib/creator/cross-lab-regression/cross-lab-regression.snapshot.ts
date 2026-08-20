import crypto from "crypto";
import {
  LaboratoryDataset,
  LongitudinalSiliconSeries,
  CrossLabSynthesisMatrix,
  CrossLabValidationOpportunity,
  VerifiedResearchLedgerEntry,
  CrossLabRegressionSnapshot,
} from "./cross-lab-regression.types";

export class CrossLabRegressionSnapshotEngine {
  public static createSnapshot(
    userId: string,
    researchRunId: string,
    laboratoriesCount: number,
    clustersCount: number,
    datasets: LaboratoryDataset[],
    series: LongitudinalSiliconSeries[],
    matrix: CrossLabSynthesisMatrix,
    opportunities: CrossLabValidationOpportunity[],
    ledgerEntries: VerifiedResearchLedgerEntry[]
  ): CrossLabRegressionSnapshot {
    const totalObservations = datasets.reduce((sum, d) => sum + d.observations.length, 0);
    const independentObservations = datasets
      .filter((d) => d.independenceState === "INDEPENDENT")
      .reduce((sum, d) => sum + d.observations.length, 0);

    const stableDatasets = [...datasets].sort((a, b) => a.datasetId.localeCompare(b.datasetId));
    const stableSeries = [...series].sort((a, b) => a.seriesId.localeCompare(b.seriesId));
    const stableLedger = [...ledgerEntries].sort((a, b) => a.ledgerEntryId.localeCompare(b.ledgerEntryId));

    const canonicalState = {
      userId,
      researchRunId,
      laboratoriesCount,
      clustersCount,
      datasetIds: stableDatasets.map((d) => ({
        id: d.datasetId,
        hash: d.datasetSnapshotHash,
        obsCount: d.observations.length,
      })),
      seriesSummaries: stableSeries.map((s) => ({
        id: s.seriesId,
        sku: s.sku,
        drift: s.driftClassification,
        baseline: s.baselineScore,
        latest: s.latestScore,
      })),
      matrixSummary: {
        totalComparisonsCount: matrix.totalComparisonsCount,
        repeatedRegressionsCount: matrix.repeatedRegressionsCount,
        repeatedImprovementsCount: matrix.repeatedImprovementsCount,
        contradictionsCount: matrix.contradictionsCount,
        confoundedCount: matrix.confoundedCount,
      },
      opportunityIds: opportunities.map((o) => o.opportunityId).sort(),
      ledgerEntryIds: stableLedger.map((l) => l.ledgerEntryId),
    };

    const serialized = JSON.stringify(canonicalState);
    const snapshotHash = crypto.createHash("sha256").update(serialized).digest("hex");
    const snapshotId = `clrs-${snapshotHash.slice(0, 16)}`;

    return {
      snapshotId,
      userId,
      researchRunId,
      laboratoryCount: laboratoriesCount,
      clusterCount: clustersCount,
      observationCount: totalObservations,
      independentObservationCount: independentObservations,
      seriesCount: series.length,
      regressionCount: matrix.repeatedRegressionsCount,
      improvementCount: matrix.repeatedImprovementsCount,
      contradictionCount: matrix.contradictionsCount,
      confoundedCount: matrix.confoundedCount,
      opportunityCount: opportunities.length,
      ledgerEntryCount: ledgerEntries.length,
      snapshotHash,
      createdAt: new Date().toISOString(),
    };
  }

  public static isStale(
    snapshot: CrossLabRegressionSnapshot,
    currentSnapshot: CrossLabRegressionSnapshot
  ): boolean {
    return snapshot.snapshotHash !== currentSnapshot.snapshotHash;
  }
}
