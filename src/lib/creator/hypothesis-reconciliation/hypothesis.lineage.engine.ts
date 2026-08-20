import crypto from "crypto";
import {
  ResearchHypothesis,
  EvidenceAttachment,
  HypothesisPrediction,
  HypothesisValidationTask,
  HypothesisHealthReconciliation,
  HypothesisLineageTrace,
  HypothesisLineageLink,
} from "./hypothesis.types";

export class HypothesisLineageEngine {
  public static generateTrace(params: {
    hypothesis: ResearchHypothesis;
    evidence: EvidenceAttachment[];
    predictions: HypothesisPrediction[];
    validationTasks: HypothesisValidationTask[];
    reconciliation?: HypothesisHealthReconciliation;
  }): HypothesisLineageTrace {
    const lineageId = `hylin-${crypto
      .createHash("sha256")
      .update(params.hypothesis.hypothesisId)
      .digest("hex")
      .slice(0, 16)}`;

    const supporting = params.evidence.filter((e) => e.relationship === "SUPPORTING");
    const contradicting = params.evidence.filter((e) => e.relationship === "CONTRADICTING");

    const stages: HypothesisLineageLink[] = [
      {
        stage: "1. SOURCE EVIDENCE",
        title: "Observational Evidence Ingestion",
        input: `Originating Phase: ${params.hypothesis.originatingPhase} (Entity: ${params.hypothesis.originatingEntityId})`,
        transformation: `Attached ${params.evidence.length} empirical evidence item(s) (${supporting.length} supporting, ${contradicting.length} contradicting).`,
        output: `Prior Confidence: ${params.hypothesis.priorConfidence}% (Source: ${params.hypothesis.sourceType})`,
        status: "VERIFIED",
        provenance: {
          evidenceCount: params.evidence.length,
          supportingCount: supporting.length,
          contradictingCount: contradicting.length,
        },
      },
      {
        stage: "2. HYPOTHESIS FORMULATION",
        title: "Formal Scientific Hypothesis Construction",
        input: `Domain: ${params.hypothesis.domain}`,
        transformation: "Normalized scientific statement and registered explicit expected and disconfirming observations.",
        output: params.hypothesis.statement,
        status: "VERIFIED",
        provenance: {
          hypothesisId: params.hypothesis.hypothesisId,
          snapshotHash: params.hypothesis.snapshotHash,
        },
      },
      {
        stage: "3. COMPETING EXPLANATION ANALYSIS",
        title: "Competing Alternative & Confounder Evaluation",
        input: `Active Confounders: ${params.hypothesis.activeConfounders.length > 0 ? params.hypothesis.activeConfounders.join(", ") : "None"}`,
        transformation: "Evaluated alternative explanations and determined mutual exclusivity.",
        output: `Competing Hypotheses: ${params.hypothesis.competingHypothesisIds.length} alternative(s).`,
        status: params.hypothesis.activeConfounders.length > 1 ? "CONFOUNDED" : "VERIFIED",
        provenance: {
          confounderCount: params.hypothesis.activeConfounders.length,
        },
      },
      {
        stage: "4. PREDICTION / VALIDATION DESIGN",
        title: "Deterministic Prediction & Empirical Validation Design",
        input: `${params.predictions.length} prediction(s), ${params.validationTasks.length} validation task(s)`,
        transformation: "Defined quantitative test parameters, tolerance margins, and control requirements.",
        output: params.validationTasks[0]?.validationQuestion || "Validation sweep defined.",
        status: "EVALUATED",
        provenance: {
          predictionCount: params.predictions.length,
          taskCount: params.validationTasks.length,
        },
      },
      {
        stage: "5. VALIDATION RECONCILIATION",
        title: "Falsification & Validation Outcome Assessment",
        input: `Falsification Strength: ${params.hypothesis.falsificationStrength}`,
        transformation: `Reconciled confidence to ${params.hypothesis.currentConfidence}% (${params.hypothesis.confidenceBand}) and updated status to ${params.hypothesis.status}.`,
        output: `Hypothesis Status: ${params.hypothesis.status} (Causal Established: ${params.hypothesis.causalStatus})`,
        status: params.hypothesis.status === "FALSIFIED" ? "EXCLUDED" : "VERIFIED",
        provenance: {
          status: params.hypothesis.status,
          currentConfidence: params.hypothesis.currentConfidence,
          falsificationStrength: params.hypothesis.falsificationStrength,
        },
      },
      {
        stage: "6. RESEARCH HEALTH / LEDGER DECISION",
        title: "Research Health Reconciliation & Verified Ledger Candidate Gate",
        input: params.reconciliation
          ? `Impact: ${params.reconciliation.newHealthImpact}`
          : "Health reconciliation evaluated.",
        transformation: params.hypothesis.status === "SUPPORTED" && params.hypothesis.currentConfidence >= 85
          ? "Proposed as Verified Candidate for Phase 86 calibration review."
          : "Retained in observational hypothesis queue.",
        output: params.reconciliation?.recommendedAction || "Reconciliation completed.",
        status: "VERIFIED",
        provenance: {
          healthImpact: params.reconciliation?.newHealthImpact,
          isVerifiedCandidate: params.hypothesis.status === "VERIFIED_CANDIDATE",
        },
      },
    ];

    const exclusions: string[] = [];
    if (params.hypothesis.activeConfounders.length > 0) {
      exclusions.push(`Excluded from causal attribution due to active confounders: ${params.hypothesis.activeConfounders.join(", ")}.`);
    }
    if (contradicting.length > 0) {
      exclusions.push(`Contradictory evidence items noted: ${contradicting.map((c) => c.evidenceId).join(", ")}.`);
    }

    return {
      lineageId,
      hypothesisId: params.hypothesis.hypothesisId,
      userId: params.hypothesis.userId,
      researchRunId: params.hypothesis.researchRunId,
      stages,
      exclusions,
      generatedAt: new Date().toISOString(),
    };
  }
}
