import { KnowledgeRepository } from "@/lib/database/repositories/knowledge.repo";

export type ResearchDecision = "RESEARCH_NOW" | "RESEARCH_LATER" | "NO_RESEARCH_NEEDED" | "REQUIRES_APPROVAL";

export interface ResearchPlanOutput {
  decision: ResearchDecision;
  rationale: string;
  reusedFactsCount: number;
  marginalValueScore: number; // 0.0 to 1.0
  estimatedCostUSD: number;
}

export class ResearchPlannerAgent {
  private knowledgeRepo = new KnowledgeRepository();

  async evaluateResearchNeed(params: {
    projectId: string;
    topic: string;
    existingKnowledgeCount?: number;
    staleFactCount?: number;
    contestedFactCount?: number;
  }): Promise<ResearchPlanOutput> {
    const knowledgeItems = await this.knowledgeRepo.getKnowledgeByProjectId(params.projectId);
    const reusedFactsCount = knowledgeItems.length;
    const staleCount = params.staleFactCount || knowledgeItems.filter((k: any) => k.status === "STALE" || k.lifecycle_state === "STALE").length;
    const contestedCount = params.contestedFactCount || knowledgeItems.filter((k: any) => k.status === "CONTRADICTED" || k.lifecycle_state === "CONTESTED").length;

    // Decision Logic
    if (contestedCount > 0) {
      return {
        decision: "REQUIRES_APPROVAL",
        rationale: `Found ${contestedCount} contested knowledge facts in project. Human approval required before triggering investigation.`,
        reusedFactsCount,
        marginalValueScore: 0.95,
        estimatedCostUSD: 0.005,
      };
    }

    if (staleCount > 0 || reusedFactsCount === 0) {
      return {
        decision: "RESEARCH_NOW",
        rationale: reusedFactsCount === 0 ? "No existing knowledge found for project. Initial baseline research required." : `Found ${staleCount} stale facts requiring evidence refresh.`,
        reusedFactsCount,
        marginalValueScore: 0.85,
        estimatedCostUSD: 0.004,
      };
    }

    return {
      decision: "NO_RESEARCH_NEEDED",
      rationale: `Sufficient verified knowledge already exists (${reusedFactsCount} active facts). Marginal evidence value of new research is low.`,
      reusedFactsCount,
      marginalValueScore: 0.15,
      estimatedCostUSD: 0.0,
    };
  }
}
