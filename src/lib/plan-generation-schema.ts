import { z } from "zod";

export const generatedPlanSchema = z.object({
  summary: z.string(),
  warnings: z.array(z.string()),
  days: z.array(z.object({
    weekday: z.string(),
    name: z.string(),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.array(z.object({ reps: z.string(), weight: z.string(), warmup: z.boolean() }).strict()),
      note: z.string(),
    }).strict()),
  }).strict()),
}).strict();

export type GeneratedPlan = z.infer<typeof generatedPlanSchema>;