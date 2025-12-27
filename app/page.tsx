import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import OperatorCarousel from '@/components/OperatorCarousel'
import TweedBackground from '@/components/ui/tweed-background'
import { getOperators } from '@/lib/airtable'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function Home() {
  // Fetch operators from Airtable
  const operators = await getOperators();

  return (
    <div className="relative">
      {/* Global Tweed Network Background */}
      <TweedBackground />
      
      <Hero />
      
      {/* Operating Partners Carousel */}
      <OperatorCarousel operators={operators} />
      
      {/* What We Do */}
      <Services />

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
            <div className="h-px w-24 bg-sage/50 mx-auto mb-10" />
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed mb-4">
              You get principals who've operated in the roles you're trying to fill.
            </p>
            <p className="font-display text-xl md:text-2xl text-cream leading-relaxed">
              People who've built the APIs, closed the deals, and presented to the boards.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-carbon relative overflow-hidden border-t border-slate/20">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sage/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-taupe/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let's Connect</span>
            <h2 className="text-cream mb-4">Let's talk</h2>
            <p className="body-large text-stone mb-8">
              Whether you need conviction on a deal, hands-on operators with skin in the game, or a co-founding partner at the frontier—we're here.
            </p>
            <a href="mailto:hello@tweedcollective.ai" className="btn-primary text-lg px-8 py-4 group">
              <span>Reach Out</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
