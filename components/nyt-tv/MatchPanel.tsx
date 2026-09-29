'use client'

import React, { useState } from 'react'

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
  const [open, setOpen] = useState(false)
  if (status !== 'active' || shows.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-lg shrink-0 px-4 pt-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-full items-center rounded-xl border border-slate bg-carbon px-3 text-left text-sm text-cream"
      >
        <span className="min-w-0 flex-1 truncate">Both want · {shows.length}</span>
        <span className="ml-2 shrink-0 text-xs text-sage-light">{open ? 'Close' : 'Details'}</span>
      </button>
      <div className={open ? 'mt-2' : 'hidden'}>
        <p className="sr-only">
          Shared with {partnerEmail ?? 'your partner'}.
        </p>
        <ul className="space-y-1">
          {shows.map((show) => (
            <li key={show.rank} className="text-sm text-cream">
              {show.rank}. {show.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
