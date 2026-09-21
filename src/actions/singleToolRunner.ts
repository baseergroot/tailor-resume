import { auth } from "@clerk/nextjs/server"
import { google } from "@ai-sdk/google"
import { Output, ToolLoopAgent, isStepCount } from "ai"
import { z } from "zod"

import {
  jobDescriptionAnalyser,
  resumeAnalyser,
  gapAnalyser,
  resumeRewriter,
  atsScorer,
  coverLetterGenerator,
} from "@/tools/allTools"
import JDSchema from "@/schema/jobDescriptionSchema"
import ResumeSchema from "@/schema/resumeSchema"
import GapSchema from "@/schema/gapSchema"
import ATSScoreSchema from "@/schema/atsScoreSchema"
import connectDB from "@/lib/db"
import { User } from "@/models/user"

export type SingleToolEvent =
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

export const SINGLE_TOOL_SLUGS = [
  "ats-scoring",
  "jd-analyzer",
  "gap-analyzer",
  "resume-analyzer",
  "resume-rewriter",
  "cover-letter-generator",
] as const

export type SingleToolSlug = (typeof SINGLE_TOOL_SLUGS)[number]

export type SingleToolResult = Record<string, unknown> & { letter?: string }

const CoverLetterSchema = z.object({ letter: z.string() })

type SingleToolOptions = {
  onEvent?: (event: SingleToolEvent) => void
}

const JD_INPUT_RULES = `- Read the job description exactly as given in your prompt — do not add or infer requirements that are not in the text.
- When the tool needs a structured job-description object, extract its fields (role_title, company_name, required_skills, preferred_skills, ats_keywords, experience_required, responsibilities, tone, degree_required, remote_or_onsite) truthfully from the provided text. Copy exact terms (e.g. "React.js") rather than paraphrasing.
- Never assert the candidate has a skill; the tools read the saved resume themselves.`

