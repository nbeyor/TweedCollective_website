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
import { homepage } from '@/data/marketing'

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
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed">
              {homepage.positioning}
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
