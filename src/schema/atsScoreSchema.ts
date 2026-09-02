import { z } from "zod";

const ATSScoreSchema = z.object({
  score: z.number().min(0).max(100),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export default ATSScoreSchema