import { DistributionAuditEvent } from "./distribution.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForDistributionAudit = globalThis as unknown as {
  distributionAuditStore: Map<string, DistributionAuditEvent[]> | undefined;
};

const auditStore = globalForDistributionAudit.distributionAuditStore ?? new Map<string, DistributionAuditEvent[]>();
if (process.env.NODE_ENV !== "production") globalForDistributionAudit.distributionAuditStore = auditStore;

export class DistributionAuditService {
  /**
   * Records an immutable distribution audit event, strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: DistributionAuditEvent): DistributionAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = auditStore.get(key) || [];

    const frozenEvent: DistributionAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `dist-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    auditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("auditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological distribution audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): DistributionAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = auditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for test isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      auditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of auditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          auditStore.delete(key);
        }
      }
    } else {
      auditStore.clear();
    }
  }
}
