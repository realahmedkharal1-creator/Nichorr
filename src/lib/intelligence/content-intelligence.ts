import { KnowledgeItemEntity } from "@/lib/database/repositories/knowledge.repo";

export interface ContentIdea {
  id: string;
  title: string;
  suggestedHook: string;
  recommendedFormat: "YouTube Video" | "YouTube Short" | "Instagram Reel" | "TikTok" | "Article" | "Newsletter";
  score: number; // 0 to 100
  evidenceStrength: number; // 0 to 100
  audienceDemand: number; // 0 to 100
  novelty: number; // 0 to 100
  reasonForRecommendation: string;
  supportingClaim?: string;
}

export function generateContentIdeas(
  projectId: string,
  knowledgeItems: KnowledgeItemEntity[]
): ContentIdea[] {
  const ideas: ContentIdea[] = [];

  for (const item of knowledgeItems) {
    if (item.status === "CONTRADICTED") {
      ideas.push({
        id: `idea-myth-${item.id}`,
        title: `Myth Busting: ${item.normalized_claim}`,
        suggestedHook: `Everyone thinks ${item.normalized_claim}, but our benchmark evidence proves otherwise.`,
        recommendedFormat: "YouTube Video",
        score: 94,
        evidenceStrength: 88,
        audienceDemand: 95,
        novelty: 92,
        reasonForRecommendation: "High audience controversy & contradictory lab benchmarks.",
        supportingClaim: item.current_value,
      });
    } else if (item.confidence === "HIGH") {
      ideas.push({
        id: `idea-deep-${item.id}`,
        title: `Deep Dive: ${item.normalized_claim}`,
        suggestedHook: `Here is the exact technical breakdown of ${item.normalized_claim} backed by lab evidence.`,
        recommendedFormat: "YouTube Short",
        score: 85,
        evidenceStrength: 96,
        audienceDemand: 82,
        novelty: 78,
        reasonForRecommendation: "Strong primary source backing and high evidence confidence.",
        supportingClaim: item.current_value,
      });
    }
  }

  if (ideas.length === 0) {
    ideas.push({
      id: `idea-default-1`,
      title: "Comprehensive Architecture Comparison & Benchmark Audit",
      suggestedHook: "We audited all published technical benchmarks so you don't have to.",
      recommendedFormat: "YouTube Video",
      score: 80,
      evidenceStrength: 85,
      audienceDemand: 80,
      novelty: 75,
      reasonForRecommendation: "Baseline technical comparison for technology buyers.",
    });
  }

  return ideas.sort((a, b) => b.score - a.score);
}
