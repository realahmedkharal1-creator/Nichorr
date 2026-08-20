export type ChangeSignificanceClass = "TRIVIAL" | "MINOR" | "SIGNIFICANT" | "MAJOR" | "CRITICAL";

export interface ChangeSignificanceOutput {
  classification: ChangeSignificanceClass;
  score: number; // 0 to 100
  marginalValueScore: number; // 0.0 to 1.0
  triggersAutomation: boolean;
  requiresApproval: boolean;
}

export class ChangeSignificanceEngine {
  evaluateSignificance(params: {
    isContradiction?: boolean;
    valueDiffPercentage?: number;
    affectedContentCount?: number;
    isSpecificationChange?: boolean;
  }): ChangeSignificanceOutput {
    let score = 20; // Baseline TRIVIAL

    if (params.isContradiction) score += 40;
    if (params.isSpecificationChange) score += 30;
    if ((params.affectedContentCount || 0) > 0) score += Math.min(30, (params.affectedContentCount || 0) * 15);
    if ((params.valueDiffPercentage || 0) > 10) score += 20;

    score = Math.min(100, Math.max(10, score));

    let classification: ChangeSignificanceClass = "MINOR";
    if (score >= 85) classification = "CRITICAL";
    else if (score >= 70) classification = "MAJOR";
    else if (score >= 50) classification = "SIGNIFICANT";
    else if (score >= 30) classification = "MINOR";
    else classification = "TRIVIAL";

    const triggersAutomation = score >= 50;
    const requiresApproval = score >= 85;
    const marginalValueScore = Number((score / 100).toFixed(2));

    return {
      classification,
      score,
      marginalValueScore,
      triggersAutomation,
      requiresApproval,
    };
  }
}
