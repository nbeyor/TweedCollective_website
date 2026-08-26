import Link from 'next/link'
import React from 'react'

import { bandVar } from '@/lib/grex/theme'
import { countClaims, type VerificationResult } from '@/lib/grex/types'

/**
 * The MCP-surface product: one quiet line at the end of an AI response.
 * A small score chip, the evidence band, the counts, and "See why". Renders
 * nothing at all when the response had no checkable facts — silence is the
 * design, not an empty state.
 */
export function ScoreLine({
  result,
  reportHref,
}: {
  result: VerificationResult
  reportHref: string
}) {
  if (result.score.special === 'NO_VERIFIABLE_CLAIMS' || result.score.value === null) return null
  const counts = countClaims(result.claims)
  const color = bandVar(result.score.band)

  return (
    <div
      className="mt-3 pt-2.5 flex items-center gap-2 flex-wrap text-[12px]"
      style={{ borderTop: '1px solid var(--grex-border)', color: 'var(--grex-muted)' }}
    >
      <span
        className="inline-flex items-center justify-center font-semibold tabular-nums text-[11.5px]"
        style={{
          minWidth: 26,
          height: 20,
          padding: '0 6px',
          borderRadius: 'var(--grex-radius-chip)',
          border: `1.5px solid ${color}`,
          color: 'var(--grex-ink)',
          fontFamily: 'var(--grex-font-display)',
        }}
      >
        {result.score.value}
      </span>
      <span className="font-medium" style={{ color }}>
        {result.score.label}
      </span>
      <span aria-hidden>·</span>
      <span>
        {counts.verifiable} {counts.verifiable === 1 ? 'claim' : 'claims'} checked
        {counts.contradicted > 0 && `, ${counts.contradicted} contradicted`}
      </span>
      <span aria-hidden>·</span>
      <Link href={reportHref} className="hover:underline font-medium" style={{ color: 'var(--grex-accent)' }}>
        See why →
      </Link>
    </div>
  )
}
