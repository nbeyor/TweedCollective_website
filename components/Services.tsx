import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket } from 'lucide-react'

const Services = () => {
  const services = [
    {
      number: "01",
      title: "Advisory",
      subtitle: "Fee-for-Service Consulting",
      description: "Commercial diligence, pricing models, AI readiness audits, and board advisory that turn ambiguity into conviction.",
      icon: Users,
      tangibleOutputs: ["Due diligence", "Strategy documents", "Market maps", "Investment memos"],
      color: "violet"
    },
    {
      number: "02",
      title: "Operators", 
      subtitle: "Cash + Equity Partnerships",
      description: "We embed proven C-suite talent directly into your team, running sprints that move pipeline and product—hands on the wheel, P&L in view.",
      icon: Target,
      tangibleOutputs: ["100-day GTM plan", "Revenue acceleration", "KPI dashboards", "Org building"],
      color: "sage"
    },
    {
      number: "03",
      title: "Incubation",
      subtitle: "Building from Zero",
      description: "We co-found, prototype, and seed emerging plays at the edge of AI × health, from concept to fundable entity.",
      icon: Rocket,
      tangibleOutputs: ["MVP development", "Corporate setup", "Problem validation", "Fundraising"],
      color: "helix-cyan"
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'violet':
        return {
          gradient: 'from-violet to-violet-light',
          icon: 'text-violet',
          bg: 'bg-violet/10',
          dot: 'bg-violet'
        }
      case 'sage':
        return {
          gradient: 'from-sage to-sage-light',
          icon: 'text-sage-light',
          bg: 'bg-sage/10',
          dot: 'bg-sage'
        }
      case 'helix-cyan':
        return {
          gradient: 'from-helix-cyan to-violet',
          icon: 'text-helix-cyan',
          bg: 'bg-helix-cyan/10',
          dot: 'bg-helix-cyan'
        }
      default:
        return {
          gradient: 'from-violet to-helix-cyan',
          icon: 'text-violet',
          bg: 'bg-violet/10',
          dot: 'bg-violet'
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
            <span className="mono-label">// How We Work</span>
          </div>
          <h2 className="text-cream">Three Pillars of Engagement</h2>
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

        {/* Engagement Models */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="mono-label">// Engagement Models</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center group hover:border-violet/50 transition-colors">
              <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-violet/10 flex items-center justify-center group-hover:glow-violet transition-all">
                <span className="text-violet font-mono text-lg">01</span>
              </div>
              <h4 className="text-cream font-semibold mb-2">Retainer + Equity</h4>
              <p className="text-stone text-sm">Our preferred model for long-term partnerships</p>
            </div>
            <div className="card p-6 text-center group hover:border-sage/50 transition-colors">
              <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-sage/10 flex items-center justify-center">
                <span className="text-sage-light font-mono text-lg">02</span>
              </div>
              <h4 className="text-cream font-semibold mb-2">Fixed-scope Project</h4>
              <p className="text-stone text-sm">For targeted, specific needs</p>
            </div>
            <div className="card p-6 text-center group hover:border-helix-cyan/50 transition-colors">
              <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-helix-cyan/10 flex items-center justify-center">
                <span className="text-helix-cyan font-mono text-lg">03</span>
              </div>
              <h4 className="text-cream font-semibold mb-2">Studio Co-found</h4>
              <p className="text-stone text-sm">Tweed takes sweat equity in new ventures</p>
            </div>
          </div>
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
