import crypto from "crypto";
import { HypothesisAuditEvent } from "./hypothesis.types";

export class HypothesisAuditService {
  private static ledger: Map<string, HypothesisAuditEvent[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  public static log(
    userId: string,
    researchRunId: string,
    eventType: HypothesisAuditEvent["eventType"],
    targetId: string,
    actor: string,
    reason: string,
    metadata?: Record<string, any>
  ): HypothesisAuditEvent {
    const key = this.getPartitionKey(researchRunId, userId);
    const existing = this.ledger.get(key) || [];

    const timestamp = new Date().toISOString();
    const auditId = `hyau-${crypto.randomBytes(8).toString("hex")}`;

    const rawPayload = JSON.stringify({
      auditId,
      userId,
      researchRunId,
      timestamp,
      eventType,
      targetId,
      actor,
      reason,
      metadata,
    });

    const integrityHash = crypto.createHash("sha256").update(rawPayload).digest("hex");

    const event: HypothesisAuditEvent = {
      auditId,
      userId,
      researchRunId,
      timestamp,
      eventType,
      targetId,
      actor,
      reason,
      metadata,
      integrityHash,
    };

    existing.push(event);
    this.ledger.set(key, existing);
    return event;
  }

  public static getLedger(researchRunId: string, userId: string): HypothesisAuditEvent[] {
    const key = this.getPartitionKey(researchRunId, userId);
    return this.ledger.get(key) || [];
  }

  public static clear(researchRunId: string, userId: string): void {
    const key = this.getPartitionKey(researchRunId, userId);
    this.ledger.delete(key);
  }
}
