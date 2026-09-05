import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { workProjects } from '@/data/work'

type Project = (typeof workProjects)[number]

export default function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="card group p-8 flex flex-col h-full hover:-translate-y-1 transition-transform"
    >
      <span className="mono-label mb-4 block">Illustrative worked example</span>
      <h3 className="text-cream mb-2">{project.name}</h3>
      <p className="text-sm text-gold mb-4">{project.sector}</p>
      <p className="text-stone text-sm leading-relaxed flex-grow">{project.tease}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm text-sage-light group-hover:text-cream transition-colors">
        Read the example
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </Link>
  )
}
