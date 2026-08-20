import {
  CrossLabValidationOpportunity,
  EvidencePromotionDecision,
} from "./cross-lab-regression.types";
import { CreatorCertificationProvider } from "../certification/creator-certification.provider";

export class EvidencePromotionEngine {
  public static evaluatePromotion(
    opportunity: CrossLabValidationOpportunity,
    params: {
      userId: string;
      researchRunId: string;
      isContradicted?: boolean;
      isMethodologyCompatible?: boolean;
      activeSafetyBlockers?: string[];
      sourceSnapshotHashMatches?: boolean;
    }
  ): EvidencePromotionDecision {
    const rejectionReasons: string[] = [];
    const activeBlockers: string[] = [...(params.activeSafetyBlockers || [])];

    // 1. Must be explicitly VALIDATED through research calibration
    if (opportunity.resolutionStatus !== "VALIDATED") {
      rejectionReasons.push(
        `Unvalidated Finding: Opportunity status is currently '${opportunity.resolutionStatus}', not 'VALIDATED'.`
      );
    }

    // 2. Reject contradicted findings
    if (params.isContradicted) {
      rejectionReasons.push("Contradicted Finding: Unresolved cross-laboratory contradiction present.");
      activeBlockers.push("CONFLICTED: Contradictory laboratory observations.");
    }

    // 3. Reject methodology incompatibility
    if (params.isMethodologyCompatible === false) {
      rejectionReasons.push("Methodology Incompatible: Cross-laboratory test parameters diverged.");
      activeBlockers.push("METHODOLOGY_MISMATCH: Incompatible test methodology.");
    }

    // 4. Reject snapshot mismatch
    if (params.sourceSnapshotHashMatches === false) {
      rejectionReasons.push("Snapshot Mismatch: Source evidence snapshot hash does not match current state.");
      activeBlockers.push("SNAPSHOT_MISMATCH: Upstream evidence snapshot diverged.");
    }

    // 5. Check certification state
    try {
      const cert = CreatorCertificationProvider.getCertificate(params.researchRunId, params.userId);
      if (cert && (cert.status === "INVALIDATED" || cert.status === "BLOCKED")) {
        rejectionReasons.push("Invalid Certification: Project certification is currently revoked or blocked.");
        activeBlockers.push("INVALID_CERTIFICATION: Revoked creator certification.");
      }
    } catch {
      // Certification provider check handled gracefully
    }

    // 6. Hard blockers check
    if (activeBlockers.some((b) => b.includes("DO_NOT_SAY") || b.includes("UNBACKED"))) {
      rejectionReasons.push("Active Epistemic Hard Blocker: DO_NOT_SAY or UNBACKED rule active.");
    }

    const canPromote = rejectionReasons.length === 0 && activeBlockers.length === 0;

    return {
      canPromote,
      opportunityId: opportunity.opportunityId,
      rejectionReasons,
      activeBlockers,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
