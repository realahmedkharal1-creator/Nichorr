import { ResearchRunSession } from "./research-engine";
import { getLLMProvider } from "@/lib/ai/factory";

export interface AssistantAnswer {
  answer: string;
  hasSufficientEvidence: boolean;
  citations: Array<{ id: string; title: string; publisher: string; url: string }>;
  suggestedFollowups: string[];
}

export class ResearchAssistantService {
  static async answerQuestion(session: ResearchRunSession, question: string): Promise<AssistantAnswer> {
    const qLower = question.toLowerCase().trim();
    const claims = session.claims || [];
    const sources = session.sources || [];
    const conflicts = session.conflicts || [];
    const brief = session.brief;

    // Check if research contains any claims/evidence
    if (claims.length === 0 && sources.length === 0) {
      return {
        answer: "I don't have enough evidence in this research to answer that confidently. The research run session contains 0 verified claims or sources.",
        hasSufficientEvidence: false,
        citations: [],
        suggestedFollowups: ["Re-run this research investigation with expanded web search."],
      };
    }

    // Matching relevant claims deterministically first
    const relevantClaims = claims.filter((c) =>
      qLower.split(/s+/).some((word) => word.length > 3 && c.claim_text.toLowerCase().includes(word))
    );

    // Conflict queries
    if (qLower.includes("conflict") || qLower.includes("disagree") || qLower.includes("avoid claiming")) {
      if (conflicts.length === 0) {
        return {
          answer: `Based on the audited research for "${session.topic}", zero contradictory evidence or technical conflicts were detected across the ${sources.length} analyzed sources.`,
          hasSufficientEvidence: true,
          citations: sources.slice(0, 3).map((s) => ({ id: s.id, title: s.title, publisher: s.publisher, url: s.url })),
          suggestedFollowups: ["What are the key verified findings?", "What content opportunities exist?"],
        };
      }

      const conflictSummary = conflicts
        .map((c) => `• [${c.conflict_type}] ${c.explanation}`)
        .join("n");

      return {
        answer: `The research uncovered ${conflicts.length} technical disagreement(s) across tested sources:nn${conflictSummary}nnCreator Recommendation: Acknowledge testing variations explicitly in your script rather than stating a single absolute result.`,
        hasSufficientEvidence: true,
        citations: sources.slice(0, 3).map((s) => ({ id: s.id, title: s.title, publisher: s.publisher, url: s.url })),
        suggestedFollowups: ["What are the strongest verified claims?", "What content angles are recommended?"],
      };
    }

    // If query matches claims, format evidence-grounded response
    if (relevantClaims.length > 0) {
      const claimsList = relevantClaims.slice(0, 4).map((c) => `• ${c.claim_text} (Confidence: ${c.confidence})`).join("n");
      return {
        answer: `Based on audited evidence for "${session.topic}", here are the verified findings:nn${claimsList}`,
        hasSufficientEvidence: true,
        citations: sources.slice(0, 3).map((s) => ({ id: s.id, title: s.title, publisher: s.publisher, url: s.url })),
        suggestedFollowups: ["What conflicting evidence was found?", "What are the biggest audience question gaps?"],
      };
    }

    // Default overview answer using executive summary if general query
    if (brief?.executive_summary && brief.executive_summary.length > 0) {
      return {
        answer: `Based on audited research for "${session.topic}":nn${brief.executive_summary.join("nn")}`,
        hasSufficientEvidence: true,
        citations: sources.slice(0, 3).map((s) => ({ id: s.id, title: s.title, publisher: s.publisher, url: s.url })),
        suggestedFollowups: ["What are the strongest verified claims?", "What conflicting evidence was found?"],
      };
    }

    // Insufficient evidence fallback rule
    return {
      answer: "I don't have enough evidence in this research to answer that confidently. The specific technical parameters requested were not covered in the retrieved sources for this run.",
      hasSufficientEvidence: false,
      citations: sources.slice(0, 2).map((s) => ({ id: s.id, title: s.title, publisher: s.publisher, url: s.url })),
      suggestedFollowups: ["Re-run research with custom questions", "View full source list"],
    };
  }
}
