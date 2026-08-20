import { KnowledgeItemEntity } from "@/lib/database/repositories/knowledge.repo";

export interface ResearchGap {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: "STALE_EVIDENCE" | "UNRESOLVED_CONFLICT" | "SINGLE_SOURCE" | "UNVERIFIED_CLAIM";
  title: string;
  reason: string;
  suggestedTopic: string;
  suggestedObjective: string;
}

export interface ResearchRecommendations {
  healthScore: number; // 0 to 100
  gaps: ResearchGap[];
  recommendations: Array<{
    id: string;
    title: string;
    reason: string;
    suggestedTopic: string;
    suggestedObjective: string;
  }>;
}

export function detectResearchGaps(knowledgeItems: KnowledgeItemEntity[]): ResearchRecommendations {
  const gaps: ResearchGap[] = [];

  for (const item of knowledgeItems) {
    if (item.status === "CONTRADICTED") {
      gaps.push({
        id: `gap-${item.id}-conflict`,
        priority: "HIGH",
        category: "UNRESOLVED_CONFLICT",
        title: `Unresolved Conflict: ${item.normalized_claim}`,
        reason: "Two or more sources contradict each other regarding this technical specification.",
        suggestedTopic: `Re-evaluate ${item.normalized_claim}`,
        suggestedObjective: "Audit contradictory benchmarks and verify test methodology differences.",
      });
    } else if (item.freshness_status === "STALE") {
      gaps.push({
        id: `gap-${item.id}-stale`,
        priority: "MEDIUM",
        category: "STALE_EVIDENCE",
        title: `Stale Evidence: ${item.normalized_claim}`,
        reason: "Evidence supporting this claim is over 30 days old and needs fresh verification.",
        suggestedTopic: `Update research on ${item.normalized_claim}`,
        suggestedObjective: "Retrieve latest published benchmarks and official manufacturer updates.",
      });
    } else if (item.supporting_sources_count === 1) {
      gaps.push({
        id: `gap-${item.id}-singlesrc`,
        priority: "LOW",
        category: "SINGLE_SOURCE",
        title: `Single-Source Fact: ${item.normalized_claim}`,
        reason: "Claim currently relies on only 1 supporting source. Requires secondary corroboration.",
        suggestedTopic: `Corroborate ${item.normalized_claim}`,
        suggestedObjective: "Find independent secondary sources and laboratory benchmarks.",
      });
    }
  }

  // Calculate project knowledge health score
  const total = knowledgeItems.length || 1;
  const highImpactGaps = gaps.filter((g) => g.priority === "HIGH").length;
  const medImpactGaps = gaps.filter((g) => g.priority === "MEDIUM").length;
  const healthScore = Math.max(20, Math.round(100 - highImpactGaps * 15 - medImpactGaps * 5));

  const recommendations = gaps.slice(0, 3).map((g) => ({
    id: `rec-${g.id}`,
    title: g.title,
    reason: g.reason,
    suggestedTopic: g.suggestedTopic,
    suggestedObjective: g.suggestedObjective,
  }));

  return { healthScore, gaps, recommendations };
}
