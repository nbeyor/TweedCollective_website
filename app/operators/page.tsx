import React from 'react'
import { getOperators, Operator } from '@/lib/airtable'
import { Linkedin, Mail, ExternalLink, ArrowRight } from 'lucide-react'

export default async function OperatorsPage() {
  const operators = await getOperators();

  return (
    <div className="pt-28">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-pattern opacity-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sage/5 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="caption mb-4 block">Our Network</span>
            <h1 className="mb-6">Operating Partners</h1>
            <p className="body-large max-w-2xl">
              Meet our network of proven C-suite talent and fractional operators with deep expertise 
              in health-tech scaling and revenue acceleration.
            </p>
          </div>
        </div>
      </section>

      {/* Operators Grid */}
      <section className="section">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {operators.length > 0 ? (
              operators.map((operator, index) => (
                <OperatorCard key={operator.id} operator={operator} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-stone/50 flex items-center justify-center">
                  <span className="text-3xl">👥</span>
                </div>
                <p className="body-large text-warm-gray">
                  Our network of operating partners and advisors will be featured here soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join the Network */}
      <section className="section bg-stone/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span className="caption mb-4 block">Expand Our Network</span>
            <h2 className="mb-6">Join Our Network</h2>
            <p className="body-large mb-12 max-w-2xl mx-auto">
              We're always looking for exceptional operators and advisors who share our passion 
              for accelerating health-tech innovation.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-sage/10 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="mb-3">For Operators</h4>
                <p className="body-small mb-6">
                  Join our network of fractional C-suite talent and work with leading health-tech companies.
                </p>
                <a 
                  href="mailto:hello@tweedcollective.ai" 
                  className="btn-outline w-full justify-center"
                >
                  <Mail className="icon-sm" />
                  <span>Get in Touch</span>
                </a>
              </div>
              
              <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-terra/10 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="mb-3">For Companies</h4>
                <p className="body-small mb-6">
                  Access our network of proven operators to accelerate your growth trajectory.
                </p>
                <a 
                  href="/contact" 
                  className="btn-primary w-full justify-center"
                >
                  <span>Book a Call</span>
                  <ArrowRight className="icon-sm" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function OperatorCard({ operator, index }: { operator: Operator; index: number }) {
  const { name, photo, expertise, linkedin } = operator;
  
  return (
    <div 
      className="card group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-72 bg-gradient-to-br from-sage/10 to-terra/10 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-cream rounded-2xl shadow-inner flex items-center justify-center">
              <span className="text-4xl font-serif text-sage/60">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Expertise Tags */}
        {expertise && expertise.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {expertise.slice(0, 3).map((skill, idx) => (
              <span 
                key={idx} 
                className="badge bg-cream/95 text-charcoal shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-3 group-hover:text-sage transition-colors">{name}</h3>
        
        {/* Social Links */}
        <div className="flex items-center gap-4">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-warm-gray hover:text-sage transition-colors group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="icon-md" />
              <span className="text-sm font-medium group-hover/link:underline underline-offset-2">
                LinkedIn
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
