import { z } from "zod";

export const ResearchQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  question_type: z.enum(["FACT", "MEASUREMENT", "COMPARISON", "PROBLEM", "COMMUNITY"]),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  reason: z.string().describe("Rationale why this research question is crucial"),
});

export const ResearchPlanSchema = z.object({
  research_goal: z.string(),
  entities: z.array(z.object({
    name: z.string(),
    category: z.string(),
    variants: z.array(z.string()).optional(),
  })),
  questions: z.array(ResearchQuestionSchema),
  research_dimensions: z.array(z.string()),
});

export type ResearchPlan = z.infer<typeof ResearchPlanSchema>;
export type ResearchQuestion = z.infer<typeof ResearchQuestionSchema>;
