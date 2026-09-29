'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type PairHeaderStatus = 'solo' | 'pending' | 'incoming' | 'active'

export interface PairHeaderProps {
  viewerEmail: string
  status: PairHeaderStatus
  partnerEmail: string | null
  invitePath: string | null
}

export function PairHeader(props: PairHeaderProps) {
  const router = useRouter()

  async function postEmail(email: string) {
    const res = await fetch('/api/clients/nyt-tv-100/pair', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    if (!res.ok) throw new Error(body?.error || 'Could not pair with that email.')
    router.refresh()
  }

  return (
    <PairHeaderView
      {...props}
      onCreate={postEmail}
      onUnpair={async () => {
        const res = await fetch('/api/clients/nyt-tv-100/pair', { method: 'DELETE' })
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        if (!res.ok) throw new Error(body?.error || 'Could not unpair.')
        router.refresh()
      }}
    />
  )
}

export function PairHeaderView({
  viewerEmail,
  status,
  partnerEmail,
  invitePath,
  onCreate,
  onUnpair,
}: PairHeaderProps & {
  onCreate: (email: string) => Promise<void>
  onUnpair: () => Promise<void>
}) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [link, setLink] = useState(invitePath ?? '')

  useEffect(() => {
    if (!invitePath) {
      setLink('')
      return
    }
    setLink(`${window.location.origin}${invitePath}`)
  }, [invitePath])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await onCreate(email)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not pair with that email.')
    } finally {
      setBusy(false)
    }
  }

  async function confirm() {
    if (busy || !partnerEmail) return
    setBusy(true)
    setError(null)
    try {
      await onCreate(partnerEmail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm that pair.')
    } finally {
      setBusy(false)
    }
  }

  async function unpair() {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await onUnpair()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not unpair.')
    } finally {
      setBusy(false)
    }
  }

  async function copyLink() {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      setCopied(false)
      setError('Could not copy. Select the link and copy it.')
    }
  }

  return (
    <section className="sticky top-0 z-30 border-b border-slate/80 bg-void/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto w-full max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">Your pair</p>
        {status === 'active' && partnerEmail ? (
          <>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-cream">Paired with {partnerEmail}</h1>
            <p className="mt-1 text-sm text-stone">You&apos;re signed in as {viewerEmail}. Swipes stay on your account.</p>
            <button
              type="button"
              onClick={() => void unpair()}
              disabled={busy}
              className="mt-3 h-10 rounded-xl border border-slate px-3 text-sm text-stone disabled:opacity-40"
            >
              {busy ? 'Unpairing' : 'Unpair'}
            </button>
          </>
        ) : status === 'incoming' && partnerEmail ? (
          <>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-cream">{partnerEmail} asked to pair</h1>
            <p className="mt-1 text-sm text-stone">
              You&apos;re not paired yet. Confirm to share a want list. You can swipe now either way.
            </p>
            <button
              type="button"
              onClick={() => void confirm()}
              disabled={busy}
              className="mt-3 h-11 rounded-xl bg-sage px-4 text-sm font-medium text-cream disabled:opacity-40"
            >
              {busy ? 'Confirming' : 'Confirm'}
            </button>
          </>
        ) : status === 'pending' && partnerEmail ? (
          <>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-cream">Waiting for {partnerEmail} to join</h1>
            <p className="mt-1 text-sm text-stone">
              You&apos;re not paired yet. The pair starts on their first visit after they verify this email and have
              access. You can swipe now.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                value={link}
                aria-label="Invite link"
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate bg-carbon px-3 font-mono text-xs text-cream"
                onFocus={(event) => event.currentTarget.select()}
              />
              <button
                type="button"
                onClick={() => void copyLink()}
                className="h-11 shrink-0 rounded-xl bg-sage px-4 text-sm font-medium text-cream"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <form onSubmit={(event) => void onSubmit(event)} className="mt-3 flex items-center gap-2">
              <label className="sr-only" htmlFor="replace-partner-email">
                Different partner email
              </label>
              <input
                id="replace-partner-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="Different email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 min-w-0 flex-1 rounded-xl border border-slate bg-carbon px-3 text-sm text-cream placeholder:text-stone"
              />
              <button
                type="submit"
                disabled={busy}
                className="h-10 shrink-0 rounded-xl border border-slate px-3 text-sm text-stone disabled:opacity-40"
              >
                {busy ? 'Updating' : 'Update invite'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-cream">Invite your partner</h1>
            <p className="mt-1 text-sm text-stone">
              Enter their email. If they already have access, you are paired now. Otherwise this waits until they join.
              You&apos;re signed in as {viewerEmail}.
            </p>
            <form onSubmit={(event) => void onSubmit(event)} className="mt-3 flex items-center gap-2">
              <label className="sr-only" htmlFor="partner-email">
                Partner email
              </label>
              <input
                id="partner-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="partner@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate bg-carbon px-3 text-sm text-cream placeholder:text-stone"
              />
              <button
                type="submit"
                disabled={busy}
                className="h-11 shrink-0 rounded-xl bg-sage px-4 text-sm font-medium text-cream disabled:opacity-40"
              >
                {busy ? 'Sending' : 'Invite'}
              </button>
            </form>
          </>
        )}
        {error && (
          <p className="mt-3 text-sm text-cream" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
