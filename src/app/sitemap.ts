import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const tool of tools) {
    entries.push({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}