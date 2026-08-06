import { currentUser } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
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
 * Client slugs the current user may access. Admins get all configured slugs.
 */
export async function getClientSlugs(): Promise<string[]> {
  const user = await currentUser()
  if (!user) return []

  if (isAdminUser(user)) {
    return CLIENT_CONFIGS.map((client) => client.slug)
  }

  const slugs = user.publicMetadata?.clientSlugs
  if (!Array.isArray(slugs)) return []
  return slugs.filter((slug): slug is string => typeof slug === 'string')
}

/**
 * Server-side guard for a specific client's pages. Redirects signed-out users
 * to sign-in. Signed-in users without access to a configured client are sent
 * to an explicit access-restricted page (a 404 here reads as "the page is
 * gone" and hides the real problem — missing Clerk metadata). Slugs that
 * aren't configured clients at all still 404.
 */
export async function requireClientAccess(slug: string): Promise<void> {
  const user = await currentUser()
  if (!user) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/clients/${slug}`)}`)
  }

  const slugs = await getClientSlugs()
  if (!slugs.includes(slug)) {
    if (!CLIENT_CONFIGS.some((client) => client.slug === slug)) {
      notFound()
    }
    redirect(`/clients/access-denied?client=${encodeURIComponent(slug)}`)
  }
}
