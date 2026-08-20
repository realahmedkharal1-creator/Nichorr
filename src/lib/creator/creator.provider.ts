export * from "./creator-studio.types";
export * from "./production-preferences.types";
export * from "./script-training.types";
export * from "./script-training.service";
export * from "./timeline/timeline.provider";
export * from "./quality/script-quality.provider";
export * from "./workflow/creator-workflow.provider";
export * from "./publishing/publishing.provider";
export * from "./editor/editor-integration.provider";
export * from "./changes/research-changes.provider";
export * from "@/lib/research-health/research-health.provider";
export * from "./distribution/distribution.provider";
export * from "./project/creator-project.provider";
export * from "./execution/creator-execution.provider";
export * from "./execution/creator-execution.types";
export * from "./certification/creator-certification.provider";
export * from "./performance/performance.provider";
export * from "./intelligence/creator-intelligence.provider";
export * from "./production-matrix/production-matrix.provider";
export * from "./export/creator-export.provider";
export * from "./publication-integrity/publication-integrity.provider";
export * from "./research-calibration/research-calibration.provider";
export * from "./collective-intelligence/collective-intelligence.provider";
export * from "./silicon-regression/silicon-regression.provider";
export * from "./architectural-forecast/architectural-forecast.provider";
export * from "./testbench/testbench.provider";
export * from "./testbench-cluster/cluster-provider";
export * from "./cross-lab-regression/cross-lab-regression.provider";
export * from "./microarchitecture/microarchitecture.provider";
export * from "./microarchitectural-attribution/microarchitectural-attribution.provider";
export * from "./co-design-workbench/co-design.provider";
export * from "./hypothesis-reconciliation/hypothesis.provider";
export * from "./script-intelligence.engine";

import { ScriptIntelligenceEngine } from "./script-intelligence.engine";
import { ResearchRunSession } from "@/features/research/research-engine";
import { TargetVideoDuration, ScriptOutputMode } from "./creator-studio.types";
import { CreatorProductionPreferences } from "./production-preferences.types";
import { CreatorScriptTrainingProfile } from "./script-training.types";

export class CreatorStudioProvider {
  static generateReport(
    session: ResearchRunSession,
    targetDurationMinutes: TargetVideoDuration = 12,
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    outputMode: ScriptOutputMode = "SCRIPT_READY"
  ) {
    return ScriptIntelligenceEngine.generateStudioReport(
      session,
      targetDurationMinutes,
      preferences,
      profile,
      outputMode
    );
  }
}
