import { z } from "zod";

export const ContentOpportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  opportunity_type: z.enum([
    "UNDER_COVERED",
    "CONFLICTING_COVERAGE",
    "NEW_DEVELOPMENT",
    "MISCONCEPTION",
    "PRACTICAL_PROBLEM",
    "COMPARISON_GAP",
    "AUDIENCE_REQUEST"
  ]),
  audience_demand: z.enum(["HIGH", "MEDIUM", "LOW"]),
  coverage_gap: z.enum(["HIGH", "MEDIUM", "LOW"]),
  evidence_strength: z.enum(["HIGH", "MEDIUM", "LOW"]),
  freshness: z.enum(["HIGH", "MEDIUM", "LOW"]),
  supporting_question_ids: z.array(z.string()),
  supporting_evidence_ids: z.array(z.string()),
  reason: z.string().describe("Explicit justification for why this content opportunity exists based on evidence signals"),
});

export const OpportunityCollectionSchema = z.object({
  opportunities: z.array(ContentOpportunitySchema),
});

export type ContentOpportunity = z.infer<typeof ContentOpportunitySchema>;
