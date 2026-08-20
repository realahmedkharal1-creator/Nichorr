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
