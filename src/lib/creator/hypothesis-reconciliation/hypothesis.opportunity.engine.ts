import crypto from "crypto";
import {
  ResearchHypothesis,
  CompetingHypothesisGroup,
} from "./hypothesis.types";

export interface HypothesisOpportunity {
  opportunityId: string;
  userId: string;
  researchRunId: string;
  hypothesisId: string;
  title: string;
  hypothesisStatement: string;
  unresolvedCompetitorCount: number;
  falsificationFeasibility: "HIGH" | "MODERATE" | "LOW";
  recommendedExperiment: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "BRIDGED_TO_PHASE86" | "RESOLVED";
  createdAt: string;
}

export class HypothesisOpportunityEngine {
  public static generateOpportunities(params: {
    userId: string;
    researchRunId: string;
    hypotheses: ResearchHypothesis[];
    competingGroups: CompetingHypothesisGroup[];
  }): HypothesisOpportunity[] {
    const opportunities: HypothesisOpportunity[] = [];

    for (const group of params.competingGroups) {
      if (group.unresolvedAlternativesCount > 1) {
        const oppId = `hyopp-grp-${crypto.createHash("sha256").update(group.groupId).digest("hex").slice(0, 16)}`;
        opportunities.push({
          opportunityId: oppId,
          userId: params.userId,
          researchRunId: params.researchRunId,
          hypothesisId: group.hypotheses[0]?.hypothesisId || "unknown",
          title: `Resolve Competing Explanations for: ${group.targetObservation}`,
          hypothesisStatement: `Differentiate between ${group.hypotheses.map((h) => h.title).join(" vs ")}.`,
          unresolvedCompetitorCount: group.unresolvedAlternativesCount,
          falsificationFeasibility: "HIGH",
          recommendedExperiment: group.primaryDiagnosticDifferentiator,
          priority: "HIGH",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }
    }

    for (const h of params.hypotheses) {
      if (h.activeConfounders.length > 0 && h.status !== "FALSIFIED") {
        const oppId = `hyopp-conf-${crypto.createHash("sha256").update(h.hypothesisId).digest("hex").slice(0, 16)}`;
        opportunities.push({
          opportunityId: oppId,
          userId: params.userId,
          researchRunId: params.researchRunId,
          hypothesisId: h.hypothesisId,
          title: `Confounder Elimination for '${h.title}'`,
          hypothesisStatement: `Isolate active confounders (${h.activeConfounders.join(", ")}) to establish empirical diagnostic validity.`,
          unresolvedCompetitorCount: h.competingHypothesisIds.length,
          falsificationFeasibility: "HIGH",
          recommendedExperiment: "Execute isolated testbench run under controlled thermal and power limits.",
          priority: "MEDIUM",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
      }
    }

    return opportunities;
  }
}
