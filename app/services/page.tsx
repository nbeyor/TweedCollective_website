import React from 'react'
import type { Metadata } from 'next'
import { Target, Users, Rocket } from 'lucide-react'
import HowWeWork from '@/components/HowWeWork'
import EmailCTA from '@/components/EmailCTA'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Advisory, embedded operating roles, and small software builds for investors and life sciences companies.',
}

const services = [
  {
    number: '01',
    title: 'Advise',
    icon: Users,
    color: 'sage',
    body: 'AI strategy and diligence for investors, boards, and executive teams. Recent work includes technical and commercial diligence on AI-enabled software targets, opportunity sizing, and post-close AI roadmaps. Deliverables are specific: a model, a roadmap, a clear view on go or no-go.',
  },
  {
    number: '02',
    title: 'Embed',
    icon: Target,
    color: 'taupe',
    body: 'Fractional executive and operating roles inside growth-stage companies. We join the team, run the workstream, and hand it back working. Typical roles cover product strategy, commercial strategy, and AI program leadership. Engagements run on a retained basis with defined outcomes, not open-ended hours.',
  },
  {
    number: '03',
    title: 'Build',
    icon: Rocket,
    color: 'gold',
    body: 'Small software builds that answer a business question. Dashboards, internal tools, prototypes, and analytical models. We build with modern AI tooling, which means working software in weeks, not quarters. Some of what we build for clients runs on this site.',
  },
]

const iconClasses: Record<string, { bg: string; icon: string }> = {
  sage: { bg: 'bg-sage/10', icon: 'text-sage-light' },
  taupe: { bg: 'bg-taupe/10', icon: 'text-taupe-light' },
  gold: { bg: 'bg-gold/10', icon: 'text-gold' },
}

export default function ServicesPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      {/* Hero */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// What We Do</span>
            <h1 className="text-cream mb-6">Services</h1>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            {services.map((service) => {
              const IconComponent = service.icon
              const colors = iconClasses[service.color]
              return (
                <div key={service.title} id={service.title.toLowerCase()}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <div>
                      <span className="font-mono text-sm text-zinc block">{service.number}</span>
                      <h2 className="text-cream">{service.title}</h2>
                    </div>
                  </div>
                  <p className="text-stone body-large">{service.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <HowWeWork />

      {/* CTA */}
      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let's Connect</span>
            <h2 className="text-cream mb-8">Let's talk</h2>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
