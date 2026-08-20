export interface OperationalRecommendation {
  id: string;
  category: "RESEARCH_FRESHNESS" | "EVIDENCE_CONTRADICTION" | "QUOTA_WARNING" | "WEBHOOK_HEALTH";
  title: string;
  reason: string;
  suggestedAction: string;
  actionUrl: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export class RecommendationEngine {
  static getRecommendations(workspaceId: string): OperationalRecommendation[] {
    return [
      {
        id: "rec-1",
        category: "RESEARCH_FRESHNESS",
        title: "Refresh Tech Specs for Exynos 2600",
        reason: "Primary evidence is older than 14 days and new benchmark leaks were detected.",
        suggestedAction: "Trigger Non-Destructive Research Rerun",
        actionUrl: "/research/run-1/config",
        severity: "MEDIUM",
      },
      {
        id: "rec-2",
        category: "EVIDENCE_CONTRADICTION",
        title: "Review Contested Battery Capacity Claim",
        reason: "Two independent primary sources contradict on mAh ratings.",
        suggestedAction: "Open Conflict Matrix & Human Review Gate",
        actionUrl: "/research/run-1/conflicts",
        severity: "HIGH",
      },
    ];
  }
}
