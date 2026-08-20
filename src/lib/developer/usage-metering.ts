export interface MeteredUsageRecord {
  workspaceId: string;
  endpoint: string;
  tokensUsed: number;
  computeCost: number;
  recordedAt: string;
}

export class UsageMeteringService {
  static recordUsage(workspaceId: string, endpoint: string, tokensUsed: number = 250): MeteredUsageRecord {
    const cost = (tokensUsed / 1000) * 0.002;
    return {
      workspaceId,
      endpoint,
      tokensUsed,
      computeCost: cost,
      recordedAt: new Date().toISOString(),
    };
  }
}
