import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tailor Resume | AI-Powered Resume Optimization",
  description:
    "AI-powered resume tailoring and scheduling assistant. Upload your resume, paste a job description, and get an optimized version with ATS scoring.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", dmSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col bg-mm-canvas text-mm-ink">
        <ClerkProvider>
          {/* MiniMax Promo Banner */}
          <div className="mm-promo-banner text-xs sm:text-sm">
            AI Resume Tailoring — Upload, analyze, and optimize your resume in seconds
          </div>

          {/* MiniMax Top Navigation */}
          <nav className="sticky top-0 z-50 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-8 bg-mm-canvas border-b border-mm-hairline-soft">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2 shrink-0">
                <span className="text-lg font-semibold tracking-tight text-mm-ink">
                  TailorResume
                </span>
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a href="/" className="text-sm font-medium text-mm-steel hover:text-mm-ink transition-colors">
                  Home
                </a>
                <a href="/" className="text-sm font-medium text-mm-steel hover:text-mm-ink transition-colors">
                  Features
                </a>
                <a href="/" className="text-sm font-medium text-mm-steel hover:text-mm-ink transition-colors">
                  API
                </a>
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
