import React from 'react'
import type { Metadata } from 'next'
import TeamGrid from '@/components/TeamGrid'
import EmailCTA from '@/components/EmailCTA'
import { homepage } from '@/data/marketing'

export const metadata: Metadata = {
  title: 'Operators',
  description:
    'Seniors from operating and building roles. Two or three per workstream. You get the people you met.',
}

export default function OperatorsPage() {
  return (
    <div className="pt-28 bg-void min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Operators</span>
            <h1 className="text-cream mb-6">The bench</h1>
            <p className="body-large text-stone max-w-2xl">
              Seniors from operating and building roles. Two or three per workstream. You get the
              people you met.
            </p>
          </div>
        </div>
      </section>

      <TeamGrid showHeader={false} />

      <section className="section bg-graphite">
        <div className="container mx-auto">
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
