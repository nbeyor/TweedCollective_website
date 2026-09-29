'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { DeckShow, VoteChoice, VoteRecord } from '@/lib/nyt-tv/types'

interface SwipeDeckProps {
  userId: string
  profileLabel: string
  shows: DeckShow[]
  initialVotes: VoteRecord[]
  persistence: 'blob' | 'file'
  source: string
}

type VoteMap = Record<number, VoteRecord>

function toMap(votes: VoteRecord[]): VoteMap {
  const map: VoteMap = {}
  for (const vote of votes) map[vote.showRank] = vote
  return map
}

export function SwipeDeck({ userId, profileLabel, shows, initialVotes, persistence, source }: SwipeDeckProps) {
  const [votes, setVotes] = useState<VoteMap>(() => toMap(initialVotes))
  const [view, setView] = useState<'deck' | 'list'>('deck')
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [leaving, setLeaving] = useState<VoteChoice | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const busyRef = useRef(false)
  const votesRef = useRef(votes)
  const leaveTimer = useRef<number | null>(null)
  votesRef.current = votes

  const lock = useCallback(() => {
    busyRef.current = true
    setBusy(true)
  }, [])

  const unlock = useCallback(() => {
    busyRef.current = false
    setBusy(false)
  }, [])

  const remaining = shows.filter((show) => !votes[show.rank])
  const current = remaining[0] ?? null
  const wantCount = Object.values(votes).filter((vote) => vote.vote === 'want').length
  const skipCount = Object.values(votes).filter((vote) => vote.vote === 'skip').length
  const latest = Object.values(votes).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0] ?? null

  const reload = useCallback(async () => {
    if (busyRef.current) return
    const res = await fetch('/api/clients/nyt-tv-100/votes')
    if (!res.ok) return
    const body = (await res.json()) as { votes?: VoteRecord[] }
    if (Array.isArray(body.votes)) setVotes(toMap(body.votes))
  }, [])

  useEffect(() => {
    const onFocus = () => {
      void reload()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  const save = useCallback(
    async (rank: number, vote: VoteChoice) => {
      setError(null)
      setLeaving(null)
      setDx(0)
      const previous = votesRef.current[rank]
      setVotes((currentVotes) => ({
        ...currentVotes,
        [rank]: {
          userId,
          showRank: rank,
          vote,
          updatedAt: new Date().toISOString(),
          dayKey: '',
        },
      }))
      try {
        const res = await fetch('/api/clients/nyt-tv-100/votes', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ showRank: rank, vote }),
        })
        if (!res.ok) throw new Error('Could not save that swipe.')
        const body = (await res.json()) as { vote: VoteRecord }
        setVotes((currentVotes) => ({ ...currentVotes, [rank]: body.vote }))
      } catch (err) {
        setVotes((currentVotes) => {
          const next = { ...currentVotes }
          if (previous) next[rank] = previous
          else delete next[rank]
          return next
        })
        setError(err instanceof Error ? err.message : 'Could not save that swipe.')
      } finally {
        unlock()
      }
    },
    [unlock, userId]
  )

  const undo = useCallback(async (rank?: number) => {
    const target =
      rank ?? Object.values(votesRef.current).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0]?.showRank
    if (!target || busyRef.current) return
    const previous = votesRef.current[target]
    if (!previous) return
    lock()
    setError(null)
    setVotes((currentVotes) => {
      const next = { ...currentVotes }
      delete next[target]
      return next
    })
    try {
      const res = await fetch(`/api/clients/nyt-tv-100/votes?rank=${target}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Could not undo that swipe.')
    } catch (err) {
      setVotes((currentVotes) => ({ ...currentVotes, [target]: previous }))
      setError(err instanceof Error ? err.message : 'Could not undo that swipe.')
    } finally {
      unlock()
    }
  }, [lock, unlock])

  const choose = useCallback(
    (vote: VoteChoice) => {
      if (!current || busyRef.current || leaving) return
      lock()
      setLeaving(vote)
      const rank = current.rank
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
      leaveTimer.current = window.setTimeout(() => {
        leaveTimer.current = null
        void save(rank, vote)
      }, 190)
    },
    [current, leaving, lock, save]
  )

  useEffect(() => {
    return () => {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
    }
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        choose('want')
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        choose('skip')
      } else if (event.key === 'Backspace' || event.key === 'u') {
        event.preventDefault()
        void undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choose, undo])

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (busy || leaving || !current) return
    dragStart.current = { x: event.clientX, y: event.clientY }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !dragStart.current) return
    setDx(event.clientX - dragStart.current.x)
  }

  function onPointerUp() {
    if (!dragging) return
    setDragging(false)
    dragStart.current = null
    if (dx > 96) choose('want')
    else if (dx < -96) choose('skip')
    else setDx(0)
  }

  const transform = leaving
    ? `translateX(${leaving === 'want' ? 130 : -130}%) rotate(${leaving === 'want' ? 16 : -16}deg)`
    : `translateX(${dx}px) rotate(${dx / 18}deg)`

  const wants = Object.values(votes)
    .filter((vote) => vote.vote === 'want')
    .sort((a, b) => a.showRank - b.showRank)
  const skips = Object.values(votes)
    .filter((vote) => vote.vote === 'skip')
    .sort((a, b) => a.showRank - b.showRank)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">NYT 100</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-cream">Watch together</h1>
          <p className="mt-1 text-sm text-stone">Swipe right to want it, left to skip.</p>
        </div>
        <span className="shrink-0 rounded-full border border-sage/40 bg-sage/15 px-3 py-1 text-sm text-sage-light">
          {profileLabel}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-stone">
        <p>
          <span className="text-cream">{remaining.length}</span> left
          <span className="mx-2 text-zinc">·</span>
          <span className="text-sage-light">{wantCount} want</span>
          <span className="mx-2 text-zinc">·</span>
          <span className="text-rust">{skipCount} skip</span>
        </p>
        <div className="flex rounded-full border border-slate bg-carbon p-0.5">
          <button
            type="button"
            onClick={() => setView('deck')}
            className={`rounded-full px-3 py-1 text-xs ${view === 'deck' ? 'bg-slate text-cream' : 'text-stone'}`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`rounded-full px-3 py-1 text-xs ${view === 'list' ? 'bg-slate text-cream' : 'text-stone'}`}
          >
            Your list
          </button>
        </div>
      </div>

      <div
        className="mb-4 h-1 overflow-hidden rounded-full bg-slate"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={shows.length}
        aria-valuenow={shows.length - remaining.length}
        aria-label="Shows reviewed"
      >
        <div
          className="h-full bg-sage-bright transition-all"
          style={{ width: `${shows.length === 0 ? 0 : ((shows.length - remaining.length) / shows.length) * 100}%` }}
        />
      </div>

      {persistence === 'file' && (
        <p className="mb-4 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs leading-relaxed text-gold-light">
          Swipes are on this server&apos;s disk only. Set <span className="font-mono">BLOB_READ_WRITE_TOKEN</span> so
          they follow you across devices.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-cream" role="alert">
          {error}
        </p>
      )}

      {view === 'deck' ? (
        <div className="relative mx-auto h-[min(560px,calc(100dvh-15rem))] min-h-[420px] w-full max-w-md">
          <div className="absolute inset-x-3 top-3 bottom-2 rounded-3xl border border-slate bg-graphite" />
          {current ? (
            <div
              className="absolute inset-0 touch-none select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <article
                className="flex h-full cursor-grab flex-col justify-between rounded-3xl border border-pearl/80 bg-cream px-6 py-6 text-charcoal shadow-2xl active:cursor-grabbing"
                style={{
                  transform,
                  transition: dragging ? 'none' : 'transform 180ms ease',
                }}
                aria-labelledby="nyt-card-title"
              >
                <div className="min-h-0">
                  <div className="flex items-start justify-between gap-3">
                    <h2 id="nyt-card-title" className="text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-charcoal">
                      {current.title}
                    </h2>
                    {current.ownerBadge && (
                      <span className="mt-1 shrink-0 rounded-full bg-sage/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-sage">
                        {current.ownerBadge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-sage">#{current.rank}</p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{current.description}</p>
                  <dl className="mt-4 space-y-2.5 border-t border-charcoal/10 pt-4">
                    <div className="grid grid-cols-[2.5rem_1fr] gap-x-2">
                      <dt className="pt-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-sage">Pro</dt>
                      <dd className="text-sm leading-snug text-charcoal/90">{current.reviewPro}</dd>
                    </div>
                    <div className="grid grid-cols-[2.5rem_1fr] gap-x-2">
                      <dt className="pt-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-rust">Con</dt>
                      <dd className="text-sm leading-snug text-charcoal/90">{current.reviewCon}</dd>
                    </div>
                  </dl>
                  {current.ownerNotes && <p className="mt-4 text-sm italic text-charcoal/60">{current.ownerNotes}</p>}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em]">
                  <span className={dx < -24 ? 'text-rust' : 'text-charcoal/35'}>Skip</span>
                  <span className={dx > 24 ? 'text-sage' : 'text-charcoal/35'}>Want</span>
                </div>
              </article>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-slate bg-graphite px-6 text-center">
              <p className="text-lg text-cream">You&apos;re through the list.</p>
              <p className="mt-2 text-sm text-stone">
                {wantCount} want, {skipCount} skip. Undo anything from your list.
              </p>
            </div>
          )}
          <p className="sr-only" aria-live="polite">
            {current
              ? `${current.title}. Rank ${current.rank}. ${current.description} Pro: ${current.reviewPro} Con: ${current.reviewCon}`
              : 'All shows reviewed.'}
          </p>
        </div>
      ) : (
        <VoteList wants={wants} skips={skips} shows={shows} onUndo={(rank) => void undo(rank)} disabled={busy} />
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => choose('skip')}
          disabled={!current || busy || view !== 'deck'}
          className="h-14 rounded-2xl border border-rust/50 bg-rust/15 text-sm font-medium text-cream disabled:opacity-40"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => void undo()}
          disabled={!latest || busy}
          className="h-14 rounded-2xl border border-slate bg-carbon text-sm text-stone disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => choose('want')}
          disabled={!current || busy || view !== 'deck'}
          className="h-14 rounded-2xl bg-sage text-sm font-medium text-cream disabled:opacity-40"
        >
          Want
        </button>
      </div>
      <p className="mt-3 text-center text-[11px] text-stone">Arrow keys work too. U undoes the last swipe.</p>
      <p className="mt-6 text-center text-[11px] leading-relaxed text-stone/80">{source}</p>
    </div>
  )
}

function VoteList({
  wants,
  skips,
  shows,
  onUndo,
  disabled,
}: {
  wants: VoteRecord[]
  skips: VoteRecord[]
  shows: DeckShow[]
  onUndo: (rank: number) => void
  disabled: boolean
}) {
  const byRank = new Map(shows.map((show) => [show.rank, show]))
  return (
    <div className="max-h-[440px] space-y-5 overflow-y-auto pr-1">
      <VoteGroup label="Want" votes={wants} byRank={byRank} onUndo={onUndo} disabled={disabled} />
      <VoteGroup label="Skip" votes={skips} byRank={byRank} onUndo={onUndo} disabled={disabled} />
    </div>
  )
}

function VoteGroup({
  label,
  votes,
  byRank,
  onUndo,
  disabled,
}: {
  label: string
  votes: VoteRecord[]
  byRank: Map<number, DeckShow>
  onUndo: (rank: number) => void
  disabled: boolean
}) {
  return (
    <section>
      <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
        {label} · {votes.length}
      </h2>
      {votes.length === 0 ? (
        <p className="text-sm text-stone">None yet.</p>
      ) : (
        <ul className="space-y-2">
          {votes.map((vote) => {
            const show = byRank.get(vote.showRank)
            return (
              <li key={vote.showRank} className="flex items-center justify-between gap-3 rounded-xl border border-slate bg-carbon px-3 py-2">
                <p className="min-w-0 text-sm text-cream">
                  <span className="font-mono text-xs text-stone">{vote.showRank}. </span>
                  {show?.title ?? 'Show'}
                </p>
                <button
                  type="button"
                  onClick={() => onUndo(vote.showRank)}
                  disabled={disabled}
                  className="shrink-0 text-xs text-stone underline-offset-2 hover:text-cream hover:underline disabled:opacity-40"
                >
                  Undo
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
