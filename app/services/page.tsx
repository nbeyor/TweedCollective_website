import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket, Calendar, DollarSign, TrendingUp, ChevronRight } from 'lucide-react'

const ServicesPage = () => {
  const services = [
    {
      id: 'advisory',
      number: '01',
      title: 'Advisory',
      subtitle: 'Fee-for-Service Consulting',
      description: 'Strategic counsel to boards and investors with deep expertise in health-tech market dynamics, commercial strategy, and investment thesis development.',
      icon: Users,
      color: 'violet',
      howWeWork: [
        {
          title: 'Project or Retainer',
          description: 'Flexible engagement models to match your needs',
          icon: Calendar
        },
        {
          title: 'Cash-Oriented',
          description: 'Primary focus on cash compensation structure',
          icon: DollarSign
        },
        {
          title: 'Deal-Specific',
          description: 'Tailored to specific transactions or decisions',
          icon: TrendingUp
        },
        {
          title: 'Measurable Sprints',
          description: 'Clear deliverables with defined timeframes',
          icon: Target
        }
      ],
      engagement: 'Project-based or ongoing advisory'
    },
    {
      id: 'operations',
      number: '02',
      title: 'Operators',
      subtitle: 'Cash + Equity Partnerships',
      description: 'We embed senior operators directly into your organization to run day-to-day growth functions. Our team handles go-to-market strategy, product development, revenue operations, and organizational scaling.',
      icon: Target,
      color: 'sage',
      howWeWork: [
        {
          title: 'Fixed Contracts',
          description: 'Clear scope and deliverables with defined timelines',
          icon: Calendar
        },
        {
          title: 'Formal Title',
          description: 'Interim CRO/COO with full decision-making authority',
          icon: Target
        },
        {
          title: 'Embedded Team',
          description: 'Direct integration with your existing organization',
          icon: Users
        },
        {
          title: 'Cash + Equity',
          description: 'Aligned incentives through mixed compensation model',
          icon: DollarSign
        }
      ],
      engagement: 'Monthly retainer + equity component'
    },
    {
      id: 'incubation',
      number: '03',
      title: 'Incubation',
      subtitle: 'Building from Zero',
      description: 'Our studio approach originates and spins up new companies in AI-enabled health, leveraging our extensive talent network and operational expertise.',
      icon: Rocket,
      color: 'helix-cyan',
      howWeWork: [
        {
          title: 'Material Equity',
          description: 'Tweed holds significant ownership stake',
          icon: DollarSign
        },
        {
          title: 'Ownership Model',
          description: 'Full ownership and control of build effort',
          icon: Target
        },
        {
          title: 'Leads Build',
          description: 'Direct leadership of product and team development',
          icon: Users
        },
        {
          title: 'Studio Approach',
          description: 'Dedicated resources and infrastructure',
          icon: Rocket
        }
      ],
      engagement: 'Equity partnership model'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'violet':
        return {
          bg: 'bg-violet/10',
          border: 'border-violet/30',
          text: 'text-violet',
          icon: 'text-violet',
          gradient: 'from-violet to-violet-light'
        }
      case 'sage':
        return {
          bg: 'bg-sage/10',
          border: 'border-sage/30',
          text: 'text-sage-light',
          icon: 'text-sage-light',
          gradient: 'from-sage to-sage-light'
        }
      case 'helix-cyan':
        return {
          bg: 'bg-helix-cyan/10',
          border: 'border-helix-cyan/30',
          text: 'text-helix-cyan',
          icon: 'text-helix-cyan',
          gradient: 'from-helix-cyan to-violet'
        }
      default:
        return {
          bg: 'bg-violet/10',
          border: 'border-violet/30',
          text: 'text-violet',
          icon: 'text-violet',
          gradient: 'from-violet to-helix-cyan'
        }
    }
  }

  return (
    <div className="pt-32 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mono-label mb-4 block">// What We Do</span>
            <h1 className="text-cream mb-6">Our Services</h1>
            <p className="body-large text-stone mb-8">
              From hands-on operations to strategic advisory, we provide the expertise and execution needed to scale health-tech companies.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const colorClasses = getColorClasses(service.color)
              
              return (
                <div key={service.id} id={service.id} className="scroll-mt-20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      {/* Number */}
                      <span className="font-mono text-sm text-zinc mb-4 block">{service.number}</span>
                      
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-16 h-16 rounded-xl ${colorClasses.bg} flex items-center justify-center`}>
                          <IconComponent className={`w-8 h-8 ${colorClasses.icon}`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-cream">{service.title}</h2>
                          <p className={`text-sm font-mono uppercase tracking-wider ${colorClasses.text}`}>{service.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="body-large text-stone mb-8">{service.description}</p>
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-cream mb-6">How We Work</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.howWeWork.map((item, idx) => {
                            const ItemIcon = item.icon
                            return (
                              <div key={idx} className="flex items-start space-x-3 p-4 bg-graphite rounded-lg border border-slate/50">
                                <ItemIcon className={`w-5 h-5 ${colorClasses.icon} mt-0.5 flex-shrink-0`} />
                                <div>
                                  <h4 className="font-medium text-sm text-cream">{item.title}</h4>
                                  <p className="text-xs text-stone">{item.description}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className={`p-4 ${colorClasses.bg} rounded-lg border ${colorClasses.border}`}>
                        <p className="text-sm text-cream">
                          <strong>Engagement Model:</strong> <span className="text-stone">{service.engagement}</span>
                        </p>
                      </div>
                    </div>

                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className={`${colorClasses.bg} p-8 rounded-xl border ${colorClasses.border}`}>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center border ${colorClasses.border}`}>
                              <Users className={`w-6 h-6 ${colorClasses.icon}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-cream">Expert Team</h4>
                              <p className="text-sm text-stone">Senior operators with proven track records</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center border ${colorClasses.border}`}>
                              <Target className={`w-6 h-6 ${colorClasses.icon}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-cream">Measurable Results</h4>
                              <p className="text-sm text-stone">Clear KPIs and outcome tracking</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center border ${colorClasses.border}`}>
                              <TrendingUp className={`w-6 h-6 ${colorClasses.icon}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-cream">Scalable Growth</h4>
                              <p className="text-sm text-stone">Sustainable expansion strategies</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-violet relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet via-violet-light/20 to-violet" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-cream mb-6">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="body-large text-cream/80 mb-8 max-w-2xl mx-auto">
              Let's discuss how our operator-first approach can help your health-tech company scale faster and more efficiently.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cream text-carbon rounded-xl font-medium hover:bg-cream/90 transition-colors group"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
