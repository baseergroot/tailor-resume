"use server"

import { auth } from "@clerk/nextjs/server"
import { google } from "@ai-sdk/google"
import { Output, ToolLoopAgent } from "ai"

import {
  jobDescriptionAnalyser,
  resumeAnalyser,
  gapAnalyser,
  resumeRewriter,
  atsScorer,
  coverLetterGenerator,
} from "@/tools/allTools"
import AgentResponseSchema from "@/schema/agentResponseSchema"

const toolExecutionCount: Record<string, number> = {}

export async function resumeAgent(jobDescription: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (!jobDescription.trim()) {
    throw new Error("Job description is required")
  }

  const agent = new ToolLoopAgent({
    model: google("gemini-3.1-flash-lite"),

    instructions: `
You are a resume analysis and tailoring agent.

The user's resume is stored in the database.
Use the available tools to access and analyze it.

Your process:
1. Analyze the job description.
2. Analyze the user's resume.
3. Compare the resume against the job requirements.
4. Calculate the ATS score.
5. Determine whether the resume sufficiently fulfills the important
   requirements.

If the resume sufficiently fulfills the important requirements:
- Set fulfillsRequirements to true.
- Call resumeRewriter to optimize the resume.
- Return the resulting tailored resume in tailoredResume.

If important requirements are not sufficiently demonstrated:
- Set fulfillsRequirements to false.
- Do NOT call resumeRewriter.
- List the missing or unconfirmed requirements.

Important:
- "Not mentioned in the resume" does not mean the user does not have
  the skill.
- Never invent skills, experience, qualifications, or achievements.
- Never claim the user is definitely eligible or ineligible.
- Only modify information that is supported by the original resume.
- Do not generate a cover letter.

Keep the summary concise.
`,

    output: Output.object({
    schema: AgentResponseSchema,
  }),

  tools: {
    jobDescriptionAnalyser: jobDescriptionAnalyser(),
    resumeAnalyser: resumeAnalyser(),
    gapAnalyser: gapAnalyser(),
    resumeRewriter: resumeRewriter(),
    atsScorer: atsScorer(),
    coverLetterGenerator: coverLetterGenerator(),
  },

  onToolExecutionStart: ({ toolCall }) => {
    const count = (toolExecutionCount[toolCall.toolName] = (toolExecutionCount[toolCall.toolName] ?? 0) + 1)
    console.log(`[tool] ${toolCall.toolName} started (execution #${count})`)
  },

  onToolExecutionEnd: ({ toolCall, toolOutput, toolExecutionMs }) => {
    const status = toolOutput.type === "tool-error" ? `ERROR: ${toolOutput.error}` : "ok"
    console.log(`[tool] ${toolCall.toolName} finished (${status}, ${toolExecutionMs}ms)`)
  },

  })

  const result = await agent.generate({
  prompt: `
Analyze my saved resume against this job description:

${jobDescription}
`,
})


  return result.output
}