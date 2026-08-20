import crypto from "crypto";
import {
  MicroarchitecturalAttributionRecord,
  CrossGenerationalAttributionMatrix,
  ResearchHealthReconciliationRecord,
  MicroarchitecturalOpportunity,
} from "./microarchitectural-attribution.types";

export class MicroarchitecturalOpportunityEngine {
  public static generateOpportunities(params: {
    userId: string;
    researchRunId: string;
    attributions: MicroarchitecturalAttributionRecord[];
    comparisons: CrossGenerationalAttributionMatrix[];
    reconciliations: ResearchHealthReconciliationRecord[];
  }): MicroarchitecturalOpportunity[] {
    const opportunities: MicroarchitecturalOpportunity[] = [];

    // 1. Cross-generation bottleneck shift opportunity
    for (const comp of params.comparisons) {
      if (comp.classification === "STEPPING_DIFFERENCE" || comp.classification === "MEMORY_SUBSYSTEM_DIFFERENCE") {
        const oppId = `mro-${crypto
          .createHash("sha256")
          .update(comp.comparisonId)
          .digest("hex")
          .slice(0, 16)}`;

        opportunities.push({
          opportunityId: oppId,
          userId: params.userId,
          researchRunId: params.researchRunId,
          title: `Microarchitectural Bottleneck Shift in ${comp.candidateSku} (${comp.candidateStepping})`,
          hypothesis: `Silicon stepping ${comp.candidateStepping} shifts primary execution stall from ${comp.baselineAttribution} to ${comp.candidateAttribution}.`,
          observedEvidence: [
            `Performance delta: ${comp.performanceDeltaPercentage}%`,
            `Baseline attribution: ${comp.baselineAttribution}`,
            `Candidate attribution: ${comp.candidateAttribution}`,
          ],
          supportingTraces: [comp.comparisonId],
          supportingMeasurements: [`Delta ${comp.performanceDeltaPercentage}%`],
          confounders: comp.confounderAssessment.identifiedConfounders,
          missingEvidence: ["Isolated memory clock sweep trace"],
          requiredValidation: "Perform secondary physical verification with isolated memory bandwidth sweep.",
          priority: "HIGH",
          epistemicClassification: "CALIBRATION_OPPORTUNITY",
          resolutionStatus: "OPEN",
          isCausallyEstablished: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 2. Health reconciliation conflict opportunity
    for (const rec of params.reconciliations) {
      if (rec.newHealthEffect === "CONTRADICTS_EXISTING_FINDING") {
        const oppId = `mro-conflict-${crypto
          .createHash("sha256")
          .update(rec.reconciliationId)
          .digest("hex")
          .slice(0, 16)}`;

        opportunities.push({
          opportunityId: oppId,
          userId: params.userId,
          researchRunId: params.researchRunId,
          title: `Attribution Health Discrepancy`,
          hypothesis: `Trace attribution identified thermal throttling, creating contradiction with baseline research health claims.`,
          observedEvidence: [rec.evidenceDeltaSummary],
          supportingTraces: [rec.attributionId],
          supportingMeasurements: ["Thermal sensor reading"],
          confounders: ["Ambient room temperature drift"],
          missingEvidence: ["External thermocouple verification"],
          requiredValidation: "Re-run physical benchmark under controlled ambient laboratory conditions.",
          priority: "CRITICAL",
          epistemicClassification: "CONFLICTED_EVIDENCE",
          resolutionStatus: "OPEN",
          isCausallyEstablished: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return opportunities;
  }
}
