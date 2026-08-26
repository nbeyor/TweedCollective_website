import React from 'react'

import { DIRECTIONS, GREX_THEME, themeVars, type GrexTheme } from '@/lib/grex/theme'
import { scoreFor, type Claim, type VerificationResult } from '@/lib/grex/types'
import { ClaimCard } from './ClaimCard'
import { CompactSummary } from './CompactSummary'
import { ScoreBadge } from './ScoreBadge'
import { VerdictChip } from './VerdictChip'

// Self-contained sample data so the brand page needs no scenario wiring.
const SAMPLE_CLAIMS: Claim[] = [
  {
    id: 'b1',
    text: 'The company was founded in 2012.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.94,
      rationale: 'Two independent public records give a 2012 founding date.',
      evidence: [
        {
          id: 'b1e1',
          url: 'https://example.com/registry',
          sourceName: 'Corporate registry',
          title: 'Registration record',
          snippet: 'Incorporated March 2012…',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'b2',
    text: 'The product is used by more than 50,000 physicians.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.4,
      rationale: 'No public source states a usage figure; the number appears only in marketing.',
      evidence: [],
    },
  },
  {
    id: 'b3',
    text: 'The treatment received FDA approval in 2022.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'CONTRADICTED',
      confidence: 0.88,
      rationale: 'Available evidence indicates approval occurred in 2023, not 2022.',
      evidence: [
        {
          id: 'b3e1',
          url: 'https://example.com/approval',
          sourceName: 'Regulatory database',
          title: 'Approval letter',
          snippet: 'Approval date: June 2023…',
          stance: 'contradicts',
        },
      ],
    },
  },
]

const SAMPLE_RESULT: VerificationResult = {
  id: 'brand-sample',
  surface: 'browser',
  mode: 'canned',
  contentLabel: 'Sample article',
  submittedText: '',
  summary: 'Mixed evidence across three checked claims.',
  claims: SAMPLE_CLAIMS,
  score: scoreFor(50),
  checkedAt: '2026-08-26T00:00:00Z',
  evidenceMode: 'web',
}

function DirectionSection({ theme, recommended }: { theme: GrexTheme; recommended: boolean }) {
  return (
    <section
      className="py-12 px-6"
      style={{
        ...themeVars(theme),
        background: 'var(--grex-page)',
        color: 'var(--grex-body)',
        fontFamily: 'var(--grex-font-body)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              className="text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}
            >
              {theme.name}
            </h2>
            {recommended && (
              <span
                className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{
                  background: 'var(--grex-accent)',
                  color: 'var(--grex-accent-ink)',
                  borderRadius: 'var(--grex-radius-chip)',
                }}
              >
                Recommended
              </span>
            )}
          </div>
          <p className="mt-1 text-[14px] font-medium" style={{ color: 'var(--grex-ink)' }}>
            {theme.positioning}
          </p>
          <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed">{theme.rationale}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8 min-w-0">
            <div>
              <SampleLabel>Score — the ambient primitive</SampleLabel>
              <div className="flex items-end gap-8 flex-wrap">
                <ScoreBadge score={scoreFor(84)} size="hero" />
                <div className="flex items-center gap-3">
                  {[84, 58, 22].map((v) => (
                    <ScoreBadge key={v} score={scoreFor(v)} size="pill" />
                  ))}
                  <ScoreBadge score={scoreFor(null)} size="pill" />
                </div>
              </div>
            </div>

            <div>
              <SampleLabel>Verdict language</SampleLabel>
              <div className="flex gap-2.5 flex-wrap">
                <VerdictChip verdict="SUPPORTED" />
                <VerdictChip verdict="INSUFFICIENT_EVIDENCE" />
                <VerdictChip verdict="CONTRADICTED" />
              </div>
            </div>

            <div>
              <SampleLabel>Claim evidence card</SampleLabel>
              <div className="space-y-3">
                <ClaimCard claim={SAMPLE_CLAIMS[0]} />
                <ClaimCard claim={SAMPLE_CLAIMS[2]} />
              </div>
            </div>
          </div>

          <div>
            <SampleLabel>Compact summary panel</SampleLabel>
            <CompactSummary result={SAMPLE_RESULT} reportHref="#" />
            <div
              className="mt-6 p-4 text-[12px] leading-relaxed"
              style={{
                background: 'var(--grex-surface-raised)',
                border: '1px solid var(--grex-border)',
                borderRadius: 'var(--grex-radius-card)',
                color: 'var(--grex-muted)',
              }}
            >
              <p className="font-medium mb-1" style={{ color: 'var(--grex-ink)' }}>
                Palette
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  theme.colors.accent,
                  theme.colors.ink,
                  theme.colors.page,
                  theme.colors.bandStrong,
                  theme.colors.bandModerate,
                  theme.colors.bandMixed,
                  theme.colors.bandWeak,
                ].map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="w-7 h-7"
                    style={{
                      background: c,
                      border: '1px solid var(--grex-border)',
                      borderRadius: 'var(--grex-radius-chip)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SampleLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] uppercase tracking-[0.15em] font-medium mb-3"
      style={{ color: 'var(--grex-muted)' }}
    >
      {children}
    </p>
  )
}

export function BrandExplorer() {
  const order: GrexTheme[] = [DIRECTIONS.signal, DIRECTIONS.ledger, DIRECTIONS.meter]
  return (
    <div>
      {order.map((t, i) => (
        <div key={t.id} style={i > 0 ? { borderTop: '1px solid rgba(128,128,128,0.25)' } : undefined}>
          <DirectionSection theme={t} recommended={t.id === GREX_THEME.id} />
        </div>
      ))}
    </div>
  )
}
