'use client'

import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-subtle">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-40" />
      
      {/* Purple Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/8"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-600/8 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-sage/5 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-60 right-40 w-20 h-20 bg-purple-400/6 rounded-full animate-float animation-delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="mb-8 text-balance">
            <span className="text-charcoal">Scale health-tech revenue </span>
            <span className="text-sage">with fractional operators & AI-powered playbooks</span>
          </h1>

          {/* Subheadline */}
          <p className="body-large mb-12 text-balance max-w-3xl mx-auto">
            We embed proven C-suite talent directly into growth-stage life sciences companies, 
            delivering measurable results in 100 days or less.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Book a Call
            </Link>
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