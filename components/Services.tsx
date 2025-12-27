import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket } from 'lucide-react'

const Services = () => {
  const services = [
    {
      number: "01",
      title: "Advisory",
      subtitle: "Due diligence that goes beyond the deck",
      description: "We've evaluated 50+ computational biology platforms, AI-enabled drug discovery companies, and clinical tech assets for PE and VC investors. Our diligence includes technical architecture reviews, primary research, and commercial viability assessments.",
      icon: Users,
      tangibleOutputs: ["Commercial & technical due diligence", "AI readiness audits and transformation roadmaps", "Strategic sector analyses with primary research", "Board presentations and investment memos"],
      engagement: "Typical: 2-4 weeks, fixed scope",
      color: "sage"
    },
    {
      number: "02",
      title: "Operators", 
      subtitle: "Principals with P&L experience, embedded with equity alignment",
      description: "We've run commercial organizations, closed enterprise deals, and built GTM motions in life sciences and AI companies. We embed for 100-day sprints with skin in the game—because we only win when you win.",
      icon: Target,
      tangibleOutputs: ["Fractional CCO / CRO / CSO roles", "100-day transformation sprints", "GTM strategy → execution → closed pipeline", "Team building and organizational design"],
      engagement: "Typical: 4-6 months, retainer + equity",
      color: "taupe"
    },
    {
      number: "03",
      title: "Incubation",
      subtitle: "We co-found at the frontier",
      description: "When we see a problem worth solving, we build. We've taken companies from napkin sketch to paying customer in under 90 days. We bring capital-efficient execution and deep domain networks.",
      icon: Rocket,
      tangibleOutputs: ["Problem validation and market research", "Zero to MVP in 90 days, <$250K total spend", "Corporate formation and fundraising support", "Studio co-founder model with sweat equity"],
      engagement: "Current focus: AI × women's health, computational biology tools",
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
            <span className="mono-label">// How We Work</span>
          </div>
          <h2 className="text-cream">Three models, one mission</h2>
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
                <div className="mb-6">
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
                
                {/* Engagement meta */}
                {service.engagement && (
                  <p className="text-xs font-mono text-zinc pt-4 border-t border-slate/50">
                    {service.engagement}
                  </p>
                )}
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
            <div className="card p-6 group hover:border-sage/50 transition-colors">
              <div className="w-10 h-10 mb-4 rounded-lg bg-sage/10 flex items-center justify-center group-hover:glow-sage transition-all">
                <span className="text-sage-light font-mono text-lg">01</span>
              </div>
              <h4 className="text-cream font-semibold mb-2">Retainer + Equity</h4>
              <p className="text-stone text-sm mb-4">Our preferred model for long-term operator partnerships</p>
              <p className="text-xs font-mono text-zinc">Typical: $10-20K/mo + 0.5-2% equity</p>
            </div>
            <div className="card p-6 group hover:border-taupe/50 transition-colors">
              <div className="w-10 h-10 mb-4 rounded-lg bg-taupe/10 flex items-center justify-center">
                <span className="text-taupe-light font-mono text-lg">02</span>
              </div>
              <h4 className="text-cream font-semibold mb-2">Fixed-Scope Project</h4>
              <p className="text-stone text-sm mb-4">For targeted diligence and strategic analyses</p>
              <p className="text-xs font-mono text-zinc">Typical: 2-6 weeks, $25-75K</p>
            </div>
            <div className="card p-6 group hover:border-gold/50 transition-colors">
              <div className="w-10 h-10 mb-4 rounded-lg bg-gold/10 flex items-center justify-center">
                <span className="text-gold font-mono text-lg">03</span>
              </div>
              <h4 className="text-cream font-semibold mb-2">Studio Co-found</h4>
              <p className="text-stone text-sm mb-4">Sweat equity for ventures we believe in</p>
              <p className="text-xs font-mono text-zinc">Typical: Significant equity, milestone-based</p>
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
