import {z} from "zod";
import ResumeSchema from "./resumeSchema";

const AgentResponseSchema = z.object({
  matchLevel: z.enum(["strong", "partial", "weak"]),
  atsScore: z.number().min(0).max(100),
  fulfillsRequirements: z.boolean(),
  missingRequirements: z.array(z.string()),
  summary: z.string(),
  tailoredResume: ResumeSchema.optional(),
})

export default AgentResponseSchema