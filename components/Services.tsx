import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket } from 'lucide-react'

const Services = () => {
  const services = [
    {
      title: "Operations",
      subtitle: "Revenue run-rate doubled within 100 days",
      description: "We embed proven C-suite talent directly into your team, running sprints that move pipeline and product—hands on the wheel, P&L in view.",
      icon: Target,
      tangibleOutputs: ["Closing sales", "Building organization", "KPI dashboards", "100-day GTM plan"],
      color: "sage"
    },
    {
      title: "Advisory", 
      subtitle: "Investment decisions made with 90% confidence",
      description: "Commercial diligence, pricing models, AI readiness audits, and board advisory that turn ambiguity into conviction.",
      icon: Users,
      tangibleOutputs: ["Live diligence", "Strategy documents", "Market maps", "Investment memos"],
      color: "terra"
    },
    {
      title: "Incubation",
      subtitle: "Zero-to-MVP in under 4 months, <$250K spend",
      description: "We co-found, prototype, and seed emerging plays at the edge of AI × health, from concept to fundable entity.",
      icon: Rocket,
      tangibleOutputs: ["Product development", "Corporate setup", "Problem validation", "MVP development"],
      color: "coral"
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'sage':
        return {
          border: 'border-sage',
          badge: 'badge-primary',
          icon: 'text-sage'
        }
      case 'terra':
        return {
          border: 'border-terra',
          badge: 'badge-terra',
          icon: 'text-terra'
        }
      case 'coral':
        return {
          border: 'border-coral',
          badge: 'badge-coral',
          icon: 'text-coral'
        }
      default:
        return {
          border: 'border-sage',
          badge: 'badge-primary',
          icon: 'text-sage'
        }
    }
  }

  return (
    <section className="section bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our Three Pillars</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            const colorClasses = getColorClasses(service.color)
            
            return (
              <div 
                key={service.title}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="p-8">
                  {/* Icon and Title */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-${service.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-8 h-8 ${colorClasses.icon}`} />
                    </div>
                    <h3 className="mb-2">{service.title}</h3>
                    <p className={`text-${service.color} font-medium`}>{service.subtitle}</p>
                  </div>

                  <p className="body mb-6 text-balance">
                    {service.description}
                  </p>

                  {/* Tangible Outputs */}
                  <div className="space-y-4">
                    <div>
                      <p className="caption mb-3">Tangible Output</p>
                      <ul className="space-y-2">
                        {service.tangibleOutputs.map((output, i) => (
                          <li key={i} className="text-sm text-warm-gray flex items-start">
                            <span className={`w-1.5 h-1.5 rounded-full bg-${service.color}/40 mr-3 mt-2 flex-shrink-0`} />
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Engagement Models - Moved above the fold */}
        <div className="text-center mb-16">
          <h3 className="mb-8">Engagement Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card p-6 text-center">
              <div className="data-metric text-2xl mb-2">Retainer + Equity</div>
              <p className="text-small text-warm-gray">Our preferred model for long-term partnerships</p>
            </div>
            <div className="card p-6 text-center">
              <div className="data-metric text-2xl mb-2">Fixed-scope Project</div>
              <p className="text-small text-warm-gray">For targeted, specific needs</p>
            </div>
            <div className="card p-6 text-center">
              <div className="data-metric text-2xl mb-2">Studio Co-found</div>
              <p className="text-small text-warm-gray">Tweed takes sweat equity in new ventures</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/services" className="btn-primary inline-flex items-center space-x-2">
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Services 