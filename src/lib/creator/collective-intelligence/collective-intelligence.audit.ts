import { CollectiveIntelligenceAuditEvent } from "./collective-intelligence.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForCollectiveAudit = globalThis as unknown as {
  collectiveIntelligenceAuditStore: Map<string, CollectiveIntelligenceAuditEvent[]> | undefined;
};

const auditStore =
  globalForCollectiveAudit.collectiveIntelligenceAuditStore ??
  new Map<string, CollectiveIntelligenceAuditEvent[]>();

if (process.env.NODE_ENV !== "production") {
  globalForCollectiveAudit.collectiveIntelligenceAuditStore = auditStore;
}

export class CollectiveIntelligenceAuditService {
  /**
   * Records an immutable collective intelligence audit event.
   */
  static logEvent(
    userId: string,
    researchRunId: string,
    eventType: CollectiveIntelligenceAuditEvent["eventType"],
    targetId: string,
    reason: string,
    options?: {
      beforeState?: string;
      afterState?: string;
      metadata?: Record<string, any>;
    }
  ): CollectiveIntelligenceAuditEvent {
    const key = `${userId}:${researchRunId}`;
    const history = auditStore.get(key) || [];

    const event: CollectiveIntelligenceAuditEvent = {
      auditId: `cia-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
  ): CollectiveIntelligenceAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    return [...(auditStore.get(key) || [])];
  }

  /**
   * Clears the audit ledger (used for unit tests).
   */
  static clearHistory(): void {
    auditStore.clear();
  }
}
