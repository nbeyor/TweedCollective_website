'use client'

/**
 * MercuryDiligenceSlide Slide Renderer
 *
 * Renders individual slides for the Mercury buyer due diligence document.
 * Transitional architecture: slide content is co-located here while
 * the content file provides the slide registry (IDs, titles, types).
 *
 * Future refactor: progressively extract text/data into content file props.
 */

import React from 'react'
import {
  AlertCircle, AlertTriangle, ArrowRight, BarChart3, Brain, Building2, Database,
  Layers, Lock, Network, Package, Rocket, Shield, Target, TrendingUp, Users, Zap
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  RadialLinearScale, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { RatingBadge, StatusDot, ReadinessIcon, GapSticker, GapCallout, GapTag } from '../shared/DiligenceComponents'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  RadialLinearScale, ArcElement,
  Title, Tooltip, Legend, Filler
)

// Funding bar chart
const fundingData = {
  labels: ['Seed ($8M)', 'Subsequent'],
  datasets: [{
    label: 'Funding ($M)',
    data: [8, 0],
    backgroundColor: ['rgba(74, 93, 76, 0.8)', 'rgba(245, 244, 240, 0.1)'],
    borderColor: 'rgba(107, 142, 111, 1)',
    borderWidth: 1,
    borderRadius: 4,
  }],
}

const fundingOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) => `$${ctx.parsed?.y ?? 0}M`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(245, 244, 240, 0.5)', font: { size: 10 } },
      grid: { display: false },
      border: { color: 'rgba(245, 244, 240, 0.1)' },
    },
    y: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ticks: { color: 'rgba(245, 244, 240, 0.4)', font: { size: 10 }, callback: (v: any) => `$${v}M` },
      grid: { color: 'rgba(245, 244, 240, 0.05)' },
      border: { display: false },
      beginAtZero: true,
    },
  },
}

// Negotiation time reduction chart
const negotiationTimeData = {
  labels: ['Industry Avg', 'Mercury (Claimed)'],
  datasets: [{
    label: 'Days per CTA',
    data: [64, 16],
    backgroundColor: ['rgba(245, 244, 240, 0.15)', 'rgba(74, 93, 76, 0.8)'],
    borderColor: ['rgba(245, 244, 240, 0.3)', 'rgba(107, 142, 111, 1)'],
    borderWidth: 1,
    borderRadius: 4,
  }],
}

const negotiationTimeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) => `${ctx.parsed?.x ?? 0} days`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(245, 244, 240, 0.4)', font: { size: 10 } },
      grid: { color: 'rgba(245, 244, 240, 0.05)' },
      border: { display: false },
      beginAtZero: true,
    },
    y: {
      ticks: { color: 'rgba(245, 244, 240, 0.5)', font: { size: 10 } },
      grid: { display: false },
      border: { color: 'rgba(245, 244, 240, 0.1)' },
    },
  },
}

