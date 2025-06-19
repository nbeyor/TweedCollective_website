'use client'

import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="bg-pattern" />
      
      <div className="container mx-auto px-4 relative">
        {/* Tag Line */}
        <div className="inline-block mb-8 px-4 py-2 bg-primary-sage/5 border border-primary-sage/10 rounded-full">
          <p className="mono text-sm text-primary-sage">Operations · Advisory · Incubation</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl">
          <h1 className="mb-6">
            <span className="text-neutral-charcoal">Turn high-potential </span>
            <span className="text-primary-coral">health</span>
            <span className="text-primary-sage">tech</span>
            <span className="text-neutral-charcoal"> businesses into category leaders</span>
          </h1>

          <p className="body-large mb-12 text-neutral-warm-gray max-w-3xl">
            A fractional-operator platform that helps growth-stage health-tech companies 
            and their investors accelerate revenue and scale through hands-on execution 
            and AI-driven strategy.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/book-call" className="btn-primary">
              Let's Talk
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore Services
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <p className="mono text-4xl font-light text-primary-coral mb-2">20+</p>
            <p className="text-neutral-warm-gray">Years of Experience</p>
          </div>
          <div className="text-center">
            <p className="mono text-4xl font-light text-primary-sage mb-2">$50M+</p>
            <p className="text-neutral-warm-gray">Value Created</p>
          </div>
          <div className="text-center">
            <p className="mono text-4xl font-light text-primary-terra mb-2">15+</p>
            <p className="text-neutral-warm-gray">Companies Accelerated</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 