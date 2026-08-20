import { ResourceTrackerRepository } from "@/lib/database/repositories/resource-tracker.repo";

export interface ResourceBudgetStatus {
  dailyCostUSD: number;
  maxDailyBudgetUSD: number;
  isBudgetExceeded: boolean;
  activeExecutionsCount: number;
}

export class ResourceTrackerIntelligence {
  private repo = new ResourceTrackerRepository();

  async evaluateBudget(projectId?: string, maxDailyBudgetUSD: number = 5.0): Promise<ResourceBudgetStatus> {
    const summary = await this.repo.getUsageSummary(projectId);
    const dailyCostUSD = Number(summary.totalCostUSD.toFixed(4));
    const isBudgetExceeded = dailyCostUSD >= maxDailyBudgetUSD;

    return {
      dailyCostUSD,
      maxDailyBudgetUSD,
      isBudgetExceeded,
      activeExecutionsCount: summary.logs.length,
    };
  }
}
