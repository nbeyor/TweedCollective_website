import { formatDayKey } from './day'
import { allShows, type Show } from './shows'
import type { VoteChoice, VoteRecord } from './types'

export interface DigestMember {
  userId: string
  label: string
}

export interface DigestLine {
  rank: number
  title: string
  description: string
  vote: VoteChoice
  dayKey: string
  /** Recorded before the current Pacific day — usually a swipe after the previous send. */
  late: boolean
}

export interface ProfileDigest {
  userId: string
  label: string
  wants: DigestLine[]
  skips: DigestLine[]
}

export interface Digest {
  dayKey: string
  dayLabel: string
  generatedAt: string
  profiles: ProfileDigest[]
  bothWanted: DigestLine[]
  activityCount: number
}

export type DigestScope = 'since-last' | 'all'

/**
 * Which swipes belong in this send.
 *
 * - `all`: every stored vote (manual catch-up).
 * - `since-last` with a previous successful send: votes written after that send,
 *   so anything after the 8pm mail still appears the next evening.
 * - `since-last` before any successful send: every swipe so far. Dry runs do not
 *   advance the marker, so turning email on later still includes earlier days.
 */
/** Votes that belong to this couple. Identity is the Clerk user id, not a pair id on the swipe. */
export function votesForMembers(userIds: string[], votes: VoteRecord[]): VoteRecord[] {
  const ids = new Set(userIds)
  return votes.filter((vote) => ids.has(vote.userId))
}

export function voteInDigest(vote: VoteRecord, dayKey: string, lastSentAt: string | null, scope: DigestScope): boolean {
  if (scope === 'all') return true
  if (lastSentAt) return vote.updatedAt > lastSentAt
  return vote.dayKey <= dayKey
}

export function buildDigest(input: {
  dayKey: string
  generatedAt?: string
  votes: VoteRecord[]
  members: DigestMember[]
  lastSentAt?: string | null
  scope?: DigestScope
  shows?: Show[]
}): Digest {
  const dayKey = input.dayKey
  const lastSentAt = input.lastSentAt ?? null
  const scope = input.scope ?? 'since-last'
  const shows = input.shows ?? allShows()
  const byRank = new Map(shows.map((show) => [show.rank, show]))
  const included = input.votes.filter((vote) => voteInDigest(vote, dayKey, lastSentAt, scope))

  const profiles = input.members.map((member) => {
    const lines = included
      .filter((vote) => vote.userId === member.userId)
      .map((vote) => toLine(vote, byRank, dayKey))
      .filter((line): line is DigestLine => line !== null)
      .sort((a, b) => a.rank - b.rank)
    return {
      userId: member.userId,
      label: member.label,
      wants: lines.filter((line) => line.vote === 'want'),
      skips: lines.filter((line) => line.vote === 'skip'),
    }
  })

  const wantSets = profiles.map((profile) => new Set(profile.wants.map((line) => line.rank)))
  const bothWanted =
    profiles.length >= 2
      ? profiles[0].wants.filter((line) => wantSets.every((set) => set.has(line.rank)))
      : []

  const activityCount = profiles.reduce((sum, profile) => sum + profile.wants.length + profile.skips.length, 0)

  return {
    dayKey,
    dayLabel: formatDayKey(dayKey),
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    profiles,
    bothWanted,
    activityCount,
  }
}

function toLine(vote: VoteRecord, byRank: Map<number, Show>, dayKey: string): DigestLine | null {
  const show = byRank.get(vote.showRank)
  if (!show) return null
  return {
    rank: show.rank,
    title: show.title,
    description: show.description,
    vote: vote.vote,
    dayKey: vote.dayKey,
    late: vote.dayKey < dayKey,
  }
}

export function digestText(digest: Digest): string {
  const lines: string[] = [`NYT 100 watchlist — ${digest.dayLabel}`, '']

  if (digest.activityCount === 0) {
    lines.push('No swipes in this digest.')
    return lines.join('\n')
  }

  lines.push('Both wanted')
  if (digest.bothWanted.length === 0) {
    lines.push('  None yet.')
  } else {
    for (const line of digest.bothWanted) lines.push(`  ${formatLine(line)}`)
  }
  lines.push('')

  for (const profile of digest.profiles) {
    lines.push(`${profile.label} — ${profile.wants.length} want, ${profile.skips.length} skip`)
    lines.push('  Want')
    lines.push(...section(profile.wants))
    lines.push('  Skip')
    lines.push(...section(profile.skips))
    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

function section(lines: DigestLine[]): string[] {
  if (lines.length === 0) return ['    None.']
  return lines.map((line) => `    ${formatLine(line)}`)
}

function formatLine(line: DigestLine): string {
  const late = line.late ? ' (after the previous digest)' : ''
  return `${line.rank}. ${line.title} — ${line.description}${late}`
}

export function digestHtml(digest: Digest): string {
  const both =
    digest.bothWanted.length === 0
      ? '<p style="color:#6b6b66;margin:0;">None yet.</p>'
      : `<ul style="margin:0;padding-left:18px;">${digest.bothWanted.map(htmlItem).join('')}</ul>`

  const profiles = digest.profiles
    .map((profile) => {
      return `
        <h2 style="font-size:16px;margin:28px 0 8px;color:#1a1a1a;">${esc(profile.label)} — ${profile.wants.length} want, ${profile.skips.length} skip</h2>
        <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#4A5D4C;">Want</p>
        ${htmlList(profile.wants)}
        <p style="margin:16px 0 4px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#9C6B5C;">Skip</p>
        ${htmlList(profile.skips)}
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f4f0;">
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:32px 20px;color:#1a1a1a;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#4A5D4C;">Tweed Collective</p>
    <h1 style="font-size:24px;font-weight:600;margin:0 0 8px;">NYT 100 watchlist — ${esc(digest.dayLabel)}</h1>
    <p style="margin:0 0 24px;color:#6b6b66;font-size:14px;">Right is want, left is skip. These are the swipes not included in a previous email.</p>
    <h2 style="font-size:16px;margin:0 0 8px;">Both wanted</h2>
    ${both}
    ${profiles}
  </div>
</body>
</html>`
}

function htmlList(lines: DigestLine[]): string {
  if (lines.length === 0) return '<p style="color:#6b6b66;margin:0;">None.</p>'
  return `<ul style="margin:0;padding-left:18px;">${lines.map(htmlItem).join('')}</ul>`
}

function htmlItem(line: DigestLine): string {
  const late = line.late ? ' <span style="color:#9a9890;">(after the previous digest)</span>' : ''
  return `<li style="margin:0 0 8px;"><strong>${line.rank}. ${esc(line.title)}</strong> — ${esc(line.description)}${late}</li>`
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
