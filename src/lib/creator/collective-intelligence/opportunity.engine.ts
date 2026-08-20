import crypto from "node:crypto";
import {
  CrossHardwareCorrelationRecord,
  CollectiveResearchOpportunity,
  CollectiveOpportunityPriority,
} from "./collective-intelligence.types";

export class CollectiveOpportunityEngine {
  /**
   * Generates collective research opportunities from cross-hardware correlation records.
   */
  static generateOpportunities(
    correlations: CrossHardwareCorrelationRecord[]
  ): CollectiveResearchOpportunity[] {
    const opportunities: CollectiveResearchOpportunity[] = [];

    for (const corr of correlations) {
      if (corr.correlationState === "NO_RELATIONSHIP" || corr.correlationState === "INSUFFICIENT_DATA") {
        continue;
      }

      let priority: CollectiveOpportunityPriority = "MEDIUM";
      let requiredValidationType = "STANDARDIZED_BENCHMARK_REVALIDATION";
      let title = "";
      let hypothesis = "";

      if (corr.correlationState === "CONTRADICTED") {
        priority = "CRITICAL";
        requiredValidationType = "DISCREPANCY_ISOLATION_STUDY";
        title = `Resolve Empirical Contradiction: ${corr.hardwareA} vs ${corr.hardwareB}`;
        hypothesis = `Divergent measurement outcomes across ${corr.independentProjectsCount} projects indicate unidentified environmental or driver variance.`;
      } else if (corr.correlationState === "STRONG_ASSOCIATION") {
        priority = "HIGH";
        requiredValidationType = "CROSS_LAB_VERIFIED_STUDY";
        title = `Validate Repeated Uplift Pattern: ${corr.hardwareA} vs ${corr.hardwareB}`;
        hypothesis = `Observed delta of ${corr.observedDeltaPercentage}% in ${corr.benchmarkSuite} across ${corr.independentProjectsCount} independent projects should be formally integrated into authoritative research claims.`;
      } else if (corr.correlationState === "CONFOUNDED") {
        priority = "MEDIUM";
        requiredValidationType = "PARAMETRIC_CONTROLLED_SWEEP";
        title = `Confounder Isolation: ${corr.hardwareA} vs ${corr.hardwareB}`;
        hypothesis = `Multiple parameter deltas (${corr.confounders.join(", ")}) obscure direct hardware performance attribution.`;
      } else {
        priority = "LOW";
        requiredValidationType = "OBSERVATIONAL_SAMPLE_EXPANSION";
        title = `Expand Sample Base: ${corr.hardwareA} vs ${corr.hardwareB}`;
        hypothesis = `Initial pattern observed; requires additional independent project federation runs.`;
      }

      const opportunityId = `opp-${crypto
        .createHash("sha256")
        .update(`${corr.correlationId}:${title}`)
        .digest("hex")
        .substring(0, 10)}`;

      opportunities.push({
        opportunityId,
        title,
        description: `Collective intelligence pattern detected across ${corr.independentProjectsCount} independent research projects in ${corr.benchmarkSuite}.`,
        triggeringProjectIds: corr.contributingProjectIds,
        triggeringObservationIds: corr.contributingObservationIds,
        correlationState: corr.correlationState,
        methodologyState: corr.methodologyAlignment,
        independenceState: corr.independentSourcesCount > 1 ? "INDEPENDENT" : "LIKELY_INDEPENDENT",
        confidenceLevel: corr.confidenceLevel,
        hypothesis,
        knownConfounders: corr.confounders,
        evidenceBoundaryBanner:
          "Cross-Project Correlation is an analytical signal. Formal independent research validation is required before updating claims or scripts.",
        requiredValidationType,
        priority,
        affectedHardware: [corr.hardwareA, corr.hardwareB],
        affectedBenchmarks: [corr.benchmarkSuite],
        provenance: [
          `Correlation Record: ${corr.correlationId}`,
          `Benchmark Suite: ${corr.benchmarkSuite}`,
          `Contributing Projects: ${corr.contributingProjectIds.join(", ")}`,
          `Confidence: ${corr.confidenceLevel}`,
        ],
        status: "IDENTIFIED",
        createdAt: new Date().toISOString(),
      });
    }

    return opportunities;
  }
}
