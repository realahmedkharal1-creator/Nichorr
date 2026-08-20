export interface AdaptiveGovernanceClassification {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "GOVERNANCE_SENSITIVE";
  requiresHumanApproval: boolean;
  canAutoDeploy: boolean;
  reason: string;
}

export class AdaptiveGovernanceEngine {
  static classifyProposal(proposalRisk: "LOW" | "MEDIUM" | "HIGH" | "GOVERNANCE_SENSITIVE", autonomyLevel: number = 3): AdaptiveGovernanceClassification {
    const isSensitive = proposalRisk === "HIGH" || proposalRisk === "GOVERNANCE_SENSITIVE";
    const canAuto = autonomyLevel >= 3 && !isSensitive;

    return {
      riskLevel: proposalRisk,
      requiresHumanApproval: !canAuto,
      canAutoDeploy: canAuto,
      reason: canAuto
        ? "Low/medium risk configuration change allowed under Autonomy Level 3 policy."
        : "Governance or security sensitive proposal requires explicit human authorization.",
    };
  }
}
