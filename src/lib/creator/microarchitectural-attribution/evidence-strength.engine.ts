import {
  MicroarchitecturalTrace,
  TraceNormalizationRecord,
  EvidenceStrength,
  ConfounderAssessment,
} from "./microarchitectural-attribution.types";

export class EvidenceStrengthEngine {
  public static evaluateStrength(
    trace: MicroarchitecturalTrace,
    norm: TraceNormalizationRecord,
    confounders?: ConfounderAssessment
  ): EvidenceStrength {
    if (trace.sourceState !== "AVAILABLE" || norm.completenessRatio === 0) {
      return "NONE";
    }

    let score = 80;

    score += norm.completenessRatio * 15;

    if (confounders) {
      if (confounders.confounderLevel === "CONFOUNDED") score -= 40;
      else if (confounders.confounderLevel === "HIGH_CONFOUNDING") score -= 25;
      else if (confounders.confounderLevel === "MODERATE_CONFOUNDING") score -= 15;
      else if (confounders.confounderLevel === "LOW_CONFOUNDING") score -= 5;
    }

    if (trace.observedTemperatureCelsius && trace.observedTemperatureCelsius > 90) {
      score -= 10;
    }

    if (score >= 90) return "VERY_HIGH";
    if (score >= 75) return "HIGH";
    if (score >= 55) return "MODERATE";
    if (score >= 35) return "LOW";
    if (score > 10) return "VERY_LOW";
    return "NONE";
  }
}
