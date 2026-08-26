import Link from 'next/link'
import React from 'react'

import { ArchitectureView } from '@/components/grex/ArchitectureView'
import { GREX_BRAND } from '@/lib/grex/brand'

export const metadata = {
  title: `${GREX_BRAND.name} — How the Verifier Works`,
}

export default function GrexArchitecturePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <Link
          href="/clients/grex"
          className="text-[12.5px] hover:underline"
          style={{ color: 'var(--grex-muted)' }}
        >
          ← {GREX_BRAND.name} hub
        </Link>
        <h1
          className="mt-3 text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}
        >
          How the verifier works
        </h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
          {GREX_BRAND.thesis} The product surfaces stay deliberately quiet — an interaction surface,
          then an explanation of the scoring. Everything else lives back here.
        </p>
      </header>
      <ArchitectureView />
    </div>
  )
}
