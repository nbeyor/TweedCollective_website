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

      {/* Trusted By Section */}
      <section className="section bg-graphite relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-carbon to-graphite" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="mono-label mb-4 block">// Our Network</span>
            <h2 className="text-cream mb-4">Trusted by Health-Tech Leaders</h2>
            <p className="body-large text-stone">
              Companies we've helped scale and accelerate
            </p>
          </div>
          <div className="flex items-center justify-center flex-wrap gap-8 opacity-40">
            <div className="w-32 h-16 bg-slate/50 rounded-lg flex items-center justify-center border border-zinc/30">
              <span className="text-sm text-zinc font-mono">Logo 1</span>
            </div>
            <div className="w-32 h-16 bg-slate/50 rounded-lg flex items-center justify-center border border-zinc/30">
              <span className="text-sm text-zinc font-mono">Logo 2</span>
            </div>
            <div className="w-32 h-16 bg-slate/50 rounded-lg flex items-center justify-center border border-zinc/30">
              <span className="text-sm text-zinc font-mono">Logo 3</span>
            </div>
            <div className="w-32 h-16 bg-slate/50 rounded-lg flex items-center justify-center border border-zinc/30">
              <span className="text-sm text-zinc font-mono">Logo 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-void relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-violet/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let's Connect</span>
            <h2 className="text-cream mb-4">Ready to accelerate?</h2>
            <p className="body-large text-stone mb-8">
              Whether you need strategic advisory, hands-on operators, or a co-founding partner—we're here to help.
            </p>
            <Link href="/contact" className="btn-primary text-lg px-8 py-4 group">
              <span>Book a Call</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
