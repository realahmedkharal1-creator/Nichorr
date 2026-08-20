import { ProductionMatrixAuditEvent } from "./production-matrix.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForMatrixAudit = globalThis as unknown as {
  creatorMatrixAuditStore: Map<string, ProductionMatrixAuditEvent[]> | undefined;
};

const matrixAuditStore =
  globalForMatrixAudit.creatorMatrixAuditStore ?? new Map<string, ProductionMatrixAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForMatrixAudit.creatorMatrixAuditStore = matrixAuditStore;

export class ProductionMatrixAuditService {
  /**
   * Records an immutable production matrix audit event strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: ProductionMatrixAuditEvent): ProductionMatrixAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = matrixAuditStore.get(key) || [];

    const frozenEvent: ProductionMatrixAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `pmat-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    matrixAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("matrixAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): ProductionMatrixAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = matrixAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      matrixAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of matrixAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          matrixAuditStore.delete(key);
        }
      }
    } else {
      matrixAuditStore.clear();
    }
  }
}
