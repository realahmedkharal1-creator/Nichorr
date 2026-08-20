import { z } from "zod";

export const VerificationItemSchema = z.object({
  claim_id: z.string(),
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
  supporting_evidence_ids: z.array(z.string()),
  contradicting_evidence_ids: z.array(z.string()),
  reason: z.string(),
  required_caveat: z.string().optional(),
});

export const VerificationCollectionSchema = z.object({
  verifications: z.array(VerificationItemSchema),
});

export type VerificationItem = z.infer<typeof VerificationItemSchema>;
