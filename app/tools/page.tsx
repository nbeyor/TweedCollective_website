import React from 'react'

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

export default function Tools() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <h1 className="mb-6">Operator Toolkit</h1>
        <p className="body-large text-neutral-warm-gray max-w-2xl">
          Battle-tested frameworks, templates, and tools we use to accelerate health-tech companies.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <div 
              key={tool.name}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3>{tool.name}</h3>
                  <span className="text-sm font-medium text-primary-coral">{tool.category}</span>
                </div>

                <p className="text-neutral-warm-gray mb-8">
                  {tool.description}
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="caption text-primary-sage mb-3">Key Features</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {tool.features.map((feature, i) => (
                        <li 
                          key={i}
                          className="flex items-center text-sm text-neutral-warm-gray"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-sage mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="caption text-primary-sage mb-2">Case Study</p>
                    <p className="text-sm text-neutral-warm-gray">
                      {tool.useCase}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-stone">
                  <button className="btn-secondary w-full">
                    Request Access
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-20">
        <div className="bg-neutral-stone/30 rounded-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4">Need a Custom Tool?</h2>
            <p className="body-large text-neutral-warm-gray mb-8">
              Our operators can help you build custom frameworks and tools tailored to your specific needs.
            </p>
            <button className="btn-primary">Schedule a Call</button>
          </div>
        </div>
      </section>
    </div>
  )
} 