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
  const dragAxis = useRef<'x' | 'y' | null>(null)
  const dxRef = useRef(0)
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
      dxRef.current = 0
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
    dragAxis.current = null
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current || busy || leaving) return
    const x = event.clientX - dragStart.current.x
    const y = event.clientY - dragStart.current.y
    if (!dragAxis.current) {
      if (Math.abs(x) < 8 && Math.abs(y) < 8) return
      dragAxis.current = Math.abs(x) > Math.abs(y) ? 'x' : 'y'
      if (dragAxis.current === 'y') {
        dragStart.current = null
        return
      }
      setDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (dragAxis.current === 'x') {
      dxRef.current = x
      setDx(x)
    }
  }

  function onPointerUp() {
    const horizontal = dragAxis.current === 'x'
    const offset = dxRef.current
    dragAxis.current = null
    dragStart.current = null
    setDragging(false)
    if (!horizontal) return
    if (offset > 96) choose('want')
    else if (offset < -96) choose('skip')
    else {
      dxRef.current = 0
      setDx(0)
    }
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
    <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <p className="sr-only">Signed in as {profileLabel}. Swipe right to want a show, left to skip.</p>
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">NYT 100</p>
        <div className="flex rounded-full border border-slate bg-carbon p-0.5">
          <button
            type="button"
            onClick={() => setView('deck')}
            className={`min-h-11 rounded-full px-3 text-sm ${view === 'deck' ? 'bg-slate text-cream' : 'text-stone'}`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`min-h-11 rounded-full px-3 text-sm ${view === 'list' ? 'bg-slate text-cream' : 'text-stone'}`}
          >
            Your list
          </button>
        </div>
      </div>
      <p className="mb-2 shrink-0 text-sm text-stone">
        <span className="text-cream">{remaining.length}</span> left
        <span className="mx-1.5 text-zinc">·</span>
        <span className="text-sage-light">{wantCount} want</span>
        <span className="mx-1.5 text-zinc">·</span>
        <span className="text-rust">{skipCount} skip</span>
      </p>

      <div
        className="mb-2 h-1 shrink-0 overflow-hidden rounded-full bg-slate"
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
        <p className="mb-2 shrink-0 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs leading-relaxed text-gold-light">
          Swipes are on this server&apos;s disk only. Set <span className="font-mono">BLOB_READ_WRITE_TOKEN</span> so
          they follow you across devices.
        </p>
      )}

      {error && (
        <p className="mb-2 shrink-0 rounded-lg border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-cream" role="alert">
          {error}
        </p>
      )}

      {view === 'deck' ? (
        <div className="relative mx-auto min-h-0 w-full max-w-md flex-1">
          <div className="absolute inset-x-3 top-3 bottom-2 rounded-3xl border border-slate bg-graphite" />
          {current ? (
            <div
              className="absolute inset-0 touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <article
                className="flex h-full min-h-0 cursor-grab flex-col rounded-3xl border border-pearl/80 bg-cream px-5 py-4 text-charcoal shadow-2xl active:cursor-grabbing"
                style={{
                  transform,
                  transition: dragging ? 'none' : 'transform 180ms ease',
                }}
                aria-labelledby="nyt-card-title"
              >
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="flex items-start justify-between gap-3">
                    <h2 id="nyt-card-title" className="text-balance text-2xl font-semibold leading-tight tracking-tight text-charcoal">
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
                <div className="mt-3 flex shrink-0 items-center justify-between text-xs font-medium uppercase tracking-[0.14em]">
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
        <div className="min-h-0 flex-1 overflow-y-auto">
          <VoteList wants={wants} skips={skips} shows={shows} onUndo={(rank) => void undo(rank)} disabled={busy} />
        </div>
      )}

      <div className="mt-3 grid shrink-0 grid-cols-3 gap-3">
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
      <p className="mt-2 shrink-0 text-center text-[10px] leading-snug text-stone/80">{source}</p>
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
    <div className="space-y-5 pr-1">
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
                  className="min-h-11 shrink-0 px-2 text-sm text-stone underline-offset-2 hover:text-cream hover:underline disabled:opacity-40"
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
