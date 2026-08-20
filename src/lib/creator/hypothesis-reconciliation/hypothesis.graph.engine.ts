import {
  HypothesisGraph,
  HypothesisGraphNode,
  HypothesisGraphEdge,
  ResearchHypothesis,
  EvidenceAttachment,
  HypothesisPrediction,
  HypothesisValidationTask,
} from "./hypothesis.types";

export class HypothesisGraphEngine {
  public static buildGraph(params: {
    hypotheses: ResearchHypothesis[];
    evidence: EvidenceAttachment[];
    predictions: HypothesisPrediction[];
    validationTasks: HypothesisValidationTask[];
  }): HypothesisGraph {
    const nodes: HypothesisGraphNode[] = [];
    const edges: HypothesisGraphEdge[] = [];

    // Hypotheses
    for (const h of params.hypotheses) {
      nodes.push({
        id: h.hypothesisId,
        label: h.title,
        type: "HYPOTHESIS",
        status: h.status,
        data: {
          domain: h.domain,
          confidence: h.currentConfidence,
          band: h.confidenceBand,
          causalStatus: h.causalStatus,
        },
      });

      if (h.status === "VERIFIED_CANDIDATE") {
        const candId = `cand-${h.hypothesisId}`;
        nodes.push({
          id: candId,
          label: `Ledger Candidate: ${h.title}`,
          type: "LEDGER_CANDIDATE",
          status: "PENDING_PROMOTION_GATE",
          data: { hypothesisId: h.hypothesisId },
        });

        edges.push({
          id: `edge-cand-${h.hypothesisId}`,
          source: h.hypothesisId,
          target: candId,
          type: "RECONCILES",
          label: "proposes candidate",
        });
      }
    }

    // Evidence
    for (const e of params.evidence) {
      nodes.push({
        id: e.evidenceId,
        label: `${e.evidenceType} (${e.sourcePhase})`,
        type: "EVIDENCE",
        status: e.relationship,
        data: {
          sourceEntityId: e.sourceEntityId,
          methodologyFingerprint: e.methodologyFingerprint,
          rationale: e.rationale,
        },
      });

      edges.push({
        id: `edge-ev-${e.evidenceId}-${e.hypothesisId}`,
        source: e.evidenceId,
        target: e.hypothesisId,
        type: e.relationship === "SUPPORTING" ? "SUPPORTS" : e.relationship === "CONTRADICTING" ? "CONTRADICTS" : "DERIVED_FROM",
        label: e.relationship.toLowerCase(),
        weight: e.confidenceImpact,
      });
    }

    // Predictions
    for (const p of params.predictions) {
      nodes.push({
        id: p.predictionId,
        label: `Prediction: ${p.expectedMetric} (${p.expectedDirection})`,
        type: "PREDICTION",
        status: p.result,
        data: {
          tolerance: p.tolerancePercentage,
          observedValue: p.observedValue,
        },
      });

      edges.push({
        id: `edge-pred-${p.hypothesisId}-${p.predictionId}`,
        source: p.hypothesisId,
        target: p.predictionId,
        type: "PREDICTS",
        label: "predicts",
      });
    }

    // Validation Tasks
    for (const t of params.validationTasks) {
      nodes.push({
        id: t.taskId,
        label: `Validation Task: ${t.validationQuestion.slice(0, 40)}...`,
        type: "VALIDATION_TASK",
        status: t.validationStatus,
        data: {
          priority: t.priority,
          phase86Ref: t.Phase86Reference,
        },
      });

      edges.push({
        id: `edge-task-${t.hypothesisId}-${t.taskId}`,
        source: t.taskId,
        target: t.hypothesisId,
        type: t.validationStatus === "FALSIFIED" ? "FALSIFIES" : "VALIDATES",
        label: t.validationStatus === "FALSIFIED" ? "falsifies" : "validates",
      });
    }

    return {
      nodes,
      edges,
      generatedAt: new Date().toISOString(),
    };
  }
}
