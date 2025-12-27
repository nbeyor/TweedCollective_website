import React from 'react'
import Link from 'next/link'
import { Linkedin, Mail, ArrowRight, ChevronRight } from 'lucide-react'

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
    <div className="pt-28 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Our Network</span>
            <h1 className="text-cream mb-6">Operating Partners</h1>
            <p className="body-large text-stone max-w-2xl">
              Meet our network of proven C-suite talent and fractional operators with deep expertise 
              in health-tech scaling and revenue acceleration.
            </p>
          </div>
        </div>
      </section>

      {/* Operators Grid */}
      <section className="section bg-carbon">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {operators.map((operator, index) => (
              <OperatorCard key={operator.id} operator={operator} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Join the Network */}
      <section className="section bg-graphite">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Expand Our Network</span>
            <h2 className="text-cream mb-6">Join Our Network</h2>
            <p className="body-large text-stone mb-12 max-w-2xl mx-auto">
              We're always looking for exceptional operators and advisors who share our passion 
              for accelerating health-tech innovation.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300 hover:border-violet/50">
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-violet/10 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-cream mb-3">For Operators</h4>
                <p className="body-small text-stone mb-6">
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
              
              <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300 hover:border-sage/50">
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-sage/10 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="text-cream mb-3">For Companies</h4>
                <p className="body-small text-stone mb-6">
                  Access our network of proven operators to accelerate your growth trajectory.
                </p>
                <a 
                  href="mailto:hello@tweedcollective.ai" 
                  className="btn-primary w-full justify-center"
                >
                  <span>Reach Out</span>
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
      className="card group overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-violet/10 to-helix-cyan/10 overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
        
        {/* Expertise Tags on hover */}
        {expertise && expertise.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {expertise.slice(0, 2).map((skill: string, idx: number) => (
              <span 
                key={idx} 
                className="badge bg-cream/90 text-carbon text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-cream mb-2 group-hover:text-violet transition-colors">{name}</h3>
        <p className="text-sm font-medium text-violet-light mb-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-zinc mb-4">{subtitle}</p>
        )}
        
        {bio && (
          <p className="body-small text-stone mb-4 line-clamp-3">{bio}</p>
        )}
        
        {expertise && expertise.length > 0 && (
          <div className="pt-4 border-t border-slate">
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill: string, idx: number) => (
                <span 
                  key={idx} 
                  className="text-xs px-2 py-1 rounded bg-slate text-stone"
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
