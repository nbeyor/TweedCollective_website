import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { starts } from '@/data/marketing'

export default function ThreeStarts({
  heading = 'Three ways to start',
  eyebrow = '// Start',
}: {
  heading?: string
  eyebrow?: string
}) {
  return (
    <section className="section bg-carbon relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 max-w-3xl">
          <span className="mono-label mb-4 block">{eyebrow}</span>
          <h2 className="text-cream mb-4">{heading}</h2>
          <p className="body-large text-stone">
            A live deal, a portfolio screen, or one company. Same spine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {starts.map((start, i) => (
            <Link
              key={start.id}
              href={`/contact#${start.id}`}
              className="card group p-8 hover:-translate-y-1 transition-transform flex flex-col"
            >
              <span className="font-mono text-sm text-zinc mb-4 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-cream mb-3">{start.title}</h3>
              <p className="text-stone text-sm leading-relaxed flex-grow">{start.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm text-sage-light group-hover:text-cream transition-colors">
                Start this conversation
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
