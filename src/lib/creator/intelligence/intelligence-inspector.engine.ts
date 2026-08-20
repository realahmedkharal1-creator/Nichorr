import {
  CreatorIntelligenceInsight,
  PlatformObservationItem,
  IntelligenceClassification,
} from "./intelligence.types";
import { IntelligenceAuditService } from "./intelligence-audit.service";

export class IntelligenceInspectorEngine {
  /**
   * Constructs an explainable intelligence insight tracing back to the raw observation and evidence context.
   */
  static createExplainableInsight(
    userId: string,
    primaryRunId: string,
    category: string,
    classification: IntelligenceClassification,
    title: string,
    narrative: string,
    inputObservation: PlatformObservationItem,
    evidenceContextRef: string,
    actionRequired: string,
    requiresResearchValidation: boolean = true
  ): CreatorIntelligenceInsight {
    const nowStr = new Date().toISOString();
    const insightId = `intel-ins-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const insight: CreatorIntelligenceInsight = {
      insightId,
      userId,
      primaryRunId,
      category,
      classification,
      title,
      narrative,
      inputObservationRef: `[${inputObservation.sourcePlatform}] ${inputObservation.name}: ${inputObservation.value}${inputObservation.unit || ""}`,
      evidenceContextRef,
      actionRequired,
      requiresResearchValidation,
      generatedAt: nowStr,
    };

    IntelligenceAuditService.recordAuditEvent({
      auditId: `intel-aud-${Date.now().toString(36)}-ins`,
      userId,
      researchRunId: primaryRunId,
      action: "INSIGHT_EXTRACTED",
      details: `Generated explainable insight: "${title}" [${classification}]. Action: ${actionRequired}`,
      timestamp: nowStr,
    });

    return insight;
  }
}
