import { z } from "zod";

export const SearchQueryItemSchema = z.object({
  query: z.string(),
  question_id: z.string().optional(),
  query_type: z.enum([
    "PRIMARY", 
    "INDEPENDENT", 
    "COMMUNITY", 
    "CONTRARIAN", 
    "RECENCY", 
    "PROBLEM", 
    "COMPARISON"
  ]),
  purpose: z.string(),
});

export const SearchPlanSchema = z.object({
  queries: z.array(SearchQueryItemSchema),
});

export type SearchPlan = z.infer<typeof SearchPlanSchema>;
export type SearchQueryItem = z.infer<typeof SearchQueryItemSchema>;
