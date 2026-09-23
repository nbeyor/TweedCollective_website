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
  // MCP endpoint: external agents have no Clerk session — it enforces its own
  // bearer key (lib/mcp/auth.ts). Chart viewers are integrity-checked by the
  // HMAC inside each chart token.
  '/api/mcp(.*)',
  '/charts(.*)',
  // GREX by text: Twilio cannot present a Clerk session, and the report
  // link in an SMS has to open without one. The client workspace stays gated.
  '/api/grex/mms/webhook',
  '/api/grex/mms/dry-run',
  '/r/(.*)',
  '/grex/text',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
