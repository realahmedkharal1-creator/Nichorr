import { AttributionAssessment, AttributionState } from "./research-calibration.types";

export interface AttributionInput {
  candidateId: string;
  observedRelationship: string;
  sampleSize: number;
  supportingSignals?: string[];
  confounders?: string[];
  isControlledExperiment?: boolean;
}

export class AttributionEngine {
  /**
   * Evaluates and classifies the attribution relationship between an observation and production/research choices.
   * Strictly adheres to conservative evidence separation (Correlation != Causation, Performance != Truth).
   */
  static assessAttribution(input: AttributionInput): AttributionAssessment {
    const assessmentId = `attr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const supportingSignals = input.supportingSignals || [];
    const confounders = input.confounders || [];
    const confidenceLimitations: string[] = [];
    let state: AttributionState = "NOT_ASSESSED";

    // 1. Sample size safety guard (Requirement 9)
    if (input.sampleSize < 10) {
      state = "INSUFFICIENT_DATA";
      confidenceLimitations.push(`Sample size (${input.sampleSize}) is too small for statistical attribution.`);
    } else if (confounders.length > 1) {
      // 2. Confounders guard
      state = "CONFOUNDED";
      confidenceLimitations.push(`Multiple confounding variables detected: ${confounders.join(", ")}.`);
    } else if (supportingSignals.length >= 3 && input.sampleSize >= 100) {
      state = "SUPPORTED_BY_MULTIPLE_SIGNALS";
    } else if (input.isControlledExperiment && input.sampleSize >= 50) {
      state = "POSSIBLE_CONTRIBUTOR";
    } else if (supportingSignals.length > 0 && input.sampleSize >= 30) {
      state = "CORRELATED";
      confidenceLimitations.push("Observed statistical correlation does not establish direct technological or research causality.");
    } else if (input.sampleSize >= 10) {
      state = "TEMPORALLY_ASSOCIATED";
      confidenceLimitations.push("Timing association observed; independent research verification required.");
    } else {
      state = "OBSERVATIONAL_ONLY";
      confidenceLimitations.push("Single observational data point; purely qualitative.");
    }

    return {
      assessmentId,
      candidateId: input.candidateId,
      state,
      observedRelationship: input.observedRelationship,
      supportingSignals,
      confounders,
      sampleSize: input.sampleSize,
      confidenceLimitations,
      assessedAt: new Date().toISOString(),
    };
  }
}
