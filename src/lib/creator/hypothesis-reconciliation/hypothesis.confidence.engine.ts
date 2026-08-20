import {
  ConfidenceBand,
  EvidenceAttachment,
  HypothesisPrediction,
  ConfounderCategory,
} from "./hypothesis.types";

export class HypothesisConfidenceEngine {
  public static calculateConfidence(params: {
    priorConfidence: number;
    evidence: EvidenceAttachment[];
    predictions: HypothesisPrediction[];
    activeConfounders: ConfounderCategory[];
  }): {
    confidenceScore: number;
    confidenceBand: ConfidenceBand;
    confidenceFactors: string[];
  } {
    let score = params.priorConfidence || 50;
    const factors: string[] = [];

    const supporting = params.evidence.filter((e) => e.relationship === "SUPPORTING");
    const contradicting = params.evidence.filter((e) => e.relationship === "CONTRADICTING");
    const compatible = params.evidence.filter((e) => e.relationship === "COMPATIBLE");

    if (supporting.length > 0) {
      const boost = supporting.length * 12;
      score += boost;
      factors.push(`+${boost} from ${supporting.length} independent supporting evidence item(s).`);
    }

    if (contradicting.length > 0) {
      const penalty = contradicting.length * 20;
      score -= penalty;
      factors.push(`-${penalty} from ${contradicting.length} contradictory evidence item(s).`);
    }

    if (compatible.length > 0) {
      const boost = compatible.length * 4;
      score += boost;
      factors.push(`+${boost} from ${compatible.length} compatible non-diagnostic item(s).`);
    }

    if (params.activeConfounders.length > 0) {
      const penalty = params.activeConfounders.length * 8;
      score -= penalty;
      factors.push(`-${penalty} from ${params.activeConfounders.length} active unmitigated confounder(s).`);
    }

    const matchedPreds = params.predictions.filter((p) => p.result === "MATCHED");
    const missedPreds = params.predictions.filter((p) => p.result === "MISSED");

    if (matchedPreds.length > 0) {
      const boost = matchedPreds.length * 15;
      score += boost;
      factors.push(`+${boost} from ${matchedPreds.length} validated empirical prediction(s).`);
    }

    if (missedPreds.length > 0) {
      const penalty = missedPreds.length * 18;
      score -= penalty;
      factors.push(`-${penalty} from ${missedPreds.length} failed empirical prediction(s).`);
    }

    const clampedScore = Math.min(100, Math.max(0, Math.round(score)));

    let confidenceBand: ConfidenceBand = "MODERATE";
    if (clampedScore < 30) {
      confidenceBand = "VERY_LOW";
    } else if (clampedScore < 50) {
      confidenceBand = "LOW";
    } else if (clampedScore < 70) {
      confidenceBand = "MODERATE";
    } else if (clampedScore < 85) {
      confidenceBand = "HIGH";
    } else {
      confidenceBand = "VERY_HIGH";
    }

    return {
      confidenceScore: clampedScore,
      confidenceBand,
      confidenceFactors: factors,
    };
  }
}
