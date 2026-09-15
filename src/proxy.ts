import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Only protect dashboard and API routes so the marketing sites stay static
    '/dashboard/:path*',
    '/api/:path*',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/:path*',
  ],
}