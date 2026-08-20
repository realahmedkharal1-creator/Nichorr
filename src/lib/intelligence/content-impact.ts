import { ContentItemEntity } from "@/lib/database/repositories/content.repo";
import { KnowledgeChangeEntity } from "@/lib/database/repositories/knowledge.repo";

export interface ImpactAnalysisResult {
  affectedContentItems: Array<{
    contentItem: ContentItemEntity;
    flag: "REVIEW_REQUIRED" | "POTENTIALLY_OUTDATED";
    reason: string;
  }>;
}

export function analyzeContentImpact(
  contentItems: ContentItemEntity[],
  recentChanges: KnowledgeChangeEntity[]
): ImpactAnalysisResult {
  const affected: ImpactAnalysisResult["affectedContentItems"] = [];

  for (const item of contentItems) {
    // Only check content items that are beyond drafting stage
    if (["READY_TO_RECORD", "RECORDED", "EDITING", "READY_TO_PUBLISH", "PUBLISHED"].includes(item.stage)) {
      for (const chg of recentChanges) {
        if (chg.change_type === "CONTRADICTION" || chg.change_type === "VALUE_CHANGED") {
          affected.push({
            contentItem: item,
            flag: chg.change_type === "CONTRADICTION" ? "REVIEW_REQUIRED" : "POTENTIALLY_OUTDATED",
            reason: `Knowledge fact updated (${chg.change_type}): "${chg.explanation}"`,
          });
          break;
        }
      }
    }
  }

  return { affectedContentItems: affected };
}
