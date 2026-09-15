import Link from "next/link";
import { Logo } from "@/components/logo";
import AuthNav from "@/components/auth-nav";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen flex flex-col bg-mm-canvas text-mm-ink">
      <div className="mm-promo-banner text-xs sm:text-sm">
        AI Resume Tailoring — upload, analyze, and optimize your resume in seconds
      </div>

      <nav className="sticky top-0 z-50 flex items-center justify-between h-14 sm:h-16 px-4 sm:px-8 bg-mm-canvas border-b border-mm-hairline-soft">
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
          </div>
        </div>

        <AuthNav />
      </nav>

      <div className="flex-1">{children}</div>
    </div>
  );
}