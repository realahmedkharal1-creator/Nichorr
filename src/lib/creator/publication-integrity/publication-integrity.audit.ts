import { PublicationAuditEvent } from "./publication-integrity.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForPubIntegrityAudit = globalThis as unknown as {
  creatorPublicationIntegrityAuditStore: Map<string, PublicationAuditEvent[]> | undefined;
};

const pubIntegrityAuditStore =
  globalForPubIntegrityAudit.creatorPublicationIntegrityAuditStore ?? new Map<string, PublicationAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForPubIntegrityAudit.creatorPublicationIntegrityAuditStore = pubIntegrityAuditStore;

export class PublicationIntegrityAuditService {
  /**
   * Records an immutable publication integrity audit event strictly partitioned by userId and researchRunId.
   */
  static recordEvent(event: PublicationAuditEvent): PublicationAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = pubIntegrityAuditStore.get(key) || [];

    const frozenEvent: PublicationAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `pia-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    pubIntegrityAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("pubIntegrityAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological publication integrity audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): PublicationAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = pubIntegrityAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for test isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      pubIntegrityAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of pubIntegrityAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          pubIntegrityAuditStore.delete(key);
        }
      }
    } else {
      pubIntegrityAuditStore.clear();
    }
  }
}
