'use client'

import { useEffect } from 'react'

/**
 * Self-healing companion for the access-denied page.
 *
 * The server guard occasionally denies the first request after sign-in even
 * though the grant exists — the auth state it evaluated was stale, and simply
 * navigating again (users discovered the Back button) succeeds. This component
 * automates that retry: shortly after the denial page mounts, it re-checks
 * access from the browser (which by now carries the settled session) and, if
 * the grant is there, replaces the denial page with the workspace.
 *
 * Genuinely unauthorized users fail both rechecks and simply stay on the page.
 */
export function AccessRecheck({ slug }: { slug: string }) {
  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    async function hasAccessNow(): Promise<boolean> {
      try {
        const res = await fetch(
          `/api/client-access/recheck?client=${encodeURIComponent(slug)}`,
          { cache: 'no-store' }
        )
        if (!res.ok) return false
        const data = (await res.json()) as { ok?: boolean }
        return data.ok === true
      } catch {
        return false
      }
    }

    function scheduleAttempt(delayMs: number, retryDelayMs?: number) {
      timers.push(
        setTimeout(async () => {
          if (cancelled) return
          if (await hasAccessNow()) {
            // Full navigation (not router.push) so the workspace request is a
            // fresh document load with current cookies, untouched by any
            // client-side router cache. replace() keeps the denial page out
            // of history — Back won't bounce through it again.
            if (!cancelled) window.location.replace(`/clients/${slug}`)
          } else if (retryDelayMs !== undefined) {
            scheduleAttempt(retryDelayMs)
          }
        }, delayMs)
      )
    }

    scheduleAttempt(600, 2500)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [slug])

  return null
}
