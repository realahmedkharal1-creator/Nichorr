import crypto from "crypto";
import { CrossLabRegressionAuditEvent } from "./cross-lab-regression.types";

export class CrossLabRegressionAuditService {
  private static ledger: Map<string, CrossLabRegressionAuditEvent[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  public static log(
    userId: string,
    researchRunId: string,
    eventType: CrossLabRegressionAuditEvent["eventType"],
    targetId: string,
    actor: string,
    reason: string,
    beforeState?: string,
    afterState?: string,
    metadata?: Record<string, any>
  ): CrossLabRegressionAuditEvent {
    const key = this.getPartitionKey(researchRunId, userId);
    const existing = this.ledger.get(key) || [];

    const timestamp = new Date().toISOString();
    const auditId = `clra-${crypto.randomBytes(8).toString("hex")}`;

    const rawPayload = JSON.stringify({
      auditId,
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
    });

    const integrityHash = crypto.createHash("sha256").update(rawPayload).digest("hex");

    const event: CrossLabRegressionAuditEvent = {
      auditId,
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

  public static getLedger(researchRunId: string, userId: string): CrossLabRegressionAuditEvent[] {
    const key = this.getPartitionKey(researchRunId, userId);
    return this.ledger.get(key) || [];
  }

  public static clear(researchRunId: string, userId: string): void {
    const key = this.getPartitionKey(researchRunId, userId);
    this.ledger.delete(key);
  }
}
