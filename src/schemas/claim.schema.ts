import { z } from "zod";

export const ClaimItemSchema = z.object({
  id: z.string().optional(),
  claim_text: z.string(),
  claim_type: z.enum([
    "FACT",
    "MEASUREMENT",
    "COMPARISON",
    "EXPERIENCE",
    "COMMUNITY_SIGNAL",
    "OPINION",
    "INFERENCE"
  ]),
  evidence_ids: z.array(z.string()),
  status: z.enum([
    "SUPPORTED",
    "PARTIALLY_SUPPORTED",
    "CONTRADICTED",
    "INSUFFICIENT",
    "OUTDATED",
    "MISATTRIBUTED",
    "UNVERIFIED"
  ]),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  caveat: z.string().optional(),
  product_entity: z.string().optional(),
  product_variant: z.string().optional(),
  software_version: z.string().optional(),
});

export const ClaimCollectionSchema = z.object({
  claims: z.array(ClaimItemSchema),
});

export type ClaimItem = z.infer<typeof ClaimItemSchema>;
