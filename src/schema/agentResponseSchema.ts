import {z} from "zod";
import ResumeSchema from "./resumeSchema";

const AgentResponseSchema = z.object({
  matchLevel: z.enum(["strong", "partial", "weak"]),
  atsScore: z.number().min(0).max(100),
  fulfillsRequirements: z.boolean(),
  missingRequirements: z.array(z.string()),
  summary: z.string(),
  tailoredResume: ResumeSchema.optional(),
  tailoredAtsScore: z.number().min(0).max(100).optional(),
  atsMatchedKeywords: z.array(z.string()).optional(),
  atsMissingKeywords: z.array(z.string()).optional(),
  coverLetter: z.string().optional(),
})

export default AgentResponseSchema