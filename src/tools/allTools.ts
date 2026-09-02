import { JDAnalysis } from "@/helper/types";
import connectDB from "@/lib/db";
import { User } from "@/models/user";
import ATSScoreSchema from "@/schema/atsScoreSchema";
import GapSchema from "@/schema/gapSchema";
import JDSchema from "@/schema/jobDescriptionSchema";
import ResumeSchema from "@/schema/resumeSchema";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { generateText, Output, tool } from "ai"
import { z } from "zod"


class Tools {

  jobDescriptionAnalyser = () => {
    const toolRes = tool({
      description: "extract requirements from job description",
      inputSchema: z.object({
        jobDescription: z.string().describe("Job description")
      }),
      execute: async (jobDescription): Promise<JDAnalysis> => {
        console.log("job description", jobDescription)
        const result = await generateText({
          model: google("gemini-2.5-flash"),
          output: Output.object({
            schema: JDSchema,
          }),
          prompt: `
      Analyze this job description and extract structured information.
      
      For ats_keywords: extract the exact technical terms, tools, 
      frameworks, and skills that an ATS system would scan for.
      Include both required and preferred skills as keywords.
      Be specific — "React.js" not just "React", "Node.js" not "Node".
      
      Job Description:
      ${jobDescription}
    `,
        })

        return result.output
      }
    });
    return toolRes
  }

  resumeAnalyser = () => {
    const toolResponse = tool({
      description: "extract structured information from a resume",
      inputSchema: z.object({}),

      execute: async () => {
        const { userId } = await auth()
        await connectDB()
        const user = await User.findOne({
          clerkUserId: userId
        })
        const resumeText = user?.resume?.resumeText

        console.log("resume text");

        const result = await generateText({
          model: google("gemini-2.5-flash"),

          output: Output.object({
            schema: ResumeSchema,
          }),

          prompt: `
Analyze this resume and extract structured information.

Do not invent or infer information that is not present.
Preserve the exact names of technologies, frameworks, tools, and skills.

Resume:
${resumeText}
      `,
        });

        return result.output;
      },
    });

    return toolResponse
  }

  gapAnalyser = () => {
    const toolRes = tool({
      description: "compare the user's resume against a job description and identify skill and requirement gaps",

      inputSchema: z.object({
        jobDescription: JDSchema,
      }),

      execute: async ({ jobDescription }) => {
        const { userId } = await auth()

        if (!userId) {
          throw new Error("Unauthorized")
        }

        const user = await User.findOne({
          clerkUserId: userId,
        })

        if (!user?.resume?.resumeText) {
          throw new Error("Resume not found")
        }

        console.log("gap analyser - user", user._id)
        console.log("gap analyser - job description", jobDescription)

        const resumeResult = await generateText({
          model: google("gemini-2.5-flash"),

          output: Output.object({
            schema: ResumeSchema,
          }),

          prompt: `
Analyze this resume and extract its structured information.

Do not invent or infer information that is not present.
Preserve the exact names of technologies, frameworks, tools, and skills.

Resume:
${user.resume.resumeText}
`,
        })

        const resume = resumeResult.output

        console.log("gap analyser - resume", resume)

        const result = await generateText({
          model: google("gemini-2.5-flash"),

          output: Output.object({
            schema: GapSchema,
          }),

          prompt: `
Compare the resume against the job description.

Identify:
- skills the candidate has that match the job
- required skills missing from the resume
- preferred skills missing from the resume
- ATS keywords present in both
- ATS keywords missing from the resume
- relevant experience gaps

Do not assume the candidate has a skill unless it is supported
by the resume.

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Resume:
${JSON.stringify(resume, null, 2)}
`,
        })

        console.log("gap analysis result", result.output)

        return result.output
      },
    })

    return toolRes
  }

