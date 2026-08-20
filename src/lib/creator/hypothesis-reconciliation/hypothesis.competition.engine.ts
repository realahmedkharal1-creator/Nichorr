import crypto from "crypto";
import {
  CompetingHypothesisGroup,
  ResearchHypothesis,
} from "./hypothesis.types";

export class HypothesisCompetitionEngine {
  public static createCompetingGroup(params: {
    title: string;
    targetObservation: string;
    hypotheses: ResearchHypothesis[];
    primaryDiagnosticDifferentiator?: string;
  }): CompetingHypothesisGroup {
    const rawPayload = JSON.stringify({
      title: params.title,
      targetObservation: params.targetObservation,
      hypIds: params.hypotheses.map((h) => h.hypothesisId).sort(),
    });

    const groupId = `hygrp-${crypto.createHash("sha256").update(rawPayload).digest("hex").slice(0, 16)}`;

    const groupHypotheses = params.hypotheses.map((h) => ({
      hypothesisId: h.hypothesisId,
      title: h.title,
      domain: h.domain,
      status: h.status,
      confidenceBand: h.confidenceBand,
      supportingCount: h.supportingEvidenceIds.length,
      contradictingCount: h.contradictoryEvidenceIds.length,
      isMutuallyExclusive: true,
    }));

    const primaryDiagnosticDifferentiator =
      params.primaryDiagnosticDifferentiator ||
      "Memory bus clock step-up experiment vs core clock frequency scaling isolation.";

    return {
      groupId,
      title: params.title,
      targetObservation: params.targetObservation,
      hypotheses: groupHypotheses,
      primaryDiagnosticDifferentiator,
      unresolvedAlternativesCount: groupHypotheses.filter((g) => g.status !== "FALSIFIED").length,
    };
  }
}
