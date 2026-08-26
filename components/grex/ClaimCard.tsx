import React from 'react'

import type { Claim } from '@/lib/grex/types'
import { NonVerifiableChip, VerdictChip } from './VerdictChip'

/** Level-3 unit: one claim, its verdict, and the evidence behind it. */
export function ClaimCard({ claim }: { claim: Claim }) {
  const evaluated = claim.verifiability === 'VERIFIABLE' && claim.evaluation
  return (
    <div
      className="p-4"
      style={{
        background: 'var(--grex-surface)',
        border: '1px solid var(--grex-border)',
        borderRadius: 'var(--grex-radius-card)',
      }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p
          className="text-[14.5px] leading-relaxed font-medium flex-1 min-w-[200px]"
          style={{ color: 'var(--grex-ink)' }}
        >
          “{claim.text}”
        </p>
        {evaluated ? (
          <VerdictChip verdict={claim.evaluation!.verdict} />
        ) : (
          <NonVerifiableChip kind={claim.verifiability as Exclude<typeof claim.verifiability, 'VERIFIABLE'>} />
        )}
      </div>

      {evaluated && (
        <>
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
            {claim.evaluation!.rationale}
          </p>
          {claim.evaluation!.evidence.length > 0 && (
            <ul className="mt-3 space-y-2">
              {claim.evaluation!.evidence.map((e) => (
                <li
                  key={e.id}
                  className="pl-3"
                  style={{ borderLeft: '2px solid var(--grex-border)' }}
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12.5px] font-medium hover:underline"
                      style={{ color: 'var(--grex-accent)' }}
                    >
                      {e.sourceName}
                    </a>
                    <span
                      className="text-[10.5px] uppercase tracking-[0.08em]"
                      style={{
                        color:
                          e.stance === 'supports'
                            ? 'var(--grex-supported)'
                            : e.stance === 'contradicts'
                              ? 'var(--grex-contradicted)'
                              : 'var(--grex-muted)',
                      }}
                    >
                      {e.stance}
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed mt-0.5" style={{ color: 'var(--grex-muted)' }}>
                    “{e.snippet}”
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
