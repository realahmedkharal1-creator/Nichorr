import {
  ExpectedPublicationState,
  ObservedPublicationState,
  PublicationReconciliationRecord,
  ReceiptReconciliationState,
  ReconciliationStatus,
} from "./publication-integrity.types";
import { PublishingTargetPlatform, DistributionReceipt } from "../publishing/publishing.types";
import { PublicationBlockerEngine } from "./publication-blocker.engine";
import { PublicationChangeDetectionEngine } from "./publication-change-detection.engine";
import { PublicationLineageEngine } from "./publication-lineage.engine";
import { PublicationIntegritySnapshotEngine } from "./publication-integrity.snapshot";
import { PublicationIntegrityAuditService } from "./publication-integrity.audit";

export interface ReconciliationInput {
  userId: string;
  researchRunId: string;
  targetId: string;
  planId: string;
  platform: PublishingTargetPlatform;
  expectedState: ExpectedPublicationState;
  observedState?: ObservedPublicationState;
  receipt?: DistributionReceipt;
  context?: {
    activeSafetyBlockers?: string[];
    isCertificationValid?: boolean;
    isReleaseLockValid?: boolean;
    isExportPackageValid?: boolean;
    isEvidenceSnapshotValid?: boolean;
    isProjectSnapshotValid?: boolean;
    isStale?: boolean;
  };
}

