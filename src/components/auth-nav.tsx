"use client";

import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function AuthNav() {
  return (
    <ClerkProvider>
      <Show
        when="signed-out"
        fallback={<UserButton />}
      >
        <div className="flex items-center gap-3">
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
        </div>
      </Show>
    </ClerkProvider>
  );
}