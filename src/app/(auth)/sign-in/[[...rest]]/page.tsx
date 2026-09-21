import type { Metadata } from "next";
import { SignInTracking } from "@/components/SignInTracking";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return <SignInTracking />;
}