import React from 'react'
import type { Metadata } from 'next'
import {
  grades,
  ladder,
  phases,
  postCloseSteps,
  pricingPoints,
  readinessDimensions,
  valueLevers,
} from '@/data/marketing'
import EmailCTA from '@/components/EmailCTA'

export const metadata: Metadata = {
  title: 'Offerings',
  description:
    'How Tweed engages: AI diligence across four phases, a post-close operating framework, and a capability ladder of advise, embed, and build.',
}

const gradeTone: Record<string, string> = {
  Strong: 'bg-sage/15 text-sage-light',
  Conditional: 'bg-gold/15 text-gold',
  'High-risk': 'bg-rust/15 text-rust-light',
}

export default function ServicesPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Offerings</span>
            <h1 className="text-cream mb-6">How we engage</h1>
            <p className="body-large text-stone">
              Diligence first. Then the operating framework the team runs after close. Advise,
              Embed, and Build are how we staff the work — not the homepage thesis.
            </p>
          </div>
        </div>
      </section>

      {/* A — Diligence */}
      <section className="section bg-carbon" id="diligence">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">A · Diligence</span>
            <h2 className="text-cream mb-4">Four phases. A scorecard. Named conditions.</h2>
            <p className="body-large text-stone">
              Every phase opens with a one-page answer and closes with a grade. Conditional names
              the condition. If the condition cannot be written, the grade is High-risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {phases.map((phase, i) => (
              <div key={phase.name} className="card p-8">
                <span className="font-mono text-sm text-zinc mb-3 block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-cream mb-3">{phase.name}</h3>
                <p className="text-stone text-sm leading-relaxed mb-4">{phase.summary}</p>
                <p className="text-cream text-sm">{phase.answer}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {grades.map((grade) => (
              <div key={grade.name} className="card p-6">
                <span className={`badge mb-4 ${gradeTone[grade.name]}`}>{grade.name}</span>
                <p className="text-stone text-sm leading-relaxed">{grade.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B — Post-close */}
      <section className="section bg-void" id="post-close">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">B · Post-close</span>
            <h2 className="text-cream mb-4">The operating framework after close</h2>
            <p className="body-large text-stone">
              Initiative portfolio screen. Then readiness — six dimensions, 25 elements. Then fund,
              measure, validate, stage. The first move is the smallest 90-day win that tests the
              thesis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {readinessDimensions.map((dimension) => (
              <div key={dimension.name} className="card p-6">
                <h3 className="text-cream text-lg mb-3">{dimension.name}</h3>
                <p className="text-stone text-sm leading-relaxed">{dimension.summary}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {postCloseSteps.map((step) => (
              <div key={step.name} className="card p-6">
                <h3 className="text-cream text-lg mb-3">{step.name}</h3>
                <p className="text-stone text-sm leading-relaxed">{step.summary}</p>
              </div>
            ))}
          </div>

          <div className="card p-8 max-w-3xl">
            <p className="mono-label mb-3">Four value levers</p>
            <p className="text-cream text-lg mb-3">{valueLevers.join(' · ')}</p>
            <p className="text-stone text-sm leading-relaxed">
              If an initiative cannot be scored on one of these, it is not funded. The 90-day win
              is the smallest test that would change a belief on the scorecard.
            </p>
          </div>
        </div>
      </section>

      {/* C — Capability ladder — TEXT ONLY */}
      <section className="section bg-carbon" id="ladder">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">C · Capability ladder</span>
            <h2 className="text-cream mb-4">Advise. Embed. Build.</h2>
            <p className="body-large text-stone">
              Decision tools in days. Operating tools in weeks. Working systems in weeks. Production
              at scale is assembled, not staffed as a body shop.
            </p>
          </div>

          <div className="max-w-3xl space-y-10">
            {ladder.map((rung) => (
              <div key={rung.title} id={rung.title.toLowerCase()}>
                <div className="mb-4">
                  <span className="font-mono text-sm text-zinc block">{rung.number}</span>
                  <h3 className="text-cream">{rung.title}</h3>
                  <p className="mono-label text-xs mt-2">{rung.cadence}</p>
                </div>
                <p className="text-stone body-large mb-4">{rung.summary}</p>
                <ul className="space-y-2">
                  {rung.outputs.map((output) => (
                    <li key={output} className="text-sm text-stone flex items-start gap-2">
                      <span className="text-gold font-mono shrink-0">–</span>
                      <span>{output}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D — Pricing */}
      <section className="section bg-graphite" id="pricing">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">D · Pricing</span>
            <h2 className="text-cream mb-4">What we will and will not take</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingPoints.map((point) => (
              <div key={point.title} className="card p-6">
                <h3 className="text-cream text-lg mb-3">{point.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let&apos;s Connect</span>
            <h2 className="text-cream mb-4">Start with the work in front of you</h2>
            <p className="body-large text-stone mb-8">
              Live deal, portfolio screen, or one-company program.
            </p>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
