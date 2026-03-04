'use client'

/**
 * ApolloDiligenceSlide Slide Renderer
 *
 * Renders individual slides for the Apollo due diligence document.
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

// Site network growth chart data
const siteGrowthData = {
  labels: ['May 2021', 'Jun 2022', 'Nov 2023', 'Sep 2025', 'Oct 2025'],
  datasets: [{
    label: 'Connected Study Sites (thousands)',
    data: [8.5, 10, 18, 37, 65],
    backgroundColor: ['rgba(74, 93, 76, 0.6)', 'rgba(74, 93, 76, 0.65)', 'rgba(74, 93, 76, 0.7)', 'rgba(74, 93, 76, 0.8)', 'rgba(107, 142, 111, 0.9)'],
    borderColor: 'rgba(107, 142, 111, 1)',
    borderWidth: 1,
    borderRadius: 4,
  }],
}

const siteGrowthOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) => `${ctx.parsed?.y ?? 0}K sites`,
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
      ticks: { color: 'rgba(245, 244, 240, 0.4)', font: { size: 10 }, callback: (v: any) => `${v}K` },
      grid: { color: 'rgba(245, 244, 240, 0.05)' },
      border: { display: false },
      beginAtZero: true,
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
                <li>• Connected site network expansion (65K+ sites, 600+ sponsors, 90+ countries)</li>
                <li>• Multi-product platform upsell: eBinders → SiteLink → eTMF → eConsent</li>
                <li>• AI-augmented workflow modules entering market</li>
                <li>• ICH E6 R3 regulatory tailwinds pushing digitization</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">AI Opportunities</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• AI-driven site identification and feasibility scoring across 65K+ profiles</li>
                <li>• Generative AI contract redlining for study startup</li>
                <li>• AI-powered risk monitoring and audit-trail analytics</li>
                <li>• Sponsor-side operational intelligence from aggregated data</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Target className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Alignment</h3>
              <RatingBadge rating="HIGH" size="lg" />
              <p className="text-xs text-cream/70 mt-2">Apollo&apos;s AI roadmap directly targets the two largest time sinks in clinical trials — study startup and ongoing monitoring. AI modules announced Sept 2025, full availability Dec 2025.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Macros</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Clinical trial complexity increasing; site burden rising</li>
                <li>• Regulatory push toward decentralized trials post-COVID</li>
                <li>• Veeva SiteVault&apos;s free eISF creating pricing pressure</li>
                <li>• PE consolidation across clinical trial technology</li>
              </ul>
            </div>
          </div>
          <GapCallout gapCount={5}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What is Apollo&apos;s current ARR and growth rate? <GapTag /> No public revenue disclosures beyond 2019 ~$2M</li>
              <li>• Conversion rate from free StudyOrganizer users to paid eBinders? <GapTag /></li>
              <li>• Of 65K &quot;connected&quot; sites, how many are active paying users vs. sponsor-deployed? <GapTag /></li>
              <li>• Revenue split between site-facing vs. sponsor-facing products? <GapTag /></li>
              <li>• Competitive impact of Veeva SiteVault&apos;s free eISF on acquisition costs and churn? <GapTag /></li>
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
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-sage-300" /> Site Network Growth</h3>
              <div className="h-44 mb-4">
                <Bar data={siteGrowthData} options={siteGrowthOptions} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Total Funding', val: '$116M', sub: 'Seed–C-1' },
                  { label: 'Revenue (Last Disclosed)', val: '~$2M', sub: '2019' },
                  { label: 'Enterprise Value', val: '~$400M', sub: 'Est.' },
                  { label: 'Sponsors', val: '600+', sub: 'Oct 2025' },
                  { label: 'Monthly Workflows', val: '7.2M', sub: 'Current' },
                  { label: 'Remote Monitoring', val: '5.8M/mo', sub: 'Current' },
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
                  'Site network growth must continue: sponsor-driven deployments pulling in new sites at scale',
                  'Multi-product attach rate must increase: eBinders users upgrading to SiteLink, eTMF, eConsent',
                  'AI features must prove value and command premium pricing (features are <6 months old)',
                  'Retention must hold against Veeva\u2019s free SiteVault eISF offering',
                  'Sponsor-side revenue must scale faster than site-side revenue (higher ACV, stickier)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                    <ArrowRight className="w-3 h-3 text-sage-300 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mt-4">
                  <p className="text-xs text-yellow-200"><span className="font-medium">INFERENCE:</span> Revenue likely well above $2M today given 7–8× site growth since 2019, multi-product expansion, and $116M fundraising — but exact figure is a <GapTag />.</p>
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
                  <th className="text-left p-2 text-cream/80 font-medium">eBinders (Sites)</th>
                  <th className="text-left p-2 text-cream/80 font-medium">SiteLink (Sponsors)</th>
                  <th className="text-left p-2 text-cream/80 font-medium">eTMF</th>
                  <th className="text-left p-2 text-cream/80 font-medium">eConsent</th>
                  <th className="text-left p-2 text-cream/80 font-medium">AI Workflows</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">New Logo — Sites</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: #1 rated; free funnel</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: via sponsor</td>
                  <td className="p-2 text-cream/40">Weak</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: AI feasibility attracts sites</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">New Logo — Sponsors</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: network is draw</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: remote monitoring</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span></td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: site ID, redlining</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Expansion Revenue</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: more sites/study</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: upsell</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: upsell</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: premium AI tier</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Retention</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: compliance lock-in</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: cross-site dep.</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: regulatory record</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span></td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Partial</span>: too early</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Pricing Power</td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Moderate</span>: Veeva pressure</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: no free competitor</td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span></td>
                  <td className="p-2"><span className="text-yellow-300 font-medium">Moderate</span></td>
                  <td className="p-2"><span className="text-green-300 font-medium">Strong</span>: no direct competitor</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70">SiteLink and eTMF directly influence sponsor revenue lines. AI workflows positioned to influence both new logo acquisition (site ID/feasibility) and expansion (premium tier). eBinders is the gateway product driving site-level retention.</p>
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
            {/* Left: AI Roadmap Themes */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-sage-300 mb-2">AI Roadmap Themes</h3>
              {[
                { id: 'T1', title: 'Site Identification & Feasibility', desc: 'AI-powered search across 65K+ site profiles' },
                { id: 'T2', title: 'Study Start-Up Automation', desc: 'AI contract redlining; automated document exchange' },
                { id: 'T3', title: 'Study Conduct & Remote Monitoring', desc: 'AI risk reporting from audit trails' },
                { id: 'T4', title: 'Network Intelligence', desc: 'Aggregated site performance data powering recommendations' },
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
            {/* Center: Arrows */}
            <div className="hidden md:flex flex-col items-center justify-center gap-3 pt-8">
              {['T1→R1,R2', 'T2→R1,R4', 'T3→R3,R4', 'T4→R2,R4'].map((conn, i) => (
                <div key={i} className="text-[10px] font-mono text-cream/30 bg-cream/5 px-2 py-1 rounded">
                  {conn}
                </div>
              ))}
            </div>
            {/* Right: Growth Requirements */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-purple-300 mb-2">Growth Requirements</h3>
              {[
                { id: 'R1', title: 'Faster study startup', desc: 'Reduce time-to-first-patient' },
                { id: 'R2', title: 'Increased sponsor adoption', desc: 'More sponsors deploying Apollo' },
                { id: 'R3', title: 'Higher site retention', desc: 'More workflows per site' },
                { id: 'R4', title: 'Premium pricing power', desc: 'Differentiated capabilities' },
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
              <li>• No publicly announced AI for participant recruitment optimization (contrast with Buyer Total Enrollment)</li>
              <li>• No publicly announced AI for protocol optimization or amendment prediction (contrast with Buyer Trial IntelX)</li>
              <li>• No publicly announced AI for diversity/equity in site or participant selection</li>
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
              <h3 className="text-sm font-semibold text-green-300 mb-2">Platform Flywheel Accelerates</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> AI workflows drive measurable startup time reduction; sponsors adopt Apollo as default site enablement layer; site network crosses 100K with strong retention</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> AI adoption &gt;30% in year one; sponsor NPS increasing; site churn &lt;5%</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Apollo becomes system-of-record; commands premium pricing; strong exit position</div>
              </div>
            </div>
            <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <Target className="w-6 h-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Steady Growth, Competitive Pressure</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> AI delivers moderate value but faces adoption friction; Veeva SiteVault erodes site-level pricing; growth primarily through sponsor-side products</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Site-level revenue flat; sponsor-side 20–30% growth; AI adoption &lt;15%</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Apollo remains strong niche player but needs acquisition partner for broader capabilities; valuation growth slows</div>
              </div>
            </div>
            <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
              <h3 className="text-sm font-semibold text-red-300 mb-2">Disruption Bites</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> Veeva bundles free eISF with paid Vault CTMS/eTMF; frontier AI models enable lightweight tools; site network advantage erodes</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Site growth stalling; Veeva SiteVault crosses 30K sites; LLM contract tools commoditize</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Apollo&apos;s value declines; acquisition becomes necessity; data asset remains valuable but product moat weakens</div>
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
              <p className="text-xs text-cream/70">Major cloud/AI players (OpenAI, Google, AWS) could enable sponsors or CROs to build document workflow tools rapidly using commercial LLMs. Risk is indirect — they enable disruptors rather than competing directly. GxP validation and regulatory compliance remain significant barriers.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Competitors</h3>
                <RatingBadge rating="MEDIUM-HIGH" />
              </div>
              <p className="text-xs text-cream/70">Veeva SiteVault is the most direct threat — free eISF undercutting Apollo&apos;s core eBinders product. Veeva&apos;s massive sponsor-side installed base (200+ sponsors, 12 of top 20 pharma) creates powerful bundling advantage. Oracle, Medidata, IQVIA have adjacent capabilities.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Package className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Niche / Lightweight</h3>
                <RatingBadge rating="LOW-MEDIUM" />
              </div>
              <p className="text-xs text-cream/70">Several smaller competitors (TrialKit, Longboat, Complion) but none have Apollo&apos;s network scale. Greater risk from sponsor-built internal tools or CRO-specific platforms that bypass third-party site enablement entirely.</p>
            </div>
          </div>
          <GapCallout gapCount={4}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What is Veeva SiteVault&apos;s current site count and growth trajectory vs. Apollo? <GapTag /></li>
              <li>• Are any major CROs building proprietary site enablement platforms? <GapTag /></li>
              <li>• How quickly could a frontier AI model + low-code platform replicate Apollo&apos;s document management? <GapTag /></li>
              <li>• What is the switching cost for sites currently on Apollo eBinders? <GapTag /></li>
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
                  { name: 'Veeva Systems + AI Layer', rtw: '200+ sponsor relationships via Vault eTMF; free SiteVault removes cost barrier; could layer AI on massive cross-sponsor dataset', must: 'Must invest in bidirectional sponsor↔site connectivity; overcome perception as sponsor-centric at sites' },
                  { name: 'Large CRO Internal Build (IQVIA, Parexel)', rtw: 'Direct sponsor relationships; large CRA workforces as end-users; access to operational data', must: 'Must productize internal tool; achieve GxP-validated platform compliance' },
                ]
              },
              {
                mode: 'Competitors',
                color: 'border-yellow-500/40',
                items: [
                  { name: 'Veeva SiteVault', rtw: 'Free eISF targeting Apollo\u2019s core market; monetize via SiteVault Enterprise + sponsor-side Vault', must: 'Most direct threat — strategy: free base + premium upsell' },
                  { name: 'Medidata (Dassault)', rtw: 'Rave platform has broad clinical trial capabilities', must: 'Could extend into site enablement via acquisition or build' },
                ]
              },
              {
                mode: 'Niche / Lightweight',
                color: 'border-cream/20',
                items: [
                  { name: 'TrialKit', rtw: 'Cloud-based, mobile-first CTMS with AI-powered reporting; 2024 SCDM Innovation Award', must: 'Much smaller scale' },
                  { name: 'Sponsor-built LLM Tools', rtw: 'Large pharma could use off-the-shelf LLM APIs for document review, contract redlining', must: 'Bypasses Apollo for internal operations' },
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
                mode: 'Frontier / Veeva',
                concept: 'Integrated sponsor-to-site platform combining free eISF with AI-powered document exchange, monitoring, and feasibility',
                functions: 'Electronic binder management, remote SDV, document exchange, AI feasibility, automated TMF reconciliation',
                position: 'Between sponsor eTMF and site ISF — the exact position Apollo occupies',
                why: 'Free base tier removes cost objection; existing sponsor relationships create pull-through; regulatory compliance established'
              },
              {
                mode: 'Competitors / CRO Build',
                concept: 'CRO-specific operational platform integrating site selection, monitoring, and document management',
                functions: 'Site performance scoring, CRA workflow management, integrated document exchange, monitoring optimization',
                position: 'Embedded within CRO operational workflow, bypassing third-party site enablement',
                why: 'CRO has direct implementation control; data stays within ecosystem; customized to CRO processes'
              },
              {
                mode: 'Niche / LLM-Based Build',
                concept: 'Lightweight document management + AI contract redlining built on commercial LLM APIs',
                functions: 'Document upload/storage, AI document review, template-based contract generation, basic compliance checking',
                position: 'Single-sponsor or single-site tool, not a network platform',
                why: '80% functionality at 20% cost for small portfolios; rapid deployment; no vendor lock-in'
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
                  <td className="p-2 font-medium text-purple-300">Frontier / Veeva</td>
                  <td className="p-2">Sponsors standardize on Veeva for both sides; sites accept sponsor-mandated platform</td>
                  <td className="p-2">Sites adopt sponsor-centric tool; Veeva builds true bidirectional collaboration</td>
                  <td className="p-2">Veeva aggregates sufficient cross-sponsor data to match Apollo&apos;s network intelligence</td>
                  <td className="p-2">No significant shift required — Veeva has Part 11 compliance</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">CRO Build</td>
                  <td className="p-2">CROs invest in product dev (not core competency); sponsors accept CRO-proprietary tools</td>
                  <td className="p-2">Sites manage another platform; CRO supports all sponsor clients</td>
                  <td className="p-2">CRO shares performance data across sponsors (conflict of interest)</td>
                  <td className="p-2">CRO tool must achieve GxP validation — significant investment</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Niche / LLM</td>
                  <td className="p-2">Sponsors use non-validated AI tools for regulated docs; risk-averse teams trust AI outputs</td>
                  <td className="p-2">Replace integrated platform with point solutions; loses network effects</td>
                  <td className="p-2">No existing site network or performance data</td>
                  <td className="p-2">GxP validation of LLM outputs remains unresolved challenge</td>
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
          {/* Difficulty gradient bar */}
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
                <li>• Basic document storage and retrieval (any cloud storage)</li>
                <li>• Simple electronic signature (DocuSign, Adobe Sign)</li>
                <li>• Basic study info organizer (bookmark/password manager)</li>
                <li>• Template-based feasibility survey distribution</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/5 border-t-2 border-yellow-500 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-yellow-300">Build in Weeks</h3>
                <span className="text-[10px] font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">MED MOAT</span>
              </div>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• Document version control with audit trail</li>
                <li>• AI-powered contract redlining (LLM — not GxP-validated)</li>
                <li>• Basic remote document access with auth/logging</li>
                <li>• Study startup document checklist automation</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/5 border-t-2 border-red-500 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-red-300">Hard / Months+</h3>
                <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">HIGH MOAT</span>
              </div>
              <ul className="space-y-2 text-xs text-cream/70">
                <li>• Full 21 CFR Part 11 compliant eISF with validated audit trails</li>
                <li>• Bidirectional sponsor↔site doc exchange (SiteLink equiv.)</li>
                <li>• Network of 65K+ sites generating cross-study intelligence</li>
                <li>• GxP-validated AI meeting FDA, EMA, HIPAA, GDPR, ICH E6 R3</li>
              </ul>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border-l-4 border-purple-500">
            <p className="text-xs text-cream/70"><span className="font-medium text-purple-300">Key Takeaway:</span> Apollo&apos;s most defensible assets are the site network (65K+) and the regulatory compliance framework. Product functionality excluding network and compliance layers is replicable in weeks-to-months.</p>
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
              { asset: 'Product', score: 60, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'YELLOW', bullets: ['#1 rated site enablement for 6 consecutive years', 'Comprehensive suite (site + sponsor)', 'AI capabilities newly launched but unproven'] },
              { asset: 'Data', score: 85, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'GREEN', bullets: ['65K+ sites generating workflow data', '7.2M monthly workflows', 'Cross-sponsor performance data is unique'] },
              { asset: 'Channel', score: 80, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'GREEN', bullets: ['Dual GTM (site-up + sponsor-down)', '600+ sponsors deploying to sites', 'Free StudyOrganizer funnel'] },
              { asset: 'Relationships', score: 55, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'YELLOW', bullets: ['Broad but depth unclear', 'Existing Buyer partnership (Nov 2023)', 'Insight Partners as lead investor'] },
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
          <GapCallout gapCount={4}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What % of site relationships are direct-contracted vs. sponsor-deployed? <GapTag /></li>
              <li>• Depth of sponsor relationships — multi-year, multi-study? <GapTag /></li>
              <li>• How sticky are the technology integrations (CTMS, eTMF)? <GapTag /></li>
              <li>• Actual user engagement depth per site (DAU, MAU)? <GapTag /></li>
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
                <li>• Only platform serving as both site&apos;s eISF and sponsor&apos;s remote monitoring layer simultaneously</li>
                <li>• 7.2M monthly workflows and 5.8M remote monitoring activities</li>
                <li>• Full study lifecycle: eBinders, SiteLink, eTMF, eConsent, eNcounter, ParticipantLink, StudyOrganizer (free)</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Shield className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Differentiation Sources</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• #1 ranked clinical trial technology for 6 consecutive years</li>
                <li>• Built site-first (most competitors are sponsor-first) — genuine user affinity at site level</li>
                <li>• Dual-sided platform creates network effects</li>
                <li>• Patent for &quot;Remote Monitoring and Dynamic Document Management&quot; (US Patent No. 10,319,479)</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl md:col-span-2">
              <Lock className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Switching Friction / Stickiness</h3>
              <div className="grid md:grid-cols-2 gap-3 text-xs text-cream/70">
                <ul className="space-y-1.5">
                  <li>• Sites build entire regulatory document trail within eBinders — switching requires migrating compliance-critical records</li>
                  <li>• Integration APIs connect to CTMS, eTMF, identity systems (Buyer Velos, TruLab, Yunu, Greenphire)</li>
                </ul>
                <ul className="space-y-1.5">
                  <li>• SOC 2 Type 2 attested, 21 CFR Part 11 compliant, GDPR/HIPAA/Annex 11/ICH E6 R3</li>
                  <li>• <span className="text-yellow-300 font-medium">INFERENCE:</span> Switching costs high for sites with multi-year trails, lower for sponsor-deployed instances</li>
                </ul>
              </div>
            </div>
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
                  <td className="p-2 font-medium text-cream/90">Site operational workflow data (7.2M/mo)</td>
                  <td className="p-2">Yes — on-platform</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">High — structured by regulated workflows</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Document exchange records (sponsor↔site)</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">High — audit-trailed</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Site performance signals (enrollment, startup, compliance)</td>
                  <td className="p-2">Yes — derived</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Medium — observational</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">ParticipantLink StudyReady database</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Unclear</td>
                  <td className="p-2"><GapTag /></td>
                  <td className="p-2 text-yellow-300">Moderate</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">eConsent interaction data</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Medium — completion rates</td>
                  <td className="p-2 text-yellow-300">Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
          <GapCallout gapCount={3}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Customer agreements may limit ability to aggregate and monetize operational data <GapTag /></li>
              <li>• HIPAA and GDPR constrain participant-level data use <GapTag /></li>
              <li>• Contractual rights to use aggregated data for AI model training <GapTag /> — <span className="text-amber-300 font-medium">CRITICAL diligence question</span></li>
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
                <li>• <span className="text-cream/90 font-medium">Direct site sales:</span> dedicated VP Site Sales; free StudyOrganizer as top-of-funnel</li>
                <li>• <span className="text-cream/90 font-medium">Sponsor/CRO sales:</span> SiteLink sold to sponsors who deploy to study sites</li>
                <li>• <span className="text-cream/90 font-medium">Research Revolution:</span> Annual event (owned media channel)</li>
                <li>• <span className="text-cream/90 font-medium">AWS Marketplace:</span> SiteLink listing (Oct 2025) expanding procurement</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Zap className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Embedded Distribution</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• When a sponsor deploys SiteLink, all sites in that study are activated on Apollo — network-driven distribution</li>
                <li>• 600+ sponsors deploying to multiple sites each; &quot;land with sponsor, expand to sites&quot; motion</li>
                <li>• <span className="text-yellow-300 font-medium">INFERENCE:</span> Jump from 37K to 65K sites in ~2 months (Sept–Oct 2025) suggests large sponsor deployments</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="absolute -top-2.5 right-3"><GapSticker count={1} /></div>
              <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Concentration &amp; Fragility</div>
              <p className="text-xs text-cream/70"><GapTag /> Unknown % of revenue from top 10/20 sponsors. Pareto principle likely applies.</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 border-l-4 border-green-500/50">
              <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Replication Difficulty</div>
              <p className="text-xs text-cream/70">Dual-sided channel (site-up + sponsor-down) is hard to replicate. Veeva has sponsor-down but lacks organic site-up adoption Apollo built over a decade.</p>
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
              { name: 'Buyer Clinical (Partner since Nov 2023)', detail: 'Direct integration between Apollo eBinders and Buyer ClinTech/ClinSphere. ~250K+ annual document exchanges. Relationship predates announcement — Apollo and Buyer Velos integrated Dec 2021.', tag: 'Strategic' },
              { name: 'Insight Partners (Lead Investor)', detail: 'Led Series C ($80M) and C-1 ($27M). Significant board influence likely.', tag: 'Financial' },
              { name: 'Sponsor Relationships (600+)', detail: 'Major pharma deploying across global portfolios. Apollo supported Pfizer\u2019s COVID-19 vaccine trials.', tag: 'Commercial' },
              { name: 'Technology Partners', detail: 'Greenphire, TruLab, Yunu, Buyer Velos — embed Apollo deeper in clinical trial tech stack.', tag: 'Integration' },
              { name: 'VersaTrial (Acquired Sept 2023)', detail: 'Expanded capabilities in feasibility response times and staff communication.', tag: 'M&A' },
            ].map((rel) => (
              <div key={rel.name} className="p-4 bg-white/5 border border-cream/10 rounded-xl flex items-start gap-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sage-300 bg-sage-500/10 px-2 py-1 rounded flex-shrink-0">{rel.tag}</span>
                <div>
                  <h3 className="text-sm font-medium text-cream">{rel.name}</h3>
                  <p className="text-xs text-cream/60 mt-1">{rel.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 border-l-4 border-green-500/50">
            <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Replication difficulty:</span> 65K site network and 600+ sponsor relationships took a decade to build. Cannot be quickly replicated. Relationships are non-exclusive; sponsors use Apollo alongside other tools.</p>
          </div>
        </div>
  )

  slideContentMap['team-ops-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Team + Operating Model — Executive Summary</h2>
          </div>
          <div className="space-y-3 mt-6">
            {[
              { dim: 'Key Roles Present', rating: 'HIGH', why: 'CEO/CTO (co-founders), CFO, COO, CRO, VP Product, VP Engineering — all critical roles filled' },
              { dim: 'Leveling / Seniority Fit', rating: 'HIGH', why: 'C-suite has strong enterprise SaaS and clinical trials pedigree (BCG, Microsoft, Commvault, VMware, PwC, MIT Sloan)' },
              { dim: 'Functional Representation', rating: 'MEDIUM-HIGH', why: 'Strong in sales, engineering, compliance, marketing. Clinical domain expertise present (Chief Clinical Trials Officer)' },
              { dim: 'Resourcing Balance', rating: 'GAP', why: 'Cannot assess without headcount data by function' },
              { dim: 'Process Maturity', rating: 'MEDIUM', why: 'GxP compliance processes well-established; AI governance maturity unclear given recency of AI launch' },
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
          <GapCallout gapCount={4}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Current total headcount and headcount by function? <GapTag /></li>
              <li>• Engineering-to-total ratio? Dedicated AI/ML team size? <GapTag /></li>
              <li>• Leadership attrition — several leaders appear relatively new? <GapTag /></li>
              <li>• Resourcing balance cannot be assessed without headcount data <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['people-roles'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">People &amp; Roles</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-taupe-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Name</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Title</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Background</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Accountability</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  ['Ryan Jones', 'Co-Founder & CEO', 'BCG → Microsoft (PM) → Pubget', 'Strategy, vision, IR'],
                  ['Andres Garcia', 'Co-Founder & CTO', 'Security technology', 'Tech architecture, eng.'],
                  ['Cooper Anderson', 'CFO', 'Wall Street → SaaS CFO roles', 'Finance, fundraising'],
                  ['Shankar Jagannathan', 'COO', 'BCG → Commvault → WorkWave (PE)', 'Operations, AI workflows'],
                  ['Chad Garrett', 'CRO', 'Enterprise software sales', 'GTM, revenue, sales'],
                  ['Shreedhar Shirgurkar', 'VP Product', 'MIT Sloan MBA; 12+ yr PM', 'Product strategy'],
                  ['Kapil Bage', 'VP Engineering', 'Healthcare, life sciences, AI', 'Engineering, platform'],
                  ['Catherine Gregor', 'CCTO', 'Vanderbilt-Ingram Cancer Center', 'Clinical domain expertise'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="p-2 font-medium text-cream/90">{row[0]}</td>
                    <td className="p-2">{row[1]}</td>
                    <td className="p-2">{row[2]}</td>
                    <td className="p-2">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">INFERENCE:</span> COO appears to own AI product agenda based on public quotes — AI managed as operational capability rather than pure product/engineering initiative.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">INFERENCE:</span> Both a CRO and SVP Revenue/Partnerships — suggests potential dual reporting for revenue. Strong enterprise SaaS pedigree across C-suite.</p>
            </div>
          </div>
        </div>
  )

  slideContentMap['functional-coverage'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Functional Coverage &amp; Resourcing</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Users className="w-5 h-5 text-taupe-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Employee Count</h3>
              <p className="text-xs text-cream/70">51–200 (Tracxn, Jul 2024); Dealroom lists 201–500. Offices in Atlanta, GA (HQ) and Belgrade, Serbia.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-2">Functional Allocation (Inferred)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90">Engineering/Product:</span> CTO + VP Eng + VP Product (3 leaders)</li>
                <li>• <span className="text-cream/90">Sales/Revenue:</span> CRO + SVP Revenue + VP Site Sales + VP Marketing + VP Market Strategy (5 leaders)</li>
                <li>• <span className="text-cream/90">Operations:</span> COO + VP Professional Services (2 leaders)</li>
                <li>• <span className="text-cream/90">Clinical/Compliance:</span> CCTO + VP Quality (2 leaders)</li>
                <li>• <span className="text-cream/90">Finance/HR:</span> CFO + SVP People (2 leaders)</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">INFERENCE:</span> Apollo appears GTM-heavy at VP+ level (5 revenue/marketing leaders vs. 3 engineering/product). Could reflect dual (site + sponsor) GTM complexity.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">INFERENCE:</span> Belgrade office likely houses meaningful engineering, consistent with cost-efficient offshore development common in PE-backed SaaS.</p>
            </div>
          </div>
          <div className="relative p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="absolute -top-2.5 right-3"><GapSticker count={5} /></div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Key Gaps</span>
            </div>
            <p className="text-xs text-cream/60">Actual headcount by function <GapTag /> · Engineering team size <GapTag /> · Dedicated AI/ML headcount <GapTag /> · Contractor vs. FTE ratio <GapTag /> · Attrition rates <GapTag /></p>
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
              { dim: 'AI Governance & Ownership', score: 2, label: 'Early', obs: 'AI announced Sept 2025; COO appears to own AI agenda; no public evidence of governance framework or ethics board' },
              { dim: 'Continuous AI Operating Model', score: 2, label: 'Early', obs: 'AI capabilities newly launched; no evidence of monitoring, iteration, or feedback loops for model performance' },
              { dim: 'Customer-Facing AI Deployment', score: 2, label: 'Early', obs: 'HITL approach explicitly stated; GxP-compliant infra; features entered limited availability only months ago' },
              { dim: 'Selling Process Adaptation for AI', score: 3, label: 'Developing', obs: 'AI prominently featured in Oct 2025 press release and Research Revolution event; GTM being retooled' },
              { dim: 'Delivery/Support Adaptation', score: 2, label: 'Early', obs: 'FlorenceCare support program exists; FloPro Certifications; unclear if updated for AI' },
              { dim: 'Measurement Discipline', score: 3, label: 'Developing', obs: 'Publicly reports network metrics (65K, 600+, 7.2M); AI-specific KPIs not public' },
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
              { dim: 'Internal Value', rating: 'LOW-MEDIUM', points: 'No public evidence of AI for internal operations. Investment appears entirely customer-facing.' },
              { dim: 'External Value', rating: 'MEDIUM-HIGH', points: 'AI workflows directly address sponsor pain points. If proven, could justify premium pricing and accelerate sales cycles.' },
              { dim: 'Maturity & Coverage', rating: 'LOW', points: 'Announced Sept 2025, limited availability Oct 2025. Coverage limited to site ID, contract redlining, monitoring.' },
              { dim: 'Replicability Risk', rating: 'MEDIUM', points: 'Individual features replicable via commercial LLMs. Differentiator is underlying data asset (65K+ sites) and GxP infra.' },
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
          <GapCallout gapCount={4}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• What LLM/AI models power the workflows? (Own vs. API) <GapTag /></li>
              <li>• Cost structure of AI features? (LLM API costs, infra investment) <GapTag /></li>
              <li>• How are AI outputs validated for GxP compliance? <GapTag /></li>
              <li>• Customer evidence for AI feature value? (Pilot results, accuracy) <GapTag /></li>
            </ul>
          </GapCallout>
        </div>
  )

  slideContentMap['ai-inventory'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Inventory (What Exists)</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {[
              { cap: 'AI-Powered Site Identification', scope: 'External (Sponsor)', maturity: 'Pilot / Limited', deps: 'Site network data; profile completeness; TA tagging' },
              { cap: 'AI-Assisted Feasibility Survey', scope: 'External (Site)', maturity: 'Pilot / Limited', deps: 'Historical site data; protocol requirements; LLM integration' },
              { cap: 'AI-Driven Contract Redlining', scope: 'External (Both)', maturity: 'Pilot / Limited', deps: 'Contract templates; guidelines; LLM; GxP validation' },
              { cap: 'AI-Enabled Document Exchange', scope: 'External (Both)', maturity: 'Pilot / Limited', deps: 'eTMF-eISF integration; document classification' },
              { cap: 'AI-Powered Risk Reporting', scope: 'External (Sponsor)', maturity: 'Pilot / Limited', deps: 'Audit trail data; site baselines; anomaly detection' },
              { cap: 'Next-Best-Action Recommendations', scope: 'External (Both)', maturity: 'Pilot / Limited', deps: 'Cross-study data; workflow state tracking' },
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
          <div className="p-3 rounded-xl bg-cream/5 border border-cream/10 mb-2">
            <p className="text-xs text-cream/70">All capabilities: HITL AI, built on GxP-compliant infrastructure, full audit traceability, 21 CFR Part 11 support, interoperability APIs.</p>
          </div>
          <div className="relative p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="absolute -top-2.5 right-3"><GapSticker count={2} /></div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Key Gaps</span>
            </div>
            <p className="text-xs text-cream/60">No publicly disclosed AI for internal operations <GapTag /> · No details on underlying models, vendors, pilot results, or accuracy metrics <GapTag /></p>
          </div>
        </div>
  )

  slideContentMap['architecture-readiness'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Architecture Snapshot + Readiness</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Database className="w-5 h-5 text-gold mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Architecture Signals (Public)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Cloud-based SaaS (web application); AWS-hosted; SiteLink on AWS Marketplace</li>
                <li>• GxP-validated infrastructure — 21 CFR Part 11 compliant</li>
                <li>• SOC 2 Type 2 attested (annual); security aligned with NIST framework</li>
                <li>• Encryption: TLS 1.2 in transit, AES-256 at rest</li>
                <li>• Interoperability APIs for CTMS, eTMF, identity systems</li>
                <li>• Product status page — modern SaaS operational practices</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3">Readiness Callouts</h3>
              <div className="space-y-2">
                {[
                  { area: 'Cloud Infrastructure', status: 'ready' as const, note: 'AWS-hosted, SaaS, marketplace listing' },
                  { area: 'Compliance Layer', status: 'strong' as const, note: 'Part 11, SOC 2, GDPR, HIPAA, Annex 11, ICH E6 R3' },
                  { area: 'Integration Layer', status: 'developing' as const, note: 'Named integrations exist but breadth limited' },
                  { area: 'AI/ML Infrastructure', status: 'unknown' as const, note: 'No public details on model hosting, training, MLOps' },
                  { area: 'Data Platform', status: 'unknown' as const, note: 'No details on warehouse/lake/analytics infra' },
                  { area: 'Scalability', status: 'ready' as const, note: '7.2M monthly workflows indicate robust throughput' },
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
              <li>• AI/ML infrastructure maturity is a critical unknown</li>
              <li>• Integration breadth limited relative to broader clinical trial ecosystem</li>
              <li>• Belgrade engineering office introduces timezone/coordination considerations</li>
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
                  { bucket: 'Cost', def: 'Reduction in internal operating costs via AI', kpis: 'Cost per implementation, support cost per site', proof: 'Before/after cost comparison' },
                  { bucket: 'Speed', def: 'Faster internal processes', kpis: 'Time to onboard site, support ticket resolution', proof: 'Cycle time measurements' },
                  { bucket: 'Productivity', def: 'More volume without proportional headcount', kpis: 'Sites per specialist, studies per CSM', proof: 'Ratio analysis over time' },
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
                  { bucket: 'Pricing Power', def: 'Premium prices via AI-differentiated capabilities', kpis: 'Revenue per site, ARPU, AI adoption rate', proof: 'Pricing tier analysis; segmentation' },
                  { bucket: 'Speed-to-Close', def: 'Faster sales cycles and site activation from AI', kpis: 'Days demo-to-contract, startup time reduction', proof: 'Sales cycle analysis; pilot time-to-value' },
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
                title: 'AI-Driven Site Identification & Feasibility',
                internal: 'Speed (reduces sponsor time to identify sites); Productivity (reduces manual feasibility)',
                external: 'Pricing Power (differentiation); Speed-to-Close (faster deployment decisions)',
                proof: 'No public pilot results. Limited availability Oct 2025.',
                replicability: 'MEDIUM', replicabilityNote: 'AI feature replicable, but 65K+ site dataset is not',
                comparables: 'Buyer ClinSphere Total Feasibility; Veeva SiteVault; TrialHub'
              },
              {
                title: 'AI-Powered Contract Redlining',
                internal: 'Speed (reduces contract review cycles); Cost (reduces legal review time)',
                external: 'Speed-to-Close (direct startup reduction); Pricing Power (unique in site enablement)',
                proof: 'No public pilot results. Limited availability Oct 2025.',
                replicability: 'HIGH', replicabilityNote: 'Contract redlining via LLM is rapidly commoditizing',
                comparables: 'Harvey, CoCounsel, Ironclad, Buyer study startup solutions'
              },
              {
                title: 'AI-Powered Risk Monitoring',
                internal: 'Productivity (reduces manual monitoring visit prep)',
                external: 'Pricing Power (sponsors value risk intel); Speed-to-Close (proactive risk mgmt)',
                proof: 'No public pilot results. Limited availability Oct 2025.',
                replicability: 'MEDIUM-LOW', replicabilityNote: 'Requires operational audit trail data unique to Apollo',
                comparables: 'Buyer Trial IntelX; IQVIA analytics; Medidata Rave analytics'
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
                      ex.replicability === 'HIGH' ? 'bg-red-400 w-[85%]' :
                      ex.replicability === 'MEDIUM' ? 'bg-yellow-400 w-[55%]' :
                      'bg-green-400 w-[30%]'
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
              { asset: 'Data', rating: 'HIGH', why: 'Apollo\u2019s 65K+ site ops data + Buyer\u2019s 80K+ protocol dataset = industry\u2019s most comprehensive clinical trial intelligence asset' },
              { asset: 'Channel', rating: 'HIGH', why: 'Buyer\u2019s sponsor relationships (94% of FDA-approved therapeutics) could drive Apollo adoption; Apollo\u2019s site network drives Buyer adoption' },
              { asset: 'Product', rating: 'MEDIUM-HIGH', why: 'Apollo fills site enablement gap in Buyer\u2019s ClinSphere; Buyer\u2019s IRB, training, feasibility complement Apollo' },
              { asset: 'Relationships', rating: 'MEDIUM', why: 'Existing partnership (Nov 2023) provides integration foundation; non-exclusive nature means relationship could be maintained without acquisition' },
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
              <li>• Apollo funded by Insight Partners ($116M); acquisition must satisfy return expectations</li>
              <li>• Buyer is PE-owned (LGP, Arsenal, Novo) — math must align with capital structure</li>
              <li>• ClinSphere and Apollo built on different tech stacks; deep integration requires significant engineering</li>
              <li>• Data rights and privacy — combining datasets requires contractual assessment, HIPAA/GDPR compliance</li>
            </ul>
          </div>
          <GapCallout gapCount={5}>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Would Insight Partners support acquisition at current valuation? <GapTag /></li>
              <li>• How deep is current technical integration between Apollo and Buyer? <GapTag /></li>
              <li>• Customer base overlap? <GapTag /></li>
              <li>• Exclusive data or technology provisions in partnership agreement? <GapTag /></li>
              <li>• How would Apollo&apos;s site-first brand be maintained under Buyer? <GapTag /></li>
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
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[100px]">Buyer ↓ / Apollo →</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Apollo Data (65K sites)</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Apollo Channel (Sites)</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Apollo Product</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Apollo Relationships</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">Buyer Data (80K+ protocols)</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Combined intelligence for predictive site performance</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span> — Enhances site recs</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Protocol data powers AI feasibility</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">Buyer Channel (94% FDA)</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span> — Broader data collection</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Sponsors deploy Apollo to thousands more sites</td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Bundle with IRB, training</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">Buyer Product (ClinSphere)</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span> — Enhances Trial IntelX</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                  <td className="p-2"><span className="text-green-300 font-bold">HIGH</span> — Fills site enablement gap; IRB/training integration</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-blue-300">Buyer Relationships (PE)</td>
                  <td className="p-2 text-cream/40">Low-Med</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span> — Brand credibility</td>
                  <td className="p-2"><span className="text-yellow-300">Med</span></td>
                  <td className="p-2 text-cream/40">Low</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Constraints</div>
            <ul className="text-[10px] text-cream/70 space-y-0.5">
              <li>1. Data combination requires contractual rights, consent, HIPAA/GDPR review</li>
              <li>2. Channel cross-sell requires coordinated sales motion; compensation alignment</li>
              <li>3. Product integration: different tech stacks; significant engineering</li>
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
                num: '1', title: 'Apollo Site Data × Buyer Protocol Data → Combined Intelligence',
                value: 'Unified view from protocol design through site execution; predictive modeling connecting protocol complexity to real-world site performance',
                prereq: 'Data sharing agreement; unified data model; combined analytics infra; AI team',
                constraint: 'Customer consent and contractual rights to combine data across platforms'
              },
              {
                num: '2', title: 'Buyer IRB/Training Channel → Apollo Site Network → Bundled Site Enablement',
                value: 'Bundle Apollo deployment with IRB approval; automate IRB docs/training into eBinders — existing partnership targets 250K+ annual doc exchanges',
                prereq: 'Deep integration of eReview Manager/IRBNet with Apollo eBinders; coordinated sales',
                constraint: 'Sites may resist mandatory adoption; sponsor procurement may not support bundles'
              },
              {
                num: '3', title: 'Apollo AI × Buyer Trial IntelX → End-to-End AI-Powered Trial Management',
                value: 'Single AI-powered platform from protocol design through study conduct',
                prereq: 'Unified AI architecture; aligned governance; combined AI/ML team; consistent validation',
                constraint: 'Different tech stacks; different AI maturity levels; integration complexity'
              },
              {
                num: '4', title: 'Buyer Brand → Apollo Market Position → Accelerated Enterprise Adoption',
                value: 'Buyer\u2019s 55+ year brand credibility accelerates adoption at conservative, risk-averse sites/sponsors',
                prereq: 'Brand architecture decision (maintain Apollo vs. integrate into Buyer); sales enablement',
                constraint: 'Apollo\u2019s "site-made" identity may be diluted by Buyer (perceived as sponsor-centric)'
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
          {/* Visual timeline bar */}
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
                  <td className="p-2 font-medium text-cream/90">1. Combined Data</td>
                  <td className="p-2">Assess data rights; inventory datasets; begin governance</td>
                  <td className="p-2">Pilot combined analytics on anonymized data; first predictive models</td>
                  <td className="p-2">Full combined intelligence platform; commercialize as premium product</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">2. IRB Bundle</td>
                  <td className="p-2">Deepen eBinders ↔ ClinSphere integration; standardize doc flow</td>
                  <td className="p-2">Launch bundled offering; automated site activation through IRB workflow</td>
                  <td className="p-2">Full workflow automation from IRB approval through activation</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">3. AI Unification</td>
                  <td className="p-2">Joint AI roadmap; shared evaluation framework; quick-win integrations</td>
                  <td className="p-2">Unified AI governance; shared model training on combined data</td>
                  <td className="p-2">Single AI platform for trial design → site selection → conduct → monitoring</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">4. Brand Accel.</td>
                  <td className="p-2">Maintain Apollo brand; joint marketing; cross-sell training</td>
                  <td className="p-2">Coordinated GTM with unified value proposition</td>
                  <td className="p-2">Integrated brand architecture; dominant market position</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border-l-4 border-blue-500/50">
            <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Prerequisites by Wave</div>
            <ul className="text-[10px] text-cream/70 space-y-0.5">
              <li><span className="text-green-300">W1:</span> Clear integration authority; combined product leadership; data rights assessment</li>
              <li><span className="text-yellow-300">W2:</span> Engineering investment in platform integration; combined AI team; sales comp alignment</li>
              <li><span className="text-purple-300">W3:</span> Full organizational alignment; unified technology platform; regulatory validation of combined AI</li>
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
                num: '1', title: 'Channel Cross-Sell: Deploy Apollo to Buyer Sponsor Base',
                buckets: 'Speed-to-Close, Productivity',
                assumptions: ['# Buyer sponsor clients not on Apollo', 'Apollo avg ACV per sponsor', 'Conversion rate from Buyer referrals', 'Time to close'],
                output: 'Incremental Apollo ARR'
              },
              {
                num: '2', title: 'Data Monetization: Combined Intelligence Product',
                buckets: 'Pricing Power',
                assumptions: ['# sponsors willing to pay for combined intelligence', 'Price premium vs. standalone', 'Development cost'],
                output: 'Incremental revenue and margin'
              },
              {
                num: '3', title: 'Operational Efficiency: Automated IRB→eBinders Document Flow',
                buckets: 'Cost, Speed',
                assumptions: ['Current manual processing cost per site per study', '# sites on both Buyer IRB and Apollo', 'Automation rate', 'Cost savings per doc'],
                output: 'Annual cost savings'
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
            <p className="text-xs text-cream/70"><span className="text-red-300 font-medium">Executive Callout:</span> Three initiatives target different value buckets: (1) topline growth via channel leverage, (2) premium pricing via unique data capabilities, (3) margin improvement via operational automation. Combined impact cannot be quantified without internal financial data.</p>
          </div>
        </div>
  )

  slideContentMap['sensitivity'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-red-400 mb-2">Chapter G — Quantified Impact</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Sensitivity: Impact on Growth Curve</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-red-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Assumption</th>
                  <th className="text-left p-2 text-green-300 font-medium">High Case</th>
                  <th className="text-left p-2 text-yellow-300 font-medium">Medium Case</th>
                  <th className="text-left p-2 text-red-300 font-medium">Low Case</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  'AI feature adoption rate (% sponsors, 12 mo)',
                  'Channel cross-sell conversion (% Buyer → Apollo)',
                  'Site retention vs. Veeva competition',
                  'AI pricing premium (incremental ARPU)',
                  'Integration timeline for Buyer × Apollo data',
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
                { num: '1', title: 'AI adoption rate', detail: 'Features are <6 months old; early adoption data is the strongest leading indicator' },
                { num: '2', title: 'Veeva competitive response', detail: 'If SiteVault aggressively adds AI and maintains free pricing, site growth could decelerate' },
                { num: '3', title: 'Buyer channel leverage', detail: 'Existing partnership is a testable hypothesis; actual conversion data would validate cross-sell thesis' },
                { num: '4', title: 'Data rights & integration speed', detail: 'Combined data asset is highest-value synergy but depends on contractual rights and engineering investment' },
                { num: '5', title: 'Apollo financial trajectory', detail: 'Without baseline ARR, growth rate, and margin structure, sensitivity analysis cannot be populated' },
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

export function ApolloDiligenceSlide({ slideId }: { slideId: string }) {
  return <>{getSlideContent(slideId)}</>
}

export default ApolloDiligenceSlide
