import Link from 'next/link'
import React from 'react'

import { countClaims, type VerificationResult } from '@/lib/grex/types'
import { ScoreBadge } from './ScoreBadge'

/**
 * Level-2 panel: score, one-line summary, claim counts, and the single
 * primary action — "See why" — which opens the shared explanation page.
 */
export function CompactSummary({
  result,
  reportHref,
}: {
  result: VerificationResult
  reportHref: string
}) {
  const counts = countClaims(result.claims)
  const none = result.score.special === 'NO_VERIFIABLE_CLAIMS'

  return (
    <div
      className="p-4 w-[320px]"
      style={{
        background: 'var(--grex-surface)',
        border: '1px solid var(--grex-border)',
        borderRadius: 'var(--grex-radius-card)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
      }}
    >
      <ScoreBadge score={result.score} size="panel" />

      {!none && (
        <div className="mt-3 space-y-1 text-[12.5px]" style={{ color: 'var(--grex-body)' }}>
          <p className="font-medium" style={{ color: 'var(--grex-ink)' }}>
            {counts.verifiable} factual {counts.verifiable === 1 ? 'claim' : 'claims'} checked
          </p>
          <div className="flex gap-3 flex-wrap">
            <span style={{ color: 'var(--grex-supported)' }}>{counts.supported} supported</span>
            {counts.contradicted > 0 && (
              <span style={{ color: 'var(--grex-contradicted)' }}>
                {counts.contradicted} contradicted
              </span>
            )}
            {counts.insufficient > 0 && (
              <span style={{ color: 'var(--grex-insufficient)' }}>
                {counts.insufficient} couldn&apos;t verify
              </span>
            )}
          </div>
        </div>
      )}

      <Link
        href={reportHref}
        className="mt-4 flex items-center justify-center w-full py-2 text-[13px] font-medium transition-opacity hover:opacity-90"
        style={{
          background: 'var(--grex-accent)',
          color: 'var(--grex-accent-ink)',
          borderRadius: 'var(--grex-radius-chip)',
        }}
      >
        See why →
      </Link>
    </div>
  )
}
