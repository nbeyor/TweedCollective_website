export type VoteChoice = 'want' | 'skip'

export type OwnerStatus = 'seen' | 'partial' | 'not_seen' | 'skip' | 'unchecked'

/**
 * One swipe on the signed-in Clerk account. The show is `showRank`
 * (NYT rank, stable). Pairing does not move or copy these rows.
 */
export interface VoteRecord {
  userId: string
  showRank: number
  vote: VoteChoice
  updatedAt: string
  dayKey: string
}

export interface DeckShow {
  rank: number
  title: string
  description: string
  /** One-line case for watching. */
  reviewPro: string
  /** One-line case for skipping. */
  reviewCon: string
  /** Nate's checklist label. Null for everyone else, and for unchecked rows. */
  ownerBadge: string | null
  ownerNotes: string | null
}

export function isVoteChoice(value: unknown): value is VoteChoice {
  return value === 'want' || value === 'skip'
}
