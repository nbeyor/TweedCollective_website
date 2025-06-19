'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react'

const CaseStudies = () => {
  const caseStudies = [
    {
      company: 'Glucare / meta[bolic]',
      logo: 'GC',
      description: 'US market entry & clinic launch playbook for metabolic health platform.',
      result: 'Successful market expansion',
      metric: '300% growth',
      icon: TrendingUp,
      category: 'Operations'
    },
    {
      company: 'Loopback Analytics',
      logo: 'LA',
      description: 'Specialty-pharmacy data platform repositioning and strategic guidance.',
      result: 'PSG investment secured',
      metric: '$25M raised',
      icon: DollarSign,
      category: 'Advisory'
    },
    {
      company: 'WeekendWatch',
      logo: 'WW',
      description: 'Digital-detox 5G wearable: MVP design and MVNO structuring.',
      result: 'MVP launched',
      metric: '10K+ users',
      icon: Users,
      category: 'Incubation'
    },
    {
      company: 'RCM AI Platform',
      logo: 'RC',
      description: 'Revenue cycle management AI assessment for top-10 PE fund.',
      result: 'Deal thesis validated',
      metric: '100-day plan',
      icon: TrendingUp,
      category: 'Advisory'
    }
  ]

  return (
    <section className="section-padding bg-navy-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            See how we've helped health-tech companies accelerate growth and achieve their strategic objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden card-hover"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{study.logo}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900">{study.company}</h3>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                        {study.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-accent-600">
                    <study.icon className="w-5 h-5" />
                    <span className="font-semibold">{study.metric}</span>
                  </div>
                </div>

                <p className="text-navy-600 mb-4 leading-relaxed">{study.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-navy-500">
                    <strong>Result:</strong> {study.result}
                  </div>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    View Case Study
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/portfolio" className="btn-outline">
            View All Case Studies
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies 