import { CalibrationResult, CalibrationResultOutcome } from "./research-calibration.types";

export interface ResearchHealthReconciliationReport {
  reconciliationId: string;
  researchRunId: string;
  previousHealthStatus: string;
  updatedHealthStatus: string;
  reconciliationReason: string;
  reconciledResultsCount: number;
  outcomesBreakdown: Record<CalibrationResultOutcome, number>;
  recommendedSafeExecutionSteps: string[];
  reconciledAt: string;
}

export class ResearchHealthReconciliationEngine {
  /**
   * Reconciles newly validated research results with existing authoritative Research Health.
   * Does NOT invent arbitrary numerical scores; updates health status based strictly on evidence outcomes.
   */
  static reconcileWithResearchHealth(
    researchRunId: string,
    results: CalibrationResult[],
    currentHealthStatus: string = "HEALTHY"
  ): ResearchHealthReconciliationReport {
    const reconciliationId = `rhr-${researchRunId}-${Date.now().toString(36)}`;
    const breakdown: Record<CalibrationResultOutcome, number> = {
      NO_CHANGE_REQUIRED: 0,
      OBSERVATION_CONFIRMED: 0,
      EVIDENCE_REFRESHED: 0,
      CLAIM_REVALIDATED: 0,
      CLAIM_REJECTED: 0,
      CLAIM_REFRAMED: 0,
      METHODOLOGY_UPDATED: 0,
      SOURCE_REPLACEMENT_REQUIRED: 0,
      INCONCLUSIVE: 0,
    };

    const recommendedSteps: string[] = [];

    for (const r of results) {
      breakdown[r.outcome] = (breakdown[r.outcome] || 0) + 1;
      if (r.requiredSafeExecutionPlan) {
        recommendedSteps.push(`Trigger Phase 78 Safe Execution Plan for ${r.reconciledClaimId || "target claim"} (${r.outcome}).`);
      }
    }

    let updatedStatus = currentHealthStatus;
    let reason = "All research calibration checks confirmed existing evidence validity.";

    if (breakdown.CLAIM_REJECTED > 0 || breakdown.SOURCE_REPLACEMENT_REQUIRED > 0) {
      updatedStatus = "ACTION_REQUIRED";
      reason = `${breakdown.CLAIM_REJECTED} claims rejected or require source replacement during calibration.`;
    } else if (breakdown.EVIDENCE_REFRESHED > 0 || breakdown.METHODOLOGY_UPDATED > 0 || breakdown.CLAIM_REFRAMED > 0) {
      updatedStatus = "REFRESHED";
      reason = "Evidence refreshed and methodology updated during closed-loop calibration.";
    }

    return {
      reconciliationId,
      researchRunId,
      previousHealthStatus: currentHealthStatus,
      updatedHealthStatus: updatedStatus,
      reconciliationReason: reason,
      reconciledResultsCount: results.length,
      outcomesBreakdown: breakdown,
      recommendedSafeExecutionSteps: recommendedSteps,
      reconciledAt: new Date().toISOString(),
    };
  }
}
