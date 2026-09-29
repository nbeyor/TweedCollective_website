import pack from '@/content/nyt-tv-100/shows.json'

import type { DeckShow, OwnerStatus } from './types'

const OWNER_STATUSES = ['seen', 'partial', 'not_seen', 'skip', 'unchecked'] as const

function asOwnerStatus(value: string): OwnerStatus {
  return OWNER_STATUSES.includes(value as OwnerStatus) ? (value as OwnerStatus) : 'unchecked'
}

export interface Show {
  rank: number
  title: string
  description: string
  reviewPro: string
  reviewCon: string
  status: OwnerStatus
  notes: string
}

export const SHOW_PACK = {
  title: pack.title,
  source: pack.source,
  publicListUrl: pack.public_list_url,
  ownerFlagsNote: pack.owner_flags_note,
}

const OWNER_BADGES: Record<Exclude<OwnerStatus, 'unchecked'>, string> = {
  seen: 'Seen',
  partial: 'Partial',
  not_seen: 'Not seen',
  skip: 'Skip',
}

export function allShows(): Show[] {
  return pack.shows.map((show) => ({
    rank: show.rank,
    title: show.title,
    description: show.description,
    reviewPro: show.reviewPro,
    reviewCon: show.reviewCon,
    status: asOwnerStatus(show.status),
    notes: show.notes ?? '',
  }))
}

export function showByRank(rank: number): Show | undefined {
  return allShows().find((show) => show.rank === rank)
}

/**
 * Every show stays in the deck. Nate's checklist is a badge only when
 * `ownerNotes` is true (Nate's admin or verified Tweed address). Cards are
 * never filtered out. A partner's payload omits those fields.
 */
export function deckShows(ownerNotes: boolean): DeckShow[] {
  return allShows()
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((show) => ({
      rank: show.rank,
      title: show.title,
      description: show.description,
      reviewPro: show.reviewPro,
      reviewCon: show.reviewCon,
      ownerBadge: ownerNotes ? ownerBadge(show.status) : null,
      ownerNotes: ownerNotes && show.notes.trim() ? show.notes.trim() : null,
    }))
}

/**
 * Fisher–Yates copy of a deck. `deckShows` stays in NYT rank order so badges
 * and digests keep a stable index. The page calls this once per request and
 * passes the result down. SwipeDeck walks that array and skips ranks that
 * already have a vote, so the order holds until the next mount.
 */
export function shuffleDeck<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const next = items.slice()
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const swap = next[i] as T
    next[i] = next[j] as T
    next[j] = swap
  }
  return next
}

function ownerBadge(status: OwnerStatus): string | null {
  if (status === 'unchecked') return null
  return OWNER_BADGES[status]
}
