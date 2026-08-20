export type ConfidenceLevel = "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | "VERY_LOW";

export interface TrustScoreOutput {
  score: number; // 0 to 100
  level: ConfidenceLevel;
  factors: {
    supportingEvidenceCount: number;
    independentSourceCount: number;
    contradictionPenalty: number;
    freshnessScore: number;
  };
  rationale: string;
}

export class TrustEngine {
  calculateTrustScore(params: {
    supportingEvidenceCount: number;
    independentSourceCount: number;
    hasContradiction?: boolean;
    isStale?: boolean;
    primarySourceRatio?: number;
  }): TrustScoreOutput {
    let score = 50; // Baseline

    // Positive Factors
    score += Math.min(30, params.supportingEvidenceCount * 10);
    score += Math.min(20, params.independentSourceCount * 10);
    if ((params.primarySourceRatio || 0) > 0.5) score += 10;

    // Negative Penalties
    let contradictionPenalty = 0;
    if (params.hasContradiction) {
      contradictionPenalty = 30;
      score -= 30;
    }
    if (params.isStale) {
      score -= 15;
    }

    // Bound Score
    score = Math.max(10, Math.min(99, Math.round(score)));

    // Determine Confidence Level
    let level: ConfidenceLevel = "MEDIUM";
    if (score >= 85) level = "VERY_HIGH";
    else if (score >= 70) level = "HIGH";
    else if (score >= 50) level = "MEDIUM";
    else if (score >= 30) level = "LOW";
    else level = "VERY_LOW";

    const rationale = `Supported by ${params.supportingEvidenceCount} evidence excerpts from ${params.independentSourceCount} independent sources. Contradiction penalty: -${contradictionPenalty}.`;

    return {
      score,
      level,
      factors: {
        supportingEvidenceCount: params.supportingEvidenceCount,
        independentSourceCount: params.independentSourceCount,
        contradictionPenalty,
        freshnessScore: params.isStale ? 40 : 95,
      },
      rationale,
    };
  }
}
