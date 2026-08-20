export * from "./research-changes.types";
export * from "./research-diff.engine";
export * from "./claim-impact.engine";
export * from "./asset-impact.engine";
export * from "./targeted-regeneration.engine";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchDiffEngine } from "./research-diff.engine";
import { ClaimImpactEngine } from "./claim-impact.engine";
import { AssetImpactEngine } from "./asset-impact.engine";
import { TargetedRegenerationEngine, RegenerationResult } from "./targeted-regeneration.engine";
import { CreatorWorkflowDependencies } from "../workflow/creator-workflow.dependencies";
import {
  ResearchChangeSet,
  CreatorImpactReport,
  ResearchChangeTimelineEvent,
  ChangeReviewDecision,
} from "./research-changes.types";

export class ResearchChangesProvider {
  /**
   * Evaluates research changes between previous and current session states,
   * producing a comprehensive CreatorImpactReport with claim and asset impact lineage.
   */
  static detectAndEvaluateChanges(
    previousSession: ResearchRunSession | null,
    currentSession: ResearchRunSession,
    currentReport: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES
  ): CreatorImpactReport {
    const changes = ResearchDiffEngine.computeChanges(previousSession, currentSession);
    const claimImpacts = ClaimImpactEngine.evaluateClaimImpacts(currentSession, changes);
    const assetImpacts = AssetImpactEngine.evaluateAssetImpacts(currentReport, claimImpacts);

    const prevHash = previousSession
      ? CreatorWorkflowDependencies.generateEvidenceSnapshotHash(previousSession)
      : "baseline-snapshot";
    const currHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(currentSession);

    const criticalCount = changes.filter((c) => c.severity === "CRITICAL").length;
    const highCount = changes.filter((c) => c.severity === "HIGH").length;
    const mediumCount = changes.filter((c) => c.severity === "MEDIUM").length;
    const lowCount = changes.filter((c) => c.severity === "LOW").length;
    const infoCount = changes.filter((c) => c.severity === "INFO").length;

    const affectedClaimsCount = claimImpacts.filter((c) => c.currentStatus !== "UNCHANGED").length;
    const affectedAssetsCount = assetImpacts.filter((a) => a.status !== "UNAFFECTED").length;

    const changeSet: ResearchChangeSet = {
      changeSetId: `chgset-${currentSession.id}-${Date.now()}`,
      researchRunId: currentSession.id,
      previousSnapshotHash: prevHash,
      currentSnapshotHash: currHash,
      generatedAt: new Date().toISOString(),
      summary: {
        totalChanges: changes.length,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        infoCount,
        affectedClaimsCount,
        affectedAssetsCount,
        requiresUserReview: criticalCount > 0 || highCount > 0 || affectedAssetsCount > 0,
      },
      changes,
      claimImpacts,
      assetImpacts,
    };

    const timelineEvents: ResearchChangeTimelineEvent[] = [
      {
        id: "evt-1",
        timestamp: previousSession?.createdAt || currentSession.createdAt,
        title: "Baseline Research Completed",
        description: "Initial hardware and benchmark evidence cataloged.",
        category: "RESEARCH_INITIAL",
        severity: "INFO",
      },
    ];

    if (changes.length > 0) {
      timelineEvents.push({
        id: "evt-2",
        timestamp: new Date().toISOString(),
        title: `${changes.length} Evidence Changes Detected`,
        description: `Snapshot updated from ${prevHash.slice(0, 10)} to ${currHash.slice(0, 10)}.`,
        category: "CHANGE_DETECTED",
        severity: criticalCount > 0 ? "CRITICAL" : highCount > 0 ? "HIGH" : "MEDIUM",
      });

      timelineEvents.push({
        id: "evt-3",
        timestamp: new Date().toISOString(),
        title: `${affectedAssetsCount} Creator Assets Marked For Review`,
        description: "Downstream impact evaluated across talking points, script sections, and timeline markers.",
        category: "IMPACT_EVALUATED",
        severity: "HIGH",
      });
    }

    return {
      reportId: `impact-${currentSession.id}`,
      researchRunId: currentSession.id,
      changeSet,
      timelineEvents,
      monitoringStatus: "SNAPSHOT_DIFF_VERIFIED",
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Executes targeted or full regeneration of affected creator assets.
   */
  static regenerateAffectedAssets(
    session: ResearchRunSession,
    currentReport: CreatorStudioReport,
    changeSet: ResearchChangeSet,
    targetAssetIds?: string[],
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    parentVersionNumber: number = 1
  ): RegenerationResult {
    return TargetedRegenerationEngine.regenerateAssets(
      session,
      currentReport,
      changeSet,
      targetAssetIds,
      preferences,
      profile,
      parentVersionNumber
    );
  }

  /**
   * Returns honest live monitoring capability state.
   */
  static getMonitoringStatus(): { status: "SNAPSHOT_DIFF_VERIFIED" | "LIVE_MONITORING_UNAVAILABLE"; message: string } {
    return {
      status: "SNAPSHOT_DIFF_VERIFIED",
      message: "Snapshot difference engine active. Live periodic background scraping unavailable.",
    };
  }
}
