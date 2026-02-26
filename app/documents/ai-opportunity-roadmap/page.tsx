'use client'

import React from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import {
  RadarChart, PieChart, HorizontalBarChart, QuadrantChart,
} from '@/components/charts'
import {
  Compass, TrendingUp, Target, Zap, BarChart3, Users, Brain,
  Package, ArrowRight, Layers, Lock, AlertTriangle, Check,
  Rocket, DollarSign, CheckCircle2, AlertCircle, Database,
  ArrowUpRight, Minus,
} from 'lucide-react'

function SectionHeader({ section, title, subtitle }: { section: string; title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{section}</div>
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">{title}</h2>
      {subtitle && <p className="text-cream/50 text-sm">{subtitle}</p>}
    </div>
  )
}

function RatingBadge({ rating }: { rating: string }) {
  const colorMap: Record<string, string> = {
    'HIGH': 'bg-green-500/20 text-green-300 border-green-500/30',
    'MODERATE': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'LOW': 'bg-red-500/20 text-red-300 border-red-500/30',
    'STRONG': 'bg-green-500/20 text-green-300 border-green-500/30',
    'LOWER': 'bg-green-500/15 text-green-300 border-green-500/25',
    'HIGHER': 'bg-red-500/20 text-red-300 border-red-500/30',
  }
  const cls = colorMap[rating.toUpperCase()] || 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  return <span className={`inline-flex items-center rounded-full border font-mono font-medium px-2 py-0.5 text-[10px] ${cls}`}>{rating}</span>
}

