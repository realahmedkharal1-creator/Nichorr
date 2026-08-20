import crypto from "node:crypto";
import {
  SiliconRegressionMatrix,
  RegressionResearchOpportunity,
  RegressionOpportunityPriority,
} from "./silicon-regression.types";

export class RegressionResearchOpportunityEngine {
  /**
   * Generates actionable research opportunities from detected silicon regressions.
   */
  static generateOpportunities(
    matrix: SiliconRegressionMatrix
  ): RegressionResearchOpportunity[] {
    const opportunities: RegressionResearchOpportunity[] = [];

    for (const pair of matrix.pairs) {
      if (
        pair.regressionState === "CONFIRMED_EMPIRICAL_REGRESSION" ||
        pair.regressionState === "LIKELY_REGRESSION" ||
        pair.regressionState === "POSSIBLE_REGRESSION"
      ) {
        let priority: RegressionOpportunityPriority = "MEDIUM";
        if (Math.abs(pair.percentageDelta) >= 12) {
          priority = "CRITICAL";
        } else if (Math.abs(pair.percentageDelta) >= 6) {
          priority = "HIGH";
        }

        const opportunityId = `rro-${crypto
          .createHash("sha256")
          .update(`${pair.pairId}:${pair.percentageDelta}`)
          .digest("hex")
          .substring(0, 10)}`;

        const title = `Investigate ${Math.abs(pair.percentageDelta)}% Regression in ${
          pair.candidateObservation.sku
        } (${pair.candidateObservation.benchmarkSuite})`;

        const description = `Observed performance regression of ${pair.percentageDelta}% between baseline (${pair.baselineObservation.sku} on driver ${pair.baselineObservation.driver || "N/A"}) and candidate (${pair.candidateObservation.sku} on driver ${pair.candidateObservation.driver || "N/A"}).`;

        const hypothesis = `Performance drop may correlate with ${
          pair.causeCandidates.length > 0
            ? pair.causeCandidates.map((c) => c.category).join(", ")
            : "firmware/driver microcode delta"
        }, but requires isolated laboratory validation.`;

        opportunities.push({
          opportunityId,
          title,
          description,
          triggeringPairId: pair.pairId,
          affectedArchitecture: pair.candidateObservation.architecture,
          affectedGeneration: pair.candidateObservation.generation,
          affectedSKUs: [pair.baselineObservation.sku, pair.candidateObservation.sku],
          affectedBenchmarks: [pair.baselineObservation.benchmarkSuite],
          observedDeltaPercentage: pair.percentageDelta,
          candidateCauses: pair.causeCandidates,
          knownConfounders: pair.confounders.map((c) => c.dimension),
          hypothesis,
          priority,
          status: "IDENTIFIED",
          evidenceBoundary:
            "EPISTEMIC BOUNDARY: This research opportunity represents an empirical observation. It must be formally validated in a controlled environment before asserting causal claims.",
          createdAt: new Date().toISOString(),
        });
      }
    }

    return opportunities;
  }
}
