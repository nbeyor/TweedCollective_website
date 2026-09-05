import React from 'react'
import type { Metadata } from 'next'
import EmailCTA from '@/components/EmailCTA'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Tweed Collective brings an underwritable standard and a bench of operators to AI diligence and post-close work for private equity.',
}

export default function AboutPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <span className="mono-label mb-4 block">// About Tweed</span>
            <h1 className="text-cream mb-6">The firm already has operators</h1>
            <div className="space-y-4 text-stone body-large">
              <p>
                Private equity already has operators. What it often lacks is an underwritable
                standard for AI — at entry, and in the first year after close. Tweed brings that
                standard, and the bench that can run it.
              </p>
              <p>
                Diligence first: four phases, three grades, named conditions. Then the same spine
                after close: fund, measure, validate, stage. Value is read on four levers — cost,
                speed, quality, revenue.
              </p>
              <p>
                The bench has run those numbers in life sciences and health-tech. That is where the
                depth is. It is not the only market we will underwrite.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                a decade in consulting at McKinsey and BCG, where he led BCG&apos;s global health tech
                business and built new ventures at BCG Digital Ventures. He has held operating
                roles in biotech and is currently Chief Business Officer at Salt AI, an enterprise
                AI orchestration platform serving life sciences and financial services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-graphite">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <span className="mono-label mb-4 block">// The bench</span>
            <h2 className="text-cream mb-6">The bench</h2>
            <p className="text-stone body-large">
              Senior operators from operating and building roles. Two or three per workstream.
              Networks included. Clients get the people they met, not a staffing pyramid.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let&apos;s Connect</span>
            <h2 className="text-cream mb-8">Let&apos;s talk</h2>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