function DataFlowDiagram() {
  const sources = ['Claims Data', 'Advisory Boards', 'Speaker Bureau', 'Engagement Data', 'Publications']
  const outputs = ['Pantheon', 'PerspectivX', 'Predictive Models']
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <div className="space-y-1.5 flex-shrink-0">
        {sources.map(s => (
          <div key={s} className="px-2.5 py-1.5 bg-taupe/15 border border-taupe/25 rounded text-[10px] md:text-xs text-cream/70 text-right whitespace-nowrap">{s}</div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="text-cream/20 text-lg">→</div>
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="px-4 py-3 bg-sage/20 border-2 border-sage/40 rounded-xl text-sm text-cream font-semibold flex items-center gap-2">
          <Database className="w-4 h-4 text-sage-bright" />
          ION Data Lake
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="text-cream/20 text-lg">→</div>
      </div>
      <div className="space-y-1.5 flex-shrink-0">
        {outputs.map(o => (
          <div key={o} className="px-2.5 py-1.5 bg-sage/10 border border-sage/20 rounded text-[10px] md:text-xs text-cream/70 whitespace-nowrap">{o}</div>
        ))}
      </div>
    </div>
  )
}

const slides: Slide[] = [
  // ================================================================
  // SLIDE 1: COVER
  // ================================================================
  {
    id: 'cover',
    title: 'Cover',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cream/20 bg-cream/5 mb-8">
          <Compass className="w-4 h-4 text-sage-bright" />
          <span className="text-xs uppercase tracking-wider text-cream/60">Strategic Assessment</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          MKG: AI Opportunity &<br />Roadmap Assessment
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-6 max-w-3xl">
          Outside-In Strategic Evaluation
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream/50 mb-10">
          <span>Prepared for: MKG Leadership</span>
          <span className="hidden md:inline text-cream/20">|</span>
          <span>Prepared by: Tweed Collective</span>
          <span className="hidden md:inline text-cream/20">|</span>
          <span>February 2026</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10">
          <Lock className="w-4 h-4 text-red-300" />
          <span className="text-xs uppercase tracking-wider text-red-300 font-mono">Confidential</span>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 2: EXECUTIVE SUMMARY
  // ================================================================
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 01" title="Executive Summary" />
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <p className="text-sm text-cream/80 leading-relaxed">
            MKG has built a structured AI ecosystem under the <strong className="text-cream">ION platform</strong>, organized into
            <strong className="text-sage-bright"> KINETICS</strong> (internal efficiency),
            <strong className="text-gold"> DIFFUSION</strong> (client-facing AI products), and the
            <strong className="text-helix-cyan"> ION Data Lake</strong> (proprietary data backbone).
            Meaningful tooling exists across the portfolio, but tools are fragmented and lack closed-loop measurement. The critical next step is connecting these point solutions into cohesive business process workflows.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3">AI Maturity Radar</h3>
            <RadarChart
              labels={['Strategy', 'Data Assets', 'Workflow Integration', 'External Differentiation', 'Governance', 'Measurement']}
              values={[7, 9, 6, 6, 6, 4]}
              height={250}
            />
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" /> Top Strengths
              </h3>
              <ol className="space-y-1.5 text-xs text-cream/70 list-decimal list-inside">
                <li>Proprietary ION Data Lake (claims, engagement, advisory, publication data)</li>
                <li>Medical &amp; compliance expertise deeply embedded in organization</li>
                <li>Disciplined build-vs-ROI governance process</li>
              </ol>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Top Risks
              </h3>
              <ol className="space-y-1.5 text-xs text-cream/70 list-decimal list-inside">
                <li>Portfolio sprawl across 20+ branded AI tools</li>
                <li>Limited closed-loop ROI measurement (especially 81qd)</li>
                <li>Risk of LLM wrapper commoditization in client-facing tools</li>
              </ol>
            </div>
            <div className="p-4 bg-sage/10 border border-sage/30 rounded-xl">
              <h3 className="text-sm font-semibold text-sage-bright mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Immediate Focus
              </h3>
              <ol className="space-y-1.5 text-xs text-cream/70 list-decimal list-inside">
                <li>Make Route Reagent flagship 90-day measurable win</li>
                <li>Consolidate editorial AI stack</li>
                <li>Move Pantheon → predictive intelligence layer</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 3: BUSINESS DRIVERS & STRATEGIC CONTEXT
  // ================================================================
  {
    id: 'business-drivers',
    title: 'Business Drivers & Strategic Context',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 02" title="Business Drivers & Strategic Context" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sage-bright" />
              Revenue Mix
            </h3>
            <HorizontalBarChart
              items={[
                { label: 'Medical Communications', value: 35 },
                { label: 'HCP Promotion', value: 20 },
                { label: 'Analytics (81qd)', value: 15 },
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
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sage-bright" />
              Cost Structure
            </h3>
            <PieChart
              segments={[
                { label: 'Labor', value: 65, color: '#6B8E6F' },
                { label: 'Overhead', value: 15, color: '#A89685' },
                { label: 'Technology', value: 10, color: '#D4AF37' },
                { label: 'Other', value: 10, color: '#22D3EE' },
              ]}
              height={250}
            />
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3">Economic Sensitivities</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cream/10">
                  <th className="text-left py-2 pr-4 text-cream/50 font-medium">Area</th>
                  <th className="text-left py-2 pr-4 text-cream/50 font-medium">AI Impact Potential</th>
                  <th className="text-left py-2 text-cream/50 font-medium">EBITDA Sensitivity</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { area: 'Editorial Workflow', impact: 'High', ebitda: 'High' },
                  { area: 'Predictive Analytics', impact: 'High', ebitda: 'High' },
                  { area: 'Market Research', impact: 'Moderate', ebitda: 'Moderate' },
                  { area: 'Creative Automation', impact: 'Low', ebitda: 'Low' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-2 pr-4 text-cream/80 font-medium">{row.area}</td>
                    <td className="py-2 pr-4"><RatingBadge rating={row.impact} /></td>
                    <td className="py-2"><RatingBadge rating={row.ebitda} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 4: AI INITIATIVE INVENTORY — KINETICS (Internal)
  // ================================================================
  {
    id: 'kinetics',
    title: 'KINETICS — Internal AI Initiatives',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 03 — Internal"
          title="KINETICS — Internal AI Initiatives"
          subtitle="Efficiency tools powering internal workflows"
        />
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cream/10">
                  <th className="text-left py-2 pr-4 text-cream/50 font-medium">Initiative</th>
                  <th className="text-left py-2 pr-4 text-cream/50 font-medium">Stage</th>
                  <th className="text-left py-2 pr-4 text-cream/50 font-medium">KPI</th>
                  <th className="text-right py-2 pr-4 text-cream/50 font-medium">Est. Annual Value</th>
                  <th className="text-left py-2 text-cream/50 font-medium">Measured?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Route Reagent', stage: 'Beta', stageColor: 'bg-yellow-500/20 text-yellow-300', kpi: 'Routing rounds ↓', value: '$700K+', measured: 'Projected' },
                  { name: 'Annotation Activation', stage: 'Pilot', stageColor: 'bg-taupe/30 text-taupe-light', kpi: 'MLR prep time ↓', value: 'TBD', measured: 'No' },
                  { name: 'ChatMKG', stage: 'Live', stageColor: 'bg-green-500/20 text-green-300', kpi: 'Adoption rate', value: 'Indirect', measured: 'Yes (usage)' },
                  { name: 'Compliance Core', stage: 'Early', stageColor: 'bg-cream/10 text-cream/50', kpi: 'Red flag detection', value: 'TBD', measured: 'No' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-2.5 pr-4 text-cream/90 font-medium">{row.name}</td>
                    <td className="py-2.5 pr-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${row.stageColor}`}>{row.stage}</span></td>
                    <td className="py-2.5 pr-4 text-cream/60">{row.kpi}</td>
                    <td className="py-2.5 pr-4 text-right text-cream/80 font-mono">{row.value}</td>
                    <td className="py-2.5 text-cream/60">{row.measured}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { name: 'Route Reagent', desc: 'AI-driven editorial routing — reduces review rounds by 25%', icon: <Rocket className="w-5 h-5 text-sage-bright" />, highlight: true },
            { name: 'Annotation Activation', desc: 'Automated MLR annotation and reference prep', icon: <Layers className="w-5 h-5 text-taupe-light" />, highlight: false },
            { name: 'ChatMKG', desc: 'Internal knowledge assistant for organizational queries', icon: <Brain className="w-5 h-5 text-helix-cyan" />, highlight: false },
            { name: 'Compliance Core', desc: 'AI-powered regulatory red-flag detection', icon: <AlertCircle className="w-5 h-5 text-gold" />, highlight: false },
          ].map(card => (
            <div key={card.name} className={`p-3 rounded-xl border ${card.highlight ? 'bg-sage/10 border-sage/30' : 'bg-white/5 border-cream/10'}`}>
              <div className="mb-2">{card.icon}</div>
              <h4 className="text-xs font-semibold text-cream mb-1">{card.name}</h4>
              <p className="text-[10px] text-cream/50 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 5: AI INITIATIVE INVENTORY — DIFFUSION (External) + Portfolio
  // ================================================================
  {
    id: 'diffusion',
    title: 'DIFFUSION — Client-Facing AI + Portfolio',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 03 — External"
          title="DIFFUSION — Client-Facing AI Products"
          subtitle="Revenue-generating and differentiating AI offerings"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cream/10">
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">Initiative</th>
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">Positioning</th>
                    <th className="text-left py-2 pr-3 text-cream/50 font-medium">Revenue</th>
                    <th className="text-left py-2 text-cream/50 font-medium">Diff. Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'MagpAI', pos: 'Research augmentation', rev: 'Add-on', risk: 'Moderate' },
                    { name: 'BloomLab', pos: 'Qual/quant hybrid', rev: 'Project', risk: 'Lower' },
                    { name: 'PerspectivX', pos: 'Concept scoring', rev: 'Add-on', risk: 'Moderate' },
                    { name: 'Verba', pos: 'Ad board synthesis', rev: 'Embedded', risk: 'Higher' },
                    { name: 'Pantheon', pos: 'HCP search', rev: 'Project', risk: 'Mod→High' },
                    { name: 'Plexus', pos: 'Influence mapping', rev: 'Core', risk: 'Strong' },
                    { name: 'Orion', pos: 'Patient ID', rev: 'Analytics', risk: 'Strong' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-cream/5">
                      <td className="py-2 pr-3 text-cream/90 font-medium">{row.name}</td>
                      <td className="py-2 pr-3 text-cream/60">{row.pos}</td>
                      <td className="py-2 pr-3 text-cream/60">{row.rev}</td>
                      <td className="py-2"><RatingBadge rating={row.risk} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sage-bright" />
              Portfolio Prioritization
            </h3>
            <QuadrantChart
              xLabel="Complexity →"
              yLabel="Strategic Value →"
              quadrants={['Accelerate', 'Double Down', 'Reposition', 'Cut']}
              points={[
                { label: 'Pantheon', x: 0.75, y: 0.9 },
                { label: 'Plexus', x: 0.55, y: 0.85 },
                { label: 'Orion', x: 0.5, y: 0.78 },
                { label: 'BloomLab', x: 0.4, y: 0.7 },
                { label: 'PerspectivX', x: 0.3, y: 0.6 },
                { label: 'MagpAI', x: 0.2, y: 0.45 },
                { label: 'Verba', x: 0.45, y: 0.35 },
              ]}
              height={290}
            />
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 6: DIFFERENTIATING ASSETS
  // ================================================================
  {
    id: 'differentiating-assets',
    title: 'Differentiating Assets',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 04"
          title="Differentiating Assets"
          subtitle="Durable AI moats vs. LLM commoditization risk"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-sage-bright" />
              Moat Strength Assessment
            </h3>
            <HorizontalBarChart
              items={[
                { label: 'ION Data Lake', value: 9 },
                { label: 'Medical Expertise', value: 8 },
                { label: 'Workflow Control', value: 6 },
                { label: 'Model Sophistication', value: 5 },
                { label: 'Closed-Loop Attribution', value: 4 },
              ]}
              suffix="/10"
              maxValue={10}
              height={230}
            />
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-helix-cyan" />
              Data Flow — ION Platform
            </h3>
            <DataFlowDiagram />
            <div className="mt-4 p-3 bg-sage/5 border border-sage/15 rounded-lg">
              <p className="text-[10px] text-cream/60 leading-relaxed">
                <strong className="text-cream/80">Key insight:</strong> The ION Data Lake is MKG&apos;s strongest moat — proprietary claims, engagement, advisory, and publication data that cannot be replicated by competitors or foundation models. The path to higher value is moving from <em>search</em> (Pantheon today) to <em>prediction</em> (where Pantheon must go).
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 7: TEAM & GOVERNANCE
  // ================================================================
  {
    id: 'team-governance',
    title: 'Team & Governance',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 05" title="Team & Governance" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-bright" />
              Governance Structure
            </h3>
            <div className="space-y-3">
              {[
                { freq: 'Weekly', body: 'AI Committee', desc: 'Technical direction and initiative prioritization', active: true },
                { freq: 'Biweekly', body: 'AI Advocates', desc: 'Cross-functional alignment and adoption tracking', active: true },
                { freq: 'Monthly', body: 'Senior Leadership Review', desc: 'Strategic oversight and investment decisions', active: true },
                { freq: 'Gate', body: 'CFO Cost-to-Build ROI', desc: 'Financial gating for new AI investments', active: true },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 px-2 py-0.5 bg-sage/20 text-sage-bright text-[10px] font-mono font-medium rounded mt-0.5">{item.freq}</span>
                  <div>
                    <span className="text-sm text-cream/90 font-medium">{item.body}</span>
                    <p className="text-[10px] text-cream/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3">Governance Scorecard</h3>
              <div className="space-y-2">
                {[
                  { item: 'Executive sponsor & AI committee', status: true },
                  { item: 'Regular cadence (weekly+)', status: true },
                  { item: 'CFO-gated ROI process', status: true },
                  { item: 'Cross-functional AI advocates', status: true },
                  { item: 'Dedicated AI product strategy owner', status: false },
                  { item: 'Enterprise AI KPI dashboard', status: false },
                  { item: 'Attribution analytics FTE', status: false },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${check.status ? 'text-green-400' : 'text-red-400/60'}`} />
                    <span className={check.status ? 'text-cream/80' : 'text-cream/50'}>{check.item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Observed Gaps</span>
              </div>
              <ul className="space-y-1 text-xs text-cream/70">
                <li className="flex items-start gap-2"><Minus className="w-3 h-3 mt-0.5 text-amber-400 flex-shrink-0" />No enterprise AI KPI dashboard</li>
                <li className="flex items-start gap-2"><Minus className="w-3 h-3 mt-0.5 text-amber-400 flex-shrink-0" />No clear AI product strategy owner</li>
                <li className="flex items-start gap-2"><Minus className="w-3 h-3 mt-0.5 text-amber-400 flex-shrink-0" />Limited attribution analytics FTE</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 8: INTERNAL VALUE STORY — ROUTE REAGENT
  // ================================================================
  {
    id: 'route-reagent',
    title: 'Internal Value — Route Reagent',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 06"
          title="Internal Value Story — Route Reagent"
          subtitle="Flagship 90-day measurable win"
        />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { metric: 'Avg Routing Rounds', before: '6', target: '4.5', delta: '-25%', color: 'text-green-400' },
            { metric: 'Editorial Hours / Job', before: '12', target: '9', delta: '-25%', color: 'text-green-400' },
            { metric: 'Turnaround Days', before: '14', target: '10', delta: '-29%', color: 'text-green-400' },
          ].map(row => (
            <div key={row.metric} className="p-4 bg-white/5 border border-cream/10 rounded-xl text-center">
              <h4 className="text-[10px] uppercase tracking-wider text-cream/40 mb-3">{row.metric}</h4>
              <div className="flex items-center justify-center gap-3">
                <div>
                  <span className="text-2xl font-mono text-cream/50">{row.before}</span>
                  <p className="text-[10px] text-cream/30 mt-1">Before</p>
                </div>
                <ArrowRight className="w-4 h-4 text-sage-bright" />
                <div>
                  <span className="text-2xl font-mono text-cream">{row.target}</span>
                  <p className="text-[10px] text-cream/30 mt-1">Target</p>
                </div>
              </div>
              <span className={`inline-block mt-2 text-sm font-mono font-bold ${row.color}`}>{row.delta}</span>
            </div>
          ))}
        </div>
        <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gold" />
            Financial Impact
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between text-cream/60"><span>Jobs / year</span><span className="text-cream/90">3,000</span></div>
              <div className="flex justify-between text-cream/60"><span>Savings per job</span><span className="text-cream/90">$250</span></div>
              <div className="flex justify-between text-cream/60 border-t border-cream/10 pt-2"><span>Total Annual Savings</span><span className="text-gold font-bold">~$750,000</span></div>
              <div className="flex justify-between text-cream/60"><span>Build Cost</span><span className="text-cream/90">~$50,000</span></div>
              <div className="flex justify-between text-cream/60 border-t border-cream/10 pt-2"><span>ROI Year 1</span><span className="text-green-400 font-bold">~15×</span></div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl font-mono font-bold text-green-400">15×</span>
                <p className="text-xs text-cream/50 mt-2">Year 1 ROI</p>
                <p className="text-[10px] text-cream/30 mt-1">$50K build → $750K annual savings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 9: CUSTOMER-FACING VALUE — PANTHEON
  // ================================================================
  {
    id: 'pantheon',
    title: 'External Value — Predictive Pantheon',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 07"
          title="Customer-Facing Value — Predictive Pantheon"
          subtitle="From search tool to predictive intelligence layer"
        />
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { metric: 'Project Revenue', current: '$500K', future: '$500K', delta: '—', color: 'text-cream/50' },
            { metric: 'Subscription Add-on', current: '$0', future: '$150K', delta: '+$150K', color: 'text-green-400' },
            { metric: 'Retention', current: '75%', future: '85%', delta: '+10pts', color: 'text-green-400' },
            { metric: 'Upsell Rate', current: '20%', future: '35%', delta: '+15pts', color: 'text-green-400' },
          ].map(row => (
            <div key={row.metric} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h4 className="text-[10px] uppercase tracking-wider text-cream/40 mb-3">{row.metric}</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-cream/40">Current</span>
                  <p className="text-lg font-mono text-cream/60">{row.current}</p>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-sage-bright" />
                  <span className="text-xs text-cream/40">Predictive Layer</span>
                </div>
                <div>
                  <p className="text-lg font-mono text-cream">{row.future}</p>
                </div>
              </div>
              <span className={`inline-block mt-2 text-xs font-mono font-bold ${row.color}`}>{row.delta}</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-sage/5 border border-sage/20 rounded-xl">
          <p className="text-sm text-cream/70 leading-relaxed">
            <strong className="text-cream">The Pantheon evolution thesis:</strong> Today, Pantheon is an HCP search tool — useful but commoditizable.
            By layering predictive models on top of the ION Data Lake (behavior change alerts, engagement scoring, prescriber trajectory),
            Pantheon transforms from a <em>lookup tool</em> into a <em>strategic intelligence layer</em> — defensible, subscription-ready,
            and impossible to replicate without MKG&apos;s proprietary longitudinal data.
          </p>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 10: ROADMAP & PRIORITIZATION
  // ================================================================
  {
    id: 'roadmap',
    title: 'Roadmap & Prioritization',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 08" title="Roadmap & Prioritization" />
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              action: 'Double Down',
              color: 'border-l-green-500 bg-green-500/5',
              badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
              items: ['Route Reagent', 'Editorial Platform Consolidation'],
            },
            {
              action: 'Accelerate',
              color: 'border-l-sage bg-sage/5',
              badgeColor: 'bg-sage/20 text-sage-bright border-sage/30',
              items: ['Pantheon Predictive', 'Behavior change alerts'],
            },
            {
              action: 'Reposition',
              color: 'border-l-taupe bg-taupe/5',
              badgeColor: 'bg-taupe/20 text-taupe-light border-taupe/30',
              items: ['Verba (feature, not SKU)', 'MagpAI (augmentation layer)'],
            },
            {
              action: 'Pause / Evaluate',
              color: 'border-l-red-500 bg-red-500/5',
              badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
              items: ['Low-usage niche internal tools'],
            },
          ].map(cat => (
            <div key={cat.action} className={`p-4 rounded-xl border-l-4 ${cat.color}`}>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-3 ${cat.badgeColor}`}>{cat.action}</span>
              <ul className="space-y-1.5">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cream/80">
                    <ArrowRight className="w-3 h-3 mt-1 text-cream/30 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl border-2 border-helix-cyan/30 bg-helix-cyan/5">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-helix-cyan" />
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-300 border-green-500/30 mr-2">Double Down</span>
              <span className="text-sm font-semibold text-cream">Foundation: ION Data Lake</span>
            </div>
          </div>
          <p className="text-xs text-cream/70 leading-relaxed">
            The ION Data Lake is the connective tissue that makes every initiative above more valuable. Investing in connecting data assets across claims, engagement, advisory, and publication sources is the prerequisite for Pantheon&apos;s predictive layer, Plexus&apos;s influence mapping, and Orion&apos;s patient identification. Without a strong, unified data foundation, individual tools remain isolated point solutions.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Critical Enabler: Workflow Integration</span>
          </div>
          <p className="text-xs text-cream/70 leading-relaxed mb-3">
            The current AI portfolio reads as fragmented — 20+ branded tools creating spot efficiencies but not connected to each other or to end-to-end business processes. The highest-leverage move is not building more tools, but <strong className="text-cream/90">connecting existing tools along core business process workflows</strong>.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { workflow: 'Editorial → MLR → Delivery', tools: 'Route Reagent + Annotation Activation + Compliance Core', gap: 'Not yet connected end-to-end' },
              { workflow: 'HCP Intelligence → Engagement', tools: 'Pantheon + Plexus + engagement data', gap: 'Search-only; no predictive loop' },
              { workflow: 'Research → Insight → Action', tools: 'MagpAI + BloomLab + PerspectivX', gap: 'Three separate tools, one workflow' },
            ].map((item, i) => (
              <div key={i} className="p-2.5 bg-white/5 border border-cream/5 rounded-lg">
                <h5 className="text-[10px] uppercase tracking-wider text-cream/50 mb-1">{item.workflow}</h5>
                <p className="text-[10px] text-cream/70 mb-1"><strong className="text-cream/80">Tools:</strong> {item.tools}</p>
                <p className="text-[10px] text-amber-300/70"><strong>Gap:</strong> {item.gap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 11: CHANGE MANAGEMENT
  // ================================================================
  {
    id: 'change-management',
    title: 'Change Management',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 09" title="Change Management Requirements" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4">Organizational Readiness</h3>
            <div className="space-y-3">
              {[
                { dim: 'Leadership Alignment', score: 8, color: 'bg-green-500' },
                { dim: 'AI Fluency', score: 7, color: 'bg-green-500' },
                { dim: 'Product Focus', score: 5, color: 'bg-yellow-500' },
                { dim: 'KPI Discipline', score: 4, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.dim} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-cream/70">{item.dim}</span>
                    <span className="text-cream/90 font-mono">{item.score}/10</span>
                  </div>
                  <div className="h-2 bg-cream/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.score * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-gold" />
              Required Actions
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Hire AI Product Strategy Lead', urgency: 'Immediate', desc: 'Single owner for initiative portfolio, consolidation, and product-market fit' },
                { action: 'Closed-loop analytics FTE', urgency: 'Q2 2026', desc: 'Dedicated role to build attribution from AI interventions to client outcomes' },
                { action: 'Enterprise AI KPI dashboard', urgency: 'Q2 2026', desc: 'Unified view of usage, adoption, ROI, and initiative health across KINETICS + DIFFUSION' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-white/5 border border-cream/5 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-cream/90 font-medium">{item.action}</span>
                    <span className="flex-shrink-0 px-1.5 py-0.5 bg-gold/20 text-gold text-[9px] font-mono rounded">{item.urgency}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 12: QUANTIFYING "GETTING IT RIGHT"
  // ================================================================
  {
    id: 'quantifying-upside',
    title: 'Quantifying "Getting It Right"',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader
          section="Section 10"
          title="Quantifying &ldquo;Getting It Right&rdquo;"
          subtitle="The financial case for focused AI execution"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              EBITDA Impact Model
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/10">
                  <th className="text-left py-2.5 pr-4 text-cream/50 font-medium">Category</th>
                  <th className="text-right py-2.5 px-4 text-cream/50 font-medium">Year 1</th>
                  <th className="text-right py-2.5 pl-4 text-cream/50 font-medium">Year 3</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  { cat: 'Editorial Efficiency', y1: '$1.0M', y3: '$2.5M' },
                  { cat: 'Subscription Shift', y1: '$0.5M', y3: '$3.0M' },
                  { cat: 'Retention Lift', y1: '$0.3M', y3: '$1.0M' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-2.5 pr-4 text-cream/80 font-sans">{row.cat}</td>
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
          <div className="p-5 bg-white/5 border border-cream/10 rounded-xl flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-cream mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sage-bright" />
              Enterprise Value Impact (Year 3)
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between text-cream/60">
                <span>Current EBITDA</span>
                <span className="text-cream/90">$20M</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>AI Impact (Year 3)</span>
                <span className="text-green-400">+$6.5M</span>
              </div>
              <div className="flex justify-between text-cream/60 border-t border-cream/10 pt-3">
                <span>New EBITDA</span>
                <span className="text-cream font-bold">$26.5M</span>
              </div>
              <div className="mt-4 p-4 bg-gold/5 border border-gold/20 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-cream/70">At 10× multiple</span>
                  <span className="text-gold font-bold">+$65M EV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/70">At 12× multiple</span>
                  <span className="text-gold font-bold">+$78M EV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ================================================================
  // SLIDE 13: FINAL RECOMMENDATION
  // ================================================================
  {
    id: 'final-recommendation',
    title: 'Final Recommendation',
    content: (
      <div className="space-y-6 px-4">
        <SectionHeader section="Section 11" title="Final Recommendation" />
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              num: '01',
              title: 'Unified AI Editorial Platform',
              subtitle: '90-day measurable win',
              desc: 'Consolidate Route Reagent + Annotation Activation + editorial tooling into a single connected workflow. Measure: routing rounds, turnaround days, cost per job.',
              color: 'border-green-500/30 bg-green-500/5',
              iconColor: 'text-green-400',
            },
            {
              num: '02',
              title: 'Predictive Intelligence Layer',
              subtitle: 'Pantheon evolution',
              desc: 'Transform Pantheon from HCP lookup to predictive engine. Layer behavior change alerts, engagement scoring, prescriber trajectory on ION Data Lake.',
              color: 'border-sage/30 bg-sage/5',
              iconColor: 'text-sage-bright',
            },
            {
              num: '03',
              title: 'Closed-Loop ROI Pilot',
              subtitle: '1 therapeutic area',
              desc: 'Pick one TA, instrument end-to-end attribution from AI-generated insight → HCP engagement → prescriber behavior. Prove the loop works before scaling.',
              color: 'border-gold/30 bg-gold/5',
              iconColor: 'text-gold',
            },
            {
              num: '04',
              title: 'Connect the Workflow',
              subtitle: 'Integration over proliferation',
              desc: 'Map AI tools against core business process workflows. Stop building point solutions; start connecting existing tools into end-to-end chains that compound value across the ION Data Lake.',
              color: 'border-helix-cyan/30 bg-helix-cyan/5',
              iconColor: 'text-helix-cyan',
            },
          ].map(card => (
            <div key={card.num} className={`p-5 rounded-xl border ${card.color}`}>
              <span className={`text-3xl font-mono font-bold ${card.iconColor} opacity-50`}>{card.num}</span>
              <h3 className="text-sm font-semibold text-cream mt-2 mb-1">{card.title}</h3>
              <span className="text-[10px] uppercase tracking-wider text-cream/40">{card.subtitle}</span>
              <p className="text-xs text-cream/60 mt-3 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <div className="grid md:grid-cols-2 gap-4 text-sm text-cream/70">
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-2">Operating Principles</h4>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-sage-bright flex-shrink-0" />Connect before you build — map tools to workflows first</p>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-sage-bright flex-shrink-0" />Consolidate overlapping tools</p>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-sage-bright flex-shrink-0" />Measure relentlessly</p>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-sage-bright flex-shrink-0" />Encode medical expertise into guardrails</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-2">Strategic Shifts</h4>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-gold flex-shrink-0" />From point solutions → integrated workflow AI</p>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-gold flex-shrink-0" />Shift 81qd toward subscription model</p>
              <p className="flex items-start gap-2"><ArrowRight className="w-3 h-3 mt-1 text-gold flex-shrink-0" />AI should change what MKG can charge — not just what it costs</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function MKGAIAssessmentPage() {
  return (
    <DocumentAccessWrapper
      documentId="ai-opportunity-roadmap"
      documentTitle="MKG: AI Opportunity & Roadmap Assessment"
    >
      <PresentationLayout
        title="MKG: AI Opportunity & Roadmap Assessment"
        subtitle="Outside-In Strategic Evaluation"
        slides={slides}
        classificationBanner="Confidential — Tweed Collective"
      />
    </DocumentAccessWrapper>
  )
}
