import React from 'react'
import { postCloseSteps, valueLevers } from '@/data/marketing'

export default function PostCloseStrip() {
  return (
    <section className="section bg-void relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 max-w-3xl">
          <span className="mono-label mb-4 block">// Post-close</span>
          <h2 className="text-cream mb-4">Fund. Measure. Validate. Stage.</h2>
          <p className="body-large text-stone">
            The same spine after close. Value is read on four levers:{' '}
            <span className="text-cream">{valueLevers.map((lever) => lever.toLowerCase()).join(', ')}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {postCloseSteps.map((step, i) => (
            <div key={step.name} className="card p-6">
              <span className="font-mono text-sm text-zinc mb-3 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-cream text-xl mb-3">{step.name}</h3>
              <p className="text-stone text-sm leading-relaxed">{step.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
