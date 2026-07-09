import React from 'react'
import type { Metadata } from 'next'
import EmailCTA from '@/components/EmailCTA'

export const metadata: Metadata = {
  title: 'About',
  description: 'A small firm of operators working at the intersection of AI and life sciences.',
}

export default function AboutPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      {/* About Tweed */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <span className="mono-label mb-4 block">// About Tweed</span>
            <h1 className="text-cream mb-6">About Tweed</h1>
            <div className="space-y-4 text-stone body-large">
              <p>
                Tweed Collective is a small advisory firm working at the intersection of AI and
                life sciences. We do three things. We advise investors and executives on AI
                strategy and diligence. We embed as operators inside product and commercial teams.
                And we build software when building is the fastest way to answer the question.
              </p>
              <p>
                Most firms in this space pick one lane: strategy decks, staffing, or dev work. We
                think the interesting problems sit across all three, and that the same person
                should be able to size a market, run the workstream, and ship the tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <span className="mono-label mb-4 block">// Founder</span>
            <h2 className="text-cream mb-6">Nate Beyor, Founder</h2>
            <div className="space-y-4 text-stone">
              <p>
                Nate is a business-first operator. He starts with the commercial question, how does
                this make money, and brings technology to that problem rather than the other way
                around.
              </p>
              <p>
                He holds a PhD in Bioengineering from UC Berkeley and a BS from Yale. He spent over
                a decade in consulting at McKinsey and BCG, where he led BCG's global health tech
                business and built new ventures at BCG Digital Ventures. He has held operating
                roles in biotech and is currently Chief Business Officer at Salt AI, an enterprise
                AI orchestration platform serving life sciences and financial services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The bench */}
      <section className="section bg-graphite">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <span className="mono-label mb-4 block">// The bench</span>
            <h2 className="text-cream mb-6">The bench</h2>
            <p className="text-stone body-large">
              Tweed works with a small group of operating partners. Each has run the function they
              advise on. We stay small on purpose. Clients get the people they met, not a staffing
              pyramid.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
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
