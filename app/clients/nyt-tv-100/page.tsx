import React from 'react'
import type { Metadata } from 'next'

import { SwipeDeck } from '@/components/nyt-tv/SwipeDeck'
import { nytTvProfile } from '@/lib/nyt-tv/access'
import { SHOW_PACK, deckShows } from '@/lib/nyt-tv/shows'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const metadata: Metadata = {
  title: 'NYT 100 watchlist',
  description: 'Swipe the NYT 100 best TV shows of the 21st century.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function NytTvPage() {
  const profile = await nytTvProfile()
  if (!profile) {
    return (
      <div className="container mx-auto max-w-xl px-6 py-16">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">NYT 100</p>
        <h1 className="mb-4 text-3xl font-semibold text-cream">Watchlist profile unavailable</h1>
        <p className="text-stone">
          You&apos;re signed in, but this deck couldn&apos;t tell which person you are. Refresh, or ask Nate to check
          the workspace grant.
        </p>
      </div>
    )
  }

  const store = getVoteStore()
  const votes = await store.listVotes(profile.profileId)
  const shows = deckShows(profile.profileId)

  return (
    <SwipeDeck
      profileId={profile.profileId}
      profileLabel={profile.label}
      shows={shows}
      initialVotes={votes}
      persistence={store.kind}
      source={SHOW_PACK.source}
    />
  )
}
