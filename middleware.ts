import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/services',
  '/operators',
  '/contact',
  '/insights',
  '/insights/(.*)',
  '/admin',
  '/internal',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/magic-link(.*)',
  '/api/webhooks(.*)',
  '/api/document-access(.*)',
  '/api/admin(.*)',
  '/api/magic-link(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones
  if (isPublicRoute(req)) return;

  const { userId, redirectToSignIn } = await auth();
  if (userId) return;

  // Not auth.protect(): that helper answers signed-out NON-document requests
  // (client-side navigations, prefetches, fetch calls) with a bare 404, so an
  // authorized user whose session expired mid-visit clicks a workspace link
  // and reads "page not found" instead of being asked to sign back in.
  if (req.nextUrl.pathname.startsWith("/api") || req.nextUrl.pathname.startsWith("/trpc")) {
    return Response.json({ error: "Signed out. Sign in to use this endpoint." }, { status: 401 });
  }
  return redirectToSignIn({ returnBackUrl: req.url });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
