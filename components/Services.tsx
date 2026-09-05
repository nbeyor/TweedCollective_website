import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { homepage, ladder } from '@/data/marketing'

const colorClasses: Record<string, { gradient: string; bg: string; dot: string }> = {
  sage: {
    gradient: 'from-sage to-sage-light',
    bg: 'bg-sage/10',
    dot: 'bg-sage',
  },
  taupe: {
    gradient: 'from-taupe to-taupe-light',
    bg: 'bg-taupe/10',
    dot: 'bg-taupe',
  },
  gold: {
    gradient: 'from-gold to-gold-light',
    bg: 'bg-gold/10',
    dot: 'bg-gold',
  },
}

/**
 * Capability ladder - text only. No product chrome, wireframes, or screens.
 */
const Services = () => {
  return (
    <section className="section bg-graphite relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 max-w-3xl">
          <span className="mono-label mb-4 block">{homepage.ladder.eyebrow}</span>
          <h2 className="text-cream mb-4">{homepage.ladder.headline}</h2>
          <p className="body-large text-stone">{homepage.ladder.body}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate/30 rounded-2xl overflow-hidden mb-16">
          {ladder.map((rung) => {
            const colors = colorClasses[rung.color] ?? colorClasses.sage

            return (
              <div
                key={rung.title}
                className="group bg-carbon p-8 hover:bg-graphite transition-all duration-500 relative"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <span className="font-mono text-sm text-zinc mb-4 block">{rung.number}</span>
                <h3 className="text-cream mb-2">{rung.title}</h3>
                <p className="mono-label text-xs mb-4">{rung.cadence}</p>
                <p className="text-stone text-sm leading-relaxed mb-6">{rung.summary}</p>

                <p className="text-xs font-mono uppercase tracking-wider text-zinc mb-3">
                  What you get
                </p>
                <ul className="space-y-2">
                  {rung.outputs.map((output) => (
                    <li key={output} className="text-sm text-stone/80 flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 shrink-0`} />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/services" className="btn-primary inline-flex items-center gap-2 group">
            <span>How we engage</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Services
