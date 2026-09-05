import React from 'react'
import Hero from '@/components/Hero'
import DiligenceStrip from '@/components/DiligenceStrip'
import PostCloseStrip from '@/components/PostCloseStrip'
import Services from '@/components/Services'
import ThreeStarts from '@/components/ThreeStarts'
import RecentWork from '@/components/RecentWork'
import TeamGrid from '@/components/TeamGrid'
import HowWeWork from '@/components/HowWeWork'
import EmailCTA from '@/components/EmailCTA'
import TweedBackground from '@/components/ui/tweed-background'

export default function Home() {
  return (
    <div className="relative">
      <TweedBackground />

      <Hero />
      <DiligenceStrip />
      <PostCloseStrip />
      <Services />
      <ThreeStarts />
      <RecentWork />

      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-graphite to-void" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-display text-xl md:text-2xl text-stone leading-relaxed mb-6">
              We are not a 200-person consultancy.
            </p>
            <p className="font-display text-xl md:text-2xl text-stone leading-relaxed mb-6">
              We do not staff junior analysts on your deal.
            </p>
            <p className="font-display text-xl md:text-2xl text-stone leading-relaxed mb-10">
              We do not sell a tool and leave the operating plan unwritten.
            </p>
            <div className="h-px w-24 bg-gold/50 mx-auto mb-10" />
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed mb-4">
              You get principals who have sat in the seats the work requires.
            </p>
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed">
              The same people write the scorecard and can run it after close.
            </p>
          </div>
        </div>
      </section>

      <HowWeWork />
      <TeamGrid />

      <section className="section bg-carbon relative overflow-hidden border-t border-slate/20">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let&apos;s Connect</span>
            <h2 className="text-cream mb-4">A live deal. A portfolio. One company.</h2>
            <p className="body-large text-stone mb-8">
              Tell us which. We will tell you what the first page looks like.
            </p>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
