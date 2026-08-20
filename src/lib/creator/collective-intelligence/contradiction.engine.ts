import crypto from "node:crypto";
import {
  NormalizedObservation,
  ContradictionRecord,
} from "./collective-intelligence.types";
import { MethodologyAlignmentEngine } from "./methodology.engine";

export class ContradictionDetectionEngine {
  /**
   * Detects whether two comparable observations contain empirical contradiction (e.g. divergent delta or opposing direction).
   */
  static detectContradiction(
    obsA: NormalizedObservation,
    obsB: NormalizedObservation,
    correlationId: string,
    tolerancePercentage: number = 10
  ): ContradictionRecord | null {
    // Only compare if they share the same benchmark suite
    if (
      obsA.software.benchmarkSuite.toLowerCase().trim() !==
      obsB.software.benchmarkSuite.toLowerCase().trim()
    ) {
      return null;
    }

    const alignment = MethodologyAlignmentEngine.alignObservations(obsA, obsB);
    if (alignment.alignmentState === "NOT_COMPARABLE") {
      return null;
    }

    const valA = obsA.measurement.value;
    const valB = obsB.measurement.value;

    if (valA <= 0 || valB <= 0) return null;

    const deltaPercentage = Math.abs(((valA - valB) / Math.max(valA, valB)) * 100);

    // If delta exceeds tolerance, surface as contradiction
    if (deltaPercentage > tolerancePercentage) {
      const contradictionId = `cnt-${crypto
        .createHash("sha256")
        .update(`${obsA.observationId}:${obsB.observationId}:${deltaPercentage}`)
        .digest("hex")
        .substring(0, 10)}`;

      return {
        contradictionId,
        correlationId,
        projectAId: obsA.federationRecordId,
        projectBId: obsB.federationRecordId,
        deltaDiffPercentage: Number(deltaPercentage.toFixed(1)),
        identifiedDimensionDifferences: alignment.dimensionDifferences,
        explanation: `Empirical divergence of ${deltaPercentage.toFixed(
          1
        )}% observed between Project ${obsA.federationRecordId} (${valA}${
          obsA.measurement.unit
        }) and Project ${obsB.federationRecordId} (${valB}${
          obsB.measurement.unit
        }). ${
          alignment.dimensionDifferences.length > 0
            ? `Methodology deltas: ${alignment.dimensionDifferences.join("; ")}`
            : "Test parameters appear aligned; potential silicon lottery, thermal variance, or background workload divergence."
        }`,
      };
    }

    return null;
  }
}
