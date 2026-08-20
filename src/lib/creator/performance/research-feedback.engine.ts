import {
  ResearchOpportunityRecord,
  AudienceSignalRecord,
} from "./performance.types";
import { PerformanceAuditService } from "./performance-audit.service";

export class ResearchFeedbackEngine {
  /**
   * Creates a formal Research Opportunity from an audience question or performance drop-off signal.
   */
  static createOpportunityFromSignal(
    signal: AudienceSignalRecord,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ResearchOpportunityRecord {
    const nowStr = new Date().toISOString();
    const opportunityId = `opp-${researchRunId}-${Date.now().toString(36)}`;

    let title = `Research Follow-Up: ${signal.category}`;
    let description = `Audience inquiry: "${signal.rawText}"`;
    let actionRequired = "Formulate search query and verify primary lab evidence.";
    let suggestedTopic = signal.rawText;

    if (signal.category === 'BENCHMARK_QUESTION') {
      title = "Benchmark Verification Request";
      actionRequired = "Cross-reference lab benchmark logs for comparable hardware configurations.";
    } else if (signal.category === 'METHODOLOGY_QUESTION') {
      title = "Testing Methodology Review";
      actionRequired = "Review ambient testing conditions and thermal baseline methodology.";
    } else if (signal.category === 'CORRECTION_OBJECTION') {
      title = "Audience Factual Objection";
      actionRequired = "Verify primary source claims against OEM whitepapers to resolve potential discrepancy.";
    }

    const opportunity: ResearchOpportunityRecord = {
      opportunityId,
      userId,
      researchRunId,
      title,
      description,
      triggeredBy: 'AUDIENCE_QUESTION',
      sourceSignalId: signal.signalId,
      suggestedTopic,
      actionRequired,
      status: 'PROPOSED',
      createdAt: nowStr,
    };

    signal.researchOpportunityId = opportunityId;

    PerformanceAuditService.recordAuditEvent({
      auditId: `perf-aud-${Date.now().toString(36)}-opp`,
      userId,
      researchRunId,
      action: 'RESEARCH_OPPORTUNITY_LOGGED',
      details: `Research Opportunity created: "${title}" from audience signal [${signal.category}].`,
      timestamp: nowStr,
    });

    return opportunity;
  }
}
