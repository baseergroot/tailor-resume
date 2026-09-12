import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

const JdKeywordsSchema = z.object({
  ats_keywords: z.array(z.string()),
})

export type KeywordCoverage = {
  score: number
  matched: string[]
  missing: string[]
}

export async function extractJdKeywords(jobDescription: string): Promise<string[]> {
  const result = await generateText({
    model: google("gemini-3.1-flash-lite"),

    output: Output.object({
      schema: JdKeywordsSchema,
    }),

    prompt: `
Extract the exact technical terms, tools, frameworks, and skills that an ATS system would scan for in this job description.
Include both required and preferred skills as keywords.
Be specific — "React.js" not just "React", "Node.js" not "Node".

Job Description:
${jobDescription}
`,
  })

  return result.output.ats_keywords
}

export function computeKeywordCoverage(
  keywords: string[],
  resumeText: string,
): KeywordCoverage {
  const unique = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))]
  const haystack = resumeText.toLowerCase()

  const matched = unique.filter((keyword) => matchKeyword(keyword, haystack))
  const missing = unique.filter((keyword) => !matchKeyword(keyword, haystack))

  const score = unique.length === 0 ? 0 : Math.round((matched.length / unique.length) * 100)

  return { score, matched, missing }
}

function matchKeyword(keyword: string, haystack: string): boolean {
  const k = keyword.trim()
  if (!k) return false

  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const boundary = new RegExp(`\\b${escaped}\\b`, "i")

  if (boundary.test(haystack)) return true

  // Keywords containing non-word characters (e.g. "C#", "CI/CD") can defeat
  // word boundaries; fall back to a substring check for those only.
  if (/[^\w\s]/.test(k)) {
    return haystack.includes(k.toLowerCase())
  }

  return false
}