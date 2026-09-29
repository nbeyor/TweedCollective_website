import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { PairHeader } from '@/components/nyt-tv/PairHeader'
import { SwipeDeck } from '@/components/nyt-tv/SwipeDeck'
import { lookupViewer } from '@/lib/nyt-tv/access'
import { bootstrapInvite } from '@/lib/nyt-tv/pairing'
import { invitePath, partnerEmail } from '@/lib/nyt-tv/pairs'
import { SHOW_PACK, deckShows, shuffleDeck } from '@/lib/nyt-tv/shows'
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
  const pair = (await store.getPairForUser(viewer.userId)) ?? (await bootstrapInvite(store, viewer))
  const partner = partnerEmail(pair, viewer.userId)
  const status = !pair ? 'solo' : pair.status === 'active' ? 'active' : 'pending'

  return (
    <>
      <PairHeader
        viewerEmail={viewer.email}
        status={status}
        partnerEmail={partner}
        invitePath={pair?.status === 'pending' ? invitePath(pair.inviteToken) : null}
      />
      {pair ? (
        <SwipeDeck
          userId={viewer.userId}
          pairId={pair.id}
          profileLabel={viewer.email}
          shows={shuffleDeck(deckShows(viewer.isOwner))}
          initialVotes={(await store.listVotes(viewer.userId)).filter((vote) => vote.pairId === pair.id)}
          persistence={store.kind}
          source={SHOW_PACK.source}
        />
      ) : (
        <p className="mx-auto max-w-lg px-4 py-10 text-center text-sm leading-relaxed text-stone">
          Create the invite to start swiping. The link is how your partner joins. Your votes save on your account as
          soon as it exists.
        </p>
      )}
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
