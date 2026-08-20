import { z } from "zod";

export const CommunitySignalSchema = z.object({
  id: z.string().optional(),
  signal: z.string(),
  signal_type: z.enum(["PROBLEM", "PRAISE", "WORKAROUND", "CONFUSION", "FEATURE_REQUEST"]),
  frequency_level: z.enum(["HIGH", "MEDIUM", "LOW"]),
  firsthand_likelihood: z.enum(["HIGH", "MEDIUM", "LOW"]),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  evidence_ids: z.array(z.string()),
  caveat: z.string().describe("Explicit warning that community signal is user-reported, not universal fact"),
});

export const CommunityCollectionSchema = z.object({
  signals: z.array(CommunitySignalSchema),
});

export type CommunitySignal = z.infer<typeof CommunitySignalSchema>;
