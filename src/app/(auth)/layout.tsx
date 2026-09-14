import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-mm-canvas text-mm-ink px-4 py-12">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <Logo className="w-8 h-8" />
          <span className="text-xl font-semibold tracking-tight text-mm-ink">
            Hirefit
          </span>
        </Link>
        {children}
      </div>
    </ClerkProvider>
  );
}