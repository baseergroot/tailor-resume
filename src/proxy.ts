import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth, req) => {
  // Handle www -> non-www redirect, excluding sitemap.xml and robots.txt
  const host = req.headers.get('host') || ''
  if (host === 'www.hirefit.live') {
    const url = req.nextUrl.clone()
    url.host = 'hirefit.live'
    url.protocol = 'https'
    // Don't redirect sitemap.xml or robots.txt
    if (!url.pathname.startsWith('/sitemap') && url.pathname !== '/robots.txt') {
      return NextResponse.redirect(url, 301)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}