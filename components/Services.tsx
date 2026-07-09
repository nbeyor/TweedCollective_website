import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket } from 'lucide-react'

const Services = () => {
  const services = [
    {
      number: "01",
      title: "Advise",
      subtitle: "AI strategy and diligence",
      description: "AI strategy and diligence for investors, boards, and executive teams. We've evaluated 50+ computational biology platforms, AI-enabled drug discovery companies, and clinical tech assets. Deliverables are specific: a model, a roadmap, a clear view on go or no-go.",
      icon: Users,
      tangibleOutputs: ["Technical and commercial diligence", "Opportunity sizing and quantified models", "Post-close AI roadmaps", "Board presentations and investment memos"],
      color: "sage"
    },
    {
      number: "02",
      title: "Embed",
      subtitle: "Operators inside your team",
      description: "Fractional executive and operating roles inside growth-stage companies. We join the team, run the workstream, and hand it back working. Engagements run on a retained basis with defined outcomes, not open-ended hours.",
      icon: Target,
      tangibleOutputs: ["Product strategy leadership", "Commercial strategy leadership", "AI program leadership", "Workstreams handed back working"],
      color: "taupe"
    },
    {
      number: "03",
      title: "Build",
      subtitle: "Software that answers a business question",
      description: "Small software builds that answer a business question. Dashboards, internal tools, prototypes, and analytical models. We build with modern AI tooling, which means working software in weeks, not quarters.",
      icon: Rocket,
      tangibleOutputs: ["Dashboards and internal tools", "Prototypes and analytical models", "Client tools that run on this site"],
      color: "gold"
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'sage':
        return {
          gradient: 'from-sage to-sage-light',
          icon: 'text-sage-light',
          bg: 'bg-sage/10',
          dot: 'bg-sage'
        }
      case 'taupe':
        return {
          gradient: 'from-taupe to-taupe-light',
          icon: 'text-taupe-light',
          bg: 'bg-taupe/10',
          dot: 'bg-taupe'
        }
      case 'rust':
        return {
          gradient: 'from-rust to-rust-light',
          icon: 'text-rust-light',
          bg: 'bg-rust/10',
          dot: 'bg-rust'
        }
      default:
        return {
          gradient: 'from-sage to-taupe',
          icon: 'text-sage-light',
          bg: 'bg-sage/10',
          dot: 'bg-sage'
        }
    }
  }

  return (
    <section className="section bg-carbon relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-carbon to-graphite" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="mono-label">// What We Do</span>
          </div>
          <h2 className="text-cream">What we do</h2>
        </div>

        {/* Services grid with gap lines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate/30 rounded-2xl overflow-hidden mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            const colorClasses = getColorClasses(service.color)

            return (
              <div
                key={service.title}
                className="group bg-carbon p-8 hover:bg-graphite transition-all duration-500 relative"
              >
                {/* Gradient top border on hover */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colorClasses.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Number */}
                <span className="font-mono text-sm text-zinc mb-6 block">{service.number}</span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-7 h-7 ${colorClasses.icon}`} />
                  </div>

                {/* Title & Subtitle */}
                <h3 className="text-cream mb-2">{service.title}</h3>
                <p className="mono-label text-xs mb-4">{service.subtitle}</p>

                {/* Description */}
                <p className="text-stone text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Tangible Outputs */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-zinc mb-3">Deliverables</p>
                      <ul className="space-y-2">
                        {service.tangibleOutputs.map((output, i) => (
                      <li key={i} className="text-sm text-stone/80 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot}`} />
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/services" className="btn-primary inline-flex items-center gap-2 group">
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Services
