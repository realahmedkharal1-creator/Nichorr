import { CreatorDecisionRecord } from "./research-health-decision.types";

const globalForDecisionHistory = globalThis as unknown as {
  decisionHistoryStore: Map<string, CreatorDecisionRecord[]> | undefined;
};

const historyStore = globalForDecisionHistory.decisionHistoryStore ?? new Map<string, CreatorDecisionRecord[]>();
if (process.env.NODE_ENV !== "production") globalForDecisionHistory.decisionHistoryStore = historyStore;

export class DecisionHistoryService {
  /**
   * Records an immutable creator decision or action event, strictly partitioned by userId.
   */
  static recordDecision(record: CreatorDecisionRecord): CreatorDecisionRecord {
    const key = `${record.userId}:${record.researchRunId}`;
    const current = historyStore.get(key) || [];

    const frozenRecord: CreatorDecisionRecord = Object.freeze({
      ...record,
      decisionRecordId: record.decisionRecordId || `drec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: record.timestamp || new Date().toISOString(),
    });

    historyStore.set(key, [frozenRecord, ...current]);
    return frozenRecord;
  }

  /**
   * Retrieves chronological decision history for a given run and user.
   * Guarantees strict user isolation.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): CreatorDecisionRecord[] {
    const key = `${userId}:${researchRunId}`;
    const records = historyStore.get(key) || [];
    return [...records];
  }

  /**
   * Clears decision history (for test isolation).
   */
  static clearHistory(userId?: string, researchRunId?: string): void {
    if (userId && researchRunId) {
      historyStore.delete(`${userId}:${researchRunId}`);
    } else if (userId) {
      for (const key of historyStore.keys()) {
        if (key.startsWith(`${userId}:`)) {
          historyStore.delete(key);
        }
      }
    } else {
      historyStore.clear();
    }
  }
}
