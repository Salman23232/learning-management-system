import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes are public (no auth required)
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware({
  // Use `beforeAuth` to skip auth for public routes
  beforeAuth: (req) => {
    if (isPublicRoute(req)) {
      return { skip: true } // skip protection
    }
    return {} // default = protect
  },
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}
