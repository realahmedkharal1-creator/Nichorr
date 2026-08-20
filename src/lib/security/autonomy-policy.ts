export type AutonomyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface AutonomyCheckRequest {
  workspaceId: string;
  actionType: string;
  estimatedCost: number;
  riskLevel: "MINIMAL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AutonomyCheckResult {
  allowed: boolean;
  requiresHumanApproval: boolean;
  autonomyLevel: AutonomyLevel;
  reason: string;
}

export class AutonomyPolicyGuard {
  static evaluateAutonomy(req: AutonomyCheckRequest): AutonomyCheckResult {
    // High and critical risk actions always require human approval regardless of autonomy level
    if (req.riskLevel === "HIGH" || req.riskLevel === "CRITICAL") {
      return {
        allowed: false,
        requiresHumanApproval: true,
        autonomyLevel: 3,
        reason: "Consequential action classified as HIGH/CRITICAL risk requires human approval.",
      };
    }

    if (req.estimatedCost > 5.00) {
      return {
        allowed: false,
        requiresHumanApproval: true,
        autonomyLevel: 3,
        reason: "Cost estimate exceeds $5.00 autonomy policy limit.",
      };
    }

    return {
      allowed: true,
      requiresHumanApproval: false,
      autonomyLevel: 4,
      reason: "Action meets Level 4 Bounded Autonomy policy criteria.",
    };
  }
}
