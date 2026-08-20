import { z } from "zod";

export const ConflictItemSchema = z.object({
  id: z.string().optional(),
  claim_a_id: z.string(),
  claim_b_id: z.string(),
  conflict_type: z.enum([
    "NUMERIC",
    "METHODOLOGICAL",
    "TEMPORAL",
    "VARIANT",
    "DEFINITION",
    "FACTUAL"
  ]),
  severity: z.enum(["HIGH", "MEDIUM", "LOW"]),
  is_real_conflict: z.boolean(),
  explanation: z.string(),
  resolution_status: z.enum([
    "RESOLVED",
    "PARTIALLY_RESOLVED",
    "UNRESOLVED"
  ]),
  resolution_notes: z.string().optional(),
});

export const ConflictCollectionSchema = z.object({
  conflicts: z.array(ConflictItemSchema),
});

export type ConflictItem = z.infer<typeof ConflictItemSchema>;
