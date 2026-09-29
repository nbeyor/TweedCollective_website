import { jenEmail, nateEmail } from './access'
import { buildPendingPair, decideBind, newInviteToken, normalizeEmail, withPartner, type BindDecision, type PairRecord } from './pairs'
import type { VoteStore } from './store'

export interface PairViewer {
  userId: string
  email: string
}

type Env = Record<string, string | undefined>

export type InviteResult = { ok: true; pair: PairRecord } | { ok: false; error: string; status: number }

export async function createOrUpdateInvite(
  store: VoteStore,
  viewer: PairViewer,
  rawEmail: string,
  now = new Date()
): Promise<InviteResult> {
  const inviteEmail = normalizeEmail(rawEmail)
  if (!inviteEmail) return { ok: false, error: 'Enter a valid email address.', status: 400 }
  if (inviteEmail === viewer.email) return { ok: false, error: 'Invite your partner, not yourself.', status: 400 }

  const existing = await store.getPairForUser(viewer.userId)
  if (existing?.status === 'active') {
    return { ok: false, error: 'You are already paired.', status: 409 }
  }
  if (existing && existing.inviteEmail === inviteEmail) {
    return { ok: true, pair: existing }
  }
  if (existing) {
    const previousToken = existing.inviteToken
    const next: PairRecord = {
      ...existing,
      inviteEmail,
      inviteToken: newInviteToken(),
      status: 'pending',
    }
    await store.savePair(next, previousToken)
    return { ok: true, pair: next }
  }

  const pair = buildPendingPair({
    inviterUserId: viewer.userId,
    inviterEmail: viewer.email,
    inviteEmail,
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
  const next = withPartner(pair, {
    userId: viewer.userId,
    email: viewer.email,
    joinedAt: now.toISOString(),
  })
  await store.savePair(next)
  return { kind: 'bind', pair: next }
}

/**
 * Optional env bootstrap. When the signed-in address is NYT_TV_NATE_EMAIL and
 * NYT_TV_JEN_EMAIL is set, create one pending invite. It does not bind Jen;
 * she still has to open the link.
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
  const created = await createOrUpdateInvite(store, viewer, partner, now)
  return created.ok ? created.pair : null
}
