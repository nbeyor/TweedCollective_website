import { randomBytes } from 'crypto'

export type PairStatus = 'pending' | 'active'

export interface PairMember {
  userId: string
  email: string
  joinedAt: string
}

/**
 * One couple. Pending until the partner confirms (invite link, or by
 * requesting this person back). Active rows are the source of truth:
 * `{ aUserId, bUserId, aEmail, bEmail, pairedAt }`.
 */
export interface PairRecord {
  id: string
  createdAt: string
  status: PairStatus
  inviteEmail: string
  inviteToken: string
  members: PairMember[]
  /** Clerk id of the person who must confirm. Known only after they have signed in. */
  partnerUserId: string | null
  pairedAt: string | null
}

/** Active pair, in the shape the rest of the app stores and returns. */
export interface ConfirmedPair {
  aUserId: string
  bUserId: string
  aEmail: string
  bEmail: string
  pairedAt: string
}

export interface DirectoryUser {
  userId: string
  email: string
  seenAt: string
}

export type BindKind =
  | 'bind'
  | 'already-member'
  | 'missing'
  | 'unverified'
  | 'self'
  | 'email-mismatch'
  | 'other-pair'

export interface BindDecision {
  kind: BindKind
}

export function normalizeEmail(value: string | null | undefined): string | null {
  if (!value) return null
  const email = value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

/** Path segment. The token is the invite; the partner email is not in the URL. */
export function invitePath(token: string): string {
  return `/clients/nyt-tv-100/join/${encodeURIComponent(token)}`
}

export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(9).toString('base64url')}`
}

export function newInviteToken(): string {
  return randomBytes(18).toString('base64url')
}

export function emailIndexKey(email: string): string {
  return Buffer.from(email, 'utf8').toString('base64url')
}

export function confirmedPair(pair: PairRecord | null): ConfirmedPair | null {
  if (!pair || pair.status !== 'active' || !pair.pairedAt || pair.members.length < 2) return null
  const [first, second] = pair.members
  if (!first || !second) return null
  return {
    aUserId: first.userId,
    bUserId: second.userId,
    aEmail: first.email,
    bEmail: second.email,
    pairedAt: pair.pairedAt,
  }
}

export function buildPendingPair(input: {
  id?: string
  token?: string
  inviterUserId: string
  inviterEmail: string
  inviteEmail: string
  partnerUserId: string | null
  now?: Date
}): PairRecord {
  const now = (input.now ?? new Date()).toISOString()
  return {
    id: input.id ?? newId('pair'),
    createdAt: now,
    status: 'pending',
    inviteEmail: input.inviteEmail,
    inviteToken: input.token ?? newInviteToken(),
    members: [{ userId: input.inviterUserId, email: input.inviterEmail, joinedAt: now }],
    partnerUserId: input.partnerUserId,
    pairedAt: null,
  }
}

export function partnerEmail(pair: PairRecord | null, userId: string): string | null {
  if (!pair) return null
  const other = pair.members.find((member) => member.userId !== userId)
  if (other) return other.email
  return pair.status === 'pending' ? pair.inviteEmail : null
}

export function decideBind(input: {
  pair: PairRecord | null
  viewerUserId: string
  viewerEmail: string | null
  viewerVerified: boolean
  viewerPairId: string | null
}): BindDecision {
  const pair = input.pair
  if (!pair) return { kind: 'missing' }
  if (pair.members.some((member) => member.userId === input.viewerUserId)) return { kind: 'already-member' }
  if (pair.status === 'active') return { kind: 'other-pair' }
  if (input.viewerPairId && input.viewerPairId !== pair.id) return { kind: 'other-pair' }
  const inviter = pair.members[0]
  if (inviter && inviter.userId === input.viewerUserId) return { kind: 'self' }
  const viewerEmail = normalizeEmail(input.viewerEmail)
  if (!input.viewerVerified || !viewerEmail) return { kind: 'unverified' }
  if (viewerEmail !== pair.inviteEmail) return { kind: 'email-mismatch' }
  if (inviter && inviter.email === viewerEmail) return { kind: 'self' }
  return { kind: 'bind' }
}

/** Returns a new pair with the partner attached. Does not mutate the input. */
export function withPartner(pair: PairRecord, member: PairMember, pairedAt: string): PairRecord {
  return {
    ...pair,
    status: 'active',
    partnerUserId: member.userId,
    pairedAt,
    members: [...pair.members.filter((existing) => existing.userId !== member.userId), member],
  }
}

export interface MatchShow {
  rank: number
  title: string
}

/** Shows both people marked want. Order is NYT rank, not swipe order. */
export function wantOverlap(
  votesA: { showRank: number; vote: 'want' | 'skip' }[],
  votesB: { showRank: number; vote: 'want' | 'skip' }[],
  shows: { rank: number; title: string }[]
): MatchShow[] {
  const wantedByB = new Set(votesB.filter((vote) => vote.vote === 'want').map((vote) => vote.showRank))
  const ranks = Array.from(
    new Set(votesA.filter((vote) => vote.vote === 'want' && wantedByB.has(vote.showRank)).map((vote) => vote.showRank))
  ).sort((a, b) => a - b)
  return ranks.map((rank) => ({
    rank,
    title: shows.find((show) => show.rank === rank)?.title ?? 'Show',
  }))
}
