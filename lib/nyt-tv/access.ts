import { currentUser } from '@clerk/nextjs/server'

import { clientSlugsForUser, isAdminUser } from '@/lib/client-access'

import { pacificDayKey } from './day'
import { PROFILE_LABELS, type ProfileId, type VoteChoice, type VoteRecord } from './types'

/** Workspace slug. Admission is the normal Clerk client grant, same as Grex and eCS. */
export const NYT_TV_CLIENT_SLUG = 'nyt-tv-100'

/** Nate's verified Tweed address. Override with NYT_TV_NATE_EMAIL. */
export const DEFAULT_NATE_EMAIL = 'nate.beyor@tweedcollective.ai'

type Env = Record<string, string | undefined>

export function nateEmail(env: Env = process.env): string {
  return (env.NYT_TV_NATE_EMAIL || DEFAULT_NATE_EMAIL).trim().toLowerCase()
}

/** Jen's digest address. Optional profile hint. Not an admission gate. */
export function jenEmail(env: Env = process.env): string | null {
  const raw = env.NYT_TV_JEN_EMAIL?.trim().toLowerCase()
  return raw || null
}

/**
 * Email hint only. Unknown addresses stay unassigned here; workspace access
 * decides admission, and `profileForSubject` assigns the deck after that.
 */
export function profileForEmail(email: string | null | undefined, env: Env = process.env): ProfileId | null {
  if (!email) return null
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null
  if (normalized === nateEmail(env)) return 'nate'
  const jen = jenEmail(env)
  if (jen && normalized === jen && jen !== nateEmail(env)) return 'jen'
  return null
}

/** Digest inboxes. Jen is omitted until NYT_TV_JEN_EMAIL is set. Not the admission gate. */
export function digestRecipients(env: Env = process.env): string[] {
  const recipients = [nateEmail(env)]
  const jen = jenEmail(env)
  if (jen && jen !== nateEmail(env)) recipients.push(jen)
  return recipients
}

/** Signed-in user, after client-workspace access has already been decided. */
export interface ProfileSubject {
  isAdmin: boolean
  email: string | null
  verified: boolean
  hasClientAccess: boolean
}

/**
 * Deck profile once the workspace grant exists.
 * Nate: admin, or a verified primary email matching NYT_TV_NATE_EMAIL.
 * Jen: verified primary email matching NYT_TV_JEN_EMAIL, or any granted user who is not Nate.
 */
export function profileForSubject(subject: ProfileSubject, env: Env = process.env): ProfileId | null {
  const verifiedEmail = subject.verified ? subject.email?.trim().toLowerCase() || null : null
  const nate = nateEmail(env)
  if (subject.isAdmin || (verifiedEmail != null && verifiedEmail === nate)) return 'nate'

  const jen = jenEmail(env)
  if (jen && verifiedEmail != null && verifiedEmail === jen && jen !== nate) return 'jen'
  if (subject.hasClientAccess) return 'jen'
  return null
}

export type NytTvProfile = {
  profileId: ProfileId
  email: string | null
  label: string
}

/** Profile for the signed-in Clerk user. Null when nobody is signed in or no deck fits. */
export async function nytTvProfile(): Promise<NytTvProfile | null> {
  const user = await currentUser()
  if (!user) return null

  const primary = user.primaryEmailAddress
  const email = primary?.emailAddress ?? null
  const profileId = profileForSubject({
    isAdmin: isAdminUser(user),
    email,
    verified: primary?.verification?.status === 'verified',
    hasClientAccess: clientSlugsForUser(user).includes(NYT_TV_CLIENT_SLUG),
  })
  if (!profileId) return null

  return { profileId, email, label: PROFILE_LABELS[profileId] }
}

export function voteRecord(profileId: ProfileId, showRank: number, vote: VoteChoice, at: Date = new Date()): VoteRecord {
  return {
    profileId,
    showRank,
    vote,
    updatedAt: at.toISOString(),
    dayKey: pacificDayKey(at),
  }
}
