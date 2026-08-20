import { PublishingAuditEvent } from "./publishing.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForPublishingAudit = globalThis as unknown as {
  creatorPublishingAuditStore: Map<string, PublishingAuditEvent[]> | undefined;
};

const publishingAuditStore =
  globalForPublishingAudit.creatorPublishingAuditStore ?? new Map<string, PublishingAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForPublishingAudit.creatorPublishingAuditStore = publishingAuditStore;

export class PublishingAuditService {
  /**
   * Records an immutable publishing audit event strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: PublishingAuditEvent): PublishingAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = publishingAuditStore.get(key) || [];

    const frozenEvent: PublishingAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `pub-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    publishingAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("publishingAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological publishing audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): PublishingAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = publishingAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      publishingAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of publishingAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          publishingAuditStore.delete(key);
        }
      }
    } else {
      publishingAuditStore.clear();
    }
  }
}
