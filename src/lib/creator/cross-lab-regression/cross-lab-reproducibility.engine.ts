import crypto from "crypto";
import {
  LaboratoryDataset,
  CrossLabReproducibilityReport,
} from "./cross-lab-regression.types";

export class CrossLabReproducibilityEngine {
  public static evaluateReproducibility(
    userId: string,
    researchRunId: string,
    datasets: LaboratoryDataset[]
  ): CrossLabReproducibilityReport {
    const totalLaboratoriesCount = Array.from(
      new Set(datasets.map((d) => d.laboratoryId))
    ).length;

    const independentDatasets = datasets.filter(
      (d) => d.independenceState === "INDEPENDENT"
    );
    const independentObservationsCount = independentDatasets.reduce(
      (sum, d) => sum + d.observations.length,
      0
    );

    const excludedDatasets: string[] = [];
    const exclusionReasons: string[] = [];

    for (const d of datasets) {
      if (d.independenceState === "DUPLICATE") {
        excludedDatasets.push(d.datasetId);
        exclusionReasons.push(`Dataset ${d.name} (${d.datasetId}) excluded: Exact duplicate of another submission.`);
      } else if (d.independenceState === "DEPENDENT") {
        excludedDatasets.push(d.datasetId);
        exclusionReasons.push(`Dataset ${d.name} (${d.datasetId}) excluded: High dependency on existing observation set.`);
      }
    }

    const matchedLaboratoriesCount = Array.from(
      new Set(independentDatasets.map((d) => d.laboratoryId))
    ).length;

    const baseScore = totalLaboratoriesCount > 0
      ? (matchedLaboratoriesCount / totalLaboratoriesCount) * 100
      : 100;
    const consistencyScore = Number(Math.max(0, Math.min(100, baseScore)).toFixed(1));

    const canonicalFingerprintPayload = {
      userId,
      researchRunId,
      totalLaboratoriesCount,
      matchedLaboratoriesCount,
      independentDatasetIds: independentDatasets.map((d) => d.datasetId).sort(),
      independentObservationsCount,
    };

    const crossLabReproducibilityFingerprint = `clrfp-${crypto
      .createHash("sha256")
      .update(JSON.stringify(canonicalFingerprintPayload))
      .digest("hex")
      .slice(0, 16)}`;

    const reproducibilityId = `clrr-${crossLabReproducibilityFingerprint.slice(6, 18)}`;

    return {
      reproducibilityId,
      userId,
      researchRunId,
      crossLabReproducibilityFingerprint,
      matchedLaboratoriesCount,
      totalLaboratoriesCount,
      independentObservationsCount,
      consistencyScore,
      excludedDatasets,
      exclusionReasons,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
