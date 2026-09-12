"use server"

import { runResumeAnalysis, type RunResumeAnalysisOptions } from "./agentRunner"

export async function resumeAgent(jobDescription: string, options?: RunResumeAnalysisOptions) {
  return runResumeAnalysis(jobDescription, options)
}