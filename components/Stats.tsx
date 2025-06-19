'use client'

import React from 'react'
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '300%',
      label: 'Average Revenue Growth',
      description: 'Across portfolio companies'
    },
    {
      icon: Users,
      value: '25+',
      label: 'Senior Operators',
      description: 'In our network'
    },
    {
      icon: DollarSign,
      value: '$50M+',
      label: 'Capital Raised',
      description: 'For our clients'
    },
    {
      icon: Target,
      value: '95%',
      label: 'Success Rate',
      description: 'Of engagements'
    }
  ]

  return (
    <section className="section-padding bg-navy-900">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Proven Results Across the Health-Tech Ecosystem
          </h2>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto">
            Our operator-first approach delivers measurable outcomes for growth-stage companies and their investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 card-hover"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-primary-200 mb-2">{stat.label}</div>
              <div className="text-navy-300">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats 