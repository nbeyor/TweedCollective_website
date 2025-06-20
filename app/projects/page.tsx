import React from 'react'
import ProjectsGrid from '@/components/ProjectsGrid'
import { getProjectRecords, getOperators } from '@/lib/airtable'

export default async function Projects() {
  // Fetch both projects and operators from Airtable
  const [projects, operators] = await Promise.all([
    getProjectRecords(),
    getOperators()
  ]);

  // Create a map of operator IDs to names for easy lookup
  const opById = operators.reduce((acc, operator) => {
    acc[operator.id] = operator.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Our Work</h1>
            <p className="body-large text-warm-gray max-w-2xl mx-auto">
              See how we've helped health-tech innovators accelerate growth and achieve their strategic objectives.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section">
        <div className="container mx-auto px-4">
          <ProjectsGrid projects={projects} opById={opById} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-sage">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-cream mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="body-large text-cream/90 mb-8 max-w-2xl mx-auto">
              Let's discuss how our operator-first approach can help your health-tech company scale faster and more efficiently.
            </p>
            <a 
              href="/contact"
              className="btn-primary bg-cream text-charcoal hover:bg-cream/90"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 