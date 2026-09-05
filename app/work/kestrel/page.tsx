import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { kestrel } from '@/data/work'
import WorkDisclaimer from '@/components/WorkDisclaimer'

export const metadata: Metadata = {
  title: 'Project Kestrel',
  description:
    'Illustrative post-close operating shape in industrial software. Weeks 1–20 and six workstreams. The tool decision is the smallest part. Figures invented.',
}

export default function KestrelPage() {
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
            <h1 className="text-cream mb-3">{kestrel.name}</h1>
            <p className="text-gold mb-6">{kestrel.sector}</p>
            <p className="body-large text-stone mb-8">{kestrel.dek}</p>
            <p className="text-cream text-lg leading-relaxed">{kestrel.principle}</p>
          </div>
        </div>
      </section>

      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="mono-label mb-4 block">// Weeks 1–20</span>
            <h2 className="text-cream mb-4">The shape of the program</h2>
            <p className="text-stone">
              Diagnose. Fund one win. Measure it. Validate before the next tranche. Stage what
              remains. Twenty weeks is enough to know if the thesis is real.
            </p>
          </div>

          <div className="max-w-3xl space-y-4">
            {kestrel.weeks.map((block) => (
              <div key={block.range} className="card p-6 md:p-8">
                <p className="mono-label mb-2">{block.range}</p>
                <h3 className="text-cream mb-3">{block.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{block.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-void">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="mono-label mb-4 block">// Six workstreams</span>
            <h2 className="text-cream mb-4">What actually gets staffed</h2>
            <p className="text-stone">
              Tooling is on the list so it stays in its place. It is not the program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kestrel.workstreams.map((stream, i) => (
              <div key={stream.name} className="card p-6">
                <span className="font-mono text-sm text-zinc mb-3 block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-cream text-lg mb-3">{stream.name}</h3>
                <p className="text-stone text-sm leading-relaxed">{stream.body}</p>
              </div>
            ))}
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
