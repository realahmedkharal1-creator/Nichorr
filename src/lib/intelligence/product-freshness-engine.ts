export interface ProductFreshnessAnalysis {
  productId: string;
  freshnessStatus: "FRESH" | "AGING" | "STALE" | "EXPIRED";
  lastGeneratedAt: string;
  hoursSinceGeneration: number;
  requiresRegeneration: boolean;
}

export class ProductFreshnessEngine {
  static evaluateFreshness(productId: string, lastGeneratedAt: string, policy: string): ProductFreshnessAnalysis {
    const elapsedMs = Date.now() - new Date(lastGeneratedAt).getTime();
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));

    let status: "FRESH" | "AGING" | "STALE" | "EXPIRED" = "FRESH";
    if (hours > 72) status = "STALE";
    else if (hours > 24) status = "AGING";

    return {
      productId,
      freshnessStatus: status,
      lastGeneratedAt,
      hoursSinceGeneration: hours,
      requiresRegeneration: status === "STALE",
    };
  }
}
