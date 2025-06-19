'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

const Hero = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-navy-50 to-primary-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Operations · Advisory · Incubation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 leading-tight">
            Turn high-potential{' '}
            <span className="gradient-text">health-tech</span>{' '}
            businesses into category leaders
          </h1>

          {/* Value Proposition */}
          <p className="text-xl md:text-2xl text-navy-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            A fractional-operator platform that helps growth-stage health-tech companies and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/contact" className="btn-primary flex items-center space-x-2">
              <span>Let's Talk</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/services" className="btn-outline flex items-center space-x-2">
              <span>Explore Services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">20+</div>
              <div className="text-navy-600">Years of Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">$50M+</div>
              <div className="text-navy-600">Value Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
              <div className="text-navy-600">Companies Accelerated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 