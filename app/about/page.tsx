import React from 'react'
import type { Metadata } from 'next'
import EmailCTA from '@/components/EmailCTA'
import { homepage } from '@/data/marketing'

export const metadata: Metadata = {
  title: 'About',
  description:
    'We underwrite AI in diligence, then help the operating team run it after close. Principals only. Depth in life sciences and health-tech.',
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
                Private equity already has operators. What it often lacks is a standard for AI that
                the IC can underwrite, and that the operating team can run after close. That is
                the work.
              </p>
              <p>
                Diligence first: four phases, three grades, named conditions. After close: fund,
                measure, validate, stage. We price cost, speed, quality, and revenue. Those are
                the only levers.
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
              Seniors from operating and building roles. Two or three per workstream. You get the
              people you met.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet/5 to-transparent" />
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
