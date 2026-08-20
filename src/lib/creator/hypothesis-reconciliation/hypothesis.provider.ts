import {
  ResearchHypothesis,
  CompetingHypothesisGroup,
  EvidenceAttachment,
  HypothesisPrediction,
  HypothesisValidationTask,
  HypothesisHealthReconciliation,
  HypothesisLineageTrace,
  HypothesisGraph,
  HypothesisStatus,
} from "./hypothesis.types";
import { HypothesisRegistryEngine } from "./hypothesis.registry.engine";
import { HypothesisEvidenceEngine } from "./hypothesis.evidence.engine";
import { HypothesisCompetitionEngine } from "./hypothesis.competition.engine";
import { HypothesisPredictionEngine } from "./hypothesis.prediction.engine";
import { HypothesisConfidenceEngine } from "./hypothesis.confidence.engine";
import { HypothesisFalsificationEngine } from "./hypothesis.falsification.engine";
import { HypothesisConfounderEngine } from "./hypothesis.confounder.engine";
import { HypothesisValidationEngine } from "./hypothesis.validation.engine";
import { HypothesisReconciliationEngine } from "./hypothesis.reconciliation.engine";
import { HypothesisGraphEngine } from "./hypothesis.graph.engine";
import { HypothesisOpportunityEngine, HypothesisOpportunity } from "./hypothesis.opportunity.engine";
import { HypothesisSnapshotEngine } from "./hypothesis.snapshot.engine";
import { HypothesisAuditService } from "./hypothesis.audit";
import { HypothesisLineageEngine } from "./hypothesis.lineage.engine";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

