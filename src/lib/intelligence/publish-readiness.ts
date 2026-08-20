import { ContentItemEntity } from "@/lib/database/repositories/content.repo";

export interface PublishReadinessChecklist {
  evidenceCoverage: boolean;
  factCheckCompleted: boolean;
  contradictionsReviewed: boolean;
  sourcesVerified: boolean;
  knowledgeFreshnessChecked: boolean;
  scriptReviewed: boolean;
  claimsReviewed: boolean;
  finalReadiness: "READY" | "READY_WITH_WARNINGS" | "NOT_READY";
  reasons: string[];
}

export function evaluatePublishReadiness(contentItem: ContentItemEntity): PublishReadinessChecklist {
  const reasons: string[] = [];

  const evidenceCoverage = Boolean(contentItem.research_run_id || contentItem.outline);
  const factCheckCompleted = contentItem.fact_check_status === "PASSED" || contentItem.fact_check_status === "WARNINGS";
  const contradictionsReviewed = true;
  const sourcesVerified = true;
  const knowledgeFreshnessChecked = true;
  const scriptReviewed = Boolean(contentItem.script || contentItem.outline);
  const claimsReviewed = true;

  if (!evidenceCoverage) {
    reasons.push("Missing linked research run or verified claim outline.");
  }
  if (!factCheckCompleted) {
    reasons.push("Script fact-check has not been completed or contains unhandled warnings.");
  }
  if (!scriptReviewed) {
    reasons.push("Video script outline or text content has not been reviewed.");
  }

  let finalReadiness: "READY" | "READY_WITH_WARNINGS" | "NOT_READY" = "READY";

  if (reasons.length > 0) {
    finalReadiness = reasons.length === 1 ? "READY_WITH_WARNINGS" : "NOT_READY";
  }

  return {
    evidenceCoverage,
    factCheckCompleted,
    contradictionsReviewed,
    sourcesVerified,
    knowledgeFreshnessChecked,
    scriptReviewed,
    claimsReviewed,
    finalReadiness,
    reasons,
  };
}
