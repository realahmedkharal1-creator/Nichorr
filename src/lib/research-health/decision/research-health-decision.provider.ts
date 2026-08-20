export * from "./research-health-decision.types";
export * from "./decision-explanation.engine";
export * from "./research-health-decision.engine";
export * from "./decision-history.service";
export * from "./decision-orchestrator.engine";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "@/lib/creator/creator-studio.types";
import { CreatorProductionPreferences } from "@/lib/creator/production-preferences.types";
import { ResearchHealthReport } from "../research-health.types";
import { ResearchHealthDecisionEngine } from "./research-health-decision.engine";
import { DecisionHistoryService } from "./decision-history.service";
import { DecisionOrchestratorEngine } from "./decision-orchestrator.engine";
import {
  ResearchHealthDecisionReport,
  ResearchHealthAction,
  ResearchHealthActionResult,
  CreatorDecisionRecord,
  ResearchHealthDecisionType,
} from "./research-health-decision.types";

export class ResearchHealthDecisionProvider {
  /**
   * Evaluates prioritized creator decisions and action queues from research health state.
   */
  static evaluateDecisions(
    session: ResearchRunSession,
    healthReport: ResearchHealthReport,
    report?: CreatorStudioReport,
    userId: string = "anonymous-creator"
  ): ResearchHealthDecisionReport {
    return ResearchHealthDecisionEngine.evaluateDecisions(session, healthReport, report, userId);
  }

  /**
   * Records a user review choice in the immutable audit history.
   */
  static recordUserReview(
    session: ResearchRunSession,
    decisionId: string,
    decisionType: ResearchHealthDecisionType,
    action: 'ACCEPTED' | 'REJECTED' | 'KEPT_CURRENT',
    note?: string,
    userId: string = "anonymous-creator",
    targetClaimIds: string[] = [],
    targetAssetIds: string[] = []
  ): CreatorDecisionRecord {
    return DecisionOrchestratorEngine.recordUserReview(
      session,
      decisionId,
      decisionType,
      action,
      note,
      userId,
      targetClaimIds,
      targetAssetIds
    );
  }

  /**
   * Executes a creator-approved action (revalidation, targeted regeneration, etc.).
   */
  static executeAction(
    session: ResearchRunSession,
    report: CreatorStudioReport | undefined,
    action: ResearchHealthAction,
    userId: string = "anonymous-creator",
    preferences?: CreatorProductionPreferences
  ): Promise<{
    updatedSession: ResearchRunSession;
    updatedReport?: CreatorStudioReport;
    actionResult: ResearchHealthActionResult;
  }> {
    return DecisionOrchestratorEngine.executeAction(session, report, action, userId, preferences);
  }

  /**
   * Retrieves decision audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): CreatorDecisionRecord[] {
    return DecisionHistoryService.getHistory(researchRunId, userId);
  }
}
