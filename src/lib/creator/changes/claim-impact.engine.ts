import { ResearchRunSession } from "@/features/research/research-engine";
import { ResearchChange, ClaimImpact, ClaimImpactStatus, ChangeSeverity } from "./research-changes.types";

export class ClaimImpactEngine {
  /**
   * Evaluates the downstream impact of detected research changes on all research claims.
   */
  static evaluateClaimImpacts(
    session: ResearchRunSession,
    changes: ResearchChange[]
  ): ClaimImpact[] {
    const claimImpacts: ClaimImpact[] = [];
    const claims = session.claims || [];

    for (const claim of claims) {
      const directChanges = changes.filter(
        (c) =>
          c.affectedClaimIds.includes(claim.id) ||
          c.entityId === claim.id ||
          (c.entityName && claim.claim_text.toLowerCase().includes(c.entityName.toLowerCase()))
      );

      if (directChanges.length === 0) {
        // Unaffected claim
        claimImpacts.push({
          claimId: claim.id,
          claimStatement: claim.claim_text,
          previousStatus: claim.status || "VERIFIED",
          currentStatus: "UNCHANGED",
          severity: "INFO",
          causingChangeIds: [],
          reason: "No changes detected in supporting sources, benchmarks, or evidence.",
          hasAlternateEvidence: true,
          actionRequired: false,
        });
        continue;
      }

      // Determine most severe change
      let currentStatus: ClaimImpactStatus = "NEEDS_REVIEW";
      let maxSeverity: ChangeSeverity = "LOW";
      let actionRequired = true;
      let reason = "Claim affected by upstream research changes.";

      const hasCritical = directChanges.some((c) => c.severity === "CRITICAL");
      const hasHigh = directChanges.some((c) => c.severity === "HIGH");
      const hasMethodology = directChanges.some((c) => c.changeType === "BENCHMARK_METHODOLOGY_CHANGED");
      const hasSourceRemoved = directChanges.some((c) => c.changeType === "SOURCE_REMOVED");
      const hasStatusChange = directChanges.find((c) => c.changeType === "CLAIM_STATUS_CHANGED");

      if (hasStatusChange && hasStatusChange.currentValue === "DO_NOT_SAY") {
        currentStatus = "BLOCKED";
        maxSeverity = "CRITICAL";
        reason = "Claim was marked DO_NOT_SAY due to factuality violation.";
      } else if (hasStatusChange && hasStatusChange.currentValue === "CONFLICTED") {
        currentStatus = "CONFLICTED";
        maxSeverity = "CRITICAL";
        reason = "Claim now has conflicting evidence from multiple independent sources.";
      } else if (hasMethodology) {
        currentStatus = "NEEDS_CONTEXT";
        maxSeverity = "CRITICAL";
        reason = "Underlying benchmark test methodology changed. Requires context notes in script.";
      } else if (hasSourceRemoved) {
        // Check for alternate evidence
        const alternateEvidence = (session.evidence || []).filter(
          (e) => (claim.evidence_ids || []).includes(e.id)
        );
        const hasAlternate = alternateEvidence.length > 1;

        if (hasAlternate) {
          currentStatus = "SUPPORTED";
          maxSeverity = "MEDIUM";
          actionRequired = false;
          reason = "Primary source removed, but claim remains supported by alternate verified lab evidence.";
        } else {
          currentStatus = "UNBACKED";
          maxSeverity = "HIGH";
          reason = "Source removed and no alternate evidence found in research pool.";
        }
      } else if (hasHigh || hasCritical) {
        currentStatus = "NEEDS_REVIEW";
        maxSeverity = hasCritical ? "CRITICAL" : "HIGH";
        reason = "Material benchmark score or spec change detected.";
      }

      claimImpacts.push({
        claimId: claim.id,
        claimStatement: claim.claim_text,
        previousStatus: claim.status || "VERIFIED",
        currentStatus,
        severity: maxSeverity,
        causingChangeIds: directChanges.map((c) => c.id),
        reason,
        hasAlternateEvidence: true,
        actionRequired,
      });
    }

    return claimImpacts;
  }
}
