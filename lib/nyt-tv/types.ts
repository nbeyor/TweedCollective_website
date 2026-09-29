export type VoteChoice = 'want' | 'skip'

export type OwnerStatus = 'seen' | 'partial' | 'not_seen' | 'skip' | 'unchecked'

/**
 * One swipe. The show is `showRank` (NYT rank, stable). `userId` is the
 * Clerk user, so two people never overwrite each other. `pairId` says which
 * couple the swipe belongs to.
 */
export interface VoteRecord {
  userId: string
  pairId: string
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
