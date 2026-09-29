import React from 'react'

import type { MatchShow } from '@/lib/nyt-tv/pairs'

export function MatchPanel({
  status,
  partnerEmail,
  shows,
}: {
  status: 'solo' | 'pending' | 'incoming' | 'active'
  partnerEmail: string | null
  shows: MatchShow[]
}) {
  return (
    <section className="mx-auto w-full max-w-lg px-4 pt-6">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">Both want</h2>
      {status === 'active' ? (
        shows.length === 0 ? (
          <p className="mt-2 text-sm text-stone">No overlap yet. Swipes you both mark want show up here.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {shows.map((show) => (
              <li key={show.rank} className="text-sm text-cream">
                {show.rank}. {show.title}
              </li>
            ))}
          </ul>
        )
      ) : status === 'pending' ? (
        <p className="mt-2 text-sm text-stone">
          No shared list until {partnerEmail ?? 'your partner'} joins. You can swipe now.
        </p>
      ) : status === 'incoming' ? (
        <p className="mt-2 text-sm text-stone">Confirm the pair to see what you both want. You can swipe now.</p>
      ) : (
        <p className="mt-2 text-sm text-stone">
          Invite a partner to see what you both want. You can swipe before they join.
        </p>
      )}
    </section>
  )
}
