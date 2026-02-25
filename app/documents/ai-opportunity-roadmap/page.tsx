'use client'

import React from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import {
  RadarChart, PieChart, HorizontalBarChart, QuadrantChart, OrgTree,
} from '@/components/charts'
import type { OrgNode } from '@/components/charts'
import {
  Compass, TrendingUp, Target, Zap, BarChart3, Users, Brain,
  Lightbulb, Package, ArrowRight, Layers, Building2,
  Rocket, GitBranch, DollarSign, CheckCircle2, Shuffle,
} from 'lucide-react'

function PromptSection({ items }: { items: string[] }) {
  return (
    <div className="p-4 bg-sage/5 border border-sage/20 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-sage-bright" />
        <span className="text-xs uppercase tracking-wider text-sage-bright font-semibold">Evaluation Prompt</span>
      </div>
      <ul className="space-y-1.5 text-sm text-cream/70">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-sage/50 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SectionHeader({ section, title, subtitle }: { section: string; title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{section}</div>
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">{title}</h2>
      {subtitle && <p className="text-cream/50 text-sm">{subtitle}</p>}
    </div>
  )
}

function PrincipleCard({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white/5 border border-cream/10 rounded-lg">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sage/30 text-sage-bright flex items-center justify-center text-xs font-bold font-mono">
        {number}
      </span>
      <p className="text-sm text-cream/80 pt-0.5">{text}</p>
    </div>
  )
}

const orgStructure: OrgNode = {
  label: 'CEO',
  children: [
    {
      label: 'AI Committee',
      children: [
        { label: 'Dev Team' },
        {
          label: 'Business Units',
          children: [{ label: 'AI Advocates' }],
        },
      ],
    },
  ],
}

const slides: Slide[] = [
  {
    id: 'cover',
    title: 'Cover',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cream/20 bg-cream/5 mb-8">
          <Compass className="w-4 h-4 text-sage-bright" />
          <span className="text-xs uppercase tracking-wider text-cream/60">Assessment Template</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          AI Opportunity &<br />Roadmap Evaluation
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-6 max-w-3xl">
          Operating Company AI Assessment Template
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream/50 mb-10">
          <span>Outside-In Strategic Framework</span>
          <span className="hidden md:inline text-cream/20">|</span>
          <span>Tweed Collective</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sage/30 bg-sage/10">
          <Layers className="w-4 h-4 text-sage-bright" />
          <span className="text-xs uppercase tracking-wider text-sage-bright font-mono">11 Sections · Prompts + Example Visuals</span>
        </div>
      </div>
    ),
  },

  {
    id: 'executive-summary',
    title: '1. Executive Summary',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 01" title="Executive Summary" />
        <PromptSection items={[
          'Current AI maturity level',
          'Strategic intent',
          'Primary value creation thesis',
          'Top 3 strengths',
          'Top 3 risks',
          'Immediate recommended focus',
        ]} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-sage-bright" />
              AI Maturity Radar — Example
            </h3>
            <RadarChart
              labels={['AI Strategy', 'Data Assets', 'Workflow Integration', 'External Products', 'Governance', 'Measurement']}
              values={[7, 8, 6, 5, 7, 4]}
              height={260}
            />
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sage-bright" />
              How to Use This Radar
            </h3>
            <div className="space-y-3 text-sm text-cream/70">
              <p>Score each axis 1–10 based on evidence gathered during assessment.</p>
              <div className="space-y-2">
                {[
                  { axis: 'AI Strategy', desc: 'Clarity of AI vision, board-level buy-in, dedicated budget' },
                  { axis: 'Data Assets', desc: 'Proprietary data, longitudinal depth, data infrastructure' },
                  { axis: 'Workflow Integration', desc: 'AI embedded in daily operations vs. standalone tools' },
                  { axis: 'External Products', desc: 'AI in customer-facing offerings, pricing power' },
                  { axis: 'Governance', desc: 'AI committee, review cadence, risk framework' },
                  { axis: 'Measurement', desc: 'KPI tracking, closed-loop attribution, ROI evidence' },
                ].map(item => (
                  <div key={item.axis} className="flex items-start gap-2">
                    <span className="text-sage-bright font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                    <span><strong className="text-cream/90">{item.axis}:</strong> {item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'business-drivers',
    title: '2. Business Drivers & Strategic Context',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 02" title="Business Drivers & Strategic Context" />
        <PromptSection items={[
          'Revenue model',
          'Cost structure',
          'Labor intensity',
          'Margin drivers',
          'Competitive positioning',
          'Where AI can realistically move EBITDA',
        ]} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sage-bright" />
              Revenue Mix — Example
            </h3>
            <HorizontalBarChart
              items={[
                { label: 'Medical Communications', value: 35 },
                { label: 'HCP Promotion', value: 20 },
                { label: 'Analytics', value: 15 },
                { label: 'Market Research', value: 15 },
                { label: 'Market Access', value: 10 },
                { label: 'Other', value: 5 },
              ]}
              suffix="%"
              maxValue={40}
              height={250}
            />
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sage-bright" />
              Cost Structure — Example
            </h3>
            <PieChart
              segments={[
                { label: 'Labor', value: 65, color: '#6B8E6F' },
                { label: 'Overhead', value: 15, color: '#A89685' },
                { label: 'Technology', value: 10, color: '#D4AF37' },
                { label: 'Other', value: 10, color: '#22D3EE' },
              ]}
              height={260}
            />
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'ai-initiative-inventory',
    title: '3. AI Initiative Inventory',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 03" title="AI Initiative Inventory" />
        <PromptSection items={[
          'List all AI initiatives — categorize: Internal (Efficiency), External (Revenue/Differentiation), Platform (Data/Infrastructure)',
          'For each: Owner, Stage, KPI, Financial impact (estimated vs measured)',
        ]} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-sage-bright" />
              Initiative Table — Example
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cream/10">
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">Initiative</th>
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">Type</th>
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">Stage</th>
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">KPI</th>
                    <th className="text-right py-2 pr-3 text-cream/50 font-medium">Est. Value</th>
                    <th className="text-left py-2 text-cream/50 font-medium">Measured?</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'AI Content Generator', type: 'Internal', stage: 'Production', kpi: 'Hours saved / deliverable', value: '$500K', measured: 'Projected' },
                    { name: 'Predictive Analytics Suite', type: 'External', stage: 'Beta', kpi: 'Win rate uplift', value: '$1.2M', measured: 'Partial' },
                    { name: 'Data Lake Consolidation', type: 'Platform', stage: 'Planning', kpi: 'Query response time', value: '$200K', measured: 'No' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-cream/5">
                      <td className="py-2 pr-3 text-cream/80 font-medium">{row.name}</td>
                      <td className="py-2 pr-3"><span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${row.type === 'Internal' ? 'bg-sage/20 text-sage-bright' : row.type === 'External' ? 'bg-gold/20 text-gold' : 'bg-helix-cyan/20 text-helix-cyan'}`}>{row.type}</span></td>
                      <td className="py-2 pr-3 text-cream/60">{row.stage}</td>
                      <td className="py-2 pr-3 text-cream/60">{row.kpi}</td>
                      <td className="py-2 pr-3 text-right text-cream/80 font-mono">{row.value}</td>
                      <td className="py-2 text-cream/60">{row.measured}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sage-bright" />
              Portfolio Heatmap — Example
            </h3>
            <QuadrantChart
              xLabel="Build Complexity →"
              yLabel="Strategic Value →"
              quadrants={['Accelerate', 'Optimize', 'Reconsider', 'Monitor']}
              points={[
                { label: 'AI Content Gen', x: 0.3, y: 0.8 },
                { label: 'Pred. Analytics', x: 0.65, y: 0.7 },
                { label: 'Data Lake', x: 0.7, y: 0.35 },
              ]}
              height={280}
            />
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'differentiating-assets',
    title: '4. Differentiating Assets',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 04"
          title="Differentiating Assets"
          subtitle="Identify durable AI moats vs. LLM commoditization risk"
        />
        <PromptSection items={[
          'Proprietary data',
          'Longitudinal signals',
          'Closed-loop measurement',
          'Embedded domain expertise',
          'Workflow ownership',
          'Assess defensibility vs LLM commoditization',
        ]} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-sage-bright" />
              Moat Strength Score — Example
            </h3>
            <HorizontalBarChart
              items={[
                { label: 'Proprietary Data', value: 9 },
                { label: 'Domain Expertise', value: 8 },
                { label: 'Workflow Integration', value: 6 },
                { label: 'Model Sophistication', value: 5 },
                { label: 'Closed-Loop Attribution', value: 4 },
              ]}
              suffix="/10"
              maxValue={10}
              height={230}
            />
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3">Defensibility Framework</h3>
            <div className="space-y-3">
              {[
                { label: 'Proprietary Data', score: 'Strong', desc: 'Years of unique, domain-specific data that cannot be replicated', color: 'text-green-400' },
                { label: 'Domain Expertise', score: 'Strong', desc: 'Deep vertical knowledge embedded in product logic and workflows', color: 'text-green-400' },
                { label: 'Workflow Integration', score: 'Moderate', desc: 'Switching costs exist but integrations could be rebuilt', color: 'text-yellow-400' },
                { label: 'Model Sophistication', score: 'Vulnerable', desc: 'Foundation model improvements may erode custom model advantages', color: 'text-red-400' },
                { label: 'Closed-Loop Attribution', score: 'Weak', desc: 'Limited ability to demonstrate cause → effect from AI interventions', color: 'text-red-400' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 text-xs">
                  <span className={`${item.color} font-mono flex-shrink-0 w-20 text-right`}>{item.score}</span>
                  <span className="text-cream/30">|</span>
                  <div>
                    <span className="text-cream/90 font-medium">{item.label}</span>
                    <span className="text-cream/50 ml-1">— {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'team-governance',
    title: '5. Team & Governance',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 05" title="Team & Governance" />
        <PromptSection items={[
          'Centralized vs distributed AI operating model',
          'Dev team size',
          'Product ownership',
          'KPI tracking',
          'Governance cadence',
          'Identify structural weaknesses',
        ]} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-cream mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-bright" />
              AI Operating Model — Example
            </h3>
            <OrgTree root={orgStructure} />
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3">Governance Checklist</h3>
            <div className="space-y-2">
              {[
                { item: 'AI committee with exec sponsor', status: true },
                { item: 'Regular governance cadence (monthly+)', status: true },
                { item: 'Dedicated AI product owner', status: false },
                { item: 'Cross-functional AI advocates in BUs', status: true },
                { item: 'KPI dashboard with live metrics', status: false },
                { item: 'Risk & compliance review process', status: true },
                { item: 'Budget allocated to AI R&D', status: false },
                { item: 'External advisory network', status: false },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${check.status ? 'text-green-400' : 'text-cream/20'}`} />
                  <span className={check.status ? 'text-cream/80' : 'text-cream/40'}>{check.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'internal-value',
    title: '6. Internal Stories of Value',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 06"
          title="Internal Stories of Value"
          subtitle="Quantify the impact of AI on internal operations"
        />
        <PromptSection items={[
          'For each major internal initiative:',
          'Define problem → mechanism → measurable KPI',
          'Quantify annual impact',
          'Clarify scalability',
        ]} />
        <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gold" />
            Financial Impact Template — Example
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-cream/40">Problem</h4>
              <p className="text-sm text-cream/70">QA review cycle consumes 2 review rounds per job, adding $250 in labor per revision</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-cream/40">Mechanism</h4>
              <p className="text-sm text-cream/70">AI pre-screening catches 60% of issues before human review, reducing average rounds from 2 → 1</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-cream/40">Impact</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between text-cream/60"><span>Jobs / year</span><span className="text-cream/90">3,000</span></div>
                <div className="flex justify-between text-cream/60"><span>1 round saved</span><span className="text-cream/90">$250 / job</span></div>
                <div className="flex justify-between text-cream/60 border-t border-cream/10 pt-2"><span>Annual savings</span><span className="text-gold font-bold">$750,000</span></div>
                <div className="flex justify-between text-cream/60"><span>Build cost</span><span className="text-cream/90">$50,000</span></div>
                <div className="flex justify-between text-cream/60 border-t border-cream/10 pt-2"><span>ROI Year 1</span><span className="text-green-400 font-bold">15×</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'external-value',
    title: '7. Customer-Facing Stories of Value',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 07" title="Customer-Facing Stories of Value" />
        <PromptSection items={[
          'What does each external AI initiative replace or enhance?',
          'Table stakes or differentiator?',
          'Pricing model?',
          'Evidence of impact?',
          'Risk of commoditization?',
        ]} />
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Replaces / Enhances',
              icon: <Shuffle className="w-4 h-4 text-sage-bright" />,
              desc: 'Does this AI feature replace a manual workflow, augment an existing product, or create an entirely new offering?',
            },
            {
              title: 'Table Stakes vs. Differentiator',
              icon: <Target className="w-4 h-4 text-gold" />,
              desc: 'Will competitors have this within 12 months? If so, it\'s table stakes. If not, what makes it defensible?',
            },
            {
              title: 'Pricing Power',
              icon: <DollarSign className="w-4 h-4 text-helix-cyan" />,
              desc: 'Can you charge more for the AI-enhanced version? Is pricing based on value delivered or cost-plus?',
            },
            {
              title: 'Commoditization Risk',
              icon: <GitBranch className="w-4 h-4 text-rust" />,
              desc: 'Could a foundation model provider or new entrant replicate this with generic AI? What\'s the moat?',
            },
          ].map(card => (
            <div key={card.title} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                {card.icon}
                <h3 className="text-sm font-semibold text-cream">{card.title}</h3>
              </div>
              <p className="text-xs text-cream/60">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'roadmap-prioritization',
    title: '8. Roadmap & Prioritization',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 08" title="Roadmap & Prioritization" />
        <PromptSection items={[
          'Prioritize based on: 90-day measurability, strategic importance, build complexity, differentiation durability',
          'Categorize into: Double Down, Consolidate, Accelerate, Reposition, Cut',
        ]} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-sage-bright" />
              Prioritization Matrix — Example
            </h3>
            <QuadrantChart
              xLabel="Complexity →"
              yLabel="Value →"
              quadrants={['Accelerate', 'Double Down', 'Reposition', 'Cut']}
              points={[
                { label: 'AI Content Gen', x: 0.2, y: 0.9 },
                { label: 'Pred. Analytics', x: 0.55, y: 0.75 },
                { label: 'Data Lake', x: 0.8, y: 0.4 },
              ]}
              height={280}
            />
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3">Action Categories</h3>
            <div className="space-y-3">
              {[
                { action: 'Double Down', color: 'bg-green-500/20 text-green-300 border-green-500/30', desc: 'High value, moderate complexity. Invest more resources immediately.' },
                { action: 'Accelerate', color: 'bg-sage/20 text-sage-bright border-sage/30', desc: 'High value, high complexity. Speed up timeline, add resources.' },
                { action: 'Consolidate', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', desc: 'Moderate value, scattered execution. Merge overlapping initiatives.' },
                { action: 'Reposition', color: 'bg-taupe/30 text-taupe-light border-taupe/40', desc: 'Low value as positioned. Re-scope to target higher-impact use cases.' },
                { action: 'Cut', color: 'bg-red-500/20 text-red-300 border-red-500/30', desc: 'Low value, high complexity. Redirect resources elsewhere.' },
              ].map(item => (
                <div key={item.action} className="flex items-start gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5 ${item.color}`}>{item.action}</span>
                  <span className="text-xs text-cream/60">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'change-management',
    title: '9. Change Management Requirements',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 09" title="Change Management Requirements" />
        <PromptSection items={[
          'Product leadership gaps',
          'KPI instrumentation needs',
          'Training requirements',
          'Workflow changes',
          'External advisors needed',
        ]} />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'People',
              icon: <Users className="w-5 h-5 text-sage-bright" />,
              items: ['Hire or promote AI product owner', 'Train BU leaders on AI value measurement', 'Recruit data engineering talent', 'Establish AI champion network in each BU'],
            },
            {
              title: 'Process',
              icon: <GitBranch className="w-5 h-5 text-gold" />,
              items: ['Monthly AI governance reviews', 'Standardize initiative proposal template', 'Implement 90-day measurable milestone gates', 'Quarterly portfolio rebalancing'],
            },
            {
              title: 'Technology',
              icon: <Building2 className="w-5 h-5 text-helix-cyan" />,
              items: ['Consolidate data infrastructure', 'Implement KPI tracking dashboard', 'Establish model monitoring & eval framework', 'Build feedback loops into AI products'],
            },
          ].map(col => (
            <div key={col.title} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                {col.icon}
                <h3 className="text-sm font-semibold text-cream">{col.title}</h3>
              </div>
              <ul className="space-y-2">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-cream/70">
                    <ArrowRight className="w-3 h-3 mt-0.5 text-cream/30 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'quantifying-upside',
    title: '10. Quantifying "Getting It Right"',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 10"
          title="Quantifying &ldquo;Getting It Right&rdquo;"
          subtitle="The financial case for focused AI execution"
        />
        <PromptSection items={[
          'Margin expansion from efficiency gains',
          'Revenue growth from AI-enhanced products',
          'Subscription mix shift',
          'Multiple expansion from AI positioning',
        ]} />
        <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            EBITDA Impact Model — Example
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10">
                  <th className="text-left py-3 pr-4 text-cream/50 font-medium">Category</th>
                  <th className="text-right py-3 px-4 text-cream/50 font-medium">Year 1</th>
                  <th className="text-right py-3 pl-4 text-cream/50 font-medium">Year 3</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  { category: 'Efficiency Gains', y1: '$1.0M', y3: '$2.5M' },
                  { category: 'Subscription Shift', y1: '$0.5M', y3: '$3.0M' },
                  { category: 'Retention Lift', y1: '$0.3M', y3: '$1.0M' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-2.5 pr-4 text-cream/80 font-sans">{row.category}</td>
                    <td className="py-2.5 px-4 text-right text-cream/70">{row.y1}</td>
                    <td className="py-2.5 pl-4 text-right text-cream/70">{row.y3}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-cream/20">
                  <td className="py-3 pr-4 text-cream font-sans font-semibold">Total EBITDA Impact</td>
                  <td className="py-3 px-4 text-right text-gold font-bold">$1.8M</td>
                  <td className="py-3 pl-4 text-right text-gold font-bold">$6.5M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 'final-recommendations',
    title: '11. Final Recommendations & Core Principles',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 11" title="Final Recommendations" />
        <PromptSection items={[
          'Top 3 initiatives to focus on',
          'What to consolidate',
          'What to cut',
          'What to accelerate',
          'Organizational changes required',
          'Timeline & quantified targets',
        ]} />
        <div>
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-sage-bright" />
            Core Principles
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <PrincipleCard number={1} text="AI must move EBITDA." />
            <PrincipleCard number={2} text="Data + workflow + expertise > model capability." />
            <PrincipleCard number={3} text="Pick the smallest measurable win first." />
            <PrincipleCard number={4} text="Consolidate before proliferating." />
            <PrincipleCard number={5} text="Closed-loop measurement transforms positioning." />
            <PrincipleCard number={6} text="AI should change what you charge, not just what you cost." />
          </div>
        </div>
      </div>
    ),
  },
]

export default function AIOpportunityRoadmapPage() {
  return (
    <DocumentAccessWrapper
      documentId="ai-opportunity-roadmap"
      documentTitle="AI Opportunity & Roadmap Evaluation"
    >
      <PresentationLayout
        title="AI Opportunity & Roadmap Evaluation"
        subtitle="Operating Company AI Assessment Template"
        slides={slides}
        classificationBanner="Tweed Collective — Assessment Template"
      />
    </DocumentAccessWrapper>
  )
}
