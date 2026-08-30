import JDSchema from "@/schema/jobDescriptionSchema";
import { z } from "zod";

export type JDAnalysis = z.infer<typeof JDSchema>