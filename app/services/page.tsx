import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ServicesPage = () => {
  const services = [
    {
      id: 'operations',
      title: 'Operations',
      subtitle: 'Embedded fractional executives & teams',
      description: 'We embed senior operators directly into your organization to run day-to-day growth functions. Our team handles go-to-market strategy, product development, revenue operations, and organizational scaling.',
      benefits: [
        'Immediate operational expertise without full-time hiring',
        'Proven playbooks and frameworks',
        'Scalable team structure',
        'Measurable KPI improvements'
      ],
      deliverables: [
        'Interim CRO/COO leadership',
        'GTM strategy and execution',
        'Product roadmap and development',
        'Revenue operations optimization',
        'Organizational design and scaling',
        'KPI dashboards and reporting'
      ],
      engagement: 'Monthly retainer + equity component'
    },
    {
      id: 'advisory',
      title: 'Advisory',
      subtitle: 'High-leverage strategic counsel',
      description: 'Strategic counsel to boards and investors with deep expertise in health-tech market dynamics, commercial strategy, and investment thesis development.',
      benefits: [
        'Board-level strategic guidance',
        'Market intelligence and analysis',
        'Investment thesis validation',
        'Commercial strategy optimization'
      ],
      deliverables: [
        'Market scans and competitive analysis',
        'Commercial due diligence',
        'Pricing and contracting strategy',
        'Investment thesis development',
        '100-day execution plans',
        'Board presentation materials'
      ],
      engagement: 'Project-based or ongoing advisory'
    },
    {
      id: 'incubation',
      title: 'Incubation',
      subtitle: 'Studio for new ventures',
      description: 'Our studio approach originates and spins up new companies in AI-enabled health, leveraging our extensive talent network and operational expertise.',
      benefits: [
        'Concept validation and market testing',
        'MVP development and launch',
        'Seed funding preparation',
        'Talent network access'
      ],
      deliverables: [
        'Concept vetting and market research',
        'MVP design and development',
        'Seed-round packaging and fundraising',
        'Talent network and hiring support',
        'Go-to-market strategy',
        'Operational infrastructure setup'
      ],
      engagement: 'Equity partnership model'
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-navy-50 to-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-navy-600 mb-8">
              From hands-on operations to strategic advisory, we provide the expertise and execution needed to scale health-tech companies.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={service.id} id={service.id} className="scroll-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">{service.title}</h2>
                    <p className="text-xl font-medium text-primary-600 mb-6">{service.subtitle}</p>
                    <p className="text-navy-600 mb-8 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-navy-900 mb-4">Key Benefits</h3>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-navy-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-navy-900 mb-4">Deliverables</h3>
                      <ul className="space-y-3">
                        {service.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-navy-600">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-navy-50 rounded-lg">
                      <p className="text-navy-700">
                        <strong>Engagement Model:</strong> {service.engagement}
                      </p>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="bg-gradient-to-br from-navy-50 to-primary-50 p-8 rounded-xl">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">👥</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-navy-900">Expert Team</h4>
                            <p className="text-navy-600">Senior operators with proven track records</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">🎯</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-navy-900">Measurable Results</h4>
                            <p className="text-navy-600">Clear KPIs and outcome tracking</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">📈</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-navy-900">Scalable Growth</h4>
                            <p className="text-navy-600">Sustainable expansion strategies</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how our operator-first approach can help your health-tech company scale faster and more efficiently.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Schedule a Consultation
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default ServicesPage 