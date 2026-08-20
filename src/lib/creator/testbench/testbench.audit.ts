import crypto from "crypto";
import { TestbenchAuditEvent } from "./testbench.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForTestbenchAudit = globalThis as unknown as {
  testbenchAuditLedger: Map<string, TestbenchAuditEvent[]> | undefined;
};

const auditStore =
  globalForTestbenchAudit.testbenchAuditLedger ?? new Map<string, TestbenchAuditEvent[]>();
if (process.env.NODE_ENV !== "production") {
  globalForTestbenchAudit.testbenchAuditLedger = auditStore;
}

export class TestbenchAuditService {
  /**
   * Appends an immutable audit event to the ledger for the given research run and user.
   */
  static record(
    researchRunId: string,
    userId: string,
    event: Omit<TestbenchAuditEvent, "auditId" | "timestamp" | "userId" | "researchRunId">
  ): TestbenchAuditEvent {
    const key = `${userId}:${researchRunId}`;
    const ledger = auditStore.get(key) || [];

    const record: TestbenchAuditEvent = {
      auditId: `tba-${crypto.randomUUID().slice(0, 12)}`,
      timestamp: new Date().toISOString(),
      userId,
      researchRunId,
      ...event,
    };

    ledger.push(record);
    auditStore.set(key, ledger);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveAudit("auditStore", key, "AUDIT_EVENT", ledger).catch(e => console.warn(e));
    return record;
  }

  /**
   * Retrieves the immutable audit ledger for a research run and user.
   */
  static getLedger(researchRunId: string, userId: string): TestbenchAuditEvent[] {
    const key = `${userId}:${researchRunId}`;
    return [...(auditStore.get(key) || [])];
  }

  /**
   * Clears the ledger (testing only).
   */
  static clearLedger(researchRunId: string, userId: string): void {
    const key = `${userId}:${researchRunId}`;
    auditStore.delete(key);
  }
}
