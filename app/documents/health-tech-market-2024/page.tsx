'use client'

import React from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import { BarChart3, TrendingUp, Zap, Target, Users, Sprout, Rocket, ArrowUp, Briefcase, FlaskConical, Stethoscope, ShoppingCart } from 'lucide-react'

// Define slides
const slides: Slide[] = [
  {
    id: 'title',
    title: 'Title',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cream/20 bg-cream/5 mb-6">
          <span className="text-xs uppercase tracking-wider text-cream/60">Market Research</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          Health-Tech Market Landscape
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-8 max-w-2xl">
          Entering 2026: Investment themes across stages and segments
        </p>
        
        {/* Key Insight Box */}
        <div className="w-full max-w-4xl p-6 rounded-xl border-l-4 border-purple-500 bg-purple-500/10 mb-8 text-left">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Market Context</div>
          <p className="text-sm text-cream/80 leading-relaxed">
            Health-tech investment has normalized post-pandemic but remains elevated. 
            Investors are increasingly stage- and segment-specific in their strategies. 
            This analysis structures opportunities by investment stage and market segment.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'overview',
    title: 'Market Overview',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Section 01</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Market at a Glance</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">$456B</div>
            <div className="text-xs text-cream/60 mb-2">Projected Market Size</div>
            <div className="text-xs text-cream/50">By 2030</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">17.3%</div>
            <div className="text-xs text-cream/60 mb-2">CAGR</div>
            <div className="text-xs text-cream/50">2024-2030</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">$29.1B</div>
            <div className="text-xs text-cream/60 mb-2">2025 Funding</div>
            <div className="text-xs text-cream/50">Total invested</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">1,200+</div>
            <div className="text-xs text-cream/60 mb-2">Active Startups</div>
            <div className="text-xs text-cream/50">Globally</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Key Trend</div>
          <p className="text-sm text-cream/80">
            After normalization from 2021-2022 peaks, investors are becoming more selective, 
            focusing on companies with clear paths to profitability and strong unit economics.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'structure',
    title: 'Analysis Structure',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Section 02</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Two-Dimensional Framework</h2>
        
        <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
          Health-tech opportunities differ meaningfully by investment stage and market segment. 
          This analysis structures themes across both dimensions.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">By Investment Stage</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Seed:</strong> Product-market fit, early validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Venture:</strong> Scaling, growth metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Growth:</strong> Market expansion, profitability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Buyout:</strong> Operational optimization, exits</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">By Market Segment</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Pharmatech:</strong> Drug discovery, clinical trials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Provider/Payor Tech:</strong> Health systems, insurers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Consumer Facing:</strong> Direct-to-consumer health</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'stage-seed',
    title: 'Seed Stage Themes',
    content: <StageSlide stage="seed" />
  },
  {
    id: 'stage-venture',
    title: 'Venture Stage Themes',
    content: <StageSlide stage="venture" />
  },
  {
    id: 'stage-growth',
    title: 'Growth Stage Themes',
    content: <StageSlide stage="growth" />
  },
  {
    id: 'stage-buyout',
    title: 'Buyout Stage Themes',
    content: <StageSlide stage="buyout" />
  },
  {
    id: 'segment-pharmatech',
    title: 'Pharmatech Segment',
    content: <SegmentSlide segment="pharmatech" />
  },
  {
    id: 'segment-provider-payor',
    title: 'Provider/Payor Tech Segment',
    content: <SegmentSlide segment="provider-payor" />
  },
  {
    id: 'segment-consumer',
    title: 'Consumer Facing Segment',
    content: <SegmentSlide segment="consumer" />
  },
  {
    id: 'cross-cutting',
    title: 'Cross-Cutting Themes',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Section 03</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Themes Across All Stages & Segments</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">AI & Machine Learning</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Clinical decision support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Drug discovery acceleration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Administrative automation</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Value-Based Care</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Outcomes-focused models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Population health management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Risk-based contracting</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Interoperability</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>FHIR adoption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Data exchange standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Platform integration</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Evidence Generation</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Real-world evidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Clinical validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>ROI demonstration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'recommendations',
    title: 'Strategic Recommendations',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Section 04</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Path Forward</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 rounded-xl border-2 border-red-500/50 bg-red-500/10">
            <h3 className="text-lg font-semibold text-red-300 mb-4">❌ Avoid These Pitfalls</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Building without clinical validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Ignoring regulatory pathways</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Underestimating sales cycles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Over-relying on pilot programs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Neglecting interoperability</span>
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl border-2 border-green-500/50 bg-green-500/10">
            <h3 className="text-lg font-semibold text-green-300 mb-4">✅ Embrace These Strategies</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Partner early with health systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Build evidence from day one</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Focus on clear ROI metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Design for existing workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Plan for enterprise scale</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
]

// Stage Slide Component
function StageSlide({ stage }: { stage: 'seed' | 'venture' | 'growth' | 'buyout' }) {
  const stageData = {
    seed: {
      icon: Sprout,
      title: 'Seed Stage',
      description: 'Product-market fit, early validation',
      themes: [
        {
          title: 'Proof of Concept',
          items: ['MVP development', 'Early customer validation', 'Clinical feasibility studies']
        },
        {
          title: 'Regulatory Strategy',
          items: ['FDA pathway identification', 'Regulatory consulting', 'Compliance planning']
        },
        {
          title: 'Team Building',
          items: ['Founder-market fit', 'Advisory board formation', 'Early hires']
        }
      ]
    },
    venture: {
      icon: Rocket,
      title: 'Venture Stage',
      description: 'Scaling, growth metrics',
      themes: [
        {
          title: 'Revenue Growth',
          items: ['Pilot to production', 'Sales team scaling', 'Customer acquisition']
        },
        {
          title: 'Product Development',
          items: ['Feature expansion', 'Platform development', 'Integration capabilities']
        },
        {
          title: 'Market Expansion',
          items: ['Geographic expansion', 'Segment diversification', 'Partnership development']
        }
      ]
    },
    growth: {
      icon: ArrowUp,
      title: 'Growth Stage',
      description: 'Market expansion, profitability',
      themes: [
        {
          title: 'Unit Economics',
          items: ['CAC/LTV optimization', 'Gross margin improvement', 'Operational efficiency']
        },
        {
          title: 'Market Leadership',
          items: ['Category creation', 'Brand building', 'Thought leadership']
        },
        {
          title: 'Strategic Positioning',
          items: ['M&A opportunities', 'Platform strategy', 'Ecosystem development']
        }
      ]
    },
    buyout: {
      icon: Briefcase,
      title: 'Buyout Stage',
      description: 'Operational optimization, exits',
      themes: [
        {
          title: 'Operational Excellence',
          items: ['Process optimization', 'Cost structure improvement', 'Margin expansion']
        },
        {
          title: 'Strategic Options',
          items: ['Exit preparation', 'Strategic partnerships', 'Portfolio optimization']
        },
        {
          title: 'Value Creation',
          items: ['EBITDA improvement', 'Market positioning', 'Exit multiples']
        }
      ]
    }
  }

  const data = stageData[stage]
  const Icon = data.icon

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">By Stage</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">{data.title}</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        {data.description}
      </p>

      <div className="space-y-4">
        {data.themes.map((theme, index) => (
          <div key={index} className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-cream mb-3">{theme.title}</h3>
                <ul className="space-y-2">
                  {theme.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-sage mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Segment Slide Component
function SegmentSlide({ segment }: { segment: 'pharmatech' | 'provider-payor' | 'consumer' }) {
  const segmentData = {
    pharmatech: {
      icon: FlaskConical,
      title: 'Pharmatech',
      description: 'Drug discovery, clinical trials, biotech innovation',
      themes: [
        {
          title: 'AI-Powered Drug Discovery',
          items: ['Molecule identification', 'Target validation', 'Lead optimization']
        },
        {
          title: 'Clinical Trial Technology',
          items: ['Trial design optimization', 'Patient recruitment', 'Data management']
        },
        {
          title: 'Biomarker Development',
          items: ['Diagnostic tools', 'Companion diagnostics', 'Precision medicine']
        }
      ]
    },
    'provider-payor': {
      icon: Stethoscope,
      title: 'Provider/Payor Tech',
      description: 'Health systems, insurers, care delivery',
      themes: [
        {
          title: 'Clinical Workflow',
          items: ['EHR optimization', 'Clinical decision support', 'Care coordination']
        },
        {
          title: 'Revenue Cycle',
          items: ['Billing automation', 'Prior authorization', 'Claims processing']
        },
        {
          title: 'Population Health',
          items: ['Risk stratification', 'Care management', 'Quality metrics']
        }
      ]
    },
    consumer: {
      icon: ShoppingCart,
      title: 'Consumer Facing',
      description: 'Direct-to-consumer health, wellness, digital therapeutics',
      themes: [
        {
          title: 'Digital Therapeutics',
          items: ['Prescription digital therapeutics', 'Behavioral health apps', 'Chronic disease management']
        },
        {
          title: 'Telehealth & Virtual Care',
          items: ['Virtual consultations', 'Remote monitoring', 'Asynchronous care']
        },
        {
          title: 'Consumer Wellness',
          items: ['Fitness & nutrition', 'Mental wellness', 'Preventive care']
        }
      ]
    }
  }

  const data = segmentData[segment]
  const Icon = data.icon

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">By Segment</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">{data.title}</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        {data.description}
      </p>

      <div className="space-y-4">
        {data.themes.map((theme, index) => (
          <div key={index} className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-cream mb-3">{theme.title}</h3>
                <ul className="space-y-2">
                  {theme.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-sage mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HealthTechMarket2024Page() {
  return (
    <PresentationLayout
      title="Health-Tech Market Landscape: Entering 2026"
      subtitle="Investment themes across stages and segments"
      slides={slides}
    />
  )
}
