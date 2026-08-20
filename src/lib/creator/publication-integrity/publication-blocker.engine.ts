import { PublicationIntegrityBlocker } from "./publication-integrity.types";

export class PublicationBlockerEngine {
  /**
   * Evaluates non-bypassable hard safety and integrity blockers for a publication.
   */
  static evaluateBlockers(params: {
    publicationId: string;
    affectedAssetId?: string;
    activeSafetyBlockers?: string[];
    isEvidenceSnapshotValid?: boolean;
    isCertificationValid?: boolean;
    isReleaseLockValid?: boolean;
    isPackageIntegrityValid?: boolean;
    isContentIdentityMatched?: boolean;
    isPublicationIdentityConflicted?: boolean;
  }): PublicationIntegrityBlocker[] {
    const blockers: PublicationIntegrityBlocker[] = [];

    // 1. Evidence Safety Plane Blockers (DO_NOT_SAY, UNBACKED, CONFLICTED)
    if (params.activeSafetyBlockers && params.activeSafetyBlockers.length > 0) {
      for (const blk of params.activeSafetyBlockers) {
        let code = "SAFETY_VIOLATION";
        if (blk.includes("DO_NOT_SAY")) code = "DO_NOT_SAY";
        else if (blk.includes("UNBACKED")) code = "UNBACKED";
        else if (blk.includes("CONFLICTED")) code = "CONFLICTED";

        blockers.push({
          blockerId: `blk-safety-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          severity: "CRITICAL",
          subsystem: "Research Evidence & Claims Safety Plane",
          affectedPublicationId: params.publicationId,
          affectedAssetId: params.affectedAssetId,
          reason: `Authoritative evidence violation active: ${blk}`,
          upstreamCause: `Claim flagged as ${code}`,
          evidence: blk,
          requiredAction: "Resolve research claim contradiction or remove unbacked statement via Phase 78 Safe Execution.",
        });
      }
    }

    // 2. Evidence Snapshot Drift
    if (params.isEvidenceSnapshotValid === false) {
      blockers.push({
        blockerId: `blk-esnap-${Date.now().toString(36)}`,
        severity: "CRITICAL",
        subsystem: "Phase 74-75 Verified Evidence Graph",
        affectedPublicationId: params.publicationId,
        affectedAssetId: params.affectedAssetId,
        reason: "Evidence snapshot hash mismatch: verified facts or benchmark records changed upstream.",
        upstreamCause: "Evidence graph mutated after publication certification",
        evidence: "Upstream evidence hash does not match certified release hash",
        requiredAction: "Re-verify claims and update certification through Phase 79.",
      });
    }

    // 3. Certification Invalidation
    if (params.isCertificationValid === false) {
      blockers.push({
        blockerId: `blk-cert-${Date.now().toString(36)}`,
        severity: "CRITICAL",
        subsystem: "Phase 79 Project Integrity Certification",
        affectedPublicationId: params.publicationId,
        affectedAssetId: params.affectedAssetId,
        reason: "Project integrity certificate is invalidated, missing, or broken.",
        upstreamCause: "Integrity certification invalidated",
        evidence: "Certificate status is INVALIDATED or STALE",
        requiredAction: "Perform project certification in Phase 79 control plane.",
      });
    }

    // 4. Release Lock Invalidation
    if (params.isReleaseLockValid === false) {
      blockers.push({
        blockerId: `blk-rlock-${Date.now().toString(36)}`,
        severity: "CRITICAL",
        subsystem: "Phase 79 Immutable Release Lock",
        affectedPublicationId: params.publicationId,
        affectedAssetId: params.affectedAssetId,
        reason: "Release lock is invalidated or drifted from certified release state.",
        upstreamCause: "Release lock unlocked or mismatched",
        evidence: "Release lock record does not match active release",
        requiredAction: "Re-establish release lock before release verification.",
      });
    }

    // 5. Package Integrity Failure
    if (params.isPackageIntegrityValid === false) {
      blockers.push({
        blockerId: `blk-pkg-${Date.now().toString(36)}`,
        severity: "CRITICAL",
        subsystem: "Phase 83 Production Export Package",
        affectedPublicationId: params.publicationId,
        affectedAssetId: params.affectedAssetId,
        reason: "Export package integrity failure or package hash mismatch.",
        upstreamCause: "Export package failed multi-format validation",
        evidence: "Package snapshot hash mismatch",
        requiredAction: "Re-export and validate Phase 83 package.",
      });
    }

    // 6. Content Identity Mismatch
    if (params.isContentIdentityMatched === false) {
      blockers.push({
        blockerId: `blk-cid-${Date.now().toString(36)}`,
        severity: "HIGH",
        subsystem: "Publication Content Reconciliation",
        affectedPublicationId: params.publicationId,
        affectedAssetId: params.affectedAssetId,
        reason: "Live platform media asset fingerprint does not match certified package asset.",
        upstreamCause: "Video or audio stream was replaced on external platform",
        evidence: "Observed asset fingerprint differs from expected asset hash",
        requiredAction: "Investigate external platform upload or re-stage certified asset.",
      });
    }

    // 7. Publication Identity Conflict
    if (params.isPublicationIdentityConflicted === true) {
      blockers.push({
        blockerId: `blk-pid-conf-${Date.now().toString(36)}`,
        severity: "CRITICAL",
        subsystem: "Publication Identity Reconciliation",
        affectedPublicationId: params.publicationId,
        affectedAssetId: params.affectedAssetId,
        reason: "Publication identity conflict: same platform target bound to multiple divergent publication IDs.",
        upstreamCause: "Divergent external publication IDs detected for target",
        evidence: "Conflicting external IDs recorded in receipts and live state",
        requiredAction: "Resolve publication identity conflict in publishing orchestrator.",
      });
    }

    return blockers;
  }
}
