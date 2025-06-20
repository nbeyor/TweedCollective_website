import React from 'react'
import { usePartners } from '@/hooks/useAirtable'
import { Linkedin, Mail, ExternalLink } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Our Team</h1>
            <p className="body-large mb-8">
              Meet our network of proven C-suite talent and fractional operators with deep expertise 
              in health-tech scaling and revenue acceleration.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="section">
        <div className="container mx-auto px-4">
          <TeamMembers />
        </div>
      </section>

      {/* Join the Network */}
      <section className="section bg-stone/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Join Our Network</h2>
            <p className="body-large mb-8">
              We're always looking for exceptional operators and advisors who share our passion 
              for accelerating health-tech innovation.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="card p-6 text-center">
                <h4 className="mb-2">For Operators</h4>
                <p className="text-sm text-warm-gray mb-4">
                  Join our network of fractional C-suite talent
                </p>
                <a 
                  href="mailto:hello@tweedcollective.com" 
                  className="btn-outline inline-flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Get in Touch</span>
                </a>
              </div>
              <div className="card p-6 text-center">
                <h4 className="mb-2">For Companies</h4>
                <p className="text-sm text-warm-gray mb-4">
                  Access our network of proven operators
                </p>
                <a 
                  href="/contact" 
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Book a Call</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TeamMembers() {
  const { partners, loading, error } = usePartners()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full h-80 bg-stone rounded-lg mb-4"></div>
            <div className="h-4 bg-stone rounded mb-2"></div>
            <div className="h-3 bg-stone rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error || partners.length === 0) {
    return (
      <div className="text-center">
        <p className="text-warm-gray mb-8">
          Our team of operating partners and advisors will be featured here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder team members */}
          <TeamMemberCard
            name="Nate Johnson"
            title="Founder & CEO"
            company="Tweed Collective"
            bio="20+ years building and scaling health-tech companies. Former CRO at multiple successful startups."
            expertise={["Revenue Operations", "Go-to-Market", "Team Building"]}
            linkedin="https://linkedin.com/in/natejohnson"
            email="nate@tweedcollective.com"
          />
          <TeamMemberCard
            name="Sarah Chen"
            title="Fractional CRO"
            company="Tweed Collective"
            bio="Former VP of Sales at leading biotech companies. Expert in scaling revenue operations and building high-performing teams."
            expertise={["Sales Operations", "Revenue Strategy", "Team Leadership"]}
            linkedin="https://linkedin.com/in/sarahchen"
            email="sarah@tweedcollective.com"
          />
          <TeamMemberCard
            name="Michael Rodriguez"
            title="Fractional COO"
            company="Tweed Collective"
            bio="Operational leader with experience scaling multiple health-tech companies from $1M to $50M+ ARR."
            expertise={["Operations", "Process Optimization", "Strategic Planning"]}
            linkedin="https://linkedin.com/in/michaelrodriguez"
            email="michael@tweedcollective.com"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {partners.map((partner) => (
        <TeamMemberCard
          key={partner.id}
          name={partner.name}
          title={partner.title}
          company={partner.company}
          bio={partner.bio}
          expertise={partner.expertise}
          linkedin={partner.linkedin}
          image={partner.image}
        />
      ))}
    </div>
  )
}

interface TeamMemberCardProps {
  name: string
  title: string
  company: string
  bio: string
  expertise: string[]
  linkedin?: string
  email?: string
  image?: string
}

function TeamMemberCard({ 
  name, 
  title, 
  company, 
  bio, 
  expertise, 
  linkedin, 
  email, 
  image 
}: TeamMemberCardProps) {
  return (
    <div className="card group hover:scale-105 transition-transform duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-sage/20 to-terra/20 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-sage/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-display text-sage">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        )}
        
        {/* Expertise Tags */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {expertise.slice(0, 2).map((skill, index) => (
            <span key={index} className="badge-primary text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-1">{name}</h3>
        <p className="text-sage font-medium mb-1">{title}</p>
        <p className="text-warm-gray text-sm mb-4">{company}</p>
        
        <p className="body text-sm mb-4 line-clamp-3">{bio}</p>

        {/* Social Links */}
        <div className="flex items-center space-x-4">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sage hover:text-sage/80 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span className="text-sm">LinkedIn</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center space-x-2 text-sage hover:text-sage/80 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 