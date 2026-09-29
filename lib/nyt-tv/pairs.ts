import { randomBytes } from 'crypto'

export type PairStatus = 'pending' | 'active'

export interface PairMember {
  userId: string
  email: string
  joinedAt: string
}

/** One couple. Pending until the partner opens the invite link and binds. */
export interface PairRecord {
  id: string
  createdAt: string
  status: PairStatus
  inviteEmail: string
  inviteToken: string
  members: PairMember[]
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

export function buildPendingPair(input: {
  id?: string
  token?: string
  inviterUserId: string
  inviterEmail: string
  inviteEmail: string
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
export function withPartner(pair: PairRecord, member: PairMember): PairRecord {
  return {
    ...pair,
    status: 'active',
    members: [...pair.members, member],
  }
}
