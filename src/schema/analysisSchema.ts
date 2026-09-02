import { z } from "zod";

const AnalysisSchema = z.object({
  matchLevel: z.enum(["strong", "partial", "weak"]),
  atsScore: z.number().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingRequirements: z.array(z.string()),
  tailoringRecommended: z.boolean(),
  summary: z.string(),
})

export default AnalysisSchema