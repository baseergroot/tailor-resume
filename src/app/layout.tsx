import type { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Logo } from "@/components/logo";

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
      <body className="min-h-full flex flex-col bg-mm-canvas text-mm-ink">
        <ClerkProvider>
          {/* Hirefit Promo Banner */}
          <div className="mm-promo-banner text-xs sm:text-sm">
            AI Resume Tailoring — upload, analyze, and optimize your resume in seconds
          </div>

          {/* Hirefit Top Navigation */}
          <nav className="sticky top-0 z-50 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-8 bg-mm-canvas border-b border-mm-hairline-soft">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Logo className="w-6 h-6" />
                <span className="text-lg font-semibold tracking-tight text-mm-ink">
                  Hirefit
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-mm-steel hover:text-mm-ink transition-colors">
                  Home
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-mm-steel hover:text-mm-ink transition-colors">
                  Features
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-mm-steel hover:text-mm-ink transition-colors">
                  API
                </Link>
              </div>
            </div>

            {/* Right: Auth CTAs */}
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton>
                  <button className="mm-btn mm-btn-secondary text-sm h-9 px-4">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="mm-btn mm-btn-primary text-sm h-9 px-4">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </nav>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}