import Link from 'next/link'
import React from 'react'

import { BrandExplorer } from '@/components/grex/BrandExplorer'
import { GREX_BRAND } from '@/lib/grex/brand'

export const metadata = {
  title: `${GREX_BRAND.name} — Brand Exploration`,
}

export default function GrexBrandPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-4">
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
          Brand exploration
        </h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed">
          Three trust aesthetics applied to the same real components. Consumer trust in a
          fact-checking product comes from calm authority: a restrained base palette, warm — not
          clinical — surfaces, one confident accent, and red reserved strictly for the
          &ldquo;contradicted&rdquo; verdict, never as ambient chrome. Verdict hues stay constant
          across all three directions; only the chrome changes. The whole workspace is token-driven,
          so committing to a direction is a one-line change.
        </p>
      </div>
      <BrandExplorer />
    </div>
  )
}
