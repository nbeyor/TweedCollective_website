'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import DNAHelix from './ui/dna-helix'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void">
      {/* DNA Helix Decoration */}
      <DNAHelix />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-violet/10 via-transparent to-transparent opacity-50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-2 h-2 bg-violet rounded-full animate-pulse-glow" />
        <div className="absolute top-60 left-40 w-1.5 h-1.5 bg-helix-cyan rounded-full animate-pulse-glow animation-delay-1000" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-violet-light rounded-full animate-pulse-glow animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            <span className="w-8 h-px bg-violet" />
            <span className="mono-label">Life Sciences × Artificial Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-8 text-balance animate-fade-up animation-delay-100">
            <span className="text-cream">Strategic intelligence at the intersection of </span>
            <span className="text-highlight">biotechnology</span>
            <span className="text-cream"> and </span>
            <span className="text-highlight">AI</span>
          </h1>

          {/* Subheadline */}
          <p className="body-large mb-12 text-balance max-w-2xl text-stone animate-fade-up animation-delay-200">
            We partner with investors, growth-stage companies, and founding teams to navigate 
            the convergence of life sciences and artificial intelligence—through advisory, 
            fractional leadership, and venture building.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
            <Link href="/contact" className="btn-primary text-base px-8 py-4 group">
              <span>Book a Call</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/services" className="btn-outline text-base px-8 py-4">
              <span>Explore Services</span>
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
