import React from 'react'
import type { Metadata } from 'next'
import {
  grades,
  homepage,
  ladder,
  offerings,
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
    'How we engage. Diligence first. Then the operating framework the team runs after close. Advise, Embed, and Build are how we staff it.',
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
            <span className="mono-label mb-4 block">{offerings.eyebrow}</span>
            <h1 className="text-cream mb-6">{offerings.headline}</h1>
            <p className="body-large text-stone">{offerings.body}</p>
          </div>
        </div>
      </section>

      {/* A - Diligence */}
      <section className="section bg-carbon" id="diligence">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">{offerings.diligence.label}</span>
            <h2 className="text-cream mb-4">{offerings.diligence.headline}</h2>
            <p className="body-large text-stone">{offerings.diligence.body}</p>
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

      {/* B - Post-close */}
      <section className="section bg-void" id="post-close">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">{offerings.postClose.label}</span>
            <h2 className="text-cream mb-4">{offerings.postClose.headline}</h2>
            <p className="body-large text-stone">{offerings.postClose.body}</p>
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
            <p className="text-stone text-sm leading-relaxed">{offerings.leversNote}</p>
          </div>
        </div>
      </section>

      {/* C - Capability ladder, text only */}
      <section className="section bg-carbon" id="ladder">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">{offerings.ladder.label}</span>
            <h2 className="text-cream mb-4">{offerings.ladder.headline}</h2>
            <p className="body-large text-stone">{offerings.ladder.body}</p>
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

      {/* D - Pricing */}
      <section className="section bg-graphite" id="pricing">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="mono-label mb-4 block">{offerings.pricing.label}</span>
            <h2 className="text-cream mb-4">{offerings.pricing.headline}</h2>
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
            <span className="mono-label mb-4 block">{homepage.connect.eyebrow}</span>
            <h2 className="text-cream mb-4">{homepage.connect.headline}</h2>
            <p className="body-large text-stone mb-8">{homepage.connect.body}</p>
            <EmailCTA label={homepage.hero.primaryCta} />
          </div>
        </div>
      </section>
    </div>
  )
}
