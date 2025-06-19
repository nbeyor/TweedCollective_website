import React from 'react'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import CaseStudies from '@/components/CaseStudies'

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Operating Partner Carousel */}
      <section className="py-20 bg-neutral-stone/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Our Operating Partners</h2>
          {/* Partner carousel component will go here */}
        </div>
      </section>

      {/* What We Do */}
      <Services />

      {/* Signature Projects */}
      <CaseStudies />

      {/* Live Tools */}
      <section className="py-20 bg-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="mb-6">Try our AI Sprint Planner</h3>
            <p className="body-large mb-8 text-neutral-warm-gray">
              Upload your goals and get a 100-day roadmap in seconds
            </p>
            <button className="btn-primary">Launch Tool</button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-8">Need revenue acceleration?</h2>
            <button className="btn-primary">Book a 30-min call</button>
          </div>
        </div>
      </section>
    </>
  )
} 