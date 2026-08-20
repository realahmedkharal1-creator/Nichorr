import { ResearchRunSession } from "@/features/research/research-engine";
import { KnowledgeRepository, KnowledgeItemEntity, KnowledgeChangeEntity } from "@/lib/database/repositories/knowledge.repo";

export class KnowledgeNormalizer {
  private repo = new KnowledgeRepository();

  async reconcileRunClaims(projectId: string, session: ResearchRunSession): Promise<{
    addedCount: number;
    updatedCount: number;
    contradictionCount: number;
  }> {
    const existingItems = await this.repo.getKnowledgeByProjectId(projectId);
    const existingMap = new Map<string, KnowledgeItemEntity>();
    for (const item of existingItems) {
      existingMap.set(item.normalized_claim.toLowerCase().trim(), item);
    }

    let addedCount = 0;
    let updatedCount = 0;
    let contradictionCount = 0;

    for (const claim of session.claims || []) {
      const claimKey = claim.claim_text.toLowerCase().trim();
      const existing = existingMap.get(claimKey);

      if (!existing) {
        // Create new knowledge item
        const newItem: KnowledgeItemEntity = {
          id: `know-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          project_id: projectId,
          normalized_claim: claim.claim_text,
          current_value: claim.claim_text,
          confidence: (claim.confidence as any) || "HIGH",
          status: claim.status === "CONTRADICTED" ? "CONTRADICTED" : "SUPPORTED",
          supporting_sources_count: session.sources.length || 1,
          last_verified_at: new Date().toISOString(),
          freshness_status: "FRESH",
          originating_run_id: session.id,
          latest_run_id: session.id,
        };

        await this.repo.saveKnowledgeItem(newItem);
        addedCount++;

        const change: KnowledgeChangeEntity = {
          id: `chg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          project_id: projectId,
          knowledge_item_id: newItem.id,
          change_type: "NEW_INFO",
          new_value: claim.claim_text,
          explanation: `Surfaced new verified fact from research run "${session.topic}".`,
          detecting_run_id: session.id,
          detected_at: new Date().toISOString(),
        };
        await this.repo.recordChange(change);
      } else {
        // Reconcile existing item
        let hasContradiction = claim.status === "CONTRADICTED";
        if (hasContradiction) {
          contradictionCount++;
          existing.status = "CONTRADICTED";
          existing.latest_run_id = session.id;
          existing.last_verified_at = new Date().toISOString();
          await this.repo.saveKnowledgeItem(existing);

          const change: KnowledgeChangeEntity = {
            id: `chg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            project_id: projectId,
            knowledge_item_id: existing.id,
            change_type: "CONTRADICTION",
            previous_value: existing.current_value,
            new_value: claim.claim_text,
            explanation: `Contradictory evidence surfaced in research run "${session.topic}".`,
            detecting_run_id: session.id,
            detected_at: new Date().toISOString(),
          };
          await this.repo.recordChange(change);
        } else {
          updatedCount++;
          existing.supporting_sources_count += 1;
          existing.last_verified_at = new Date().toISOString();
          existing.latest_run_id = session.id;
          await this.repo.saveKnowledgeItem(existing);
        }
      }
    }

    return { addedCount, updatedCount, contradictionCount };
  }
}
