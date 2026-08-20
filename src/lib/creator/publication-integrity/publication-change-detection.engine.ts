import {
  CertificationDriftRecord,
  ExpectedPublicationState,
  ObservedPublicationState,
  PublicationChangeRecord,
} from "./publication-integrity.types";

export class PublicationChangeDetectionEngine {
  /**
   * Compares expected release state against observed platform state across all dimensions.
   */
  static detectChanges(
    expected: ExpectedPublicationState,
    observed: ObservedPublicationState,
    observationSource: string = "Platform State Ingestion"
  ): PublicationChangeRecord[] {
    const changes: PublicationChangeRecord[] = [];
    const nowStr = new Date().toISOString();

    // 1. Title change
    if (observed.observedTitle && observed.observedTitle !== expected.expectedTitle) {
      changes.push({
        changeId: `chg-title-${Date.now().toString(36)}`,
        fieldName: "title",
        category: "METADATA_CHANGE",
        expectedValue: expected.expectedTitle,
        observedValue: observed.observedTitle,
        observationSource,
        detectedAt: nowStr,
        severity: "WARNING",
        affectedSubsystem: "Publishing Metadata",
        recommendedAction: "Review live title change or synchronize via Phase 78 Safe Execution.",
      });
    }

    // 2. Description change
    if (observed.observedDescription && observed.observedDescription !== expected.expectedDescription) {
      changes.push({
        changeId: `chg-desc-${Date.now().toString(36)}`,
        fieldName: "description",
        category: "METADATA_CHANGE",
        expectedValue: expected.expectedDescription,
        observedValue: observed.observedDescription,
        observationSource,
        detectedAt: nowStr,
        severity: "INFO",
        affectedSubsystem: "Publishing Metadata",
        recommendedAction: "Review description updates to ensure verified claim citations remain intact.",
      });
    }

    // 3. Chapters change
    if (observed.observedChapters && expected.expectedChapters) {
      const expChap = expected.expectedChapters.join("|");
      const obsChap = observed.observedChapters.join("|");
      if (expChap !== obsChap) {
        changes.push({
          changeId: `chg-chap-${Date.now().toString(36)}`,
          fieldName: "chapters",
          category: "CONTENT_CHANGE",
          expectedValue: expected.expectedChapters,
          observedValue: observed.observedChapters,
          observationSource,
          detectedAt: nowStr,
          severity: "WARNING",
          affectedSubsystem: "Timeline Markers & Chapter Sync",
          recommendedAction: "Re-align chapters with timeline EDL to preserve benchmark marker accuracy.",
        });
      }
    }

    // 4. Tags change
    if (observed.observedTags && expected.expectedTags) {
      const expTags = [...expected.expectedTags].sort().join(",");
      const obsTags = [...observed.observedTags].sort().join(",");
      if (expTags !== obsTags) {
        changes.push({
          changeId: `chg-tags-${Date.now().toString(36)}`,
          fieldName: "tags",
          category: "METADATA_CHANGE",
          expectedValue: expected.expectedTags,
          observedValue: observed.observedTags,
          observationSource,
          detectedAt: nowStr,
          severity: "INFO",
          affectedSubsystem: "Publishing Metadata",
          recommendedAction: "Verify tags match content classification.",
        });
      }
    }

    // 5. Visibility change
    if (observed.observedVisibility && expected.expectedVisibility && observed.observedVisibility !== expected.expectedVisibility) {
      changes.push({
        changeId: `chg-vis-${Date.now().toString(36)}`,
        fieldName: "visibility",
        category: "VISIBILITY_CHANGE",
        expectedValue: expected.expectedVisibility,
        observedValue: observed.observedVisibility,
        observationSource,
        detectedAt: nowStr,
        severity: "WARNING",
        affectedSubsystem: "Publication Distribution State",
        recommendedAction: "Verify publication visibility alignment with scheduled release strategy.",
      });
    }

    // 6. Publication Identity / Identifier change
    if (observed.publicationIdentifier && expected.publicationIdentifier && observed.publicationIdentifier !== expected.publicationIdentifier) {
      changes.push({
        changeId: `chg-ident-${Date.now().toString(36)}`,
        fieldName: "publicationIdentifier",
        category: "IDENTITY_CHANGE",
        expectedValue: expected.publicationIdentifier,
        observedValue: observed.publicationIdentifier,
        observationSource,
        detectedAt: nowStr,
        severity: "CRITICAL",
        affectedSubsystem: "Publication Identity Reconciliation",
        recommendedAction: "Investigate conflicting external publication IDs.",
      });
    }

    // 7. Asset Fingerprint change
    if (observed.observedAssetFingerprint && observed.observedAssetFingerprint !== expected.expectedAssetHash) {
      changes.push({
        changeId: `chg-asset-${Date.now().toString(36)}`,
        fieldName: "assetFingerprint",
        category: "PACKAGE_CHANGE",
        expectedValue: expected.expectedAssetHash,
        observedValue: observed.observedAssetFingerprint,
        observationSource,
        detectedAt: nowStr,
        severity: "CRITICAL",
        affectedSubsystem: "Production Asset Package Integrity",
        recommendedAction: "Re-stage certified package; media stream hash mismatch detected.",
      });
    }

    return changes;
  }

  /**
   * Detects certification drift against upstream certified project state.
   */
  static detectCertificationDrift(
    expectedCertificationId: string,
    currentCertificationId: string,
    changes: PublicationChangeRecord[],
    affectedClaims: string[] = []
  ): CertificationDriftRecord | undefined {
    if (expectedCertificationId === currentCertificationId && changes.length === 0) {
      return undefined;
    }

    const changedFields = changes.map((c) => c.fieldName);
    if (expectedCertificationId !== currentCertificationId) {
      changedFields.push("certificationCertificateId");
    }

    const isCritical = changes.some((c) => c.severity === "CRITICAL") || expectedCertificationId !== currentCertificationId;

    return {
      driftId: `drift-${Date.now().toString(36)}`,
      originalCertificationId: expectedCertificationId,
      currentObservedState: expectedCertificationId !== currentCertificationId ? `Drifted (${currentCertificationId})` : "Modified post-certification",
      changedFields,
      affectedAssets: changes.filter((c) => c.category === "PACKAGE_CHANGE" || c.category === "CONTENT_CHANGE").map((c) => c.fieldName),
      affectedClaims,
      affectedEvidenceBindings: changes.filter((c) => c.category === "EVIDENCE_BINDING_CHANGE").map((c) => c.fieldName),
      severity: isCritical ? "CRITICAL" : "WARNING",
      requiredAction: "Review changed fields in Phase 79. Do not silently recertify; route any project mutations through Phase 78 Safe Execution.",
    };
  }
}
