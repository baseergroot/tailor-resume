import { auth } from "@clerk/nextjs/server"
import { google } from "@ai-sdk/google"
import { Output, ToolLoopAgent, isStepCount } from "ai"

import {
  jobDescriptionAnalyser,
  resumeAnalyser,
  gapAnalyser,
  resumeRewriter,
  atsScorer,
  coverLetterGenerator,
} from "@/tools/allTools"
import AgentResponseSchema from "@/schema/agentResponseSchema"
import { computeKeywordCoverage, extractJdKeywords } from "@/helper/atsScore"
import connectDB from "@/lib/db"
import { User } from "@/models/user"
import { trackEvent } from "@/lib/analytics/track-event"

export type ToolEvent =
  | {
      type: "start"
      toolCallId: string
      toolName: string
      executionCount: number
    }
  | {
      type: "end"
      toolCallId: string
      toolName: string
      status: "ok" | "error"
      error?: string
      durationMs: number
    }

export type RunResumeAnalysisOptions = {
  generateCoverLetter?: boolean
  onEvent?: (event: ToolEvent) => void
}

export async function runResumeAnalysis(
  jobDescription: string,
  options?: RunResumeAnalysisOptions,
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (!jobDescription.trim()) {
    throw new Error("Job description is required")
  }

  const toolExecutionCount: Record<string, number> = {}

  const coverLetterInstructions = options?.generateCoverLetter
    ? `
### Cover letter (REQUIRED)

After the resume analysis is complete, generate a cover letter:
- Call coverLetterGenerator.
- If a tailored resume was generated, pass the ENTIRE tailored resume text in the resume parameter (JSON.stringify(tailoredResume)) so the letter reflects the tailored content. Otherwise omit the resume parameter and it will use the saved resume.
- Return the generated letter text in the coverLetter field of the final output.
`
    : `
Do NOT generate or include a cover letter. Leave the coverLetter field unset.
`

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
4. Determine ATS keyword coverage.
5. Decide whether the resume satisfies the job's important
   (must-have) requirements.

Call every tool you need exactly once, in the order above. Make all
of your tool calls in your first response — call as many tools in one
turn as you need. Do not call a tool twice and do not repeat analysis
you already have. After your tool results come back, produce ONLY the
final output; do not call more tools.

If the resume satisfies ALL important requirements:
- Set fulfillsRequirements to true.
- Call resumeRewriter to optimize the resume and return it in
  tailoredResume.
- missingRequirements may list ONLY optional, preferred, or
  non-dealbreaker gaps, each phrased as a "would strengthen"
  suggestion.

If the resume does NOT satisfy the important requirements:
- Set fulfillsRequirements to false.
- Do NOT call resumeRewriter; leave tailoredResume empty.
- List the must-have requirements that are missing or unconfirmed in
  missingRequirements.
- Explain each gap objectively and neutrally (e.g. "X is not
  demonstrated in the resume"). Do not tell the user that applying
  would be a waste or discourage them from applying — the decision to
  apply belongs to them.

Consistency contract (MUST follow):
- fulfillsRequirements true -> the resume satisfies all must-have
  requirements and a tailored resume is generated.
- fulfillsRequirements false -> at least one must-have requirement is
  missing; tailoredResume must be empty and missingRequirements lists
  those gaps.
- matchLevel reflects overall strength (strong/partial/weak) and is
  independent of fulfillsRequirements. An otherwise strong resume can
  still be a partial match.

Important:
- "Not demonstrated in the resume" does not mean the user does not
  have a skill or qualification. Phrase any missing requirement as
  "not demonstrated in the resume", never as a definitive statement
  that the candidate lacks it.
- Never invent skills, experience, qualifications, or achievements.
- Never claim the user is definitely eligible or ineligible.
- Only modify information that is supported by the original resume.

Keep the summary concise (1-2 sentences), specific, and free of generic praise.
${coverLetterInstructions}
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
    options?.onEvent?.({
      type: "start",
      toolCallId: toolCall.toolCallId,
      toolName: toolCall.toolName,
      executionCount: count,
    })
  },

  onToolExecutionEnd: ({ toolCall, toolOutput, toolExecutionMs }) => {
    const isError = toolOutput.type === "tool-error"
    console.log(`[tool] ${toolCall.toolName} finished (${isError ? `ERROR: ${toolOutput.error}` : "ok"}, ${toolExecutionMs}ms)`)
    options?.onEvent?.({
      type: "end",
      toolCallId: toolCall.toolCallId,
      toolName: toolCall.toolName,
      status: isError ? "error" : "ok",
      error: isError ? String(toolOutput.error) : undefined,
      durationMs: toolExecutionMs,
    })
  },

  stopWhen: isStepCount(6),
  })

  const result = await agent.generate({
  prompt: `
Analyze my saved resume against this job description:

${jobDescription}
`,
})

  if (!result.output) {
    throw new Error("No output generated")
  }

  await connectDB()
  const user = await User.findOne({ clerkUserId: userId })

  if (user?.resume?.resumeText) {
    const jdKeywords = await extractJdKeywords(jobDescription)
    const originalCoverage = computeKeywordCoverage(jdKeywords, user.resume.resumeText)

    result.output.atsScore = originalCoverage.score

    if (result.output.tailoredResume) {
      const tailoredCoverage = computeKeywordCoverage(
        jdKeywords,
        JSON.stringify(result.output.tailoredResume, null, 2),
      )
      result.output.tailoredAtsScore = tailoredCoverage.score
      result.output.atsMatchedKeywords = tailoredCoverage.matched
      result.output.atsMissingKeywords = tailoredCoverage.missing
    } else {
      result.output.atsMatchedKeywords = originalCoverage.matched
      result.output.atsMissingKeywords = originalCoverage.missing
    }
  }

  trackEvent({
    event: "tailoring_completed",
    clerkUserId: userId,
    path: "/dashboard",
    metadata: { atsScore: result.output?.atsScore },
  })

  return result.output
}