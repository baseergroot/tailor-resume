import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hirefit — AI Resume Tailoring & ATS Optimization",
    short_name: "Hirefit",
    description:
      "Free AI resume tailoring tool: optimize your resume for any job description with ATS scoring and cover letter generation.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}