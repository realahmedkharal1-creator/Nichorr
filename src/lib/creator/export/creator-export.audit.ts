import { ExportAuditEvent } from "./creator-export.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForExportAudit = globalThis as unknown as {
  creatorExportAuditStore: Map<string, ExportAuditEvent[]> | undefined;
};

const exportAuditStore =
  globalForExportAudit.creatorExportAuditStore ?? new Map<string, ExportAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForExportAudit.creatorExportAuditStore = exportAuditStore;

export class CreatorExportAuditService {
  /**
   * Records an immutable export audit event strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: ExportAuditEvent): ExportAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = exportAuditStore.get(key) || [];

    const frozenEvent: ExportAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `exp-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    exportAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("exportAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): ExportAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = exportAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      exportAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of exportAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          exportAuditStore.delete(key);
        }
      }
    } else {
      exportAuditStore.clear();
    }
  }
}