// Asset scorecard donut data factory
function assetDonut(score: number, color: string) {
  return {
    data: {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [color, 'rgba(245, 244, 240, 0.05)'],
        borderWidth: 0,
        cutout: '75%',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slideContentMap: Record<string, React.ReactNode> = {}

function buildSlideContentMap() {

  slideContentMap['executive-summary'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 02</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Executive Summary</h2>
            <p className="text-cream/50 text-sm">Slide titles by chapter</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { chapter: 'A — Growth Thesis Alignment', slides: ['Growth Thesis Alignment — Exec Summary', 'Growth Projections', 'Offering + AI ↔ Growth Drivers', 'AI Roadmap Fit', 'Scenarios for Outcomes'], color: 'border-sage' },
              { chapter: 'B — Disruption Risk', slides: ['Disruption Risk — Exec Summary', 'Who Could Disrupt', 'What They Would Build', 'What Must Change', '"Build-It-Today" Replicability'], color: 'border-purple-500' },
              { chapter: 'C — Underlying Asset Value', slides: ['Asset Value — Exec Summary (R/Y/G)', 'Product Asset Strength', 'Data Asset Strength', 'Channel Asset Strength', 'Relationship Asset Strength'], color: 'border-green-500' },
              { chapter: 'D — Team + Operating Model', slides: ['Team + Ops — Exec Summary', 'People & Roles', 'Functional Coverage', 'Operating Model Maturity'], color: 'border-taupe' },
              { chapter: 'E — AI Assessment', slides: ['AI Assessment — Exec Summary', 'AI Inventory', 'Architecture + Readiness', 'AI Value Framework', 'AI Value & Proof — Examples'], color: 'border-gold' },
              { chapter: 'F — Buyer ↔ Target Synergies', slides: ['Synergies — Exec Summary', 'Synergy Connections Matrix', 'Synergy Detail', 'Synergy Pathways (3 Waves)'], color: 'border-blue-500' },
              { chapter: 'G — Quantified Impact', slides: ['Priority Initiatives', 'Sensitivity → Growth Curve'], color: 'border-red-400' },
            ].map((ch) => (
              <div key={ch.chapter} className={`p-4 bg-white/5 border-l-4 ${ch.color} rounded-r-lg`}>
                <h3 className="text-sm font-semibold text-cream mb-2">{ch.chapter}</h3>
                <ul className="space-y-1">
                  {ch.slides.map((s, i) => (
                    <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                      <span className="text-cream/30 font-mono mt-px">·</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['growth-thesis-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Chapter A — Growth Thesis Alignment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Growth Thesis Alignment — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Drivers of Growth</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• CTA negotiation bottleneck: ~64 days average per agreement</li>
                <li>• Financial impact of delays: $600K–$8M per day for sponsors</li>
                <li>• 35,000+ clinical trials initiated annually worldwide</li>
                <li>• Clients report 50–80% negotiation time reduction</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">AI Opportunities</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Generative AI for first-draft CTA markups from institutional playbooks</li>
                <li>• AI-powered redlining against historical agreements</li>
                <li>• AI compliance checking across negotiation rounds</li>
                <li>• Testing frontier models (Anthropic tools, Feb 2026)</li>
                <li>• <span className="text-cream/90 font-medium">Per management:</span> CEO&apos;s third AI-powered contract company — built e-discovery co. (2004–2018, served Apple, Goldman Sachs, J&amp;J), founded Apogee (NLP/ML contracts), merged into Seal Software, sold to DocuSign May 2020</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Target className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Alignment</h3>
              <RatingBadge rating="HIGH" size="lg" />
              <p className="text-xs text-cream/70 mt-2">Mercury&apos;s product directly addresses WCG&apos;s stated priority of reducing site start-up timelines and budget/contract negotiation times (WCG claims 40–60% reduction following best practices). Mercury&apos;s purpose-built CTA negotiation platform fills a clear gap in WCG&apos;s ClinSphere ecosystem — no dedicated contract negotiation/AI markup module.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Macros</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• NIH indirect cost recovery cap proposals creating budget pressure at academic sites</li>
                <li>• ICH E6(R3) increasing protocol complexity</li>
                <li>• Rise of &quot;agentic AI&quot; in clinical operations</li>
                <li>• Veeva, Florence expanding into site-centric management</li>
              </ul>
            </div>
          </div>
          <GapCallout gapCount={5}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What is Mercury&apos;s current ARR, customer count, and contract volume throughput? <GapTag /></li>
              <li>• What is the revenue model (per-seat SaaS, per-agreement transaction, institutional license)? <GapTag /></li>
              <li>• How deep is the Mayo Clinic deployment — fully production or piloting? <GapTag /></li>
              <li>• What is the retention rate among early customers? <GapTag /></li>
              <li>• Is Mercury generating revenue from both sides of the negotiation (sponsor + site)? <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['growth-projections'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Chapter A — Growth Thesis Alignment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Growth Projections — Snapshot + Assumptions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-sage-300" /> Funding & Key Metrics</h3>
              <div className="h-36 mb-4">
                <Bar data={fundingData} options={fundingOptions} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Seed Funding', val: '$8M', sub: 'Aug 2023' },
                  { label: 'Lead Investor', val: 'Tusk Ventures', sub: 'Regulated industries' },
                  { label: 'Founded', val: '2021', sub: 'Stealth; public May 2023' },
                  { label: 'Key Client', val: 'Mayo Clinic', sub: 'Co-development partner' },
                  { label: 'Time Reduction', val: '50–80%', sub: 'Client-reported' },
                  { label: 'Subsequent Funding', val: <GapTag />, sub: 'None disclosed' },
                ].map((m) => (
                  <div key={m.label} className="p-2 bg-white/5 border border-cream/10 rounded-lg">
                    <div className="text-sm font-serif text-sage-300">{m.val}</div>
                    <div className="text-[10px] text-cream/50">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-sage-300" /> &quot;What Has to Be True&quot; for Growth</h3>
              <div className="space-y-3">
                {[
                  'Mercury has achieved product-market fit in the CTA use case',
                  'The 50–80% reduction claim is repeatable and scalable beyond early adopters',
                  'Revenue model supports both site-side and sponsor-side monetization',
                  'Platform can handle multi-party, multi-agreement workflows at enterprise scale',
                  'Network effects emerge: sponsors prefer sites on Mercury, and vice versa',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                    <ArrowRight className="w-3 h-3 text-sage-300 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mt-4">
                  <p className="text-xs text-yellow-200"><span className="font-medium">NOTE:</span> No public revenue, bookings, or growth rate data available. No disclosed customer count beyond Mayo Clinic. No known subsequent funding round. All numeric cells for growth projections are <GapTag />.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )

  slideContentMap['offering-ai-growth-matrix'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Chapter A — Growth Thesis Alignment</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Offering + AI Initiatives ↔ Growth Drivers</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-sage/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[100px]">Growth Driver</th>
                  <th className="text-left p-2 text-cream/80 font-medium">CTA AI Markup</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Contract Comparison</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Playbook Compliance</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Multi-party Platform</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Metagreement™ Data</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">New Logo — Sites</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: first-draft redlines in minutes</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: requires history</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: default playbooks</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: both sides</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: grows with vol.</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">New Logo — Sponsors</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: scales 100s of negotiations</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: internal benchmarks</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: enforces standards</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: centralized</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: pattern analytics</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Expansion / Upsell</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: compounds</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: refines over time</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: richer data</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Retention</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: switching cost</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: proprietary</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: knowledge captured</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: network effects</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: locked in</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Pricing Power</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: commoditizing</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: domain-specific</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: unique asset</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70">The Metagreement™ data asset and domain-specific playbooks are the most defensible growth enablers. New logos and expansion drive top-line growth; retention/stickiness protects base; pricing power supports margin expansion.</p>
          </div>
        </div>
  )

  slideContentMap['ai-roadmap-fit'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Chapter A — Growth Thesis Alignment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Roadmap Fit to Growth Thesis</h2>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 mt-6 items-start">
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-sage-300 mb-2">AI Roadmap Themes</h3>
              {[
                { id: 'T1', title: 'Generative AI First-Draft Markups', desc: 'From institutional playbooks in minutes' },
                { id: 'T2', title: 'AI Contract Comparison', desc: 'Redlines against historical agreements' },
                { id: 'T3', title: 'Metagreement™ Data Extraction', desc: 'Structured data from first draft' },
                { id: 'T4', title: 'AI Compliance Checking', desc: 'Each round checked vs. playbook' },
                { id: 'T5', title: 'Market Intelligence', desc: 'Benchmarking from network data' },
                { id: 'T6', title: 'Responsible AI Framework', desc: 'Guardrails, transparency, neutrality' },
              ].map((t) => (
                <div key={t.id} className="p-3 bg-sage-500/10 border border-sage-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-sage-300">{t.id}</span>
                    <span className="text-sm font-medium text-cream">{t.title}</span>
                  </div>
                  <p className="text-xs text-cream/60">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="hidden md:flex flex-col items-center justify-center gap-3 pt-8">
              {['T1→A,B', 'T2→A,D', 'T3→C,E', 'T4→A,B', 'T5→D,E', 'T6→D'].map((conn, i) => (
                <div key={i} className="text-[10px] font-mono text-cream/30 bg-cream/5 px-2 py-1 rounded">
                  {conn}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-purple-300 mb-2">Growth Requirements</h3>
              {[
                { id: 'A', title: 'Reduce CTA cycle from 64 to <20 days', desc: 'Core value proposition' },
                { id: 'B', title: 'More concurrent negotiations/FTE', desc: 'Capacity unlock for sites' },
                { id: 'C', title: 'Sponsor visibility across sites', desc: 'Status tracking at scale' },
                { id: 'D', title: 'Network effects per participant', desc: 'Value compounds with adoption' },
                { id: 'E', title: 'Data assets for premium pricing', desc: 'Benchmarking & intelligence' },
              ].map((r) => (
                <div key={r.id} className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-purple-300">{r.id}</span>
                    <span className="text-sm font-medium text-cream">{r.title}</span>
                  </div>
                  <p className="text-xs text-cream/60">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <div className="text-xs uppercase tracking-wider text-red-300 mb-1">Mismatches / Missing Bets</div>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• No public evidence of predictive analytics (e.g., predicting contentious clauses) <GapTag /></li>
              <li>• No visible integration strategy with existing CTMS / eISF platforms (except Florence partnership) <GapTag /></li>
              <li>• No evidence of automated budget/payment terms analysis (adjacent to contract, critical for site activation) <GapTag /></li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['scenarios'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Chapter A — Growth Thesis Alignment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Scenarios (2–3) for Outcomes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-xl">
              <Rocket className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-green-300 mb-2">Network Flywheel Ignites</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> Mayo Clinic at scale; 5+ AMCs and 2+ top-20 pharma sponsors adopt within 12 months; cross-side network effects kick in; Metagreement™ becomes definitive benchmarking source</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Customer count &gt;3x YoY; sponsor-side revenue emerging; multi-party negotiations increasing; NPS &gt;60</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Mercury becomes system-of-record for CTA negotiation; commands premium pricing; strong exit or integration position</div>
              </div>
            </div>
            <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <Target className="w-6 h-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Solid Niche, Linear Growth</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> Strong ROI for sites but sponsor adoption slow; network effects limited (one-sided); steady growth but no market-defining position</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Site customer growth steady but sponsor pipeline weak; single-side usage dominates; competitive alternatives emerge</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Deepen site-side value; consider white-label/OEM for sponsors; strengthen partnership channel</div>
              </div>
            </div>
            <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
              <h3 className="text-sm font-semibold text-red-300 mb-2">AI Commoditization Pressures</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> Frontier AI models enable any CLM vendor to add CTA-specific markup; generic tools become &quot;good enough&quot; for 80% of cases; domain moat erodes faster than network effects build</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Veeva/Clio/Ironclad announce CTA features; large CROs build internal tools; commoditized AI contract review widespread</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Double down on network effects and multi-party collaboration; accelerate data asset; pursue strategic acquisition for distribution</div>
              </div>
            </div>
          </div>
        </div>
  )

  slideContentMap['disruption-risk-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Chapter B — Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Disruption Risk — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Frontier Model Companies</h3>
                <RatingBadge rating="MEDIUM" />
              </div>
              <p className="text-xs text-cream/70">OpenAI, Anthropic, Google could enable any platform to add contract AI via APIs. Unlikely to build purpose-built CTA negotiation platforms. Mercury is a consumer of these models (uses all three via direct API). <span className="text-cream/90 font-medium">Per management:</span> the pipeline is &quot;as important as the LLM model&quot; — a single model call cannot replicate the multi-document, multi-step orchestration managing 500+ sub-issues across 150 playbook topics. Risk is indirect — frontier models lower barriers for competitors, not for direct entry.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Competitors</h3>
                <RatingBadge rating="MEDIUM-HIGH" />
              </div>
              <p className="text-xs text-cream/70">Veeva (SiteVault, expanding rapidly), Florence Healthcare (current partner — 37K+ sites, 90 countries), Greenphire (site payments), broader CLM vendors (Ironclad, Agiloft, DocuSign). <span className="text-cream/90 font-medium">Per management:</span> Mercury has won every competitive bake-off — GWU tried Spot Draft, failed, returned to Mercury; Duke did side-by-side comparison. Generic tools miss domain-specific issues (e.g., subject injury clauses). Most credible threat remains Veeva; Florence could shift from partner to competitor.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Package className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Niche / Lightweight</h3>
                <RatingBadge rating="LOW-MEDIUM" />
              </div>
              <p className="text-xs text-cream/70"><span className="text-cream/90 font-medium">Per management:</span> Sites are &quot;resource starved, don&apos;t have technology resources, don&apos;t have AI experts.&quot; Mix of lawyers and non-lawyers negotiating contracts. Even large organizations have incomplete playbooks — makes self-build unlikely for sites. Large CROs could replicate basic AI review internally but multi-party collaboration and congruency pipeline are harder to productize.</p>
            </div>
          </div>
          <GapCallout gapCount={6}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="line-through text-cream/40">How deep is the Florence partnership — is there exclusivity?</span> <span className="text-yellow-300 text-[10px] font-medium">PARTIALLY RESOLVED:</span> Per management, Florence collaborated on CFR 21 Part 11 compliance analysis. Integration depth appears meaningful. Exclusivity not confirmed.</li>
              <li>• Is Veeva actively developing CTA negotiation capabilities in SiteVault? <GapTag /></li>
              <li>• Are any large CROs building internal AI-powered CTA tools? <GapTag /></li>
              <li>• What is Mercury&apos;s patent portfolio status? <GapTag /></li>
              <li>• <span className="text-blue-300 text-[10px] font-medium">NEW:</span> Per management, Huron&apos;s ResearchSuite (on-prem legacy) was cited as a comparison — what is the installed base and competitive trajectory? <GapTag /></li>
              <li>• <span className="text-blue-300 text-[10px] font-medium">NEW:</span> How dependent is the competitive moat on continued model improvement from Anthropic/OpenAI? <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['who-could-disrupt'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Chapter B — Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Who Could Disrupt</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                mode: 'Frontier / Platform',
                color: 'border-purple-500/40',
                items: [
                  { name: 'Anthropic / OpenAI', rtw: 'Best-in-class language models for contract parsing', must: 'Would need purpose-built platform, domain expertise, regulatory trust — unlikely to pursue directly' },
                  { name: 'Microsoft (Copilot + Word)', rtw: 'Contracts negotiated in Word; distribution to every institution', must: 'Would need CTA-specific templates, compliance frameworks, multi-party collaboration beyond Word co-authoring' },
                ]
              },
              {
                mode: 'Competitors',
                color: 'border-yellow-500/40',
                items: [
                  { name: 'Veeva Systems (SiteVault)', rtw: 'Dominant in clinical trial site tech; SiteVault expanding with CTMS, eConsent, eISF; AI Agents roadmap 2026', must: 'Must build contract negotiation module (not yet announced)' },
                  { name: 'Florence Healthcare', rtw: '37K+ sites in 90 countries; already reduces negotiation time; current Mercury partner', must: 'Must invest in AI contract markup vs. partnering; would sacrifice partnership value' },
                  { name: 'Ironclad / Agiloft / DocuSign CLM', rtw: 'Established CLM platforms with AI', must: 'Need CTA-specific domain, multi-party architecture, regulatory compliance for clinical research' },
                ]
              },
              {
                mode: 'Niche / Lightweight',
                color: 'border-cream/20',
                items: [
                  { name: 'Large CRO Internal Tools', rtw: 'Negotiate thousands of CTAs annually; deep domain expertise', must: 'Must productize internal tools and offer to market — historically unlikely for CROs' },
                  { name: 'LegalTech AI (Luminance, Harvey)', rtw: 'Strong general contract AI capabilities', must: 'Need CTA-specific playbooks and multi-party architecture; no public clinical trials focus' },
                ]
              },
            ].map((section) => (
              <div key={section.mode} className={`p-4 bg-white/5 border-l-4 ${section.color} rounded-r-lg`}>
                <h3 className="text-sm font-semibold text-cream mb-3">{section.mode}</h3>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.name} className="grid md:grid-cols-[1fr_1fr_1fr] gap-3 text-xs">
                      <div className="font-medium text-cream/90">{item.name}</div>
                      <div className="text-cream/60"><span className="text-cream/40 font-medium">Right to win:</span> {item.rtw}</div>
                      <div className="text-cream/60"><span className="text-cream/40 font-medium">Must be true:</span> {item.must}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['what-they-would-build'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Chapter B — Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">What the Disruptor Would Build</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                mode: 'Frontier (Microsoft/Copilot)',
                concept: 'AI-powered contract co-authoring in Word with CTA-specific templates',
                functions: 'Auto-redlining, clause comparison, compliance flagging within existing Word workflow',
                position: 'Embedded in the document authoring tool itself',
                why: 'Zero adoption barrier — everyone already uses Word'
              },
              {
                mode: 'Competitors (Veeva SiteVault)',
                concept: 'CTA negotiation module within SiteVault CTMS',
                functions: 'AI-driven contract markup, budget + contract linkage, status tracking across sites',
                position: 'Integrated into site\'s existing SiteVault platform for study start-up',
                why: 'Sites already on SiteVault avoid a new vendor; sponsor side benefits from existing data flows'
              },
              {
                mode: 'Niche (CRO Internal)',
                concept: 'Internal AI contract review tool trained on thousands of historical CTAs',
                functions: 'Automated first-pass review, deviation flagging, standard clause library',
                position: 'Used by CRO\'s own legal/contracts team only',
                why: 'CROs control enough volume for data advantage internally; no external platform needed'
              },
            ].map((row) => (
              <div key={row.mode} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <h3 className="text-sm font-semibold text-cream mb-3">{row.mode}</h3>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div><span className="text-cream/40 font-medium">Product concept:</span> <span className="text-cream/70">{row.concept}</span></div>
                  <div><span className="text-cream/40 font-medium">Core functions:</span> <span className="text-cream/70">{row.functions}</span></div>
                  <div><span className="text-cream/40 font-medium">Workflow position:</span> <span className="text-cream/70">{row.position}</span></div>
                  <div><span className="text-cream/40 font-medium">Why &quot;good enough&quot;:</span> <span className="text-cream/70">{row.why}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['what-must-change'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Chapter B — Disruption Risk</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">What Must Change for Disruption to Be True</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-purple-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[90px]">Mode</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Buyer Behavior</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Workflow</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Data / Access</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Regulatory</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Frontier (Microsoft)</td>
                  <td className="p-2">Sites/sponsors accept AI markup from general-purpose tool vs. domain-specific platform</td>
                  <td className="p-2">Multi-party negotiation works in SharePoint/Teams (not designed for legal negotiation)</td>
                  <td className="p-2">Microsoft needs CTA-specific training data and compliance frameworks</td>
                  <td className="p-2">None required — but trust in non-specialized tool is a barrier</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Competitors (Veeva)</td>
                  <td className="p-2">Sites on SiteVault want contract tools from same vendor (consolidation preference)</td>
                  <td className="p-2">SiteVault supports both sponsor-side and site-side negotiation (currently site-centric)</td>
                  <td className="p-2">Veeva needs historical CTA data for AI training at clause level</td>
                  <td className="p-2">None required</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Niche (CRO)</td>
                  <td className="p-2">CROs invest in product dev and decide to productize internal tools</td>
                  <td className="p-2">CROs open tools to counterparties (sites) — contrary to competitive instincts</td>
                  <td className="p-2">CROs already have the data</td>
                  <td className="p-2">CRO tool must achieve GxP validation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  )

  slideContentMap['build-it-today'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Chapter B — Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">&quot;Build-It-Today&quot; Replicability</h2>
          </div>
          <div className="mt-6 mb-2">
            <div className="flex items-center gap-0">
              <div className="flex-1 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-cream/40 mt-1">
              <span>Easy to replicate</span>
              <span>Hard to replicate</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/5 border-t-2 border-green-500 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-green-300">Build in Days</h3>
                <span className="text-[10px] font-mono bg-green-500/20 text-green-300 px-2 py-0.5 rounded">LOW MOAT</span>
              </div>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• Basic AI contract review/redlining using GPT-4 / Claude API + document upload</li>
                <li>• Clause-level extraction against a static playbook</li>
                <li>• Simple compliance checklist generation</li>
                <li>• The &quot;AI markup&quot; feature in isolation is increasingly table stakes</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/5 border-t-2 border-yellow-500 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-yellow-300">Build in Weeks</h3>
                <span className="text-[10px] font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">MED MOAT</span>
              </div>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• Multi-party collaboration platform with role-based access</li>
                <li>• Integration with eISF/CTMS platforms (Florence, SiteVault)</li>
                <li>• Metagreement™-style structured data extraction across rounds</li>
                <li>• Playbook management with institutional customization</li>
                <li>• Round-by-round change tracking with AI summaries</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/5 border-t-2 border-red-500 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-red-300">Hard / Months+</h3>
                <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">HIGH MOAT</span>
              </div>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• Network effects / multi-party trust — both sides on one platform requires earned credibility</li>
                <li>• Domain-specific historical CTA data — years of production usage at scale</li>
                <li>• Institutional playbook library — deep domain expertise and customer co-development</li>
                <li>• Regulatory trust: SOC2, HIPAA, GxP alignment — years to establish</li>
                <li>• Mayo Clinic collaboration and endorsement — cannot be replicated</li>
              </ul>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border-l-4 border-purple-500">
            <p className="text-xs text-cream/70"><span className="font-medium text-purple-300">Key Takeaway:</span> Mercury&apos;s most defensible assets are the multi-party network trust and institutional credibility (Mayo Clinic). AI markup functionality in isolation is replicable in days. The combination of AI + network + domain data is the defensible moat.</p>
          </div>
        </div>
  )

  slideContentMap['asset-value-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Chapter C — Underlying Asset Value</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Underlying Asset Value — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { asset: 'Product', score: 75, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'GREEN', bullets: ['Per management: purpose-built with mature AI pipeline — holistic markup, congruency pipeline, pre-publication reports', 'Multi-model architecture with prompt mgmt in database', 'Customers who tried generic tools returned', 'Cloud-first, serverless, graph-database-native'] },
              { asset: 'Data', score: 50, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'YELLOW', bullets: ['Per management: Neo4j graph tracks contract network, clause reuse across orgs, version history', 'Metagreement\u2122 structured extraction is live', 'Data asset compounds with each customer', 'Volume still early-stage; benchmarking requires scale'] },
              { asset: 'Channel', score: 50, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'YELLOW', bullets: ['Florence partnership: 37K+ sites; MAGI exposure', 'Direct sales to AMCs (Mayo, Duke, Cleveland Clinic, Moffitt, UHN)', 'No dedicated sales team; CEO + CPO drive GTM at ~15 people', '3-5 security questionnaires/month suggests active onboarding'] },
              { asset: 'Relationships', score: 75, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'GREEN', bullets: ['Per management: Mayo Clinic, Duke, Cleveland Clinic, Moffitt, UHN (Canada)', 'Florence partnership deep enough for joint compliance work', 'Mayo Clinic is financial investor + anchor customer', 'No customer pushback on cloud/AI — seen as benefit vs. legacy'] },
            ].map((a) => {
              const donut = assetDonut(a.score, a.donutColor)
              return (
                <div key={a.asset} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusDot color={a.dotColor} />
                      <h3 className="text-sm font-semibold text-cream">{a.asset}</h3>
                    </div>
                  </div>
                  <div className="w-16 h-16 mx-auto mb-2 relative">
                    <Doughnut data={donut.data} options={donut.options} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-cream/70">{a.score}</span>
                    </div>
                  </div>
                  <ul className="space-y-1 text-[10px] text-cream/60">
                    {a.bullets.map((b, i) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
              )
            })}
          </div>
          <GapCallout gapCount={6}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="line-through text-cream/40">Technical architecture — cloud platform, deployment model, data residency?</span> <span className="text-green-300 text-[10px] font-medium">RESOLVED:</span> AWS-native, serverless, US-East primary; EU instance dormant; Neo4j + OpenSearch + S3; Apollo GraphQL API</li>
              <li>• <span className="line-through text-cream/40">Product uptime / reliability track record?</span> <span className="text-cream/40 text-[10px] font-medium">GAP:</span> Not discussed</li>
              <li>• <span className="line-through text-cream/40">How deep is the Florence integration — API-level or referral only?</span> <span className="text-yellow-300 text-[10px] font-medium">PARTIALLY RESOLVED:</span> Deep enough for joint CFR 21 Part 11 compliance analysis; eISF ↔ contract workflow described; API depth not specified</li>
              <li>• <span className="line-through text-cream/40">Current data volume?</span> <span className="text-cream/40 text-[10px] font-medium">GAP:</span> PII footprint is &quot;hundreds, maybe thousands&quot; of user records — moderate but growing</li>
              <li>• <span className="text-blue-300 text-[10px] font-medium">NEW:</span> What are customer contract terms (multi-year? annual? at-will)? <GapTag /></li>
              <li>• <span className="text-blue-300 text-[10px] font-medium">NEW:</span> What is the churn/retention rate among early customers? <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['product-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Chapter C — Underlying Asset Value</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Product Asset Strength</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Layers className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">What the Product Uniquely Enables</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• AI-powered first-draft redlines of CTAs from institutional playbooks &quot;in minutes&quot;</li>
                <li>• Automatic detection of previously negotiated forms with historical redlines</li>
                <li>• Multi-party negotiation — both sponsor + site collaborate on one platform</li>
                <li>• Metagreement™ captures compliance points, terms, deadlines from first draft</li>
                <li>• Supports CTAs, CDAs, MTAs, DUAs, licensing documents</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Shield className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Differentiation Sources</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• &quot;Both sides on one platform&quot; — traditional CLM serves one side only</li>
                <li>• Neutrality and security emphasis creates trust for multi-party adoption</li>
                <li>• CEO has authored multiple patents in AI and contract analytics</li>
                <li>• CTO&apos;s research focused on transparency, market dynamics, volatility reduction</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl md:col-span-2">
              <Lock className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Switching Friction / Stickiness</h3>
              <div className="grid md:grid-cols-2 gap-3 text-xs text-cream/70">
                <ul className="space-y-1.5">
                  <li>• Institutional playbooks configured per customer — high setup cost = high switching cost</li>
                  <li>• Historical negotiation data accumulates and cannot be exported to competitors</li>
                </ul>
                <ul className="space-y-1.5">
                  <li>• Metagreement™ structured data ties into compliance and obligations management</li>
                  <li>• Two-sided platform: switching requires coordinating both parties</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="relative p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="absolute -top-2.5 right-3"><GapSticker count={1} /></div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Evidence Gap</span>
            </div>
            <p className="text-xs text-cream/60">No published case studies with named metrics, no independent analyst coverage, no G2/Capterra presence <GapTag /></p>
          </div>
        </div>
  )

  slideContentMap['data-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Chapter C — Underlying Asset Value</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Data Asset Strength</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-green-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Dataset</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Proprietary?</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Longitudinal?</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Quality</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Replication</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Metagreement™ clause-level structured data</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Growing (limited)</td>
                  <td className="p-2">Parsed from first draft — unique</td>
                  <td className="p-2 text-red-300 font-medium">High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Historical CTA negotiation outcomes</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Growing</td>
                  <td className="p-2">Captures decisions across rounds</td>
                  <td className="p-2 text-red-300 font-medium">High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Market benchmarking (clause prevalence)</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Growing</td>
                  <td className="p-2">Requires volume for significance</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Institutional playbooks</td>
                  <td className="p-2">Partial (customer + defaults)</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Depends on institution</td>
                  <td className="p-2 text-yellow-300">Medium</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Pre-configured CTA/CDA/MTA templates</td>
                  <td className="p-2">Yes (defaults) + Customer</td>
                  <td className="p-2">Stable</td>
                  <td className="p-2">Domain-specific; Mayo input</td>
                  <td className="p-2 text-yellow-300">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GapCallout gapCount={3}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Volume is the key constraint — data asset value is directly proportional to adoption <GapTag /></li>
              <li>• Neutrality requirements may limit how aggressively Mercury can monetize data insights <GapTag /></li>
              <li>• Rights to aggregate and benchmark customer data must be clearly established <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['channel-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Chapter C — Underlying Asset Value</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Channel Asset Strength</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Network className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Primary Channels</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">Florence Partnership:</span> Access to 37K+ sites in 90 countries</li>
                <li>• <span className="text-cream/90 font-medium">MAGI Conference:</span> CEO spoke at WCG&apos;s own clinical operations conference (2025)</li>
                <li>• <span className="text-cream/90 font-medium">Direct sales:</span> Demo scheduling via website</li>
                <li>• <span className="text-cream/90 font-medium">Investor networks:</span> Tusk Ventures (regulated industries), Relativity founder (legal tech)</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Zap className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Embedded Distribution</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Florence partnership could serve as embedded distribution — 37K+ sites offered Mercury as integrated feature</li>
                <li>• <span className="text-yellow-300 font-medium">INFERENCE:</span> MAGI conference presence suggests existing commercial relationship or exploration between WCG and Mercury</li>
                <li>• Not yet publicly demonstrated as a deep integration</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="absolute -top-2.5 right-3"><GapSticker count={2} /></div>
              <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Concentration &amp; Fragility</div>
              <p className="text-xs text-cream/70"><span className="text-red-300 font-medium">High concentration risk:</span> Florence partnership appears to be the primary scaled channel. If Florence builds natively or partners with a competitor, Mercury loses its primary distribution. Direct sales likely resource-constrained <GapTag /></p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 border-l-4 border-green-500/50">
              <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Replication Difficulty</div>
              <p className="text-xs text-cream/70">Florence partnership (unique but not exclusive); Mayo Clinic endorsement (very hard — years of collaboration); conference presence (moderate — any funded competitor can sponsor)</p>
            </div>
          </div>
        </div>
  )

  slideContentMap['relationship-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Chapter C — Underlying Asset Value</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Relationship Asset Strength</h2>
          </div>
          <div className="space-y-3 mt-4">
            {[
              { name: 'Mayo Clinic', detail: 'Product co-development; credibility; financial investor; anchor customer. Know-how agreement. Partnerships are rare and prestigious.', tag: 'Strategic', replication: 'Very High' },
              { name: 'Florence Healthcare', detail: 'Distribution to 37K+ sites; complementary workflow (eISF → contract). No evidence of exclusivity.', tag: 'Distribution', replication: 'Medium' },
              { name: 'Duke Law Center / Special Advisor', detail: 'Academic credibility; "Future of Contracts" research alignment. Faculty Associate at Berkman Klein Center.', tag: 'Advisory', replication: 'High' },
              { name: 'Tusk Venture Partners', detail: 'Lead seed investor. Regulated industry expertise; political/regulatory navigation.', tag: 'Financial', replication: 'Medium' },
              { name: 'Relativity Founder (Investor)', detail: 'Legal tech ecosystem credibility; operational mentorship. Relativity is the standard in legal tech.', tag: 'Financial', replication: 'High' },
              { name: 'WCG', detail: 'CEO spoke at MAGI 2025 (WCG\'s conference); congruency pipeline walkthrough used WCG-relevant examples. Diligence process confirms active relationship.', tag: 'Buyer', replication: 'N/A' },
            ].map((rel) => (
              <div key={rel.name} className="p-4 bg-white/5 border border-cream/10 rounded-xl flex items-start gap-4">
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sage-300 bg-sage-500/10 px-2 py-1 rounded">{rel.tag}</span>
                  <span className="text-[9px] font-mono text-cream/40">Repl: {rel.replication}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-cream">{rel.name}</h3>
                  <p className="text-xs text-cream/60 mt-1">{rel.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['team-ops-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Team + Operating Model — Executive Summary</h2>
            <p className="text-xs text-cream/50">Per management: ~15 people across four functional teams (development, product, support, analytics)</p>
          </div>
          <div className="space-y-3 mt-6">
            {[
              { dim: 'Key Roles Present', rating: 'MEDIUM-HIGH', why: 'CEO, CTO, CPO, Co-founder/Advisor, Special Advisor. No dedicated CRO/VP Sales or VP Engineering title, but CPO covers go-to-market and CTO directly manages engineering. Per management, company is ~15 people.' },
              { dim: 'Leveling / Seniority Fit', rating: 'HIGH', why: 'Exceptional senior leadership: CEO (DocuSign/Seal VP, Duke Law), CTO (MIT, Bank of America SVP, serial CTO), CPO (Blackstone VP, Cornell), Co-founder (Blackstone CTO). Very senior for a seed-stage company.' },
              { dim: 'Functional Representation', rating: 'MEDIUM-HIGH', why: 'Per management: four functional teams — development, product, support, and analytics. Analytics team (4 analysts + 1 director) is a distinct third pillar alongside product and engineering, handling substantive content work, prompt engineering, and customer onboarding.' },
              { dim: 'Resourcing Balance', rating: 'MEDIUM', why: 'Weighted toward product/technology, but the analyst team provides a bridge between R&D and customer success. CEO and CPO jointly drive go-to-market. No dedicated sales org, but active customer onboarding cadence (3-5 security reviews/month suggests steady new customer flow).' },
              { dim: 'Process Maturity', rating: 'MEDIUM', why: 'Per management: weekly AI review calls; GitHub Actions CI/CD with automated vulnerability, license, and AI code review; Jira/Confluence for requirements; Figma for design. Deliberate human-in-the-loop checkpoints at staging and production deployment.' },
            ].map((row) => (
              <div key={row.dim} className="p-4 bg-white/5 border border-cream/10 rounded-xl flex items-start gap-4">
                <RatingBadge rating={row.rating} size="lg" />
                <div>
                  <h3 className="text-sm font-medium text-cream">{row.dim}</h3>
                  <p className="text-xs text-cream/60 mt-1">{row.why}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Resolved Questions</h3>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="line-through text-cream/40">Total headcount and engineering team size?</span> <span className="text-green-300">RESOLVED:</span> ~15 people; 4 developers (2 principal engineers, 2 additional), QA contractors, 4 analysts + 1 director, product team, support team</li>
              <li>• <span className="line-through text-cream/40">Is there a dedicated sales/BD leader?</span> <span className="text-green-300">RESOLVED:</span> No — CEO and CPO jointly handle go-to-market and customer success</li>
              <li>• <span className="line-through text-cream/40">Product development methodology?</span> <span className="text-yellow-300">PARTIALLY RESOLVED:</span> Atlassian stack (Jira/Confluence), GitHub Actions CI/CD, weekly AI review meetings; formal agile methodology not confirmed</li>
              <li>• <span className="line-through text-cream/40">How is customer support/success staffed?</span> <span className="text-green-300">RESOLVED:</span> Analyst team supports customer onboarding; translates offline playbooks to AI-optimized profiles; CPO oversees customer success</li>
            </ul>
          </div>
          <GapCallout gapCount={3}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What is the contractor vs. FTE split? How dependent is engineering on the two principal engineers? <GapTag /></li>
              <li>• What is attrition risk for key technical staff? Any retention agreements in place? <GapTag /></li>
              <li>• What is the analyst team&apos;s capacity — how many concurrent customer onboardings can they support? <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['people-roles'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">People &amp; Roles</h2>
            <p className="text-xs text-cream/50">Accountability map updated with org chart shared during diligence</p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-taupe-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Function</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Owner</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Reports / Direct Reports</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  ['CEO', 'Jim Wagner', 'CTO, CPO, Director Solutions & Analytics all report to CEO'],
                  ['Technology / Engineering', 'CTO (Phil Richards)', 'Principal Engineer 1 → Engineer 1; Principal Engineer 2 → Engineer 2; Senior QA (Contractor) ×2; QA Automation (Contractor)'],
                  ['Product / GTM / Customer Success', 'CPO (Maya Pochiraju)', 'Director, Enablement; Product Manager 1'],
                  ['Solutions & Analytics', 'Director, Solutions & Analytics', 'Senior Analyst; Analyst 2 (Part-time); Analyst 3; Analyst 4'],
                  ['Strategy / Governance', 'Co-founder/Advisor (Bill Murphy)', 'Advisory role'],
                  ['Legal/Academic Advisory', 'Special Advisor (Jeff Ward)', 'Advisory role'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="p-2 font-medium text-cream/90">{row[0]}</td>
                    <td className="p-2">{row[1]}</td>
                    <td className="p-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-xs uppercase tracking-wider text-taupe-300 mb-2">R&amp;D Allocation Model (per management)</h3>
            <p className="text-[10px] text-cream/50 mb-2">The entire team contributes to AI improvements. Three functional groups have distinct R&amp;D roles:</p>
            <div className="grid md:grid-cols-3 gap-2">
              <div className="p-2 bg-cream/5 rounded-lg">
                <span className="text-[10px] font-semibold text-cream">Executive team</span>
                <p className="text-[10px] text-cream/50">Significant R&amp;D allocation (as much as possible)</p>
              </div>
              <div className="p-2 bg-cream/5 rounded-lg">
                <span className="text-[10px] font-semibold text-cream">Analyst team</span>
                <p className="text-[10px] text-cream/50">Key R&amp;D contributors — prompt/agent engineering, model testing</p>
              </div>
              <div className="p-2 bg-cream/5 rounded-lg">
                <span className="text-[10px] font-semibold text-cream">Product team</span>
                <p className="text-[10px] text-cream/50">AI integration and usability; full solutions applying AI R&amp;D knowledge</p>
              </div>
            </div>
            <p className="text-[10px] text-cream/50 mt-2">Engineering R&amp;D has 3 continuous tasks: (1) Build features with AI components, (2) Improve AI coding process (skills, agents, sub-agents), (3) Improve systems/data structures for AI accessibility</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">STRENGTH:</span> Leadership includes former executives from Blackstone, DocuSign, Bank of America. Unusually senior for seed-stage — strong domain expertise and board-level credibility. Two principal engineers described as very senior (infrastructure and platform architecture focus).</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-cream/70"><span className="text-red-300 font-medium">KEY PERSON RISK:</span> CTO reviews all PRs and drives all architecture decisions — concentration risk. The two principal engineers represent critical institutional knowledge. These are executives who can operate within a large org like WCG, but retention is essential.</p>
            </div>
          </div>
        </div>
  )

  slideContentMap['functional-coverage'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Functional Coverage &amp; Resourcing</h2>
            <p className="text-xs text-cream/50">Headcount allocation per org chart shared during diligence</p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-taupe-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Function</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Headcount</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Roles</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  ['Leadership / Strategy', '3 executives + 2 advisors', 'CEO, CTO, CPO (active); Co-founder/Advisor, Special Advisor (advisory)'],
                  ['Engineering (Development)', '4 FTEs', 'Principal Engineer 1 → Engineer 1; Principal Engineer 2 → Engineer 2'],
                  ['QA', '3 contractors', 'Senior QA ×2 (Contractor); QA Automation (Contractor)'],
                  ['Product', '2 FTEs', 'Director, Enablement; Product Manager 1 — both report to CPO'],
                  ['Solutions & Analytics', '4 FTEs (1 part-time)', 'Director Solutions & Analytics; Senior Analyst; Analyst 2 (Part-time); Analyst 3; Analyst 4'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="p-2 font-medium text-cream/90">{row[0]}</td>
                    <td className="p-2">{row[1]}</td>
                    <td className="p-2">{row[2]}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-taupe-500/40 bg-cream/5">
                  <td className="p-2 font-semibold text-cream">Total FTEs</td>
                  <td className="p-2 font-semibold text-cream">~13-14</td>
                  <td className="p-2 text-cream/50">Excludes advisors and contractors</td>
                </tr>
                <tr className="bg-cream/5">
                  <td className="p-2 font-semibold text-cream">Total incl. contractors</td>
                  <td className="p-2 font-semibold text-cream">~16-17</td>
                  <td className="p-2 text-cream/50">Per management: &quot;about 15 people&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Strong:</span> Product vision, technology leadership, domain expertise, institutional credibility, customer onboarding process (analyst team is an effective bridge)</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">Adequate for stage:</span> Engineering team of 4 developers is small but highly leveraged by AI-assisted coding (per management, almost all code written with AI assistance using Cursor and Claude Code); weekly AI review calls drive continuous improvement</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-cream/70"><span className="text-red-300 font-medium">Gap for scale:</span> No dedicated sales organization; no dedicated marketing function beyond content; no dedicated data science/ML team (CTO and analysts fill this role)</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <div className="text-xs uppercase tracking-wider text-red-300 mb-1">Concentration Risks</div>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="text-red-300 font-medium">CTO reviews all PRs</span> and drives architecture decisions — single point of failure</li>
              <li>• Two principal engineers described as critical; loss of either would be significant</li>
              <li>• Under WCG ownership, GTM gap addressed through WCG&apos;s existing sales force. Analyst team model should be preserved — represents Mercury&apos;s domain knowledge capture mechanism</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['operating-model-maturity'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Operating Model Maturity</h2>
          </div>
          <div className="space-y-4 mt-6">
            {[
              { dim: 'AI Governance & Ownership', score: 3, label: 'Medium', obs: 'Published “Road Rules for Responsible AI” with 5 principles; per management, all AI providers on enterprise licensing with data non-retention and non-training commitments; commitments passed through to customers in TOS' },
              { dim: 'Continuous AI Operating Model', score: 3, label: 'Medium', obs: 'Per management: weekly AI review calls to assess new models; model abstraction layer allows hot-swapping via prompt management system; tested Sonnet 4.6 within ~1 week of release; evaluations against gold-standard datasets; formal AWS agent evaluation framework planned but not yet implemented' },
              { dim: 'Customer-Facing AI Deployment', score: 3.5, label: 'Med-High', obs: 'Per management: AI markup is live and production; holistic markup of entire agreements (not search-and-replace); surgical edits; pre-publication reports; round-by-round tracking. Congruency pipeline processes 150-page protocols against 6+ manuals and 500+ sub-issues' },
              { dim: 'Selling Process for AI', score: 3, label: 'Medium', obs: 'Per management: demo-driven sales with high win rate in bake-offs against generic tools (Spot Draft, etc.); customers who tried generic tools have returned; George Washington University cited as a specific win-back' },
              { dim: 'Delivery/Support for AI', score: 3, label: 'Medium', obs: 'Per management: analyst team handles customer onboarding — translates offline playbooks to AI-optimized profiles; 3-5 security questionnaires per month (general, AI-specific, privacy); no PHI — streamlines procurement' },
              { dim: 'Measurement Discipline', score: 2, label: 'Low-Med', obs: 'Claims 50–80% reduction in negotiation time; per management, gold-standard evaluation datasets exist for prompt/model testing; no published KPI framework or formal customer success metrics' },
              { dim: 'Development Practices', score: 3.5, label: 'Med-High', obs: 'Per management: GitHub + GitHub Actions CI/CD; AWS CDK (not Terraform); automated vulnerability, license, code scanner, AI code review (customized Claude Code agent) on every PR; unit + integration tests; separate AWS accounts for dev/staging vs. prod; automated deploy to dev, human-approved to staging/prod; Sonar Cloud; Jira/Confluence' },
              { dim: 'AI-Assisted Engineering', score: 3.5, label: 'Med-High', obs: 'Per management: almost all code written with AI (Cursor + Claude Code); specialized sub-agents (Cypher, Review, UI, PR Gen, Agent Builder, Red Green Refactor); customized Claude review agent in CI/CD; CTO reviews all PRs; weekly calls to refine AI coding agent; spec + TDD first approach' },
            ].map((row) => (
              <div key={row.dim} className="flex items-center gap-4">
                <div className="w-48 flex-shrink-0">
                  <p className="text-xs font-medium text-cream">{row.dim}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-cream/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-taupe to-sage rounded-full transition-all" style={{ width: `${(row.score / 5) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-cream/50 w-16">{row.score}/5 {row.label}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{row.obs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['ai-assessment-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Assessment — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { dim: 'Internal Value', rating: 'MEDIUM-HIGH', points: 'Per management: AI automates first-draft review and redlining; congruency pipeline processes protocols against 6+ manuals and 500+ sub-issues. Internally, almost all code written with AI assistance; customized Claude review agent in CI/CD; AI code review on every PR. Weekly AI review calls drive continuous operational improvement.' },
              { dim: 'External Value', rating: 'HIGH', points: 'AI markup is the core value proposition. Speed-to-close is the primary selling point (50–80% reduction). Per management: customers who tried generic tools (e.g., Spot Draft) returned because the generic tool missed half the issues. Mercury has won every competitive bake-off. Holistic markup approach is a key differentiator.' },
              { dim: 'Maturity & Coverage', rating: 'MEDIUM-HIGH', points: 'Per management: AI covers markup, comparison, compliance checking, data extraction, congruency analysis, playbook conversion, and pre-publication reporting. Multi-model architecture (Anthropic, OpenAI, Gemini) with model-per-task selection. Prompt management system stores all prompts, settings, and model assignments in database — not in code.' },
              { dim: 'Replicability Risk', rating: 'MEDIUM', points: 'Per management: the pipeline is described as equally important to the LLM itself. Managing context across 500+ sub-issues, multiple large documents, and institutional playbooks is a genuine engineering challenge. Domain-specific playbooks and graph-based clause tracking compound over time. However, a well-funded competitor with domain expertise could replicate the pipeline in months.' },
            ].map((tile) => (
              <div key={tile.dim} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-cream">{tile.dim}</h3>
                </div>
                <RatingBadge rating={tile.rating} />
                <p className="text-xs text-cream/60 mt-2">{tile.points}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-xs uppercase tracking-wider text-gold mb-2">Resolved Questions</h3>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="line-through text-cream/40">What AI models does Mercury use?</span> <span className="text-green-300">RESOLVED:</span> Multi-model: Anthropic (Claude, incl. Sonnet 4.6), OpenAI (GPT-4.1, mini models), Google (Gemini for large-context PDF). Direct API calls (not Bedrock). All providers on enterprise licensing with data non-retention commitments.</li>
              <li>• <span className="line-through text-cream/40">Accuracy/precision of AI markup vs. human review?</span> <span className="text-yellow-300">PARTIALLY RESOLVED:</span> Gold-standard evaluation datasets exist; agents go through same evaluation process as prompts; formal AWS agent evaluation framework planned but not yet implemented.</li>
              <li>• <span className="line-through text-cream/40">Human-in-the-loop validation?</span> <span className="text-green-300">RESOLVED:</span> AI generates markup and a pre-publication report (line-item summary of every redline); user reviews before finalizing.</li>
              <li>• <span className="line-through text-cream/40">Playbook training and maintenance?</span> <span className="text-green-300">RESOLVED:</span> Analyst team converts customer offline playbooks to AI-optimized profiles during onboarding. ~150 topics with 500+ distinct sub-issues per agreement.</li>
              <li>• <span className="line-through text-cream/40">AI cost structure?</span> <span className="text-yellow-300">ESTIMATED:</span> $3–8 per agreement for standard CTA markup, scaling to $15–25 for full congruency pipeline run. Should be validated against actual billing data.</li>
            </ul>
          </div>
          <GapCallout gapCount={2}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What is uptime/reliability track record? SLA commitments? <GapTag /></li>
              <li>• What is the plan and timeline for SOC2 certification? <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['ai-inventory'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Inventory (What Exists)</h2>
            <p className="text-xs text-cream/50">Updated with management interview details from diligence calls</p>
          </div>
          {/* Contract Intake & Preparation */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Contract Intake & Preparation</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { cap: 'Automatic Form Recognition', scope: 'External', maturity: 'Scaled', deps: 'Per management: graph database tracks contract network; uses next-nearest algorithms to identify prior negotiations with same counterparty' },
                { cap: 'Multimodal Document Ingestion', scope: 'External', maturity: 'Scaled', deps: 'Per management: Gemini used for large-context PDF processing (cost/speed tradeoff); multimodal ingestion pipeline' },
                { cap: 'First-Draft AI Markup (Playbook)', scope: 'External', maturity: 'Scaled', deps: 'Per management: multi-model pipeline; playbook with ~150 topics / 500+ sub-issues; markup is holistic (entire agreement in one pass) not search-and-replace' },
                { cap: 'Playbook Conversion', scope: 'External', maturity: 'Scaled', deps: 'Per management: analyst team + AI converts offline playbooks to structured profiles during onboarding' },
              ].map((c) => (
                <div key={c.cap} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                  <h3 className="text-xs font-semibold text-cream mb-1">{c.cap}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono bg-gold/10 text-gold px-1.5 py-0.5 rounded">{c.scope}</span>
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-300 px-1.5 py-0.5 rounded">{c.maturity}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{c.deps}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Congruency Analysis */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Congruency Analysis (New from Diligence)</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { cap: 'Protocol-to-Contract Congruency', scope: 'External', maturity: 'Partial-Scaled', deps: 'Per management: ingests protocol, aligns to 6+ manuals (imaging, pharmacy, lab, etc.), compares to sponsor budget and internal rate cards' },
                { cap: 'Budget Coverage Analysis', scope: 'External', maturity: 'Partial', deps: 'Per management: linked to congruency pipeline; validates budget against protocol requirements' },
                { cap: 'Informed Consent Template Congruency', scope: 'External', maturity: 'Planned', deps: 'Per management: default ICF template will be included in congruency checks against protocol and budget' },
              ].map((c) => (
                <div key={c.cap} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                  <h3 className="text-xs font-semibold text-cream mb-1">{c.cap}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono bg-gold/10 text-gold px-1.5 py-0.5 rounded">{c.scope}</span>
                    <span className="text-[10px] font-mono bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded">{c.maturity}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{c.deps}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Negotiation & Collaboration */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Negotiation & Collaboration</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { cap: 'AI Compliance Checking per Round', scope: 'External', maturity: 'Scaled', deps: 'Per management: playbook rules applied per round; tracks alignment/non-alignment at sub-item level' },
                { cap: 'Pre-Publication Report', scope: 'External', maturity: 'Scaled', deps: 'Per management: auto-generated line-item summary of every redline before user finalizes' },
                { cap: 'Round-to-Round Change Summarization', scope: 'External', maturity: 'Partial-Scaled', deps: 'Generative AI; structured data extraction' },
              ].map((c) => (
                <div key={c.cap} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                  <h3 className="text-xs font-semibold text-cream mb-1">{c.cap}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono bg-gold/10 text-gold px-1.5 py-0.5 rounded">{c.scope}</span>
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-300 px-1.5 py-0.5 rounded">{c.maturity}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{c.deps}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Data & Analytics */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Data & Analytics</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { cap: 'Metagreement™ Structured Data Extraction', scope: 'External', maturity: 'Scaled', deps: 'Per management: graph database captures clause-level data; tracks clause reuse across organizations (e.g., “this clause used in 52 places”)' },
                { cap: 'Market Intelligence / Benchmarking', scope: 'External', maturity: 'Partial', deps: 'Per management: referenced as feature; requires network volume for meaningful benchmarking' },
              ].map((c) => (
                <div key={c.cap} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                  <h3 className="text-xs font-semibold text-cream mb-1">{c.cap}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono bg-gold/10 text-gold px-1.5 py-0.5 rounded">{c.scope}</span>
                    <span className="text-[10px] font-mono bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded">{c.maturity}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{c.deps}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Internal Engineering AI */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Internal Engineering AI (New from Diligence)</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { cap: 'AI-Assisted Coding', scope: 'Internal', maturity: 'Scaled', deps: 'Per management: almost all code written with AI; Claude Code is primary AI tool; multi-repo support; spec + TDD first approach' },
                { cap: 'Sub-Agent Coding Framework', scope: 'Internal', maturity: 'Scaled', deps: 'Per management: specialized sub-agents — Cypher, Review, UI, PR Generation, Agent Builder, Red Green Refactor agents' },
                { cap: 'AI Code Review in CI/CD', scope: 'Internal', maturity: 'Scaled', deps: 'Per management: customized Claude review agent on every PR; auto-deploy checks; updated weekly' },
                { cap: 'QA Automation + Monitoring', scope: 'Internal', maturity: 'Partial-Scaled', deps: 'Per management: automated QA tests, daily QA reports; agent gateway makes all API calls observable' },
              ].map((c) => (
                <div key={c.cap} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                  <h3 className="text-xs font-semibold text-cream mb-1">{c.cap}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">{c.scope}</span>
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-300 px-1.5 py-0.5 rounded">{c.maturity}</span>
                  </div>
                  <p className="text-[10px] text-cream/50">{c.deps}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
  )

  slideContentMap['architecture-readiness'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Architecture Snapshot + Readiness</h2>
            <p className="text-xs text-cream/50">Per management diligence calls — architecture details confirmed</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Database className="w-5 h-5 text-gold mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Architecture (per management)</h3>
              <div className="p-3 bg-cream/5 rounded-lg font-mono text-[10px] text-cream/60 space-y-1 mb-3">
                <p>[Vue.js Frontend (CloudFront CDN)]</p>
                <p className="pl-4">→ [Cognito Auth (SSO/SAML)]</p>
                <p className="pl-8">→ [Apollo GraphQL API (TypeScript)]</p>
                <p className="pl-8">    [AI Processing Services Layer]</p>
                <p className="pl-12">→ [Neo4j Graph DB] [OpenSearch] [S3]</p>
                <p className="pl-12">→ [AWS Agent Core] [Step Fns] [Prompt Framework]</p>
                <p className="pl-16">→ [Anthropic | OpenAI | Gemini (Direct API)]</p>
              </div>
              <div className="space-y-1.5 text-[10px] text-cream/50">
                <p><span className="text-cream/70 font-medium">Primary DB:</span> Neo4j (graph) — no relational DB; captures contract network relationships, clause reuse, version history</p>
                <p><span className="text-cream/70 font-medium">Search:</span> OpenSearch (vector + full-text); sync ops maintain Neo4j consistency</p>
                <p><span className="text-cream/70 font-medium">Models:</span> Anthropic (Sonnet 4.6), OpenAI (GPT-4.1/mini), Gemini (large-context PDF). Direct API — not Bedrock (lags on features like citations API)</p>
                <p><span className="text-cream/70 font-medium">Prompts:</span> All prompts, templates, settings (temperature, top-P, model selection) stored in database — not in code. Enables non-engineer modification and rapid model swapping</p>
                <p><span className="text-cream/70 font-medium">Agents:</span> Isolated behind API gateway; cannot directly access databases; user identity passthrough; observable API calls</p>
                <p><span className="text-cream/70 font-medium">Infra:</span> AWS CDK (not Terraform); separate AWS accounts for dev/staging vs. prod; US-East primary; EU instance (EU-West-2) dormant — no European customers</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3">Readiness Callouts</h3>
              <div className="space-y-2">
                {[
                  { area: 'Cloud Platform', status: 'ready' as const, note: 'AWS-native, serverless, cloud-first from founding; CDK for IaC; multi-region capable' },
                  { area: 'AI/ML Infrastructure', status: 'ready' as const, note: 'Multi-model with abstraction layer; model hot-swapping; prompt management system; agent orchestration; evaluation against gold-standard datasets' },
                  { area: 'Security Posture', status: 'developing' as const, note: 'No PHI stored; minimal PII; all data encrypted in transit; every API call authenticated; enterprise AI licensing. Not SOC2 certified; not CFR 21 Part 11 validated' },
                  { area: 'Data Architecture', status: 'ready' as const, note: 'Graph database is a natural fit for contract network; structured clause-level data; version tracking; relationship mapping' },
                  { area: 'Integration Readiness', status: 'developing' as const, note: 'GraphQL API with strict type definitions; DocuSign integration for signatures; Florence partnership. No public API documentation reviewed' },
                  { area: 'Scalability', status: 'developing' as const, note: 'Serverless architecture should scale well in theory; no load testing evidence discussed; customer base still small' },
                ].map((r) => (
                  <div key={r.area} className="flex items-start gap-2 text-xs">
                    <ReadinessIcon status={r.status} />
                    <div>
                      <span className="text-cream/90 font-medium">{r.area}:</span>{' '}
                      <span className="text-cream/60">{r.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <div className="text-xs uppercase tracking-wider text-red-300 mb-1">Primary Constraints</div>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="text-red-300 font-medium">No SOC2 certification:</span> Per management, they handle 3-5 security questionnaires per month from customers. SOC2 would reduce friction for enterprise sales under WCG.</li>
              <li>• <span className="text-red-300 font-medium">Not CFR 21 Part 11 validated:</span> Per management, not needed because CTAs are not patient-facing. If Mercury expands into ICF or GxP documents, this will be required.</li>
              <li>• <span className="text-red-300 font-medium">No formal MLOps/model monitoring:</span> Observable agent gateway is a strong foundation but not yet formalized into monitoring system. AWS agent evaluation framework planned but not implemented.</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['ai-value-framework'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Value Framework</h2>
            <p className="text-sm text-cream/50">Internal vs External Value Buckets</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-sage-300 mb-3">Internal Value Buckets</h3>
              <div className="space-y-3">
                {[
                  { bucket: 'Cost', def: 'Reduce labor cost per agreement', kpis: 'Hours per CTA; cost per completed negotiation; external counsel spend', proof: 'Before/after comparisons; FTE equivalents' },
                  { bucket: 'Speed', def: 'Reduce cycle time from draft to execution', kpis: 'Days to signed CTA; rounds of negotiation; time to first response', proof: 'Time-series data; benchmarking' },
                  { bucket: 'Productivity', def: 'Enable more agreements per FTE', kpis: 'CTAs per specialist/month; concurrent negotiations handled', proof: 'Throughput metrics; capacity utilization' },
                ].map((b) => (
                  <div key={b.bucket} className="p-3 bg-sage-500/5 border border-sage-500/20 rounded-lg">
                    <h4 className="text-xs font-semibold text-cream mb-1">{b.bucket}</h4>
                    <p className="text-[10px] text-cream/60 mb-1">{b.def}</p>
                    <p className="text-[10px] text-cream/40"><span className="font-medium">KPIs:</span> {b.kpis}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-purple-300 mb-3">External Value Buckets</h3>
              <div className="space-y-3">
                {[
                  { bucket: 'Pricing Power', def: 'Premium pricing via AI-differentiated capabilities', kpis: 'Price per seat/agreement; willingness to pay vs. alternatives; margin', proof: 'Pricing studies; competitive benchmarking' },
                  { bucket: 'Speed-to-Close', def: 'Reduce time from prospect interest to signed deal', kpis: 'Trial start-up time (CTA portion); site activation timeline', proof: 'Customer case studies; industry benchmarks' },
                ].map((b) => (
                  <div key={b.bucket} className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                    <h4 className="text-xs font-semibold text-cream mb-1">{b.bucket}</h4>
                    <p className="text-[10px] text-cream/60 mb-1">{b.def}</p>
                    <p className="text-[10px] text-cream/40"><span className="font-medium">KPIs:</span> {b.kpis}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  )

  slideContentMap['ai-value-proof'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Value &amp; Proof — Examples</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                title: 'AI-Powered First-Draft Markup',
                internal: 'Cost (reduces attorney hours); Productivity (more concurrent reviews)',
                external: 'Speed-to-Close (first response in minutes vs. days)',
                proof: 'Claims "first-draft AI markups in minutes." 50–80% reduction reported. No independent verification.',
                replicability: 'MEDIUM-HIGH', replicabilityNote: 'Any platform can integrate LLMs for markup; CTA-specific playbooks harder',
                comparables: 'Luminance, Ironclad, Harvey, any CLM vendor adding AI'
              },
              {
                title: 'Metagreement™ Structured Data + Intelligence',
                internal: 'Speed (eliminates manual extraction); Productivity (obligations tracked automatically)',
                external: 'Pricing Power (unique benchmarking data); Speed-to-Close (both parties see structured data)',
                proof: 'Product page describes feature; no independent verification of accuracy or completeness.',
                replicability: 'MEDIUM', replicabilityNote: 'Structured extraction feasible; CTA-specific schema + network data harder',
                comparables: 'No direct comparable in CTA-specific structured data'
              },
              {
                title: 'Multi-Party Negotiation with AI Compliance',
                internal: 'Speed (eliminates email back-and-forth); Cost (reduces external counsel coordination)',
                external: 'Speed-to-Close (real-time collaboration vs. serial email chains)',
                proof: 'Platform architecture described; "Negotiate Your Way" and "Stay Standards-Compliant" features.',
                replicability: 'LOW', replicabilityNote: 'Multi-party trust + neutrality + both-side adoption — deepest moat',
                comparables: 'No direct comparable; CLM tools serve one side; general collaboration lacks contract features'
              },
            ].map((ex) => (
              <div key={ex.title} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <h3 className="text-sm font-semibold text-cream mb-3">{ex.title}</h3>
                <div className="grid md:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-cream/40 font-medium">Internal value:</span>
                    <p className="text-cream/70 mt-0.5">{ex.internal}</p>
                  </div>
                  <div>
                    <span className="text-cream/40 font-medium">External value:</span>
                    <p className="text-cream/70 mt-0.5">{ex.external}</p>
                  </div>
                  <div>
                    <span className="text-cream/40 font-medium">Proof:</span>
                    <p className="text-yellow-300/70 mt-0.5">{ex.proof}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-cream/40">Replicability:</span>
                    <RatingBadge rating={ex.replicability} />
                  </div>
                  <div className="flex-1 h-1.5 bg-cream/10 rounded-full overflow-hidden max-w-[120px]">
                    <div className={`h-full rounded-full ${
                      ex.replicability === 'MEDIUM-HIGH' ? 'bg-red-400 w-[70%]' :
                      ex.replicability === 'MEDIUM' ? 'bg-yellow-400 w-[55%]' :
                      'bg-green-400 w-[20%]'
                    }`} />
                  </div>
                  <span className="text-[10px] text-cream/50">{ex.replicabilityNote}</span>
                </div>
                <p className="text-[10px] text-cream/40 mt-1">Comparables: {ex.comparables}</p>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['synergies-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer ↔ Target Synergies</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Synergies — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { asset: 'Data', rating: 'HIGH', why: 'WCG\u2019s 80K+ protocol dataset + 31TB Knowledge Base combined with Mercury\u2019s clause-level CTA data creates unprecedented insight into how contracts relate to study performance' },
              { asset: 'Channel', rating: 'HIGH', why: 'WCG supports 300K+ sites, trusted partner for 94% of FDA-approved therapies. Mercury immediately gains distribution at scale.' },
              { asset: 'Product', rating: 'HIGH', why: 'ClinSphere has no contract negotiation module. Mercury fills a critical gap in the "end-to-end" clinical trial platform vision.' },
              { asset: 'Relationships', rating: 'MEDIUM-HIGH', why: 'WCG\u2019s sponsor relationships (top 25 buy 4+ solutions) + Mercury\u2019s site relationships (Mayo Clinic) create cross-side value' },
            ].map((s) => (
              <div key={s.asset} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-cream">{s.asset}</h3>
                  <RatingBadge rating={s.rating} />
                </div>
                <p className="text-xs text-cream/60">{s.why}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50 mb-2">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Key Constraints</div>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Data rights/privacy: combining protocol + contract data requires governance, regulatory compliance, customer consent</li>
              <li>• Neutrality: Mercury&apos;s &quot;proactively neutral&quot; positioning may be challenged if owned by WCG (who serves sponsors)</li>
              <li>• Integration complexity: ClinSphere is new (2024); integration requires significant engineering</li>
            </ul>
          </div>
          <GapCallout gapCount={4}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Would WCG-owned Mercury maintain neutrality? How would sites perceive this? <GapTag /></li>
              <li>• Technical integration path between ClinSphere and Mercury? <GapTag /></li>
              <li>• How would combined data asset be governed and monetized? <GapTag /></li>
              <li>• Would Mercury operate independently or fold into ClinSphere? <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['synergy-matrix'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer ↔ Target Synergies</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Synergy Connections Mapped to Assets</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-blue-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[100px]">WCG ↓ / Mercury →</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Mercury Data (CTA clauses)</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Mercury Channel (Sites)</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Mercury Product</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Mercury Relationships</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">WCG Data (80K+ protocols)</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Protocol + contract linkage enables predictive insights</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span> — Data insights shared via channel</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — WCG data powers smarter AI markup</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">WCG Channel (300K+ sites)</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span> — More data for models</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Immediate distribution at scale</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — ClinSphere embeds Mercury in startup workflow</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">WCG Product (ClinSphere)</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Mercury data enriches ClinSphere analytics</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Mercury becomes the contract module</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">WCG Relationships (PE)</td>
                  <td className="p-2 text-cream/40">Low-Med</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Combined map covers both CTA sides</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Constraints</div>
            <ul className="text-[10px] text-cream/70 space-y-0.5">
              <li>1. Neutrality perception — sites must trust WCG-owned Mercury</li>
              <li>2. Data governance — combining protocol and contract data requires careful rights management</li>
              <li>3. Integration timeline — ClinSphere is still maturing</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['synergy-detail'] = (
        <div className="space-y-4 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer ↔ Target Synergies</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Synergy Detail (Selected Connections)</h2>
          </div>
          <div className="space-y-3 mt-4">
            {[
              {
                num: '1', title: 'ClinSphere + Mercury = End-to-End Study Start-Up',
                value: 'Sites go from feasibility to signed CTA in one platform. WCG claims 40–60% reduction; Mercury claims 50–80%. Combined could be transformative.',
                prereq: 'Technical integration; shared SSO; data flow between study setup and contract modules',
                constraint: 'ClinSphere is new (2024); integration engineering 6–12 months minimum'
              },
              {
                num: '2', title: 'WCG Site Network → Mercury Distribution',
                value: 'WCG\u2019s site enablement team deploys Mercury to hundreds of sites in months, not years. Network effects accelerate dramatically.',
                prereq: 'Sales team trained on Mercury; pricing aligned with site enablement packaging',
                constraint: 'Neutrality perception — "pushing" Mercury may feel like vendor mandate'
              },
              {
                num: '3', title: 'WCG Protocol Data + Mercury Contract Data = Predictive Intelligence',
                value: 'Linking protocol complexity to negotiation outcomes enables novel predictions (e.g., "protocols with X add Y days to CTA").',
                prereq: 'Data schema alignment; privacy/compliance review; ML model development',
                constraint: 'Mercury data volume insufficient initially; requires significant adoption first'
              },
              {
                num: '4', title: 'WCG Sponsor Relationships → Mercury Sponsor-Side Adoption',
                value: 'If sponsors adopt Mercury through WCG, both sides negotiate on one platform — unlocking highest-value feature.',
                prereq: 'Sponsor willingness; integration with sponsor CLM systems; pricing model',
                constraint: 'Sponsors may resist tool owned by company that serves their counterparties (sites)'
              },
              {
                num: '5', title: 'Florence Partnership → Expanded Ecosystem',
                value: 'Florence eISF + Mercury contracts + WCG site enablement = unified workflow from documents to negotiation to compliance.',
                prereq: 'Deepen Florence-Mercury integration; align data sharing; commercial terms',
                constraint: 'Florence could view WCG ownership of Mercury as competitive threat'
              },
            ].map((conn) => (
              <div key={conn.num} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded flex-shrink-0">{conn.num}</span>
                  <h3 className="text-xs font-semibold text-cream">{conn.title}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-2 text-[10px]">
                  <div><span className="text-green-300/60 font-medium">Value:</span> <span className="text-cream/60">{conn.value}</span></div>
                  <div><span className="text-cream/40 font-medium">Prerequisites:</span> <span className="text-cream/60">{conn.prereq}</span></div>
                  <div><span className="text-red-300/60 font-medium">Constraint:</span> <span className="text-cream/60">{conn.constraint}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['synergy-waves'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer ↔ Target Synergies</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Synergy Pathways (3 Waves)</h2>
          </div>
          <div className="flex items-center gap-0 mt-4 mb-2">
            {[
              { label: 'Wave 1: 0–6 mo', color: 'bg-green-500', width: 'w-1/6' },
              { label: 'Wave 2: 6–18 mo', color: 'bg-yellow-500', width: 'w-2/6' },
              { label: 'Wave 3: 18–36 mo', color: 'bg-purple-500', width: 'w-3/6' },
            ].map((w) => (
              <div key={w.label} className={`${w.width} flex flex-col items-center`}>
                <div className={`w-full h-3 ${w.color} first:rounded-l-full last:rounded-r-full`} />
                <span className="text-[9px] font-mono text-cream/40 mt-1">{w.label}</span>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-blue-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[110px]">Connection</th>
                  <th className="text-left p-2 text-cream/80 font-medium">
                    <span className="text-green-300">Wave 1</span>
                    <span className="block text-cream/40 font-normal">0–6 months</span>
                  </th>
                  <th className="text-left p-2 text-cream/80 font-medium">
                    <span className="text-yellow-300">Wave 2</span>
                    <span className="block text-cream/40 font-normal">6–18 months</span>
                  </th>
                  <th className="text-left p-2 text-cream/80 font-medium">
                    <span className="text-purple-300">Wave 3</span>
                    <span className="block text-cream/40 font-normal">18–36 months</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">1. ClinSphere + Mercury</td>
                  <td className="p-2">SSO/auth integration; Mercury accessible from ClinSphere via deep-link</td>
                  <td className="p-2">Embedded contract negotiation within ClinSphere study start-up module</td>
                  <td className="p-2">Unified data model — contract status feeds ClinSphere dashboards</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">2. Site Distribution</td>
                  <td className="p-2">Pilot Mercury with 10–20 WCG site enablement clients; train team</td>
                  <td className="p-2">Roll out to 100+ sites; bundle into site packages</td>
                  <td className="p-2">Mercury available to all Buyer-supported sites; network effects at scale</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">3. Data Intelligence</td>
                  <td className="p-2">Schema mapping between Buyer protocol data and Mercury contract data</td>
                  <td className="p-2">Build initial predictive models (protocol complexity → negotiation time)</td>
                  <td className="p-2">Launch predictive contracting intelligence product</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">4. Sponsor Adoption</td>
                  <td className="p-2">Leverage Buyer relationships for 2–3 sponsor pilots</td>
                  <td className="p-2">Expand to 10+ sponsors; develop sponsor-specific features</td>
                  <td className="p-2">Sponsors and sites routinely on Mercury through Buyer; flywheel active</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">5. Florence Ecosystem</td>
                  <td className="p-2">Maintain Florence-Mercury partnership; clarify terms under Buyer</td>
                  <td className="p-2">Deepen API integration (eISF → contract → compliance)</td>
                  <td className="p-2">Fully integrated workflow from regulatory docs to signed CTA</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Prerequisites by Wave</div>
            <ul className="text-[10px] text-cream/70 space-y-0.5">
              <li><span className="text-green-300">W1:</span> Clear integration authority; combined product leadership; data rights assessment</li>
              <li><span className="text-yellow-300">W2:</span> Engineering investment in platform integration; combined AI team; sales alignment</li>
              <li><span className="text-purple-300">W3:</span> Full organizational alignment; unified technology platform; regulatory validation</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['priority-initiatives'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-red-400 mb-2">Chapter G — Quantified Impact</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Priority Initiatives — Assumptions + Uplift</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                num: '1', title: 'Accelerate Site Start-Up: ClinSphere + Mercury Integration',
                buckets: 'Speed-to-Close, Cost',
                assumptions: ['# sites Buyer currently supports in study start-up', 'Current avg CTA negotiation time', 'Mercury reduces by 50–80% (public claim)', 'Each day saved = $600K–$8M (industry est.)'],
                output: 'Days saved per CTA × CTAs per year → total sponsor value → Buyer share captured'
              },
              {
                num: '2', title: 'Cross-Sell Mercury to Buyer Site Enablement Clients',
                buckets: 'Pricing Power, Productivity',
                assumptions: ['% of Buyer sites paying for enablement', 'Mercury pricing per site/year', 'Adoption rate %'],
                output: 'Incremental ARR from Mercury cross-sell; net revenue retention improvement'
              },
              {
                num: '3', title: 'Launch Contract Intelligence Data Product',
                buckets: 'Pricing Power, Speed',
                assumptions: ['Mercury data volume reaches sufficient agreements', 'ML model accuracy', 'Data product pricing'],
                output: 'Data product revenue; premium ClinSphere tier pricing with contract intelligence'
              },
            ].map((init) => (
              <div key={init.num} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-sm font-mono text-red-300 bg-red-500/10 px-2 py-0.5 rounded flex-shrink-0">{init.num}</span>
                  <div>
                    <h3 className="text-sm font-medium text-cream">{init.title}</h3>
                    <span className="text-[10px] font-mono text-cream/40">Value buckets: {init.buckets}</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-cream/40 font-medium">Key Assumptions (INPUTS NEEDED):</span>
                    <ul className="mt-1 space-y-0.5">
                      {init.assumptions.map((a, i) => (
                        <li key={i} className="text-[10px] text-cream/60 flex items-center gap-1">
                          <GapTag /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] text-cream/40 font-medium">Output Metric:</span>
                    <p className="text-xs text-cream/70 mt-1">{init.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <p className="text-xs text-cream/70"><span className="text-red-300 font-medium">Executive Callout:</span> All three initiatives have significant potential but require internal data to quantify. Highest-confidence: #1 (ClinSphere + Mercury), directly supported by public claims from both Buyer (40–60%) and Mercury (50–80%). Combined effect on study start-up could be a strong ClinSphere differentiator.</p>
          </div>
        </div>
  )

  slideContentMap['sensitivity'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-red-400 mb-2">Chapter G — Quantified Impact</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Sensitivity: Impact on Growth Curve</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2">High Case — &quot;Network Flywheel&quot;</h3>
              <ul className="text-[10px] text-cream/70 space-y-1">
                <li>• 100+ sites via Buyer channel in 12 months</li>
                <li>• 3+ sponsor pilots convert to production</li>
                <li>• ClinSphere integration in 6 months</li>
                <li>• Mercury data reaches critical mass</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Medium Case — &quot;Steady Build&quot;</h3>
              <ul className="text-[10px] text-cream/70 space-y-1">
                <li>• 30–50 sites in 12 months</li>
                <li>• 1–2 sponsor pilots</li>
                <li>• ClinSphere integration takes 12 months</li>
                <li>• Data grows but insufficient for benchmarking</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Low Case — &quot;Integration Drag&quot;</h3>
              <ul className="text-[10px] text-cream/70 space-y-1">
                <li>• Integration harder than expected (18+ months)</li>
                <li>• Neutrality perception slows site adoption</li>
                <li>• AI capabilities replicated by competitors</li>
                <li>• Florence partnership disrupted</li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-red-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Assumption</th>
                  <th className="text-left p-2 text-green-300 font-medium">High</th>
                  <th className="text-left p-2 text-yellow-300 font-medium">Medium</th>
                  <th className="text-left p-2 text-red-300 font-medium">Low</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  'Neutrality perception under Buyer ownership',
                  'ClinSphere integration timeline',
                  'Florence partnership durability post-acquisition',
                  'Competitive response from Veeva SiteVault',
                  'Sponsor-side adoption rate',
                ].map((label, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="p-2 font-medium text-cream/90">{label}</td>
                    <td className="p-2"><GapTag /></td>
                    <td className="p-2"><GapTag /></td>
                    <td className="p-2"><GapTag /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <div className="text-xs uppercase tracking-wider text-red-300 mb-2">Assumptions That Matter Most</div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: '1', title: 'Neutrality perception', detail: 'Can Buyer-owned Mercury maintain credibility as a neutral platform for both sponsors and sites?' },
                { num: '2', title: 'ClinSphere integration timeline', detail: 'How quickly can Mercury be embedded in the ClinSphere workflow?' },
                { num: '3', title: 'Florence partnership durability', detail: 'Does Buyer ownership strengthen or weaken the Florence relationship?' },
                { num: '4', title: 'Veeva competitive response', detail: 'Does Veeva launch a CTA negotiation module in SiteVault?' },
                { num: '5', title: 'Sponsor-side adoption', detail: 'Will sponsors use a platform owned by a company that also serves their counterparties?' },
              ].map((a) => (
                <div key={a.num} className="flex items-start gap-2 text-xs">
                  <span className="text-red-300 font-mono flex-shrink-0">{a.num}.</span>
                  <div>
                    <span className="text-cream/90 font-medium">{a.title}</span>
                    <span className="text-cream/50"> — {a.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

function getSlideContent(slideId: string): React.ReactNode {
  if (Object.keys(slideContentMap).length === 0) {
    buildSlideContentMap()
  }
  return slideContentMap[slideId] || (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-cream/40">Slide &quot;{slideId}&quot; not found</p>
    </div>
  )
}

export function MercuryDiligenceSlide({ slideId }: { slideId: string }) {
  return <>{getSlideContent(slideId)}</>
}

export default MercuryDiligenceSlide
