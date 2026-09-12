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
    console.log("job description analyser called")
    const toolRes = tool({
      description: "extract requirements from job description",
      inputSchema: z.object({
        jobDescription: z.string().describe("Job description")
      }),
      execute: async (jobDescription): Promise<JDAnalysis> => {
        console.log("job description", jobDescription)
        const result = await generateText({
          model: google("gemini-3.1-flash-lite"),
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
    console.log("resume analyser called")
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
          model: google("gemini-3.1-flash-lite"),

          output: Output.object({
            schema: ResumeSchema,
          }),

          prompt: `
Analyze this resume and extract structured information.

Extract personal information (name, headline, phone, email, location,
LinkedIn, website) exactly as written in the resume. Leave a field
empty when it is not present. Do not invent or infer information that
is not present. Preserve the exact names of technologies, frameworks,
tools, and skills.

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
    console.log("gap analyser called")
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
          model: google("gemini-3.1-flash-lite"),

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
          model: google("gemini-3.1-flash-lite"),

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
When a requirement is absent from the resume, phrase it as
"not demonstrated in the resume" rather than stating the candidate
does not have it. A missing item is a gap in what the resume
demonstrates, not a fact about the candidate.

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
    console.log("resume rewriter called")
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
          model: google("gemini-3.1-flash-lite"),

          output: Output.object({
            schema: ResumeSchema,
          }),

          prompt: `
Tailor the candidate's resume for the target job while preserving complete factual accuracy. The goal is to "maximize truthful ATS relevance while preserving the candidate's actual resume content". Do NOT replace the resume with a short generic version.

### 1. Preserve useful resume content

- Keep the candidate's existing career history, companies, roles, dates, projects, technologies, achievements, metrics, and responsibilities.
- Keep the personal information header (name, headline, phone, email, location, LinkedIn, website) exactly as written in the original resume. Do not alter, reformat, or invent any part of it.
- Do not remove relevant experience or projects simply because they are not a direct keyword match for the job. Plenty of job descriptions do not list every relevant technology.
- Keep relevant supporting information even when it is not an exact JD keyword.
- Only remove or significantly de-emphasize content when it is clearly irrelevant to the target job. When in doubt, keep it.
- The tailored resume must be a complete resume, not a skeleton. It should never be meaningfully weaker or shorter than the original.

### 2. Do not invent anything

- Never add a skill, technology, responsibility, achievement, qualification, metric, company, project, job title, or experience that does not exist in the original resume.
- Never generalize a specific technology, tool, pipeline, deployment, or implementation detail into a broader claim that is not explicitly supported by the original resume. For example, if the original says "EAS Build pipelines", do not rewrite it as "CI/CD pipelines" unless CI/CD is explicitly supported.
- Never infer that the candidate used a technology merely because the job description asks for it.
- ATS keyword optimization may ONLY use keywords that are truthfully supported by the original resume.
- Never fabricate numbers, results, teams, or scope.

### 3. Improve existing content (do not strip it down)

- Rewrite existing bullet points to emphasize the most relevant parts of the candidate's actual experience.
- Preserve concrete metrics exactly, such as "77% improvement" and "3s to 700ms".
- Preserve meaningful technical implementation details when they strengthen the application.
- Use job-description terminology where it accurately describes something already present in the resume.
- Make bullets concise and impact-oriented, but DO NOT over-compress them. A concrete bullet is worth more than a vague one-line summary.

### 4. Project selection

- Prioritize projects most relevant to the job description by placing them earlier.
- Do NOT delete a project just because it is not an exact JD match. Keep enough projects for a strong, complete resume.
- If a project contains technologies or experience relevant to the job, preserve those details in the project description and its technology list.

### 5. Experience

- Preserve the candidate's complete employment history: actual dates, company names, role titles, and career timeline.
- Do not reduce a detailed experience section to generic bullets. Rewrite the existing bullets and keep their substance.
- Keep the 3-5 most impactful bullets per role, but keep them specific. Never replace a concrete bullet with a vague statement.

### 6. Education

- Preserve the original education information exactly in substance: institution, degree, and field.
- Do NOT rephrase, decompose, or "improve" education entries. Reproduce them verbatim.
- Never add a field to a degree that did not have one, and never append "in <field>" (e.g. do not turn "FSC Pre-Engineering" into "FSC Pre-Engineering in Pre-Engineering").
- Do not infer degrees the candidate does not have (e.g. do not convert "FSC Pre-Engineering" into a bachelor's or master's degree).

### 7. Seniority and tone

- Do not inflate seniority or experience. Avoid words such as "extensive", "seasoned", "senior", "expert", or "X years of experience" unless the original resume genuinely supports them.
- Describe experience factually and specifically ("Full Stack Engineer with experience building…"), never with empty hype.

### 8. ATS optimization

- Emphasize existing experience that matches the job description: surface the matching skills and include the job's terminology only where the original resume supports it.
- Do NOT optimize ATS matching by deleting useful information. Keyword coverage must come from the candidate's real content, never from removing real content.

### 9. Output

Return a COMPLETE tailored resume using the ResumeSchema with:
- the personal information header (personalInfo) preserved verbatim from the original,
- a targeted summary (1-2 concrete sentences, no hype),
- comprehensive technical skills relevant to the job (keep every skill/technology from the original that remains relevant),
- strong rewritten experience bullets preserving metrics and specifics,
- relevant projects with useful details,
- original education preserved,
- no fabricated information.

### Bullet point style

Where supported by the original resume, structure experience bullets around:

Action + what was built/done + technology/context + measurable result.

For example, instead of a generic responsibility:

"Worked on application performance."

Prefer a factual version such as:

"Implemented Redis write-through caching, reducing page load time from 3s to 700ms."

Only use the result if it exists in the original resume.

### Tailoring strategy

Use the gap analysis to determine which existing experiences should receive more emphasis.

If the job description emphasizes:

- a technology already present in the resume → emphasize relevant experience using that technology.
- a responsibility already demonstrated → rewrite the relevant bullet to make that responsibility clearer.
- a keyword already supported by the resume → incorporate the keyword naturally.
- a skill not demonstrated in the resume → do not add it.

The final resume should look like the same candidate's resume specifically optimized for this job, not like a newly invented resume.

Before finalizing, internally verify:
- Did I remove useful information unnecessarily?
- Did I preserve all factual claims, companies, roles, dates, and career history?
- Did I preserve important metrics such as "77%" and "3s to 700ms"?
- Did I accidentally add anything only because it appeared in the JD?
- Does this still represent the candidate's actual career history?
- Is the resume more targeted than the original WITHOUT becoming significantly weaker or shorter?

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
    console.log("ats scorer called")
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
          model: google("gemini-3.1-flash-lite"),

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
    console.log("cover letter generator called")
    const toolRes = tool({
      description: "generate a tailored cover letter based on a resume and a job description",

      inputSchema: z.object({
        jobDescription: JDSchema,
        resume: z.string().optional().describe("Full resume text. Omit to use the user's saved resume."),
      }),

      execute: async ({ jobDescription, resume }) => {
        const { userId } = await auth()

        if (!userId) {
          throw new Error("Unauthorized")
        }

        const user = await User.findOne({
          clerkUserId: userId,
        })

        const source = resume || user?.resume?.resumeText

        if (!source) {
          throw new Error("Resume not found")
        }

        console.log("cover letter - user", user?._id)
        console.log("cover letter - job description", jobDescription)
        console.log("cover letter - resume", source)

        const result = await generateText({
          model: google("gemini-3.1-flash-lite"),

          prompt: `
Write a concise, professional cover letter tailored to this job.

Rules:
- Only use information supported by the resume.
- Do not invent experience, skills, achievements, or qualifications.
- Highlight the most relevant experience and skills for this specific role.
- Avoid generic filler.
- Keep it around 250-400 words.
- Use the resume provided below even if it is a tailored version.

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Resume:
${source}
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