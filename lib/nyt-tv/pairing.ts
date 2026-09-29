import { jenEmail, nateEmail, type PartnerAccount } from './access'
import {
  buildPendingPair,
  confirmedPair,
  decideBind,
  invitePath,
  normalizeEmail,
  partnerEmail,
  withPartner,
  type BindDecision,
  type ConfirmedPair,
  type PairRecord,
} from './pairs'
import type { VoteStore } from './store'

export interface PairViewer {
  userId: string
  email: string
}

type Env = Record<string, string | undefined>

export type InviteResult = { ok: true; pair: PairRecord } | { ok: false; error: string; status: number }

export type PairViewStatus = 'solo' | 'pending' | 'incoming' | 'active'

export interface PairView {
  status: PairViewStatus
  partnerEmail: string | null
  invitePath: string | null
  confirmed: ConfirmedPair | null
  pair: PairRecord | null
}

export interface RequestPairOptions {
  now?: Date
  /** Clerk account for the invited email, when one exists. Null means they have not signed up. */
  partner?: PartnerAccount | null
}

/**
 * Enter a partner email. If that account already has watchlist access, the pair is active now.
 * Otherwise a pending invite is stored and binds on their first eligible session.
 */
export async function requestPair(
  store: VoteStore,
  viewer: PairViewer,
  rawEmail: string,
  options: RequestPairOptions = {}
): Promise<InviteResult> {
  const now = options.now ?? new Date()
  const inviteEmail = normalizeEmail(rawEmail)
  if (!inviteEmail) return { ok: false, error: 'Enter a valid email address.', status: 400 }
  if (inviteEmail === viewer.email) return { ok: false, error: "Enter your partner's email, not your own.", status: 400 }

  const partner = options.partner && options.partner.email === inviteEmail ? options.partner : null
  if (partner?.userId === viewer.userId) return { ok: false, error: "Enter your partner's email, not your own.", status: 400 }

  const viewerPair = await store.getPairForUser(viewer.userId)
  if (viewerPair?.status === 'active') {
    return { ok: false, error: 'You are already paired. Unpair first to choose someone else.', status: 409 }
  }

  if (partner?.hasAccess) {
    const partnerPair = await store.getPairForUser(partner.userId)
    if (partnerPair?.status === 'active') {
      return { ok: false, error: 'That person is already paired with someone else.', status: 409 }
    }
    if (partnerPair?.status === 'pending' && partnerPair.inviteEmail === viewer.email) {
      return activatePair(store, partnerPair, viewer, now, viewerPair)
    }
    if (partnerPair && partnerPair.id !== viewerPair?.id) {
      return { ok: false, error: 'That person already has a pending invite.', status: 409 }
    }
    const base = pendingFor(viewer, inviteEmail, partner.userId, now, viewerPair)
    const pairedAt = now.toISOString()
    const next = withPartner(base, { userId: partner.userId, email: inviteEmail, joinedAt: pairedAt }, pairedAt)
    await store.savePair(next, rotatedToken(viewerPair, next))
    return { ok: true, pair: next }
  }

  const invitedMe = await store.getPendingInviteByEmail(viewer.email)
  if (invitedMe && invitedMe.members[0]?.email === inviteEmail) {
    return activatePair(store, invitedMe, viewer, now, viewerPair)
  }
  if (invitedMe && invitedMe.members[0]?.userId !== viewer.userId) {
    const from = invitedMe.members[0]?.email ?? 'someone else'
    return {
      ok: false,
      error: `Waiting for you to join ${from}'s invite. Open the watchlist to pair, or ask them to cancel it.`,
      status: 409,
    }
  }

  const reserved = await store.getPendingInviteByEmail(inviteEmail)
  if (reserved && reserved.id !== viewerPair?.id) {
    return { ok: false, error: 'That email already has a pending invite.', status: 409 }
  }

  if (viewerPair?.status === 'pending' && viewerPair.inviteEmail === inviteEmail) {
    const partnerUserId = partner?.userId ?? viewerPair.partnerUserId
    if (partnerUserId === viewerPair.partnerUserId) return { ok: true, pair: viewerPair }
    const next: PairRecord = { ...viewerPair, partnerUserId }
    await store.savePair(next)
    return { ok: true, pair: next }
  }

  const next = pendingFor(viewer, inviteEmail, partner?.userId ?? null, now, viewerPair)
  await store.savePair(next, rotatedToken(viewerPair, next))
  return { ok: true, pair: next }
}

function pendingFor(
  viewer: PairViewer,
  inviteEmail: string,
  partnerUserId: string | null,
  now: Date,
  existing: PairRecord | null
): PairRecord {
  const next = buildPendingPair({
    id: existing?.status === 'pending' ? existing.id : undefined,
    token: existing?.status === 'pending' && existing.inviteEmail === inviteEmail ? existing.inviteToken : undefined,
    inviterUserId: viewer.userId,
    inviterEmail: viewer.email,
    inviteEmail,
    partnerUserId,
    now,
  })
  if (existing?.status === 'pending') next.createdAt = existing.createdAt
  return next
}

