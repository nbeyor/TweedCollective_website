import { Resend } from 'resend'

import { digestRecipients } from './access'
import { pacificDayKey } from './day'
import { buildDigest, digestHtml, digestText, type Digest, type DigestScope } from './digest'
import { getVoteStore } from './store'

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

export async function composeDigest(scope: DigestScope = 'since-last', now = new Date()): Promise<{
  digest: Digest
  text: string
  html: string
  lastSentAt: string | null
  persistence: 'blob' | 'file'
}> {
  const store = getVoteStore()
  const marker = await store.getDigestSent()
  const votes = await store.listVotes()
  const digest = buildDigest({
    dayKey: pacificDayKey(now),
    generatedAt: now.toISOString(),
    votes,
    lastSentAt: marker?.sentAt ?? null,
    scope,
  })
  return {
    digest,
    text: digestText(digest),
    html: digestHtml(digest),
    lastSentAt: marker?.sentAt ?? null,
    persistence: store.kind,
  }
}

/**
 * Builds the digest and either sends it or logs it.
 * A dry run does not advance the "last sent" marker, so a later real send
 * still includes those swipes. An empty digest is logged and not mailed.
 */
export async function runDigest(options?: { scope?: DigestScope; now?: Date }): Promise<DigestRun> {
  const composed = await composeDigest(options?.scope ?? 'since-last', options?.now ?? new Date())
  const recipients = digestRecipients()
  const base = {
    digest: composed.digest,
    text: composed.text,
    html: composed.html,
    recipients,
    persistence: composed.persistence,
    lastSentAt: composed.lastSentAt,
  }

  console.log(`[nyt-tv-100] digest persistence=${composed.persistence} activity=${composed.digest.activityCount}`)
  console.log(composed.text)

  if (composed.digest.activityCount === 0) {
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
  const result = await resend.emails.send({
    from,
    to: recipients,
    subject: `NYT 100 watchlist — ${composed.digest.dayLabel}`,
    html: composed.html,
    text: composed.text,
  })

  if (result.error) {
    throw new Error(result.error.message || 'Resend rejected the digest')
  }

  const sentAt = new Date().toISOString()
  await getVoteStore().markDigestSent({
    sentAt,
    dayKey: composed.digest.dayKey,
    recipients,
  })

  console.log(`[nyt-tv-100] digest emailed to ${recipients.join(', ')} id=${result.data?.id ?? 'unknown'}`)

  return { ...base, mode: 'sent', reason: 'Emailed.', lastSentAt: sentAt }
}
