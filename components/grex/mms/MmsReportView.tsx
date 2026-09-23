import React from 'react'

import { ClaimCard } from '@/components/grex/ClaimCard'
import { ScoreBadge } from '@/components/grex/ScoreBadge'
import { countClaims } from '@/lib/grex/types'
import { MMS_COPY } from '@/lib/grex/mms/copy'
import type { PublicReport } from '@/lib/grex/mms/store'
import { CollapseSection } from './CollapseDiagram'

export function MmsReportView({ report }: { report: PublicReport }) {
  const counts = countClaims(report.claims)
  const evaluated = report.claims.filter((claim) => claim.verifiability === 'VERIFIABLE' && claim.evaluation)
  const unscored = report.claims.filter((claim) => claim.verifiability !== 'VERIFIABLE')
  const none = report.score.special === 'NO_VERIFIABLE_CLAIMS'

  return (
    <article className="max-w-lg mx-auto px-4 py-8">
      <p className="text-[12px] uppercase tracking-[0.14em] mb-4" style={{ color: 'var(--grex-muted)' }}>
        GREX
      </p>
      <ScoreBadge score={report.score} size="hero" />
      <p className="mt-3 text-[13px]" style={{ color: 'var(--grex-muted)' }}>
        {report.contentLabel} · checked {new Date(report.checkedAt).toLocaleDateString()}
      </p>
      {report.truncated && (
        <p className="mt-3 text-[13.5px] font-medium" style={{ color: 'var(--grex-ink)' }}>
          {MMS_COPY.truncated}
        </p>
      )}
      {report.evidenceMode === 'degraded' && (
        <p
          className="mt-4 px-4 py-3 text-[13px] leading-relaxed"
          style={{
            background: 'var(--grex-surface-raised)',
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-card)',
            color: 'var(--grex-body)',
          }}
        >
          {MMS_COPY.degradedPage}
        </p>
      )}

      <div className="mt-8">
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--grex-ink)' }}>
          {report.summary}
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
                <span style={{ color: 'var(--grex-contradicted)' }}>{counts.contradicted} contradicted</span>
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

      {evaluated.length > 0 && (
        <div className="mt-8 space-y-3">
          {evaluated.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
      {unscored.length > 0 && (
        <div className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.15em] font-medium mb-3" style={{ color: 'var(--grex-muted)' }}>
            Found but not scored
          </p>
          <div className="space-y-3">
            {unscored.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </div>
      )}

      <CollapseSection collapse={report.collapse} claims={report.claims} />

      <footer className="mt-10 pt-5 text-[12px] leading-relaxed" style={{ borderTop: '1px solid var(--grex-border)', color: 'var(--grex-muted)' }}>
        <p>{MMS_COPY.capability}</p>
        <p className="mt-2">{MMS_COPY.methodology}</p>
      </footer>
    </article>
  )
}

export function MmsReportUnavailable() {
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <p className="text-4xl mb-4" style={{ color: 'var(--grex-muted)' }}>
        —
      </p>
      <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
        {MMS_COPY.unavailableTitle}
      </h1>
      <p className="text-[14px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
        {MMS_COPY.unavailableBody}
      </p>
    </div>
  )
}
