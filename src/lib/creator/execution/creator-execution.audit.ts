import { CreatorExecutionAuditEvent } from "./creator-execution.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForExecutionAudit = globalThis as unknown as {
  creatorExecutionAuditStore: Map<string, CreatorExecutionAuditEvent[]> | undefined;
};

const executionAuditStore =
  globalForExecutionAudit.creatorExecutionAuditStore ?? new Map<string, CreatorExecutionAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForExecutionAudit.creatorExecutionAuditStore = executionAuditStore;

export class CreatorExecutionAuditService {
  /**
   * Records an immutable execution lifecycle event, strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: CreatorExecutionAuditEvent): CreatorExecutionAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = executionAuditStore.get(key) || [];

    const frozenEvent: CreatorExecutionAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `exec-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    executionAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("executionAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological execution audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): CreatorExecutionAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = executionAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      executionAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of executionAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          executionAuditStore.delete(key);
        }
      }
    } else {
      executionAuditStore.clear();
    }
  }
}
