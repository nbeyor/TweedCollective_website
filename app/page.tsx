import React from 'react'
import Hero from '@/components/Hero'
import PartnerCarousel from '@/components/PartnerCarousel'
import Services from '@/components/Services'
import CaseStudies from '@/components/CaseStudies'

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Operating Partners Carousel */}
      <PartnerCarousel />

      {/* What We Do */}
      <Services />

      {/* Signature Projects */}
      <CaseStudies />

      {/* Live Tools */}
      <section className="section bg-gradient-animated">
        <div className="container mx-auto px-4">
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
              Book a 30-min call
            </a>
          </div>
        </div>
      </section>
    </>
  )
} 