'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import TechSpiral from './ui/tech-spiral'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void">
      {/* Tech Spiral Decoration */}
      <TechSpiral />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-violet/5" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-sage/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-violet/10 via-transparent to-transparent opacity-50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-3 h-3 bg-sage-light rounded-full animate-pulse-glow" />
        <div className="absolute top-60 left-40 w-2 h-2 bg-violet rounded-full animate-pulse-glow animation-delay-1000" />
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-violet-light rounded-full animate-pulse-glow animation-delay-2000" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-sage rounded-full animate-pulse-glow animation-delay-500" />
        {/* Larger ambient glows */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-violet/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            <span className="w-6 h-px bg-violet" />
            <span className="mono-label text-violet-light">AI × Life Sciences</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-balance animate-fade-up animation-delay-100">
            <span className="text-cream">Operators and builders at the frontier of </span>
            <span className="text-highlight">AI</span>
            <span className="text-cream"> × </span>
            <span className="text-highlight">life sciences</span>
            <span className="text-cream">.</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl text-violet-light mb-8 animate-fade-up animation-delay-150 font-display italic">
            We advise. We embed. We build.
          </p>

          {/* Subheadline */}
          <p className="body-large mb-12 text-balance max-w-2xl text-stone animate-fade-up animation-delay-200">
            Advisory for investors who need conviction. Fractional leadership with equity alignment. 
            Venture building from zero. All at the convergence of biotechnology and artificial intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
            <a href="mailto:hello@tweedcollective.ai" className="btn-primary text-base px-8 py-4 group">
              <span>Reach Out</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <Link href="/services" className="btn-outline text-base px-8 py-4">
              <span>Our Services</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </section>
  )
}

export default Hero
