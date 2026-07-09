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
 * Admins (privateMetadata.isAdmin === true or publicMetadata.role === 'admin')
 * see every client workspace.
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
 * to sign-in and 404s users without access to this client.
 */
export async function requireClientAccess(slug: string): Promise<void> {
  const user = await currentUser()
  if (!user) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/clients/${slug}`)}`)
  }

  const slugs = await getClientSlugs()
  if (!slugs.includes(slug)) {
    notFound()
  }
}
