import { z } from "zod";

const ResumeSchema = z.object({
  summary: z.string().optional(),

  skills: z.array(z.string()),

  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      duration: z.string().optional(),
      responsibilities: z.array(z.string()),
      technologies: z.array(z.string()),
    })
  ),

  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().optional(),
      field: z.string().optional(),
    })
  ),

  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    })
  ),
});

export default ResumeSchema