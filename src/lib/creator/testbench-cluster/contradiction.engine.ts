import crypto from "crypto";
import {
  CrossNodeContradiction,
  ContradictionStatus,
  SiliconDifferentialEntry,
} from "./testbench-cluster.types";

export class ClusterContradictionEngine {
  public static analyzeContradictions(
    clusterId: string,
    entries: SiliconDifferentialEntry[]
  ): CrossNodeContradiction[] {
    const contradictions: CrossNodeContradiction[] = [];

    for (const entry of entries) {
      const absDelta = Math.abs(entry.deltaPercentage);
      let status: ContradictionStatus = "CONSISTENT";
      let possibleExplanations: string[] = [];
      let validationRequired = false;

      if (entry.differentialClassification === "NOT_COMPARABLE") {
        status = "INSUFFICIENT_DATA";
        possibleExplanations.push("Methodologies are incompatible.");
      } else if (entry.confounders.length > 1) {
        status = "CONFOUNDED";
        possibleExplanations.push(...entry.confounders);
      } else if (entry.differentialClassification === "IDENTICAL_CONFIGURATION" && absDelta > 8) {
        status = "CONTRADICTED";
        possibleExplanations.push(
          "Identical nominal configuration produced contradictory physical benchmark scores (> 8% delta).",
          "Potential silicon lottery binning, VRM cooling variance, or hidden background OS overhead."
        );
        validationRequired = true;
      } else if (absDelta > 8) {
        status = "DIVERGENT";
        possibleExplanations.push(
          `Empirical divergence (${absDelta}%) attributed to primary factor: ${entry.primaryDivergenceFactor}.`
        );
        validationRequired = true;
      } else if (absDelta > 3) {
        status = "MINOR_VARIANCE";
        possibleExplanations.push("Normal laboratory variance within expected bounds (3-8%).");
      }

      if (status === "CONTRADICTED" || status === "DIVERGENT") {
        contradictions.push({
          contradictionId: `contra-${crypto.randomBytes(4).toString("hex")}`,
          clusterId,
          benchmarkSuite: entry.benchmarkSuite,
          conflictingNodeIds: [entry.nodeAId, entry.nodeBId],
          observedScores: [
            { nodeId: entry.nodeAId, score: entry.scoreA, metricUnit: entry.metricUnit },
            { nodeId: entry.nodeBId, score: entry.scoreB, metricUnit: entry.metricUnit },
          ],
          variancePercentage: absDelta,
          contradictionStatus: status,
          possibleExplanations,
          confounders: entry.confounders,
          validationRequired,
          surfacedAt: new Date().toISOString(),
        });
      }
    }

    return contradictions;
  }
}