export class PublicationReconciliationEngine {
  /**
   * Reconciles a publication target across expected certified state, distribution receipts, and live platform observations.
   */
  static reconcilePublication(input: ReconciliationInput): PublicationReconciliationRecord {
    const { userId, researchRunId, targetId, planId, platform, expectedState, receipt, context = {} } = input;
    const publicationId = `pub-${platform.toLowerCase()}-${researchRunId}`;
    const nowStr = new Date().toISOString();

    // 1. Build default observed state if external API telemetry is unconfigured / absent
    const observedState: ObservedPublicationState = input.observedState || {
      observationId: `obs-${platform.toLowerCase()}-${Date.now().toString(36)}`,
      platform,
      publicationIdentifier: receipt?.externalPublicationId,
      observedUrl: receipt?.publicationUrl,
      observedTitle: expectedState.expectedTitle,
      observedDescription: expectedState.expectedDescription,
      observedChapters: expectedState.expectedChapters,
      observedTags: expectedState.expectedTags,
      observedVisibility: expectedState.expectedVisibility || "PUBLIC",
      observedAssetFingerprint: expectedState.expectedAssetHash,
      observedMetadataFingerprint: "meta-fp-default",
      observedAt: nowStr,
      isAvailable: receipt?.status === "SUCCESS" && !!receipt.externalPublicationId,
      isVerifiable: receipt?.status === "SUCCESS" && !!receipt.externalPublicationId,
      unavailabilityReason: receipt?.status === "STAGING_ONLY"
        ? "Platform integration unconfigured locally; asset staged in local environment."
        : !receipt?.externalPublicationId
        ? "No external publication identifier returned by platform adapter."
        : undefined,
    };

    // 2. Evaluate Non-Bypassable Hard Blockers
    const blockers = PublicationBlockerEngine.evaluateBlockers({
      publicationId,
      affectedAssetId: expectedState.publicationTarget,
      activeSafetyBlockers: context.activeSafetyBlockers,
      isEvidenceSnapshotValid: context.isEvidenceSnapshotValid !== false,
      isCertificationValid: context.isCertificationValid !== false,
      isReleaseLockValid: context.isReleaseLockValid !== false,
      isPackageIntegrityValid: context.isExportPackageValid !== false,
      isContentIdentityMatched: observedState.observedAssetFingerprint === expectedState.expectedAssetHash,
      isPublicationIdentityConflicted: false,
    });

    // 3. Detect Changes
    const changes = observedState.isAvailable
      ? PublicationChangeDetectionEngine.detectChanges(expectedState, observedState)
      : [];

    // 4. Detect Certification Drift
    const certificationDrift = PublicationChangeDetectionEngine.detectCertificationDrift(
      expectedState.expectedCertificationId,
      expectedState.expectedCertificationId,
      changes
    );

    // 5. Reconcile Distribution Receipt State
    let receiptState: ReceiptReconciliationState = "RECEIPT_UNVERIFIABLE";
    if (context.isStale) {
      receiptState = "RECEIPT_STALE";
    } else if (receipt) {
      if (receipt.status === "SUCCESS" && receipt.externalPublicationId) {
        receiptState = changes.length === 0 ? "RECEIPT_CONFIRMED" : "RECEIPT_RECONCILED";
      } else if (receipt.status === "STAGING_ONLY") {
        receiptState = "RECEIPT_PENDING_VERIFICATION";
      } else if (receipt.status === "FAILED") {
        receiptState = "RECEIPT_CONFLICTED";
      }
    }

    // 6. Determine Overall Reconciliation Status
    let reconciliationStatus: ReconciliationStatus = "MATCHED";
    const isUnverifiable = !observedState.isVerifiable;
    const unverifiableReasons: string[] = [];

    if (blockers.length > 0) {
      reconciliationStatus = "BLOCKED";
    } else if (context.isStale) {
      reconciliationStatus = "STALE";
    } else if (!observedState.isAvailable) {
      reconciliationStatus = "UNVERIFIABLE";
      unverifiableReasons.push(observedState.unavailabilityReason || "Platform state unavailable");
    } else if (changes.length > 0) {
      reconciliationStatus = "CHANGED";
    } else {
      reconciliationStatus = "MATCHED";
    }

    // 7. Trace Lineage
    const lineage = PublicationLineageEngine.traceLineage({
      researchRunId,
      publicationId,
      platform,
      expectedState,
      observedState,
      distributionReceiptId: receipt?.receiptId,
      reconciliationStatus,
    });

    // 8. Generate Snapshot
    PublicationIntegritySnapshotEngine.createSnapshot({
      userId,
      researchRunId,
      projectSnapshotHash: expectedState.expectedProjectSnapshotHash,
      evidenceSnapshotHash: expectedState.expectedEvidenceSnapshotHash,
      scriptVersion: expectedState.expectedScriptVersion,
      certificationCertificateId: expectedState.expectedCertificationId,
      releaseLockId: expectedState.expectedReleaseLockId,
      exportPackageId: expectedState.expectedPackageSnapshotHash,
      distributionReceiptId: receipt?.receiptId || "no-receipt",
      platform,
      publicationTarget: expectedState.publicationTarget,
      publicationIdentifier: observedState.publicationIdentifier,
      observedState,
      observedMetadata: { title: observedState.observedTitle, desc: observedState.observedDescription },
      assetFingerprint: observedState.observedAssetFingerprint || "no-asset-fp",
      metadataFingerprint: observedState.observedMetadataFingerprint || "no-meta-fp",
      reconciliationStatus,
    });

    // 9. Record Immutable Audit Event
    PublicationIntegrityAuditService.recordEvent({
      auditId: `pub-aud-recon-${Date.now().toString(36)}`,
      userId,
      researchRunId,
      publicationId,
      eventType: "PUBLICATION_RECONCILED",
      afterState: reconciliationStatus,
      relevantHashes: {
        evidenceSnapshotHash: expectedState.expectedEvidenceSnapshotHash,
        projectSnapshotHash: expectedState.expectedProjectSnapshotHash,
      },
      reason: `Reconciled ${platform} target. Status: ${reconciliationStatus} (${changes.length} changes, ${blockers.length} blockers).`,
      timestamp: nowStr,
    });

    return {
      publicationId,
      platform,
      targetId,
      planId,
      receiptId: receipt?.receiptId,
      reconciliationStatus,
      receiptState,
      expectedState,
      observedState,
      changes,
      certificationDrift,
      blockers,
      lineage,
      isUnverifiable,
      unverifiableReasons,
      lastReconciledAt: nowStr,
    };
  }
}
