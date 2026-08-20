import {
  FalsificationStrength,
  EvidenceAttachment,
  HypothesisPrediction,
  HypothesisStatus,
} from "./hypothesis.types";

export class HypothesisFalsificationEngine {
  public static evaluateFalsification(params: {
    evidence: EvidenceAttachment[];
    predictions: HypothesisPrediction[];
    disconfirmingObservations: string[];
  }): {
    falsificationStrength: FalsificationStrength;
    isFalsified: boolean;
    falsificationSummary: string;
  } {
    const contradicting = params.evidence.filter((e) => e.relationship === "CONTRADICTING");
    const missedPreds = params.predictions.filter((p) => p.result === "MISSED");

    if (contradicting.length === 0 && missedPreds.length === 0) {
      return {
        falsificationStrength: "INSUFFICIENT",
        isFalsified: false,
        falsificationSummary: "No contradictory evidence or failed empirical predictions observed.",
      };
    }

    const severeContradictions = contradicting.filter((c) => c.evidenceType === "PHYSICAL_MEASUREMENT");
    const severeMissed = missedPreds.filter((m) => m.tolerancePercentage <= 5.0);

    let falsificationStrength: FalsificationStrength = "WEAK";
    let isFalsified = false;

    if (severeContradictions.length >= 2 || severeMissed.length >= 2) {
      falsificationStrength = "VERY_STRONG";
      isFalsified = true;
    } else if (severeContradictions.length >= 1 || severeMissed.length >= 1) {
      falsificationStrength = "STRONG";
      isFalsified = true;
    } else if (contradicting.length > 0 || missedPreds.length > 0) {
      falsificationStrength = "MODERATE";
      isFalsified = false;
    }

    const falsificationSummary = isFalsified
      ? `Hypothesis disconfirmed by ${severeContradictions.length} physical measurement contradiction(s) and ${severeMissed.length} tight-tolerance prediction failure(s).`
      : `Minor contradictions observed (${contradicting.length} items); falsification threshold not fully satisfied.`;

    return {
      falsificationStrength,
      isFalsified,
      falsificationSummary,
    };
  }

  public static reconcileHypothesisStatus(
    currentStatus: HypothesisStatus,
    isFalsified: boolean,
    confidenceScore: number,
    hasPendingValidation: boolean
  ): HypothesisStatus {
    if (isFalsified) {
      return "FALSIFIED";
    }

    if (hasPendingValidation) {
      return "VALIDATION_PENDING";
    }

    if (confidenceScore >= 80) {
      return "SUPPORTED";
    }

    if (confidenceScore >= 55) {
      return "PARTIALLY_SUPPORTED";
    }

    if (confidenceScore < 30) {
      return "WEAKENED";
    }

    return currentStatus;
  }
}
