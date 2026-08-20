import {
  CrossHardwareCorrelationRecord,
  CollectiveLineageTrace,
  CollectiveLineageLink,
} from "./collective-intelligence.types";

export class CollectiveLineageEngine {
  /**
   * Generates a deterministic explainability lineage trace for a correlation record.
   */
  static traceCorrelationLineage(
    correlation: CrossHardwareCorrelationRecord
  ): CollectiveLineageTrace {
    const links: CollectiveLineageLink[] = [];

    // Stage 1: Hardware Pair & Benchmark Definition
    links.push({
      stage: "HARDWARE_TARGETS",
      title: `${correlation.hardwareA} vs ${correlation.hardwareB}`,
      detail: `Benchmark Suite: ${correlation.benchmarkSuite} (${correlation.metric})`,
      status: "VALID",
      targetId: correlation.correlationId,
    });

    // Stage 2: Contributing Projects
    links.push({
      stage: "FEDERATED_PROJECTS",
      title: `${correlation.independentProjectsCount} Independent Projects`,
      detail: `Projects: ${correlation.contributingProjectIds.join(", ") || "None"}`,
      status: correlation.independentProjectsCount >= 2 ? "VALID" : "LIMITED",
      targetId: correlation.contributingProjectIds.join(","),
    });

    // Stage 3: Comparable Observations
    links.push({
      stage: "OBSERVATIONS_NORMALIZATION",
      title: `${correlation.comparableObservationsCount} Comparable Measurements`,
      detail: `Total observations considered: ${correlation.totalObservationsCount}`,
      status: correlation.comparableObservationsCount >= 2 ? "VALID" : "LIMITED",
      targetId: correlation.contributingObservationIds.join(","),
    });

    // Stage 4: Methodology Alignment
    links.push({
      stage: "METHODOLOGY_ALIGNMENT",
      title: `Methodology State: ${correlation.methodologyAlignment}`,
      detail:
        correlation.confounders.length > 0
          ? `Detected Confounders: ${correlation.confounders.join("; ")}`
          : "Full parameter alignment confirmed across all 20 dimensions.",
      status: correlation.methodologyAlignment === "DIRECTLY_COMPARABLE" ? "VALID" : "WARNING",
      targetId: correlation.correlationId,
    });

    // Stage 5: Independence & Contradiction Evaluation
    links.push({
      stage: "INDEPENDENCE_AND_CONTRADICTIONS",
      title: `Independent Sources: ${correlation.independentSourcesCount} | Contradictions: ${correlation.contradictionCount}`,
      detail:
        correlation.contradictionCount > 0
          ? `Contradictions detected: ${correlation.contradictions.map((c) => c.explanation).join("; ")}`
          : "No empirical contradictions observed across participating project datasets.",
      status: correlation.contradictionCount === 0 ? "VALID" : "CONTRADICTED",
      targetId: correlation.correlationId,
    });

    // Stage 6: Correlation Synthesis & Confidence
    links.push({
      stage: "CORRELATION_SYNTHESIS",
      title: `State: ${correlation.correlationState} (Delta: ${correlation.observedDeltaPercentage}%)`,
      detail: `Analytical Confidence: ${correlation.confidenceLevel}. Subject to independent research validation.`,
      status: correlation.confidenceLevel === "HIGH" || correlation.confidenceLevel === "MODERATE" ? "VALID" : "LOW_CONFIDENCE",
      targetId: correlation.correlationId,
    });

    return {
      correlationId: correlation.correlationId,
      links,
    };
  }
}
