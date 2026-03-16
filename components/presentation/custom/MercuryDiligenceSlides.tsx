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
import { RatingBadge, StatusDot, ReadinessIcon, GapSticker, GapTag } from '../shared/DiligenceComponents'

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


// AI Opportunity — Quantified Impact horizontal bar chart
const aiImpactData = {
  labels: [
    'Site Platform Licenses',
    'Budget Module Add-on',
    'Sponsor — Project',
    'Sponsor — Enterprise',
    'Channel Cross-Sell',
    'ClinSphere Integration',
    'Internal WCG Transform',
    'Data Flywheel',
  ],
  datasets: [
    {
      label: 'Low ($K)',
      data: [900, 280, 0, 0, 350, 0, 10, 0],
      backgroundColor: 'rgba(74, 93, 76, 0.45)',
      borderColor: 'rgba(107, 142, 111, 0.7)',
      borderWidth: 1,
      borderRadius: 3,
    },
    {
      label: 'High ($K)',
      data: [270, 245, 175, 0, 650, 250, 70, 0],
      backgroundColor: 'rgba(107, 142, 111, 0.85)',
      borderColor: 'rgba(107, 142, 111, 1)',
      borderWidth: 1,
      borderRadius: 3,
    },
  ],
}

const aiImpactOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: { color: 'rgba(245, 244, 240, 0.6)', font: { size: 9 }, boxWidth: 12, padding: 8 },
    },
    tooltip: {
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) => {
          const dsLabel = ctx.dataset.label || ''
          return `${dsLabel}: $${ctx.parsed?.x ?? 0}K`
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: 'rgba(245, 244, 240, 0.4)',
        font: { size: 9 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (v: any) => `$${v}K`,
      },
      grid: { color: 'rgba(245, 244, 240, 0.05)' },
      border: { display: false },
      beginAtZero: true,
    },
    y: {
      stacked: true,
      ticks: { color: 'rgba(245, 244, 240, 0.6)', font: { size: 9 } },
      grid: { display: false },
      border: { color: 'rgba(245, 244, 240, 0.1)' },
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slideContentMap: Record<string, React.ReactNode> = {}

function buildSlideContentMap() {

  slideContentMap['framework-overview'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 02</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">How We Evaluated Mercury&apos;s AI Portfolio</h2>
            <p className="text-cream/50 text-sm">4-phase AI due diligence framework</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { phase: '01', title: 'Business Value & Growth Thesis', desc: 'Revenue model, cost structure, competitive positioning. Map internal/external value pools and identify where AI creates highest-leverage P&L impact.', verdict: 'Strong alignment — Mercury targets CTA negotiation bottleneck with genuine AI differentiation, but growth projections require WCG synergy to reach scale.', color: 'border-sage', textColor: 'text-sage-300' },
              { phase: '02', title: 'AI Initiatives & Disruption Risk', desc: 'Inventory all active AI initiatives. Evaluate each individually — what it does, who uses it, defensibility, and displacement risk from foundation models and incumbents.', verdict: 'Moderate — domain moats are real but narrower than management believes. Pipeline complexity is genuine; basic AI markup is increasingly commoditized.', color: 'border-purple-500', textColor: 'text-purple-300' },
              { phase: '03', title: 'Team, Assets & Defensibility', desc: 'Assess whether the team can execute the AI roadmap. Score product, data, channel, and relationship assets for durability.', verdict: 'High on product and team; early-stage on data and channel. Unusually mature for stage, but key-person concentration risk requires retention planning.', color: 'border-green-500', textColor: 'text-green-400' },
              { phase: '04', title: 'ROI Quantification & Synergy Roadmap', desc: 'Quantify value creation through synergies, leading indicator measurement, and a phased execution plan.', verdict: 'Conditional — high synergy potential (WCG data + channel × Mercury product), but quantification pending internal data. Data rights are the critical gating factor.', color: 'border-blue-500', textColor: 'text-blue-400' },
            ].map((p) => (
              <div key={p.phase} className={`p-4 bg-white/5 border-l-4 ${p.color} rounded-r-lg`}>
                <div className={`text-xs font-mono ${p.textColor} mb-1`}>{p.phase}</div>
                <h3 className="text-sm font-semibold text-cream mb-2">{p.title}</h3>
                <p className="text-xs text-cream/60 mb-2">{p.desc}</p>
                <p className={`text-[10px] ${p.textColor} italic border-t border-cream/10 pt-1.5`}>{p.verdict}</p>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['executive-summary'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 03</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Executive Summary</h2>
            <p className="text-cream/50 text-sm">Key findings by phase</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { chapter: 'Phase 1 — Business Value & Growth Thesis', bullets: ['Mercury targets the CTA negotiation bottleneck with AI-powered markup. Client support suggests 15\u201318% negotiation time reduction.', 'Rise of agentic AI creates macro tailwind.'], color: 'border-sage' },
              { chapter: 'Phase 2 — AI Initiatives & Disruption Risk', bullets: ['Two key threats: frontier models (good enough for most?), and competitors with existing site relationships.', 'Mercury\u2019s pipeline complexity and domain expertise create genuine barriers.', 'Mercury is committed to AI both in product and internal processes, continuing to double down on differentiation vs foundation models.'], color: 'border-purple-500' },
              { chapter: 'Phase 3 — Team, Assets & Defensibility', bullets: ['Strong product and relationship assets (Mayo, Duke, Cleveland Clinic).', 'Data and channel assets are early-stage but growing with each customer.', 'Unusually mature for stage \u2014 4-person dev team with high process maturity.', 'Strong vision/product/tech focus; under-resourced on commercial.'], color: 'border-green-500' },
              { chapter: 'Phase 4 — ROI Quantification & Synergy Roadmap', bullets: ['High synergy potential \u2014 WCG brings data + channel; Mercury brings differentiated product.', 'Data rights and neutrality are key constraints.', 'Quantification model under construction \u2014 Phase 4 detail identifies assumptions and ranges; final numbers require WCG internal data inputs.'], color: 'border-blue-500' },
            ].map((ch) => (
              <div key={ch.chapter} className={`p-4 bg-white/5 border-l-4 ${ch.color} rounded-r-lg`}>
                <h3 className="text-sm font-semibold text-cream mb-2">{ch.chapter}</h3>
                <ul className="space-y-1">
                  {ch.bullets.map((b, i) => (
                    <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                      <span className="text-cream/30 font-mono mt-px">&bull;</span>
                      <span>{b}</span>
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
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Phase 1 — Business Value & Growth Thesis</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Growth Thesis Alignment — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Macro Growth Drivers</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">Digitization of CTA/contracting process</span> — industry shifting from manual, email-based negotiation to platform-based workflows</li>
                <li>• <span className="text-cream/90 font-medium">Site startup time recognized as key bottleneck/lever</span> — directly impacts trial timelines and sponsor economics</li>
                <li>• <span className="text-cream/90 font-medium">Opportunity to disrupt via AI</span> — rise of agentic AI enables multi-step contract orchestration previously impossible</li>
                <li>• Supporting data: CTA negotiation averages ~64 days; delays cost sponsors $600K–$8M per day</li>
                <li>• 35,000+ clinical trials initiated annually worldwide</li>
                <li>• Clients report 50–80% negotiation time reduction; 15–18% observed in client support data</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Operating Data (from Transcripts)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">ARR:</span> ~$700K</li>
                <li>• <span className="text-cream/90 font-medium">Customers:</span> ~21–22 sites + 1 sponsor</li>
                <li>• <span className="text-cream/90 font-medium">Revenue model:</span> per-seat SaaS</li>
                <li>• <span className="text-cream/90 font-medium">Beta deployments:</span> days</li>
                <li>• <span className="text-cream/90 font-medium">Retention:</span> sounds high; no churn discussed</li>
                <li>• <span className="text-cream/90 font-medium">GTM:</span> Sites first (subscription), then sponsors (project basis; currently 1 sponsor)</li>
                <li>• <span className="text-cream/90 font-medium">CEO background:</span> third AI-powered contract company — e-discovery co. (2004–2018), Apogee/Seal Software → DocuSign (May 2020)</li>
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
        </div>
  )

  slideContentMap['growth-projections'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Phase 1 — Business Value & Growth Thesis</div>
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
                  { label: 'Time Reduction (Mgmt)', val: '50–80%', sub: 'Mercury claim' },
                  { label: 'Time Reduction (Tweed Adj.)', val: '15–18%', sub: 'Client support data' },
                  { label: 'ARR (est.)', val: '~$700K', sub: 'Per transcripts' },
                ].map((m) => (
                  <div key={m.label} className="p-2 bg-white/5 border border-cream/10 rounded-lg">
                    <div className="text-sm font-serif text-sage-300">{m.val}</div>
                    <div className="text-[10px] text-cream/50">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="p-2 bg-sage-500/10 border border-sage-500/20 rounded-lg mb-3">
                <p className="text-[10px] text-cream/60"><span className="text-sage-300 font-medium">Projection Sources:</span> All metrics labeled <span className="text-cream/80">(Mgmt)</span> = Mercury management claims. <span className="text-cream/80">(Tweed Adj.)</span> = Tweed-adjusted based on client support data. <span className="text-cream/80">(+ WCG Synergy)</span> projections in Phase 4 reflect buyer-enhanced scenarios.</p>
              </div>
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-sage-300" /> &quot;What Has to Be True&quot; for Growth</h3>
              <div className="space-y-3">
                {[
                  'Mercury cannot be disrupted by a single frontier/general model (e.g., Claude) — differentiation must remain meaningful beyond what off-the-shelf LLMs provide',
                  'Product is sticky and differentiated enough to drive adoption and sustained use across sites and sponsors',
                  'AI pipelines are high-quality and materially differentiated vs. off-the-shelf LLM use — pipeline complexity is real, not marketing',
                  'Differentiation is visible and necessary to customers — they choose Mercury over generic tools because outcomes are measurably better',
                  'Revenue model supports both site-side and sponsor-side monetization',
                  'Network effects emerge: sponsors prefer sites on Mercury, and vice versa',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                    <ArrowRight className="w-3 h-3 text-sage-300 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  )

  slideContentMap['offering-ai-growth-matrix'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Phase 1 — Business Value & Growth Thesis</div>
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
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: add seat licenses as usage grows; upsell congruency pipeline</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: compounds with volume; becomes institutional standard</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: refines over time; drives deeper adoption</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: sponsor-side expansion once sites adopted</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: richer data unlocks benchmarking tier</td>
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
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: commoditizing; <span className="text-red-300">risk from off-the-shelf legal AI (Harvey) or using Claude directly</span></td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: requires dataset scale for differentiation</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: domain-specific playbooks hard to replicate</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: network effects protect pricing only at scale</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: unique asset; most defensible pricing lever</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70 mb-2"><span className="text-sage-300 font-semibold">Primary value concentrations (highlighted in table):</span></p>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>&bull; <span className="text-cream/90 font-medium">Metagreement™ Data × Retention/Expansion:</span> Most defensible growth enabler — proprietary data asset that compounds with volume and locks in customers</li>
              <li>&bull; <span className="text-cream/90 font-medium">CTA AI Markup × New Logo (Sponsors):</span> Highest near-term revenue driver — scales 100s of negotiations per sponsor, strongest WCG cross-sell vector</li>
              <li>&bull; <span className="text-cream/90 font-medium">Playbook Compliance × Pricing Power:</span> Domain-specific playbooks are hardest to replicate — primary margin protection mechanism</li>
            </ul>
            <p className="text-[10px] text-cream/50 mt-2 italic">The remaining cells drive incremental value but are not where the deal thesis concentrates.</p>
          </div>
        </div>
  )

  slideContentMap['ai-roadmap-fit'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Phase 1 — Business Value & Growth Thesis</div>
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
              <li>• Not yet demonstrated: predictive analytics (e.g., predicting contentious clauses) <GapTag /></li>
              <li>• Not yet demonstrated: integration strategy with existing CTMS / eISF platforms (except Florence partnership) <GapTag /></li>
              <li>• Not yet demonstrated: automated budget/payment terms analysis — noted as under development; key question is how directly it ties to the contract workflow wedge <GapTag /></li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['scenarios'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Phase 1 — Business Value & Growth Thesis</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Scenarios (2–3) for Outcomes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-xl">
              <Rocket className="w-6 h-6 text-green-400 mb-2" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-green-300">Network Flywheel Ignites</h3>
                <span className="text-[10px] font-mono bg-green-500/20 text-green-300 px-2 py-0.5 rounded">~25% probability</span>
              </div>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">Specific conditions:</span> WCG deploys Mercury to 100+ sites in 12 months via site enablement channel; 2+ top-20 pharma sponsors (beyond Lilly) adopt within 12 months; ClinSphere integration completes in 6 months; FDA finalizes clinical trial modernization guidance in 2026, accelerating CTMS adoption by 18\u201324 months</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Customer count &gt;3x YoY; sponsor-side revenue emerging; multi-party negotiations increasing; NPS &gt;60</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Mercury becomes system-of-record for CTA negotiation; commands premium pricing; strong integration position</div>
              </div>
            </div>
            <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <Target className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-yellow-300">Solid Niche, Linear Growth</h3>
                <span className="text-[10px] font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">~50% probability</span>
              </div>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">Specific conditions:</span> WCG site rollout reaches 30\u201350 sites in 12 months (adoption friction from neutrality concerns); sponsor adoption slow (1\u20132 pilots, no production); ClinSphere integration takes 12+ months; competitive alternatives emerge but don&apos;t dominate</div>
                <div><span className="text-cream/50 font-medium">We believe this is most likely because:</span> Integration timelines in clinical trial tech historically exceed projections; site adoption requires change management at each institution; sponsor-side multi-party negotiation is a harder sell than site-side productivity</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Deepen site-side value; consider white-label/OEM for sponsors; strengthen partnership channel</div>
              </div>
            </div>
            <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-red-300">AI Commoditization / Integration Failure</h3>
                <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">~25% probability</span>
              </div>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">Specific conditions:</span> Veeva launches CTA negotiation module in SiteVault (2026\u201327); frontier models reach &quot;good enough&quot; for 80% of CTA markup use cases; WCG data rights insufficient for Mercury integration; Florence partnership disrupted by WCG ownership</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Veeva/Ironclad announce CTA features; large CROs build internal tools; Mercury customer retention drops below 80%</div>
                <div><span className="text-cream/50 font-medium">Acquisition-specific downside:</span> WCG pays acquisition premium for AI optionality that doesn&apos;t materialize. Mercury becomes a modest productivity tool rather than a platform-defining capability. The premium paid above build-vs-buy cost ($2.6\u2013$4.0M) represents the at-risk AI optionality value.</div>
              </div>
            </div>
          </div>
        </div>
  )

  slideContentMap['disruption-risk-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Disruption Risk — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Frontier Model Companies</h3>
                <RatingBadge rating="MEDIUM" />
              </div>
              <p className="text-xs text-cream/70"><span className="text-cream/90 font-medium">Core question:</span> Even if frontier models are not best-in-class for CTA negotiation, are they &quot;good enough&quot; that customers adopt them anyway? Will buyers be permitted/ready to embed general-purpose models in contract workflows (governance/compliance)? <span className="text-cream/90 font-medium">Per management:</span> the pipeline is &quot;as important as the LLM model&quot; — a single model call cannot replicate the multi-document, multi-step orchestration managing 500+ sub-issues across 150 playbook topics. Mercury claim is credible, but the &quot;good enough&quot; threshold must be tested.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Competitors</h3>
                <RatingBadge rating="MEDIUM" />
              </div>
              <p className="text-xs text-cream/70"><span className="text-cream/90 font-medium">Core question:</span> Who is building what and how? Mercury advantage: started with a strong base of contracts. Differentiation likely twofold: (1) product design/UX — features, ease, low manual work, and (2) answer quality — pipeline-driven. <span className="text-cream/90 font-medium">Per management:</span> Mercury has won every competitive bake-off; generic tools miss domain-specific issues. Most credible threats: Veeva (SiteVault expanding), Florence (partner but could shift to competitor).</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Package className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Niche / Lightweight</h3>
                <RatingBadge rating="LOW" />
              </div>
              <p className="text-xs text-cream/70"><span className="text-cream/90 font-medium">Per management:</span> Sites are &quot;resource starved, don&apos;t have technology resources, don&apos;t have AI experts.&quot; Mix of lawyers and non-lawyers negotiating contracts. Even large organizations have incomplete playbooks — makes self-build unlikely for sites. Large CROs could replicate basic AI review internally but multi-party collaboration and congruency pipeline are harder to productize.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">WCG Alignment</div>
            <p className="text-xs text-cream/70">WCG dataset would materially strengthen Mercury&apos;s pipeline intelligence. Combining WCG&apos;s protocol data with Mercury&apos;s contract data creates a defensible data advantage that frontier models and competitors cannot easily replicate.</p>
          </div>
        </div>
  )

  slideContentMap['who-could-disrupt'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Who Could Disrupt</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                mode: 'Frontier / Platform',
                color: 'border-purple-500/40',
                items: [
                  { name: 'Anthropic / Claude', rtw: 'Best-in-class language model; increasingly adding enterprise/legal tooling; Claude for Enterprise already used for contract review workflows', must: 'Would need CTA-specific domain expertise, multi-party architecture, and regulatory trust. May not have the niche of site contracts — question is whether niche specificity is required for outcomes.' },
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
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">What the Disruptor Would Build</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                mode: 'Frontier (Anthropic/Claude)',
                concept: 'Claude-powered contract review via API or enterprise platform with CTA-specific prompting',
                functions: 'Auto-redlining, clause comparison, compliance flagging via general-purpose model with domain prompts',
                position: 'Integrated into existing workflows via API; enterprise tooling layer on top',
                why: 'Frontier vendors will naturally add enterprise/legal tooling; question is whether niche of site contracts is required for outcomes',
                stack: 'Claude API → custom prompting layer → document processing pipeline → enterprise auth integration',
                timeline: '3–6 months to MVP; $500K–$1M in engineering',
                cantReplicate: 'Multi-party trust architecture, institutional playbook library, 4,000+ analyzed CTA issue points'
              },
              {
                mode: 'Competitors (Veeva SiteVault)',
                concept: 'CTA negotiation module within SiteVault CTMS',
                functions: 'AI-driven contract markup, budget + contract linkage, status tracking across sites',
                position: 'Integrated into site\'s existing SiteVault platform for study start-up',
                why: 'Sites already on SiteVault avoid a new vendor; sponsor side benefits from existing data flows',
                stack: 'SiteVault platform → LLM integration → clause-level CTA parsing → site workflow embedding',
                timeline: '6–12 months to announce; 12–18 months to production (Veeva AI Agents roadmap targets 2026)',
                cantReplicate: 'Mercury\u2019s neutrality positioning — Veeva is sponsor-aligned; domain-specific CTA playbooks co-developed with Mayo Clinic'
              },
              {
                mode: 'Niche (CRO Internal)',
                concept: 'Internal AI contract review tool trained on thousands of historical CTAs',
                functions: 'Automated first-pass review, deviation flagging, standard clause library',
                position: 'Used by CRO\'s own legal/contracts team only',
                why: 'CROs control enough volume for data advantage internally; no external platform needed',
                stack: 'Internal LLM deployment → historical CTA training corpus → deviation detection → internal workflow',
                timeline: '6–9 months for internal tool; productization unlikely (historically CROs do not productize internal tools)',
                cantReplicate: 'Multi-party openness (CROs serve one side); platform approach with counterparty collaboration'
              },
            ].map((row) => (
              <div key={row.mode} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <h3 className="text-sm font-semibold text-cream mb-3">{row.mode}</h3>
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div><span className="text-cream/40 font-medium">Product concept:</span> <span className="text-cream/70">{row.concept}</span></div>
                  <div><span className="text-cream/40 font-medium">Core functions:</span> <span className="text-cream/70">{row.functions}</span></div>
                  <div><span className="text-cream/40 font-medium">Specific stack:</span> <span className="text-cream/70">{row.stack}</span></div>
                  <div><span className="text-cream/40 font-medium">Build timeline &amp; cost:</span> <span className="text-cream/70">{row.timeline}</span></div>
                  <div><span className="text-cream/40 font-medium">Why &quot;good enough&quot;:</span> <span className="text-cream/70">{row.why}</span></div>
                  <div><span className="text-red-300/60 font-medium">Cannot easily replicate:</span> <span className="text-cream/70">{row.cantReplicate}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['what-must-change'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">What Must Change for Disruption to Be True</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-purple-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[90px]">Mode</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Buyer Behavior / Compliance</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Workflow</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Data / Access</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Regulatory</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Frontier (Claude)</td>
                  <td className="p-2">Sites/sponsors accept AI markup from general-purpose model vs. domain-specific platform; <span className="text-yellow-300">buyer compliance/governance must permit general-purpose models in contract workflows</span></td>
                  <td className="p-2">Multi-party negotiation possible via API integration but design/workflow UX elements will be missing in generic approaches</td>
                  <td className="p-2">Generic data may be sufficient to inform CTA workflows — do not assume frontier vendors need CTA-specific training data</td>
                  <td className="p-2">None required — but trust in non-specialized tool and governance acceptance are barriers</td>
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
                <tr className="border-t-2 border-purple-500/20 bg-purple-500/5">
                  <td className="p-2 font-medium text-purple-300" colSpan={5}>
                    <span className="text-cream/90 font-semibold">What&apos;s missing from that solution?</span>
                    <span className="text-cream/60 ml-2">Frontier: domain-specific playbooks, multi-party trust, CTA schema, institutional design/UX. Veeva: clause-level AI pipeline, historical CTA corpus, neutrality. CRO: productization, multi-party openness, platform approach.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  )

  slideContentMap['build-it-today'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] mb-4">
              <thead>
                <tr className="border-b-2 border-purple-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Capability</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Replicable in 12 months?</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Primary Barrier</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Moat Durability</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">AI Contract Markup</td>
                  <td className="p-2"><span className="text-green-300">Yes</span> — basic version in days</td>
                  <td className="p-2">None for basic; pipeline quality for production-grade</td>
                  <td className="p-2 text-red-300">Low (commoditizing)</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Multi-Party Platform</td>
                  <td className="p-2"><span className="text-yellow-300">Partially</span> — tech yes, trust no</td>
                  <td className="p-2">Earned credibility with both sponsors and sites</td>
                  <td className="p-2 text-green-300">High (network effect)</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Domain Playbooks</td>
                  <td className="p-2"><span className="text-yellow-300">Partially</span> — defaults yes, institutional no</td>
                  <td className="p-2">Co-developed with Mayo, Duke — years of domain expertise</td>
                  <td className="p-2 text-green-300">High (knowledge)</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Metagreement™ Data Asset</td>
                  <td className="p-2"><span className="text-red-300">No</span></td>
                  <td className="p-2">~4,000 analyzed issue points; 100% data rights; years to accumulate</td>
                  <td className="p-2 text-green-300">Very High (data)</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Congruency Pipeline</td>
                  <td className="p-2"><span className="text-yellow-300">With significant effort</span></td>
                  <td className="p-2">500+ sub-issue orchestration across 150 playbook topics</td>
                  <td className="p-2 text-yellow-300">Medium (engineering)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border-l-4 border-purple-500">
            <p className="text-xs text-cream/70"><span className="font-medium text-purple-300">Key Takeaway:</span> Mercury&apos;s most defensible assets are the multi-party network trust and institutional credibility (Mayo Clinic). AI markup functionality in isolation is replicable in days. The combination of AI + network + domain data is the defensible moat.</p>
            <p className="text-xs text-cream/70 mt-2"><span className="font-medium text-purple-300">→ Bridge to AI Assessment:</span> Given what a well-resourced competitor <em>could</em> build, the next section assesses what Mercury <em>actually has</em> — and where the gaps and advantages sit against the replicability benchmark above.</p>
          </div>
        </div>
  )

  slideContentMap['asset-value-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Underlying Asset Value — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { asset: 'Product', score: 75, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'GREEN', bullets: ['Per management: purpose-built with mature AI pipeline — holistic markup, congruency pipeline, pre-publication reports', 'Multi-model architecture with prompt mgmt in database', 'Customers who tried generic tools returned', 'Cloud-first, serverless, graph-database-native'] },
              { asset: 'Data', score: 50, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'YELLOW', bullets: ['Per management: Neo4j graph tracks contract network, clause reuse across orgs, version history', 'Metagreement\u2122 structured extraction is live', 'Data asset compounds with each customer', 'Volume still early-stage; benchmarking requires scale'] },
              { asset: 'Channel', score: 25, donutColor: 'rgba(239, 68, 68, 0.7)', dotColor: 'red' as const, rating: 'RED', bullets: ['Florence partnership: early-stage but beneficial; 37K+ sites potential', 'Direct sales to AMCs (Mayo, Duke, Cleveland Clinic, Moffitt, UHN)', 'No dedicated sales team; CEO + CPO drive GTM at ~15 people', 'Channel access: weak/early days, which is expected given stage'] },
              { asset: 'Relationships', score: 50, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'YELLOW', bullets: ['Strong on sites: Mayo Clinic, Duke, Cleveland Clinic, Moffitt, UHN', 'Early days on sponsors: 1 sponsor (Lilly)', 'Early days on distribution: Florence partnership promising but nascent', 'Contract terms: subscription, ideally annual but may be cancelable; churn believed low; PI involvement minimal'] },
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
                  <div className="w-16 h-16 mx-auto mb-2">
                    <Doughnut data={donut.data} options={donut.options} />
                  </div>
                  <ul className="space-y-1 text-[10px] text-cream/60">
                    {a.bullets.map((b, i) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
  )

  slideContentMap['product-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
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
                <li>• <span className="text-cream/90 font-medium">Underlying dataset of ~4,000 contracts</span> enables more than UI redlining: contract benchmarking, industry standard comparisons while drafting terms, natural language access to &quot;standards&quot; vs. word-by-word diff</li>
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
                  <li>• Embeds into workflows — users become comfortable with superior design and resist change</li>
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
        </div>
  )

  slideContentMap['data-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Data Asset Strength</h2>
            <p className="text-xs text-cream/50">Evaluated against three criteria: Is the data proprietary, differentiated, and compounding?</p>
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
                  <td className="p-2 text-green-300 font-medium">High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Historical CTA negotiation outcomes</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Growing</td>
                  <td className="p-2">Captures decisions across rounds</td>
                  <td className="p-2 text-green-300 font-medium">High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Market benchmarking (clause prevalence)</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Growing</td>
                  <td className="p-2">Requires volume for significance</td>
                  <td className="p-2 text-green-300 font-medium">Very High</td>
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
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="text-[10px] uppercase tracking-wider text-green-300 mb-1">Proprietary?</h4>
              <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Partially.</span> Mercury&apos;s data comes from customer usage, not public sources (not ClinicalTrials.gov). The asset is the <em>structured clause-level extraction and negotiation outcome data</em>, which is genuinely proprietary. However, institutional playbooks are customer-contributed — Mercury curates, structures, and enhances them.</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="text-[10px] uppercase tracking-wider text-green-300 mb-1">Differentiated?</h4>
              <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Yes.</span> Historical negotiation outcomes, clause-level benchmarking across institutions, and co-developed playbooks (Mayo, Duke) are data no competitor has. This is not publicly available or scrape-able information.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="text-[10px] uppercase tracking-wider text-yellow-300 mb-1">Compounding?</h4>
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">Yes, but early-stage.</span> Each new client and negotiation adds to the corpus. Benchmarking accuracy improves with volume. This connects directly to the <em>data-flywheel</em> thesis in Phase 4 — WCG volume could accelerate compounding by an order of magnitude.</p>
            </div>
          </div>
        </div>
  )

  slideContentMap['channel-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
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
                <li>• Florence partnership is an early-stage partnership; beneficial and could deepen over time — 37K+ sites as potential distribution</li>
                <li>• <span className="text-yellow-300 font-medium">INFERENCE:</span> MAGI conference presence suggests existing commercial relationship or exploration between WCG and Mercury</li>
                <li>• Integration is early; more partnerships could emerge as Mercury gains traction</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 border-l-4 border-yellow-500/50">
              <div className="text-xs uppercase tracking-wider text-yellow-300 mb-1">Transactional vs. Embedded Relationships</div>
              <p className="text-xs text-cream/70 mb-2">Channel strength for a clinical trial services company is about <span className="text-cream/90 font-medium">switching costs and workflow embeddedness</span> — not just customer count.</p>
              <div className="grid md:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-cream/5 rounded-lg">
                  <span className="text-yellow-300 font-medium">Transactional (one-time):</span>
                  <p className="text-cream/60 mt-0.5">Conference leads, website demos, investor referrals — these generate awareness but not lock-in. Mercury&apos;s current direct sales channel is largely transactional.</p>
                </div>
                <div className="p-2 bg-cream/5 rounded-lg">
                  <span className="text-green-300 font-medium">Embedded (workflow-integrated):</span>
                  <p className="text-cream/60 mt-0.5">Florence eISF integration, Mayo Clinic co-development, institutional playbook configuration — these create switching costs. A client mid-trial cannot rip Mercury out without disrupting active negotiations.</p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 border-l-4 border-green-500/50">
              <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Replication Difficulty</div>
              <p className="text-xs text-cream/70">Florence partnership: early-stage but beneficial, unique positioning (unique but not exclusive); Mayo Clinic endorsement (very hard — years of collaboration); conference presence (moderate — any funded competitor can sponsor)</p>
            </div>
          </div>
        </div>
  )

  slideContentMap['relationship-asset'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Relationship Asset Strength</h2>
          </div>
          <div className="space-y-3 mt-4">
            {[
              { name: 'Mayo Clinic', detail: 'Product co-development; credibility; financial investor; anchor customer. Know-how agreement. Partnerships are rare and prestigious.', tag: 'Sites', replication: 'Very High' },
              { name: 'Duke University', detail: 'Side-by-side comparison with competitor resulted in Mercury win. Academic credibility; "Future of Contracts" research alignment via Special Advisor (Faculty Associate at Berkman Klein Center).', tag: 'Sites', replication: 'High' },
              { name: 'Cleveland Clinic / Moffitt / UHN', detail: 'Active customers expanding Mercury\u2019s footprint across major academic medical centers. Strong on sites — prominent AMC relationships demonstrate product-market fit.', tag: 'Sites', replication: 'High' },
              { name: 'Lilly', detail: 'Noted sponsor work. Early days on sponsors — currently the sole sponsor relationship on a project basis. Sponsor-side adoption is the next growth vector after site traction solidifies.', tag: 'Sponsors', replication: 'Medium' },
              { name: 'WCG', detail: 'CEO spoke at MAGI 2025 (WCG\u2019s conference); congruency pipeline walkthrough used WCG-relevant examples. Diligence process confirms active relationship.', tag: 'Sponsors', replication: 'N/A' },
              { name: 'Florence Healthcare', detail: 'Early-stage distribution partnership; access to 37K+ sites in 90 countries; complementary workflow (eISF \u2192 contract). Joint CFR 21 Part 11 compliance analysis. Early days on distribution — beneficial but nascent.', tag: 'Channel Partners', replication: 'Medium' },
              { name: 'Tusk Venture Partners / Relativity Founder', detail: 'Lead seed investor with regulated industry expertise. Relativity founder provides legal tech ecosystem credibility and operational mentorship.', tag: 'Channel Partners', replication: 'Medium' },
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
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Team + Operating Model — Executive Summary</h2>
            <p className="text-xs text-cream/50">Per management: ~15 people across four functional teams (development, product, support, analytics)</p>
          </div>
          <div className="space-y-3 mt-6">
            {[
              { dim: 'Key Roles Present', rating: 'MEDIUM-HIGH', why: 'CEO, CTO, CPO, Co-founder/Advisor, Special Advisor. No dedicated CRO/VP Sales or VP Engineering title, but CPO covers go-to-market and CTO directly manages engineering. Per management, company is ~15 people.' },
              { dim: 'Leveling / Seniority Fit', rating: 'HIGH', why: 'Exceptional senior leadership: CEO (DocuSign/Seal VP, Duke Law), CTO (MIT, Bank of America SVP, serial CTO), CPO (Blackstone VP, Cornell), Co-founder (Blackstone CTO). Very senior for a seed-stage company.' },
              { dim: 'Functional Representation', rating: 'MEDIUM-HIGH', why: 'Per management: four functional teams — development, product, support, and analytics. Analytics team (4 analysts + 1 director) is a distinct third pillar alongside product and engineering, handling substantive content work, prompt engineering, and customer onboarding.' },
              { dim: 'Resourcing Balance', rating: 'MEDIUM-HIGH', why: 'Weighted toward product/technology, but the analyst team provides a bridge between R&D and customer success. CEO and CPO jointly drive go-to-market. No dedicated sales org, but active customer onboarding cadence (3-5 security reviews/month suggests steady new customer flow). Functional maturity is impressive for stage — resourcing balance reflects deliberate choices rather than gaps.' },
              { dim: 'Process Maturity', rating: 'HIGH', why: 'Unusually mature for stage. Real development flywheel: balancing people/process/tech stack with explicit reinvestment in systems. Per management: weekly AI review calls; GitHub Actions CI/CD with automated vulnerability, license, and AI code review; Jira/Confluence for requirements; Figma for design. Deliberate human-in-the-loop checkpoints at staging and production.' },
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
          <div className="p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <div className="text-xs uppercase tracking-wider text-red-300 mb-2">Key Person Retention — WCG Integration Priority</div>
            <p className="text-xs text-cream/70 mb-2">The 3\u20135 roles WCG cannot afford to lose in the first 18 months post-acquisition:</p>
            <div className="grid md:grid-cols-5 gap-2">
              {[
                { role: 'CTO', risk: 'HIGH', why: 'Single point for all architecture decisions; reviews every PR; institutional AI knowledge' },
                { role: 'CEO', risk: 'HIGH', why: 'Domain thought leader; customer relationships; MAGI credibility; serial contract-AI founder' },
                { role: 'CPO', risk: 'MEDIUM', why: 'Owns product vision and GTM; customer onboarding; ex-Blackstone operational expertise' },
                { role: 'Principal Eng. ×2', risk: 'MEDIUM', why: 'Infrastructure and platform architecture; critical institutional knowledge; team cohesion anchors' },
                { role: 'Dir. Solutions', risk: 'MEDIUM', why: 'Manages analyst team — Mercury\u2019s domain knowledge capture mechanism; customer playbook translation' },
              ].map((p) => (
                <div key={p.role} className="p-2 bg-cream/5 rounded-lg text-[10px]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-cream/90 font-medium">{p.role}</span>
                    <span className={`font-mono px-1 py-0.5 rounded ${p.risk === 'HIGH' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{p.risk}</span>
                  </div>
                  <p className="text-cream/50">{p.why}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-cream/50 mt-2 italic">Retention plan should include equity/earnout provisions, role clarity under WCG structure, and protection of Mercury&apos;s operating autonomy during integration.</p>
          </div>
        </div>
  )

  slideContentMap['people-roles'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
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
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
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
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Operating Model Maturity</h2>
          </div>
          <div className="space-y-4 mt-6">
            {[
              { dim: 'AI Governance & Ownership', score: 3, label: 'Medium', obs: 'Published "Road Rules for Responsible AI" with 5 principles; all AI providers on enterprise licensing with data non-retention and non-training commitments; commitments passed through to customers in TOS. Weekly AI review calls to assess new models; model abstraction layer allows hot-swapping; tested Sonnet 4.6 within ~1 week of release; evaluations against gold-standard datasets; formal AWS agent evaluation framework planned but not yet implemented' },
              { dim: 'Selling Process for AI', score: 3, label: 'Medium', obs: 'Per management: demo-driven sales with high win rate in bake-offs against generic tools (Spot Draft, etc.); customers who tried generic tools have returned; George Washington University cited as a specific win-back' },
              { dim: 'Delivery/Support for AI', score: 3, label: 'Medium', obs: 'Per management: analyst team handles customer onboarding — translates offline playbooks to AI-optimized profiles; 3-5 security questionnaires per month (general, AI-specific, privacy); no PHI — streamlines procurement' },
              { dim: 'Measurement Discipline', score: 2, label: 'Low-Med', obs: 'Claims 50–80% reduction in negotiation time; per management, gold-standard evaluation datasets exist for prompt/model testing; no published KPI framework or formal customer success metrics' },
              { dim: 'Development Practices & AI-Assisted Engineering', score: 3.5, label: 'Med-High', obs: 'Per management: GitHub + GitHub Actions CI/CD; AWS CDK; automated vulnerability, license, code scanner, AI code review (customized Claude Code agent) on every PR; unit + integration tests; separate AWS accounts for dev/staging vs. prod; automated deploy to dev, human-approved to staging/prod. Almost all code written with AI (Cursor + Claude Code); specialized sub-agents (Cypher, Review, UI, PR Gen, Agent Builder, Red Green Refactor); CTO reviews all PRs; weekly calls to refine AI coding agent; spec + TDD first approach' },
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
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Assessment — Executive Summary</h2>
            <p className="text-xs text-cream/50">Against the &quot;build-it-today&quot; replicability benchmark, Mercury&apos;s AI portfolio shows strengths in pipeline orchestration and domain data, with commodity risk concentrated in basic markup functionality.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { dim: 'Internal Value', rating: 'HIGH', points: 'Strong investment in AI processes. Per management: AI automates first-draft review and redlining; congruency pipeline processes protocols against 6+ manuals and 500+ sub-issues. Internally, almost all code written with AI assistance; customized Claude review agent in CI/CD; AI code review on every PR. Weekly AI review calls drive continuous operational improvement.' },
              { dim: 'External Value', rating: 'HIGH', points: 'AI markup is the core value proposition. Speed-to-close is the primary selling point (50–80% reduction). Per management: customers who tried generic tools (e.g., Spot Draft) returned because the generic tool missed half the issues. Mercury has won every competitive bake-off. Holistic markup approach is a key differentiator.' },
              { dim: 'Maturity & Coverage', rating: 'HIGH', points: 'Per management: AI covers markup, comparison, compliance checking, data extraction, congruency analysis, playbook conversion, and pre-publication reporting. Multi-model architecture (Anthropic, OpenAI, Gemini) with model-per-task selection. Prompt management system stores all prompts, settings, and model assignments in database — not in code.' },
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
        </div>
  )

  slideContentMap['ai-inventory'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Inventory (What Exists)</h2>
            <p className="text-xs text-cream/50">Updated with management interview details from diligence calls</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-cream/50">
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-400" /> Shipped &amp; revenue-generating</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> Shipped, pre-revenue / in development</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-400" /> Conceptual / planned</span>
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
                { cap: 'Metagreement™ Structured Data Extraction', scope: 'External', maturity: 'Scaled', deps: 'Per management: graph database captures clause-level data; tracks clause reuse across organizations (e.g., "this clause used in 52 places")' },
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
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Architecture Snapshot + Readiness</h2>
            <p className="text-xs text-cream/50">Per management diligence calls — qualitative assessment</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">1. Can Mercury&apos;s AI run on WCG&apos;s infrastructure?</h3>
              <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Likely yes without re-platform.</span> Mercury is cloud-first serverless on AWS (CDK-managed). WCG&apos;s ClinSphere is also cloud-based. Integration is API-level, not infrastructure-level. Separate AWS accounts for dev/staging vs prod already exist.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">2. Is the data pipeline real?</h3>
              <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Yes — production ETL with Neo4j graph database.</span> Not CSV uploads. Clause-level structured data extraction (Metagreement™) is automated. Multi-model pipeline (Anthropic, OpenAI, Gemini) with prompt management stored in database, not code. Agent orchestration with isolation and observability.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">3. What&apos;s the model dependency risk?</h3>
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">Mitigated by multi-model architecture.</span> Mercury uses model-per-task selection (Anthropic, OpenAI, Gemini). Model abstraction layer allows hot-swapping — tested Sonnet 4.6 within ~1 week of release. However, no formal MLOps/monitoring system yet (agent gateway is a foundation but not formalized).</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-3">Strong</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Cloud-first serverless architecture; uses off-the-shelf hyperscale tools</li>
                <li>• Multi-model AI pipeline with prompt management stored in database</li>
                <li>• Agent orchestration with isolation, observability, and user identity passthrough</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-300 mb-3">Adequate for Stage</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Small scale currently; customer base still early</li>
                <li>• Graph database (Neo4j) well-suited for contract network data</li>
                <li>• AWS CDK enables rapid deployment; separate accounts for dev/staging vs. prod</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-red-300 mb-3">Gap for Scale</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• No dedicated ML/data science team; CTO and analysts fill this role</li>
                <li>• CTO is single review point for all architecture decisions</li>
                <li>• EU instance (EU-West-2) dormant — no European customers</li>
              </ul>
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
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
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
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">External Value Examples</h2>
            <p className="text-xs text-cream/50">These are product capabilities that generate external (revenue-driving) value</p>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                title: 'AI-Powered First-Draft Markup',
                classification: 'EXTERNAL value — pricing power (core product differentiator)',
                valueDrivers: 'Pricing Power (customers pay for this capability); Speed-to-Close (first response in minutes vs. days)',
                proof: 'Claims "first-draft AI markups in minutes." 50–80% reduction reported. No independent verification.',
                replicability: 'MEDIUM-HIGH', replicabilityNote: 'Others can build similar-looking but not equal in design/quality without dataset/pipeline',
                comparables: 'Luminance, Ironclad, Harvey, any CLM vendor adding AI',
                mercuryPosition: 'At parity on basic markup; ahead on domain-specific CTA accuracy (per bake-off wins vs. Spot Draft and generic tools). Behind on distribution vs. Ironclad/Luminance.'
              },
              {
                title: 'Metagreement™ Structured Data + Intelligence',
                classification: 'EXTERNAL value — direct revenue product',
                valueDrivers: 'Pricing Power (unique benchmarking data; industry standard comparisons); Speed-to-Close (both parties see structured data); Direct Revenue (data product potential)',
                proof: 'Product page describes feature; no independent verification of accuracy or completeness.',
                replicability: 'LOW', replicabilityNote: 'LOW replicability — needs dataset of ~4,000 contracts to compare; others cannot replicate without corpus',
                comparables: 'No direct comparable in CTA-specific structured data',
                mercuryPosition: 'Ahead — no competitor has CTA-specific structured data at clause level. Luminance has general contract analytics but not clinical trial domain depth.'
              },
              {
                title: 'Multi-Party Negotiation with AI Compliance',
                classification: 'EXTERNAL value — speed-to-close',
                valueDrivers: 'Speed-to-Close (real-time collaboration vs. serial email chains); Pricing Power (unique multi-party capability)',
                proof: 'Platform architecture described; "Negotiate Your Way" and "Stay Standards-Compliant" features.',
                replicability: 'LOW', replicabilityNote: 'Multi-party trust + neutrality + both-side adoption — deepest moat',
                comparables: 'No direct comparable; CLM tools serve one side; general collaboration lacks contract features',
                mercuryPosition: 'Ahead — unique in CTA space. CLM vendors serve one side only. Florence is complementary (eISF), not competitive on multi-party negotiation.'
              },
            ].map((ex) => (
              <div key={ex.title} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <h3 className="text-sm font-semibold text-cream mb-1">{ex.title}</h3>
                <p className="text-[10px] text-purple-300 font-medium mb-3">{ex.classification}</p>
                <div className="grid md:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-cream/40 font-medium">Value drivers:</span>
                    <p className="text-cream/70 mt-0.5">{ex.valueDrivers}</p>
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
                      ex.replicability === 'LOW' ? 'bg-green-400 w-[20%]' :
                      'bg-yellow-400 w-[55%]'
                    }`} />
                  </div>
                  <span className="text-[10px] text-cream/50">{ex.replicabilityNote}</span>
                </div>
                <p className="text-[10px] text-cream/40 mt-1">Comparables: {ex.comparables}</p>
                <p className="text-[10px] text-purple-300/80 mt-1"><span className="font-medium">Mercury vs. benchmark:</span> {ex.mercuryPosition}</p>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['internal-value-proofs'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Phase 2 — AI Initiatives & Disruption Risk</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Internal Value Proofs</h2>
            <p className="text-xs text-cream/50">Cost, Speed, Productivity — tied to CI/CD and AI-enabled engineering model</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-sage-500/10 border border-sage-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-sage-300 mb-3">Cost</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">4-person dev team</span> delivering full-platform capabilities — estimated 2\u20133x output leverage vs. non-AI-assisted team of equivalent size</li>
                <li>&bull; Almost all code written with AI assistance — reduces need for additional engineering headcount</li>
                <li>&bull; QA contractors (not FTEs) provide flexibility on testing spend</li>
              </ul>
            </div>
            <div className="p-4 bg-sage-500/10 border border-sage-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-sage-300 mb-3">Speed</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Weekly production releases;</span> staging deployments multiple times per day</li>
                <li>&bull; <span className="text-cream/90 font-medium">Model hot-swap in ~1 week:</span> tested Sonnet 4.6 within a week of release (per management)</li>
                <li>&bull; Automated deploy to dev; human-approved to staging/prod</li>
                <li>&bull; AWS CDK enables rapid infrastructure changes</li>
              </ul>
            </div>
            <div className="p-4 bg-sage-500/10 border border-sage-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-sage-300 mb-3">Productivity</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; AI-native SDLC with Claude Code as primary tool</li>
                <li>&bull; Specialized sub-agents for tasks: Cypher, Review, UI, PR Generation, Agent Builder, Red Green Refactor</li>
                <li>&bull; Customized Claude review agent in CI/CD on every PR</li>
                <li>&bull; Weekly calls to refine AI coding agent and process</li>
              </ul>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 border-l-4 border-green-500/50 mb-2">
            <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Quantified Internal Proof Points</div>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-cream/70">
              <div>&bull; <span className="text-cream/90 font-medium">CTA first-draft review:</span> Reduced from ~3 days manual to &lt;4 hours with AI (per management)</div>
              <div>&bull; <span className="text-cream/90 font-medium">Negotiation cycle time:</span> 64 days industry avg → 16 days Mercury (claimed); 15\u201318% verified in client support data</div>
              <div>&bull; <span className="text-cream/90 font-medium">AI code review catch rate:</span> Customized Claude agent reviews 100% of PRs — replaces ~1 FTE of review capacity (per management)</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70"><span className="font-medium text-sage-300">CI/CD Tie-In:</span> GitHub Actions pipeline includes automated vulnerability scanning, license checking, code scanning, and AI code review. Spec + TDD first approach ensures quality despite high velocity. The engineering model is a proof point for Mercury&apos;s AI-native operating philosophy.</p>
          </div>
        </div>
  )

  slideContentMap['ai-quantified-impact'] = (
        <div className="space-y-3 px-4">
          {/* Header */}
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-1">AI Opportunity — Quantified Impact</h2>
          </div>

          {/* Top strip — Framing statement */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/30">
            <p className="text-[11px] text-cream/80 leading-relaxed">
              Year 1 AI + synergy opportunity ranges from <span className="text-cream font-semibold">$1.5M to $3.2M</span>, with Mercury standalone AI revenue of $1.2M–$1.9M bracketing management&apos;s $1.1M target. Site platform licenses are the near-term base; the Budget add-on attach rate and WCG channel cross-sell are the two variables that determine whether Year 1 tracks to base or upside.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[9px] text-cream/40 font-mono">5-YR RAMP</span>
              <div className="flex items-center gap-1 text-[9px] text-cream/50 font-mono">
                <span className="text-cream/70">$1.1M</span>
                <span>→</span>
                <span>$3.1M</span>
                <span>→</span>
                <span>$8.9M</span>
                <span>→</span>
                <span>$21.5M</span>
                <span>→</span>
                <span className="text-sage font-semibold">$37.8M</span>
              </div>
            </div>
          </div>

          {/* Main content — Chart (left 60%) + Assumption cards (right 40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Left column — Data tables + Chart */}
            <div className="lg:col-span-3 space-y-2">
              {/* Section: Mercury AI Revenue */}
              <div className="text-[10px] uppercase tracking-wider text-sage font-semibold mt-1">Mercury AI Revenue</div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-sage/30">
                      <th className="text-left py-1 px-2 text-cream/60 font-medium">Initiative</th>
                      <th className="text-right py-1 px-2 text-cream/60 font-medium w-16">Low</th>
                      <th className="text-right py-1 px-2 text-cream/60 font-medium w-16">High</th>
                      <th className="text-left py-1 px-2 text-cream/60 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-cream/70">
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/90">Site Platform Licenses ($45K/site)</td>
                      <td className="py-1 px-2 text-right text-cream">$900K</td>
                      <td className="py-1 px-2 text-right text-cream">$1,170K</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span><span className="text-cream/50">26 customers confirmed</span></td>
                    </tr>
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/90">Budget Module Add-on ($35K/site)</td>
                      <td className="py-1 px-2 text-right text-cream">$280K</td>
                      <td className="py-1 px-2 text-right text-cream">$525K</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span><span className="text-cream/50">Pricing confirmed; attach TBD</span></td>
                    </tr>
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/90">Sponsor — Project ($175K)</td>
                      <td className="py-1 px-2 text-right text-cream">$0</td>
                      <td className="py-1 px-2 text-right text-cream">$175K</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span><span className="text-cream/50">1 in pipeline</span></td>
                    </tr>
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/70">Sponsor — Enterprise ($1–4.5M)</td>
                      <td className="py-1 px-2 text-right text-cream/40">$0</td>
                      <td className="py-1 px-2 text-right text-cream/40">$0</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></span><span className="text-cream/40">2029+ thesis</span></td>
                    </tr>
                    <tr className="border-t border-sage/30 bg-sage/5">
                      <td className="py-1.5 px-2 font-semibold text-cream">Subtotal — Mercury AI</td>
                      <td className="py-1.5 px-2 text-right font-semibold text-cream">$1,180K</td>
                      <td className="py-1.5 px-2 text-right font-semibold text-cream">$1,870K</td>
                      <td className="py-1.5 px-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section: WCG Synergies */}
              <div className="text-[10px] uppercase tracking-wider text-blue-300 font-semibold mt-2">WCG Synergies</div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <tbody className="text-cream/70">
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/90">Channel Cross-Sell (→ WCG sponsors)</td>
                      <td className="py-1 px-2 text-right text-cream w-16">$350K</td>
                      <td className="py-1 px-2 text-right text-cream w-16">$1,000K</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span><span className="text-cream/50">Needs sales enablement</span></td>
                    </tr>
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/90">ClinSphere Integration Value</td>
                      <td className="py-1 px-2 text-right text-cream">$0</td>
                      <td className="py-1 px-2 text-right text-cream">$250K</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></span><span className="text-cream/50">12–18 mo integration</span></td>
                    </tr>
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/90">Internal WCG Transformation</td>
                      <td className="py-1 px-2 text-right text-cream">$10K</td>
                      <td className="py-1 px-2 text-right text-cream">$80K</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span><span className="text-cream/50">WCG controls adoption</span></td>
                    </tr>
                    <tr className="border-b border-cream/5">
                      <td className="py-1 px-2 text-cream/70">Data Flywheel — First Turn</td>
                      <td className="py-1 px-2 text-right text-cream/40">$0</td>
                      <td className="py-1 px-2 text-right text-cream/40">$0</td>
                      <td className="py-1 px-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1"></span><span className="text-cream/40">Strategic; no Yr 1 rev</span></td>
                    </tr>
                    <tr className="border-t border-blue-400/30 bg-blue-500/5">
                      <td className="py-1.5 px-2 font-semibold text-cream">Subtotal — WCG Synergies</td>
                      <td className="py-1.5 px-2 text-right font-semibold text-cream">$360K</td>
                      <td className="py-1.5 px-2 text-right font-semibold text-cream">$1,330K</td>
                      <td className="py-1.5 px-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total row */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-cream/5 border border-cream/10 mt-1">
                <span className="text-xs font-bold text-cream">TOTAL</span>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-cream">$1,540K</span>
                  <span className="text-[10px] text-cream/40">to</span>
                  <span className="text-xs font-bold text-sage">$3,200K</span>
                </div>
              </div>

              {/* Stacked bar chart */}
              <div className="h-40 mt-1">
                <Bar data={aiImpactData} options={aiImpactOptions} />
              </div>
            </div>

            {/* Right column — 3 Assumption cards */}
            <div className="lg:col-span-2 space-y-2">
              {/* Card 1 */}
              <div className="p-3 rounded-xl border border-sage/30 bg-sage/5">
                <div className="text-[10px] uppercase tracking-wider text-sage font-semibold mb-1">1 — Site Licenses Are the Floor. Budget Attach Is the Swing.</div>
                <p className="text-[10px] text-cream/70 leading-relaxed">
                  Site platform licenses ($45K) represent 63–76% of Mercury&apos;s Year 1 AI revenue. That base is relatively de-risked with 26 confirmed customers. The Budget module add-on ($35K) is the primary swing variable: at 30% attach ($280K) vs. 58% attach ($525K), it&apos;s a <span className="text-cream font-medium">$245K delta</span>.
                </p>
                <p className="text-[10px] text-cream/50 mt-1 italic">
                  Key question: is Budget the real product and the platform is the wedge — or is Budget a nice-to-have?
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-xl border border-blue-400/30 bg-blue-500/5">
                <div className="text-[10px] uppercase tracking-wider text-blue-300 font-semibold mb-1">2 — WCG Channel Cross-Sell Is the Biggest Synergy Lever</div>
                <p className="text-[10px] text-cream/70 leading-relaxed">
                  Cross-sell through WCG&apos;s sponsor relationships accounts for $350K–$1M — roughly 75–97% of Year 1 synergy value. The range depends on WCG execution: account team training, comp alignment on Mercury deals, and sponsor product readiness.
                </p>
                <p className="text-[10px] text-cream/50 mt-1 italic">
                  This synergy needs a named owner and a 90-day plan on Day 1 post-close.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-xl border border-cream/15 bg-cream/5">
                <div className="text-[10px] uppercase tracking-wider text-cream/60 font-semibold mb-1">3 — ClinSphere + Data Flywheel Are the Deal Thesis — Not Year 1 Revenue</div>
                <p className="text-[10px] text-cream/70 leading-relaxed">
                  The strategic rationale — Mercury as the missing ClinSphere module, WCG data powering Mercury&apos;s AI — contributes <span className="text-cream font-medium">$0–$250K in Year 1</span>. Both require 12–18 months of integration. This is fine as long as the IC prices them as Year 2+ optionality, not Year 1 cash.
                </p>
                <p className="text-[10px] text-cream/50 mt-1 italic">
                  If the flywheel never turns, the AI premium in the acquisition price is not justified.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom strip — Management anchor */}
          <div className="p-3 rounded-lg bg-cream/5 border-l-4 border-sage/50">
            <div className="text-[10px] uppercase tracking-wider text-sage mb-1 font-semibold">Management Anchor</div>
            <p className="text-[10px] text-cream/70 leading-relaxed">
              Management projects <span className="text-cream font-medium">$1.1M for 2026</span>. Our standalone low estimate ($1.18M) slightly exceeds this, suggesting management may be accounting for churn, ramp timing, or pilot discounts not yet visible in diligence. Our high case ($1.87M) requires strong Budget attach + sponsor pipeline conversion. Including WCG synergies, the combined range is <span className="text-cream font-medium">1.4–2.9× management&apos;s standalone target</span> — but synergy capture requires active integration investment, not passive ownership.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[9px] text-cream/50">
              <span>Validate: (1) Budget attach rate among 26 customers</span>
              <span>|</span>
              <span>(2) WCG sponsor overlap with Mercury&apos;s target market</span>
              <span>|</span>
              <span>(3) ClinSphere integration technical feasibility</span>
            </div>
          </div>

          {/* Source notes */}
          <div className="text-[8px] text-cream/30 leading-relaxed pt-1 border-t border-cream/5">
            Sources: Site count (26 confirmed), license pricing ($45K/yr), Budget pricing ($35K/yr), sponsor project pricing ($175K) — all from management/diligence materials. Management projections: 2026/$1.1M, 2027/$3.1M, 2028/$8.9M, 2029/$21.5M, 2030/$37.8M. WCG synergy estimates: Tweed Collective outside-in analysis; marked [GAP] pending confirmation. Customer value context: site savings $10K–$23K/yr; sponsor savings $70K–$260K/trial — Mercury captures 3.5–8× in pricing.
          </div>
        </div>
  )

  slideContentMap['synergies-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Synergies — Executive Summary</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { asset: 'Data', rating: 'HIGH', direction: 'WCG \u2192 Mercury', why: 'WCG\u2019s 80K+ protocol dataset + 31TB Knowledge Base combined with Mercury\u2019s clause-level CTA data creates unprecedented insight into how contracts relate to study performance. WCG brings data via its pipeline.' },
              { asset: 'Channel', rating: 'HIGH', direction: 'WCG \u2192 Mercury', why: 'WCG supports 300K+ sites, trusted partner for 94% of FDA-approved therapies. Mercury immediately gains distribution at scale. WCG places Mercury in sites.' },
              { asset: 'Product', rating: 'HIGH', direction: 'Mercury \u2192 WCG', why: 'ClinSphere has no contract negotiation module. Mercury fills a critical gap in the "end-to-end" clinical trial platform vision. Mercury brings differentiated product.' },
              { asset: 'Relationships', rating: 'MEDIUM', direction: 'Both \u2192 Shared', why: 'WCG\u2019s sponsor relationships (top 25 buy 4+ solutions) + Mercury\u2019s site relationships (Mayo Clinic) create cross-side value. Relationship synergy is jointly built.' },
            ].map((s) => (
              <div key={s.asset} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-cream">{s.asset}</h3>
                  <RatingBadge rating={s.rating} />
                </div>
                <p className="text-[10px] text-blue-300 font-mono mb-1">{s.direction}</p>
                <p className="text-xs text-cream/60">{s.why}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50 mb-2">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Key Constraints</div>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="text-red-300 font-medium">MAJOR DILIGENCE ITEM:</span> WCG-negotiated data rights may not match Mercury requirements — data access terms, usage rights, and aggregation permissions must be specifically validated before assuming data synergy</li>
              <li>• Data rights/privacy: combining protocol + contract data requires governance, regulatory compliance, customer consent</li>
              <li>• Neutrality: Mercury&apos;s &quot;proactively neutral&quot; positioning may be challenged if owned by WCG (who serves sponsors)</li>
              <li>• Integration complexity: ClinSphere is new (2024); integration requires significant engineering</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['synergy-detail'] = (
        <div className="space-y-4 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
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
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
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
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/5 border-t-2 border-green-500 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-3">Wave 1: 0–6 months</h3>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">Mercury product rollout:</span> Push Mercury product broadly across WCG sites; identify adopters quickly</li>
                <li>• <span className="text-cream/90 font-medium">WCG site network:</span> Begin leveraging WCG site network to accelerate Mercury rollout</li>
                <li>• <span className="text-cream/90 font-medium">Clean Spirit:</span> Investigation only — assess integration feasibility and data compatibility</li>
                <li>• <span className="text-cream/90 font-medium">Florence:</span> Awareness but not the main activator; maintain existing partnership; clarify terms under WCG ownership</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/5 border-t-2 border-yellow-500 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-300 mb-3">Wave 2: 6–18 months</h3>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">Data injection:</span> Inject WCG data into Mercury workflows to up-level pipeline intelligence</li>
                <li>• <span className="text-cream/90 font-medium">Florence:</span> Becomes more active; deepen API integration (eISF → contract → compliance)</li>
                <li>• <span className="text-cream/90 font-medium">Clean Spirit:</span> Moves from investigation toward early integration planning</li>
                <li>• <span className="text-cream/90 font-medium">Site traction:</span> Roll out to 100+ sites; bundle into site enablement packages</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-500/5 border-t-2 border-purple-500 rounded-xl">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">Wave 3: 18–36 months</h3>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">Sponsor GTM:</span> Selective sponsor GTM as site traction solidifies; targeted outbound to sponsors</li>
                <li>• <span className="text-cream/90 font-medium">Product integrations:</span> Deeper product integrations; Clean Spirit more active</li>
                <li>• <span className="text-cream/90 font-medium">Data intelligence:</span> Launch predictive contracting intelligence product leveraging combined WCG + Mercury data</li>
                <li>• <span className="text-cream/90 font-medium">Network effects:</span> Sponsors and sites routinely on Mercury through WCG; flywheel active</li>
              </ul>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Wave Transition Gates</div>
            <p className="text-[10px] text-cream/50 mb-2 italic">Waves transition on milestone gates, not time gates — if a gate isn&apos;t met, the wave doesn&apos;t advance regardless of calendar.</p>
            <ul className="text-[10px] text-cream/70 space-y-1.5">
              <li><span className="text-green-300 font-medium">W1 → W2 Gate:</span> Data rights assessment complete and validated; first 10+ sites actively using Mercury via WCG channel; ClinSphere API integration spec finalized; Florence partnership terms clarified under WCG ownership</li>
              <li><span className="text-yellow-300 font-medium">W2 → W3 Gate:</span> ClinSphere platform integration live in production (not staging); first joint client using end-to-end workflow (feasibility → contract → activation); 50+ sites on Mercury; at least 1 sponsor pilot in production</li>
              <li><span className="text-purple-300 font-medium">W3 entry criteria:</span> Full organizational alignment; unified technology platform; regulatory validation complete; sponsor relationships cultivated with 3+ top-20 pharma</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['priority-initiatives'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Priority Initiatives — Assumptions + Uplift</h2>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                num: '1', title: 'Accelerate Site Start-Up: ClinSphere + Mercury Integration',
                buckets: 'Speed-to-Close, Cost',
                estCost: '$500K–$1M (6–9 month engineering integration)',
                upliftLow: '$1.5M (Year 1 — productivity gains from automating 5-day manual SLA)',
                upliftHigh: '$4M (Year 3 — at scale with 100+ sites)',
                timeline: '6–9 months to first joint client live',
                whatMustBeTrue: 'ClinSphere API integration completes on schedule; WCG data rights permit contract data flow; site adoption rate exceeds 30% of WCG-enabled sites',
                assumptions: ['# sites Buyer currently supports in study start-up', 'Current avg CTA negotiation time', 'Mercury reduces by 50–80% (public claim)', 'Each day saved = $600K–$8M (industry est.)'],
                output: 'Days saved per CTA × CTAs per year → total sponsor value → Buyer share captured'
              },
              {
                num: '2', title: 'Cross-Sell Mercury to Buyer Site Enablement Clients',
                buckets: 'Pricing Power, Productivity',
                estCost: '$200K–$400K (sales training, pricing alignment, packaging)',
                upliftLow: '$500K (Year 1 — 50 sites × ~$10K/site)',
                upliftHigh: '$3M (Year 3 — 300 sites × ~$10K/site)',
                timeline: '3–6 months to first cross-sell',
                whatMustBeTrue: 'Mercury pricing aligns with WCG site enablement packaging; neutrality perception does not impede adoption; WCG sales team trained and incentivized',
                assumptions: ['% of Buyer sites paying for enablement', 'Mercury pricing per site/year', 'Adoption rate %'],
                output: 'Incremental ARR from Mercury cross-sell; net revenue retention improvement'
              },
              {
                num: '3', title: 'Launch Contract Intelligence Data Product',
                buckets: 'Pricing Power, Speed',
                estCost: '$300K–$600K (ML model development, data infrastructure)',
                upliftLow: '$0 (Year 1 — insufficient data volume)',
                upliftHigh: '$2M (Year 3 — premium benchmarking tier)',
                timeline: '12–18 months to viable product',
                whatMustBeTrue: 'Mercury data volume reaches 10,000+ agreements for statistical significance; ML model achieves 80%+ accuracy on contract outcome prediction; sponsors willing to pay for benchmarking data',
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
                <div className="grid md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-cream/40 font-medium">Est. Cost:</span>
                    <p className="text-[10px] text-cream/70 mt-0.5">{init.estCost}</p>
                    <span className="text-[10px] text-cream/40 font-medium mt-1 block">Timeline to Value:</span>
                    <p className="text-[10px] text-cream/70 mt-0.5">{init.timeline}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-cream/40 font-medium">Uplift (Low):</span>
                    <p className="text-[10px] text-cream/70 mt-0.5">{init.upliftLow}</p>
                    <span className="text-[10px] text-cream/40 font-medium mt-1 block">Uplift (High):</span>
                    <p className="text-[10px] text-cream/70 mt-0.5">{init.upliftHigh}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-300/60 font-medium">What Needs to Be True:</span>
                    <p className="text-[10px] text-cream/60 mt-0.5">{init.whatMustBeTrue}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-cream/40 font-medium">Output Metric:</span>
                    <p className="text-[10px] text-cream/70 mt-0.5">{init.output}</p>
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
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Sensitivity: Impact on Growth Curve</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2">High Case — &quot;Network Flywheel&quot;</h3>
              <ul className="text-[10px] text-cream/70 space-y-1">
                <li>• Site base retains fully and Budget module attach rate accelerates</li>
                <li>• Sponsor pipeline converts; initial enterprise conversations begin</li>
                <li>• WCG channel cross-sell activates within the first integration phase</li>
                <li>• ClinSphere integration proceeds on fast track; joint product SKU defined early</li>
                <li>• Mercury data reaches critical mass for benchmarking differentiation</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Medium Case — &quot;Steady Build&quot;</h3>
              <ul className="text-[10px] text-cream/70 space-y-1">
                <li>• Site base holds with moderate Budget upsell traction</li>
                <li>• Sponsor revenue slips or closes at entry-level tier only</li>
                <li>• WCG cross-sell produces early wins but is integration-gated</li>
                <li>• ClinSphere integration proceeds on standard timeline; joint revenue is deferred</li>
                <li>• Data flywheel is seeded but not yet producing differentiated output</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Low Case — &quot;Integration Drag&quot;</h3>
              <ul className="text-[10px] text-cream/70 space-y-1">
                <li>• Neutrality perception slows site adoption; some existing clients churn</li>
                <li>• Budget module attach stalls as sites wait to see post-acquisition direction</li>
                <li>• Sponsor pipeline does not convert in the near term</li>
                <li>• ClinSphere integration is delayed or deprioritized; synergy value deferred</li>
                <li>• Competitive response from Veeva or similar erodes first-mover window</li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-red-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Sensitivity Axis</th>
                  <th className="text-left p-2 text-green-300 font-medium">Optimistic</th>
                  <th className="text-left p-2 text-yellow-300 font-medium">Base</th>
                  <th className="text-left p-2 text-red-300 font-medium">Pessimistic</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Site platform retention & expansion<br /><span className="text-[10px] text-cream/40">(the installed base)</span></td>
                  <td className="p-2 text-green-300">Full retention; expansion into new site networks via referrals</td>
                  <td className="p-2 text-yellow-300">Modest net growth; a few losses offset by new additions</td>
                  <td className="p-2 text-red-300">Net attrition as neutrality concerns drive departures</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Budget module attach<br /><span className="text-[10px] text-cream/40">(the upsell multiplier)</span></td>
                  <td className="p-2 text-green-300">Majority of site customers adopt; becomes the primary value driver</td>
                  <td className="p-2 text-yellow-300">Moderate attach; adoption tracks but doesn&apos;t accelerate</td>
                  <td className="p-2 text-red-300">Low attach; sites treat base contract module as sufficient</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Sponsor pipeline conversion<br /><span className="text-[10px] text-cream/40">(the growth thesis)</span></td>
                  <td className="p-2 text-green-300">Pipeline converts and opens enterprise-tier conversations</td>
                  <td className="p-2 text-yellow-300">Entry-level sponsor deal closes; enterprise remains distant</td>
                  <td className="p-2 text-red-300">Sponsor pipeline stalls; growth thesis is deferred</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">WCG channel activation<br /><span className="text-[10px] text-cream/40">(the synergy unlock)</span></td>
                  <td className="p-2 text-green-300">WCG account teams actively bundle Mercury into sponsor conversations</td>
                  <td className="p-2 text-yellow-300">Introductions happen but conversion requires Mercury-led selling</td>
                  <td className="p-2 text-red-300">Channel produces awareness but no closed deals in the near term</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">ClinSphere integration pace<br /><span className="text-[10px] text-cream/40">(the long-term compounder)</span></td>
                  <td className="p-2 text-green-300">Fast-track integration; joint product enters market quickly</td>
                  <td className="p-2 text-yellow-300">Standard integration timeline; joint revenue is a next-year story</td>
                  <td className="p-2 text-red-300">Integration delayed or deprioritized; synergy value pushed out significantly</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500/50">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-2">Assumptions the IC Will Challenge</div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: '1', title: 'Synergy capture rate', detail: 'What fraction of identified synergies will actually materialize, and how quickly? Most tech acquisitions see significant dilution from plan.' },
                { num: '2', title: 'Neutrality preservation', detail: 'Can WCG-owned Mercury maintain credibility as a neutral platform? This is the single biggest thesis risk.' },
                { num: '3', title: 'Integration timeline', detail: 'If ClinSphere integration takes longer than expected, how much synergy value is deferred or lost?' },
                { num: '4', title: 'Client retention through ownership change', detail: 'If sites perceive Mercury as compromised, does the installed base hold or erode?' },
                { num: '5', title: 'Competitive response', detail: 'Does Veeva or a similar incumbent launch a competing module within the integration window, eroding Mercury\u2019s first-mover advantage?' },
              ].map((a) => (
                <div key={a.num} className="flex items-start gap-2 text-xs">
                  <span className="text-amber-300 font-mono flex-shrink-0">{a.num}.</span>
                  <div>
                    <span className="text-cream/90 font-medium">{a.title}</span>
                    <span className="text-cream/50"> — {a.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  ) /* end sensitivity */

  /* ───────────────────────────────────────────────────────────────────
     Former appendix slides — now inlined within Phases 3 & 4
     ─────────────────────────────────────────────────────────────────── */

  slideContentMap['ctms-synergy'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-1">CTMS Synergy — Mercury as the Missing ClinSphere Module</h2>
            <p className="text-xs text-cream/50"><span className="text-cream/70 font-medium">Question:</span> Would Mercury help the WCG CTMS offering?</p>
          </div>

          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500/50 rounded-r-lg">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Thesis</div>
            <p className="text-xs text-cream/70">ClinSphere is architected as an end-to-end clinical trial platform but has a conspicuous functional gap: <span className="text-cream font-medium">no native contract negotiation or AI-powered budget development capability</span>. Mercury fills exactly this gap with an AI-powered automation layer.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">ClinSphere Module Map — Where Mercury Fits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cream/20">
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Module</th>
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Function</th>
                    <th className="text-left py-2 text-cream/60 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-cream/70">
                  <tr className="border-b border-cream/5"><td className="py-2 pr-3">eReview Manager</td><td className="py-2 pr-3">IRB submission, review, approval workflow</td><td className="py-2"><span className="text-green-400">Live</span></td></tr>
                  <tr className="border-b border-cream/5"><td className="py-2 pr-3">Total Feasibility</td><td className="py-2 pr-3">Site identification, feasibility assessment, enrollment modeling</td><td className="py-2"><span className="text-green-400">Live</span></td></tr>
                  <tr className="border-b border-cream/5"><td className="py-2 pr-3">eResearch Enterprise CTMS</td><td className="py-2 pr-3">Study management, calendar builds, milestone tracking, invoicing</td><td className="py-2"><span className="text-green-400">Live</span></td></tr>
                  <tr className="border-b border-cream/5"><td className="py-2 pr-3">Study Start-Up Services</td><td className="py-2 pr-3">Coverage analysis, budget development, contract review, CTMS builds</td><td className="py-2"><span className="text-yellow-400">Manual — 5-day TAT</span></td></tr>
                  <tr><td className="py-2 pr-3 text-amber-300 font-medium">Contract &amp; Budget AI (Mercury)</td><td className="py-2 pr-3 text-amber-300">AI-powered contract markup, budget reconciliation, market insights</td><td className="py-2"><span className="text-amber-300 font-medium">Not in ClinSphere today</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Specific Capability-to-Gap Mapping</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-cream/20">
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">ClinSphere Gap</th>
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Mercury Capability</th>
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Current State (Manual)</th>
                    <th className="text-left py-2 text-cream/60 font-medium">Integration Complexity</th>
                  </tr>
                </thead>
                <tbody className="text-cream/70">
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">AI-assisted site cost estimation</td><td className="py-1.5 pr-3">Budget module (H1 2026) — protocol-budget reconciliation</td><td className="py-1.5 pr-3">Manual by WCG analysts; 5-day SLA</td><td className="py-1.5 text-yellow-300">6\u20139 month API integration</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Contract negotiation workflow</td><td className="py-1.5 pr-3">CTA AI Markup + multi-party platform</td><td className="py-1.5 pr-3">Manual by WCG contract specialists; 5-day SLA</td><td className="py-1.5 text-yellow-300">6\u20139 month API integration</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Coverage analysis automation</td><td className="py-1.5 pr-3">Medicare Coverage Analysis (H2 2026 roadmap)</td><td className="py-1.5 pr-3">Manual by WCG compliance experts</td><td className="py-1.5 text-red-300">12\u201318 month (regulatory validation)</td></tr>
                  <tr><td className="py-1.5 pr-3">Contract-to-CTMS data handoff</td><td className="py-1.5 pr-3">Metagreement™ structured data export</td><td className="py-1.5 pr-3">Manual re-entry into eResearch CTMS</td><td className="py-1.5 text-green-300">3\u20136 month data mapping</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-cream/40 mt-2 italic">Example scenario: For a Phase III oncology trial with 200 sites, the combined ClinSphere + Mercury Budget workflow would reduce budgeting cycle time from ~5 days manual to &lt;4 hours AI-assisted, with human review for exceptions only.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-2">Facts</h3>
              <ul className="space-y-1.5 text-[11px] text-cream/70">
                <li>&bull; ClinSphere is positioned as a unified cloud platform — but contract negotiation is absent from its feature set</li>
                <li>&bull; eResearch Enterprise CTMS automates post-contract financial management, not pre-execution negotiation</li>
                <li>&bull; WCG&apos;s Site Enablement delivers contract review and budget development as manual consulting with a 5-day turnaround</li>
                <li>&bull; Over 70% of clinical trial sites report contract negotiations as a top cause of study start-up delays (per WCG data)</li>
                <li>&bull; WCG claims 40–60% faster timelines from best practices — but these are manual, not software automation</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-2">Inferences</h3>
              <ul className="space-y-1.5 text-[11px] text-cream/70">
                <li>&bull; Mercury would serve as the &quot;missing module&quot; converting manual workflows into AI-powered software within ClinSphere</li>
                <li>&bull; Creates closed-loop startup: IRB (eReview) → site selection (Total Feasibility) → contract/budget (Mercury) → activation (CTMS)</li>
                <li>&bull; Mercury&apos;s AI turnaround could substantially outperform the current 5-day manual SLA</li>
                <li>&bull; Cross-sell to ~3,400 institutional partners as a platform upgrade rather than a separate product</li>
              </ul>
            </div>
          </div>
        </div>
  )

  slideContentMap['budget-deep-dive'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-green-400 mb-2">Phase 3 — Team, Assets & Defensibility</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-1">Budget Product Deep Dive</h2>
            <p className="text-xs text-cream/50"><span className="text-cream/70 font-medium">Question:</span> Deeper dive on the new budget product from Mercury.</p>
            <p className="text-[10px] text-cream/40 mt-1 italic">Budget receives a dedicated deep dive because it is Mercury&apos;s largest near-term revenue expansion vector and the primary synergy point with WCG&apos;s ClinSphere Study Start-Up Services, which currently delivers budget development manually with a 5-day SLA.</p>
          </div>

          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500/50 rounded-r-lg">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Thesis</div>
            <p className="text-xs text-cream/70">Mercury is extending its proven contract AI capabilities into budgets, coverage analysis, and protocol extraction. This phased roadmap through 2027 significantly expands Mercury&apos;s TAM by addressing adjacent study startup workflows with the <span className="text-cream font-medium">same buyer persona</span> and the <span className="text-cream font-medium">same underlying AI engine</span>.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Product Roadmap: Budgets &amp; Coverage Analysis</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="text-[10px] font-mono text-green-400 mb-2">H1 2026 — In Staging</div>
                <ul className="space-y-1.5 text-[11px] text-cream/70">
                  <li>&bull; <span className="text-cream/90 font-medium">Protocol-Budget Reconciliation:</span> Automated mapping and gap analysis between protocol and proposed budget</li>
                  <li>&bull; <span className="text-cream/90 font-medium">Variance Highlighting:</span> Identifies missing, mispriced, or misaligned line items vs. rate cards and market norms</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="text-[10px] font-mono text-yellow-400 mb-2">H2 2026</div>
                <ul className="space-y-1.5 text-[11px] text-cream/70">
                  <li>&bull; <span className="text-cream/90 font-medium">Internal Site Budget Builder:</span> Sites build their own budgets — moves Mercury from review-only to authoring</li>
                  <li>&bull; <span className="text-cream/90 font-medium">Rate Card Comparison:</span> Sponsor rates vs. institutional benchmarks</li>
                  <li>&bull; <span className="text-cream/90 font-medium">Medicare Coverage Analysis:</span> Automated analysis per NCD 310.1 — compliance-critical</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] font-mono text-blue-400 mb-2">2027</div>
                <ul className="space-y-1.5 text-[11px] text-cream/70">
                  <li>&bull; <span className="text-cream/90 font-medium">Margin Calculation:</span> Automated margin analysis — first direct financial optimization tool for sites</li>
                  <li>&bull; <span className="text-cream/90 font-medium">Amendment Handling:</span> Budget impact analysis when protocols are amended mid-study ($7–8B annual spend per Tufts CSDD)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Contracts Roadmap (Maturity Reference)</h3>
            <div className="grid md:grid-cols-3 gap-3 text-[11px] text-cream/70">
              <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="text-[10px] font-mono text-cream/40 mb-1">H1 2026</div>
                <p>Skills for Single Agreement Chat — enhanced AI for plain-language questions grounded in the CTA</p>
              </div>
              <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="text-[10px] font-mono text-cream/40 mb-1">H2 2026</div>
                <p>Amendment Workflow; Multi-Round Negotiation; Profile &amp; Template Management</p>
              </div>
              <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="text-[10px] font-mono text-cream/40 mb-1">2027</div>
                <p>Self-Learning Site Playbooks; Advanced Analytics &amp; Insights</p>
              </div>
            </div>
          </div>

          <div>
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">Inferences</h3>
              <ul className="space-y-1 text-[10px] text-cream/60">
                <li>&bull; Budget product at maturity could roughly double Mercury&apos;s addressable surface per site customer</li>
                <li>&bull; Same-buyer-persona advantage enables land-and-expand from contracts → budgets → coverage analysis</li>
                <li>&bull; Medicare Coverage Analysis (H2 2026) is a natural integration point with WCG&apos;s coverage consulting</li>
                <li>&bull; 2027 Margin Calculation shifts Mercury from compliance/efficiency to financial optimization — commands higher willingness to pay</li>
              </ul>
            </div>
          </div>
        </div>
  )

  slideContentMap['internal-transformation'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-1">Internal WCG Transformation Opportunity</h2>
            <p className="text-xs text-cream/50"><span className="text-cream/70 font-medium">Question:</span> How could Mercury&apos;s technology help transform WCG&apos;s internal operations?</p>
          </div>

          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500/50 rounded-r-lg">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Thesis</div>
            <p className="text-xs text-cream/70">Mercury&apos;s technology represents a potential <span className="text-cream font-medium">internal transformation engine</span> for WCG&apos;s own manual contract, budget, and protocol abstraction operations across ~3,400 institutional partners — reducing cost-to-serve, improving turnaround, and repositioning services as AI-augmented.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">WCG&apos;s Current Manual Operations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cream/20">
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Service</th>
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Current Delivery</th>
                    <th className="text-left py-2 text-cream/60 font-medium">SLA</th>
                  </tr>
                </thead>
                <tbody className="text-cream/70">
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Contract Review &amp; Redline</td><td className="py-1.5 pr-3">Manual — expert negotiators</td><td className="py-1.5">5-day</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Budget Development</td><td className="py-1.5 pr-3">Manual — analysts build and negotiate</td><td className="py-1.5">5-day</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Coverage Analysis</td><td className="py-1.5 pr-3">Manual — compliance experts</td><td className="py-1.5">5-day</td></tr>
                  <tr><td className="py-1.5 pr-3">CTMS Calendar/Study Build</td><td className="py-1.5 pr-3">Manual — specialists configure CTMS</td><td className="py-1.5">5-day</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-cream/40 mt-2 italic">Per management: WCG has &quot;an entire business dedicated to negotiating contracts and budgets and abstracting protocols — all manual.&quot; The CEO characterized this business as one that &quot;will be disrupted massively.&quot;</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Three Transformation Lanes</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">Lane 1</span>
                  <h4 className="text-xs font-semibold text-cream">Contract &amp; Budget Automation</h4>
                </div>
                <ul className="space-y-1 text-[10px] text-cream/60">
                  <li>&bull; Mercury&apos;s congruency engine automates the core work Site Enablement performs manually</li>
                  <li>&bull; Budget capabilities (H1 2026 roadmap) map directly to manual budget development</li>
                  <li>&bull; <span className="text-green-300/80">Impact:</span> Compress 5-day turnaround to hours; redeploy experts to complex/exception cases</li>
                </ul>
              </div>
              <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">Lane 2</span>
                  <h4 className="text-xs font-semibold text-cream">Protocol &amp; Coverage Analysis</h4>
                </div>
                <ul className="space-y-1 text-[10px] text-cream/60">
                  <li>&bull; Protocol extraction features support WCG&apos;s 360 Protocol Assessment service</li>
                  <li>&bull; Medicare Coverage Analysis (H2 2026) directly automates WCG&apos;s compliance consulting</li>
                  <li>&bull; <span className="text-green-300/80">Impact:</span> Automate routine determinations; flag edge cases for human review</li>
                </ul>
              </div>
              <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">Lane 3</span>
                  <h4 className="text-xs font-semibold text-cream">Market Intelligence</h4>
                </div>
                <ul className="space-y-1 text-[10px] text-cream/60">
                  <li>&bull; Mercury&apos;s benchmarking data — expanded by WCG&apos;s network volume — becomes the data backbone for consulting</li>
                  <li>&bull; WCG already performs benchmarking in other areas; Mercury extends to contract/budget intelligence</li>
                  <li>&bull; <span className="text-green-300/80">Impact:</span> Transform periodic reports to real-time, data-driven recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">Inferences</h3>
              <ul className="space-y-1 text-[10px] text-cream/60">
                <li>&bull; Internal transformation may be as compelling as external product synergy — Mercury automates WCG&apos;s own operations</li>
                <li>&bull; Phased approach: copilot (0–6 mo) → autonomous routine handling (6–18 mo) → strategic relationship focus (18+ mo)</li>
                <li>&bull; WCG currently only uses Microsoft Copilot internally — CEO views this as insufficient</li>
              </ul>
            </div>
          </div>
        </div>
  )

  slideContentMap['build-vs-buy'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-1">Build vs. Buy — Cost to Replicate</h2>
            <p className="text-xs text-cream/50"><span className="text-cream/70 font-medium">Question:</span> How long would it take to hire the Mercury team, and what would it cost?</p>
          </div>

          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500/50 rounded-r-lg">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Thesis</div>
            <p className="text-xs text-cream/70">Replicating Mercury&apos;s specialized team would cost an estimated <span className="text-cream font-medium">$2.6M–$4.0M in Year 1</span> and take <span className="text-cream font-medium">12–18+ months</span> of recruiting. The build option also forfeits the existing data asset, customer relationships, and 2.5+ years of team cohesion.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl text-center">
              <div className="text-[10px] text-cream/40 uppercase tracking-wider mb-1">Cost to Build Equivalent</div>
              <div className="text-lg font-serif text-cream">$2.6M–$4.0M</div>
              <p className="text-[10px] text-cream/50 mt-1">Team of 10\u201311 roles, loaded cost + 20% recruiting fees</p>
            </div>
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl text-center">
              <div className="text-[10px] text-cream/40 uppercase tracking-wider mb-1">Time to Market if Built</div>
              <div className="text-lg font-serif text-cream">18–24 months</div>
              <p className="text-[10px] text-cream/50 mt-1">12\u201318 months recruiting + 6\u201312 months to production-grade</p>
            </div>
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl text-center">
              <div className="text-[10px] text-cream/40 uppercase tracking-wider mb-1">Probability of Successful Build</div>
              <div className="text-lg font-serif text-red-300">Low</div>
              <p className="text-[10px] text-cream/50 mt-1">Most internal AI builds in regulated industries take 2\u20133x longer than planned. Domain expertise cannot be hired off the shelf.</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Leadership Tier — Irreplaceable Domain Founders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-cream/20">
                    <th className="text-left py-2 pr-2 text-cream/60 font-medium">Role</th>
                    <th className="text-left py-2 pr-2 text-cream/60 font-medium">Profile</th>
                    <th className="text-left py-2 pr-2 text-cream/60 font-medium">Est. Comp</th>
                    <th className="text-left py-2 text-cream/60 font-medium">Timeline</th>
                  </tr>
                </thead>
                <tbody className="text-cream/70">
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-2 font-medium text-cream/90">CEO</td><td className="py-1.5 pr-2">Serial contract-AI entrepreneur; DocuSign + Seal Software; MAGI thought leader</td><td className="py-1.5 pr-2">$400K–$550K</td><td className="py-1.5 text-red-300">Not replaceable</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-2 font-medium text-cream/90">CTO</td><td className="py-1.5 pr-2">MIT-trained; manages all engineering; key-person risk flagged</td><td className="py-1.5 pr-2">$300K–$450K</td><td className="py-1.5">6–12 months</td></tr>
                  <tr><td className="py-1.5 pr-2 font-medium text-cream/90">CPO</td><td className="py-1.5 pr-2">Ex-Blackstone Innovations; owns product vision and GTM</td><td className="py-1.5 pr-2">$250K–$375K</td><td className="py-1.5">6–9 months</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Engineering &amp; Operations Tier</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-cream/20">
                    <th className="text-left py-2 pr-2 text-cream/60 font-medium">Role</th>
                    <th className="text-left py-2 pr-2 text-cream/60 font-medium">Est. Comp</th>
                    <th className="text-left py-2 text-cream/60 font-medium">Timeline</th>
                  </tr>
                </thead>
                <tbody className="text-cream/70">
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-2">Principal Engineer ×2</td><td className="py-1.5 pr-2">$250K–$325K each</td><td className="py-1.5">4–8 months</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-2">Mid-Senior Engineer ×2</td><td className="py-1.5 pr-2">$175K–$250K each</td><td className="py-1.5">3–6 months</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-2">Product Team (~2)</td><td className="py-1.5 pr-2">$150K–$225K each</td><td className="py-1.5">3–6 months</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-2">Support Team (~1–2)</td><td className="py-1.5 pr-2">$100K–$150K each</td><td className="py-1.5">2–4 months</td></tr>
                  <tr><td className="py-1.5 pr-2">Analytics (~1)</td><td className="py-1.5 pr-2">$150K–$200K</td><td className="py-1.5">3–6 months</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3">Cost Framework Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-cream/20">
                      <th className="text-left py-1.5 pr-3 text-cream/60 font-medium">Component</th>
                      <th className="text-left py-1.5 pr-3 text-cream/60 font-medium">Low</th>
                      <th className="text-left py-1.5 text-cream/60 font-medium">High</th>
                    </tr>
                  </thead>
                  <tbody className="text-cream/70">
                    <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Annual compensation (all ~10–11 roles)</td><td className="py-1.5 pr-3">$2.2M</td><td className="py-1.5">$3.3M</td></tr>
                    <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Recruiting fees (20%)</td><td className="py-1.5 pr-3">$440K</td><td className="py-1.5">$660K</td></tr>
                    <tr className="border-b border-cream/5"><td className="py-1.5 pr-3 font-medium text-cream">Total Year-1 build cost</td><td className="py-1.5 pr-3 font-medium text-cream">~$2.6M</td><td className="py-1.5 font-medium text-cream">~$4.0M</td></tr>
                    <tr><td className="py-1.5 pr-3">Time to assemble</td><td className="py-1.5 pr-3">12 months</td><td className="py-1.5">18+ months</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">What Build Does NOT Get You</h3>
              <ul className="space-y-1.5 text-[10px] text-cream/60">
                <li>&bull; <span className="text-cream/80 font-medium">Data asset:</span> ~4,000 analyzed issue points + ~2,000× growth; took years to accumulate with institutional data-sharing agreements</li>
                <li>&bull; <span className="text-cream/80 font-medium">100% data rights:</span> Every customer signed market insights provisions — rebuilding from scratch would take years</li>
                <li>&bull; <span className="text-cream/80 font-medium">Customer relationships:</span> 22+ sites including Mayo, Cleveland Clinic, Duke, Mount Sinai, City of Hope, Boston Children&apos;s</li>
                <li>&bull; <span className="text-cream/80 font-medium">Team cohesion:</span> Zero attrition in 2.5+ years — you cannot recruit team chemistry</li>
                <li>&bull; <span className="text-cream/80 font-medium">Florence pipeline:</span> ~50% of pipeline through Florence Healthcare partnership — does not transfer with hires</li>
              </ul>
            </div>
          </div>
        </div>
  )

  slideContentMap['data-flywheel'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Phase 4 — ROI Quantification & Synergy Roadmap</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-1">WCG Data Flywheel</h2>
            <p className="text-xs text-cream/50"><span className="text-cream/70 font-medium">Question:</span> How will WCG&apos;s data assets create more differentiation for Mercury when combined?</p>
          </div>

          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500/50 rounded-r-lg">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Thesis</div>
            <p className="text-xs text-cream/70">Mercury&apos;s ~4,000 analyzed issue points are the <span className="text-cream font-medium">seed corpus</span> for an AI-driven benchmarking engine. WCG&apos;s network would dramatically expand this — potentially by an order of magnitude within 12–18 months — creating a <span className="text-cream font-medium">self-reinforcing data flywheel</span> that becomes the industry standard for clinical trial contract and budget benchmarking.</p>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="text-xs uppercase tracking-wider text-green-300 mb-2">First Turn of the Flywheel — Concrete Example</div>
            <p className="text-xs text-cream/70"><span className="text-cream/90 font-medium">Input:</span> WCG feeds its historical IRB review data (80K+ protocols, 31TB Knowledge Base) into Mercury&apos;s congruency pipeline. This is the first data asset WCG has that Mercury currently lacks.</p>
            <p className="text-xs text-cream/70 mt-1"><span className="text-cream/90 font-medium">Output:</span> Mercury&apos;s AI can now predict protocol amendment risk based on IRB review patterns — e.g., &quot;protocols with X characteristic have a Y% likelihood of triggering a budget renegotiation within 6 months.&quot; This is a novel insight neither company can produce alone.</p>
            <p className="text-xs text-cream/70 mt-1"><span className="text-cream/90 font-medium">Flywheel effect:</span> Sites that see amendment risk predictions close contracts faster → faster closings generate more data → more data improves predictions → attracting more sites.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">Mercury Standalone (Today)</h3>
              <ul className="space-y-1 text-[10px] text-cream/60">
                <li>&bull; ~4,000 analyzed issue points (seed from Mayo, Duke, UHN)</li>
                <li>&bull; ~2,000× more contract data flowing through platform</li>
                <li>&bull; 100% customer data rights — no opt-outs</li>
                <li>&bull; 22+ active sites; targeting 50+ standalone this year</li>
              </ul>
            </div>
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">WCG Volume Multiplier</h3>
              <ul className="space-y-1 text-[10px] text-cream/60">
                <li>&bull; 3,400+ institutional partners; 140,000+ PIs globally</li>
                <li>&bull; 3,000+ new protocols reviewed annually</li>
                <li>&bull; 58,000+ ethical reviews performed (cumulative)</li>
                <li>&bull; ~2,000–5,000 estimated negotiation events per year</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Flywheel Mechanics</h3>
            <div className="grid md:grid-cols-4 gap-2">
              {[
                { stage: '1', timeline: '0–6 mo', title: 'Data Ingestion', desc: 'WCG routes negotiation volume through Mercury. Capturing a fraction of ~2,000–5,000 annual events would multiply data asset 5–10× in year one.' },
                { stage: '2', timeline: '6–12 mo', title: 'Insights Enrichment', desc: 'Statistically robust insights across agreement types, sponsor-site pairings, therapeutic areas, and geographies. Novel benchmarking products become viable.' },
                { stage: '3', timeline: '12–24 mo', title: 'Industry Benchmark', desc: 'Mercury\'s data becomes the de facto industry reference. WCG extends existing benchmarking brand to contract/budget intelligence. Competitors cannot replicate without equivalent scale.' },
                { stage: '4', timeline: '24+ mo', title: 'Network Lock-In', desc: 'Sites relying on benchmarking data are unlikely to switch. Sponsors engage because Mercury-equipped sites close faster. Classic two-sided network effect.' },
              ].map((s) => (
                <div key={s.stage} className="p-3 bg-white/5 border border-cream/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">{s.stage}</span>
                    <span className="text-[10px] text-cream/40 font-mono">{s.timeline}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-cream mb-1">{s.title}</h4>
                  <p className="text-[10px] text-cream/60">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Data Before &amp; After WCG</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-cream/20">
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Dimension</th>
                    <th className="text-left py-2 pr-3 text-cream/60 font-medium">Mercury Standalone</th>
                    <th className="text-left py-2 text-cream/60 font-medium">Mercury + WCG (18 mo)</th>
                  </tr>
                </thead>
                <tbody className="text-cream/70">
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Contract data points</td><td className="py-1.5 pr-3">~4,000 issue points + 2,000× growth</td><td className="py-1.5 text-green-300">50,000–100,000+ issue points</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Agreement types</td><td className="py-1.5 pr-3">Primarily CTAs</td><td className="py-1.5 text-green-300">CTAs + budgets + consent + amendments</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Site coverage</td><td className="py-1.5 pr-3">22 sites (mostly AMCs)</td><td className="py-1.5 text-green-300">100+ sites; access to 3,400+ institutions</td></tr>
                  <tr className="border-b border-cream/5"><td className="py-1.5 pr-3">Sponsor visibility</td><td className="py-1.5 pr-3">Major sponsors via site contracts</td><td className="py-1.5 text-green-300">Comprehensive via 5,000+ relationships</td></tr>
                  <tr><td className="py-1.5 pr-3">Benchmarking credibility</td><td className="py-1.5 pr-3">Emerging — strong early data</td><td className="py-1.5 text-green-300">Industry standard — statistically robust</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="p-3 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-xs font-semibold text-cream mb-2">Inferences</h3>
              <ul className="space-y-1 text-[10px] text-cream/60">
                <li>&bull; At scale, the data asset could become <span className="text-cream/80 font-medium">as or more valuable than the software platform itself</span></li>
                <li>&bull; WCG&apos;s benchmarking brand and industry relationships provide credibility and distribution</li>
                <li>&bull; More data → better congruency scores → better outcomes → more adoption → more data</li>
                <li>&bull; Competitors would need equivalent network coverage — a multi-year, capital-intensive effort</li>
              </ul>
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
