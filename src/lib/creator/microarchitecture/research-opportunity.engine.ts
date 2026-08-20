import crypto from "crypto";
import {
  BottleneckAttributionRecord,
  CrossGenerationComparison,
  LedgerReconciliationRecord,
  MicroarchitectureResearchOpportunity,
} from "./microarchitecture.types";

export class MicroarchitectureOpportunityEngine {
  public static generateOpportunities(params: {
    userId: string;
    researchRunId: string;
    attributions: BottleneckAttributionRecord[];
    comparisons: CrossGenerationComparison[];
    ledgerReconciliations: LedgerReconciliationRecord[];
  }): MicroarchitectureResearchOpportunity[] {
    const opps: MicroarchitectureResearchOpportunity[] = [];

    // 1. Cross-generation bottleneck shift opportunity
    for (const comp of params.comparisons) {
      if (comp.classification === "STEPPING_DIFFERENCE" || comp.classification === "MEMORY_SUBSYSTEM_DIFFERENCE") {
        const oppId = `mro-${crypto
          .createHash("sha256")
          .update(comp.comparisonId)
          .digest("hex")
          .slice(0, 16)}`;

        opps.push({
          opportunityId: oppId,
          userId: params.userId,
          researchRunId: params.researchRunId,
          title: `Microarchitectural Bottleneck Shift in ${comp.candidateSku} (${comp.candidateStepping})`,
          hypothesis: `Silicon stepping ${comp.candidateStepping} shifts primary execution stall from ${comp.baselineAttribution} to ${comp.candidateAttribution}.`,
          observedSignals: [
            `Performance delta: ${comp.performanceDeltaPercentage}%`,
            `Baseline attribution: ${comp.baselineAttribution}`,
            `Candidate attribution: ${comp.candidateAttribution}`,
          ],
          supportingEvidence: [`Trace comparison ${comp.comparisonId}`],
          contradictingEvidence: [],
          confounders: comp.confounders,
          requiredValidation: "Perform secondary physical verification with isolated memory bandwidth sweep.",
          priority: "HIGH",
          resolutionStatus: "OPEN",
          isCausallyEstablished: false,
          evidenceBoundary: "RESEARCH_CALIBRATION_OPPORTUNITY (isCausallyEstablished: false)",
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 2. Ledger conflict opportunity
    for (const lRec of params.ledgerReconciliations) {
      if (lRec.reconciliationStatus === "CONFLICTS_WITH_LEDGER") {
        const oppId = `mro-conflict-${crypto
          .createHash("sha256")
          .update(lRec.reconciliationId)
          .digest("hex")
          .slice(0, 16)}`;

        opps.push({
          opportunityId: oppId,
          userId: params.userId,
          researchRunId: params.researchRunId,
          title: `Attribution Conflict with Verified Ledger Finding`,
          hypothesis: `Execution trace attribution ${lRec.attributionType} conflicts with validated ledger claim '${lRec.ledgerClaim}'.`,
          observedSignals: [lRec.conflictDetails || "Divergent evidence signal."],
          supportingEvidence: [`Attribution ${lRec.attributionId}`],
          contradictingEvidence: [`Ledger Entry ${lRec.ledgerEntryId}`],
          confounders: ["Measurement thermal noise"],
          requiredValidation: "Re-run physical benchmark under controlled ambient laboratory conditions.",
          priority: "CRITICAL",
          resolutionStatus: "OPEN",
          isCausallyEstablished: false,
          evidenceBoundary: "RESEARCH_CALIBRATION_OPPORTUNITY (isCausallyEstablished: false)",
          createdAt: new Date().toISOString(),
        });
      }
    }

    return opps;
  }
}
