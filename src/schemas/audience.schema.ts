import { z } from "zod";

export const AudienceQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  frequency_level: z.enum(["HIGH", "MEDIUM", "LOW"]),
  importance: z.enum(["HIGH", "MEDIUM", "LOW"]),
  existing_coverage: z.enum(["HIGH", "MEDIUM", "LOW"]),
  coverage_gap: z.enum(["HIGH", "MEDIUM", "LOW"]),
  evidence_ids: z.array(z.string()),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

export const AudienceCollectionSchema = z.object({
  questions: z.array(AudienceQuestionSchema),
});

export type AudienceQuestion = z.infer<typeof AudienceQuestionSchema>;
