import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import OperatorCarousel from '@/components/OperatorCarousel'
import { getOperators } from '@/lib/airtable'

export default async function Home() {
  // Fetch operators from Airtable
  const operators = await getOperators();

  return (
    <>
      <Hero />
      
      {/* Operating Partners Carousel */}
      <OperatorCarousel operators={operators} />
      
      {/* What We Do */}
      <Services />

      {/* Logo Carousel - Placeholder */}
      <section className="section bg-stone/30 relative">
        {/* Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/4 via-transparent to-purple-600/4"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="mb-4">Trusted by Health-Tech Leaders</h2>
            <p className="body-large text-warm-gray">
              Companies we've helped scale and accelerate
            </p>
          </div>
          <div className="flex items-center justify-center space-x-12 opacity-50">
            <div className="w-32 h-16 bg-stone rounded-lg flex items-center justify-center">
              <span className="text-sm text-warm-gray">Logo 1</span>
            </div>
            <div className="w-32 h-16 bg-stone rounded-lg flex items-center justify-center">
              <span className="text-sm text-warm-gray">Logo 2</span>
            </div>
            <div className="w-32 h-16 bg-stone rounded-lg flex items-center justify-center">
              <span className="text-sm text-warm-gray">Logo 3</span>
            </div>
            <div className="w-32 h-16 bg-stone rounded-lg flex items-center justify-center">
              <span className="text-sm text-warm-gray">Logo 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Tools */}
      <section className="section bg-gradient-animated relative">
        {/* Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/8"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="mb-6 text-cream">Try our AI Sprint Planner</h3>
            <p className="body-large mb-8 text-cream/90">
              Upload your goals and get a 100-day roadmap in seconds
            </p>
            <a href="/tools" className="btn-primary bg-cream text-charcoal hover:bg-cream/90">
              Launch Tool
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-8">Need revenue acceleration?</h2>
            <a href="/contact" className="btn-primary text-lg px-8 py-4">
              Book a Call
            </a>
          </div>
        </div>
      </section>
    </>
  )
} 