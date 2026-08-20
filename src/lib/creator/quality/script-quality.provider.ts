export * from "./script-quality.types";
export * from "./script-quality.engine";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ScriptQualityReviewReport } from "./script-quality.types";
import { ScriptQualityEngine } from "./script-quality.engine";

export class ScriptQualityProvider {
  /**
   * Generates a deterministic quality review report for a creator script.
   */
  static review(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    profile?: CreatorScriptTrainingProfile
  ): ScriptQualityReviewReport {
    return ScriptQualityEngine.reviewScript(session, report, profile);
  }
}
