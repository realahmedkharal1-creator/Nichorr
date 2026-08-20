import {
  ExpectedPublicationState,
  ObservedPublicationState,
  PublicationLineageLink,
  PublicationLineageTrace,
  ReconciliationStatus,
} from "./publication-integrity.types";
import { PublishingTargetPlatform } from "../publishing/publishing.types";

export class PublicationLineageEngine {
  /**
   * Builds deterministic end-to-end lineage from research run to observed integrity state.
   */
  static traceLineage(params: {
    researchRunId: string;
    publicationId: string;
    platform: PublishingTargetPlatform;
    expectedState: ExpectedPublicationState;
    observedState: ObservedPublicationState;
    distributionReceiptId?: string;
    reconciliationStatus: ReconciliationStatus;
  }): PublicationLineageTrace {
    const links: PublicationLineageLink[] = [];

    // 1. Research Run
    links.push({
      stage: "RESEARCH_RUN",
      identifier: params.researchRunId,
      status: "VALID",
      summary: `Research Run: ${params.researchRunId}`,
    });

    // 2. Evidence Snapshot
    links.push({
      stage: "EVIDENCE_SNAPSHOT",
      identifier: params.expectedState.expectedEvidenceSnapshotHash,
      status: "VALID",
      summary: `Verified Evidence Graph Snapshot (${params.expectedState.expectedEvidenceSnapshotHash})`,
      upstreamId: params.researchRunId,
    });

    // 3. Claim Lineage
    links.push({
      stage: "CLAIM",
      identifier: `claims-${params.researchRunId}`,
      status: "VALID",
      summary: "Verified factual claims and OEM lab benchmark citations",
      upstreamId: params.expectedState.expectedEvidenceSnapshotHash,
    });

    // 4. Script Version
    links.push({
      stage: "SCRIPT_VERSION",
      identifier: `v${params.expectedState.expectedScriptVersion}`,
      status: "VALID",
      summary: `Creator Script Version v${params.expectedState.expectedScriptVersion}`,
      upstreamId: `claims-${params.researchRunId}`,
    });

    // 5. Certification
    links.push({
      stage: "CERTIFICATION",
      identifier: params.expectedState.expectedCertificationId,
      status: "VALID",
      summary: `Integrity Certificate (${params.expectedState.expectedCertificationId})`,
      upstreamId: `v${params.expectedState.expectedScriptVersion}`,
    });

    // 6. Release Lock
    links.push({
      stage: "RELEASE_LOCK",
      identifier: params.expectedState.expectedReleaseLockId,
      status: "VALID",
      summary: `Release Lock (${params.expectedState.expectedReleaseLockId})`,
      upstreamId: params.expectedState.expectedCertificationId,
    });

    // 7. Export Package
    links.push({
      stage: "EXPORT_PACKAGE",
      identifier: params.expectedState.expectedPackageSnapshotHash,
      status: "VALID",
      summary: `Production Export Package (${params.expectedState.expectedPackageSnapshotHash})`,
      upstreamId: params.expectedState.expectedReleaseLockId,
    });

    // 8. Publishing Plan
    links.push({
      stage: "PUBLISHING_PLAN",
      identifier: `plan-${params.platform.toLowerCase()}-${params.researchRunId}`,
      status: "VALID",
      summary: `Publishing Target Plan for ${params.platform}`,
      upstreamId: params.expectedState.expectedPackageSnapshotHash,
    });

    // 9. Distribution Receipt
    if (params.distributionReceiptId) {
      links.push({
        stage: "DISTRIBUTION_RECEIPT",
        identifier: params.distributionReceiptId,
        status: "VALID",
        summary: `Distribution Receipt: ${params.distributionReceiptId}`,
        upstreamId: `plan-${params.platform.toLowerCase()}-${params.researchRunId}`,
      });
    }

    // 10. Publication Target
    links.push({
      stage: "PUBLICATION",
      identifier: params.publicationId,
      status: "VALID",
      summary: `Publication Target: ${params.expectedState.publicationTarget}`,
      upstreamId: params.distributionReceiptId || `plan-${params.platform.toLowerCase()}-${params.researchRunId}`,
    });

    // 11. Observed Platform State
    links.push({
      stage: "OBSERVED_PLATFORM_STATE",
      identifier: params.observedState.observationId,
      status: params.observedState.isAvailable ? "VALID" : "UNAVAILABLE",
      summary: params.observedState.isAvailable
        ? `Observed ${params.platform} state (${params.observedState.observedTitle || "Active"})`
        : `Platform state unavailable: ${params.observedState.unavailabilityReason || "Not configured"}`,
      upstreamId: params.publicationId,
    });

    // 12. Integrity Result
    links.push({
      stage: "INTEGRITY_RESULT",
      identifier: `res-${params.publicationId}`,
      status: params.reconciliationStatus === "MATCHED" ? "VALID" : params.reconciliationStatus === "CHANGED" ? "DRIFTED" : params.reconciliationStatus === "STALE" ? "STALE" : "UNVERIFIABLE",
      summary: `Reconciliation Integrity Status: ${params.reconciliationStatus}`,
      upstreamId: params.observedState.observationId,
    });

    return {
      publicationId: params.publicationId,
      platform: params.platform,
      isLineageAvailable: true,
      links,
    };
  }
}
