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
      'Leads AI strategy and technical diligence; builds commercial engines and go-to-market plans for life sciences companies',
  },
  {
    name: 'Sam Juraschka',
    role: 'Operating Partner',
    expertise:
      'Takes AI products from concept to launch — product strategy, roadmap definition, and zero-to-one venture building',
    linkedin: 'https://www.linkedin.com/in/sjuraschka',
  },
  {
    name: 'Dan Sheikh',
    role: 'Operating Partner',
    expertise:
      'Stands up engineering teams and ships production AI systems — architecture, data pipelines, and program delivery',
    linkedin: 'https://www.linkedin.com/in/dansheikh',
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
