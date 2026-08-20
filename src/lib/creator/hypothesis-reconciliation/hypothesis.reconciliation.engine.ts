import crypto from "crypto";
import {
  HypothesisHealthReconciliation,
  ResearchHealthImpact,
  ResearchHypothesis,
} from "./hypothesis.types";

export class HypothesisReconciliationEngine {
  public static reconcileWithResearchHealth(
    hypothesis: ResearchHypothesis,
    targetResearchRunId: string,
    existingClaims: string[] = []
  ): HypothesisHealthReconciliation {
    let newHealthImpact: ResearchHealthImpact = "NO_CHANGE";
    let reasoning = "Hypothesis is currently in standard observational evaluation.";
    let recommendedAction = "Retain existing claim citations without modification.";

    if (hypothesis.status === "FALSIFIED") {
      newHealthImpact = "FALSIFICATION_DETECTED";
      reasoning = `Hypothesis '${hypothesis.title}' was falsified under controlled validation conditions.`;
      recommendedAction = "Mark associated claim for mandatory human researcher review.";
    } else if (hypothesis.status === "SUPPORTED" || hypothesis.status === "VERIFIED_CANDIDATE") {
      newHealthImpact = "INCREASE_CONFIDENCE";
      reasoning = `Hypothesis '${hypothesis.title}' has achieved high confidence (${hypothesis.currentConfidence}%) across multiple independent evidence sources.`;
      recommendedAction = "Eligible for Phase 86 calibration review and Verified Research Ledger candidate assessment.";
    } else if (hypothesis.status === "WEAKENED") {
      newHealthImpact = "DECREASE_CONFIDENCE";
      reasoning = `Contradictory evidence reduced confidence to ${hypothesis.currentConfidence}%.`;
      recommendedAction = "Review claim citations and consider alternative competing explanations.";
    } else if (hypothesis.activeConfounders.length > 1) {
      newHealthImpact = "REQUIRES_REVIEW";
      reasoning = `Identified ${hypothesis.activeConfounders.length} active unmitigated confounders (${hypothesis.activeConfounders.join(", ")}).`;
      recommendedAction = "Execute isolated confounder control experiments on physical testbench node.";
    }

    const reconciliationId = `hyhr-${crypto
      .createHash("sha256")
      .update(`${hypothesis.hypothesisId}:${targetResearchRunId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      reconciliationId,
      hypothesisId: hypothesis.hypothesisId,
      targetResearchRunId,
      previousHealthStatus: "NOMINAL",
      newHealthImpact,
      affectedClaimsCount: existingClaims.length,
      affectedClaims: existingClaims,
      reasoning,
      recommendedAction,
      reconciledAt: new Date().toISOString(),
    };
  }
}
