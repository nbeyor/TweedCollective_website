import React from 'react'
import { Linkedin, Mail, ArrowRight } from 'lucide-react'

// Static operator data
const operators = [
  {
    id: '1',
    name: 'Bob Battista',
    title: 'Head of Commercial, Salt AI',
    expertise: ['Life sciences go-to-market', 'Medical intelligence platforms', 'Commercial strategy', 'Enterprise AI adoption'],
    photo: '/img/placeholder-headshot.svg',
    bio: 'Expert in commercial strategy and go-to-market execution for life sciences companies, with deep experience in medical intelligence platforms and enterprise AI adoption.'
  },
  {
    id: '2',
    name: 'Sibel Sayiner',
    title: 'VP, Business Operations & Analytics, Marley Medical',
    subtitle: '(prev. BCG, Propeller Health)',
    expertise: ['Digital health ops', 'Data-driven commercialization', 'Chronic disease virtual care', 'Payer/provider strategy'],
    photo: '/img/placeholder-headshot.svg',
    bio: 'Former BCG consultant and Propeller Health executive specializing in digital health operations, data-driven commercialization, and payer/provider strategy for chronic disease virtual care platforms.'
  },
  {
    id: '3',
    name: 'Stuart John',
    title: 'First American',
    expertise: ['Enterprise data platforms', 'Title & escrow tech', 'Large-scale systems modernization'],
    photo: '/img/placeholder-headshot.svg',
    bio: 'Expert in enterprise data platforms and large-scale systems modernization, with deep experience in title & escrow technology and complex system transformations.'
  },
  {
    id: '4',
    name: 'Syuzi Pakhchyan',
    title: 'Head of Innovation & Emerging Experiences, Target',
    subtitle: '(prev. Design Director, BCG Digital Ventures)',
    expertise: ['Wearable tech & emerging interfaces', 'Experience design', 'Retail innovation', 'Fashion–technology convergence'],
    photo: '/img/placeholder-headshot.svg',
    bio: 'Former Design Director at BCG Digital Ventures, now leading innovation at Target. Specializes in wearable technology, emerging interfaces, and the convergence of fashion and technology.'
  },
  {
    id: '5',
    name: 'Amy Zhang',
    title: 'Marketing Strategy & Growth',
    subtitle: '(formerly Senior Growth Architect, BCG Digital Ventures)',
    expertise: ['Growth marketing', 'Go-to-market for SaaS', 'Digital experiments & performance', 'Mission-driven brand strategy'],
    photo: '/img/placeholder-headshot.svg',
    bio: 'Former Senior Growth Architect at BCG Digital Ventures specializing in growth marketing, SaaS go-to-market strategies, digital experimentation, and mission-driven brand development.'
  }
]

export default async function OperatorsPage() {
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
            {operators.map((operator, index) => (
              <OperatorCard key={operator.id} operator={operator} index={index} />
            ))}
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

function OperatorCard({ operator, index }: { operator: any; index: number }) {
  const { name, title, subtitle, expertise, photo, bio } = operator;
  
  return (
    <div 
      className="card group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-72 bg-gradient-to-br from-sage/10 to-terra/10 overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Expertise Tags */}
        {expertise && expertise.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {expertise.slice(0, 3).map((skill: string, idx: number) => (
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
        <h3 className="mb-2 group-hover:text-sage transition-colors">{name}</h3>
        <p className="text-sm font-medium text-warm-gray mb-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-warm-gray/70 mb-4">{subtitle}</p>
        )}
        
        {bio && (
          <p className="body-small text-warm-gray mb-4">{bio}</p>
        )}
        
        {expertise && expertise.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-warm-gray/60 mb-2 uppercase tracking-wider">Expertise</p>
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill: string, idx: number) => (
                <span 
                  key={idx} 
                  className="badge-secondary text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
