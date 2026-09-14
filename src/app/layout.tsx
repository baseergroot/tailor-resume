import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailor-resume-agent.vercel.app";

const siteTitle = "Hirefit — AI Resume Tailoring & ATS Optimization";
const siteDescription =
  "Hirefit is the free AI resume tailoring tool. Upload your resume, paste a job description, and get an ATS-optimized resume with keyword analysis, gap detection, and a custom cover letter in under a minute.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Hirefit",
  },
  description: siteDescription,
  applicationName: "Hirefit",
  keywords: [
    "AI resume builder",
    "resume tailoring",
    "ATS resume optimizer",
    "ATS score checker",
    "tailor resume to job description",
    "resume keyword optimization",
    "AI cover letter generator",
    "resume rewriting tool",
  ],
  authors: [{ name: "Hirefit" }],
  creator: "Hirefit",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Hirefit",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hirefit — AI Resume Tailoring & ATS Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", dmSans.variable, geistMono.variable)}
    >
      <body className="min-h-full bg-mm-canvas text-mm-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}