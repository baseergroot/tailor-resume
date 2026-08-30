import { z } from "zod"

const JDSchema = z.object({
  role_title: z.string(),
  company_name: z.string().optional(),
  required_skills: z.array(z.string()),
  preferred_skills: z.array(z.string()),
  ats_keywords: z.array(z.string()), // exact words ATS will scan for
  experience_required: z.string(),   // "1-2 years", "junior", etc
  responsibilities: z.array(z.string()),
  tone: z.enum(["formal", "casual", "technical", "startup"]),
  degree_required: z.boolean(),
  remote_or_onsite: z.enum(["remote", "onsite", "hybrid", "unknown"]),
})

export default JDSchema