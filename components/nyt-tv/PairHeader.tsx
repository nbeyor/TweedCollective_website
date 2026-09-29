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
    <PairHeaderBoundary {...props}>
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
    </PairHeaderBoundary>
  )
}

/**
 * Mobile Chromium throws NotFoundError if React removes a focused or autofilled
 * node during commit. router.refresh() after invite used to unmount the email
 * field and that exception hit the root error boundary, blanking the page
 * including the deck. Other engines that throw on focused-node removal do the
 * same. Keep the failure inside the header.
 */
export class PairHeaderBoundary extends React.Component<
  PairHeaderProps & { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[nyt-tv-100] pair header failed', error)
  }

  render() {
    if (this.state.failed) {
      const { children: _children, ...props } = this.props
      return <PairHeaderFallback {...props} />
    }
    return this.props.children
  }
}

function PairHeaderFallback({ viewerEmail, status, partnerEmail, invitePath }: PairHeaderProps) {
  const title =
    status === 'active' && partnerEmail
      ? `Paired with ${partnerEmail}`
      : status === 'incoming' && partnerEmail
        ? `${partnerEmail} asked to pair`
        : status === 'pending' && partnerEmail
          ? `Waiting for ${partnerEmail} to join`
          : 'Invite your partner'
  const body =
    status === 'pending'
      ? "You're not paired yet. You can swipe now."
      : `You're signed in as ${viewerEmail}. You can swipe now.`
  return (
    <section className="sticky top-0 z-30 shrink-0 border-b border-slate/80 bg-void/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto w-full max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">Your pair</p>
        <h1 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-cream [overflow-wrap:anywhere]">
          {title}
        </h1>
        <p className="mt-1 text-sm leading-snug text-stone">{body}</p>
        {status === 'pending' && invitePath ? (
          <p className="mt-3 break-all font-mono text-xs text-cream">{invitePath}</p>
        ) : null}
      </div>
    </section>
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

  const showPending = status === 'pending' && Boolean(partnerEmail)

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
    <section className="sticky top-0 z-30 shrink-0 border-b border-slate/80 bg-void/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto w-full max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">Your pair</p>
        {status === 'active' && partnerEmail ? (
          <>
            <h1 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-cream [overflow-wrap:anywhere]">
              Paired with {partnerEmail}
            </h1>
            <p className="mt-1 text-sm leading-snug text-stone [overflow-wrap:anywhere]">
              You&apos;re signed in as {viewerEmail}. Swipes stay on your account.
            </p>
            <button
              type="button"
              onClick={() => void unpair()}
              disabled={busy}
              className="mt-2 h-11 rounded-xl border border-slate px-3 text-sm text-stone disabled:opacity-40"
            >
              {busy ? 'Unpairing' : 'Unpair'}
            </button>
          </>
        ) : status === 'incoming' && partnerEmail ? (
          <>
            <h1 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-cream [overflow-wrap:anywhere]">
              {partnerEmail} asked to pair
            </h1>
            <p className="mt-1 text-sm leading-snug text-stone">
              You&apos;re not paired yet. Confirm to share a want list. You can swipe now either way.
            </p>
            <button
              type="button"
              onClick={() => void confirm()}
              disabled={busy}
              className="mt-2 h-11 whitespace-nowrap rounded-xl bg-sage px-4 text-sm font-medium text-cream disabled:opacity-40"
            >
              {busy ? 'Confirming' : 'Confirm'}
            </button>
          </>
        ) : (
          // Solo and pending share this tree, including one email input. Invite
          // success calls router.refresh(), and mobile Chromium throws
          // NotFoundError if that commit removes the focused field. Other
          // browsers that throw on focused-node removal do the same.
          <>
            <h1 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-cream [overflow-wrap:anywhere]">
              {showPending && partnerEmail ? `Waiting for ${partnerEmail} to join` : 'Invite your partner'}
            </h1>
            <p className="mt-1 text-sm leading-snug text-stone [overflow-wrap:anywhere]">
              {showPending ? (
                <>You&apos;re not paired yet. You can swipe now.</>
              ) : (
                <>Enter their email. You&apos;re signed in as {viewerEmail}.</>
              )}
            </p>
            <div className={`mt-2 items-center gap-2 ${showPending ? 'flex' : 'hidden'}`}>
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
                className="h-11 shrink-0 whitespace-nowrap rounded-xl bg-sage px-3 text-sm font-medium text-cream"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <form onSubmit={(event) => void onSubmit(event)} className="mt-2 flex items-center gap-2">
              <label className="sr-only" htmlFor="partner-email">
                {showPending ? 'Different partner email' : 'Partner email'}
              </label>
              <input
                id="partner-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder={showPending ? 'Different email' : 'partner@email.com'}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate bg-carbon px-3 text-sm text-cream placeholder:text-stone"
              />
              <button
                type="submit"
                disabled={busy}
                className={
                  showPending
                    ? 'h-11 shrink-0 whitespace-nowrap rounded-xl border border-slate px-3 text-sm text-stone disabled:opacity-40'
                    : 'h-11 shrink-0 whitespace-nowrap rounded-xl bg-sage px-4 text-sm font-medium text-cream disabled:opacity-40'
                }
              >
                {busy ? (showPending ? 'Updating' : 'Sending') : showPending ? 'Update invite' : 'Invite'}
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
