import Link from 'next/link'
import React from 'react'

import { DATA_MODEL, MILESTONES, PIPELINE_STAGES, PRINCIPLES } from '@/lib/grex/architecture'
import { getScenario } from '@/lib/grex/scenarios'
import { countClaims } from '@/lib/grex/types'
import { ScoreBadge } from './ScoreBadge'
import { NonVerifiableChip, VerdictChip } from './VerdictChip'

const EXAMPLE = getScenario('mcp-ai-answer')!

const mono: React.CSSProperties = { fontFamily: 'var(--grex-font-mono)' }

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[12px] uppercase tracking-[0.15em] font-medium mb-4"
      style={{ color: 'var(--grex-muted)' }}
    >
      {children}
    </h2>
  )
}

const Arrow = () => (
  <div className="hidden lg:flex items-center justify-center px-1 self-center" aria-hidden>
    <svg width="20" height="12" viewBox="0 0 22 12" fill="none">
      <path
        d="M0 6 H18 M14 1.5 L19 6 L14 10.5"
        stroke="var(--grex-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

/** The PRD companion, rendered as math and architecture rather than prose. */
export function ArchitectureView() {
  const counts = countClaims(EXAMPLE.result.claims)
  const total = counts.supported * 1 + counts.insufficient * 0.5
  const scoreValue = EXAMPLE.result.score.value

  return (
    <div className="space-y-14">
      {/* 1 · Pipeline */}
      <section>
        <SectionLabel>Pipeline</SectionLabel>
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0">
          {PIPELINE_STAGES.map((stage, i) => (
            <React.Fragment key={stage.name}>
              {i > 0 && <Arrow />}
              <div
                className="flex-1 min-w-0 p-3.5"
                style={{
                  background: 'var(--grex-surface)',
                  border: '1px solid var(--grex-border)',
                  borderRadius: 'var(--grex-radius-card)',
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.1em]" style={{ ...mono, color: 'var(--grex-accent)' }}>
                  {stage.state}
                </p>
                <p className="text-[14px] font-semibold mt-0.5" style={{ color: 'var(--grex-ink)' }}>
                  {stage.name}
                </p>
                <p className="text-[11px] mt-1" style={{ ...mono, color: 'var(--grex-muted)' }}>
                  {stage.input} → {stage.output}
                </p>
                <p className="text-[11.5px] mt-1.5 leading-snug" style={{ color: 'var(--grex-body)' }}>
                  {stage.note}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 2 · Worked example */}
      <section>
        <SectionLabel>Worked example — one AI answer, end to end</SectionLabel>
        <div
          className="p-4 mb-4 text-[13.5px] leading-relaxed"
          style={{
            background: 'var(--grex-surface-raised)',
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-card)',
            color: 'var(--grex-ink)',
          }}
        >
          “{EXAMPLE.content.kind === 'agent' ? EXAMPLE.content.assistantAnswer : ''}”
        </div>

        <div
          className="overflow-x-auto"
          style={{
            background: 'var(--grex-surface)',
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-card)',
          }}
        >
          <table className="w-full text-[12.5px]" style={{ minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--grex-border)' }}>
                {['Extracted claim', 'Verdict', 'Citation', 'Value'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[10.5px] uppercase tracking-[0.1em] font-medium"
                    style={{ color: 'var(--grex-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXAMPLE.result.claims.map((c) => {
                const evaluated = c.verifiability === 'VERIFIABLE' && c.evaluation
                const value = !evaluated
                  ? '—'
                  : c.evaluation!.verdict === 'SUPPORTED'
                    ? '1.0'
                    : c.evaluation!.verdict === 'INSUFFICIENT_EVIDENCE'
                      ? '0.5'
                      : '0.0'
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--grex-border)' }}>
                    <td className="px-4 py-2.5 leading-snug" style={{ color: 'var(--grex-ink)' }}>
                      {c.text}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {evaluated ? (
                        <VerdictChip verdict={c.evaluation!.verdict} />
                      ) : (
                        <NonVerifiableChip kind={c.verifiability as Exclude<typeof c.verifiability, 'VERIFIABLE'>} />
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: 'var(--grex-body)' }}>
                      {evaluated && c.evaluation!.evidence[0] ? c.evaluation!.evidence[0].sourceName : '—'}
                    </td>
                    <td className="px-4 py-2.5" style={{ ...mono, color: 'var(--grex-ink)' }}>
                      {value}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] items-center">
          <pre
            className="p-4 text-[12.5px] leading-relaxed overflow-x-auto"
            style={{
              ...mono,
              background: 'var(--grex-surface)',
              border: '1px solid var(--grex-border)',
              borderRadius: 'var(--grex-radius-card)',
              color: 'var(--grex-ink)',
            }}
          >
            {`supported      ${counts.supported} × 1.0  =  ${(counts.supported * 1).toFixed(1)}
insufficient   ${counts.insufficient} × 0.5  =  ${(counts.insufficient * 0.5).toFixed(1)}
contradicted   ${counts.contradicted} × 0.0  =  0.0
                        ──────
score  =  ${total.toFixed(1)} / ${counts.verifiable} × 100  =  ${scoreValue}`}
          </pre>
          <div className="flex flex-col items-start gap-2">
            <ScoreBadge score={EXAMPLE.result.score} size="panel" />
            <Link
              href={`/clients/grex/report/${EXAMPLE.id}`}
              className="text-[12px] font-medium hover:underline"
              style={{ color: 'var(--grex-accent)' }}
            >
              Full report →
            </Link>
          </div>
        </div>
      </section>

      {/* 3 · Scoring math */}
      <section>
        <SectionLabel>Scoring — methodology v0.1</SectionLabel>
        <pre
          className="p-4 text-[13px] overflow-x-auto"
          style={{
            ...mono,
            background: 'var(--grex-surface)',
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-card)',
            color: 'var(--grex-ink)',
          }}
        >
          {`score = (1·supported + 0.5·insufficient + 0·contradicted) / verifiable_claims × 100`}
        </pre>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div
            className="p-4"
            style={{
              background: 'var(--grex-surface)',
              border: '1px solid var(--grex-border)',
              borderRadius: 'var(--grex-radius-card)',
            }}
          >
            <p className="text-[10.5px] uppercase tracking-[0.1em] mb-2.5 font-medium" style={{ color: 'var(--grex-muted)' }}>
              Score bands
            </p>
            {(
              [
                ['80–100', 'Strong evidence', 'var(--grex-band-strong)'],
                ['60–79', 'Moderate evidence', 'var(--grex-band-moderate)'],
                ['40–59', 'Mixed evidence', 'var(--grex-band-mixed)'],
                ['0–39', 'Weak evidence', 'var(--grex-band-weak)'],
              ] as const
            ).map(([range, label, color]) => (
              <div key={range} className="flex items-center gap-3 py-1 text-[13px]">
                <span className="w-14" style={{ ...mono, color: 'var(--grex-ink)' }}>
                  {range}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span style={{ color: 'var(--grex-body)' }}>{label}</span>
              </div>
            ))}
          </div>
          <div
            className="p-4 flex flex-col justify-between gap-3"
            style={{
              background: 'var(--grex-surface)',
              border: '1px solid var(--grex-border)',
              borderRadius: 'var(--grex-radius-card)',
            }}
          >
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.1em] mb-2.5 font-medium" style={{ color: 'var(--grex-muted)' }}>
                Rules
              </p>
              <ul className="space-y-1.5 text-[13px]" style={{ color: 'var(--grex-body)' }}>
                <li>
                  <span style={{ ...mono, color: 'var(--grex-ink)' }}>verifiable_claims = 0</span> →{' '}
                  <span style={{ ...mono }}>NO_VERIFIABLE_CLAIMS</span>: no score, ever.
                </li>
                <li>Insufficient evidence ≠ contradicted — it costs half, not everything.</li>
                <li>Every claim weighs equally in v0. Weighting must be earned from data.</li>
                <li>Methodology is versioned; historical scores are never overwritten.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · System architecture */}
      <section>
        <SectionLabel>System — one backend, three surfaces</SectionLabel>
        <div className="grid gap-2 md:grid-cols-3">
          {(
            [
              ['Chrome extension', 'skills/browser'],
              ['iOS share extension', 'skills/screenshot'],
              ['MCP verify_facts', 'skills/mcp'],
            ] as const
          ).map(([name, skill]) => (
            <div
              key={name}
              className="p-3 text-center"
              style={{
                background: 'var(--grex-surface)',
                border: '1px solid var(--grex-border)',
                borderRadius: 'var(--grex-radius-card)',
              }}
            >
              <p className="text-[13px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                {name}
              </p>
              <p className="text-[10.5px] mt-0.5" style={{ ...mono, color: 'var(--grex-accent)' }}>
                {skill}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center my-1" aria-hidden>
          <svg width="240" height="30" viewBox="0 0 240 30" fill="none">
            <path
              d="M30 0 V8 Q30 15 120 15 M120 0 V15 M210 0 V8 Q210 15 120 15 M120 15 V30"
              stroke="var(--grex-muted)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div
          className="p-3.5 text-center"
          style={{ background: 'var(--grex-accent)', borderRadius: 'var(--grex-radius-card)' }}
        >
          <p className="text-[13px] font-semibold" style={{ ...mono, color: 'var(--grex-accent-ink)' }}>
            POST /v1/verify → {'{'} score, claims[], evidence[], methodology_version {'}'}
          </p>
        </div>
        <div className="flex justify-center my-1" aria-hidden>
          <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
            <path d="M6 0 V17 M1.5 13 L6 18 L10.5 13" stroke="var(--grex-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {['ModelProvider', 'SearchProvider', 'ContentExtractor', 'ScoringStrategy'].map((abs) => (
            <span
              key={abs}
              className="px-3 py-1.5 text-[11.5px]"
              style={{
                ...mono,
                background: 'var(--grex-surface-raised)',
                border: '1px dashed var(--grex-border)',
                borderRadius: 'var(--grex-radius-chip)',
                color: 'var(--grex-body)',
              }}
            >
              {abs}
            </span>
          ))}
        </div>
        <p className="text-center text-[11.5px] mb-5" style={{ color: 'var(--grex-muted)' }}>
          The four required abstractions — model, search, extraction, and scoring are each swappable
          without touching a surface. This prototype runs a hosted frontier model; production swaps
          in the self-hosted open-weight model behind the same interface.
        </p>
        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {DATA_MODEL.map((e) => (
            <div
              key={e.name}
              className="p-3.5"
              style={{
                background: 'var(--grex-surface)',
                border: '1px solid var(--grex-border)',
                borderRadius: 'var(--grex-radius-card)',
              }}
            >
              <p className="text-[12.5px] font-semibold" style={{ ...mono, color: 'var(--grex-ink)' }}>
                {e.name}
              </p>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ ...mono, color: 'var(--grex-muted)' }}>
                {e.fields.join(' · ')}
              </p>
              <p className="text-[11.5px] mt-1.5" style={{ color: 'var(--grex-body)' }}>
                {e.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 · Build order */}
      <section>
        <SectionLabel>Build order</SectionLabel>
        <div
          className="overflow-hidden"
          style={{
            background: 'var(--grex-surface)',
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-card)',
          }}
        >
          {MILESTONES.map((m, i) => (
            <div
              key={m.name}
              className="flex items-baseline justify-between gap-4 px-4 py-2.5 flex-wrap"
              style={i > 0 ? { borderTop: '1px solid var(--grex-border)' } : undefined}
            >
              <p className="text-[13px]" style={{ color: 'var(--grex-ink)' }}>
                {m.name}
              </p>
              <p className="text-[11.5px] whitespace-nowrap" style={{ ...mono, color: 'var(--grex-accent)' }}>
                {m.prototype}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 · Principles, one line each */}
      <section
        className="pt-5"
        style={{ borderTop: '1px solid var(--grex-border)' }}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {PRINCIPLES.map((p) => (
            <p key={p} className="text-[11.5px]" style={{ color: 'var(--grex-muted)' }}>
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}