  resumeRewriter = () => {
    const toolRes = tool({
      description: "tailor the user's saved resume to a specific job description without inventing experience",

      inputSchema: z.object({
        jobDescription: JDSchema,
        gapAnalysis: GapSchema,
      }),

      execute: async ({ jobDescription, gapAnalysis }) => {
        const { userId } = await auth()

        if (!userId) {
          throw new Error("Unauthorized")
        }

        const user = await User.findOne({
          clerkUserId: userId,
        })

        if (!user?.resume?.resumeText) {
          throw new Error("Resume not found")
        }

        console.log("resume rewriter - user", user._id)
        console.log("resume rewriter - job description", jobDescription)
        console.log("resume rewriter - gap analysis", gapAnalysis)

        const result = await generateText({
          model: google("gemini-2.5-flash"),

          output: Output.object({
            schema: ResumeSchema,
          }),

          prompt: `
Tailor the resume for the provided job description.

Rules:
- Do not invent skills, technologies, experience, projects, or achievements.
- Do not add a technology simply because it appears in the job description.
- Rewrite existing experience to emphasize relevant responsibilities and technologies.
- Naturally incorporate relevant ATS keywords when supported by the resume.
- Keep claims truthful.
- Remove or de-emphasize irrelevant information where appropriate.
- Preserve the candidate's actual experience and career history.

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Gap Analysis:
${JSON.stringify(gapAnalysis, null, 2)}

Original Resume:
${user.resume.resumeText}
`,
        })

        console.log("rewritten resume", result.output)

        return result.output
      },
    })

    return toolRes
  }

  atsScorer = () => {
    const toolRes = tool({
      description: "score how well the user's resume matches a job description for ATS compatibility",

      inputSchema: z.object({
        jobDescription: JDSchema,
      }),

      execute: async ({ jobDescription }) => {
        const { userId } = await auth()

        if (!userId) {
          throw new Error("Unauthorized")
        }

        const user = await User.findOne({
          clerkUserId: userId,
        })

        if (!user?.resume?.resumeText) {
          throw new Error("Resume not found")
        }

        console.log("ats scorer - user", user._id)
        console.log("ats scorer - job description", jobDescription)
        console.log("ats scorer - resume", user.resume.resumeText)

        const result = await generateText({
          model: google("gemini-2.5-flash"),

          output: Output.object({
            schema: ATSScoreSchema,
          }),

          prompt: `
Evaluate how well this resume matches the job description from an ATS perspective.

Consider:
- Required skills
- Preferred skills
- ATS keywords
- Relevant technologies
- Relevant experience
- Job responsibilities
- Keyword coverage

Do not give credit for skills that are not supported by the resume.

Return a score from 0 to 100 and explain the main factors affecting the score.

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Resume:
${user.resume.resumeText}
`,
        })

        console.log("ATS score result", result.output)

        return result.output
      },
    })

    return toolRes
  }

  coverLetterGenerator = () => {
    const toolRes = tool({
      description: "generate a tailored cover letter based on the user's saved resume and a job description",

      inputSchema: z.object({
        jobDescription: JDSchema,
      }),

      execute: async ({ jobDescription }) => {
        const { userId } = await auth()

        if (!userId) {
          throw new Error("Unauthorized")
        }

        const user = await User.findOne({
          clerkUserId: userId,
        })

        if (!user?.resume?.resumeText) {
          throw new Error("Resume not found")
        }

        console.log("cover letter - user", user._id)
        console.log("cover letter - job description", jobDescription)
        console.log("cover letter - resume", user.resume.resumeText)

        const result = await generateText({
          model: google("gemini-2.5-flash"),

          prompt: `
Write a concise, professional cover letter tailored to this job.

Rules:
- Only use information supported by the resume.
- Do not invent experience, skills, achievements, or qualifications.
- Highlight the most relevant experience and skills for this specific role.
- Avoid generic filler.
- Keep it around 250-400 words.

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Resume:
${user.resume.resumeText}
`,
        })

        console.log("cover letter result", result.text)

        return result.text
      },
    })

    return toolRes
  }
}

export const { jobDescriptionAnalyser, resumeAnalyser, gapAnalyser, resumeRewriter, atsScorer, coverLetterGenerator } = new Tools()