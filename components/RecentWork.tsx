import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { workProjects } from '@/data/work'
import WorkCard from '@/components/WorkCard'
import WorkDisclaimer from '@/components/WorkDisclaimer'

export default function RecentWork() {
  return (
    <section className="section bg-void relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 max-w-3xl">
          <span className="mono-label mb-4 block">// Work</span>
          <h2 className="text-cream mb-4">Illustrative worked examples</h2>
          <p className="body-large text-stone">
            Three blinded projects. The method, not the client. Figures are invented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {workProjects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <WorkDisclaimer />
          <Link href="/work" className="btn-outline inline-flex items-center gap-2 shrink-0">
            <span>All work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
