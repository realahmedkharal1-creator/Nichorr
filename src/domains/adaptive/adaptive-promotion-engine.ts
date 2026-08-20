export interface PromotionResult {
  controlKey: string;
  version: string;
  isPromoted: boolean;
  promotedAt?: string;
  reason: string;
}

export class AdaptivePromotionEngine {
  static promoteVersion(controlKey: string, version: string, passedGates: boolean, isApproved: boolean): PromotionResult {
    const canPromote = passedGates && isApproved;
    return {
      controlKey,
      version,
      isPromoted: canPromote,
      promotedAt: canPromote ? new Date().toISOString() : undefined,
      reason: canPromote
        ? "Safety gates passed and explicit governance authorization obtained."
        : "Promotion blocked due to unpassed safety gates or missing authorization.",
    };
  }
}
