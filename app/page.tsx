import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import RecentWork from '@/components/RecentWork'
import TeamGrid from '@/components/TeamGrid'
import HowWeWork from '@/components/HowWeWork'
import EmailCTA from '@/components/EmailCTA'
import TweedBackground from '@/components/ui/tweed-background'

export default function Home() {
  return (
    <div className="relative">
      {/* Global Tweed Network Background */}
      <TweedBackground />

      <Hero />

      {/* What We Do */}
      <Services />

      {/* Recent Work */}
      <RecentWork />

      {/* Team */}
      <TeamGrid />

      {/* What We're Not - Differentiation */}
      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-graphite to-void" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-display text-xl md:text-2xl text-stone leading-relaxed mb-6">
              We're not a 200-person consultancy.
            </p>
            <p className="font-display text-xl md:text-2xl text-stone leading-relaxed mb-6">
              We don't staff junior analysts on your project.
            </p>
            <p className="font-display text-xl md:text-2xl text-stone leading-relaxed mb-10">
              We're not generalists playing in life sciences.
            </p>
            <div className="h-px w-24 bg-gold/50 mx-auto mb-10" />
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed mb-4">
              You get principals who've operated in the roles you're trying to fill.
            </p>
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed">
              People who've built the APIs, closed the deals, and presented to the boards.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <HowWeWork />

      {/* Final CTA */}
      <section className="section bg-carbon relative overflow-hidden border-t border-slate/20">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gold/15 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let's Connect</span>
            <h2 className="text-cream mb-4">Let's talk</h2>
            <p className="body-large text-stone mb-8">
              Whether you need conviction on a deal, operators inside your team, or working software
              that answers the question, we're here.
            </p>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
