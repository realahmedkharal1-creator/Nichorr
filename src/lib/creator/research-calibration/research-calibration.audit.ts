import { ResearchCalibrationAuditEvent } from "./research-calibration.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForCalibrationAudit = globalThis as unknown as {
  creatorCalibrationAuditStore: Map<string, ResearchCalibrationAuditEvent[]> | undefined;
};

const calibrationAuditStore =
  globalForCalibrationAudit.creatorCalibrationAuditStore ?? new Map<string, ResearchCalibrationAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForCalibrationAudit.creatorCalibrationAuditStore = calibrationAuditStore;

export class ResearchCalibrationAuditService {
  /**
   * Records an immutable research calibration audit event partitioned by userId and researchRunId.
   */
  static recordEvent(event: ResearchCalibrationAuditEvent): ResearchCalibrationAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = calibrationAuditStore.get(key) || [];

    const frozenEvent: ResearchCalibrationAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `rca-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    calibrationAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("calibrationAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological research calibration audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): ResearchCalibrationAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = calibrationAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for test isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      calibrationAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of calibrationAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          calibrationAuditStore.delete(key);
        }
      }
    } else {
      calibrationAuditStore.clear();
    }
  }
}
