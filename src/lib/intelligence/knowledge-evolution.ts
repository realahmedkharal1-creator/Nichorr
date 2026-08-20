export type KnowledgeLifecycleState =
  | "NEW"
  | "ACTIVE"
  | "UPDATED"
  | "CONTESTED"
  | "STALE"
  | "SUPERSEDED"
  | "ARCHIVED";

export interface KnowledgeLifecycleTransition {
  from: KnowledgeLifecycleState;
  to: KnowledgeLifecycleState;
  reason: string;
  timestamp: string;
}

export function evaluateKnowledgeState(
  status: string,
  freshnessStatus: string,
  changeCount: number
): KnowledgeLifecycleState {
  if (status === "CONTRADICTED") return "CONTESTED";
  if (freshnessStatus === "STALE") return "STALE";
  if (changeCount > 2) return "UPDATED";
  if (status === "SUPPORTED") return "ACTIVE";
  return "NEW";
}
