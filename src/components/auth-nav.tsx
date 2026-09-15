"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const isSignedIn = () =>
  typeof document !== "undefined" && document.cookie.includes("__session=");

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("focus", onStoreChange);
  window.addEventListener("pageshow", onStoreChange);
  return () => {
    window.removeEventListener("focus", onStoreChange);
    window.removeEventListener("pageshow", onStoreChange);
  };
};

export default function AuthNav() {
  const signedIn = useSyncExternalStore(subscribe, isSignedIn, () => false);

  if (signedIn) {
    return (
      <Link href="/dashboard" className="mm-btn mm-btn-primary text-sm h-9 px-4">
        My Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/sign-in" className="mm-btn mm-btn-secondary text-sm h-9 px-4">
        Login
      </Link>
      <Link href="/sign-up" className="mm-btn mm-btn-primary text-sm h-9 px-4">
        Sign Up
      </Link>
    </div>
  );
}