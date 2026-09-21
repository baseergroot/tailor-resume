"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CTATrackingProps {
  children: React.ReactNode
  href: string
  className?: string
  eventName: "landing_cta_clicked"
  ctaLabel: string
}

export function CTATracking({
  children,
  href,
  className,
  eventName,
  ctaLabel,
}: CTATrackingProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isNavigating) return

    e.preventDefault()
    setIsNavigating(true)

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventName,
        path: window.location.pathname,
        metadata: { ctaLabel },
      }),
      keepalive: true,
    }).finally(() => {
      router.push(href)
    })
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      aria-busy={isNavigating}
    >
      {children}
    </Link>
  )
}