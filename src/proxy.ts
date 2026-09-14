import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Only protect dashboard and API routes so the marketing sites stay static
    '/dashboard/:path*',
    '/api/:path*',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/:path*',
  ],
}