'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'
import {
  countClaims,
  SCORING_METHODOLOGY_VERSION,
  type VerificationResult,
} from '@/lib/grex/types'
import { ClaimCard } from './ClaimCard'
import { ScoreBadge } from './ScoreBadge'

const SURFACE_LABELS: Record<VerificationResult['surface'], string> = {
  browser: 'Browser extension',
  screenshot: 'Screenshot checker',
  mcp: 'Agent verification',
}

export const LIVE_RESULT_STORAGE_PREFIX = 'grex:result:'

/**
 * The shared explanation page body — every surface resolves here.
 * Level 1: score. Level 2: compact summary. Level 3: evidence.
 *
 * Canned results arrive as a prop; live results are looked up from
 * sessionStorage by id (they are ephemeral by design — GREX persists no
 * user content — so dead deep links get a graceful expiry message).
 */
export function ExplanationView({
  result: resultProp,
  lookupId,
}: {
  result?: VerificationResult
  lookupId?: string
}) {
  const [result, setResult] = useState<VerificationResult | null>(resultProp ?? null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (resultProp || !lookupId) return
    try {
      const raw = sessionStorage.getItem(`${LIVE_RESULT_STORAGE_PREFIX}${lookupId}`)
      if (raw) setResult(JSON.parse(raw) as VerificationResult)
      else setExpired(true)
    } catch {
      setExpired(true)
    }
  }, [resultProp, lookupId])

  if (expired) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-4xl mb-4" style={{ color: 'var(--grex-muted)' }}>
          —
        </p>
        <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
          This report has expired
        </h1>
        <p className="text-[14px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
          Live checks are ephemeral: {GREX_BRAND.name} doesn&apos;t keep what you submit, so their
          reports live only in the session that ran them. Run a new check from any surface.
        </p>
        <Link
          href="/clients/grex"
          className="inline-block mt-6 px-5 py-2 text-[13.5px] font-medium"
          style={{
            background: 'var(--grex-accent)',
            color: 'var(--grex-accent-ink)',
            borderRadius: 'var(--grex-radius-chip)',
          }}
        >
          Back to the hub
        </Link>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center text-[14px]" style={{ color: 'var(--grex-muted)' }}>
        Loading report…
      </div>
    )
  }

  const counts = countClaims(result.claims)
  const evaluated = result.claims.filter((c) => c.verifiability === 'VERIFIABLE' && c.evaluation)
  const unscored = result.claims.filter((c) => c.verifiability !== 'VERIFIABLE')
  const none = result.score.special === 'NO_VERIFIABLE_CLAIMS'

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
        <Link
          href="/clients/grex"
          className="text-[12.5px] hover:underline"
          style={{ color: 'var(--grex-muted)' }}
        >
          ← {GREX_BRAND.name} hub
        </Link>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--grex-muted)' }}>
          <span
            className="px-2 py-0.5"
            style={{ border: '1px solid var(--grex-border)', borderRadius: 'var(--grex-radius-chip)' }}
          >
            {SURFACE_LABELS[result.surface]}
          </span>
          <span
            className="px-2 py-0.5"
            style={{ border: '1px solid var(--grex-border)', borderRadius: 'var(--grex-radius-chip)' }}
          >
            {result.mode === 'live' ? 'Live check' : 'Demo scenario'}
          </span>
        </div>
      </div>

      {/* Level 1 — the score */}
      <ScoreBadge score={result.score} size="hero" />
      <p className="mt-3 text-[13px]" style={{ color: 'var(--grex-muted)' }}>
        {result.contentLabel} · checked {new Date(result.checkedAt).toLocaleDateString()}
      </p>

      {result.evidenceMode === 'degraded' && (
        <p
          className="mt-4 px-4 py-3 text-[13px] leading-relaxed"
          style={{
            background: 'var(--grex-surface-raised)',
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-card)',
            color: 'var(--grex-body)',
          }}
        >
          Web evidence retrieval was limited during this check, so some claims are marked
          &ldquo;couldn&apos;t verify&rdquo; that might otherwise have been resolvable.
        </p>
      )}

      {/* Level 2 — why, in one breath */}
      <div className="mt-8">
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--grex-ink)' }}>
          {result.summary}
        </p>
        {!none && (
          <p className="mt-3 text-[13.5px]" style={{ color: 'var(--grex-body)' }}>
            <strong style={{ color: 'var(--grex-ink)' }}>
              {counts.verifiable} factual {counts.verifiable === 1 ? 'claim' : 'claims'} checked:
            </strong>{' '}
            <span style={{ color: 'var(--grex-supported)' }}>{counts.supported} supported</span>
            {counts.contradicted > 0 && (
              <>
                {' · '}
                <span style={{ color: 'var(--grex-contradicted)' }}>
                  {counts.contradicted} contradicted
                </span>
              </>
            )}
            {counts.insufficient > 0 && (
              <>
                {' · '}
                <span style={{ color: 'var(--grex-insufficient)' }}>
                  {counts.insufficient} couldn&apos;t be verified
                </span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Level 3 — the evidence */}
      {evaluated.length > 0 && (
        <div className="mt-8 space-y-3">
          {evaluated.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}

      {unscored.length > 0 && (
        <div className="mt-8">
          <p
            className="text-[11px] uppercase tracking-[0.15em] font-medium mb-3"
            style={{ color: 'var(--grex-muted)' }}
          >
            Found but not scored
          </p>
          <div className="space-y-3">
            {unscored.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </div>
      )}

      <footer
        className="mt-12 pt-5 text-[12px] leading-relaxed"
        style={{ borderTop: '1px solid var(--grex-border)', color: 'var(--grex-muted)' }}
      >
        <p>
          Scoring methodology {SCORING_METHODOLOGY_VERSION}: each verifiable claim counts 1 if
          supported, 0.5 if evidence was insufficient, 0 if contradicted; the score is the average ×
          100. A score reflects the strength of publicly available evidence for the claims checked —
          not a determination of truth.
        </p>
      </footer>
    </div>
  )
}
