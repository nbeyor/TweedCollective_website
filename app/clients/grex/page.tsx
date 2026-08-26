import Link from 'next/link'
import React from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'

export const metadata = {
  title: `${GREX_BRAND.name} — Prototype Hub`,
  description: 'Clickable prototype of the GREX consumer fact-checking product.',
}

const SURFACES = [
  {
    href: '/clients/grex/browser',
    kicker: 'Surface A',
    title: 'Browser extension',
    description:
      'A floating score appears while you read a real marketing page. The page is checked passively — the score is the whole interface until you ask why.',
  },
  {
    href: '/clients/grex/screenshot',
    kicker: 'Surface B',
    title: 'Screenshot checker',
    description:
      'The normal phone flow: take a screenshot, tap share, send it to GREX, get a score. The image is processed and deleted.',
  },
  {
    href: '/clients/grex/mcp',
    kicker: 'Surface C',
    title: 'Agent verification (MCP)',
    description:
      'One quiet line at the end of an AI response — a score, only when the response contains checkable facts. Ask your own question live.',
  },
]

const COMPANIONS = [
  {
    href: '/clients/grex/architecture',
    title: 'How the verifier works',
    description:
      'The pipeline, the scoring math with a worked example, the data model, and the build plan.',
  },
]

export default function GrexHubPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <header className="mb-12">
        <div className="flex items-baseline gap-4 flex-wrap">
          <h1
            className="text-4xl font-semibold tracking-tight"
            style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}
          >
            {GREX_BRAND.name}
          </h1>
          <span className="text-sm" style={{ color: 'var(--grex-muted)' }}>
            {GREX_BRAND.tagline}
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">{GREX_BRAND.thesis}</p>
        <p className="mt-2 max-w-2xl text-[13px]" style={{ color: 'var(--grex-muted)' }}>
          Clickable prototype. The interaction surfaces below are simulations; the agent surface is
          live — ask a question and the answer is verified against real web evidence.
        </p>
      </header>

      <section>
        <h2
          className="text-[12px] uppercase tracking-[0.15em] font-medium mb-4"
          style={{ color: 'var(--grex-muted)' }}
        >
          Product surfaces
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {SURFACES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block p-5 transition-transform hover:-translate-y-0.5"
              style={{
                background: 'var(--grex-surface)',
                border: '1px solid var(--grex-border)',
                borderRadius: 'var(--grex-radius-card)',
              }}
            >
              <p
                className="text-[11px] uppercase tracking-[0.12em] mb-2"
                style={{ color: 'var(--grex-accent)' }}
              >
                {s.kicker}
              </p>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
                {s.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2
          className="text-[12px] uppercase tracking-[0.15em] font-medium mb-4"
          style={{ color: 'var(--grex-muted)' }}
        >
          Under the hood
        </h2>
        <div className="grid gap-4 md:grid-cols-1 max-w-xl">
          {COMPANIONS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block p-5 transition-transform hover:-translate-y-0.5"
              style={{
                background: 'var(--grex-surface-raised)',
                border: '1px solid var(--grex-border)',
                borderRadius: 'var(--grex-radius-card)',
              }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
                {c.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer
        className="mt-14 pt-6 text-[11.5px] leading-relaxed"
        style={{ borderTop: '1px solid var(--grex-border)', color: 'var(--grex-muted)' }}
      >
        <p>
          Demo content: the browser scenario recreates public marketing content from
          functionhealth.com with verdicts grounded in public press coverage (no affiliation); the
          screenshot and agent scenarios are fully fictional — no real company, product, or person
          is represented. Scores are illustrative of the GREX methodology (v0.1), not fact-checks
          of record.
          {GREX_BRAND.showPoweredBy && ' Prototype by Tweed Collective.'}
        </p>
      </footer>
    </div>
  )
}
