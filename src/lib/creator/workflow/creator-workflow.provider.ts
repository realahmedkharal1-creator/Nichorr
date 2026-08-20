export * from "./creator-workflow.types";
export * from "./creator-workflow.dependencies";
export * from "./creator-workflow.readiness";
export * from "./creator-workflow.engine";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport, TargetVideoDuration, ScriptOutputMode } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { CreatorWorkflowEngine } from "./creator-workflow.engine";
import { CreatorWorkflowReadinessEngine, ReadinessThresholds } from "./creator-workflow.readiness";
import { CreatorWorkflowDependencies } from "./creator-workflow.dependencies";
import { CreatorScriptVersion, CreatorWorkflowReadinessReport, CreatorProductionPackage } from "./creator-workflow.types";

export class CreatorWorkflowProvider {
  /**
   * Evaluates end-to-end creator workflow readiness across 5 dimensions and tests the final ready-to-record gate.
   */
  static evaluateReadiness(
    session: ResearchRunSession,
    report?: CreatorStudioReport,
    version?: CreatorScriptVersion,
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    targetDuration: TargetVideoDuration = 12,
    outputMode: ScriptOutputMode = "SCRIPT_READY",
    thresholds?: ReadinessThresholds
  ): CreatorWorkflowReadinessReport {
    return CreatorWorkflowReadinessEngine.evaluateReadiness(
      session,
      report,
      version,
      preferences,
      profile,
      targetDuration,
      outputMode,
      thresholds
    );
  }

  /**
   * Detects whether existing assets or script versions are stale relative to latest parameters.
   */
  static detectStale(
    session: ResearchRunSession,
    version: CreatorScriptVersion,
    currentDuration: TargetVideoDuration,
    currentMode: ScriptOutputMode,
    currentPrefs: CreatorProductionPreferences,
    currentProfile?: CreatorScriptTrainingProfile
  ) {
    return CreatorWorkflowDependencies.detectStaleAssets(
      session,
      version,
      currentDuration,
      currentMode,
      currentPrefs,
      currentProfile
    );
  }

  /**
   * Generates a complete unified production package for downstream video editing.
   */
  static generatePackage(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    versionNumber = 1
  ): CreatorProductionPackage {
    return CreatorWorkflowEngine.generateProductionPackage(
      session,
      report,
      preferences,
      profile,
      versionNumber
    );
  }
}
