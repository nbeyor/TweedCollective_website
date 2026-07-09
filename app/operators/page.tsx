import React from 'react'
import type { Metadata } from 'next'
import TeamGrid from '@/components/TeamGrid'
import EmailCTA from '@/components/EmailCTA'

export const metadata: Metadata = {
  title: 'Operators',
  description: 'The Tweed Collective team. A small group of operators who have run the functions they advise on.',
}

export default function OperatorsPage() {
  return (
    <div className="pt-28 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Operators</span>
            <h1 className="text-cream mb-6">The team</h1>
            <p className="body-large text-stone max-w-2xl">
              A small group of operators. Each has run the function they advise on. Clients get
              the people they met, not a staffing pyramid.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <TeamGrid />

      {/* CTA */}
      <section className="section bg-graphite">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let's Connect</span>
            <h2 className="text-cream mb-8">Let's talk</h2>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
