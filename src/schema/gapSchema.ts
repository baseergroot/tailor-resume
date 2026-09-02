import { z } from 'zod'

const GapSchema = z.object({
    matched_skills: z.array(z.string()),
    missing_required_skills: z.array(z.string()),
    missing_preferred_skills: z.array(z.string()),
    matched_keywords: z.array(z.string()),
    missing_keywords: z.array(z.string()),
    experience_gaps: z.array(z.string()),
})

export default GapSchema