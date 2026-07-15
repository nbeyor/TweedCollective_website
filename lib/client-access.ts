import { currentUser } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { CLIENT_CONFIGS } from '@/content/clients'

/**
 * Client workspace access control
 *
 * Access is granted per user by an admin: the Admin dashboard's Client
 * Workspaces toggles write { "clientSlugs": ["ecs"] } into the user's Clerk
 * public metadata. Admins (privateMetadata.isAdmin === true or
 * publicMetadata.role === 'admin') see every client workspace.
 */

export function isAdminUser(user: User): boolean {
  return user.privateMetadata?.isAdmin === true || user.publicMetadata?.role === 'admin'
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
