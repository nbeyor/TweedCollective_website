'use client'

import React, { useEffect } from 'react'

/**
 * Phone column under the clients bar (py-4 + 28px mark + 1px border = 61px).
 * Locks document scroll so the card and Skip/Want stay in the mobile viewport
 * instead of sitting under a tall page.
 */
export function WatchFrame({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previousHtml = html.style.overflow
    const previousBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previousHtml
      body.style.overflow = previousBody
    }
  }, [])

  return (
    <div className="flex h-[calc(100dvh-61px)] min-h-0 flex-col overflow-hidden overscroll-none">{children}</div>
  )
}
