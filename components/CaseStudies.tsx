'use client'

import React from 'react'
import Image from 'next/image'

const CaseStudies = () => {
  const projects = [
    {
      name: "HealthTech Pioneer",
      logo: "/logos/placeholder1.svg",
      category: "Operations",
      headline: "Accelerated GTM execution leading to 3x revenue growth in 12 months",
      tags: ["Digital Health", "2023"]
    },
    {
      name: "AI Diagnostics",
      logo: "/logos/placeholder2.svg",
      category: "Advisory",
      headline: "Strategic repositioning and pricing optimization yielding 70% margin improvement",
      tags: ["AI/ML", "2023"]
    },
    {
      name: "Care Delivery Platform",
      logo: "/logos/placeholder3.svg",
      category: "Incubation",
      headline: "Zero-to-one build and successful seed round of $3M",
      tags: ["Healthcare", "2022"]
    }
  ]

  return (
    <section className="py-20 bg-neutral-stone/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Signature Projects</h2>
          <p className="body-large text-neutral-warm-gray max-w-2xl mx-auto">
            Real results from our hands-on partnerships with category-defining companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.name}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer"
            >
              {/* Logo Area */}
              <div className="h-40 bg-neutral-stone/20 flex items-center justify-center p-8">
                <div className="w-32 h-32 relative grayscale group-hover:grayscale-0 transition-all">
                  <Image
                    src={project.logo}
                    alt={project.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary-coral">{project.category}</span>
                  <div className="flex gap-2">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 bg-neutral-stone/30 rounded-full text-neutral-warm-gray"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-neutral-charcoal font-medium group-hover:text-primary-sage transition-colors">
                  {project.headline}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Strip */}
        <div className="mt-20 text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-full shadow-sm">
            <p className="mono text-neutral-warm-gray">
              <span className="text-primary-sage font-medium">$500M+</span> new ARR generated for our partners
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies 