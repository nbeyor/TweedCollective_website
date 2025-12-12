'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react'
import { Partner } from '@/lib/airtable'

interface PartnerCarouselProps {
  partners: Partner[]
}

export default function PartnerCarousel({ partners }: PartnerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    if (partners.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [partners.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length)
  }

  if (partners.length === 0) {
    return (
      <section className="section bg-stone/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Our Operating Partners</h2>
          <div className="text-center text-warm-gray">
            <p>Meet our team of fractional operators and advisors.</p>
          </div>
        </div>
      </section>
    )
  }

  const currentPartner = partners[currentIndex]

  return (
    <section className="section bg-stone/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our Operating Partners</h2>
          <p className="body-large max-w-2xl mx-auto">
            Proven C-suite talent with deep expertise in health-tech scaling and revenue acceleration
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-cream/90 backdrop-blur-sm rounded-full shadow-sophisticated flex items-center justify-center hover:bg-cream transition-colors"
              aria-label="Previous partner"
            >
              <ChevronLeft className="icon-lg text-charcoal" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-cream/90 backdrop-blur-sm rounded-full shadow-sophisticated flex items-center justify-center hover:bg-cream transition-colors"
              aria-label="Next partner"
            >
              <ChevronRight className="icon-lg text-charcoal" />
            </button>

            {/* Partner Card */}
            <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Partner Image */}
                <div className="relative h-96 md:h-full bg-gradient-to-br from-sage/20 to-terra/20">
                  {currentPartner.image ? (
                    <img
                      src={currentPartner.image}
                      alt={currentPartner.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-sage/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-4xl font-display text-sage">
                            {currentPartner.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Expertise Tags */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {currentPartner.expertise.slice(0, 3).map((skill, index) => (
                      <span key={index} className="badge-primary text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Partner Info */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-h3 mb-2">{currentPartner.name}</h3>
                    <p className="text-lg text-sage font-medium mb-1">{currentPartner.title}</p>
                    <p className="text-warm-gray">{currentPartner.company}</p>
                  </div>

                  <p className="body mb-6 text-balance">{currentPartner.bio}</p>

                  <div className="flex items-center space-x-4">
                    {currentPartner.linkedin && (
                      <a
                        href={currentPartner.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sage hover:text-sage/80 transition-colors"
                      >
                        <Linkedin className="icon-md" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-sage' : 'bg-stone'
                  }`}
                  aria-label={`Go to partner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
