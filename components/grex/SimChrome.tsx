import Link from 'next/link'
import React from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'

export function SimTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 text-[12.5px] font-medium transition-colors"
      style={{
        background: active ? 'var(--grex-accent)' : 'var(--grex-surface)',
        color: active ? 'var(--grex-accent-ink)' : 'var(--grex-body)',
        border: `1px solid ${active ? 'var(--grex-accent)' : 'var(--grex-border)'}`,
        borderRadius: 'var(--grex-radius-pill)',
      }}
    >
      {children}
    </button>
  )
}

/** Common header for the three surface pages. */
export function SurfaceHeader({
  kicker,
  title,
  description,
}: {
  kicker: string
  title: string
  description: string
}) {
  return (
    <header className="mb-8">
      <Link
        href="/clients/grex"
        className="text-[12.5px] hover:underline"
        style={{ color: 'var(--grex-muted)' }}
      >
        ← {GREX_BRAND.name} hub
      </Link>
      <p
        className="mt-4 text-[11px] uppercase tracking-[0.15em] font-medium"
        style={{ color: 'var(--grex-accent)' }}
      >
        {kicker}
      </p>
      <h1
        className="mt-1 text-3xl font-semibold tracking-tight"
        style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}
      >
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
        {description}
      </p>
    </header>
  )
}
