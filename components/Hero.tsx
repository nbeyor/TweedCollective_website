'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import TechSpiral from './ui/tech-spiral'
import { homepage } from '@/data/marketing'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void">
      <TechSpiral />

      <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-sage/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-gold/15 via-transparent to-transparent opacity-50" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gold/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            <span className="w-6 h-px bg-gold" />
            <span className="mono-label text-gold">{homepage.hero.eyebrow}</span>
          </div>

          <h1 className="mb-6 text-balance animate-fade-up animation-delay-100">
            <span className="text-cream">{homepage.hero.headline}</span>
          </h1>

          <p className="body-large mb-12 text-balance max-w-2xl text-stone animate-fade-up animation-delay-200">
            {homepage.hero.sub}
          </p>

          <div className="animate-fade-up animation-delay-300">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4 group">
                <span>{homepage.hero.primaryCta}</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/work" className="btn-outline text-base px-8 py-4">
                <span>{homepage.hero.secondaryCta}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </section>
  )
}

export default Hero
