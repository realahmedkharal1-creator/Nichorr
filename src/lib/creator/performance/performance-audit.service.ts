import { PerformanceAuditEvent } from "./performance.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForPerformanceAudit = globalThis as unknown as {
  creatorPerformanceAuditStore: Map<string, PerformanceAuditEvent[]> | undefined;
};

const performanceAuditStore =
  globalForPerformanceAudit.creatorPerformanceAuditStore ?? new Map<string, PerformanceAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForPerformanceAudit.creatorPerformanceAuditStore = performanceAuditStore;

export class PerformanceAuditService {
  /**
   * Records an immutable performance / learning audit event strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: PerformanceAuditEvent): PerformanceAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = performanceAuditStore.get(key) || [];

    const frozenEvent: PerformanceAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `perf-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    performanceAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("performanceAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological performance audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): PerformanceAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = performanceAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      performanceAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of performanceAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          performanceAuditStore.delete(key);
        }
      }
    } else {
      performanceAuditStore.clear();
    }
  }
}
