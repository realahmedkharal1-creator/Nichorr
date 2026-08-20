import {
  AudienceSignalRecord,
  AudienceSignalCategory,
} from "./performance.types";
import { PerformanceAuditService } from "./performance-audit.service";

export class AudienceSignalEngine {
  /**
   * Classifies an audience comment or question into a structured signal without treating it as factual evidence.
   */
  static processAudienceComment(
    rawText: string,
    researchRunId: string,
    userId: string = "anonymous-creator",
    associatedSectionId?: string
  ): AudienceSignalRecord {
    let category: AudienceSignalCategory = 'GENERAL_REACTION';
    let sentiment: AudienceSignalRecord['sentiment'] = 'NEUTRAL';
    let requiresResearchValidation = false;

    const lower = rawText.toLowerCase();

    if (lower.includes("benchmark") || lower.includes("fps") || lower.includes("score") || lower.includes("geekbench") || lower.includes("cinebench")) {
      category = 'BENCHMARK_QUESTION';
      requiresResearchValidation = true;
      sentiment = 'QUESTION';
    } else if (lower.includes("methodology") || lower.includes("how did you test") || lower.includes("settings") || lower.includes("ambient")) {
      category = 'METHODOLOGY_QUESTION';
      requiresResearchValidation = true;
      sentiment = 'QUESTION';
    } else if (lower.includes("wrong") || lower.includes("incorrect") || lower.includes("actually") || lower.includes("mistake") || lower.includes("error")) {
      category = 'CORRECTION_OBJECTION';
      requiresResearchValidation = true;
      sentiment = 'CRITICAL';
    } else if (lower.includes("vs") || lower.includes("better than") || lower.includes("compare")) {
      category = 'COMPARISON_QUESTION';
      sentiment = 'QUESTION';
    } else if (lower.includes("should i buy") || lower.includes("worth it") || lower.includes("upgrade")) {
      category = 'BUYING_QUESTION';
      sentiment = 'QUESTION';
    } else if (lower.includes("how") || lower.includes("why") || lower.includes("what")) {
      category = 'FACTUAL_QUESTION';
      sentiment = 'QUESTION';
    }

    const nowStr = new Date().toISOString();
    const signalId = `aud-sig-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const record: AudienceSignalRecord = {
      signalId,
      category,
      rawText,
      frequency: 1,
      requiresResearchValidation,
      sentiment,
      associatedSectionId,
      observedAt: nowStr,
    };

    PerformanceAuditService.recordAuditEvent({
      auditId: `perf-aud-${Date.now().toString(36)}-aud`,
      userId,
      researchRunId,
      action: 'AUDIENCE_SIGNAL_LOGGED',
      details: `Audience signal recorded: [${category}] "${rawText.slice(0, 50)}...". Requires validation: ${requiresResearchValidation}`,
      timestamp: nowStr,
    });

    return record;
  }
}
