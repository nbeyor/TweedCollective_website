import React from 'react'
import Link from 'next/link'

const Services = () => {
  const services = [
    {
      title: "Operations",
      subtitle: "Put the engine in 'execution'",
      description: "We parachute in CRO, COO, or RevOps teams for 6-18 months, running sprints that move pipeline and product—hands on the wheel, P&L in view.",
      outputs: ["100-day GTM plan", "KPI dashboards", "Org builds"],
      kpis: ["≥50% YoY MRR", "CAC/LTV ≤ 3:1"]
    },
    {
      title: "Advisory",
      subtitle: "High-leverage strategic counsel",
      description: "Commercial diligence, pricing models, AI readiness audits, and board advisory that turn ambiguity into conviction.",
      outputs: ["Investment memos", "TAM heatmaps", "Regulatory risk matrices"]
    },
    {
      title: "Incubation",
      subtitle: "From idea to fundable entity",
      description: "We co-found, prototype, and seed emerging plays at the edge of AI × health.",
      outputs: ["Problem validation", "MVP (<4 mo, <$250k)", "Seed round packaging"]
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Our Three Pillars</h2>
          <p className="body-large text-neutral-warm-gray max-w-2xl mx-auto">
            Comprehensive support across the growth journey, from strategic planning to hands-on execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border-l-4 border-primary-sage"
            >
              <div className="mb-6">
                <h3 className="mb-2">{service.title}</h3>
                <p className="text-primary-coral italic">{service.subtitle}</p>
              </div>

              <p className="text-neutral-warm-gray mb-6">
                {service.description}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="caption text-primary-sage mb-2">Key Outputs</p>
                  <ul className="space-y-1">
                    {service.outputs.map((output, i) => (
                      <li key={i} className="text-sm text-neutral-warm-gray flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-sage/40 mr-2" />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>

                {service.kpis && (
                  <div>
                    <p className="caption text-primary-sage mb-2">KPI Targets</p>
                    <ul className="space-y-1">
                      {service.kpis.map((kpi, i) => (
                        <li key={i} className="text-sm text-neutral-warm-gray flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-sage/40 mr-2" />
                          {kpi}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="mb-8">Engagement Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-neutral-stone/30 rounded-lg">
              <p className="font-medium mb-2">Retainer + Equity</p>
              <p className="text-sm text-neutral-warm-gray">(favored)</p>
            </div>
            <div className="p-6 bg-neutral-stone/30 rounded-lg">
              <p className="font-medium mb-2">Fixed-scope Project</p>
              <p className="text-sm text-neutral-warm-gray">For targeted needs</p>
            </div>
            <div className="p-6 bg-neutral-stone/30 rounded-lg">
              <p className="font-medium mb-2">Studio Co-found</p>
              <p className="text-sm text-neutral-warm-gray">(Tweed takes sweat equity)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services 