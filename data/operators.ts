export interface OperatorData {
  id: string
  name: string
  title: string
  subtitle?: string
  expertise: string[]
  photo: string
  linkedin?: string
}

export const operators: OperatorData[] = [
  {
    id: '1',
    name: 'Bob Battista',
    title: 'Head of Commercial, Salt AI',
    expertise: ['Life sciences go-to-market', 'Medical intelligence platforms', 'Commercial strategy', 'Enterprise AI adoption'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '2',
    name: 'Sibel Sayiner',
    title: 'VP, Business Operations & Analytics, Marley Medical',
    subtitle: '(prev. BCG, Propeller Health)',
    expertise: ['Digital health ops', 'Data-driven commercialization', 'Chronic disease virtual care', 'Payer/provider strategy'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '3',
    name: 'Stuart John',
    title: 'First American',
    expertise: ['Enterprise data platforms', 'Title & escrow tech', 'Large-scale systems modernization'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '4',
    name: 'Syuzi Pakhchyan',
    title: 'Head of Innovation & Emerging Experiences, Target',
    subtitle: '(prev. Design Director, BCG Digital Ventures)',
    expertise: ['Wearable tech & emerging interfaces', 'Experience design', 'Retail innovation', 'Fashion–technology convergence'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '5',
    name: 'Amy Zhang',
    title: 'Marketing Strategy & Growth',
    subtitle: '(formerly Senior Growth Architect, BCG Digital Ventures)',
    expertise: ['Growth marketing', 'Go-to-market for SaaS', 'Digital experiments & performance', 'Mission-driven brand strategy'],
    photo: '/img/placeholder-headshot.svg'
  }
]
