import { DistributionReceipt } from "./publishing.types";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForReceiptLedger = globalThis as unknown as {
  creatorDistributionReceiptStore: Map<string, DistributionReceipt[]> | undefined;
};

const receiptStore =
  globalForReceiptLedger.creatorDistributionReceiptStore ?? new Map<string, DistributionReceipt[]>();
if (process.env.NODE_ENV !== "production")
  globalForReceiptLedger.creatorDistributionReceiptStore = receiptStore;

export class DistributionReceiptLedger {
  /**
   * Records an immutable distribution receipt.
   */
  static recordReceipt(receipt: DistributionReceipt): DistributionReceipt {
    const key = `${receipt.userId}:${receipt.researchRunId}`;
    const current = receiptStore.get(key) || [];

    const frozenReceipt: DistributionReceipt = Object.freeze({
      ...receipt,
      receiptId: receipt.receiptId || `drec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: receipt.timestamp || new Date().toISOString(),
    });

    receiptStore.set(key, [frozenReceipt, ...current]);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("receiptStore", "Artifact", key, frozenReceipt).catch(e => console.warn(e));
    return frozenReceipt;
  }

  /**
   * Retrieves all distribution receipts for a research run and user.
   */
  static getReceipts(researchRunId: string, userId: string = "anonymous-creator"): DistributionReceipt[] {
    const key = `${userId}:${researchRunId}`;
    const records = receiptStore.get(key) || [];
    return [...records];
  }

  /**
   * Retrieves a single receipt by ID.
   */
  static getReceiptById(receiptId: string, researchRunId: string, userId: string = "anonymous-creator"): DistributionReceipt | undefined {
    const receipts = this.getReceipts(researchRunId, userId);
    return receipts.find((r) => r.receiptId === receiptId);
  }

  /**
   * Clears receipt history (for test isolation).
   */
  static clearReceipts(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      receiptStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of receiptStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          receiptStore.delete(key);
        }
      }
    } else {
      receiptStore.clear();
    }
  }
}
