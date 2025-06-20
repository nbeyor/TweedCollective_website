'use client'

import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-subtle">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-40" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage/5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-terra/5 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-coral/5 rounded-full animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* KPI Strip - Moved to hero for immediate credibility */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-8 px-6 py-3 bg-cream/80 backdrop-blur-sm rounded-full shadow-sophisticated">
              <div className="flex items-center space-x-2">
                <span className="data-metric">20+</span>
                <span className="text-small text-warm-gray">years expertise</span>
              </div>
              <div className="w-px h-4 bg-stone"></div>
              <div className="flex items-center space-x-2">
                <span className="data-metric">$50M+</span>
                <span className="text-small text-warm-gray">client value generated</span>
              </div>
              <div className="w-px h-4 bg-stone"></div>
              <div className="flex items-center space-x-2">
                <span className="data-metric">3.2×</span>
                <span className="text-small text-warm-gray">average revenue growth</span>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="mb-8 text-balance">
            <span className="text-charcoal">Scale health-tech revenue </span>
            <span className="text-sage">2× faster</span>
            <span className="text-charcoal"> with fractional operators and AI playbooks</span>
          </h1>

          {/* Subheadline */}
          <p className="body-large mb-12 text-balance max-w-3xl mx-auto">
            We embed proven C-suite talent directly into growth-stage life sciences companies, 
            delivering measurable results in 100 days or less.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Book a 30-min Call
            </Link>
            <Link href="/services" className="btn-outline text-lg px-8 py-4">
              Explore Services
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-cream/60 backdrop-blur-sm rounded-lg">
              <div className="data-metric text-3xl mb-2">100</div>
              <div className="text-small text-warm-gray">Days to measurable results</div>
            </div>
            <div className="text-center p-6 bg-cream/60 backdrop-blur-sm rounded-lg">
              <div className="data-metric text-3xl mb-2">15+</div>
              <div className="text-small text-warm-gray">Companies accelerated</div>
            </div>
            <div className="text-center p-6 bg-cream/60 backdrop-blur-sm rounded-lg">
              <div className="data-metric text-3xl mb-2">$10M</div>
              <div className="text-small text-warm-gray">Target ARR milestone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-sage rounded-full flex justify-center">
          <div className="w-1 h-3 bg-sage rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero 