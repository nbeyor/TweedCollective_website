import React from 'react'
import Image from 'next/image'

const projects = [
  {
    name: "HealthTech Pioneer",
    logo: "/logos/placeholder1.svg",
    category: "Operations",
    headline: "Accelerated GTM execution leading to 3x revenue growth in 12 months",
    challenge: "Needed to scale commercial team and optimize sales process while maintaining quality of care.",
    approach: "Embedded fractional CRO and RevOps team, implemented new sales enablement tools, and built scalable processes.",
    impact: ["3x revenue growth", "45% reduction in sales cycle", "98% patient satisfaction"],
    tags: ["Digital Health", "2023"]
  },
  {
    name: "AI Diagnostics",
    logo: "/logos/placeholder2.svg",
    category: "Advisory",
    headline: "Strategic repositioning and pricing optimization yielding 70% margin improvement",
    challenge: "Complex pricing model wasn't capturing full value of AI-enabled diagnostic platform.",
    approach: "Conducted market analysis, developed value-based pricing framework, and created new packaging strategy.",
    impact: ["70% margin improvement", "$12M new ARR", "2 enterprise deals closed"],
    tags: ["AI/ML", "2023"]
  },
  {
    name: "Care Delivery Platform",
    logo: "/logos/placeholder3.svg",
    category: "Incubation",
    headline: "Zero-to-one build and successful seed round of $3M",
    challenge: "Needed to validate market opportunity and build MVP for novel care delivery model.",
    approach: "Led customer discovery, prototype development, and go-to-market strategy formulation.",
    impact: ["$3M seed round", "MVP in 4 months", "3 pilot partners signed"],
    tags: ["Healthcare", "2022"]
  }
]

export default function Projects() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <h1 className="mb-6">Our Work</h1>
        <p className="body-large text-neutral-warm-gray max-w-2xl">
          See how we've helped health-tech innovators accelerate growth and achieve their strategic objectives.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-4">
          {["All", "Operations", "Advisory", "Incubation"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${filter === 'All' 
                  ? 'bg-primary-sage text-neutral-cream' 
                  : 'bg-neutral-stone/30 text-neutral-warm-gray hover:bg-primary-sage/10 hover:text-primary-sage'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.name}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
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
              <div className="p-8">
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

                <h3 className="mb-6">{project.headline}</h3>

                <div className="space-y-6">
                  <div>
                    <p className="caption text-primary-sage mb-2">Challenge</p>
                    <p className="text-neutral-warm-gray">{project.challenge}</p>
                  </div>

                  <div>
                    <p className="caption text-primary-sage mb-2">Approach</p>
                    <p className="text-neutral-warm-gray">{project.approach}</p>
                  </div>

                  <div>
                    <p className="caption text-primary-sage mb-2">Impact</p>
                    <div className="flex flex-wrap gap-3">
                      {project.impact.map((metric, i) => (
                        <span 
                          key={i}
                          className="inline-block px-3 py-1 bg-primary-sage/10 text-primary-sage rounded-full text-sm"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-full shadow-sm">
            <p className="mono text-neutral-warm-gray">
              <span className="text-primary-sage font-medium">$500M+</span> new ARR generated for our partners
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 