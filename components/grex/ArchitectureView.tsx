import React from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'
import {
  DATA_MODEL,
  MILESTONES,
  PIPELINE_STAGES,
  PRINCIPLES,
  SURFACE_NODES,
} from '@/lib/grex/architecture'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[12px] uppercase tracking-[0.15em] font-medium mb-5"
      style={{ color: 'var(--grex-muted)' }}
    >
      {children}
    </h2>
  )
}

function Card({ children, raised }: { children: React.ReactNode; raised?: boolean }) {
  return (
    <div
      className="p-4"
      style={{
        background: raised ? 'var(--grex-surface-raised)' : 'var(--grex-surface)',
        border: '1px solid var(--grex-border)',
        borderRadius: 'var(--grex-radius-card)',
      }}
    >
      {children}
    </div>
  )
}

const Arrow = () => (
  <div className="flex items-center justify-center px-1 self-center" aria-hidden>
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
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

/** The PRD companion: how the verifier works, what it stores, what gets built. */
export function ArchitectureView() {
  return (
    <div className="space-y-14">
      {/* One backend, three surfaces */}
      <section>
        <SectionLabel>One backend, three surfaces</SectionLabel>
        <div className="grid gap-3 md:grid-cols-3">
          {SURFACE_NODES.map((s) => (
            <Card key={s.name}>
              <p className="text-[14px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                {s.name}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--grex-muted)' }}>
                {s.context}
              </p>
              <p className="text-[13px] mt-2 leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                {s.hypothesis}
              </p>
            </Card>
          ))}
        </div>
        <div className="flex flex-col items-center my-1" aria-hidden>
          <svg width="240" height="34" viewBox="0 0 240 34" fill="none">
            <path d="M30 0 V10 Q30 18 120 18 M120 0 V18 M210 0 V10 Q210 18 120 18 M120 18 V34" stroke="var(--grex-border)" strokeWidth="1.5" />
          </svg>
        </div>
        <div
          className="max-w-md mx-auto text-center p-4"
          style={{
            background: 'var(--grex-accent)',
            borderRadius: 'var(--grex-radius-card)',
          }}
        >
          <p className="text-[14px] font-semibold" style={{ color: 'var(--grex-accent-ink)' }}>
            One verification engine · one scoring methodology · one explanation page
          </p>
        </div>
        <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
          The three surfaces test one hypothesis in three contexts: if factual information carries a
          transparent evidence-confidence score with almost no user effort, do people use it? The
          backend stays identical; every score resolves to the same shared report.
        </p>
      </section>

      {/* Pipeline */}
      <section>
        <SectionLabel>The verifier pipeline</SectionLabel>
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0">
          {PIPELINE_STAGES.map((stage, i) => (
            <React.Fragment key={stage.name}>
              {i > 0 && <Arrow />}
              <div className="flex-1 min-w-0">
                <Card raised>
                  <p
                    className="text-[10.5px] uppercase tracking-[0.1em] mb-1"
                    style={{ color: 'var(--grex-accent)', fontFamily: 'var(--grex-font-mono)' }}
                  >
                    {stage.state}
                  </p>
                  <p className="text-[13.5px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                    {stage.name}
                  </p>
                  <p className="text-[11.5px] mt-1" style={{ color: 'var(--grex-muted)' }}>
                    {stage.input} → {stage.output}
                  </p>
                </Card>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 space-y-2.5 max-w-3xl">
          {PIPELINE_STAGES.map((stage) => (
            <p key={stage.name} className="text-[13px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
              <strong style={{ color: 'var(--grex-ink)' }}>{stage.name}.</strong> {stage.description}
            </p>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section>
        <SectionLabel>Product principles</SectionLabel>
        <div className="grid gap-3 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <p className="text-[13.5px] font-semibold mb-1.5" style={{ color: 'var(--grex-ink)' }}>
                {p.title}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                {p.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Data model */}
      <section>
        <SectionLabel>Sparse persistent data model</SectionLabel>
        <div className="space-y-3">
          {DATA_MODEL.map((e, i) => (
            <div key={e.name} className="flex gap-3">
              <div className="flex flex-col items-center pt-2" aria-hidden>
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--grex-accent)' }} />
                {i < DATA_MODEL.length - 1 && (
                  <span className="w-px flex-1 mt-1" style={{ background: 'var(--grex-border)' }} />
                )}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <p className="text-[13.5px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                  {e.name}
                </p>
                <p
                  className="text-[11.5px] mt-0.5 overflow-x-auto whitespace-nowrap"
                  style={{ color: 'var(--grex-muted)', fontFamily: 'var(--grex-font-mono)' }}
                >
                  {e.fields.join(' · ')}
                </p>
                <p className="text-[13px] mt-1 leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                  {e.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Build plan */}
      <section>
        <SectionLabel>Build order — and what this prototype already covers</SectionLabel>
        <div className="space-y-3">
          {MILESTONES.map((m) => (
            <Card key={m.name}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="text-[13.5px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                  {m.name}
                </p>
                <p className="text-[12px]" style={{ color: 'var(--grex-accent)' }}>
                  {m.prototype}
                </p>
              </div>
              <p className="text-[13px] mt-1 leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                {m.detail}
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-[13px] leading-relaxed" style={{ color: 'var(--grex-muted)' }}>
          The live &ldquo;check your own text&rdquo; mode in this prototype runs the real pipeline
          shape — model-driven extraction, live web evidence, per-claim evaluation, v0.1 scoring,
          one rubric skill per surface — against a hosted frontier model. The production build
          swaps in the self-hosted open-weight model and search provider behind the same
          abstractions; nothing about the surfaces changes. {GREX_BRAND.showPoweredBy && 'Prototype by Tweed Collective.'}
        </p>
      </section>
    </div>
  )
}
