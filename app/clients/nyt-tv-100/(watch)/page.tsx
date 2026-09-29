import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { MatchPanel } from '@/components/nyt-tv/MatchPanel'
import { PairHeader } from '@/components/nyt-tv/PairHeader'
import { SwipeDeck } from '@/components/nyt-tv/SwipeDeck'
import { lookupViewer } from '@/lib/nyt-tv/access'
import { bootstrapInvite, loadPairView } from '@/lib/nyt-tv/pairing'
import { wantOverlap } from '@/lib/nyt-tv/pairs'
import { SHOW_PACK, allShows, deckShows, shuffleDeck } from '@/lib/nyt-tv/shows'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const metadata: Metadata = {
  title: 'NYT 100 watchlist',
  description: 'Swipe the NYT 100 best TV shows of the 21st century.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function NytTvPage() {
  const lookup = await lookupViewer()
  if (lookup.status === 'signed-out') {
    redirect('/sign-in?redirect_url=%2Fclients%2Fnyt-tv-100')
  }
  if (lookup.status === 'unverified') {
    return (
      <Gate
        title="Verify your email"
        body={`You're signed in as ${lookup.email ?? 'this account'}. Open the verification message from Clerk, then refresh. Pairing uses that verified address.`}
      />
    )
  }

  const { viewer } = lookup
  const store = getVoteStore()
  await store.rememberUser({
    userId: viewer.userId,
    email: viewer.email,
    seenAt: new Date().toISOString(),
  })
  await bootstrapInvite(store, viewer)
  const view = await loadPairView(store, viewer.userId)
  const myVotes = await store.listVotes(viewer.userId)
  const partnerId = view.pair?.members.find((member) => member.userId !== viewer.userId)?.userId
  const matches =
    view.status === 'active' && partnerId
      ? wantOverlap(myVotes, await store.listVotes(partnerId), allShows())
      : []

  return (
    <>
      <PairHeader
        viewerEmail={viewer.email}
        status={view.status}
        partnerEmail={view.partnerEmail}
        invitePath={view.invitePath}
      />
      <MatchPanel status={view.status} partnerEmail={view.partnerEmail} shows={matches} />
      <SwipeDeck
        userId={viewer.userId}
        profileLabel={viewer.email}
        shows={shuffleDeck(deckShows(viewer.isOwner))}
        initialVotes={myVotes}
        persistence={store.kind}
        source={SHOW_PACK.source}
      />
    </>
  )
}

function Gate({ title, body }: { title: string; body: string }) {
  return (
    <div className="container mx-auto max-w-xl px-6 py-16">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">Your pair</p>
      <h1 className="mb-4 text-3xl font-semibold text-cream">{title}</h1>
      <p className="text-stone">{body}</p>
    </div>
  )
}
