import React from 'react'
import type { Metadata } from 'next'
import { workProjects } from '@/data/work'
import WorkCard from '@/components/WorkCard'
import WorkDisclaimer from '@/components/WorkDisclaimer'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Illustrative worked examples of AI diligence and post-close operating work. Figures are invented. Not client deliverables.',
}

export default function WorkIndexPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Work</span>
            <h1 className="text-cream mb-6">Illustrative worked examples</h1>
            <p className="body-large text-stone mb-6">
              Three blinded projects. The method, not the client. Each page is a fragment of how
              we write diligence and run the operating spine after close.
            </p>
            <WorkDisclaimer />
          </div>
        </div>
      </section>

      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workProjects.map((project) => (
              <WorkCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
