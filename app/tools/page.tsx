import React from 'react'
import Link from 'next/link'
import { ArrowRight, Upload, Target, BarChart3, Zap } from 'lucide-react'

const tools = [
  {
    name: "Growth Model",
    category: "Revenue",
    description: "Interactive financial model for health-tech startups to forecast growth and optimize unit economics.",
    features: [
      "Revenue forecasting",
      "Unit economics calculator",
      "Scenario planning",
      "Cash runway analysis"
    ],
    useCase: "Used by Series A digital health company to identify $5M in operational efficiencies"
  },
  {
    name: "GTM Playbook",
    category: "Sales",
    description: "Comprehensive playbook for B2B and B2B2C healthcare sales, from first customer to enterprise scale.",
    features: [
      "Sales process templates",
      "Enablement materials",
      "Pricing frameworks",
      "Channel strategy"
    ],
    useCase: "Implemented by medical device startup to reduce sales cycle by 40%"
  },
  {
    name: "Value Prop Canvas",
    category: "Product",
    description: "Framework for articulating and validating value propositions in regulated healthcare markets.",
    features: [
      "Stakeholder mapping",
      "Value chain analysis",
      "ROI calculator",
      "Messaging guide"
    ],
    useCase: "Helped AI diagnostics company increase deal size by 2.5x"
  },
  {
    name: "Clinical Workflow",
    category: "Operations",
    description: "Process mapping and optimization toolkit for clinical operations and care delivery.",
    features: [
      "Workflow templates",
      "SOP builder",
      "Quality metrics",
      "Staff modeling"
    ],
    useCase: "Enabled virtual care platform to scale to 100K visits/month"
  }
]

export default function ToolsPage() {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Our Tools</h1>
            <p className="body-large mb-8">
              Self-serve dashboards and AI-powered tools to accelerate your health-tech growth journey.
            </p>
          </div>
        </div>
      </section>

      {/* AI Sprint Planner */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-6">AI Sprint Planner</h2>
                <p className="body-large mb-6">
                  Upload your goals and get a 100-day roadmap in seconds. Our AI analyzes your business 
                  context and creates a customized execution plan.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-sage" />
                    </div>
                    <span className="text-warm-gray">Upload your business goals and metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-sage" />
                    </div>
                    <span className="text-warm-gray">AI generates a 100-day execution plan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-sage" />
                    </div>
                    <span className="text-warm-gray">Track progress with built-in KPIs</span>
                  </div>
                </div>

                <Link href="/tools/sprint-planner" className="btn-primary inline-flex items-center space-x-2">
                  <span>Launch AI Sprint Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="card p-8">
                <div className="bg-gradient-to-br from-sage/10 to-terra/10 rounded-lg p-6 mb-6">
                  <h3 className="mb-4">Sample Output</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-gray">Week 1-4</span>
                      <span className="badge-primary">Foundation</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-gray">Week 5-8</span>
                      <span className="badge-terra">Execution</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-gray">Week 9-12</span>
                      <span className="badge-coral">Optimization</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="data-metric text-2xl mb-2">100% Free</div>
                  <p className="text-small text-warm-gray">No credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Tools */}
      <section className="section bg-stone/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8">More Tools Coming Soon</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-sage" />
                </div>
                <h3 className="mb-2">Revenue Dashboard</h3>
                <p className="text-sm text-warm-gray mb-4">
                  Real-time revenue analytics and forecasting for health-tech companies
                </p>
                <span className="badge-secondary">Coming Q2 2024</span>
              </div>

              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-terra/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-terra" />
                </div>
                <h3 className="mb-2">Market Intelligence</h3>
                <p className="text-sm text-warm-gray mb-4">
                  AI-powered market analysis and competitive intelligence
                </p>
                <span className="badge-secondary">Coming Q3 2024</span>
              </div>

              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-coral" />
                </div>
                <h3 className="mb-2">Team Builder</h3>
                <p className="text-sm text-warm-gray mb-4">
                  AI-assisted hiring and team scaling recommendations
                </p>
                <span className="badge-secondary">Coming Q4 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-8">Need custom tools for your business?</h2>
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Let's Build Together
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 