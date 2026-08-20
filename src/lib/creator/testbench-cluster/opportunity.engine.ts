import crypto from "crypto";
import {
  SiliconDifferentialEntry,
  SiliconDifferentialResearchOpportunity,
} from "./testbench-cluster.types";

export class ClusterOpportunityEngine {
  public static surfaceOpportunities(
    clusterId: string,
    researchRunId: string,
    userId: string,
    entries: SiliconDifferentialEntry[]
  ): SiliconDifferentialResearchOpportunity[] {
    const opportunities: SiliconDifferentialResearchOpportunity[] = [];

    for (const entry of entries) {
      const absDelta = Math.abs(entry.deltaPercentage);

      if (entry.differentialClassification === "SILICON_VARIANT" && absDelta > 4) {
        opportunities.push({
          opportunityId: `sdo-${crypto.randomBytes(4).toString("hex")}`,
          clusterId,
          researchRunId,
          userId,
          title: `Silicon Variant Performance Divergence (${entry.nodeASku} vs ${entry.nodeBSku})`,
          hypothesis: `Physical benchmark indicates ${absDelta}% delta associated with ${entry.primaryDivergenceFactor}.`,
          priority: absDelta > 10 ? "CRITICAL" : "HIGH",
          status: "IDENTIFIED",
          affectedNodeIds: [entry.nodeAId, entry.nodeBId],
          affectedSKUs: [entry.nodeASku, entry.nodeBSku],
          affectedBenchmarks: [entry.benchmarkSuite],
          candidateCauses: entry.candidateCauses,
          confounders: entry.confounders,
          observedDeltaPercentage: entry.deltaPercentage,
          supportingEvidence: [
            `Node A: ${entry.scoreA} ${entry.metricUnit} (${entry.nodeADriver})`,
            `Node B: ${entry.scoreB} ${entry.metricUnit} (${entry.nodeBDriver})`,
          ],
          requiredValidationTasks: [
            "Execute 5-pass repeated benchmark on matched clean OS installations",
            "Capture oscilloscope PCIe and 12V-2x6 power rail transients",
            "Verify memory sub-timings and BIOS power profile matches",
          ],
          confidence: 0.9,
          isCausallyEstablished: false, // Strict epistemic guard
          evidenceBoundary:
            "RESEARCH_OPPORTUNITY: Hypothesis generated for validation without mutating factual research claims.",
          createdAt: new Date().toISOString(),
        });
      } else if (entry.differentialClassification === "DRIVER_VARIANT" && absDelta > 5) {
        opportunities.push({
          opportunityId: `sdo-${crypto.randomBytes(4).toString("hex")}`,
          clusterId,
          researchRunId,
          userId,
          title: `Driver Revision Regression Anomaly (${entry.nodeADriver} vs ${entry.nodeBDriver})`,
          hypothesis: `Driver update correlates with ${absDelta}% performance delta on ${entry.nodeASku}.`,
          priority: "HIGH",
          status: "IDENTIFIED",
          affectedNodeIds: [entry.nodeAId, entry.nodeBId],
          affectedSKUs: [entry.nodeASku],
          affectedBenchmarks: [entry.benchmarkSuite],
          candidateCauses: ["DRIVER_CHANGE", "SHADER_COMPILATION_BEHAVIOR"],
          confounders: entry.confounders,
          observedDeltaPercentage: entry.deltaPercentage,
          supportingEvidence: [
            `Baseline Driver (${entry.nodeBDriver}): ${entry.scoreB} ${entry.metricUnit}`,
            `Tested Driver (${entry.nodeADriver}): ${entry.scoreA} ${entry.metricUnit}`,
          ],
          requiredValidationTasks: [
            "Perform clean DDU driver reinstallation",
            "Validate shader cache pre-warming consistency",
          ],
          confidence: 0.85,
          isCausallyEstablished: false,
          evidenceBoundary:
            "RESEARCH_OPPORTUNITY: Driver anomaly flagged for Phase 86 research calibration.",
          createdAt: new Date().toISOString(),
        });
      }
    }

    return opportunities;
  }
}
