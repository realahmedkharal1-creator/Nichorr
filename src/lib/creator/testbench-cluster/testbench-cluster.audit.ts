import crypto from "crypto";
import { TestbenchClusterAuditEvent } from "./testbench-cluster.types";

export class TestbenchClusterAuditService {
  private static ledger: Map<string, TestbenchClusterAuditEvent[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  public static log(
    clusterId: string,
    researchRunId: string,
    userId: string,
    eventType: TestbenchClusterAuditEvent["eventType"],
    targetId: string,
    actor: string,
    reason: string,
    beforeState?: string,
    afterState?: string,
    metadata?: Record<string, any>
  ): TestbenchClusterAuditEvent {
    const key = this.getPartitionKey(researchRunId, userId);
    const existing = this.ledger.get(key) || [];

    const timestamp = new Date().toISOString();
    const auditId = `tbca-${crypto.randomBytes(8).toString("hex")}`;

    const rawPayload = JSON.stringify({
      auditId,
      clusterId,
      researchRunId,
      userId,
      timestamp,
      eventType,
      targetId,
      actor,
      beforeState,
      afterState,
      reason,
      metadata,
    });

    const integrityHash = crypto.createHash("sha256").update(rawPayload).digest("hex");

    const event: TestbenchClusterAuditEvent = {
      auditId,
      clusterId,
      userId,
      researchRunId,
      timestamp,
      eventType,
      targetId,
      actor,
      beforeState,
      afterState,
      reason,
      metadata,
      integrityHash,
    };

    existing.push(event);
    this.ledger.set(key, existing);
    return event;
  }

  public static getLedger(researchRunId: string, userId: string): TestbenchClusterAuditEvent[] {
    const key = this.getPartitionKey(researchRunId, userId);
    return this.ledger.get(key) || [];
  }

  public static clear(researchRunId: string, userId: string): void {
    const key = this.getPartitionKey(researchRunId, userId);
    this.ledger.delete(key);
  }
}