export class HypothesisReconciliationProvider {
  private static hypothesisStore: Map<string, ResearchHypothesis[]> = new Map();
  private static evidenceStore: Map<string, EvidenceAttachment[]> = new Map();
  private static predictionStore: Map<string, HypothesisPrediction[]> = new Map();
  private static validationTaskStore: Map<string, HypothesisValidationTask[]> = new Map();
  private static competingGroupStore: Map<string, CompetingHypothesisGroup[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  private static initializeStateIfMissing(researchRunId: string, userId: string) {
    const key = this.getPartitionKey(researchRunId, userId);
    let hypotheses = this.hypothesisStore.get(key);
    let evidence = this.evidenceStore.get(key);
    let predictions = this.predictionStore.get(key);
    let validationTasks = this.validationTaskStore.get(key);
    let competingGroups = this.competingGroupStore.get(key);

    if (!hypotheses) {
      hypotheses = HypothesisRegistryEngine.createDefaultHypotheses(userId, researchRunId);
      this.hypothesisStore.set(key, hypotheses);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("hypothesisStore", "Artifact", key, hypotheses).catch(e => console.warn(e));

      // Default evidence for H1
      const ev1 = HypothesisEvidenceEngine.attachEvidence({
        hypothesisId: hypotheses[0].hypothesisId,
        relationship: "SUPPORTING",
        rationale: "Phase 93 PMU Execution trace indicates 32% of stall cycles spent on DRAM memory bus wait states.",
        evidenceType: "EXECUTION_TRACE",
        sourcePhase: "Phase 93",
        sourceEntityId: "matt-5090-mem-01",
        methodologyFingerprint: "mfp-cp2077-4k",
      });

      const ev2 = HypothesisEvidenceEngine.attachEvidence({
        hypothesisId: hypotheses[0].hypothesisId,
        relationship: "COMPATIBLE",
        rationale: "Phase 94 Co-design simulation with +14.2% memory bandwidth simulated +10.1% throughput uplift.",
        evidenceType: "CO_DESIGN_SIMULATION",
        sourcePhase: "Phase 94",
        sourceEntityId: "cdsim-5090-whatif-01",
        methodologyFingerprint: "mfp-cp2077-4k",
      });

      // Default contradicting evidence for H3
      const ev3 = HypothesisEvidenceEngine.attachEvidence({
        hypothesisId: hypotheses[2].hypothesisId,
        relationship: "CONTRADICTING",
        rationale: "Physical testbench comparison shows identical frame pacing behavior across Windows 10 and Windows 11 24H2.",
        evidenceType: "PHYSICAL_MEASUREMENT",
        sourcePhase: "Phase 90",
        sourceEntityId: "tb-run-5090-w10-w11",
        methodologyFingerprint: "mfp-cp2077-4k",
      });

      evidence = [ev1, ev2, ev3];
      this.evidenceStore.set(key, evidence);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("evidenceStore", "Artifact", key, evidence).catch(e => console.warn(e));

      // Default prediction for H1
      const pred1 = HypothesisPredictionEngine.createPrediction({
        hypothesisId: hypotheses[0].hypothesisId,
        expectedMetric: "Frame Rate (FPS)",
        expectedDirection: "INCREASE",
        expectedRange: [118.0, 130.0],
        tolerancePercentage: 5.0,
      });

      predictions = [pred1];
      this.predictionStore.set(key, predictions);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("predictionStore", "Artifact", key, predictions).catch(e => console.warn(e));

      // Default validation task for H1
      const task1 = HypothesisValidationEngine.createValidationTask({
        hypothesis: hypotheses[0],
      });

      validationTasks = [task1];
      this.validationTaskStore.set(key, validationTasks);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("validationTaskStore", "Artifact", key, validationTasks).catch(e => console.warn(e));

      // Competing group
      const grp1 = HypothesisCompetitionEngine.createCompetingGroup({
        title: "RTX 5090 4K RT Stalling Mechanism Competitors",
        targetObservation: "18.4% frame time degradation in Cyberpunk 2077 4K RT Overdrive",
        hypotheses: [hypotheses[0], hypotheses[1], hypotheses[2]],
      });

      competingGroups = [grp1];
      this.competingGroupStore.set(key, competingGroups);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("competingGroupStore", "Artifact", key, competingGroups).catch(e => console.warn(e));

      // Link IDs
      hypotheses[0].supportingEvidenceIds = [ev1.evidenceId];
      hypotheses[0].compatibleEvidenceIds = [ev2.evidenceId];
      hypotheses[0].competingHypothesisIds = [hypotheses[1].hypothesisId, hypotheses[2].hypothesisId];
      hypotheses[0].requiredValidationTasks = [task1.taskId];

      hypotheses[2].contradictoryEvidenceIds = [ev3.evidenceId];

      HypothesisAuditService.log(
        userId,
        researchRunId,
        "HYPOTHESIS_FORMULATED",
        hypotheses[0].hypothesisId,
        "creator-system",
        "Initialized default competing hypothesis registry."
      );
    }

    return {
      hypotheses: hypotheses || [],
      evidence: evidence || [],
      predictions: predictions || [],
      validationTasks: validationTasks || [],
      competingGroups: competingGroups || [],
    };
  }

  public static getState(researchRunId: string, userId: string) {
    const { hypotheses, evidence, predictions, validationTasks, competingGroups } =
      this.initializeStateIfMissing(researchRunId, userId);

    const reconciliations: HypothesisHealthReconciliation[] = [];

    // Reconcile each hypothesis
    for (const h of hypotheses) {
      const hEvidence = evidence.filter((e) => e.hypothesisId === h.hypothesisId);
      const hPreds = predictions.filter((p) => p.hypothesisId === h.hypothesisId);
      const hTasks = validationTasks.filter((t) => t.hypothesisId === h.hypothesisId);

      const confResult = HypothesisConfidenceEngine.calculateConfidence({
        priorConfidence: h.priorConfidence,
        evidence: hEvidence,
        predictions: hPreds,
        activeConfounders: h.activeConfounders,
      });

      const falsResult = HypothesisFalsificationEngine.evaluateFalsification({
        evidence: hEvidence,
        predictions: hPreds,
        disconfirmingObservations: h.disconfirmingObservations,
      });

      h.currentConfidence = confResult.confidenceScore;
      h.confidenceBand = confResult.confidenceBand;
      h.confidenceFactors = confResult.confidenceFactors;
      h.falsificationStrength = falsResult.falsificationStrength;

      const hasPendingVal = hTasks.some((t) => t.validationStatus === "VALIDATION_PENDING");
      h.status = HypothesisFalsificationEngine.reconcileHypothesisStatus(
        h.status,
        falsResult.isFalsified,
        confResult.confidenceScore,
        hasPendingVal
      );

      const rec = HypothesisReconciliationEngine.reconcileWithResearchHealth(
        h,
        researchRunId,
        ["Cyberpunk 2077 4K RT Overdrive Throughput Benchmark"]
      );

      reconciliations.push(rec);
    }

    const opportunities = HypothesisOpportunityEngine.generateOpportunities({
      userId,
      researchRunId,
      hypotheses,
      competingGroups,
    });

    const graph = HypothesisGraphEngine.buildGraph({
      hypotheses,
      evidence,
      predictions,
      validationTasks,
    });

    const snapshot = HypothesisSnapshotEngine.createSnapshot(
      userId,
      researchRunId,
      hypotheses,
      competingGroups,
      evidence,
      predictions,
      validationTasks,
      reconciliations
    );

    const history = HypothesisAuditService.getLedger(researchRunId, userId);

    return {
      hypotheses,
      competingGroups,
      evidence,
      predictions,
      validationTasks,
      reconciliations,
      opportunities,
      graph,
      snapshot,
      history,
    };
  }

  public static createHypothesis(
    researchRunId: string,
    userId: string,
    params: Partial<ResearchHypothesis>
  ): ResearchHypothesis {
    const { hypotheses } = this.initializeStateIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const hypothesis = HypothesisRegistryEngine.createHypothesis({
      userId,
      researchRunId,
      title: params.title || "Custom Research Hypothesis",
      statement: params.statement || "Hypothesized architectural interaction statement.",
      domain: params.domain || "MICROARCHITECTURAL",
      ...params,
    });

    hypotheses.push(hypothesis);
    this.hypothesisStore.set(key, hypotheses);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("hypothesisStore", "Artifact", key, hypotheses).catch(e => console.warn(e));

    HypothesisAuditService.log(
      userId,
      researchRunId,
      "HYPOTHESIS_FORMULATED",
      hypothesis.hypothesisId,
      "creator-lead",
      `Formulated scientific hypothesis '${hypothesis.title}'.`
    );

    return hypothesis;
  }

  public static attachEvidence(
    researchRunId: string,
    userId: string,
    params: {
      hypothesisId: string;
      relationship: EvidenceAttachment["relationship"];
      rationale: string;
      evidenceType: EvidenceAttachment["evidenceType"];
      sourcePhase: string;
      sourceEntityId: string;
      methodologyFingerprint: string;
    }
  ): EvidenceAttachment {
    const { evidence, hypotheses } = this.initializeStateIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const attachment = HypothesisEvidenceEngine.attachEvidence(params);
    evidence.push(attachment);
    this.evidenceStore.set(key, evidence);
    CreatorIntelligenceRepo.saveArtifact("evidenceStore", "Artifact", key, evidence).catch(e => console.warn(e));

    const hyp = hypotheses.find((h) => h.hypothesisId === params.hypothesisId);
    if (hyp) {
      if (params.relationship === "SUPPORTING") hyp.supportingEvidenceIds.push(attachment.evidenceId);
      else if (params.relationship === "CONTRADICTING") hyp.contradictoryEvidenceIds.push(attachment.evidenceId);
      else if (params.relationship === "COMPATIBLE") hyp.compatibleEvidenceIds.push(attachment.evidenceId);
      else hyp.unresolvedEvidenceIds.push(attachment.evidenceId);
    }

    HypothesisAuditService.log(
      userId,
      researchRunId,
      "EVIDENCE_ATTACHED",
      attachment.evidenceId,
      "creator-lead",
      `Attached ${params.relationship} evidence (${params.evidenceType}) to hypothesis '${params.hypothesisId}'.`
    );

    return attachment;
  }

  public static bridgeValidationTask(
    researchRunId: string,
    userId: string,
    taskId: string
  ) {
    const { validationTasks } = this.initializeStateIfMissing(researchRunId, userId);
    const task = validationTasks.find((t) => t.taskId === taskId);

    if (!task) {
      return { success: false, message: "Validation task not found." };
    }

    return HypothesisValidationEngine.bridgeToCalibrationQueue(task, userId, researchRunId);
  }

  public static getLineage(
    researchRunId: string,
    userId: string,
    hypothesisId: string
  ): HypothesisLineageTrace | null {
    const state = this.getState(researchRunId, userId);
    const hyp = state.hypotheses.find((h) => h.hypothesisId === hypothesisId) || state.hypotheses[0];
    if (!hyp) return null;

    const hypEvidence = state.evidence.filter((e) => e.hypothesisId === hyp.hypothesisId);
    const hypPreds = state.predictions.filter((p) => p.hypothesisId === hyp.hypothesisId);
    const hypTasks = state.validationTasks.filter((t) => t.hypothesisId === hyp.hypothesisId);
    const hypRec = state.reconciliations.find((r) => r.hypothesisId === hyp.hypothesisId);

    return HypothesisLineageEngine.generateTrace({
      hypothesis: hyp,
      evidence: hypEvidence,
      predictions: hypPreds,
      validationTasks: hypTasks,
      reconciliation: hypRec,
    });
  }
}
