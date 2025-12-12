'use client'

import React from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import {
  TitleSlide,
  SectionSlide,
  ContentSlide,
  BulletSlide,
  StatsSlide,
  QuoteSlide,
  TwoColumnSlide,
  ComparisonSlide,
  ClosingSlide,
} from '@/components/presentation/SlideComponents'

// Define all slides for this presentation
const slides: Slide[] = [
  {
    id: 'title',
    title: 'Title',
    content: (
      <TitleSlide
        title="Health-Tech Market Landscape 2024"
        subtitle="Emerging trends, investment opportunities, and the future of digital health innovation"
        author="Tweed Collective Research"
        date="January 2024"
      />
    ),
  },
  {
    id: 'agenda',
    title: 'Agenda',
    content: (
      <BulletSlide
        title="What We'll Cover"
        bullets={[
          'Current state of the health-tech market',
          'Key investment trends and funding dynamics',
          'Emerging technology categories to watch',
          'Regulatory landscape and compliance considerations',
          'Strategic recommendations for growth',
        ]}
      />
    ),
  },
  {
    id: 'section-market',
    title: 'Market Overview',
    content: (
      <SectionSlide
        number={1}
        title="Market Overview"
        description="Understanding the current landscape and market dynamics"
      />
    ),
  },
  {
    id: 'market-size',
    title: 'Market Size',
    content: (
      <StatsSlide
        title="Health-Tech Market at a Glance"
        stats={[
          { value: '$189B', label: 'Global Market Size', description: '2024 estimate' },
          { value: '17.3%', label: 'CAGR', description: '2024-2030 projected' },
          { value: '$456B', label: 'Projected by 2030', description: 'Market opportunity' },
          { value: '12,000+', label: 'Active Startups', description: 'Globally' },
        ]}
      />
    ),
  },
  {
    id: 'market-drivers',
    title: 'Growth Drivers',
    content: (
      <BulletSlide
        title="Key Market Drivers"
        bullets={[
          { 
            text: 'Post-pandemic digital health adoption', 
            sub: ['Telehealth usage up 38x from pre-pandemic levels', 'Consumer expectations permanently shifted']
          },
          { 
            text: 'AI and machine learning advancement', 
            sub: ['Clinical decision support systems', 'Drug discovery acceleration']
          },
          { 
            text: 'Value-based care transition', 
            sub: ['Outcomes-focused reimbursement models', 'Population health management tools']
          },
          { 
            text: 'Aging population demographics', 
            sub: ['Chronic disease management demand', 'Remote patient monitoring growth']
          },
        ]}
      />
    ),
  },
  {
    id: 'section-investment',
    title: 'Investment Trends',
    content: (
      <SectionSlide
        number={2}
        title="Investment Trends"
        description="Where the capital is flowing and why"
      />
    ),
  },
  {
    id: 'funding-overview',
    title: 'Funding Landscape',
    content: (
      <ContentSlide title="2024 Funding Landscape">
        <div className="space-y-6">
          <p>
            After the record-breaking years of 2021-2022, health-tech funding has normalized 
            but remains significantly above pre-pandemic levels. Investors are becoming more 
            selective, focusing on companies with clear paths to profitability.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-sage/10 rounded-xl text-center">
              <div className="text-2xl font-serif text-sage mb-1">$29.1B</div>
              <div className="text-sm text-cream/60">2023 Total Funding</div>
            </div>
            <div className="p-4 bg-terra/10 rounded-xl text-center">
              <div className="text-2xl font-serif text-terra mb-1">-38%</div>
              <div className="text-sm text-cream/60">YoY Change</div>
            </div>
            <div className="p-4 bg-ochre/10 rounded-xl text-center">
              <div className="text-2xl font-serif text-ochre mb-1">1,247</div>
              <div className="text-sm text-cream/60">Deals Closed</div>
            </div>
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'hot-sectors',
    title: 'Hot Sectors',
    content: (
      <TwoColumnSlide
        title="Hottest Investment Sectors"
        left={
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sage mb-3">High Growth</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-sage rounded-full" />
                <span>AI-Powered Diagnostics</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-sage rounded-full" />
                <span>Mental Health Platforms</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-sage rounded-full" />
                <span>Clinical Trial Tech</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-sage rounded-full" />
                <span>Remote Patient Monitoring</span>
              </li>
            </ul>
          </div>
        }
        right={
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-terra mb-3">Emerging</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-terra rounded-full" />
                <span>Generative AI for Healthcare</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-terra rounded-full" />
                <span>Digital Biomarkers</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-terra rounded-full" />
                <span>Healthcare Interoperability</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-terra rounded-full" />
                <span>Precision Nutrition</span>
              </li>
            </ul>
          </div>
        }
      />
    ),
  },
  {
    id: 'section-tech',
    title: 'Technology Trends',
    content: (
      <SectionSlide
        number={3}
        title="Technology Trends"
        description="The technologies reshaping healthcare delivery"
      />
    ),
  },
  {
    id: 'ai-healthcare',
    title: 'AI in Healthcare',
    content: (
      <BulletSlide
        title="AI is Transforming Healthcare"
        bullets={[
          { 
            text: 'Clinical Decision Support', 
            sub: ['Real-time diagnostic assistance', 'Treatment recommendation engines']
          },
          { 
            text: 'Administrative Automation', 
            sub: ['Prior authorization', 'Medical coding and billing']
          },
          { 
            text: 'Drug Discovery', 
            sub: ['Molecule identification', 'Clinical trial optimization']
          },
          { 
            text: 'Patient Engagement', 
            sub: ['Conversational AI for triage', 'Personalized care journeys']
          },
        ]}
      />
    ),
  },
  {
    id: 'quote',
    title: 'Industry Insight',
    content: (
      <QuoteSlide
        quote="The next decade will see AI not replacing physicians, but empowering them to practice at the top of their license while democratizing access to world-class care."
        author="Dr. Eric Topol"
        role="Author, Deep Medicine"
      />
    ),
  },
  {
    id: 'section-strategy',
    title: 'Strategic Recommendations',
    content: (
      <SectionSlide
        number={4}
        title="Strategic Recommendations"
        description="Positioning for success in the evolving landscape"
      />
    ),
  },
  {
    id: 'recommendations',
    title: 'Key Recommendations',
    content: (
      <ComparisonSlide
        title="Path Forward"
        leftLabel="Avoid These Pitfalls"
        rightLabel="Embrace These Strategies"
        leftColor="coral"
        rightColor="sage"
        left={
          <ul className="space-y-2 text-sm">
            <li>• Building without clinical validation</li>
            <li>• Ignoring regulatory pathways</li>
            <li>• Underestimating sales cycles</li>
            <li>• Over-relying on pilot programs</li>
            <li>• Neglecting interoperability</li>
          </ul>
        }
        right={
          <ul className="space-y-2 text-sm">
            <li>• Partner early with health systems</li>
            <li>• Build evidence from day one</li>
            <li>• Focus on clear ROI metrics</li>
            <li>• Design for existing workflows</li>
            <li>• Plan for enterprise scale</li>
          </ul>
        }
      />
    ),
  },
  {
    id: 'closing',
    title: 'Thank You',
    content: (
      <ClosingSlide
        title="Let's Build the Future of Healthcare"
        message="Ready to accelerate your health-tech venture? Our team of operators and advisors is here to help."
        cta="Book a Strategy Call"
        ctaHref="/contact"
        contact={{
          email: 'hello@tweedcollective.com',
          website: 'tweedcollective.com'
        }}
      />
    ),
  },
]

export default function HealthTechMarket2024Page() {
  return (
    <PresentationLayout
      title="Health-Tech Market Landscape 2024"
      subtitle="Tweed Collective Research"
      slides={slides}
    />
  )
}

