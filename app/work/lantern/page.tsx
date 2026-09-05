import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { lantern } from '@/data/work'
import WorkDisclaimer from '@/components/WorkDisclaimer'

export const metadata: Metadata = {
  title: 'Project Lantern',
  description:
    'Illustrative post-close readiness extract in specialty insurance. Element scores, fast path to a 3, and sprint shape. Figures invented.',
}

function scoreTone(score: number): string {
  if (score >= 4) return 'text-sage-light'
  if (score === 3) return 'text-gold'
  return 'text-rust-light'
}

export default function LanternPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="mb-4">
              <Link href="/work" className="text-sm text-stone hover:text-cream transition-colors">
                ← Work
              </Link>
            </p>
            <span className="mono-label mb-4 block">Illustrative worked example</span>
            <h1 className="text-cream mb-3">{lantern.name}</h1>
            <p className="text-gold mb-6">{lantern.sector}</p>
            <p className="body-large text-stone">{lantern.dek}</p>
          </div>
        </div>
      </section>

      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="mono-label mb-4 block">// Readiness extract</span>
            <h2 className="text-cream mb-4">Six dimensions. Element scores.</h2>
            <p className="text-stone">
              The full scorecard is 25 elements. This is a working extract. A 3 is the minimum
              to fund. Below that, the first job is the path to a 3 — not a model.
            </p>
          </div>

          <div className="space-y-4">
            {lantern.dimensions.map((dimension) => (
              <div key={dimension.name} className="card p-6 md:p-8">
                <h3 className="text-cream mb-5">{dimension.name}</h3>
                <ul className="space-y-4">
                  {dimension.elements.map((element) => (
                    <li
                      key={element.name}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
                    >
                      <span
                        className={`font-mono text-lg w-8 shrink-0 ${scoreTone(element.score)}`}
                      >
                        {element.score}
                      </span>
                      <div>
                        <p className="text-cream text-sm font-medium mb-1">{element.name}</p>
                        <p className="text-stone text-sm leading-relaxed">{element.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-void">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Fast path to a 3</span>
            <h2 className="text-cream mb-3">{lantern.fastPath.element}</h2>
            <p className="text-gold mb-6">
              {lantern.fastPath.from} → {lantern.fastPath.to}
            </p>
            <p className="text-cream text-lg leading-relaxed mb-8">{lantern.fastPath.shape}</p>
            <ul className="space-y-3">
              {lantern.fastPath.steps.map((step) => (
                <li key={step} className="text-stone leading-relaxed flex gap-3">
                  <span className="text-gold font-mono shrink-0">–</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-graphite">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Sprint shape</span>
            <h2 className="text-cream mb-8">What the first sprint actually is</h2>
            <dl className="space-y-6">
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-zinc mb-2">Length</dt>
                <dd className="text-cream">{lantern.sprint.length}</dd>
              </div>
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-zinc mb-2">Owner</dt>
                <dd className="text-cream">{lantern.sprint.owner}</dd>
              </div>
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-zinc mb-2">Scope</dt>
                <dd className="text-cream">{lantern.sprint.scope}</dd>
              </div>
              <div>
                <dt className="text-xs font-mono uppercase tracking-wider text-zinc mb-2">Out</dt>
                <dd className="text-cream">{lantern.sprint.out}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section-sm bg-void border-t border-slate/20">
        <div className="container mx-auto px-4">
          <WorkDisclaimer />
        </div>
      </section>
    </div>
  )
}
