import { clerkMiddleware } from '@clerk/nextjs/server'

// Minimal middleware - doesn't protect any routes but allows Clerk to detect auth
// The actual auth protection is done at the API/function level
export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}