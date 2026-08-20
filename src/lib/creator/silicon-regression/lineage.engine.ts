import {
  SiliconRegressionPair,
  RegressionLineageTrace,
  RegressionLineageLink,
} from "./silicon-regression.types";

export class SiliconRegressionLineageEngine {
  /**
   * Constructs a 6-stage deterministic provenance trace explaining why a benchmark delta exists.
   */
  static buildLineage(pair: SiliconRegressionPair): RegressionLineageTrace {
    const links: RegressionLineageLink[] = [];

    // Stage 1: Baseline Observation
    links.push({
      stage: "BASELINE_OBSERVATION",
      title: `Baseline: ${pair.baselineObservation.sku}`,
      detail: `Measured ${pair.baselineObservation.measuredScore} ${pair.baselineObservation.metricUnit} in ${pair.baselineObservation.benchmarkSuite} (Driver: ${pair.baselineObservation.driver || "N/A"}).`,
      status: "VALID",
      targetId: pair.baselineObservation.observationId,
    });

    // Stage 2: Candidate Observation
    links.push({
      stage: "CANDIDATE_OBSERVATION",
      title: `Candidate: ${pair.candidateObservation.sku}`,
      detail: `Measured ${pair.candidateObservation.measuredScore} ${pair.candidateObservation.metricUnit} in ${pair.candidateObservation.benchmarkSuite} (Driver: ${pair.candidateObservation.driver || "N/A"}).`,
      status: "VALID",
      targetId: pair.candidateObservation.observationId,
    });

    // Stage 3: Methodology Alignment
    links.push({
      stage: "METHODOLOGY_ALIGNMENT",
      title: `Comparability: ${pair.comparabilityState}`,
      detail: `Evaluated 20 benchmark dimensions. Discrepancies: ${pair.dimensionDifferences.length > 0 ? pair.dimensionDifferences.join(", ") : "None"}.`,
      status: pair.comparabilityState === "NOT_COMPARABLE" ? "FAILED" : "VALID",
      targetId: `comp-${pair.pairId}`,
    });

    // Stage 4: Confounder Analysis
    links.push({
      stage: "CONFOUNDER_ANALYSIS",
      title: `Confounders: ${pair.confounders.length} Detected`,
      detail:
        pair.confounders.length > 0
          ? `Detected confounding factors: ${pair.confounders.map((c) => c.dimension).join(", ")}.`
          : "Clean single-variable alignment verified without methodology confounders.",
      status: pair.confounders.length >= 2 ? "WARNING" : "VALID",
      targetId: `conf-${pair.pairId}`,
    });

    // Stage 5: Cause Candidate Identification
    links.push({
      stage: "CAUSE_CANDIDATES",
      title: `Candidate Causes: ${pair.causeCandidates.length} Identified`,
      detail:
        pair.causeCandidates.length > 0
          ? `Plausible factors: ${pair.causeCandidates.map((c) => c.category).join(", ")}. (Causality unproven).`
          : "No obvious driver or firmware variance detected.",
      status: "VALID",
      targetId: `cause-${pair.pairId}`,
    });

    // Stage 6: Regression Classification
    links.push({
      stage: "REGRESSION_CLASSIFICATION",
      title: `Outcome: ${pair.regressionState} (${pair.percentageDelta > 0 ? `+${pair.percentageDelta}%` : `${pair.percentageDelta}%`})`,
      detail: pair.explanation,
      status:
        pair.regressionState === "CONFIRMED_EMPIRICAL_REGRESSION"
          ? "CRITICAL"
          : pair.regressionState === "LIKELY_REGRESSION" || pair.regressionState === "POSSIBLE_REGRESSION"
          ? "WARNING"
          : "VALID",
      targetId: pair.pairId,
    });

    return {
      regressionId: pair.pairId,
      links,
    };
  }
}
