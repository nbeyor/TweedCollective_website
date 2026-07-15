import { currentUser } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { CLIENT_CONFIGS } from '@/content/clients'

/**
 * Client workspace access control
 *
 * A signed-in user gets access to a client workspace when any of these hold:
 * 1. A verified email at one of the client's allowedEmailDomains
 *    (content/clients.ts) — the default, zero-setup path for client teams.
 * 2. Clerk public metadata { "clientSlugs": ["ecs"] } — manual override for
 *    people outside those domains (personal emails, external advisors).
 * 3. Admin (privateMetadata.isAdmin === true or publicMetadata.role ===
 *    'admin') — sees every client workspace.
 */

export function isAdminUser(user: User): boolean {
  return user.privateMetadata?.isAdmin === true || user.publicMetadata?.role === 'admin'
}

function verifiedEmailDomains(user: User): Set<string> {
  const domains = user.emailAddresses
    .filter((email) => email.verification?.status === 'verified')
    .map((email) => email.emailAddress.split('@')[1]?.toLowerCase())
    .filter((domain): domain is string => Boolean(domain))
  return new Set(domains)
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

  const metadataSlugs = Array.isArray(user.publicMetadata?.clientSlugs)
    ? (user.publicMetadata.clientSlugs as unknown[]).filter(
        (slug): slug is string => typeof slug === 'string'
      )
    : []

  const domains = verifiedEmailDomains(user)
  const domainSlugs = CLIENT_CONFIGS.filter((client) =>
    client.allowedEmailDomains?.some((domain) => domains.has(domain))
  ).map((client) => client.slug)

  return Array.from(new Set([...metadataSlugs, ...domainSlugs]))
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
