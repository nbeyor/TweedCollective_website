export const PROFILE_IDS = ['nate', 'jen'] as const

export type ProfileId = (typeof PROFILE_IDS)[number]

export type VoteChoice = 'want' | 'skip'

export type OwnerStatus = 'seen' | 'partial' | 'not_seen' | 'skip' | 'unchecked'

/** One swipe. `dayKey` is the America/Los_Angeles calendar date of `updatedAt`. */
export interface VoteRecord {
  profileId: ProfileId
  showRank: number
  vote: VoteChoice
  updatedAt: string
  dayKey: string
}

export interface DeckShow {
  rank: number
  title: string
  description: string
  /** Nate's prior checklist label. Null for Jen, and for unchecked rows. */
  ownerBadge: string | null
  ownerNotes: string | null
}

export const PROFILE_LABELS: Record<ProfileId, string> = {
  nate: 'Nate',
  jen: 'Jen',
}

export function isProfileId(value: unknown): value is ProfileId {
  return value === 'nate' || value === 'jen'
}

export function isVoteChoice(value: unknown): value is VoteChoice {
  return value === 'want' || value === 'skip'
}
