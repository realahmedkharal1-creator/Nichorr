import { CreatorStudioReport } from "../creator-studio.types";
import { ClaimImpact, CreatorAssetImpact, CreatorAssetType, AssetImpactStatus, ChangeSeverity } from "./research-changes.types";

export class AssetImpactEngine {
  /**
   * Traces claim impacts downstream through Creator Studio assets deterministically.
   */
  static evaluateAssetImpacts(
    report: CreatorStudioReport,
    claimImpacts: ClaimImpact[]
  ): CreatorAssetImpact[] {
    const assetImpacts: CreatorAssetImpact[] = [];
    const activeClaimImpacts = claimImpacts.filter((c) => c.currentStatus !== "UNCHANGED");

    // 1. Evaluate Talking Points
    const talkingPoints = report.talkingPoints || [];
    for (const tp of talkingPoints) {
      const matchedClaim = activeClaimImpacts.find(
        (c) =>
          tp.evidenceIds?.includes(c.claimId) ||
          tp.statement.toLowerCase().includes(c.claimStatement.toLowerCase()) ||
          c.claimStatement.toLowerCase().includes(tp.title.toLowerCase())
      );

      if (!matchedClaim) {
        assetImpacts.push({
          assetType: "TALKING_POINT",
          assetId: tp.id,
          assetLabel: tp.title,
          status: "UNAFFECTED",
          severity: "INFO",
          affectedClaimIds: [],
          causingChangeIds: [],
          explanation: "Supported by unchanged evidence.",
          regenerationRecommended: false,
          safeToAutoUpdate: true,
        });
      } else {
        const isBlocked = matchedClaim.currentStatus === "BLOCKED";
        const isCritical = matchedClaim.severity === "CRITICAL";

        assetImpacts.push({
          assetType: "TALKING_POINT",
          assetId: tp.id,
          assetLabel: tp.title,
          status: isBlocked ? "BLOCKED" : isCritical ? "REVIEW_REQUIRED" : "STALE",
          severity: matchedClaim.severity,
          affectedClaimIds: [matchedClaim.claimId],
          causingChangeIds: matchedClaim.causingChangeIds,
          explanation: `Depends on Claim "${matchedClaim.claimStatement}" which changed to status ${matchedClaim.currentStatus}. (${matchedClaim.reason})`,
          regenerationRecommended: true,
          safeToAutoUpdate: !isBlocked,
        });
      }
    }

    // 2. Evaluate Benchmark Cards
    const benchmarkCards = report.benchmarkCards || [];
    for (const card of benchmarkCards) {
      const matchedClaim = activeClaimImpacts.find(
        (c) =>
          c.claimStatement.toLowerCase().includes(card.benchmarkName.toLowerCase()) ||
          c.claimStatement.toLowerCase().includes(card.entityAName.toLowerCase())
      );

      if (!matchedClaim) {
        assetImpacts.push({
          assetType: "BENCHMARK_CARD",
          assetId: card.id,
          assetLabel: `${card.entityAName} ${card.benchmarkName}`,
          status: "UNAFFECTED",
          severity: "INFO",
          affectedClaimIds: [],
          causingChangeIds: [],
          explanation: "Benchmark score and test methodology unchanged.",
          regenerationRecommended: false,
          safeToAutoUpdate: true,
        });
      } else {
        assetImpacts.push({
          assetType: "BENCHMARK_CARD",
          assetId: card.id,
          assetLabel: `${card.entityAName} ${card.benchmarkName}`,
          status: "STALE",
          severity: matchedClaim.severity,
          affectedClaimIds: [matchedClaim.claimId],
          causingChangeIds: matchedClaim.causingChangeIds,
          explanation: `Benchmark data updated: ${matchedClaim.reason}`,
          regenerationRecommended: true,
          safeToAutoUpdate: true,
        });
      }
    }

    // 3. Evaluate Script Sections & Full Script
    const scriptSections = report.scriptSections || [];
    const affectedTps = assetImpacts.filter((a) => a.assetType === "TALKING_POINT" && a.status !== "UNAFFECTED");

    for (const sec of scriptSections) {
      const sectionAffected = affectedTps.some((tp) =>
        sec.talkingPoints?.some((secTp) => secTp.id === tp.assetId)
      );

      if (!sectionAffected) {
        assetImpacts.push({
          assetType: "SCRIPT",
          assetId: sec.id,
          assetLabel: `Section: ${sec.title}`,
          status: "UNAFFECTED",
          severity: "INFO",
          affectedClaimIds: [],
          causingChangeIds: [],
          explanation: "All talking points in this section remain backed by verified evidence.",
          regenerationRecommended: false,
          safeToAutoUpdate: true,
        });
      } else {
        assetImpacts.push({
          assetType: "SCRIPT",
          assetId: sec.id,
          assetLabel: `Section: ${sec.title}`,
          status: "REVIEW_REQUIRED",
          severity: "HIGH",
          affectedClaimIds: affectedTps.flatMap((t) => t.affectedClaimIds),
          causingChangeIds: affectedTps.flatMap((t) => t.causingChangeIds),
          explanation: `Section contains talking points affected by upstream evidence changes. Pacing and script text should be reviewed.`,
          regenerationRecommended: true,
          safeToAutoUpdate: false,
        });
      }
    }

    // 4. Overall Workflow Assets (Teleprompter, Timeline, Publishing, Quality)
    const hasAnyStale = assetImpacts.some((a) => a.status === "STALE" || a.status === "REVIEW_REQUIRED" || a.status === "BLOCKED");

    assetImpacts.push({
      assetType: "TELEPROMPTER",
      assetId: "teleprompter-master",
      assetLabel: "Creator Teleprompter Narration",
      status: hasAnyStale ? "STALE" : "UNAFFECTED",
      severity: hasAnyStale ? "HIGH" : "INFO",
      affectedClaimIds: [],
      causingChangeIds: [],
      explanation: hasAnyStale
        ? "Teleprompter text reflects previous script iteration. Review and regenerate affected script sections before recording."
        : "Teleprompter script is fully synchronized with latest evidence.",
      regenerationRecommended: hasAnyStale,
      safeToAutoUpdate: true,
    });

    assetImpacts.push({
      assetType: "TIMELINE_MARKER",
      assetId: "timeline-markers-master",
      assetLabel: "Video Editor Timeline Sync (EDL / FCPXML)",
      status: hasAnyStale ? "REVIEW_REQUIRED" : "UNAFFECTED",
      severity: hasAnyStale ? "HIGH" : "INFO",
      affectedClaimIds: [],
      causingChangeIds: [],
      explanation: hasAnyStale
        ? "Timeline marker timestamps and labels may shift after script regeneration."
        : "Timeline markers are 100% synchronized with current evidence intent.",
      regenerationRecommended: hasAnyStale,
      safeToAutoUpdate: false,
    });

    assetImpacts.push({
      assetType: "PUBLISHING_PREFLIGHT",
      assetId: "publishing-preflight-master",
      assetLabel: "Multi-Platform Publishing Preflight",
      status: hasAnyStale ? "STALE" : "UNAFFECTED",
      severity: hasAnyStale ? "HIGH" : "INFO",
      affectedClaimIds: [],
      causingChangeIds: [],
      explanation: hasAnyStale
        ? "Preflight readiness gates must be re-evaluated after evidence updates."
        : "Publishing preflight is verified against current evidence.",
      regenerationRecommended: hasAnyStale,
      safeToAutoUpdate: true,
    });

    return assetImpacts;
  }
}
