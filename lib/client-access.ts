import { currentUser } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CLIENT_CONFIGS } from '@/content/clients'

/**
 * Client workspace access control
 *
 * A signed-in user is mapped to one or more client slugs via Clerk metadata.
 *
 * To grant a user access to a client workspace:
 * 1. Go to Clerk Dashboard > Users > Select User > Metadata
 * 2. Add to public metadata: { "clientSlugs": ["ecs"] }
 *
 * Admins (privateMetadata.isAdmin === true, publicMetadata.role === 'admin',
 * or a verified primary email in ADMIN_EMAILS) see every client workspace.
 */

/**
 * Always-admin emails. The address must be the user's verified primary
 * email in Clerk — an unverified sign-up claiming one of these gets nothing.
 */
const ADMIN_EMAILS = new Set(['nate.beyor@tweedcollective.ai'])

export function isAdminUser(user: User): boolean {
  if (user.privateMetadata?.isAdmin === true || user.publicMetadata?.role === 'admin') {
    return true
  }

  const primaryEmail = user.primaryEmailAddress
  return (
    primaryEmail != null &&
    primaryEmail.verification?.status === 'verified' &&
    ADMIN_EMAILS.has(primaryEmail.emailAddress.toLowerCase())
  )
}

/**
 * Client slugs a given user may access. Admins get all configured slugs.
 */
export function clientSlugsForUser(user: User): string[] {
  if (isAdminUser(user)) {
    return CLIENT_CONFIGS.map((client) => client.slug)
  }

  const slugs = user.publicMetadata?.clientSlugs
  if (!Array.isArray(slugs)) return []
  return slugs.filter((slug): slug is string => typeof slug === 'string')
}

/**
 * Client slugs the current user may access. Admins get all configured slugs.
 */
export async function getClientSlugs(): Promise<string[]> {
  const user = await currentUser()
  if (!user) return []
  return clientSlugsForUser(user)
}

/**
 * Server-side guard for a specific client's pages. Redirects signed-out users
 * to sign-in. Any signed-in user without access — including to a slug that has
 * a page but is missing from CLIENT_CONFIGS — is sent to the access-restricted
 * page. A 404 here reads as "the page is gone" and hides the real problem
 * (missing Clerk metadata, or a workspace that was never registered), which is
 * exactly how the strategist demo broke: the route existed, the registry entry
 * didn't, and locked-out users saw a bare 404.
 */
export async function requireClientAccess(slug: string): Promise<void> {
  const user = await currentUser()
  if (!user) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/clients/${slug}`)}`)
  }

  const slugs = clientSlugsForUser(user)
  if (!slugs.includes(slug)) {
    logDenied(user, slug, slugs)
    redirect(`/clients/access-denied?client=${encodeURIComponent(slug)}`)
  }
}

/**
 * Every denial names the account and the grants it actually carried at request
 * time. "The admin panel says she has access but she's locked out" is only
 * diagnosable from this line: it shows whether the denied session belongs to
 * a different account than the one that was granted.
 */
function logDenied(user: User, requestedSlug: string, grantedSlugs: string[]): void {
  console.warn(
    `[client-access] denied user=${user.id} email=${user.primaryEmailAddress?.emailAddress ?? 'none'} ` +
      `requested=${requestedSlug} granted=[${grantedSlugs.join(', ')}]`
  )
}

/**
 * API-route counterpart to requireClientAccess. Returns a JSON error response
 * when the caller may not use the workspace, or null when they may.
 *
 * Route handlers can't redirect a fetch() caller anywhere useful, and the
 * workspace endpoints bill real model calls — so an unauthorized caller has to
 * be turned away before any work happens, not just kept out of the page.
 */
export async function clientAccessError(slug: string): Promise<Response | null> {
  const user = await currentUser()
  if (!user) {
    return Response.json({ error: 'Sign in to use this workspace.' }, { status: 401 })
  }

  const slugs = clientSlugsForUser(user)
  if (!slugs.includes(slug)) {
    logDenied(user, slug, slugs)
    return Response.json(
      { error: 'Your account is not authorized for this workspace.' },
      { status: 403 }
    )
  }

  return null
}
