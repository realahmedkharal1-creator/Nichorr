import { KnowledgeItemEntity, KnowledgeChangeEntity } from "@/lib/database/repositories/knowledge.repo";

export interface ChangeDetectionResult {
  newFactsCount: number;
  changedValuesCount: number;
  contradictionsCount: number;
  staleEvidenceCount: number;
  changes: KnowledgeChangeEntity[];
}

export function detectKnowledgeChanges(
  previousKnowledge: KnowledgeItemEntity[],
  currentKnowledge: KnowledgeItemEntity[]
): ChangeDetectionResult {
  const prevMap = new Map<string, KnowledgeItemEntity>();
  for (const item of previousKnowledge) {
    prevMap.set(item.normalized_claim.toLowerCase().trim(), item);
  }

  let newFactsCount = 0;
  let changedValuesCount = 0;
  let contradictionsCount = 0;
  let staleEvidenceCount = 0;
  const changes: KnowledgeChangeEntity[] = [];

  for (const curr of currentKnowledge) {
    const key = curr.normalized_claim.toLowerCase().trim();
    const prev = prevMap.get(key);

    if (!prev) {
      newFactsCount++;
      changes.push({
        id: `chg-det-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        project_id: curr.project_id,
        knowledge_item_id: curr.id,
        change_type: "NEW_INFO",
        new_value: curr.current_value,
        explanation: "Newly discovered fact added to project persistent knowledge base.",
        detected_at: new Date().toISOString(),
      });
    } else if (curr.status === "CONTRADICTED" && prev.status !== "CONTRADICTED") {
      contradictionsCount++;
      changes.push({
        id: `chg-det-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        project_id: curr.project_id,
        knowledge_item_id: curr.id,
        change_type: "CONTRADICTION",
        previous_value: prev.current_value,
        new_value: curr.current_value,
        explanation: "Contradiction detected against previously established knowledge.",
        detected_at: new Date().toISOString(),
      });
    } else if (curr.current_value !== prev.current_value) {
      changedValuesCount++;
      changes.push({
        id: `chg-det-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        project_id: curr.project_id,
        knowledge_item_id: curr.id,
        change_type: "VALUE_CHANGED",
        previous_value: prev.current_value,
        new_value: curr.current_value,
        explanation: "Knowledge fact value updated with recent evidence.",
        detected_at: new Date().toISOString(),
      });
    }

    if (curr.freshness_status === "STALE") {
      staleEvidenceCount++;
    }
  }

  return {
    newFactsCount,
    changedValuesCount,
    contradictionsCount,
    staleEvidenceCount,
    changes,
  };
}
