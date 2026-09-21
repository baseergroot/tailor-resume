"use client"

import { useEffect } from "react"
import { SignIn } from "@clerk/nextjs"

export function SignInTracking() {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "auth_started",
        path: window.location.pathname,
      }),
      keepalive: true,
    })
  }, [])

  return <SignIn />
}