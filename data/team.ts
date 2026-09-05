export interface TeamMember {
  name: string
  role: string
  expertise: string
  linkedin?: string
}

// LinkedIn URLs for members without one render unlinked until provided.
export const team: TeamMember[] = [
  {
    name: 'Nate Beyor',
    role: 'Founder',
    expertise:
      'Leads AI diligence and the post-close operating standard; commercial and technical judgment across software and life sciences',
  },
  {
    name: 'Sam Juraschka',
    role: 'Operating Partner',
    expertise:
      'Takes AI products from concept to launch — product strategy, roadmap definition, and the operating plan that makes a thesis testable',
    linkedin: 'https://www.linkedin.com/in/sjuraschka',
  },
  {
    name: 'Hans Yang',
    role: 'Operating Partner',
    expertise:
      'Takes AI from strategy to production — product judgment, implementation, and adoption that moves the P&L',
    linkedin: 'https://www.linkedin.com/in/hanscyang',
  },
  {
    name: 'Bob Battista',
    role: 'Commercial Leadership',
    expertise:
      'Builds enterprise sales motions and partnerships that turn AI platforms into revenue in life sciences and healthcare',
  },
  {
    name: 'Sibel Sayiner',
    role: 'Business Operations & Analytics',
    expertise:
      'Designs the operating backbone of digital health businesses — care operations, analytics, and data-driven commercialization',
  },
  {
    name: 'Stuart John',
    role: 'Data Platforms & Product',
    expertise:
      'Modernizes legacy enterprise systems and builds large-scale data platforms that make AI adoption possible',
  },
  {
    name: 'Syuzi Pakhchyan',
    role: 'Innovation & Experience Design',
    expertise:
      'Prototypes and launches emerging interface experiences — turning new technologies into products customers actually use',
  },
  {
    name: 'Amy Zhang',
    role: 'Marketing Strategy & Growth',
    expertise:
      'Builds demand engines for SaaS — positioning, pipeline generation, and full-funnel growth marketing',
  },
]
