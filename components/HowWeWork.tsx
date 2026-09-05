import React from 'react'
import { pricingPoints } from '@/data/marketing'

export default function HowWeWork() {
  return (
    <section className="section bg-graphite relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mb-12">
          <span className="mono-label mb-4 block">// How we engage</span>
          <h2 className="text-cream mb-4">Pricing is a filter</h2>
          <p className="body-large text-stone">
            We work on a project or retained basis. Not time and materials. Scope is fixed so
            incentives sit on the output, not the hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pricingPoints.map((point) => (
            <div key={point.title} className="card p-6">
              <h3 className="text-cream text-lg mb-3">{point.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
