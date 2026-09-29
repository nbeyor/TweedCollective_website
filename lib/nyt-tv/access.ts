import { clerkClient, currentUser } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/server'

import { clientSlugsForUser, isAdminUser } from '@/lib/client-access'

import { pacificDayKey } from './day'
import { normalizeEmail } from './pairs'
import type { VoteChoice, VoteRecord } from './types'

/** Workspace slug. Admission is the Clerk client grant from PR 117, same as Grex and eCS. */
export const NYT_TV_CLIENT_SLUG = 'nyt-tv-100'

/** Optional bootstrap address. Not an admission gate and not a hardwired pair. */
export const DEFAULT_NATE_EMAIL = 'nate.beyor@tweedcollective.ai'

type Env = Record<string, string | undefined>

export function nateEmail(env: Env = process.env): string {
  return (env.NYT_TV_NATE_EMAIL || DEFAULT_NATE_EMAIL).trim().toLowerCase()
}

/** Optional partner address for the env bootstrap invite. Not an admission gate. */
export function jenEmail(env: Env = process.env): string | null {
  return normalizeEmail(env.NYT_TV_JEN_EMAIL)
}

/** Nate's checklist. Admin, or the verified address in NYT_TV_NATE_EMAIL. */
export function showsOwnerNotes(input: { isAdmin: boolean; email: string | null }, env: Env = process.env): boolean {
  if (input.isAdmin) return true
  const email = normalizeEmail(input.email)
  return email != null && email === nateEmail(env)
}

export interface NytViewer {
  userId: string
  email: string
  isOwner: boolean
}

export type ViewerLookup =
  | { status: 'signed-out' }
  | { status: 'unverified'; userId: string; email: string | null }
  | { status: 'ok'; viewer: NytViewer }

export async function lookupViewer(): Promise<ViewerLookup> {
  const user = await currentUser()
  if (!user) return { status: 'signed-out' }
  const primary = user.primaryEmailAddress
  const email = normalizeEmail(primary?.emailAddress)
  const verified = primary?.verification?.status === 'verified' && email != null
  if (!verified || !email) return { status: 'unverified', userId: user.id, email }
  return {
    status: 'ok',
    viewer: {
      userId: user.id,
      email,
      isOwner: showsOwnerNotes({ isAdmin: isAdminUser(user), email }),
    },
  }
}

/**
 * Adds nyt-tv-100 to public metadata when a partner's verified email matches
 * an invite. Admins already pass clientSlugsForUser and skip this.
 */
export async function grantNytClientSlug(user: User): Promise<void> {
  if (clientSlugsForUser(user).includes(NYT_TV_CLIENT_SLUG)) return
  const current = Array.isArray(user.publicMetadata?.clientSlugs)
    ? user.publicMetadata.clientSlugs.filter((slug): slug is string => typeof slug === 'string')
    : []
  if (current.includes(NYT_TV_CLIENT_SLUG)) return
  const client = await clerkClient()
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      clientSlugs: [...current, NYT_TV_CLIENT_SLUG],
    },
  })
}

export function voteRecord(userId: string, showRank: number, vote: VoteChoice, at: Date = new Date()): VoteRecord {
  return {
    userId,
    showRank,
    vote,
    updatedAt: at.toISOString(),
    dayKey: pacificDayKey(at),
  }
}
