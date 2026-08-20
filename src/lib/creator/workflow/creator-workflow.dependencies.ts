import { StaleDetectionResult, CreatorScriptVersion } from "./creator-workflow.types";
import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { TargetVideoDuration, ScriptOutputMode } from "../creator-studio.types";

export class CreatorWorkflowDependencies {
  /**
   * Generates a deterministic snapshot hash representing the current verified evidence and claim state.
   */
  static generateEvidenceSnapshotHash(session: ResearchRunSession): string {
    const claimsCount = session.claims?.length || 0;
    const evidenceCount = session.evidence?.length || 0;
    const sourcesCount = session.sources?.length || 0;
    const hwCount = session.hardwareIntelligence?.benchmarkRecords?.length || 0;
    const ytCount = session.youtubeIntelligence?.claims?.length || 0;
    const updatedAt = session.updatedAt || session.createdAt || "";

    const raw = `${session.id}:${claimsCount}:${evidenceCount}:${sourcesCount}:${hwCount}:${ytCount}:${updatedAt}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `ev-hash-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Evaluates whether an existing script version is stale based on changes in research evidence,
   * duration, output mode, training profile, or production preferences.
   */
  static detectStaleAssets(
    session: ResearchRunSession,
    version: CreatorScriptVersion,
    currentDuration: TargetVideoDuration,
    currentMode: ScriptOutputMode,
    currentPrefs: CreatorProductionPreferences,
    currentProfile?: CreatorScriptTrainingProfile
  ): StaleDetectionResult {
    const currentEvidenceHash = this.generateEvidenceSnapshotHash(session);
    const affectedAssets: string[] = [];
    const unaffectedAssets: string[] = [];

    // Case 1: Research Evidence changed
    if (version.evidenceSnapshotHash !== currentEvidenceHash) {
      affectedAssets.push(
        "Script Content",
        "Talking Points",
        "B-Roll Shot Plan",
        "Chapters",
        "Teleprompter",
        "Timeline Markers",
        "Quality Audit"
      );
      unaffectedAssets.push("Training Profile", "Production Preferences");

      return {
        isStale: true,
        reason: "Research evidence or benchmark findings updated after this script version was compiled.",
        affectedAssets,
        unaffectedAssets,
      };
    }

    // Case 2: Duration changed (e.g. 12m -> 18m)
    if (version.targetDuration !== currentDuration) {
      affectedAssets.push("Script Content", "Chapters", "Timeline Markers", "Teleprompter");
      unaffectedAssets.push("Research Evidence", "Provenance Graph", "Benchmark Cards", "Training Profile");

      return {
        isStale: true,
        reason: `Target video duration changed from ${version.targetDuration}m to ${currentDuration}m.`,
        affectedAssets,
        unaffectedAssets,
      };
    }

    // Case 3: Script Output Mode changed (e.g. OUTLINE -> FULL_NARRATION)
    if (version.outputMode !== currentMode) {
      affectedAssets.push("Script Narration", "Teleprompter");
      unaffectedAssets.push("Research Evidence", "Provenance Graph", "Benchmark Cards", "B-Roll Shot Plan", "Chapters");

      return {
        isStale: true,
        reason: `Script output mode changed from ${version.outputMode} to ${currentMode}.`,
        affectedAssets,
        unaffectedAssets,
      };
    }

    // Case 4: Training Profile changed
    if (currentProfile && version.trainingProfileId !== currentProfile.userId) {
      affectedAssets.push("Script Narration", "Opening Hooks", "Titles", "Teleprompter");
      unaffectedAssets.push("Research Evidence", "Benchmark Cards", "Provenance Graph", "Chapters");

      return {
        isStale: true,
        reason: "Creator script training profile or style preferences were updated.",
        affectedAssets,
        unaffectedAssets,
      };
    }

    // No stale assets detected
    return {
      isStale: false,
      affectedAssets: [],
      unaffectedAssets: [
        "Research Evidence",
        "Script Content",
        "Talking Points",
        "B-Roll Plan",
        "Benchmark Cards",
        "Chapters",
        "Teleprompter",
        "Timeline Markers",
        "Quality Audit",
      ],
    };
  }
}
