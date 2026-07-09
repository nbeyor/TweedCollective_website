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
    expertise: 'AI strategy and diligence, life sciences commercial leadership',
  },
  {
    name: 'Sam Juraschka',
    role: 'Operating Partner',
    expertise: 'Product strategy and delivery for AI-enabled software',
    linkedin: 'https://www.linkedin.com/in/sjuraschka',
  },
  {
    name: 'Dan Sheikh',
    role: 'Operating Partner',
    expertise: 'Engineering leadership and AI program delivery',
    linkedin: 'https://www.linkedin.com/in/dansheikh',
  },
  {
    name: 'Bob Battista',
    role: 'Head of Commercial, Salt AI',
    expertise: 'Life sciences go-to-market and enterprise AI adoption',
  },
  {
    name: 'Sibel Sayiner',
    role: 'VP, Business Operations & Analytics, Marley Medical',
    expertise: 'Digital health operations and data-driven commercialization',
  },
  {
    name: 'Stuart John',
    role: 'First American',
    expertise: 'Enterprise data platforms and large-scale systems modernization',
  },
  {
    name: 'Syuzi Pakhchyan',
    role: 'Head of Innovation & Emerging Experiences, Target',
    expertise: 'Experience design and emerging interfaces',
  },
  {
    name: 'Amy Zhang',
    role: 'Marketing Strategy & Growth',
    expertise: 'Growth marketing and go-to-market for SaaS',
  },
]
