import { ForecastAuditEvent } from "./architectural-forecast.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForForecastAudit = globalThis as unknown as {
  architecturalForecastAuditStore: Map<string, ForecastAuditEvent[]> | undefined;
};

const auditStore =
  globalForForecastAudit.architecturalForecastAuditStore ??
  new Map<string, ForecastAuditEvent[]>();

if (process.env.NODE_ENV !== "production") {
  globalForForecastAudit.architecturalForecastAuditStore = auditStore;
}

export class ArchitecturalForecastAuditService {
  /**
   * Records an immutable architectural forecast & simulation audit event.
   */
  static logEvent(
    userId: string,
    researchRunId: string,
    eventType: ForecastAuditEvent["eventType"],
    targetId: string,
    reason: string,
    options?: {
      beforeState?: string;
      afterState?: string;
      metadata?: Record<string, any>;
    }
  ): ForecastAuditEvent {
    const key = `${userId}:${researchRunId}`;
    const history = auditStore.get(key) || [];

    const event: ForecastAuditEvent = {
      auditId: `afa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId,
      researchRunId,
      eventType,
      targetId,
      beforeState: options?.beforeState,
      afterState: options?.afterState,
      reason,
      metadata: options?.metadata,
    };

    history.push(event);
    auditStore.set(key, history);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("auditStore", key, "AUDIT_EVENT", history).catch(e => console.warn(e));
    return event;
  }

  /**
   * Retrieves the audit history for a user and research run.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ForecastAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    return [...(auditStore.get(key) || [])];
  }

  /**
   * Clears the audit ledger (used for unit testing).
   */
  static clearHistory(): void {
    auditStore.clear();
  }
}
