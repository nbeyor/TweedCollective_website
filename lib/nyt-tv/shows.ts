import pack from '@/content/nyt-tv-100/shows.json'

import type { DeckShow, OwnerStatus, ProfileId } from './types'

const OWNER_STATUSES = ['seen', 'partial', 'not_seen', 'skip', 'unchecked'] as const

function asOwnerStatus(value: string): OwnerStatus {
  return OWNER_STATUSES.includes(value as OwnerStatus) ? (value as OwnerStatus) : 'unchecked'
}

export interface Show {
  rank: number
  title: string
  description: string
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
    status: asOwnerStatus(show.status),
    notes: show.notes ?? '',
  }))
}

export function showByRank(rank: number): Show | undefined {
  return allShows().find((show) => show.rank === rank)
}

/**
 * Every show stays in the deck. Nate's checklist is a badge on his profile
 * only — cards are never filtered out. Jen's payload omits those fields.
 */
export function deckShows(profileId: ProfileId): DeckShow[] {
  return allShows()
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((show) => ({
      rank: show.rank,
      title: show.title,
      description: show.description,
      ownerBadge: profileId === 'nate' ? ownerBadge(show.status) : null,
      ownerNotes: profileId === 'nate' && show.notes.trim() ? show.notes.trim() : null,
    }))
}

function ownerBadge(status: OwnerStatus): string | null {
  if (status === 'unchecked') return null
  return OWNER_BADGES[status]
}
