import React from 'react'
import { grades, homepage, phases } from '@/data/marketing'

const gradeTone: Record<string, string> = {
  Strong: 'bg-sage/15 text-sage-light',
  Conditional: 'bg-gold/15 text-gold',
  'High-risk': 'bg-rust/15 text-rust-light',
}

export default function DiligenceStrip() {
  return (
    <section className="section bg-carbon relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-carbon to-graphite" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 max-w-3xl">
          <span className="mono-label mb-4 block">{homepage.diligence.eyebrow}</span>
          <h2 className="text-cream mb-4">{homepage.diligence.headline}</h2>
          <p className="body-large text-stone">{homepage.diligence.body}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate/30 rounded-2xl overflow-hidden mb-12">
          {phases.map((phase, i) => (
            <div key={phase.name} className="bg-carbon p-8">
              <span className="font-mono text-sm text-zinc mb-4 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-cream mb-3">{phase.name}</h3>
              <p className="text-stone text-sm leading-relaxed">{phase.summary}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {grades.map((grade) => (
            <div key={grade.name} className="card p-6">
              <span className={`badge mb-4 ${gradeTone[grade.name]}`}>{grade.name}</span>
              <p className="text-stone text-sm leading-relaxed">{grade.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
