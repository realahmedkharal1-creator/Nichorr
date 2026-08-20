import { IntelligenceAuditEvent } from "./intelligence.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForIntelligenceAudit = globalThis as unknown as {
  creatorIntelligenceAuditStore: Map<string, IntelligenceAuditEvent[]> | undefined;
};

const intelligenceAuditStore =
  globalForIntelligenceAudit.creatorIntelligenceAuditStore ?? new Map<string, IntelligenceAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForIntelligenceAudit.creatorIntelligenceAuditStore = intelligenceAuditStore;

export class IntelligenceAuditService {
  /**
   * Records an immutable intelligence ecosystem audit event strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: IntelligenceAuditEvent): IntelligenceAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = intelligenceAuditStore.get(key) || [];

    const frozenEvent: IntelligenceAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `intel-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    intelligenceAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("creator_intelligence_audit", key, frozenEvent.action, frozenEvent).catch(e => console.warn(e));

    return frozenEvent;
  }

  /**
   * Retrieves chronological audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): IntelligenceAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = intelligenceAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      intelligenceAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of intelligenceAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          intelligenceAuditStore.delete(key);
        }
      }
    } else {
      intelligenceAuditStore.clear();
    }
  }
}
