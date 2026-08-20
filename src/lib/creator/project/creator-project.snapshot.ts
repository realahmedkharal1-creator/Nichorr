import crypto from "crypto";
import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { CreatorWorkflowDependencies } from "../workflow/creator-workflow.dependencies";
import { CreatorProjectSnapshot } from "./creator-project.types";

export class CreatorProjectSnapshotEngine {
  /**
   * Generates a deterministic, immutable project snapshot and stable SHA-256 hash.
   * Volatile execution timestamps and random UUIDs are excluded to ensure deterministic hash reproducibility.
   */
  static generateSnapshot(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage
  ): CreatorProjectSnapshot {
    const evidenceSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const scriptVersion = report.scriptVersion || 1;
    const scriptOutputMode = report.outputMode || "SCRIPT_READY";
    const targetDurationMinutes = report.targetDurationMinutes || 12;
    const creatorProfileId = profile?.userId || "anonymous";

    const contentQualityScore = report.qualityReview?.overallQualityScore || 90;
    const productionReadinessScore = preflight?.productionReadinessScore || 95;
    const researchHealthScore = healthReport?.overallHealthScore || 95;
    const publishingReadinessScore = preflight?.overallPublishingScore || 90;
    const distributionReadinessScore = distPackage?.distributionReadinessScore || 90;

    // Count enabled / disabled assets
    let enabledAssetCount = 0;
    let disabledAssetCount = 0;
    for (const [k, v] of Object.entries(preferences)) {
      if (typeof v === "boolean") {
        if (v) enabledAssetCount++;
        else disabledAssetCount++;
      }
    }

    const timelineFingerprint = `timeline-${scriptVersion}-${evidenceSnapshotHash.slice(0, 8)}`;
    const activePublishingTargets = preflight?.selectedPlatforms || ["YOUTUBE_LONG_FORM"];
    const activeDistributionTargets = distPackage?.targets.map((t) => t.platform) || ["YOUTUBE_LONG_FORM"];

    const blockingConditions: string[] = [];
    if (healthReport && !healthReport.readyToSupportCreatorContent) {
      blockingConditions.push(...healthReport.hardBlockers);
    }
    if (preflight && preflight.readinessStatus === 'BLOCKED') {
      blockingConditions.push(...preflight.allIssues.filter((i) => i.severity === 'BLOCKER').map((i) => i.message));
    }
    if (distPackage && distPackage.status === 'BLOCKED') {
      blockingConditions.push(...distPackage.readinessReport.blockingReasons);
    }

    const staleAssetIds: string[] = [];
    if (healthReport?.evidenceSummary?.stale && healthReport.evidenceSummary.stale > 0) {
      staleAssetIds.push("benchmarks-stale");
    }

    const reviewRequiredAssetIds: string[] = [];
    if (healthReport?.evidenceSummary?.aging && healthReport.evidenceSummary.aging > 0) {
      reviewRequiredAssetIds.push("evidence-aging");
    }

    // Deterministic state payload for SHA-256 hash computation
    const stablePayload = JSON.stringify({
      runId: session.id,
      evidenceSnapshotHash,
      scriptVersion,
      scriptOutputMode,
      targetDurationMinutes,
      creatorProfileId,
      preferences,
      timelineFingerprint,
      activePublishingTargets,
      activeDistributionTargets,
      blockingConditions,
    });

    const snapshotHash = crypto.createHash("sha256").update(stablePayload).digest("hex");

    return {
      snapshotHash,
      researchRunId: session.id,
      evidenceSnapshotHash,
      scriptVersion,
      scriptOutputMode,
      targetDurationMinutes,
      creatorProfileId,
      contentQualityScore,
      productionReadinessScore,
      researchHealthScore,
      publishingReadinessScore,
      distributionReadinessScore,
      enabledAssetCount,
      disabledAssetCount,
      timelineFingerprint,
      activePublishingTargets,
      activeDistributionTargets,
      blockingConditions,
      staleAssetIds,
      reviewRequiredAssetIds,
      capturedAt: new Date().toISOString(),
    };
  }
}
