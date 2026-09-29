import { currentUser } from '@clerk/nextjs/server'

import { pacificDayKey } from './day'
import { PROFILE_LABELS, type ProfileId, type VoteChoice, type VoteRecord } from './types'

/** Nate's verified Tweed address. Override with NYT_TV_NATE_EMAIL. */
export const DEFAULT_NATE_EMAIL = 'nate.beyor@tweedcollective.ai'

type Env = Record<string, string | undefined>

export function nateEmail(env: Env = process.env): string {
  return (env.NYT_TV_NATE_EMAIL || DEFAULT_NATE_EMAIL).trim().toLowerCase()
}

/** Jen's address is unknown until NYT_TV_JEN_EMAIL is set. No default. */
export function jenEmail(env: Env = process.env): string | null {
  const raw = env.NYT_TV_JEN_EMAIL?.trim().toLowerCase()
  return raw || null
}

export function profileForEmail(email: string | null | undefined, env: Env = process.env): ProfileId | null {
  if (!email) return null
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null
  if (normalized === nateEmail(env)) return 'nate'
  const jen = jenEmail(env)
  if (jen && normalized === jen && jen !== nateEmail(env)) return 'jen'
  return null
}

/** Both allowlisted inboxes. Jen is omitted until her env var is set. */
export function digestRecipients(env: Env = process.env): string[] {
  const recipients = [nateEmail(env)]
  const jen = jenEmail(env)
  if (jen && jen !== nateEmail(env)) recipients.push(jen)
  return recipients
}

export type NytTvSession =
  | { status: 'ok'; profileId: ProfileId; email: string; label: string }
  | { status: 'signed-out' }
  | { status: 'unverified'; email: string | null }
  | { status: 'denied'; email: string | null }

export function nytTvSessionError(session: NytTvSession): Response | null {
  if (session.status === 'ok') return null
  if (session.status === 'signed-out') {
    return Response.json({ error: 'Sign in required.' }, { status: 401 })
  }
  if (session.status === 'unverified') {
    return Response.json({ error: 'Verify your email, then refresh.' }, { status: 403 })
  }
  return Response.json({ error: 'This account is not on the NYT TV list.' }, { status: 403 })
}

export async function nytTvSession(): Promise<NytTvSession> {
  const user = await currentUser()
  if (!user) return { status: 'signed-out' }

  const primary = user.primaryEmailAddress
  const email = primary?.emailAddress ?? null
  if (!primary || primary.verification?.status !== 'verified' || !email) {
    return { status: 'unverified', email }
  }

  const profileId = profileForEmail(email)
  if (!profileId) return { status: 'denied', email }

  return { status: 'ok', profileId, email, label: PROFILE_LABELS[profileId] }
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
