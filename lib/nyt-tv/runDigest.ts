import { Resend } from 'resend'

import { pacificDayKey } from './day'
import { buildDigest, digestHtml, digestText, votesForMembers, type Digest, type DigestScope } from './digest'
import type { PairRecord } from './pairs'
import { getVoteStore, type VoteStore } from './store'

export interface DigestRun {
  digest: Digest
  text: string
  html: string
  mode: 'sent' | 'dry-run' | 'skipped'
  reason: string
  recipients: string[]
  persistence: 'blob' | 'file'
  lastSentAt: string | null
}

interface PairBundle {
  pairId: string
  digest: Digest
  text: string
  html: string
  recipients: string[]
}

export function digestSendEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.NYT_TV_DIGEST_SEND === 'true' && Boolean(env.RESEND_API_KEY?.trim())
}

export function digestDryRunReason(env: Record<string, string | undefined> = process.env): string | null {
  if (env.NYT_TV_DIGEST_SEND !== 'true') {
    return 'NYT_TV_DIGEST_SEND is not "true". Digest was logged and not emailed.'
  }
  if (!env.RESEND_API_KEY?.trim()) {
    return 'RESEND_API_KEY is missing. Digest was logged and not emailed.'
  }
  return null
}

function bundleFor(pair: PairRecord, votes: Awaited<ReturnType<VoteStore['listVotes']>>, scope: DigestScope, now: Date, lastSentAt: string | null): PairBundle {
  const digest = buildDigest({
    dayKey: pacificDayKey(now),
    generatedAt: now.toISOString(),
    votes: votesForMembers(
      pair.members.map((member) => member.userId),
      votes
    ),
    members: pair.members.map((member) => ({ userId: member.userId, label: member.email })),
    lastSentAt,
    scope,
  })
  return {
    pairId: pair.id,
    digest,
    text: digestText(digest),
    html: digestHtml(digest),
    recipients: pair.members.map((member) => member.email),
  }
}

export async function composeDigestForPair(
  pair: PairRecord | null,
  scope: DigestScope = 'since-last',
  now = new Date()
): Promise<{
  digest: Digest
  text: string
  html: string
  recipients: string[]
  lastSentAt: string | null
  persistence: 'blob' | 'file'
}> {
  const store = getVoteStore()
  const marker = await store.getDigestSent()
  const lastSentAt = marker?.sentAt ?? null
  if (!pair) {
    const digest = buildDigest({
      dayKey: pacificDayKey(now),
      generatedAt: now.toISOString(),
      votes: [],
      members: [],
      lastSentAt,
      scope,
    })
    return {
      digest,
      text: digestText(digest),
      html: digestHtml(digest),
      recipients: [],
      lastSentAt,
      persistence: store.kind,
    }
  }
  const votes = await store.listVotes()
  const bundle = bundleFor(pair, votes, scope, now, lastSentAt)
  return { ...bundle, lastSentAt, persistence: store.kind }
}

/**
 * One email per couple, only to that couple. A dry run does not advance the
 * sent marker. No swipes means nothing is mailed.
 */
export async function runDigest(options?: { scope?: DigestScope; now?: Date }): Promise<DigestRun> {
  const store = getVoteStore()
  const now = options?.now ?? new Date()
  const scope = options?.scope ?? 'since-last'
  const marker = await store.getDigestSent()
  const lastSentAt = marker?.sentAt ?? null
  const [pairs, votes] = await Promise.all([store.listPairs(), store.listVotes()])
  const bundles = pairs
    .filter((pair) => pair.status === 'active')
    .map((pair) => bundleFor(pair, votes, scope, now, lastSentAt))
    .filter((bundle) => bundle.digest.activityCount > 0)

  const text = bundles.map((bundle) => bundle.text).join('\n\n') || 'No swipes in this digest.'
  const html = bundles.map((bundle) => bundle.html).join('\n')
  const recipients = Array.from(new Set(bundles.flatMap((bundle) => bundle.recipients)))
  const activityCount = bundles.reduce((sum, bundle) => sum + bundle.digest.activityCount, 0)
  const first = bundles[0]?.digest
  const digest: Digest = first
    ? {
        ...first,
        profiles: bundles.flatMap((bundle) => bundle.digest.profiles),
        bothWanted: bundles.length === 1 ? first.bothWanted : [],
        activityCount,
      }
    : buildDigest({
        dayKey: pacificDayKey(now),
        generatedAt: now.toISOString(),
        votes: [],
        members: [],
        lastSentAt,
        scope,
      })

  const base = {
    digest,
    text,
    html,
    recipients,
    persistence: store.kind,
    lastSentAt,
  }

  console.log(`[nyt-tv-100] digest persistence=${store.kind} pairs=${bundles.length} activity=${digest.activityCount}`)
  console.log(text)

  if (digest.activityCount === 0) {
    return { ...base, mode: 'skipped', reason: 'No swipes in this digest. Nothing was emailed.' }
  }

  const dryReason = digestDryRunReason()
  if (dryReason || recipients.length === 0) {
    return {
      ...base,
      mode: 'dry-run',
      reason: dryReason ?? 'No recipient addresses are configured.',
    }
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'Tweed Collective <onboarding@resend.dev>'
  const resend = new Resend(process.env.RESEND_API_KEY)
  const sentRecipients: string[] = []
  for (const bundle of bundles) {
    if (bundle.recipients.length === 0) continue
    const result = await resend.emails.send({
      from,
      to: bundle.recipients,
      subject: `NYT 100 watchlist — ${bundle.digest.dayLabel}`,
      html: bundle.html,
      text: bundle.text,
    })
    if (result.error) {
      throw new Error(result.error.message || 'Resend rejected the digest')
    }
    sentRecipients.push(...bundle.recipients)
    console.log(`[nyt-tv-100] digest emailed pair=${bundle.pairId} to ${bundle.recipients.join(', ')} id=${result.data?.id ?? 'unknown'}`)
  }

  const sentAt = new Date().toISOString()
  await store.markDigestSent({
    sentAt,
    dayKey: digest.dayKey,
    recipients: sentRecipients,
  })

  return { ...base, recipients: sentRecipients, mode: 'sent', reason: 'Emailed.', lastSentAt: sentAt }
}
