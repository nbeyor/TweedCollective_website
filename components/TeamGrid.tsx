import React from 'react'
import { team } from '@/data/team'

export default function TeamGrid() {
  return (
    <section className="section bg-carbon relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12">
          <span className="mono-label mb-4 block">// Operators</span>
          <h2 className="text-cream">The team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="card p-6">
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream font-semibold text-lg hover:text-sage-light transition-colors"
                >
                  {member.name}
                </a>
              ) : (
                <span className="text-cream font-semibold text-lg">{member.name}</span>
              )}
              <p className="mono-label text-xs mt-2 mb-3">{member.role}</p>
              <p className="text-sm text-stone leading-relaxed">{member.expertise}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
