import { CertificationAuditEvent } from "./creator-certification.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForCertificationAudit = globalThis as unknown as {
  creatorCertificationAuditStore: Map<string, CertificationAuditEvent[]> | undefined;
};

const certificationAuditStore =
  globalForCertificationAudit.creatorCertificationAuditStore ?? new Map<string, CertificationAuditEvent[]>();
if (process.env.NODE_ENV !== "production")
  globalForCertificationAudit.creatorCertificationAuditStore = certificationAuditStore;

export class CreatorCertificationAuditService {
  /**
   * Records an immutable certification / release lock event strictly partitioned by userId and researchRunId.
   */
  static recordAuditEvent(event: CertificationAuditEvent): CertificationAuditEvent {
    const key = `${event.userId}:${event.researchRunId}`;
    const current = certificationAuditStore.get(key) || [];

    const frozenEvent: CertificationAuditEvent = Object.freeze({
      ...event,
      auditId: event.auditId || `cert-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
    });

    certificationAuditStore.set(key, [frozenEvent, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("certificationAuditStore", key, "AUDIT_EVENT", frozenEvent).catch(e => console.warn(e));
    return frozenEvent;
  }

  /**
   * Retrieves chronological certification audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): CertificationAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    const records = certificationAuditStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears audit history (for testing isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      certificationAuditStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of certificationAuditStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          certificationAuditStore.delete(key);
        }
      }
    } else {
      certificationAuditStore.clear();
    }
  }
}