export async function runSingleTool(
  slug: SingleToolSlug,
  jobDescription: string,
  options?: SingleToolOptions,
) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Sign in to use this tool")
  }

  await connectDB()
  const user = await User.findOne({ clerkUserId: userId })

  if (!user?.resume?.resumeText) {
    throw new Error(
      "Upload your resume first. You can do this on the Hirefit dashboard before running this tool.",
    )
  }

  const toolExecutionCount: Record<string, number> = {}

  const onToolExecutionStart = ({ toolCall }: { toolCall: { toolCallId: string; toolName: string } }) => {
    const executionCount = (toolExecutionCount[toolCall.toolName] =
      (toolExecutionCount[toolCall.toolName] ?? 0) + 1)
    options?.onEvent?.({
      type: "start",
      toolCallId: toolCall.toolCallId,
      toolName: toolCall.toolName,
      executionCount,
    })
  }

  const onToolExecutionEnd = ({
    toolCall,
    toolOutput,
    toolExecutionMs,
  }: {
    toolCall: { toolCallId: string; toolName: string }
    toolOutput: { type: string; error?: unknown }
    toolExecutionMs: number
  }) => {
    const isError = toolOutput.type === "tool-error"
    options?.onEvent?.({
      type: "end",
      toolCallId: toolCall.toolCallId,
      toolName: toolCall.toolName,
      status: isError ? "error" : "ok",
      error: isError ? String(toolOutput.error) : undefined,
      durationMs: toolExecutionMs,
    })
  }

  const shared = {
    onToolExecutionStart,
    onToolExecutionEnd,
  }

  switch (slug) {
    case "jd-analyzer": {
      const agent = new ToolLoopAgent({
        model: google("gemini-3.1-flash-lite"),
        instructions: `You are a job description analyzer. Call jobDescriptionAnalyser exactly once, passing the full job description text from your prompt verbatim.
After the tool result comes back, output the structured job description exactly as returned by the tool — do not add fields, do not summarize, and do not call further tools.
- Copy terms (tools, skills, responsibilities) exactly as they appear in the job description.
- Do not invent requirements.`,
        output: Output.object({ schema: JDSchema }),
        tools: { jobDescriptionAnalyser: jobDescriptionAnalyser() },
        stopWhen: isStepCount(4),
        ...shared,
      })
      const promptText = `Analyze this job description:\n\n${jobDescription}`
      const result = await agent.generate({ prompt: promptText })
      if (!result.output) throw new Error("No output generated")
      return result.output as SingleToolResult
    }

    case "ats-scoring": {
      const agent = new ToolLoopAgent({
        model: google("gemini-3.1-flash-lite"),
        instructions: `You are an ATS scoring agent. Call atsScorer exactly once with a structured job-description object that you extract truthfully from the job description in your prompt.
${JD_INPUT_RULES}
After the tool result comes back, output the ATS score analysis exactly as returned by the tool — do not add, summarize, or call further tools.`,
        output: Output.object({ schema: ATSScoreSchema }),
        tools: { atsScorer: atsScorer() },
        stopWhen: isStepCount(4),
        ...shared,
      })
      const promptText = `Score my saved resume against this job description:\n\n${jobDescription}`
      const result = await agent.generate({ prompt: promptText })
      if (!result.output) throw new Error("No output generated")
      return result.output as SingleToolResult
    }

    case "gap-analyzer": {
      const agent = new ToolLoopAgent({
        model: google("gemini-3.1-flash-lite"),
        instructions: `You are a resume gap analysis agent. Call gapAnalyser exactly once with a structured job-description object that you extract truthfully from the job description in your prompt.
${JD_INPUT_RULES}
After the tool result comes back, output the gap analysis exactly as returned by the tool — do not add, summarize, or call further tools.`,
        output: Output.object({ schema: GapSchema }),
        tools: { gapAnalyser: gapAnalyser() },
        stopWhen: isStepCount(4),
        ...shared,
      })
      const promptText = `Compare my saved resume against this job description and find gaps:\n\n${jobDescription}`
      const result = await agent.generate({ prompt: promptText })
      if (!result.output) throw new Error("No output generated")
      return result.output as SingleToolResult
    }

    case "resume-analyzer": {
      const agent = new ToolLoopAgent({
        model: google("gemini-3.1-flash-lite"),
        instructions: `You are a resume analysis agent. Call resumeAnalyser exactly once — it reads the user's saved resume and extracts structured information.
After the tool result comes back, output the structured resume exactly as returned by the tool — do not add, summarize, or call further tools.`,
        output: Output.object({ schema: ResumeSchema }),
        tools: { resumeAnalyser: resumeAnalyser() },
        stopWhen: isStepCount(4),
        ...shared,
      })
      const promptText = "Analyze my saved resume."
      const result = await agent.generate({ prompt: promptText })
      if (!result.output) throw new Error("No output generated")
      return result.output as SingleToolResult
    }

    case "resume-rewriter": {
      const agent = new ToolLoopAgent({
        model: google("gemini-3.1-flash-lite"),
        instructions: `You are a resume tailoring agent. Call gapAnalyser then resumeRewriter, in that order, exactly once each.
1. Call gapAnalyser with a structured job-description object that you extract truthfully from the job description in your prompt.
${JD_INPUT_RULES}
2. Call resumeRewriter with the same structured job-description object and the gap analysis returned by gapAnalyser. resumeRewriter reads the saved resume itself.
After resumeRewriter returns, output the tailored resume exactly as returned by the tool — do not add, summarize, or call further tools.`,
        output: Output.object({ schema: ResumeSchema }),
        tools: {
          gapAnalyser: gapAnalyser(),
          resumeRewriter: resumeRewriter(),
        },
        stopWhen: isStepCount(4),
        ...shared,
      })
      const promptText = `Tailor my saved resume to this job description:\n\n${jobDescription}`
      const result = await agent.generate({ prompt: promptText })
      if (!result.output) throw new Error("No output generated")
      return result.output as SingleToolResult
    }

    case "cover-letter-generator": {
      const agent = new ToolLoopAgent({
        model: google("gemini-3.1-flash-lite"),
        instructions: `You are a cover letter agent. Call coverLetterGenerator exactly once with a structured job-description object that you extract truthfully from the job description in your prompt. Do not pass a resume parameter — the tool reads the saved resume itself.
${JD_INPUT_RULES}
After the tool result comes back, output the cover letter text in the required { letter } output format — do not editorialize or call further tools.`,
        output: Output.object({ schema: CoverLetterSchema }),
        tools: { coverLetterGenerator: coverLetterGenerator() },
        stopWhen: isStepCount(4),
        ...shared,
      })
      const promptText = `Write a cover letter for this job description:\n\n${jobDescription}`
      const result = await agent.generate({ prompt: promptText })
      if (!result.output) throw new Error("No output generated")
      return result.output as SingleToolResult
    }

    default: {
      throw new Error("Unknown tool")
    }
  }
}