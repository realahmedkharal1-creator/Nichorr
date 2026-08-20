import { KnowledgeItemEntity } from "@/lib/database/repositories/knowledge.repo";

export interface ResearchQueueItem {
  id: string;
  projectId: string;
  topic: string;
  objective: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  freshnessRequirement: string;
  suggestedQuestions: string[];
}

export function generateResearchQueue(
  projectId: string,
  knowledgeItems: KnowledgeItemEntity[]
): ResearchQueueItem[] {
  const queue: ResearchQueueItem[] = [];

  for (const item of knowledgeItems) {
    if (item.status === "CONTRADICTED") {
      queue.push({
        id: `q-conflict-${item.id}`,
        projectId,
        topic: `Resolve Conflict: ${item.normalized_claim}`,
        objective: `Re-evaluate contradicting evidence and benchmark test conditions for ${item.normalized_claim}.`,
        priority: "HIGH",
        reason: "Contradictory evidence detected between independent technical sources.",
        freshnessRequirement: "STRICT_30_DAYS",
        suggestedQuestions: [
          `What are the methodology differences in testing ${item.normalized_claim}?`,
          `Are there thermal or regional hardware variants affecting ${item.normalized_claim}?`,
        ],
      });
    } else if (item.freshness_status === "STALE") {
      queue.push({
        id: `q-stale-${item.id}`,
        projectId,
        topic: `Refresh Evidence: ${item.normalized_claim}`,
        objective: `Verify latest published driver updates and independent laboratory benchmarks.`,
        priority: "MEDIUM",
        reason: "Existing evidence is over 30 days old.",
        freshnessRequirement: "STRICT_30_DAYS",
        suggestedQuestions: [
          `Have recent software updates improved ${item.normalized_claim}?`,
        ],
      });
    }
  }

  if (queue.length === 0) {
    queue.push({
      id: `q-default-${Date.now()}`,
      projectId,
      topic: "Deep Dive Architecture Benchmark",
      objective: "Comprehensive multi-source audit of sustained efficiency & memory bandwidth.",
      priority: "LOW",
      reason: "Routine knowledge maintenance sweep.",
      freshnessRequirement: "STANDARD",
      suggestedQuestions: [
        "What is the maximum sustained memory bandwidth?",
        "What are the power consumption limits under load?",
      ],
    });
  }

  return queue;
}
