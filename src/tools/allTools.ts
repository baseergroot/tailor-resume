import { JDAnalysis } from "@/helper/types";
import connectDB from "@/lib/db";
import JDSchema from "@/schema/jobDescriptionSchema";
import { google } from "@ai-sdk/google";
import { generateObject, generateText, Output, tool } from "ai"
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

  gapAnalyser = () => {
    const toolRes = tool({
      description: "find gap between job description and user resume",
      inputSchema: z.object({
        jobDescription: z.string().describe("Provide Job description")
      }),
      execute: async ({ jobDescription }) => {

        return {
          message: `h`,
        };
      },
    });

    return toolRes
  }

  reWriteResume = () => {
    const toolRes = tool({
      description: "rewrite the user resume so it satisfy the job description and pass through ats",
      inputSchema: z.object({}),
      execute: async ({ }) => {

        return {
          message: `h`,
        };
      },
    });

    return toolRes
  }

  giveAtsScore = () => {
    const toolRes = tool({
      description: "give an ats score to generate resume based on job description and standard",
      inputSchema: z.object({}),
      execute: async ({ }) => {

        return {
          message: `h`,
        };
      },
    });

    return toolRes
  }

  coverLetter = () => {
    const toolRes = tool({
      description: "write a personalized cover letter, so user has higher chance of being shortlisted among all the applicants",
      inputSchema: z.object({
        jobDescription: z.string().describe("Provide Job description")
      }),
      execute: async ({ }) => {

        return {
          message: `h`,
        };
      },
    });

    return toolRes
  }
}

export const { jobDescriptionAnalyser, gapAnalyser } = new Tools()