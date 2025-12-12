import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">About Tweed Collective</h1>
            <p className="body-large mb-8">
              We're a fractional-operator platform that helps growth-stage health-tech companies 
              and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Nate's Story */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-6">Nate's Story</h2>
                <div className="space-y-4 body">
                  <p>
                    After 20+ years building and scaling health-tech companies, I realized that 
                    the biggest bottleneck for growth-stage companies wasn't capital or technology—it was execution.
                  </p>
                  <p>
                    I've seen too many promising companies with breakthrough technology fail to reach 
                    their potential because they lacked the operational expertise to scale effectively.
                  </p>
                  <p>
                    That's why I founded Tweed Collective—to bridge the gap between potential and performance 
                    by embedding proven C-suite talent directly into growth-stage companies.
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/operators" className="btn-outline inline-flex items-center space-x-2">
                    <span>Meet Our Team</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-sage/20 to-terra/20 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-sage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Revenue Acceleration</h4>
                      <p className="text-sm text-warm-gray">3.2× average growth</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-terra/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-terra" />
                    </div>
                    <div>
                      <h4 className="font-medium">Team Building</h4>
                      <p className="text-sm text-warm-gray">15+ companies scaled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-coral" />
                    </div>
                    <div>
                      <h4 className="font-medium">Innovation</h4>
                      <p className="text-sm text-warm-gray">AI-driven strategies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-stone/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="mb-4">Our Mission & Values</h2>
              <p className="body-large">
                We believe that every health-tech company with breakthrough technology deserves 
                the operational expertise to reach its full potential.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-8">
                <h3 className="mb-4">Mission</h3>
                <p className="body">
                  To accelerate the impact of health-tech innovation by providing the operational 
                  expertise and execution frameworks that turn potential into performance.
                </p>
              </div>
              <div className="card p-8">
                <h3 className="mb-4">Vision</h3>
                <p className="body">
                  A world where breakthrough health technologies reach patients faster through 
                  better execution and operational excellence.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <div className="card p-8">
                <h3 className="mb-6 text-center">Our Values</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="mb-2">Execution Excellence</h4>
                    <p className="text-sm text-warm-gray">We focus on measurable results, not just advice</p>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-2">Client Partnership</h4>
                    <p className="text-sm text-warm-gray">We succeed when our clients succeed</p>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-2">Innovation</h4>
                    <p className="text-sm text-warm-gray">We leverage AI and data to drive better outcomes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-8">Ready to accelerate your growth?</h2>
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Book a 30-min call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 