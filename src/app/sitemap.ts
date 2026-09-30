import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

// Stable date for sitemap - use a fixed build date or the latest deploy date
// In production, this could be set via env var: process.env.BUILD_DATE
const BUILD_DATE = new Date("2025-01-15");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const tool of tools) {
    entries.push({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  entries.push({
    url: `${siteUrl}/guides`,
    lastModified: BUILD_DATE,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  entries.push({
    url: `${siteUrl}/guides/tailor-resume-to-job-description`,
    lastModified: BUILD_DATE,
    changeFrequency: "monthly",
    priority: 0.9,
  });

  return entries;
}