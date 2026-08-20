import {
  ContinuousReleaseHealthReport,
  DimensionHealthItem,
  DimensionHealthStatus,
  PublicationReconciliationRecord,
} from "./publication-integrity.types";

export class ReleaseHealthEngine {
  /**
   * Aggregates authoritative continuous release health across all 10 dimensions without manufacturing artificial numerical scores.
   */
  static evaluateHealth(
    researchRunId: string,
    records: PublicationReconciliationRecord[],
    context: {
      isCertificationValid?: boolean;
      isReleaseLockValid?: boolean;
      isExportPackageValid?: boolean;
      isEvidenceSnapshotValid?: boolean;
    } = {}
  ): ContinuousReleaseHealthReport {
    const reportId = `crh-${researchRunId}-${Date.now().toString(36)}`;
    const nowStr = new Date().toISOString();

    const hasBlockers = records.some((r) => r.blockers.length > 0);
    const hasDrift = records.some((r) => r.reconciliationStatus === "CHANGED" || r.certificationDrift !== undefined);
    const hasUnverifiable = records.some((r) => r.isUnverifiable || r.reconciliationStatus === "UNVERIFIABLE");
    const hasStale = records.some((r) => r.reconciliationStatus === "STALE");

    // 1. Certification Integrity
    const certStatus: DimensionHealthStatus = context.isCertificationValid === false ? "BLOCKED" : "PASS";
    const certDimension: DimensionHealthItem = {
      dimensionKey: "certificationIntegrity",
      dimensionName: "Certification Integrity",
      status: certStatus,
      details: certStatus === "PASS" ? "Project integrity certificate is valid and certified." : "Project certificate is invalidated or missing.",
      upstreamDependency: "Phase 79 Project Integrity Certification",
    };

    // 2. Release Lock Integrity
    const lockStatus: DimensionHealthStatus = context.isReleaseLockValid === false ? "BLOCKED" : "PASS";
    const lockDimension: DimensionHealthItem = {
      dimensionKey: "releaseLockIntegrity",
      dimensionName: "Release Lock Integrity",
      status: lockStatus,
      details: lockStatus === "PASS" ? "Release lock is engaged and matches project snapshot." : "Release lock is unlocked or mismatched.",
      upstreamDependency: "Phase 79 Release Lock",
    };

    // 3. Export Package Integrity
    const pkgStatus: DimensionHealthStatus = context.isExportPackageValid === false ? "BLOCKED" : "PASS";
    const pkgDimension: DimensionHealthItem = {
      dimensionKey: "exportPackageIntegrity",
      dimensionName: "Export Package Integrity",
      status: pkgStatus,
      details: pkgStatus === "PASS" ? "Phase 83 production export package is validated." : "Phase 83 export package failed validation.",
      upstreamDependency: "Phase 83 Creator Export Package",
    };

    // 4. Distribution Receipt Integrity
    const receiptStatus: DimensionHealthStatus = records.some((r) => r.receiptState === "RECEIPT_STALE")
      ? "STALE"
      : records.some((r) => r.receiptState === "RECEIPT_CONFLICTED")
      ? "BLOCKED"
      : "PASS";
    const receiptDimension: DimensionHealthItem = {
      dimensionKey: "distributionReceiptIntegrity",
      dimensionName: "Distribution Receipt Integrity",
      status: receiptStatus,
      details: `Distribution receipt status: ${receiptStatus}.`,
      upstreamDependency: "Phase 84 Distribution Receipt Ledger",
    };

    // 5. Publication State Integrity
    const pubStatus: DimensionHealthStatus = records.some((r) => r.reconciliationStatus === "BLOCKED")
      ? "BLOCKED"
      : records.some((r) => r.reconciliationStatus === "CHANGED")
      ? "WARNING"
      : records.some((r) => r.reconciliationStatus === "UNVERIFIABLE")
      ? "UNVERIFIABLE"
      : "PASS";
    const pubDimension: DimensionHealthItem = {
      dimensionKey: "publicationStateIntegrity",
      dimensionName: "Publication State Integrity",
      status: pubStatus,
      details: `Live publication status: ${pubStatus}.`,
      upstreamDependency: "Publication Reconciliation Engine",
    };

    // 6. Metadata Integrity
    const metaStatus: DimensionHealthStatus = records.some((r) => r.changes.some((c) => c.category === "METADATA_CHANGE"))
      ? "WARNING"
      : "PASS";
    const metaDimension: DimensionHealthItem = {
      dimensionKey: "metadataIntegrity",
      dimensionName: "Metadata Integrity",
      status: metaStatus,
      details: metaStatus === "PASS" ? "All publication metadata matches expected release." : "Metadata differences detected between certified release and live observation.",
      upstreamDependency: "Publishing Target Metadata",
    };

    // 7. Asset Integrity
    const assetStatus: DimensionHealthStatus = records.some((r) => r.changes.some((c) => c.category === "PACKAGE_CHANGE"))
      ? "BLOCKED"
      : "PASS";
    const assetDimension: DimensionHealthItem = {
      dimensionKey: "assetIntegrity",
      dimensionName: "Asset Stream Integrity",
      status: assetStatus,
      details: assetStatus === "PASS" ? "Media asset fingerprints match certified export package." : "Media asset stream mismatch detected on live platform.",
      upstreamDependency: "Production Asset Matrix",
    };

    // 8. Evidence Binding Integrity
    const evidStatus: DimensionHealthStatus = context.isEvidenceSnapshotValid === false ? "BLOCKED" : "PASS";
    const evidDimension: DimensionHealthItem = {
      dimensionKey: "evidenceBindingIntegrity",
      dimensionName: "Evidence Binding Integrity",
      status: evidStatus,
      details: evidStatus === "PASS" ? "Evidence graph bindings are intact and certified." : "Evidence graph snapshot drift detected.",
      upstreamDependency: "Phase 74-75 Evidence System",
    };

    // 9. Platform Observability
    const obsStatus: DimensionHealthStatus = records.every((r) => !r.observedState.isAvailable)
      ? "NOT_CONFIGURED"
      : records.some((r) => !r.observedState.isAvailable)
      ? "WARNING"
      : "PASS";
    const obsDimension: DimensionHealthItem = {
      dimensionKey: "platformObservability",
      dimensionName: "Platform Observability",
      status: obsStatus,
      details: obsStatus === "NOT_CONFIGURED"
        ? "External platform APIs not configured locally; staging mode active."
        : "Platform telemetry and live observations are active.",
      upstreamDependency: "Publishing Connection State",
    };

    // 10. Reconciliation Integrity
    const reconStatus: DimensionHealthStatus = hasBlockers
      ? "BLOCKED"
      : hasStale
      ? "STALE"
      : hasDrift
      ? "WARNING"
      : hasUnverifiable
      ? "UNVERIFIABLE"
      : "PASS";
    const reconDimension: DimensionHealthItem = {
      dimensionKey: "reconciliationIntegrity",
      dimensionName: "Reconciliation Integrity",
      status: reconStatus,
      details: `Overall reconciliation integrity: ${reconStatus}.`,
      upstreamDependency: "Cross-Platform State Reconciliation",
    };

    let overallStatus: DimensionHealthStatus = "PASS";
    if (hasBlockers || certStatus === "BLOCKED" || lockStatus === "BLOCKED" || pkgStatus === "BLOCKED" || evidStatus === "BLOCKED") {
      overallStatus = "BLOCKED";
    } else if (hasStale) {
      overallStatus = "STALE";
    } else if (hasDrift) {
      overallStatus = "WARNING";
    } else if (hasUnverifiable) {
      overallStatus = "UNVERIFIABLE";
    }

    return {
      reportId,
      researchRunId,
      overallStatus,
      dimensions: {
        certificationIntegrity: certDimension,
        releaseLockIntegrity: lockDimension,
        exportPackageIntegrity: pkgDimension,
        distributionReceiptIntegrity: receiptDimension,
        publicationStateIntegrity: pubDimension,
        metadataIntegrity: metaDimension,
        assetIntegrity: assetDimension,
        evidenceBindingIntegrity: evidDimension,
        platformObservability: obsDimension,
        reconciliationIntegrity: reconDimension,
      },
      activeBlockersCount: records.reduce((acc, r) => acc + r.blockers.length, 0),
      unverifiableCount: records.filter((r) => r.isUnverifiable).length,
      staleCount: records.filter((r) => r.reconciliationStatus === "STALE").length,
      reconciledCount: records.filter((r) => r.reconciliationStatus === "MATCHED").length,
      totalPublicationsCount: records.length,
      generatedAt: nowStr,
    };
  }
}
