import crypto from "crypto";
import {
  EvidenceAttachment,
  EvidenceRelationshipType,
  EvidenceSourceType,
} from "./hypothesis.types";

export class HypothesisEvidenceEngine {
  public static attachEvidence(params: {
    hypothesisId: string;
    relationship: EvidenceRelationshipType;
    rationale: string;
    evidenceType: EvidenceSourceType;
    sourcePhase: string;
    sourceEntityId: string;
    methodologyFingerprint: string;
    confidenceImpact?: number;
    causalRelevance?: boolean;
  }): EvidenceAttachment {
    const rawPayload = JSON.stringify({
      hypothesisId: params.hypothesisId,
      relationship: params.relationship,
      sourceEntityId: params.sourceEntityId,
      methodologyFingerprint: params.methodologyFingerprint,
    });

    const snapshotHash = crypto.createHash("sha256").update(rawPayload).digest("hex");
    const evidenceId = `hye-${snapshotHash.slice(0, 16)}`;

    let confidenceImpact = params.confidenceImpact;
    if (confidenceImpact === undefined) {
      if (params.relationship === "SUPPORTING") confidenceImpact = 12;
      else if (params.relationship === "CONTRADICTING") confidenceImpact = -20;
      else if (params.relationship === "COMPATIBLE") confidenceImpact = 4;
      else confidenceImpact = 0;
    }

    return {
      evidenceId,
      hypothesisId: params.hypothesisId,
      relationship: params.relationship,
      rationale: params.rationale,
      evidenceType: params.evidenceType,
      sourcePhase: params.sourcePhase,
      sourceEntityId: params.sourceEntityId,
      methodologyFingerprint: params.methodologyFingerprint,
      snapshotHash,
      confidenceImpact,
      causalRelevance: params.causalRelevance || false, // Strict non-causal default
      createdAt: new Date().toISOString(),
    };
  }
}
