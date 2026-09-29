import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

import { SwipeDeck } from '@/components/nyt-tv/SwipeDeck'
import { nytTvSession } from '@/lib/nyt-tv/access'
import { SHOW_PACK, deckShows } from '@/lib/nyt-tv/shows'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const metadata: Metadata = {
  title: 'NYT 100 watchlist',
  description: 'Swipe the NYT 100 best TV shows of the 21st century.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function NytTvPage() {
  const session = await nytTvSession()
  if (session.status === 'signed-out') {
    redirect('/sign-in?redirect_url=%2Fclients%2Fnyt-tv-100')
  }
  if (session.status !== 'ok') {
    return <Gate status={session.status} email={session.email} />
  }

  const store = getVoteStore()
  const votes = await store.listVotes(session.profileId)
  const shows = deckShows(session.profileId)

  return (
    <SwipeDeck
      profileId={session.profileId}
      profileLabel={session.label}
      shows={shows}
      initialVotes={votes}
      persistence={store.kind}
      source={SHOW_PACK.source}
    />
  )
}

function Gate({ status, email }: { status: 'unverified' | 'denied'; email: string | null }) {
  const address = email ?? 'this account'
  return (
    <div className="container mx-auto max-w-xl px-6 py-16">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">NYT 100</p>
      <h1 className="mb-4 text-3xl font-semibold text-cream">
        {status === 'unverified' ? 'Verify your email' : 'This watchlist is for Nate and Jen'}
      </h1>
      {status === 'unverified' ? (
        <p className="mb-6 text-stone">
          You&apos;re signed in as <span className="font-mono text-sm text-sage-light">{address}</span>. Open the
          verification message from Clerk, then refresh this page.
        </p>
      ) : (
        <p className="mb-6 text-stone">
          You&apos;re signed in as <span className="font-mono text-sm text-sage-light">{address}</span>. That address
          isn&apos;t on the list. If you&apos;re Jen, Nate needs to set{' '}
          <span className="font-mono text-sm text-cream">NYT_TV_JEN_EMAIL</span> to this exact address, then you can
          refresh.
        </p>
      )}
      <SignOutButton redirectUrl="/sign-in?redirect_url=%2Fclients%2Fnyt-tv-100">
        <button type="button" className="btn-outline">
          Sign out &amp; switch account
        </button>
      </SignOutButton>
    </div>
  )
}
