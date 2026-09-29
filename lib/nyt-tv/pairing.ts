import { jenEmail, nateEmail } from './access'
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

const UNKNOWN_EMAIL =
  'No one with that email has opened this watchlist yet. Ask them to sign in once, then try again.'

/**
 * Ask to pair with someone who has already opened the watchlist.
 * Same pending request is returned again. If they already asked you, this confirms the pair.
 */
export async function requestPair(
  store: VoteStore,
  viewer: PairViewer,
  rawEmail: string,
  now = new Date()
): Promise<InviteResult> {
  const inviteEmail = normalizeEmail(rawEmail)
  if (!inviteEmail) return { ok: false, error: 'Enter a valid email address.', status: 400 }
  if (inviteEmail === viewer.email) return { ok: false, error: "Enter your partner's email, not your own.", status: 400 }

  const partnerUser = await store.findUserByEmail(inviteEmail)
  if (!partnerUser || partnerUser.userId === viewer.userId) {
    return { ok: false, error: UNKNOWN_EMAIL, status: 404 }
  }

  const viewerPair = await store.getPairForUser(viewer.userId)
  if (viewerPair?.status === 'active') {
    return { ok: false, error: 'You are already paired. Unpair first to choose someone else.', status: 409 }
  }

  const partnerPair = await store.getPairForUser(partnerUser.userId)
  if (partnerPair?.status === 'active') {
    return { ok: false, error: 'That person is already paired with someone else.', status: 409 }
  }

  const incoming = await store.getIncomingPair(viewer.userId)
  const partnerInvitedViewer =
    partnerPair?.status === 'pending' &&
    partnerPair.inviteEmail === viewer.email &&
    partnerPair.members[0]?.userId === partnerUser.userId
  const incomingFromPartner = incoming?.status === 'pending' && incoming.members[0]?.userId === partnerUser.userId

  if (partnerInvitedViewer || incomingFromPartner) {
    const source = partnerInvitedViewer && partnerPair ? partnerPair : incoming
    if (!source) return { ok: false, error: 'That invite is no longer pending.', status: 409 }
    const pairedAt = now.toISOString()
    const next = withPartner(
      source,
      { userId: viewer.userId, email: viewer.email, joinedAt: pairedAt },
      pairedAt
    )
    if (viewerPair && viewerPair.id !== source.id) await store.deletePair(viewerPair)
    await store.savePair(next)
    return { ok: true, pair: next }
  }

  if (incoming) {
    const from = incoming.members[0]?.email ?? 'someone else'
    return {
      ok: false,
      error: `You already have a pair request from ${from}. Confirm or decline it first.`,
      status: 409,
    }
  }

  if (partnerPair?.status === 'pending') {
    return { ok: false, error: 'That person already has a pending pair with someone else.', status: 409 }
  }

  if (viewerPair?.status === 'pending' && viewerPair.inviteEmail === inviteEmail) {
    if (viewerPair.partnerUserId === partnerUser.userId) return { ok: true, pair: viewerPair }
    const next: PairRecord = { ...viewerPair, partnerUserId: partnerUser.userId }
    await store.savePair(next)
    return { ok: true, pair: next }
  }

  if (viewerPair?.status === 'pending') {
    const next = buildPendingPair({
      id: viewerPair.id,
      inviterUserId: viewer.userId,
      inviterEmail: viewer.email,
      inviteEmail,
      partnerUserId: partnerUser.userId,
      now,
    })
    next.createdAt = viewerPair.createdAt
    await store.savePair(next, viewerPair.inviteToken)
    return { ok: true, pair: next }
  }

  const pair = buildPendingPair({
    inviterUserId: viewer.userId,
    inviterEmail: viewer.email,
    inviteEmail,
    partnerUserId: partnerUser.userId,
    now,
  })
  await store.savePair(pair)
  return { ok: true, pair }
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
  userId: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const own = await store.getPairForUser(userId)
  const incoming = own ? null : await store.getIncomingPair(userId)
  const pair = own ?? incoming
  if (!pair) return { ok: false, error: 'You are not in a pair.', status: 404 }
  const involved = pair.members.some((member) => member.userId === userId) || pair.partnerUserId === userId
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
 * Optional env bootstrap. When the signed-in address is NYT_TV_NATE_EMAIL,
 * NYT_TV_JEN_EMAIL is set, and that partner has already opened the watchlist,
 * create one pending invite. It does not bind them.
 */
export async function bootstrapInvite(
  store: VoteStore,
  viewer: PairViewer,
  env: Env = process.env,
  now = new Date()
): Promise<PairRecord | null> {
  if (viewer.email !== nateEmail(env)) return null
  const partner = jenEmail(env)
  if (!partner || partner === viewer.email) return null
  const existing = await store.getPairForUser(viewer.userId)
  if (existing) return existing
  const known = await store.findUserByEmail(partner)
  if (!known) return null
  const created = await requestPair(store, viewer, partner, now)
  return created.ok ? created.pair : null
}
