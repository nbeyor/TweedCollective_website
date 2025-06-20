'use client'

import React from 'react'
import Image from 'next/image'
import { useProjects } from '@/hooks/useAirtable'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CaseStudies() {
  const { projects, loading, error } = useProjects()

  const projectsToDisplay = error || projects.length === 0 
    ? [
        {
          id: '1',
          name: "HealthTech Pioneer",
          logo: "/logos/placeholder1.svg",
          category: "Operations",
          headline: "Accelerated GTM execution leading to 3x revenue growth in 12 months",
          tags: ["Digital Health", "2023"]
        },
        {
          id: '2',
          name: "AI Diagnostics",
          logo: "/logos/placeholder2.svg",
          category: "Advisory",
          headline: "Strategic repositioning and pricing optimization yielding 70% margin improvement",
          tags: ["AI/ML", "2023"]
        },
        {
          id: '3',
          name: "Care Delivery Platform",
          logo: "/logos/placeholder3.svg",
          category: "Incubation",
          headline: "Zero-to-one build and successful seed round of $3M",
          tags: ["Healthcare", "2022"]
        }
      ]
    : projects

  return (
    <section className="section bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Signature Projects</h2>
          <p className="body-large max-w-2xl mx-auto">
            Real results from our hands-on partnerships with category-defining companies.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-stone rounded-t-lg"></div>
                <div className="p-6 bg-stone/50 rounded-b-lg">
                  <div className="h-4 bg-stone/80 rounded mb-4 w-1/3"></div>
                  <div className="h-6 bg-stone/80 rounded mb-2"></div>
                  <div className="h-6 bg-stone/80 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsToDisplay.slice(0,3).map((project) => (
              <div 
                key={project.id}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                {/* Logo Area */}
                <div className="h-40 bg-stone/20 flex items-center justify-center p-8 rounded-t-lg">
                  <div className="w-32 h-20 relative grayscale group-hover:grayscale-0 transition-all">
                    {project.logo ? (
                      <Image
                        src={project.logo}
                        alt={`${project.name} logo`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-warm-gray">{project.name}</div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-primary">{project.category}</span>
                    <div className="flex gap-2">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="badge-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="body font-medium group-hover:text-sage transition-colors text-balance">
                    {project.headline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link href="/projects" className="btn-outline inline-flex items-center space-x-2">
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
} 