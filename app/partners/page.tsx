import React from 'react'

const partners = [
  {
    name: "Dr. Sarah Chen",
    role: "CRO · Digital Health",
    image: "/team/placeholder1.jpg",
    skills: ["GTM Strategy", "Revenue Ops", "AI/ML"],
    bio: "Former Chief Revenue Officer at leading digital health platforms. Specialist in B2B2C healthcare GTM and value-based care models.",
    wins: "Led 4x ARR growth at Series B digital therapeutics company"
  },
  {
    name: "Michael Torres",
    role: "COO · Health Tech",
    image: "/team/placeholder2.jpg",
    skills: ["Operations", "Scale-up", "M&A"],
    bio: "Seasoned operator with 15+ years scaling health tech companies from Series A to exit. Deep expertise in operational excellence.",
    wins: "Architected $200M exit to strategic buyer"
  },
  {
    name: "Dr. Emily Watson",
    role: "Advisory · AI/ML",
    image: "/team/placeholder3.jpg",
    skills: ["AI Strategy", "Clinical", "Product"],
    bio: "PhD in Machine Learning with focus on healthcare applications. Bridges technical capability with clinical workflow optimization.",
    wins: "Developed AI strategy for top-5 health system"
  }
]

export default function Partners() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <h1 className="mb-6">Meet the Operators</h1>
        <p className="body-large text-neutral-warm-gray max-w-2xl">
          One operator can unlock a $100M delta; Tweed brings ten. Our partners bring decades of hands-on experience scaling category-defining companies.
        </p>
      </section>

      {/* Partners Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div key={partner.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-4 aspect-h-3 bg-neutral-stone/20">
                {/* Image placeholder */}
                <div className="w-full h-full flex items-center justify-center text-primary-sage">
                  {partner.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="mb-1">{partner.name}</h3>
                  <p className="text-primary-coral">{partner.role}</p>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {partner.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="text-xs px-2 py-1 bg-primary-sage/10 text-primary-sage rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-neutral-warm-gray mb-4">{partner.bio}</p>

                <div className="pt-4 border-t border-neutral-stone">
                  <p className="caption text-primary-sage mb-1">Notable Win</p>
                  <p className="text-sm text-neutral-warm-gray">{partner.wins}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Bench CTA */}
      <section className="container mx-auto px-4 mt-20">
        <div className="bg-neutral-stone/30 rounded-lg p-8 md:p-12 text-center">
          <h2 className="mb-4">Join Our Operating Partner Bench</h2>
          <p className="body-large text-neutral-warm-gray mb-8 max-w-2xl mx-auto">
            Are you a seasoned health-tech operator looking to leverage your expertise across multiple high-growth companies?
          </p>
          <button className="btn-primary">Apply as Partner</button>
        </div>
      </section>
    </div>
  )
} 