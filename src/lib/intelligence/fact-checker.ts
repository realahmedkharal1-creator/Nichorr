import { KnowledgeItemEntity } from "@/lib/database/repositories/knowledge.repo";

export interface FactCheckResult {
  originalStatement: string;
  verdict: "SUPPORTED" | "CONTRADICTED" | "UNSUPPORTED" | "REQUIRES_CONTEXT";
  explanation: string;
  supportingFact?: string;
  saferWording?: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export function factCheckCreatorDraft(
  draftStatement: string,
  knowledgeItems: KnowledgeItemEntity[]
): FactCheckResult {
  const statementLower = draftStatement.toLowerCase().trim();
  if (!statementLower) {
    return {
      originalStatement: draftStatement,
      verdict: "UNSUPPORTED",
      explanation: "Empty draft statement provided.",
      confidence: "LOW",
    };
  }

  // Exact or word-set matching against persistent knowledge
  const words = statementLower.split(/s+/).filter((w) => w.length > 3);

  for (const item of knowledgeItems) {
    const claimLower = item.normalized_claim.toLowerCase();
    const overlap = words.filter((w) => claimLower.includes(w));
    const similarity = overlap.length / Math.max(1, words.length);

    if (similarity >= 0.5) {
      if (item.status === "CONTRADICTED") {
        return {
          originalStatement: draftStatement,
          verdict: "CONTRADICTED",
          explanation: `Contradicts verified project knowledge: "${item.normalized_claim}". Sources disagree on this statement.`,
          supportingFact: item.current_value,
          saferWording: `According to some benchmark tests, ${item.normalized_claim}, but independent sources disagree.`,
          confidence: "HIGH",
        };
      }

      // Check for overbroad statements (e.g., "fastest ever", "best phone")
      if (statementLower.includes("fastest ever") || statementLower.includes("best") || statementLower.includes("100%")) {
        return {
          originalStatement: draftStatement,
          verdict: "REQUIRES_CONTEXT",
          explanation: `Statement is overly broad compared to specific evidence: "${item.normalized_claim}".`,
          supportingFact: item.current_value,
          saferWording: `One of the highest performing options tested in recent benchmarks: ${item.current_value}`,
          confidence: "MEDIUM",
        };
      }

      return {
        originalStatement: draftStatement,
        verdict: "SUPPORTED",
        explanation: `Grounded directly in verified project knowledge: "${item.normalized_claim}".`,
        supportingFact: item.current_value,
        confidence: item.confidence,
      };
    }
  }

  return {
    originalStatement: draftStatement,
    verdict: "UNSUPPORTED",
    explanation: "No supporting evidence found in project knowledge base. Consider adding context or launching a fresh research run.",
    saferWording: `Initial reports suggest ${draftStatement}, but primary evidence has not yet been verified.`,
    confidence: "LOW",
  };
}
