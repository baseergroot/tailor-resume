export type ToolFaq = { q: string; a: string };

export type Tool = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  definition: string;
  howItWorks: string[];
  features: string[];
  faqs: ToolFaq[];
};

export const tools: Tool[] = [
  {
    slug: "ats-scoring",
    name: "ATS Scorer",
    metaTitle: "ATS Scoring — Check Your Resume ATS Compatibility",
    metaDescription:
      "Check your resume ATS compatibility for free. Hirefit scores your resume against any job description and shows your before-and-after score after AI rewriting.",
    h1: "Free ATS Resume Scoring",
    definition:
      "An ATS score measures how well your resume matches the keywords, skills, and experience a job description asks for. Hirefit scores your resume against any job description and shows your score before and after rewriting, so you can see exactly how much your optimization helped.",
    howItWorks: [
      "Upload your resume as a PDF or DOCX file.",
      "Paste the job description you are targeting.",
      "AI extracts the required keywords and skills and scores your resume against them.",
      "Run the resume rewriter, then compare your before-and-after ATS score.",
    ],
    features: [
      "Keyword coverage for every stated requirement",
      "Separate handling of must-have and nice-to-have skills",
      "Before-and-after score comparison",
      "Clear list of gaps with fair, neutral wording",
    ],
    faqs: [
      {
        q: "What is a good ATS resume score?",
        a: "There is no universal grade. A good score means your resume covers the requirements the employer explicitly asked for. Hirefit shows coverage per requirement so you can see what is strong and what is missing.",
      },
      {
        q: "Does a high ATS score guarantee an interview?",
        a: "No. An ATS score only measures keyword and requirement matching. Recruiters still evaluate experience, culture fit, and interview performance.",
      },
      {
        q: "Can I improve my ATS score with Hirefit?",
        a: "Yes. The resume rewriter keeps every real skill and metric from your resume while adding the job description keywords your resume truthfully supports. Your score updates after rewriting so you can see the improvement.",
      },
    ],
  },
  {
    slug: "resume-analyzer",
    name: "Resume Analyzer",
    metaTitle: "Resume Analyzer — Free AI Resume Review",
    metaDescription:
      "Get a free AI resume review. Hirefit analyzes your resume structure, bullet strength, and keyword density against any job description and shows what to improve.",
    h1: "Free AI Resume Analysis",
    definition:
      "The resume analyzer reviews your resume structure, content quality, and keyword density against a target job description. It flags weak bullets, vague wording, and missing keywords so you know exactly what to improve before applying.",
    howItWorks: [
      "Upload your resume in PDF or DOCX format.",
      "Paste the job description you want to target.",
      "AI reviews structure, bullet strength, and keyword coverage.",
      "Get a list of concrete improvements to apply.",
    ],
    features: [
      "Resume structure and section quality check",
      "Bullet point strength feedback",
      "Keyword density versus the job description",
      "Profile summary and headline suggestions",
    ],
    faqs: [
      {
        q: "What does the resume analyzer look for?",
        a: "It checks structure, how clearly your bullets communicate impact, and how well your keywords match the job description you paste.",
      },
      {
        q: "Is the resume analysis really free?",
        a: "Yes. All six Hirefit AI tools, including the resume analyzer, are completely free to use.",
      },
      {
        q: "Which resume formats are supported?",
        a: "Hirefit supports PDF and DOCX uploads up to 5MB.",
      },
    ],
  },
  {
    slug: "jd-analyzer",
    name: "JD Analyzer",
    metaTitle: "Job Description Analyzer — Extract Requirements & Keywords",
    metaDescription:
      "Extract every requirement, skill, and keyword from any job description for free. Hirefit's JD analyzer separates must-have from nice-to-have items.",
    h1: "Analyze Any Job Description",
    definition:
      "The JD analyzer extracts the requirements, hard skills, soft skills, and keywords from any job description, and separates must-have items from nice-to-have ones. It tells you exactly what an employer is filtering for before you tailor your resume.",
    howItWorks: [
      "Paste any job description into Hirefit.",
      "AI extracts requirements, skills, and keywords.",
      "Must-have and nice-to-have items are separated clearly.",
      "Use the extraction as your resume tailoring checklist.",
    ],
    features: [
      "Automatic requirement extraction",
      "Hard skill and soft skill separation",
      "Must-have versus nice-to-have classification",
      "Keyword list you can match in your resume",
    ],
    faqs: [
      {
        q: "What is a job description analyzer?",
        a: "It is a tool that breaks a job post down into its concrete requirements, skills, and keywords so you can tailor your resume to exactly what the employer is filtering for.",
      },
      {
        q: "Does Hirefit analyze any job description?",
        a: "Yes. You can paste any job description from any platform or company career page.",
      },
    ],
  },
  {
    slug: "gap-analyzer",
    name: "Gap Analyzer",
    metaTitle: "Resume Gap Analyzer — Find Missing Skills",
    metaDescription:
      "Find the missing skills between your resume and any job description. Hirefit's gap analyzer lists gaps with fair, neutral wording so you can decide for yourself.",
    h1: "Identify Your Resume Gaps",
    definition:
      "The gap analyzer identifies the skills and experience that appear in a job description but are not demonstrated in your resume. Gaps are worded neutrally, so you can review them and decide for yourself whether they matter for the role.",
    howItWorks: [
      "Upload your resume and paste a job description.",
      "AI compares your resume against every requirement.",
      "Missing or undemonstrated qualifications are listed separately.",
      "Review the list and choose which gaps to close or accept.",
    ],
    features: [
      "Requirement-by-requirement coverage comparison",
      "Neutral wording — no discouraging commentary",
      "Focus on what the job actually asks for",
      "Direct link to the rewriter for keyword alignment",
    ],
    faqs: [
      {
        q: "What is a resume gap analysis?",
        a: "It compares your resume against a job description to find the requirements that are not demonstrated in your resume, so you know what an employer might look for and miss.",
      },
      {
        q: "Does a gap mean I should not apply?",
        a: "Not necessarily. Some requirements are must-have and some are preferences. The gap analyzer lists them neutrally so you can decide for yourself.",
      },
    ],
  },
  {
    slug: "resume-rewriter",
    name: "Resume Rewriter",
    metaTitle: "AI Resume Rewriter — Tailor Your Resume to Any Job",
    metaDescription:
      "Rewrite your resume for any job description with AI. Hirefit preserves every real skill and metric while optimizing bullet points and keywords — it never invents experience.",
    h1: "AI Resume Rewriting That Preserves Your Experience",
    definition:
      "The resume rewriter tailors your resume to a job description by optimizing bullet points, language, and impact statements. It is preservation-first: every technology, skill, and metric from your original resume stays, and it never invents experience.",
    howItWorks: [
      "Upload your resume and paste the job description.",
      "AI rewrites bullets to match the role's keywords.",
      "Every real skill, technology, and metric is preserved.",
      "Download your optimized, tailored resume.",
    ],
    features: [
      "Preservation-first rewriting — no invented experience",
      "JD keyword integration that your resume truthfully supports",
      "Impact-oriented bullet point optimization",
      "Downloadable tailored resume output",
    ],
    faqs: [
      {
        q: "Will the rewriter invent skills I do not have?",
        a: "No. Hirefit only uses job description keywords that your existing resume can truthfully support, and it keeps every technology and skill you already listed.",
      },
      {
        q: "Does rewriting change my metrics?",
        a: "Never. All numbers, achievements, and performance metrics from your original resume are preserved.",
      },
      {
        q: "Can I apply the rewritten resume to other jobs?",
        a: "Yes. Paste a different job description and the rewriter will tailor your resume to that role too.",
      },
    ],
  },
  {
    slug: "cover-letter-generator",
    name: "Cover Letter Gen",
    metaTitle: "AI Cover Letter Generator — Free Personalized Letters",
    metaDescription:
      "Generate a personalized cover letter in seconds. Hirefit creates cover letters aligned with the job description, based on your real experience from your resume.",
    h1: "Free AI Cover Letter Generator",
    definition:
      "The cover letter generator creates a personalized cover letter aligned with the job description you are targeting. It is built from your real resume experience, so it mentions actual achievements instead of generic filler.",
    howItWorks: [
      "Upload your resume and paste the job description.",
      "AI drafts a letter that references your real experience.",
      "Bulleted achievements are mapped to the role's requirements.",
      "Copy the result or regenerate for a different role.",
    ],
    features: [
      "Built from your actual resume experience",
      "Aligned with the target job description",
      "Professional tone and concise length",
      "Generated as part of the analysis pipeline",
    ],
    faqs: [
      {
        q: "Is the AI cover letter free?",
        a: "Yes. The cover letter generator is one of six free AI tools included with Hirefit.",
      },
      {
        q: "Does the letter use my real experience?",
        a: "Yes. It pulls achievements and skills from your uploaded resume so every claim in the letter is true.",
      },
    ],
  },
];

export function reverseTools(): Tool[] {
  return [...tools].reverse();
}