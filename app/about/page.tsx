import React from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Users, Rocket, ChevronRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mono-label mb-4 block">// About Us</span>
            <h1 className="text-cream mb-6">About Tweed Collective</h1>
            <p className="body-large text-stone mb-8">
              We're a fractional-operator platform that helps growth-stage health-tech companies 
              and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Nate's Story */}
      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="mono-label mb-4 block">// Founder Story</span>
                <h2 className="text-cream mb-6">Nate's Story</h2>
                <div className="space-y-4 text-stone">
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
                  <Link href="/operators" className="btn-outline inline-flex items-center gap-2 group">
                    <span>Meet Our Team</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-violet/10 to-helix-cyan/10 rounded-2xl p-8 border border-slate">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-violet/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-violet" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cream">Revenue Acceleration</h4>
                      <p className="text-sm text-stone">3.2× average growth</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-sage/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-sage-light" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cream">Team Building</h4>
                      <p className="text-sm text-stone">15+ companies scaled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-helix-cyan/20 rounded-lg flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-helix-cyan" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cream">Innovation</h4>
                      <p className="text-sm text-stone">AI-driven strategies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-graphite">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="mono-label mb-4 block">// Purpose</span>
              <h2 className="text-cream mb-4">Our Mission & Values</h2>
              <p className="body-large text-stone">
                We believe that every health-tech company with breakthrough technology deserves 
                the operational expertise to reach its full potential.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-8">
                <h3 className="text-cream mb-4">Mission</h3>
                <p className="text-stone">
                  To accelerate the impact of health-tech innovation by providing the operational 
                  expertise and execution frameworks that turn potential into performance.
                </p>
              </div>
              <div className="card p-8">
                <h3 className="text-cream mb-4">Vision</h3>
                <p className="text-stone">
                  A world where breakthrough health technologies reach patients faster through 
                  better execution and operational excellence.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <div className="card p-8">
                <h3 className="text-cream mb-6 text-center">Our Values</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-violet/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-violet" />
                    </div>
                    <h4 className="text-cream mb-2">Execution Excellence</h4>
                    <p className="text-sm text-stone">We focus on measurable results, not just advice</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-sage/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-sage-light" />
                    </div>
                    <h4 className="text-cream mb-2">Client Partnership</h4>
                    <p className="text-sm text-stone">We succeed when our clients succeed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-helix-cyan/10 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-helix-cyan" />
                    </div>
                    <h4 className="text-cream mb-2">Innovation</h4>
                    <p className="text-sm text-stone">We leverage AI and data to drive better outcomes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-void relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Let's Connect</span>
            <h2 className="text-cream mb-8">Ready to accelerate your growth?</h2>
            <Link href="/contact" className="btn-primary text-lg px-8 py-4 group">
              <span>Book a 30-min call</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
