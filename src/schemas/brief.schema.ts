import { z } from "zod";
import { ClaimItemSchema } from "./claim.schema";
import { ConflictItemSchema } from "./conflict.schema";
import { CommunitySignalSchema } from "./community.schema";
import { AudienceQuestionSchema } from "./audience.schema";
import { ContentOpportunitySchema } from "./opportunity.schema";

export const KeyFindingSchema = z.object({
  finding: z.string(),
  claim_ids: z.array(z.string()),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

export const ResearchBriefSchema = z.object({
  executive_summary: z.array(z.string()),
  key_findings: z.array(KeyFindingSchema),
  verified_facts: z.array(ClaimItemSchema),
  measured_results: z.array(ClaimItemSchema),
  conflicts: z.array(ConflictItemSchema),
  community_signals: z.array(CommunitySignalSchema),
  audience_questions: z.array(AudienceQuestionSchema),
  content_opportunities: z.array(ContentOpportunitySchema),
  important_caveats: z.array(z.string()),
});

export type ResearchBriefData = z.infer<typeof ResearchBriefSchema>;

// verified_facts, measured_results, conflicts, community_signals, audience_questions, and
// content_opportunities are all already-computed structured data from earlier pipeline stages
// (session.claims/conflicts/communitySignals/audienceQuestions/opportunities) -- asking the LLM
// to regenerate all of that from scratch inside ResearchBriefSchema's full shape was unreliable
// (a thin prompt against a large 9-field nested schema) and redundant. Only these three fields
// genuinely require LLM synthesis; the rest are assembled directly from session data.
export const BriefSynthesisSchema = z.object({
  executive_summary: z.array(z.string()),
  key_findings: z.array(KeyFindingSchema),
  important_caveats: z.array(z.string()),
});

export type BriefSynthesisData = z.infer<typeof BriefSynthesisSchema>;
