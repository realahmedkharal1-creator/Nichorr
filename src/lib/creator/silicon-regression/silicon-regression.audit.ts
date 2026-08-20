import { RegressionAuditEvent } from "./silicon-regression.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForSiliconAudit = globalThis as unknown as {
  siliconRegressionAuditStore: Map<string, RegressionAuditEvent[]> | undefined;
};

const auditStore =
  globalForSiliconAudit.siliconRegressionAuditStore ??
  new Map<string, RegressionAuditEvent[]>();

if (process.env.NODE_ENV !== "production") {
  globalForSiliconAudit.siliconRegressionAuditStore = auditStore;
}

export class SiliconRegressionAuditService {
  /**
   * Records an immutable silicon regression audit event.
   */
  static logEvent(
    userId: string,
    researchRunId: string,
    eventType: RegressionAuditEvent["eventType"],
    targetId: string,
    reason: string,
    options?: {
      beforeState?: string;
      afterState?: string;
      metadata?: Record<string, any>;
    }
  ): RegressionAuditEvent {
    const key = `${userId}:${researchRunId}`;
    const history = auditStore.get(key) || [];

    const event: RegressionAuditEvent = {
      auditId: `sra-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId,
      researchRunId,
      eventType,
      targetId,
      beforeState: options?.beforeState,
      afterState: options?.afterState,
      reason,
      metadata: options?.metadata,
    };

    history.push(event);
    auditStore.set(key, history);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("auditStore", key, "AUDIT_EVENT", history).catch(e => console.warn(e));
    return event;
  }

  /**
   * Retrieves the audit history for a user and research run.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): RegressionAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    return [...(auditStore.get(key) || [])];
  }

  /**
   * Clears the audit ledger (used for unit testing).
   */
  static clearHistory(): void {
    auditStore.clear();
  }
}
