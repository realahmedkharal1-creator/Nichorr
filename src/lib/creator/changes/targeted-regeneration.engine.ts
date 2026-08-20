import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ScriptIntelligenceEngine } from "../script-intelligence.engine";
import { ScriptQualityEngine } from "../quality/script-quality.engine";
import { CreatorWorkflowDependencies } from "../workflow/creator-workflow.dependencies";
import { CreatorScriptVersion } from "../workflow/creator-workflow.types";
import { ResearchChangeSet } from "./research-changes.types";

export interface RegenerationResult {
  updatedReport: CreatorStudioReport;
  newScriptVersion: CreatorScriptVersion;
  regeneratedAssetIds: string[];
  summaryMessage: string;
}

export class TargetedRegenerationEngine {
  /**
   * Executes targeted or full regeneration of affected creator assets based on the research change set.
   * Produces a new script version (N+1) without destroying previous iterations.
   */
  static regenerateAssets(
    session: ResearchRunSession,
    currentReport: CreatorStudioReport,
    changeSet: ResearchChangeSet,
    targetAssetIds?: string[], // If undefined, regenerates all affected assets
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    parentVersionNumber: number = 1
  ): RegenerationResult {
    const affectedAssetImpacts = changeSet.assetImpacts.filter(
      (a) => a.status !== "UNAFFECTED" && (!targetAssetIds || targetAssetIds.includes(a.assetId))
    );

    const regeneratedAssetIds = affectedAssetImpacts.map((a) => a.assetId);

    // Re-generate fresh studio report with updated evidence
    const freshReport = ScriptIntelligenceEngine.generateStudioReport(
      session,
      currentReport.targetDurationMinutes || 12,
      preferences,
      profile,
      currentReport.outputMode || "SCRIPT_READY"
    );

    // Run Phase 69 Quality Review against new report
    const freshQuality = ScriptQualityEngine.reviewScript(
      session,
      freshReport,
      profile
    );
    freshReport.qualityReview = freshQuality;

    const newEvidenceSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const newVersionNumber = parentVersionNumber + 1;

    const newScriptVersion: CreatorScriptVersion = {
      version: newVersionNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      researchRunId: session.id,
      trainingProfileId: profile?.updatedAt || "default",
      targetDuration: freshReport.targetDurationMinutes || 12,
      outputMode: freshReport.outputMode || "SCRIPT_READY",
      qualityScore: freshQuality.overallQualityScore,
      qualityGrade: freshQuality.grade,
      workflowState: freshQuality.overallQualityScore >= 80 ? "PRODUCTION_READY" : "SCRIPT_READY",
      evidenceSnapshotHash: newEvidenceSnapshotHash,
      isStale: false,
      affectedAssets: [],
      unaffectedAssets: freshReport.talkingPoints?.map((tp) => tp.id) || [],
    };

    return {
      updatedReport: freshReport,
      newScriptVersion,
      regeneratedAssetIds,
      summaryMessage: `Successfully regenerated ${regeneratedAssetIds.length} affected assets into Script Version ${newVersionNumber}.`,
    };
  }
}