function rotatedToken(existing: PairRecord | null, next: PairRecord): string | undefined {
  if (existing?.status === 'pending' && existing.inviteToken !== next.inviteToken) return existing.inviteToken
  return undefined
}

async function activatePair(
  store: VoteStore,
  source: PairRecord,
  viewer: PairViewer,
  now: Date,
  viewerPair: PairRecord | null
): Promise<InviteResult> {
  const pairedAt = now.toISOString()
  const next = withPartner(source, { userId: viewer.userId, email: viewer.email, joinedAt: pairedAt }, pairedAt)
  if (viewerPair && viewerPair.id !== source.id) await store.deletePair(viewerPair)
  await store.savePair(next)
  return { ok: true, pair: next }
}

/**
 * First session after the partner verifies this email and can open the watchlist.
 * Binds a pending invite addressed to them. Does nothing if they already have a pair.
 */
export async function claimInviteForMember(
  store: VoteStore,
  viewer: PairViewer,
  now = new Date()
): Promise<PairRecord | null> {
  const existing = await store.getPairForUser(viewer.userId)
  if (existing) return existing
  const pending = await store.getPendingInviteByEmail(viewer.email)
  if (!pending || pending.members.some((member) => member.userId === viewer.userId)) return pending
  const pairedAt = now.toISOString()
  const next = withPartner(pending, { userId: viewer.userId, email: viewer.email, joinedAt: pairedAt }, pairedAt)
  await store.savePair(next)
  return next
}

export async function bindInvite(
  store: VoteStore,
  viewer: PairViewer & { verified: boolean },
  token: string,
  now = new Date()
): Promise<BindDecision & { pair: PairRecord | null }> {
  const pair = await store.getPairByInvite(token)
  const viewerPair = await store.getPairForUser(viewer.userId)
  const decision = decideBind({
    pair,
    viewerUserId: viewer.userId,
    viewerEmail: viewer.verified ? viewer.email : null,
    viewerVerified: viewer.verified,
    viewerPairId: viewerPair?.id ?? null,
  })
  if (decision.kind !== 'bind' || !pair) return { ...decision, pair }
  const pairedAt = now.toISOString()
  const next = withPartner(
    pair,
    { userId: viewer.userId, email: viewer.email, joinedAt: pairedAt },
    pairedAt
  )
  await store.savePair(next)
  return { kind: 'bind', pair: next }
}

export async function removePair(
  store: VoteStore,
  userId: string,
  email?: string | null
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const own = await store.getPairForUser(userId)
  if (own) {
    const involved = own.members.some((member) => member.userId === userId)
    if (!involved) return { ok: false, error: 'You are not in a pair.', status: 404 }
    await store.deletePair(own)
    return { ok: true }
  }
  const pending = email ? await store.getPendingInviteByEmail(email) : null
  const incoming = pending ? null : await store.getIncomingPair(userId)
  const pair = pending ?? incoming
  if (!pair) return { ok: false, error: 'You are not in a pair.', status: 404 }
  const involved =
    pair.inviteEmail === email || pair.partnerUserId === userId || pair.members.some((member) => member.userId === userId)
  if (!involved) return { ok: false, error: 'You are not in a pair.', status: 404 }
  await store.deletePair(pair)
  return { ok: true }
}

export async function loadPairView(store: VoteStore, userId: string): Promise<PairView> {
  const own = await store.getPairForUser(userId)
  if (own?.status === 'active') {
    return {
      status: 'active',
      partnerEmail: partnerEmail(own, userId),
      invitePath: null,
      confirmed: confirmedPair(own),
      pair: own,
    }
  }
  if (own?.status === 'pending') {
    return {
      status: 'pending',
      partnerEmail: own.inviteEmail,
      invitePath: invitePath(own.inviteToken),
      confirmed: null,
      pair: own,
    }
  }
  const incoming = await store.getIncomingPair(userId)
  if (incoming) {
    return {
      status: 'incoming',
      partnerEmail: incoming.members[0]?.email ?? null,
      invitePath: null,
      confirmed: null,
      pair: incoming,
    }
  }
  return { status: 'solo', partnerEmail: null, invitePath: null, confirmed: null, pair: null }
}

/**
 * Optional env bootstrap. When the signed-in address is NYT_TV_NATE_EMAIL and
 * NYT_TV_JEN_EMAIL is set, create one invite for that address. If that account
 * already has access, the pair is active. Otherwise it stays pending until they join.
 */
export async function bootstrapInvite(
  store: VoteStore,
  viewer: PairViewer,
  env: Env = process.env,
  now = new Date(),
  partner: PartnerAccount | null = null
): Promise<PairRecord | null> {
  if (viewer.email !== nateEmail(env)) return null
  const partnerEmail = jenEmail(env)
  if (!partnerEmail || partnerEmail === viewer.email) return null
  const existing = await store.getPairForUser(viewer.userId)
  if (existing) return existing
  const created = await requestPair(store, viewer, partnerEmail, {
    now,
    partner: partner && partner.email === partnerEmail ? partner : null,
  })
  return created.ok ? created.pair : null
}
