export interface CrossAgentVerificationResult {
  hasDisagreement: boolean;
  contestedClaimsCount: number;
  verificationStatus: "VERIFIED" | "CONTESTED" | "REQUIRES_EVIDENCE";
  evidenceEscalationRequired: boolean;
}

export class CrossAgentVerificationEngine {
  static verifyOutputs(agentResults: any[]): CrossAgentVerificationResult {
    const hasDisagreement = agentResults.some((r) => r.status === "CONTESTED");

    return {
      hasDisagreement,
      contestedClaimsCount: hasDisagreement ? 1 : 0,
      verificationStatus: hasDisagreement ? "CONTESTED" : "VERIFIED",
      evidenceEscalationRequired: hasDisagreement,
    };
  }
}
