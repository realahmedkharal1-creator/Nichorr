import { z } from "zod";

export const EvidenceItemSchema = z.object({
  id: z.string().optional(),
  source_id: z.string(),
  question_id: z.string().optional(),
  evidence_type: z.enum([
    "OFFICIAL_FACT",
    "MEASURED_RESULT",
    "INDEPENDENT_TEST",
    "FIRSTHAND_REPORT",
    "COMMUNITY_SIGNAL",
    "EXPERT_OPINION",
    "EDITORIAL_OPINION",
    "INFERENCE",
    "UNSUPPORTED"
  ]),
  excerpt: z.string().describe("Exact verbatim or precise excerpt from source"),
  context: z.string().describe("Surrounding context for auditability"),
  claim_candidate: z.string().describe("Draft claim extracted from excerpt"),
  product_entity: z.string(),
  product_variant: z.string().optional(),
  region: z.string().default("Global"),
  software_version: z.string().optional(),
  methodology: z.string().optional(),
});

export const EvidenceCollectionSchema = z.object({
  evidence_items: z.array(EvidenceItemSchema),
});

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
