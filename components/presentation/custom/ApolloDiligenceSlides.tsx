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
import { RatingBadge, StatusDot, ReadinessIcon } from '../shared/DiligenceComponents'

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
            <p className="text-cream/50 text-sm">Key findings by chapter</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { chapter: 'A — Growth Thesis Alignment', slides: ['Apollo\u2019s growth is anchored in a large, embedded, and highly sticky site footprint (90%+ retention) built around EISF; this installed base is a major asset for monetization expansion.', 'The most material AI value creation path is TrialFlow (workflow orchestration), but it is gated by data availability and rights.'], color: 'border-sage' },
              { chapter: 'B — What Has to Be True', slides: ['Growth is not primarily driven by additional site network expansion; Apollo is near saturation in EISF penetration and must shift to a new monetization model that expands ARPU via bundles, AI features, and potentially services.', 'Retention must remain high as the foundation for monetization expansion.'], color: 'border-yellow-500' },
              { chapter: 'C — Product + AI Initiatives', slides: ['Apollo has a broad portfolio of AI initiatives, but the value narrative should be centered on TrialFlow/Flowbot as the scalable orchestration layer rather than disconnected automations.', 'A persistent risk: many AI initiatives lack clear monetization/value linkage; tighten the story around where value is created and captured.'], color: 'border-gold' },
              { chapter: 'D — Commercial / Operating Model', slides: ['The next growth phase likely requires evolving from a product-only posture to a service-enabled model, where cross-product operational data informs measurable workflow/ops improvements.', 'Leading indicator: customers actively using multiple Apollo products and operational data across them to drive service/workflow changes.'], color: 'border-taupe' },
              { chapter: 'E — Competitive / Disruption Risk', slides: ['Platform displacement risk is low given deep workflow embedding, form design investment, and stickiness; wholesale \u201CAI eats the workflow\u201D is unlikely (massive change management required).', 'The bigger competitive risk emerges at the edges of the EISF core and as Apollo moves toward services, where alternative data systems/products could limit growth.'], color: 'border-purple-500' },
              { chapter: 'F — Defensibility + Data Rights', slides: ['Apollo\u2019s moat is strongest in channel + relationships + deployment; product is solid but could be better, and data value is constrained by rights/access.', 'The highest-value rights question is two-tier data rights; site performance rights appear TBD / not clearly covered.'], color: 'border-green-500' },
              { chapter: 'G — Team + Execution', slides: ['The current team has been effective at building and penetrating the network; the next phase (services + monetization expansion) may require different leadership capabilities.', 'Engineering scale appears high relative to \u201Cdocument-management-like\u201D scope; execution efficiency is unclear.'], color: 'border-red-400' },
              { chapter: 'H — Integration with WCG', slides: ['Near-term value comes from WCG as a channel driving Apollo product deployment and revenue uplift; longer-term upside comes from combining Apollo product data with WCG operational data to enable service/ops lift.'], color: 'border-blue-500' },
            ].map((ch) => (
              <div key={ch.chapter} className={`p-4 bg-white/5 border-l-4 ${ch.color} rounded-r-lg`}>
                <h3 className="text-sm font-semibold text-cream mb-2">{ch.chapter}</h3>
                <ul className="space-y-1">
                  {ch.slides.map((s, i) => (
                    <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                      <span className="text-cream/30 font-mono mt-px">&bull;</span>
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
                <li>• <span className="text-cream/90 font-medium">Connected site network</span> is a massive asset: 65K+ sites, 600+ sponsors, 90+ countries, very low churn (90%+ stickiness); Apollo ~5x ahead of closest competitor</li>
                <li>• <span className="text-cream/90 font-medium">EISF is the core product</span> from which multi-product upsell expands: eBinders &rarr; SiteLink &rarr; eTMF &rarr; eConsent &rarr; Site Feasibility &rarr; Site Selection</li>
                <li>• Growth shifted from site-by-site (first 100 took ~6 yrs) to sponsor-driven bulk deployment &mdash; up to 500 sites/week during peaks</li>
                <li>• Broader push toward digitization + expanding digital footprint &rarr; growing appetite for data across the clinical trial ecosystem</li>
                <li>• Regulatory tailwinds: ICH E6 R3 mandates + FDA eSource guidance favoring electronic workflows</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">AI Opportunities</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">TrialFlow / Workflow Orchestration</span> &mdash; the primary AI value creation path; intelligent orchestration of trial operations with task dependencies (like Monday.com/MS Project for trial startup)</li>
                <li>• <span className="text-yellow-300 font-medium">Key dependency:</span> TrialFlow requires data capture + usable rights (may not have rights to use/operationalize)</li>
                <li>• Site Feasibility &mdash; automates 500&ndash;1,000 questionnaires/yr per site using knowledge library</li>
                <li>• Doc QC &mdash; Tesseract OCR for deterministic checks + LLM for semantic checks (blank pages, readability, ordering)</li>
                <li>• Risk-Based Reporting &mdash; structured + unstructured data overlay producing risk heat maps and exec summaries</li>
                <li>• FlowBot &mdash; AI assistant embedded in eBinders for role-based onboarding</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Target className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Alignment</h3>
              <RatingBadge rating="HIGH" size="lg" />
              <p className="text-xs text-cream/70 mt-2">Apollo&apos;s AI roadmap directly targets the two largest time sinks in clinical trials — study startup and ongoing monitoring. 2026 strategy organized around a &ldquo;3 on 3&rdquo; goal: 3 new AI workflows targeting $3M AI-specific ARR, up from $0 in 2025. AI priced as independent SKUs, not bundled.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Macros</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Clinical trial complexity increasing; site burden rising per WCG&apos;s own 2025 site challenges report</li>
                <li>• Regulatory push toward decentralized trials and remote monitoring post-COVID</li>
                <li>• Veeva SiteVault&apos;s free eISF creating pricing pressure on site-facing product</li>
                <li>• PE consolidation across clinical trial technology (e.g., WCG&apos;s own LGP/Arsenal/Novo recapitalization)</li>
                <li>• Apollo TA mix &asymp; 50% oncology, TA-agnostic infrastructure — site selection may introduce TA-specific patient data</li>
              </ul>
            </div>
          </div>
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
                  { label: 'Total Customers', val: '~400', sub: '' },
                  { label: 'Avg Rev / Study Site', val: '~$1,500', sub: '' },
                  { label: 'Feasibility Add-on', val: '~$500', sub: '' },
                  { label: 'AI Revenue Entering 2026', val: '$0', sub: '→ $3M target' },
                  { label: 'eConsent YoY Growth', val: '~75%', sub: '' },
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
                  'Apollo is likely near saturation in EISF penetration — growth is not primarily driven by additional site network expansion',
                  'Apollo must monetize the footprint in a new way: bundles, AI features, and/or services that stitch products together to expand ARPU',
                  'Trial operations / stitching is the center of the growth thesis — evolution toward a service-enabled model',
                  'Retention must remain high as the foundation for monetization expansion (90%+ stickiness must hold against Veeva\u2019s free SiteVault)',
                  'AI features must prove value: "3 on 3" target of $3M AI ARR from three new SKUs, up from $0',
                  'Leading indicator: customers actively using multiple Apollo products and operational data across them to drive service/workflow changes',
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
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-2">Chapter A — Growth Thesis Alignment</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Offering + AI Initiatives ↔ Growth Drivers</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-sage/40">
                  <th className="text-left p-1.5 text-cream/80 font-medium min-w-[80px]">Growth Driver</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">eBinders (Sites)</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">eConsent (Sites)</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Site Feasibility (AI)</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">SiteLink (Sponsors)</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Site Selection (API)</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Doc QC / Risk (AI)</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-1.5 font-medium text-cream/90">New Logo — Sites</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; &ldquo;Box.net for clinical research&rdquo;</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; &ldquo;DocuSign for clinical research,&rdquo; ~75% YoY</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; automates 500&ndash;1K questionnaires/yr</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Partial</span> &mdash; sites via sponsor</td>
                  <td className="p-1.5 text-cream/40">N/A (sponsor-facing)</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Partial</span> &mdash; deploys at site per sponsor (e.g., Merck)</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-1.5 font-medium text-cream/90">New Logo — Sponsors</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Partial</span> &mdash; network is draw</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Partial</span> &mdash; IRB integration with WCG</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Partial</span> &mdash; validated feasibility data</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; remote monitoring, doc exchange</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; API-first, feeds sponsor scoring</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; Merck 5K hrs/mo manual QC</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-1.5 font-medium text-cream/90">Expansion Revenue</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Partial</span> &mdash; more studies/site</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; upsell from eBinders, billable forms</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; ~$500 add-on per study site</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; more sites/study</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; upsell from SiteLink</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; premium AI SKU</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-1.5 font-medium text-cream/90">Retention</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; audit trail lock-in</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; audit trail at back end</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Moderate</span> &mdash; early stage</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; cross-site dep.</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Moderate</span> &mdash; API data feed, not full solution</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Moderate</span> &mdash; early stage</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-1.5 font-medium text-cream/90">Pricing Power</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Moderate</span> &mdash; Veeva free tier pressure</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Moderate</span></td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; novel AI capability</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; no free competitor</td>
                  <td className="p-1.5"><span className="text-yellow-300 font-medium">Moderate</span> &mdash; &ldquo;part of the data sets&rdquo;</td>
                  <td className="p-1.5"><span className="text-green-300 font-medium">Strong</span> &mdash; massive manual burden</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70 mb-2">Product portfolio maps to a &ldquo;crossing the chasm&rdquo; framework: document management &rarr; connected trial execution &rarr; automation (AI agents + traditional) &rarr; intelligence products built on accumulated data.</p>
            <p className="text-xs text-cream/50">Revenue contribution by product line not disclosed. Doc QC / risk-based reporting pricing still in development. LLM token consumption cost model acknowledged as &ldquo;a point of attention&rdquo; &mdash; doing as much as possible deterministically before hitting LLM.</p>
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
                { id: 'T1', title: 'Site Identification & Feasibility', desc: 'AI-assisted questionnaire completion from knowledge library; sponsor-side site selection with API for custom scoring; ~10 test customers in LA' },
                { id: 'T2', title: 'Study Start-Up Automation', desc: 'Doc exchange between eTMF and eISF; Trial Flow (POC) for workflow orchestration with task dependencies' },
                { id: 'T3', title: 'Document Quality & Compliance', desc: 'Doc QC pipeline: batch processing, blank pages, readability, ordering, title-content matching. Tesseract OCR + LLM semantic checks' },
                { id: 'T4', title: 'Risk-Based Reporting & Intelligence', desc: 'Structured + unstructured data overlay producing risk heat maps, exec summaries, recommended actions. Site-facing first, then sponsor-facing' },
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
              {['T1→R1,R2', 'T2→R1,R4', 'T3→R2,R3,R4', 'T4→R2,R4'].map((conn, i) => (
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
          <div className="p-4 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-1">Additional Opportunities</div>
            <p className="text-xs text-cream/70 mb-2">Strong product basis with underlying data &mdash; additional opportunities in:</p>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• <span className="text-cream/90 font-medium">Recruitment</span> &mdash; EMR &ldquo;print to file&rdquo; integration exists (~25% of customers) but not yet a data asset</li>
              <li>• <span className="text-cream/90 font-medium">Protocol optimization</span> &mdash; no AI for protocol optimization or amendment prediction (contrast with WCG&apos;s ClinSphere Trial IntelX)</li>
              <li>• <span className="text-cream/90 font-medium">Budgeting</span> &mdash; actively seeking to partner or acquire a budgets tool; key element in study startup workflow</li>
              <li>• <span className="text-yellow-300 font-medium">Flowbot/TrialFlow</span> could unlock these opportunities <span className="text-cream/90 font-medium">if data access/rights allow</span></li>
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
                <div><span className="text-cream/50 font-medium">What becomes true:</span> AI workflows drive measurable startup time reduction; evolution toward service-enabled model; &ldquo;3 on 3&rdquo; AI revenue target exceeded; multi-product bundles become standard commercial motion</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Evidence of customers using multiple Apollo products + operational data to drive service/workflow changes; AI adoption &gt;30% in year one; eConsent continues 75%+ growth; site churn &lt;5%</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Apollo becomes system-of-record for trial operations; commands premium pricing via service-enabled model</div>
              </div>
            </div>
            <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <Target className="w-6 h-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Steady Growth, Competitive Pressure</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> AI workflows deliver moderate value but face adoption friction; Veeva SiteVault erodes site-level pricing; Apollo grows primarily through sponsor-side products; $3M AI ARR target partially met</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> AI adoption &lt;15%; LLM token costs compress margins on AI products; services model cannot be accessed</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Risk of being stuck at a product play that has topped out if services model cannot be accessed; WCG acquisition still valuable for channel synergies but upside more limited</div>
              </div>
            </div>
            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="text-sm font-semibold text-blue-300 mb-2">Integration Accelerant (WCG-Specific)</h3>
              <div className="space-y-3 text-xs text-cream/70">
                <div><span className="text-cream/50 font-medium">What becomes true:</span> WCG acquisition closes; WCG is a channel deploying Apollo products; expect net uplift in Apollo product revenue via WCG distribution; IRB&rarr;eBinders integration deepens</div>
                <div><span className="text-cream/50 font-medium">Leading indicators:</span> Post-close Wave 1 integration &lt;6 months; combined data product in market within 18 months; evidence of Apollo + WCG operational data driving additional uplift</div>
                <div><span className="text-cream/50 font-medium">Implications:</span> Longer-term upside from combining Apollo product data + WCG operational data to drive additional uplift; combined entity becomes dominant in site enablement + trial operations</div>
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
              <Building2 className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Mode 1: Platform Displacement</h3>
                <RatingBadge rating="LOW" />
              </div>
              <p className="text-xs text-cream/70">&ldquo;A better Apollo&rdquo; &mdash; platform displacement risk is low given strong product, deep deployment, and high stickiness (90%+ retention). Deep form/workflow design investment creates significant change management barriers for sites.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Brain className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Mode 2: Upstream Capture</h3>
                <RatingBadge rating="LOW" />
              </div>
              <p className="text-xs text-cream/70">&ldquo;AI eats the workflow&rdquo; &mdash; very unlikely given deep form/workflow design + significant change management required. AI disruption is more likely at product edges (further from EISF core), via point automation, rather than wholesale workflow displacement.</p>
            </div>
            <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
              <Package className="w-6 h-6 text-purple-400 mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-cream">Mode 3: Ecosystem Commoditization</h3>
                <RatingBadge rating="LOW-MEDIUM" />
              </div>
              <p className="text-xs text-cream/70">&ldquo;Everyone does it&rdquo; &mdash; reasonable risk: point solutions from CTMS/ETMF and others may exploit ecosystem access points. Most likely: Medidata, Oracle, or Veeva embedding eISF capabilities.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border-l-4 border-purple-500/50">
            <p className="text-xs text-cream/70"><span className="text-purple-300 font-medium">Summary:</span> Low platform displacement risk; the bigger risk is services-growth interference by other products/data systems at the edges of the EISF core.</p>
          </div>
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
                why: 'Free tier is a meaningful point displacement risk for EISF; existing sponsor relationships create pull-through; regulatory compliance established'
              },
              {
                mode: 'Competitors / CRO Build',
                concept: 'Solving operations/automation via a different product suite — not necessarily centered on EISF',
                functions: 'Site performance scoring, CRA workflow management, integrated document exchange, monitoring optimization',
                position: 'Embedded within CRO operational workflow, offering alternative data systems/products',
                why: 'CRO has direct implementation control; data stays within ecosystem; customized to CRO processes'
              },
              {
                mode: 'Niche / LLM-Based Build',
                concept: 'Lightweight document management + AI contract redlining built on commercial LLM APIs',
                functions: 'Document upload/storage, AI document review, template-based contract generation, basic compliance checking',
                position: 'At most local/site-specific, not ecosystem-wide — limited likelihood of scaling',
                why: 'Rapid deployment for small portfolios but lacks network effects, regulatory validation, and cross-sponsor data'
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
              <p className="text-[10px] text-cream/50 mt-2 italic">Lacks: channel access, embedded workflows/design efficiencies, change management leverage</p>
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
              <p className="text-[10px] text-cream/50 mt-2 italic">Lacks: channel access, embedded workflows/design efficiencies, change management leverage</p>
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
              <p className="text-[10px] text-cream/50 mt-2 italic">Harder to replicate: embed + access + relationships</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border-l-4 border-purple-500">
            <p className="text-xs text-cream/70"><span className="font-medium text-purple-300">Key Takeaway:</span> Apollo&apos;s most defensible assets are the site network (65K+) and the regulatory compliance framework. Product functionality excluding network and compliance layers is replicable in weeks-to-months. Note: a new cross-system data asset might be buildable faster externally, while Apollo may struggle to retroactively extract/normalize data (rights + structure).</p>
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
              { asset: 'Product', score: 60, donutColor: 'rgba(250, 204, 21, 0.7)', dotColor: 'yellow' as const, rating: 'MEDIUM', bullets: ['Six products spanning site + sponsor workflows, all built natively', 'Strong but could be better; EISF is the core from which multi-product upsell expands', 'Three AI-native products in development; unified data model across all products'] },
              { asset: 'Data', score: 25, donutColor: 'rgba(239, 68, 68, 0.7)', dotColor: 'red' as const, rating: 'LOW', bullets: ['Data is created on-platform but rights/access unclear; hard to operationalize', 'Milestone-based audit trail data (rights to use partially confirmed)', 'Data quality: 50-60% sponsor side very clean, 15-20% good from sites; two-tier data rights are the key question'] },
              { asset: 'Channel', score: 85, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'HIGH', bullets: ['Strong penetration and deployment; dual go-to-market: site-up + sponsor-down', '~400 total customers; sponsor deals driving 500 sites/week peaks', 'Deployed in every Merck/Pfizer study, every FSO IQVIA study'] },
              { asset: 'Relationships', score: 85, donutColor: 'rgba(74, 222, 128, 0.7)', dotColor: 'green' as const, rating: 'HIGH', bullets: ['Merck, Pfizer, IQVIA as named anchor customers', 'Merck co-developing Doc QC (5,000 hrs/month problem)', 'Existing WCG partnership; eConsent has completed IRB integrations'] },
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
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70"><span className="text-sage-300 font-medium">Summary:</span> Apollo&apos;s moat is strongest in channel + relationships + deployment; product is solid but improvable; data value is constrained by rights/access.</p>
          </div>
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
              <h3 className="text-sm font-semibold text-cream mb-2">Site-Side Products (3)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">eBinders:</span> Structured document workflow with categorization, metadata, signature workflows. &quot;Box.net purpose-built for clinical research.&quot;</li>
                <li>• <span className="text-cream/90 font-medium">eConsent:</span> Document editing, preview, routing, audit trail. &quot;DocuSign for clinical research.&quot; ~75% YoY growth, only ~2 years old.</li>
                <li>• <span className="text-cream/90 font-medium">Site Feasibility:</span> AI-native product. Automates feasibility questionnaire completion using knowledge library. Sites receive 500-1,000 questionnaires/year.</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Layers className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Sponsor-Side Products (3)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">SiteLink:</span> Study activation, role setup, document sourcing from eTMF, distribution to sites, training log management, and monitoring.</li>
                <li>• <span className="text-cream/90 font-medium">Site Selection:</span> Two-sided network product. Site feasibility profiles feed sponsor-side search with API for custom scoring matrices.</li>
                <li>• <span className="text-cream/90 font-medium">Doc Exchange/TMF:</span> Document exchange between sponsor and site with intelligent document type tagging for proper filing.</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Shield className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Differentiation</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Site-first design philosophy: core architecture provides workflow value to sites, with data as a secondary output of doing the work</li>
                <li>• All products built natively with own e-signature, security, and document markup — no dependency on DocuSign, Box, or third parties</li>
                <li>• #1 ranked clinical trial technology for 6 consecutive years; created the eISF category; ~5x ahead of closest competitor</li>
                <li>• Unified data model — sites and sponsors see the same data with different views</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Lock className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Switching Friction / Compliance</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• 85% of eBinders code is content creation, signature circulation, audit management, and version control</li>
                <li>• Full audit trail of every operational action (beyond just document creation)</li>
                <li>• GxP compliance: 21 CFR Part 11, SOC 2 Type 2, GDPR, HIPAA, Annex 11, ICH E6 R3</li>
                <li>• ~6 person regulatory team works closely with QA; uses Ketrix for compliance management</li>
                <li>• Integration APIs connect to CTMS, eTMF, identity systems (WCG Velos, TruLab, Yunu, Greenphire)</li>
              </ul>
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
                  <th className="text-left p-2 text-cream/80 font-medium">Quality</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Rights</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Replication</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Audit trail / milestone data (structured)</td>
                  <td className="p-2">Yes — on-platform</td>
                  <td className="p-2">High — 50-60% sponsor side very clean; 15-20% good from sites</td>
                  <td className="p-2 text-green-300">Business rights confirmed</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Document content (50M+ docs, 20K added/day)</td>
                  <td className="p-2">Yes — stored on platform</td>
                  <td className="p-2">Medium — mix of structured and unstructured</td>
                  <td className="p-2 text-yellow-300">Requires per-customer consent</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Site performance signals (enrollment, startup, compliance)</td>
                  <td className="p-2">Yes — derived from audit trail</td>
                  <td className="p-2">Medium-High — cross-sponsor view unique</td>
                  <td className="p-2 text-yellow-300">TBD / not clearly covered under business use</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">Flow Records (master metadata store)</td>
                  <td className="p-2">Yes — SQL store</td>
                  <td className="p-2">High — structured milestones, especially sponsor-generated</td>
                  <td className="p-2 text-green-300">Internal platform asset</td>
                  <td className="p-2 text-red-300 font-medium">Very High</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-cream/90">eConsent interaction data</td>
                  <td className="p-2">Yes</td>
                  <td className="p-2">Medium — consent completion rates, engagement</td>
                  <td className="p-2 text-yellow-300">HIPAA/GDPR constrained</td>
                  <td className="p-2 text-yellow-300">Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Database className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Data Architecture</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">MongoDB:</span> Primary data store for core product data</li>
                <li>• <span className="text-cream/90 font-medium">SQL:</span> SiteLink and Flow Records (master metadata)</li>
                <li>• <span className="text-cream/90 font-medium">S3:</span> 50M+ document storage</li>
                <li>• <span className="text-cream/90 font-medium">Three AWS regions:</span> US, EU, Australia (same codebase)</li>
                <li>• <span className="text-cream/90 font-medium">Tamer:</span> Data mastering tool for completeness and quality</li>
                <li>• <span className="text-cream/90 font-medium">Kafka:</span> Underway for improved pipeline speed, resilience, and cost</li>
                <li>• <span className="text-cream/90 font-medium">Data team:</span> 7 people under Philip</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Lock className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Two-Tier Data Rights</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-green-300 font-medium">Tier 1 — Audit trail / milestone data:</span> AutoTrail milestone data appears confirmed for business use. High quality and key differentiator.</li>
                <li>• <span className="text-yellow-300 font-medium">Tier 2 — Site performance data:</span> Rights TBD / not clearly covered under business use. This is the highest-value rights question.</li>
                <li>• <span className="text-yellow-300 font-medium">Tier 3 — Document content:</span> Apollo does NOT have rights to scrape/analyze without customer consent. Access obtained per-feature when customers opt in (e.g., Doc QC).</li>
              </ul>
            </div>
          </div>
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
              <h3 className="text-sm font-semibold text-cream mb-2">Site-Up Motion</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Started the business selling to sites only. First 100 customers were sites (took ~6 years).</li>
                <li>• Currently ~400 total customers.</li>
                <li>• In early days, activating a single site customer added ~50 study sites every couple of weeks.</li>
                <li>• Site Feasibility product seeded free to drive rapid adoption across site user base.</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Zap className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Sponsor-Down Motion</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• Sponsor adoption creates exponential site activation — during peak periods, 500 sites activated per week via sponsor deals.</li>
                <li>• Predictable pattern: ClinOps person at sponsor encounters Apollo at a site, endorses internally, sponsor buys SiteLink.</li>
                <li>• When a sponsor deploys SiteLink, all sites in that study are activated on Apollo — network-driven distribution.</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Target className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Named Anchor Customers</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-cream/90 font-medium">Merck:</span> Deployed in every study Merck launches. Pulling Apollo deeper via Doc QC demand (5,000 hrs/month manual QC).</li>
                <li>• <span className="text-cream/90 font-medium">Pfizer:</span> Deployed in every study Pfizer launches. Supported COVID-19 vaccine trials.</li>
                <li>• <span className="text-cream/90 font-medium">IQVIA:</span> Deployed in every FSO (Full-Service Outsourced) study IQVIA launches.</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="space-y-3">
                <div className="relative p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Sponsor Concentration</div>
                  <p className="text-xs text-cream/70">With 400 total customers and named anchors (Merck, Pfizer, IQVIA), sponsor concentration is a strength &mdash; deep embedding with top pharma creates durable revenue and co-development influence.</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 border-l-4 border-green-500/50">
                  <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Replication Difficulty</div>
                  <p className="text-xs text-cream/70">Dual-sided channel (site-up + sponsor-down) took a decade to build. Veeva has sponsor-down but lacks organic site-up adoption.</p>
                </div>
              </div>
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
              { name: 'Merck', detail: 'Deployed in every study Merck launches. Spending 5,000 hrs/month on manual document QC. Actively co-developing Doc QC use case with Apollo — wants site-level deployment to catch issues before submission, eliminating the review-return cycle.', tag: 'Anchor' },
              { name: 'Pfizer', detail: 'Deployed in every study Pfizer launches. Apollo supported Pfizer\'s COVID-19 vaccine clinical trials.', tag: 'Anchor' },
              { name: 'IQVIA', detail: 'Deployed in every FSO (Full-Service Outsourced) study IQVIA launches.', tag: 'Anchor' },
              { name: 'WCG Clinical (Partner since Nov 2023)', detail: 'Integration between Apollo eBinders and WCG ClinTech/ClinSphere for IRB, training, and safety letter document flow. eConsent product has completed IRB integrations — consent forms flow from IRB, creating intersection with WCG\'s IRB business.', tag: 'Strategic' },
              { name: 'Insight Partners (Lead Investor)', detail: 'Led Series C ($80M) and C-1 ($27M). Significant board influence likely.', tag: 'Financial' },
              { name: 'Technology Partners', detail: 'Greenphire, TruLab, Yunu, WCG Velos. EMR integration via "print to file" (~25% of customers). Currently point-to-point integrations; working with a partner to build middleware bus for out-of-box integrations.', tag: 'Integration' },
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
            <p className="text-xs text-cream/70"><span className="text-green-300 font-medium">Durability:</span> Named anchor customers (Merck, Pfizer, IQVIA) represent deep operational embedding — Apollo is infrastructure for their clinical operations, not a discretionary tool. Merck co-development relationship suggests design partner influence on roadmap. Relationships are non-exclusive.</p>
          </div>
        </div>
  )

  slideContentMap['team-ops-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Team + Operating Model — Executive Summary</h2>
          </div>
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl mb-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <StatusDot color={'yellow' as const} />
              <span className="text-sm font-semibold text-cream">Rating: YELLOW (Medium)</span>
            </div>
            <p className="text-xs text-cream/70">Right team for network build + penetration. The next growth phase (services + monetization expansion) may require different leadership capabilities. Engineering scale appears high relative to &ldquo;document-management-like&rdquo; scope; execution efficiency is unclear.</p>
          </div>
          <div className="space-y-3">
            {[
              { dim: 'Execution', rating: 'MEDIUM-HIGH', why: 'CEO + CTO are co-founders with ~10 years building the network. CTO Andres Garcia leads OCTO for innovation POCs. COO Shankar Jagannathan owns product + engineering execution.' },
              { dim: 'Engineering Leadership', rating: 'MEDIUM', why: 'COO Shankar + VP Engineering Kapil Bage (~1.5 yrs) + VP-level domain leads. Apparent over-investment in engineering and unclear efficiency relative to product scope.' },
              { dim: 'Product Team', rating: 'MEDIUM-HIGH', why: '18 PMs total. Deliberately diminishing UX role as AI tools (Vercel) used for rapid prototyping by PMs directly.' },
              { dim: 'Regulatory & Compliance', rating: 'HIGH', why: '~6 person regulatory team works closely with QA for GxP compliance. Uses Ketrix for compliance management. Each feature/unit test tagged for 21 CFR compliance.' },
              { dim: 'Overall Headcount', rating: 'LOW-MEDIUM', why: '~115 total: ~91 engineering (53 developers, 7 data, DevOps CoE, QA), ~18 product, ~6 regulatory. Engineering scale appears high relative to product scope — feels over-resourced for largely document-management-like functionality.' },
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
                  <th className="text-left p-2 text-cream/80 font-medium">Role</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Scope</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Context</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  ['Ryan Jones', 'CEO / Co-Founder', 'Company strategy, vision, customer relationships', 'Co-founder, ~10 years'],
                  ['Andres Garcia', 'CTO / Co-Founder', 'OCTO — bleeding edge technology, innovation POCs, AI architecture', 'Co-founder, ~10 years. Leads small team focused on emerging tech. Hands off productionized work.'],
                  ['Shankar Jagannathan', 'COO', 'Product + Engineering execution, operational cadence', 'Recruited; owns the build-and-ship engine. Previously worked with Sri.'],
                  ['Kapil Bage', 'VP Engineering', 'Engineering operations, AI-augmented SDLC, developer tooling', '~1.5 years. Deep data/AI background. Drove AIDLC adoption.'],
                  ['Sri', 'VP Platform + Sponsor Products', 'Platform architecture, sponsor-side product engineering', 'Deep enterprise customer experience. Previously worked with Shankar.'],
                  ['Jelena', 'VP Site Products + Serbia Ops', 'Site-side product engineering, Serbia team management', 'Manages all Serbian engineering. Harmonizes roadmaps across products.'],
                  ['Philip', 'Data Team Lead', 'Data mastering, data stores, API exposure', 'US-based. 7-person team managing Tamer, Flow Records, data pipeline.'],
                  ['Nicola', 'DevOps Lead', 'Centralized DevOps CoE', 'Runs DevOps as a center of excellence.'],
                  ['Mariana', 'QA Lead', 'Quality assurance, regulatory compliance testing', 'Works closely with regulatory team. Each feature/unit test tagged for 21 CFR compliance.'],
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
          <div className="p-3 rounded-lg bg-sage-500/10 border border-sage-500/20">
            <div className="text-xs uppercase tracking-wider text-sage-300 mb-1">Organizational Layers</div>
            <ul className="text-xs text-cream/70 space-y-1">
              <li>• Ryan + Andres (founders) &rarr; Strategic direction + innovation</li>
              <li>• Shankar &rarr; Operational ownership of product + engineering</li>
              <li>• Kapil, Sri, Jelena &rarr; VP-level domain leads</li>
              <li>• Philip, Nicola, Mariana &rarr; Functional leads (data, DevOps, QA)</li>
              <li>• ~6 person regulatory team &rarr; Cross-cutting compliance function</li>
            </ul>
          </div>
        </div>
  )

  slideContentMap['functional-coverage'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-taupe-300 mb-2">Chapter D — Team + Operating Model</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Functional Coverage &amp; Resourcing</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b-2 border-taupe-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Function</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Headcount</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  ['Engineering (total)', '~91 ⬤', 'Includes developers, data, DevOps, QA'],
                  ['— Developers', '~53', 'Core product engineering (hands-on-keyboard)'],
                  ['— Data team', '7', 'Under Philip; data mastering, stores, APIs'],
                  ['— DevOps', 'Centralized CoE', 'Under Nicola; not separately sized'],
                  ['— QA', 'Team under Mariana', 'Not separately sized'],
                  ['Product (total)', '~18', 'Mostly PMs; UX deliberately diminished (AI tools used for prototyping)'],
                  ['Regulatory', '~6', 'Cross-cutting; works with QA on compliance'],
                  ['Total (Eng + Product + Reg)', '~115', ''],
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-cream/5 ${i === 7 ? 'font-semibold text-cream/90' : ''}`}>
                    <td className="p-2 font-medium text-cream/90">{row[0]}</td>
                    <td className="p-2">{row[1]}</td>
                    <td className="p-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Users className="w-5 h-5 text-taupe-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Workforce Composition</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• 85-90% captive employees (full-time)</li>
                <li>• 10-15% contractors</li>
                <li>• Deliberately increasing contractor capacity for flexibility</li>
                <li>• Majority of engineering is Serbia-based (managed by Jelena)</li>
                <li>• Data team (Philip) and some leadership are US-based</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-2">Balance Assessment</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>• <span className="text-yellow-300 font-medium">Engineering scale:</span> Engineering appears high relative to product scope; unclear if driven by custom deployments &mdash; feels over-resourced for largely document-management-like functionality</li>
                <li>• <span className="text-cream/90 font-medium">Data as % of eng:</span> ~8% (7/91) — reasonable but may need to scale as AI products expand</li>
                <li>• <span className="text-cream/90 font-medium">Regulatory:</span> 6 people for GxP platform serving 65K sites — lean but effective with Ketrix tooling</li>
                <li>• <span className="text-red-300 font-medium">Missing function:</span> No real operations function today; if services model is the goal, this capability is non-existent</li>
              </ul>
            </div>
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
              { dim: 'SDLC Process + AI-Augmented Development', score: 3, label: 'Developing', obs: 'Beta → GA lifecycle for established products; LA process with ~10 test customers for new products. "AIDLC" concept using Claude, Cursor, Vercel. Kapil drove adoption. Moving CI/CD to GitHub Actions.' },
              { dim: 'Product', score: 3, label: 'Developing', obs: 'Pendo for feature usage tracking. Tableau exposed through services team. AG Grid for in-product charts/tables. Data team builds feeds for product consumption.' },
              { dim: 'Engineering', score: 3, label: 'Developing', obs: 'Jellyfish for velocity and story point tracking. Used for engineering performance management.' },
              { dim: 'DevOps / Infrastructure', score: 3, label: 'Developing', obs: 'Centralized DevOps CoE under Nicola. 100% AWS. Moving from Orchis to AWS Step Functions (completing this quarter). CloudWatch + New Relic for monitoring. RabbitMQ / Amazon MQ for messaging.' },
              { dim: 'Data Infrastructure', score: 2, label: 'Early', obs: 'Vision exists but implementation not in place. MongoDB primary, SQL for SiteLink/Flow Records. Tamer for data mastering. Kafka underway. Data quality: 50-60% very clean (sponsor), 15-20% good (sites).' },
              { dim: 'Security & Compliance', score: 4, label: 'Strong', obs: 'SOC 2 Type 2, 21 CFR Part 11, GDPR, HIPAA, Annex 11, ICH E6 R3. AWS architecture-approved partner. Dedicated regulatory team + QA partnership. Ketrix for compliance management.' },
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
            <p className="text-sm text-cream/50">Internal vs External AI Value</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-cream">External AI Value (Customer-Facing)</h3>
                <RatingBadge rating="YELLOW" />
              </div>
              <p className="text-[10px] text-cream/40 mb-2">Early but Well-Directed</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Site Feasibility:</span> LA with ~10 test customers; knowledge library auto-completion</li>
                <li>&bull; <span className="text-cream/90 font-medium">Site Selection:</span> LA; API-first for enterprise integration</li>
                <li>&bull; <span className="text-cream/90 font-medium">Doc QC:</span> Active dev (OCTO); strong sponsor pull from Merck</li>
                <li>&bull; <span className="text-cream/90 font-medium">Risk-Based Reporting:</span> Active dev; structured + unstructured data overlay</li>
                <li className="p-1.5 rounded-lg border-2 border-gold/40 bg-gold/5">&bull; <span className="text-gold font-medium">Trial Flow (Primary Growth Bet):</span> POC; workflow orchestration with task dependencies. Unclear they have data structure to support it.</li>
              </ul>
              <p className="text-[10px] text-cream/50 mt-2">AI-specific revenue: $0 entering 2026. Target: $3M ARR from three new AI SKUs.</p>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-cream">Internal AI Value (Engineering Productivity)</h3>
                <RatingBadge rating="YELLOW" />
              </div>
              <p className="text-[10px] text-cream/40 mb-2">Claimed AI development isn&apos;t reflected in productivity; team scale suggests limited leverage</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">AIDLC:</span> AI-augmented SDLC &mdash; Claude (primary) + Cursor across 53 developers</li>
                <li>&bull; <span className="text-cream/90 font-medium">Vercel for PMs:</span> PMs prototype directly, reducing UX dependency</li>
                <li>&bull; <span className="text-cream/90 font-medium">AI for QA:</span> &ldquo;Functionalize on QA side&rdquo; &mdash; automating test generation/execution</li>
              </ul>
              <p className="text-[10px] text-cream/50 mt-2">VP Engineering Kapil Bage drove adoption with deep AI/data background.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gold/10 border-l-4 border-gold/50">
            <p className="text-xs text-cream/70"><span className="text-gold font-medium">Design Principle:</span> Human-in-the-loop (HITL) is a firm design principle for all GxP-regulated workflows. Deterministic processing first (Tesseract OCR), LLM only when semantic understanding required. All AI via AWS Bedrock.</p>
          </div>
          <div className="p-3 rounded-xl bg-sage-500/10 border-l-4 border-sage-500">
            <p className="text-xs text-cream/70"><span className="text-sage-300 font-medium">Chapter E Summary:</span> Apollo has automation-focused features within products and a longer-term TrialFlow ambition, but the enabling data system is not in place; internal AI leverage appears early-stage and not reflected organizationally.</p>
          </div>
        </div>
  )

  slideContentMap['ai-inventory'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gold mb-2">Chapter E — AI Assessment</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Inventory (What Exists)</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-gold/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[110px]">AI Capability</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Stage</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Description</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Revenue Model</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Key Evidence</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  { cap: 'Trial Flow / Flowbot', stage: 'POC / Deployed', desc: 'Workflow orchestration with task dependencies for study startup (like Monday.com/MS Project). FlowBot AI assistant embedded in eBinders for role-based onboarding.', rev: 'TBD / Bundled with eBinders', evidence: 'Highest interest; primary growth bet' },
                  { cap: 'Site Feasibility', stage: 'Limited Availability', desc: 'Knowledge library auto-completion of feasibility questionnaires. 500–1,000 questionnaires/yr per site.', rev: '~$500/study site add-on', evidence: '~10 test customers in LA' },
                  { cap: 'Site Selection', stage: 'Limited Availability', desc: 'Sponsor-side search by TA, geography, performance. API-first for enterprise integration.', rev: 'Part of sponsor platform (TBD)', evidence: 'API-first design for large pharma scoring' },
                  { cap: 'Doc QC', stage: 'Active Dev (OCTO)', desc: 'Tesseract OCR (deterministic) + LLM (semantic). Blank pages, readability, ordering, title-content matching.', rev: 'Independent SKU, consumption-based pricing', evidence: 'Merck: 5K hrs/month manual QC' },
                  { cap: 'Risk-Based Reporting', stage: 'Active Dev', desc: 'Structured + unstructured data overlay. Heat maps, exec summaries, recommended actions.', rev: 'Independent SKU', evidence: 'Built on 7.2M monthly workflows' },
                  { cap: 'Operational Audit Trails', stage: 'Deployed (Free)', desc: 'AI-enhanced consumption of audit trail data. Launched late 2025 as free feature.', rev: 'Free (adoption driver)', evidence: 'First AI feature shipped; $0 revenue by design' },
                  { cap: 'AIDLC (Internal)', stage: 'Deployed', desc: 'Claude + Cursor (53 devs), Vercel (PMs), AI for QA functionalization.', rev: 'N/A (internal productivity)', evidence: 'Organization-wide adoption' },
                ].map((c) => (
                  <tr key={c.cap} className="border-b border-cream/5">
                    <td className="p-2 font-medium text-cream/90">{c.cap}</td>
                    <td className="p-2"><span className="text-[9px] font-mono bg-gold/10 text-gold px-1.5 py-0.5 rounded">{c.stage}</span></td>
                    <td className="p-2">{c.desc}</td>
                    <td className="p-2">{c.rev}</td>
                    <td className="p-2">{c.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/10 border-l-4 border-yellow-500/50 mb-2">
            <p className="text-xs text-cream/70"><span className="text-yellow-300 font-medium">Overarching Assessment:</span> Many AI initiatives appear to lack a clear monetization/value path; tighten to a smaller set with explicit value capture logic.</p>
          </div>
          <div className="p-3 rounded-xl bg-cream/5 border border-cream/10 mb-2">
            <p className="text-xs text-cream/70"><span className="text-gold font-medium">AI Architecture:</span> All AI via AWS Bedrock. HITL for GxP. Deterministic-first (Tesseract OCR), LLM only for semantic checks. No fine-tuned or custom models disclosed.</p>
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
              <h3 className="text-sm font-semibold text-cream mb-2">Application Architecture</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <tbody className="text-cream/70">
                    {[
                      ['Frontend', 'Angular (various) + TypeScript'],
                      ['Backend', 'Node.js'],
                      ['Primary DB', 'MongoDB'],
                      ['Relational DB', 'SQL (SiteLink, Flow Records)'],
                      ['Object Storage', 'S3 (50M+ docs)'],
                      ['Cloud', 'AWS 100%, architecture-approved partner'],
                      ['Regions', 'US, EU, Australia (same codebase)'],
                      ['Orchestration', 'AWS Step Functions (migrating from Orchis)'],
                      ['Messaging', 'RabbitMQ / Amazon MQ'],
                      ['AI Services', 'AWS Bedrock'],
                      ['OCR', 'Tesseract'],
                      ['CI/CD', 'GitHub Actions (migration in progress)'],
                      ['Monitoring', 'CloudWatch + New Relic'],
                      ['Product Analytics', 'Pendo'],
                      ['Eng Metrics', 'Jellyfish'],
                      ['Compliance', 'Ketrix'],
                      ['Data Mastering', 'Tamer'],
                      ['Data Pipeline', 'Kafka (future)'],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-cream/5">
                        <td className="p-1.5 font-medium text-cream/90 w-28">{row[0]}</td>
                        <td className="p-1.5">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3">AI Readiness Assessment</h3>
              <div className="space-y-2">
                {[
                  { area: 'Cloud-native', status: 'ready' as const, note: '100% AWS with Bedrock access — no infra migration needed for AI' },
                  { area: 'Data Availability', status: 'ready' as const, note: '7.2M workflows/mo, 5.8M monitoring activities accessible for AI' },
                  { area: 'Data Quality', status: 'developing' as const, note: 'Mixed: 50–60% very clean (sponsor), 15–20% good (site), ~25% lower. Tamer addressing.' },
                  { area: 'Data Pipeline', status: 'developing' as const, note: 'Adequate but Kafka migration needed for AI-scale real-time processing' },
                  { area: 'Observability', status: 'developing' as const, note: 'CloudWatch + New Relic functional but no AI-specific monitoring (model drift, inference latency)' },
                  { area: 'Compliance Readiness', status: 'ready' as const, note: 'Strong GxP infra (Ketrix, regulatory team, tagged unit tests)' },
                  { area: 'Integration Architecture', status: 'developing' as const, note: 'Point-to-point currently. Middleware bus project underway' },
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
              <div className="mt-3 pt-3 border-t border-cream/10">
                <div className="text-[10px] uppercase tracking-wider text-red-300 mb-1">Architecture Debt / Risk</div>
                <ul className="text-[10px] text-cream/60 space-y-0.5">
                  <li>&bull; Angular version fragmentation across products may slow unified AI feature deployment</li>
                  <li>&bull; Orchestration migration (Orchis &rarr; Step Functions) in-flight</li>
                  <li>&bull; No mention of feature flagging system for AI rollout management</li>
                  <li>&bull; MongoDB may challenge relational queries needed by AI analytics</li>
                </ul>
              </div>
            </div>
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
              <h3 className="text-xs uppercase tracking-wider text-purple-300 mb-3">External AI Value (Customer-Facing)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b-2 border-purple-500/40">
                      <th className="text-left p-1.5 text-cream/80 font-medium">AI Capability</th>
                      <th className="text-left p-1.5 text-cream/80 font-medium">Value Bucket</th>
                      <th className="text-left p-1.5 text-cream/80 font-medium">Proof Point</th>
                    </tr>
                  </thead>
                  <tbody className="text-cream/70">
                    {[
                      { cap: 'TrialFlow', bucket: 'Time + Cost', proof: 'Intelligent orchestration of trial operations; value in both time and cost' },
                      { cap: 'Doc QC', bucket: 'Cost Reduction', proof: 'Merck: 5K hrs/month manual QC' },
                      { cap: 'Site Feasibility', bucket: 'Time Compression', proof: '500–1K questionnaires/yr per site' },
                      { cap: 'Site Selection', bucket: 'Time Compression', proof: 'API-first for enterprise scoring' },
                      { cap: 'Risk-Based Reporting', bucket: 'Risk Reduction + Operational Intelligence', proof: 'Built on 7.2M monthly workflows' },
                    ].map((r) => (
                      <tr key={r.cap} className="border-b border-cream/5">
                        <td className="p-1.5 font-medium text-cream/90">{r.cap}</td>
                        <td className="p-1.5"><span className="text-[9px] font-mono bg-purple-500/10 text-purple-300 px-1 py-0.5 rounded">{r.bucket}</span></td>
                        <td className="p-1.5">{r.proof}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-2 mt-2 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <p className="text-[10px] text-cream/60"><span className="text-purple-300 font-medium">Strongest near-term:</span> Doc QC (quantified pain at named customer) and Site Feasibility (quantified workflow burden). <span className="text-purple-300 font-medium">Highest uncertainty:</span> Site Selection (&ldquo;part of the data sets they&apos;ll consider&rdquo;).</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider text-sage-300 mb-3">Internal AI Value (Engineering Productivity)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b-2 border-sage-500/40">
                      <th className="text-left p-1.5 text-cream/80 font-medium">AI Capability</th>
                      <th className="text-left p-1.5 text-cream/80 font-medium">Value Bucket</th>
                      <th className="text-left p-1.5 text-cream/80 font-medium">Proof Point</th>
                    </tr>
                  </thead>
                  <tbody className="text-cream/70">
                    {[
                      { cap: 'AIDLC (Claude, Cursor)', bucket: 'Dev Velocity', proof: '53 developers, org-wide adoption' },
                      { cap: 'Vercel for PMs', bucket: 'Design Speed', proof: 'UX team deliberately reduced' },
                      { cap: 'AI for QA', bucket: 'QA Efficiency', proof: 'Early stage, directionally positive' },
                    ].map((r) => (
                      <tr key={r.cap} className="border-b border-cream/5">
                        <td className="p-1.5 font-medium text-cream/90">{r.cap}</td>
                        <td className="p-1.5"><span className="text-[9px] font-mono bg-sage-500/10 text-sage-300 px-1 py-0.5 rounded">{r.bucket}</span></td>
                        <td className="p-1.5">{r.proof}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-2 mt-2 rounded-lg bg-sage-500/5 border border-sage-500/20">
                <p className="text-[10px] text-cream/60">Internal AI value is real but difficult to quantify without before/after velocity metrics. &ldquo;Significant&rdquo; acceleration reported but not quantified on the call.</p>
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
            <p className="text-xs text-cream/40 italic">These are examples; not comprehensive.</p>
          </div>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded">1</span>
                <h3 className="text-sm font-semibold text-cream">Document Quality Control (Doc QC)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-cream/40 font-medium">What it does:</span>
                  <p className="text-cream/70 mt-0.5">Deterministic pipeline (Tesseract OCR) + LLM for semantic checks. Blank pages, readability, page ordering, title-content matching. HITL for GxP.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Value evidence:</span>
                  <p className="text-cream/70 mt-0.5">Merck: 5,000 hrs/month on manual QC. Requesting site-level deployment to catch issues pre-submission.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Pricing:</span>
                  <p className="text-cream/70 mt-0.5">Independent SKU. Consumption-based pricing under consideration given variable LLM costs per document.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Replicability:</span>
                  <p className="text-cream/70 mt-0.5"><RatingBadge rating="MEDIUM-HIGH" /> Requires dual-sided platform + clinical doc expertise. Standalone AI doc-checking tools lack workflow integration.</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded">2</span>
                <h3 className="text-sm font-semibold text-cream">Site Feasibility (AI-Assisted Questionnaire Completion)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-cream/40 font-medium">What it does:</span>
                  <p className="text-cream/70 mt-0.5">Knowledge library auto-completion of feasibility questionnaires across formats (web forms, PDFs, uploads). Sites review and confirm.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Value evidence:</span>
                  <p className="text-cream/70 mt-0.5">Sites receive 500&ndash;1,000 questionnaires/year. Auto-completion saves hundreds of hours annually. ~10 test customers in LA.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Pricing:</span>
                  <p className="text-cream/70 mt-0.5">~$500/study site add-on to core eBinders product.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Replicability:</span>
                  <p className="text-cream/70 mt-0.5"><RatingBadge rating="HIGH" /> Difficulty &mdash; requires 65K+ site network for meaningful knowledge libraries + site trust.</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded">3</span>
                <h3 className="text-sm font-semibold text-cream">Risk-Based Reporting</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-cream/40 font-medium">What it does:</span>
                  <p className="text-cream/70 mt-0.5">Overlays structured workflow data with unstructured data (comments, notifications, emails). Produces risk heat maps, exec summaries, recommended actions.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Value evidence:</span>
                  <p className="text-cream/70 mt-0.5">Built on 7.2M monthly workflows and 5.8M remote monitoring activities. Aggregatable by study, site, TA.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Pricing:</span>
                  <p className="text-cream/70 mt-0.5">Independent SKU (pricing TBD). Both site-facing and sponsor-facing versions planned.</p>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Replicability:</span>
                  <p className="text-cream/70 mt-0.5"><RatingBadge rating="MEDIUM-LOW" /> Very high difficulty &mdash; requires operational data across 65K sites + cross-sponsor neutral platform view.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )

  slideContentMap['synergies-exec'] = (
        <div className="space-y-6 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer &harr; Target Synergies</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Synergies — Executive Summary</h2>
            <p className="text-sm text-cream/50">WCG &harr; Apollo synergy thesis well-supported.</p>
          </div>
          <RatingBadge rating="GREEN" size="lg" />
          <p className="text-xs text-cream/60 mt-1">Multiple validated integration points with quantifiable value potential.</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2">Tier 1: Validated (Unvalidated)</h3>
              <p className="text-[10px] text-cream/50 mb-2">Product can be dropped in</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">IRB &rarr; eConsent:</span> Integration already built. Consent forms flow from IRB to sites through Apollo.</li>
                <li>&bull; <span className="text-cream/90 font-medium">Document Flow:</span> eBinders &harr; ClinTech/ClinSphere active. 250K+ exchanges/yr target.</li>
                <li>&bull; <span className="text-cream/90 font-medium">Doc QC via WCG sponsor network:</span> WCG&apos;s sponsor relationships as distribution channel.</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Tier 2: Logical</h3>
              <p className="text-[10px] text-cream/50 mb-2">Combining the product suite yields synergy</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Combined Data Asset:</span> WCG protocol/IRB data + Apollo site ops data = unique intelligence layer</li>
                <li>&bull; <span className="text-cream/90 font-medium">Channel Expansion:</span> WCG&apos;s 3,500+ sponsor relationships accelerate Apollo site deployment</li>
                <li>&bull; <span className="text-cream/90 font-medium">Site Selection + WCG Total Enrollment:</span> Apollo site performance data enhances enrollment prediction</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Tier 3: Speculative</h3>
              <p className="text-[10px] text-cream/50 mb-2">Product + data informs operations synergistic with WCG operations</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">TrialFlow:</span> Blocked by missing data systems + missing operational talent; speculative value creation path</li>
                <li>&bull; <span className="text-cream/90 font-medium">Unified Site Enablement Platform:</span> IRB + consent + regulatory docs + training + safety letters in single workflow</li>
                <li>&bull; <span className="text-cream/90 font-medium">EMR Recruitment Intelligence:</span> Apollo&apos;s &ldquo;print to file&rdquo; EMR data (~25% of customers) as foundation</li>
              </ul>
            </div>
          </div>
        </div>
  )

  slideContentMap['synergy-matrix'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer &harr; Target Synergies</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Synergy Connections Mapped to Assets</h2>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-blue-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium min-w-[120px]">Apollo Asset</th>
                  <th className="text-left p-2 text-cream/80 font-medium">WCG Asset</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Connection Type</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Value Generated</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Validation</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  { apollo: 'eConsent (IRB integrations)', wcg: 'IRB Services (largest globally)', conn: 'Product Integration', val: 'Streamlined consent workflow; reduced cycle time', level: 'HIGH', levelNote: 'integration built' },
                  { apollo: 'eBinders / Doc workflows', wcg: 'ClinTech / ClinSphere', conn: 'Data Exchange', val: '250K+ doc exchanges/yr; automated regulatory flow', level: 'HIGH', levelNote: 'integration active' },
                  { apollo: 'Doc QC (AI)', wcg: 'Sponsor relationships (3,500+)', conn: 'Channel', val: 'Distribute Doc QC via WCG channel; Merck proof point', level: 'MEDIUM', levelNote: 'product in dev' },
                  { apollo: 'Site performance data (65K)', wcg: 'Total Enrollment', conn: 'Data Combination', val: 'Site-level enrollment prediction from historical data', level: 'MEDIUM', levelNote: 'data exists, product doesn’t' },
                ].map((r) => (
                  <tr key={r.apollo} className="border-b border-cream/5">
                    <td className="p-2 font-medium text-cream/90">{r.apollo}</td>
                    <td className="p-2 text-blue-300">{r.wcg}</td>
                    <td className="p-2">{r.conn}</td>
                    <td className="p-2">{r.val}</td>
                    <td className="p-2"><span className={`font-bold ${r.level === 'HIGH' ? 'text-green-300' : 'text-yellow-300'}`}>{r.level}</span> <span className="text-cream/40">&mdash; {r.levelNote}</span></td>
                  </tr>
                ))}
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
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer &harr; Target Synergies</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Synergy Detail (Selected Connections)</h2>
          </div>
          <div className="space-y-3 mt-4">
            {[
              {
                num: '1', title: 'eConsent ↔ WCG IRB',
                value: 'eConsent growing 75% YoY. IRB integration complete — consent forms already flow from IRB through Apollo. Every WCG IRB approval could trigger site-level consent deployment.',
                prereq: 'Low complexity — integration pathways already exist',
                constraint: 'Accelerates eConsent adoption across WCG’s IRB customer base (~3,500+ sponsors)'
              },
              {
                num: '2', title: 'Doc QC → WCG Sponsor Channel',
                value: 'Merck validated pain point (5K hrs/month). WCG introduces Doc QC to sponsor relationships → sponsors deploy across Apollo-connected sites. Combined sales motion.',
                prereq: 'Product not yet GA; pricing model TBD; consumption-based LLM costs need management',
                constraint: 'Premium AI SKU sold through combined channel; potential to reach sponsors not yet using Apollo'
              },
              {
                num: '3', title: 'Combined Data Asset (Protocol + Site Ops)',
                value: 'Apollo’s site-level performance data (enrollment speed, startup efficiency) + WCG protocol data (complexity scores, amendment rates, IRB cycle times) = predictive study feasibility model.',
                prereq: 'Data normalization; privacy/consent framework; new product development; 18+ month timeline',
                constraint: 'Unique data asset no competitor can replicate — requires both site-originated operational data AND protocol/IRB intelligence'
              },
              {
                num: '4', title: 'WCG Channel → Apollo Site Network',
                value: 'WCG’s 3,500+ sponsor relationships could accelerate Apollo site deployment beyond current 500/week peaks. Joint sales enablement.',
                prereq: 'Coordinated sales motion; compensation alignment; SSO federation between platforms',
                constraint: 'Apollo’s site-first brand identity must be maintained; sites may resist mandatory adoption'
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
                  <div><span className="text-red-300/60 font-medium">Impact:</span> <span className="text-cream/60">{conn.constraint}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )

  slideContentMap['synergy-waves'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Chapter F — Buyer &harr; Target Synergies</div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Synergy Pathways (3 Waves)</h2>
          </div>
          {/* Visual timeline bar */}
          <div className="flex items-center gap-0 mt-4 mb-2">
            {[
              { label: 'Wave 1: Distribution (0–6 mo)', color: 'bg-green-500', width: 'w-1/6' },
              { label: 'Wave 2: Rationalization + Data (6–18 mo)', color: 'bg-yellow-500', width: 'w-2/6' },
              { label: 'Wave 3: Services / Ops Lift (18–36 mo)', color: 'bg-purple-500', width: 'w-3/6' },
            ].map((w) => (
              <div key={w.label} className={`${w.width} flex flex-col items-center`}>
                <div className={`w-full h-3 ${w.color} first:rounded-l-full last:rounded-r-full`} />
                <span className="text-[9px] font-mono text-cream/40 mt-1">{w.label}</span>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2">Wave 1: Distribution</h3>
              <p className="text-[10px] text-cream/40 mb-2">0&ndash;6 months</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; Push Apollo products through WCG channels to drive product revenue uplift</li>
                <li>&bull; Joint sales enablement; WCG teams selling Apollo products</li>
                <li>&bull; Deploy Apollo to WCG-connected sites</li>
                <li>&bull; Accelerate eConsent &harr; IRB integration deployment</li>
              </ul>
              <p className="text-[10px] text-cream/50 mt-2 italic">Supporting connections: Doc integration (already live), eConsent + IRB, channel cross-sell, SSO federation</p>
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Wave 2: Rationalization + Data Foundation</h3>
              <p className="text-[10px] text-cream/40 mb-2">6&ndash;18 months</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; Rationalize Apollo + WCG product sets</li>
                <li>&bull; Invest in an underlying combined data asset</li>
                <li>&bull; Launch Doc QC through WCG sponsor channel</li>
                <li>&bull; Combined data product: Apollo site performance + WCG protocol/IRB data</li>
              </ul>
              <p className="text-[10px] text-cream/50 mt-2 italic">Supporting connections: middleware bus, unified customer success, Site Selection enrichment</p>
            </div>
            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Wave 3: Services / Operations Lift</h3>
              <p className="text-[10px] text-cream/40 mb-2">18&ndash;36 months</p>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; Use combined data asset + WCG operational capabilities to deliver services/workflow improvements</li>
                <li>&bull; Unlock additional value via service-enabled model</li>
                <li>&bull; Unified site enablement: protocol &rarr; IRB &rarr; consent &rarr; regulatory docs &rarr; monitoring</li>
                <li>&bull; Predictive enrollment models leveraging combined operational data</li>
              </ul>
              <p className="text-[10px] text-cream/50 mt-2 italic">Supporting connections: AI-powered study design, TrialFlow integration, full platform unification</p>
            </div>
          </div>
        </div>
  )

  slideContentMap['priority-initiatives'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-red-400 mb-2">Chapter G — Quantified Impact</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Priority Initiatives — Assumptions + Uplift</h2>
            <p className="text-xs text-cream/50">Illustrative models using diligence data points. NOT projections &mdash; frameworks for discussion requiring validation with data room financials.</p>
          </div>
          <div className="space-y-4 mt-4">
            {[
              {
                num: '1', title: 'eConsent Acceleration via WCG IRB',
                buckets: 'Growth, Channel Leverage',
                assumptions: ['eConsent growing 75% YoY already', 'WCG IRB serves 3,500+ sponsors', '10% conversion of WCG IRB users to Apollo eConsent within 18 months', 'eConsent current site count and pricing (not disclosed)'],
                output: 'Incremental eConsent ARR via WCG channel',
                confidence: 'Medium — growth rate validated, WCG channel unvalidated'
              },
              {
                num: '2', title: 'Doc QC Launch via WCG Sponsor Channel',
                buckets: 'Premium AI SKU Revenue',
                assumptions: ['2026 target: $3M total AI ARR', 'Merck validated 5K hrs/month pain point', 'Consumption-based pricing under consideration', 'If 20 large sponsors adopt at $100K–$500K/yr each = $2M–$10M ARR range'],
                output: 'AI-specific ARR from Doc QC through WCG channel',
                confidence: 'Low — product not yet GA, pricing TBD'
              },
              {
                num: '3', title: 'Site Network Expansion via WCG Channel',
                buckets: 'Network Growth, Site Revenue',
                assumptions: ['Current peak: 500 sites/week via sponsors', 'WCG has 3,500+ sponsor relationships', '5% of non-Apollo WCG sponsors adopt in Year 1', 'Each sponsor averages 50 sites/study × 3 studies/yr at ~$1,500/site'],
                output: 'Incremental site-level ARR from WCG-driven deployments',
                confidence: 'Medium — channel mechanism validated, conversion rate speculative'
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
                    <span className="text-[10px] text-cream/40 font-medium">Key Assumptions:</span>
                    <ul className="mt-1 space-y-0.5">
                      {init.assumptions.map((a, i) => (
                        <li key={i} className="text-[10px] text-cream/60 flex items-start gap-1">
                          <span className="text-cream/30 mt-px">&bull;</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] text-cream/40 font-medium">Output Metric:</span>
                    <p className="text-xs text-cream/70 mt-1">{init.output}</p>
                    <span className="text-[10px] text-cream/40 font-medium mt-2 block">Confidence:</span>
                    <p className="text-[10px] text-cream/50">{init.confidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <p className="text-xs text-cream/70"><span className="text-red-300 font-medium">Key Sensitivity Variables:</span> (1) Apollo&apos;s actual current ARR (not disclosed), (2) WCG channel conversion rate for Apollo products, (3) Doc QC pricing and LLM cost structure, (4) Integration timeline and execution risk, (5) Veeva competitive response timing.</p>
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
                  <th className="text-left p-2 text-cream/80 font-medium">Scenario</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Key Assumption Changes</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Growth Impact vs. Baseline</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-green-300">High Case</td>
                  <td className="p-2">WCG channel converts 15%+ sponsors in Year 1; Doc QC achieves $5M+ ARR; eConsent maintains 75% growth; site network exceeds 100K by 2027; AI adoption 25%+</td>
                  <td className="p-2">Significant acceleration &mdash; combined entity growth rate meaningfully above Apollo standalone</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-yellow-300">Medium Case (Base)</td>
                  <td className="p-2">WCG channel converts 5&ndash;10% sponsors; Doc QC achieves $1&ndash;3M ARR; eConsent growth moderates to 40&ndash;50%; site network reaches 80&ndash;90K; AI adoption 10&ndash;15%</td>
                  <td className="p-2">Moderate acceleration &mdash; synergy value adds 10&ndash;20% growth above standalone trajectory</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Integration Accelerant (WCG-Specific)</td>
                  <td className="p-2">WCG acquisition closes; IRB&rarr;eBinders deepens (already underway); combined data asset enables unique intelligence; WCG channel deploys Apollo to thousands more sites; Doc QC via WCG sponsors</td>
                  <td className="p-2">Combined entity becomes dominant in site enablement + trial operations. Post-close Wave 1 under 6 months; Merck QC expands to 5+ pharma via WCG.</td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-red-300">Low Case</td>
                  <td className="p-2">Integration friction delays Wave 1 beyond 6 months; Doc QC delayed to 2027; Veeva accelerates competitive response; AI adoption below 10%; key personnel departure</td>
                  <td className="p-2">Minimal acceleration &mdash; synergy capture delayed; standalone growth trajectory applies for 12&ndash;18 months</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <div className="text-xs uppercase tracking-wider text-red-300 mb-2">Assumptions That Matter Most</div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: '1', title: 'Apollo baseline growth rate (without WCG)', detail: 'Not yet available &mdash; required for all financial modeling' },
                { num: '2', title: 'Integration execution speed', detail: 'Depends on technical and organizational readiness' },
                { num: '3', title: 'Veeva competitive response', detail: 'Response to acquisition announcement could accelerate SiteVault investment' },
                { num: '4', title: 'Key person retention', detail: 'Especially Andres, Shankar, Sri, Kapil, Philip through transition' },
                { num: '5', title: 'LLM cost trajectory', detail: 'If costs decline rapidly, AI product margins improve and adoption barriers lower' },
                { num: '6', title: 'WCG channel conversion rate', detail: 'Existing partnership is testable hypothesis; actual conversion data would validate cross-sell thesis' },
              ].map((a) => (
                <div key={a.num} className="flex items-start gap-2 text-xs">
                  <span className="text-red-300 font-mono flex-shrink-0">{a.num}.</span>
                  <div>
                    <span className="text-cream/90 font-medium">{a.title}</span>
                    <span className="text-cream/50"> &mdash; {a.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )

  /* ============================================================
   * DEEP DIVE SUPPLEMENT — DD-1 through DD-4
   * Follow-up deep dive slides addressing questions from diligence review
   * ============================================================ */

  slideContentMap['dd-veeva-consolidation'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-400 mb-2">Deep Dive Supplement — DD-1</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Veeva — Long-Term Platform Consolidation Threat</h2>
            <p className="text-cream/50 text-sm">As Veeva expands into a full-stack clinical platform, could sponsors consolidate spend onto Veeva and displace Apollo&apos;s US market share over a 3&ndash;5 year horizon?</p>
          </div>

          {/* Table 1: Site-Facing Products */}
          <div className="overflow-x-auto">
            <div className="text-xs font-semibold text-red-300 mb-1.5">Site-Facing Products (Veeva SiteVault)</div>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-orange-500/40">
                  <th className="text-left p-1.5 text-cream/80 font-medium">Product</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Function</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Cost to Sites</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  { product: 'SiteVault eISF', fn: 'Electronic investigator site file (direct eBinders competitor)', cost: 'Free — unlimited users and studies' },
                  { product: 'SiteVault eConsent', fn: 'Electronic informed consent', cost: 'Free — up to 20 active studies' },
                  { product: 'SiteVault CTMS', fn: 'Site-level trial management (launched Aug 2025)', cost: 'Free — up to 20 active studies' },
                  { product: 'eSource', fn: 'Direct data capture at sites, EHR/EDC integration (announced Jan 2026)', cost: 'Early adopter — H2 2026' },
                ].map((r) => (
                  <tr key={r.product} className="border-b border-cream/5">
                    <td className="p-1.5 font-medium text-cream/90">{r.product}</td>
                    <td className="p-1.5">{r.fn}</td>
                    <td className="p-1.5"><span className="text-red-300">{r.cost}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table 2: Sponsor-Facing Products */}
          <div className="overflow-x-auto">
            <div className="text-xs font-semibold text-orange-300 mb-1.5">Sponsor-Facing Products (Veeva Vault Clinical Suite)</div>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-orange-500/40">
                  <th className="text-left p-1.5 text-cream/80 font-medium">Product</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Function</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Buyer</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  { product: 'Vault eTMF', fn: 'Sponsor-side trial master file' },
                  { product: 'Vault CTMS', fn: 'Sponsor-side clinical trial management' },
                  { product: 'Vault EDC', fn: 'Electronic data capture' },
                  { product: 'Study Startup', fn: 'Site feasibility, qualification, activation' },
                  { product: 'Payments', fn: 'Site payment tracking and budget management' },
                  { product: 'Site Connect', fn: 'Sponsor↔site document exchange' },
                  { product: 'OpenData Clinical', fn: 'Curated site and investigator reference data' },
                ].map((r) => (
                  <tr key={r.product} className="border-b border-cream/5">
                    <td className="p-1.5 font-medium text-cream/90">{r.product}</td>
                    <td className="p-1.5">{r.fn}</td>
                    <td className="p-1.5 text-cream/50">Sponsor / CRO</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Strategic Risk Callout */}
          <div className="p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500/50">
            <p className="text-xs text-cream/90 font-semibold leading-relaxed">
              The strategic risk is the connection between these two tables: sponsors standardizing on the Vault Clinical Suite get a zero-friction path to deploying free SiteVault at their sites, displacing Apollo without a separate procurement decision.
            </p>
          </div>

          {/* Key Facts */}
          <div className="p-4 rounded-xl bg-orange-500/10 border-l-4 border-orange-500/50">
            <div className="text-xs uppercase tracking-wider text-orange-300 mb-2">Key Facts</div>
            <ul className="space-y-1.5 text-xs text-cream/70">
              <li>&bull; <span className="text-cream/90 font-medium">FY2026 revenue: $3.2B</span> (up 16% YoY); R&amp;D Solutions subscription ($1.4B) now exceeds Commercial ($1.3B)</li>
              <li>&bull; <span className="text-cream/90 font-medium">20,000+ active sites</span> on Veeva products; 450+ sponsors connecting with 10,000+ study sites</li>
              <li>&bull; <span className="text-cream/90 font-medium">Veeva AI Agents</span> available Dec 2025 for commercial; rolling out across Clinical Ops / Regulatory / Medical by Aug 2026. Powered by Anthropic + Amazon Bedrock. AI for Vault CRM free through 2030.</li>
              <li>&bull; <span className="text-cream/90 font-medium">Merck signed 10-year &ldquo;Veeva-first&rdquo;</span> strategic partnership; Roche, Novo Nordisk, GSK committed to global Vault CRM deployments</li>
            </ul>
          </div>

          {/* Consolidation Arguments */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Why Sponsors Would Consolidate</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Unified data model</span> &mdash; single source of truth across clinical ops; Apollo sits outside this ecosystem</li>
                <li>&bull; <span className="text-cream/90 font-medium">Vendor simplification</span> &mdash; each additional vendor creates contracting, compliance, and integration overhead</li>
                <li>&bull; <span className="text-cream/90 font-medium">AI as accelerant</span> &mdash; Veeva AI Agents operate on data already within Vault; cross-system insights Apollo cannot replicate</li>
                <li>&bull; <span className="text-cream/90 font-medium">Site-level lock-in</span> &mdash; free eISF + eConsent + CTMS covering 90%+ of research sites creates zero-friction sponsor integration</li>
              </ul>
            </div>
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2">Why Sponsors Might Not Consolidate</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Site preference matters</span> &mdash; site-facing tools depend on site adoption; Apollo has genuine site-level brand affinity</li>
                <li>&bull; <span className="text-cream/90 font-medium">SiteLink has no Veeva equivalent</span> &mdash; vendor-neutral bidirectional sponsor&harr;site exchange across multiple eTMF systems</li>
                <li>&bull; <span className="text-cream/90 font-medium">Document trail switching cost</span> &mdash; years of regulatory history in Apollo creates migration effort and compliance risk</li>
                <li>&bull; <span className="text-cream/90 font-medium">WCG integration</span> &mdash; combined channel access (94% of FDA-approved therapeutics) creates distribution advantage</li>
              </ul>
            </div>
          </div>

          {/* Inferences */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-orange-300 mb-1">Inferences</div>
            {[
              'The 3–5 year consolidation threat is real and accelerating. By 2028 Veeva will likely offer a complete site-to-sponsor clinical operations stack — the exact space Apollo occupies.',
              'Threat is strongest for Apollo\'s US sponsor-deployed business (sponsor selects tool) and weakest for direct-to-site relationships (site chooses platform).',
              'Veeva\'s 20,000+ site footprint already exceeds Apollo\'s growth velocity — 8,000+ SiteVault sites grew from near-zero in 2020, a much steeper adoption curve.',
            ].map((inf, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                <AlertTriangle className="w-3 h-3 text-orange-300 mt-0.5 flex-shrink-0" />
                <span>{inf}</span>
              </div>
            ))}
          </div>

        </div>
  )

  slideContentMap['dd-econsent-landscape'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-400 mb-2">Deep Dive Supplement — DD-2</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">eICF &amp; eConsent — Competitive Landscape</h2>
            <p className="text-cream/50 text-sm">Market ~$430M (2023), ~11% CAGR. 100% of top 10 pharma have implemented eConsent. Apollo&apos;s product is ~2 years old — &ldquo;like a DocuSign&rdquo; for clinical consent.</p>
          </div>

          {/* Competitive Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-orange-500/40">
                  <th className="text-left p-1.5 text-cream/80 font-medium min-w-[90px]">Competitor</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Go-to-Market</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Pricing</th>
                  <th className="text-left p-1.5 text-cream/80 font-medium">Key Differentiator</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                {[
                  { name: 'Apollo (eConsent)', gtm: 'Site-facing (bundled w/ eBinders)', pricing: 'Paid — upsell from eBinders', diff: 'Site-first design; WCG IRB integration; part of site enablement ecosystem' },
                  { name: 'Veeva eConsent', gtm: 'Site-facing (free) + sponsor pull-through', pricing: 'Free ≤20 active studies', diff: 'Free pricing; part of full Vault clinical platform' },
                  { name: 'Signant Health', gtm: 'Sponsor-deployed', pricing: 'Per-study or enterprise', diff: 'Market leader in rich media eConsent; global multilingual support' },
                  { name: 'Medable', gtm: 'Sponsor-deployed (DCT-focused)', pricing: 'Platform license', diff: 'DCT-native; designed for remote/hybrid trials; Google Cloud partnership' },
                  { name: 'YPrime', gtm: 'Sponsor-deployed', pricing: 'Per-study', diff: 'Unified patient experience: consent + outcomes + randomization' },
                  { name: 'Medidata (Dassault)', gtm: 'Sponsor-deployed', pricing: 'Enterprise/platform', diff: 'Part of largest EDC platform; strong in complex global trials' },
                  { name: 'Advarra', gtm: 'IRB-adjacent', pricing: 'Bundled w/ IRB services', diff: 'Regulatory/IRB expertise; eConsent as compliance extension' },
                  { name: 'Castor', gtm: 'Direct-to-researcher', pricing: 'Freemium / per-study', diff: 'Academic/mid-market positioning; ease of use' },
                ].map((c) => (
                  <tr key={c.name} className="border-b border-cream/5">
                    <td className="p-1.5 font-medium text-cream/90">{c.name}</td>
                    <td className="p-1.5">{c.gtm}</td>
                    <td className="p-1.5">{c.pricing}</td>
                    <td className="p-1.5">{c.diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Positioning Assessment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-green-300 mb-2">Where Apollo Is Well-Positioned</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">eBinders integration</span> &mdash; eConsent as natural extension; reduces vendor friction for existing sites</li>
                <li>&bull; <span className="text-cream/90 font-medium">WCG IRB integration</span> &mdash; consent forms flow from IRB approvals; no other vendor has this direct data flow with WCG</li>
                <li>&bull; <span className="text-cream/90 font-medium">Site-first go-to-market</span> &mdash; sites choose to use it, creating stickier adoption vs. sponsor-imposed tools</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Where Apollo Is Vulnerable</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Product maturity gap</span> &mdash; Signant, Medidata, Medable offer rich media eConsent (video, interactive, multilingual). Apollo is a simpler form-based approach.</li>
                <li>&bull; <span className="text-cream/90 font-medium">Sponsor relationship scale</span> &mdash; Signant and Medidata are enterprise standards for the largest sponsors; Apollo eConsent is newer and not yet sponsor-preferred.</li>
                <li>&bull; <span className="text-cream/90 font-medium">Veeva&apos;s free tier</span> &mdash; for 20,000+ SiteVault sites, eConsent is included at no cost for up to 20 studies.</li>
              </ul>
            </div>
          </div>

          {/* Inferences */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-orange-300 mb-1">Inferences</div>
            {[
              'Apollo eConsent is a retention and expansion play within the existing site ecosystem — "you already use eBinders, add eConsent without switching." Defensible for existing customers but unlikely to win new logos on eConsent alone.',
              'Market consolidating around two models: (1) sponsor-deployed enterprise platforms (Signant, Medidata, Medable) and (2) site-native free/bundled solutions (Veeva, Apollo). Apollo competes in category 2, where its main rival is Veeva\'s free tier.',
            ].map((inf, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                <AlertTriangle className="w-3 h-3 text-orange-300 mt-0.5 flex-shrink-0" />
                <span>{inf}</span>
              </div>
            ))}
          </div>

        </div>
  )

  slideContentMap['dd-data-rights'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-400 mb-2">Deep Dive Supplement — DD-3</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Data Rights — Content vs. Metadata</h2>
            <p className="text-cream/50 text-sm">The data <em>in</em> documents vs. the data <em>about</em> documents carry very different rights profiles and commercial potential.</p>
          </div>

          {/* Two-Column Framework */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Lock className="w-5 h-5 text-red-400 mb-2" />
              <h3 className="text-sm font-semibold text-red-300 mb-2">Content Data (Documents)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Includes:</span> Consent forms, regulatory submissions, investigator CVs, protocols, safety letters, training records</li>
                <li>&bull; <span className="text-cream/90 font-medium">Owned by:</span> Originating party &mdash; sponsors, sites, IRBs, participants respectively</li>
                <li>&bull; <span className="text-cream/90 font-medium">Commercial use:</span> <span className="text-red-300">No</span> &mdash; Apollo is custodian, not owner. Subject to HIPAA, GDPR, ICH GCP, 21 CFR Part 11</li>
                <li>&bull; <span className="text-cream/90 font-medium">AI training:</span> Requires explicit consent from each data owner &mdash; practically difficult</li>
                <li>&bull; <span className="text-cream/90 font-medium">Value:</span> Not directly monetizable, but essential for platform retention</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Database className="w-5 h-5 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-green-300 mb-2">Metadata (Platform Engagement)</h3>
              <ul className="space-y-1.5 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Includes:</span> View timestamps, signature completion times, workflow durations, page engagement, upload/download patterns, query response times</li>
                <li>&bull; <span className="text-cream/90 font-medium">Generated by:</span> Apollo through platform operation &mdash; byproduct of software, not a customer deliverable</li>
                <li>&bull; <span className="text-cream/90 font-medium">Commercial use:</span> <span className="text-green-300">Likely with conditions</span> &mdash; de-identified, aggregated data typically covered under SaaS ToS</li>
                <li>&bull; <span className="text-cream/90 font-medium">AI training:</span> More feasible &mdash; can be de-identified and aggregated for workflow optimization, risk prediction, site scoring</li>
                <li>&bull; <span className="text-cream/90 font-medium">Value:</span> <span className="text-green-300">Highly valuable</span> &mdash; unique benchmarking intelligence across 65K+ sites</li>
              </ul>
            </div>
          </div>

          {/* Metadata Rights Tiers */}
          <div className="p-4 rounded-xl bg-orange-500/10 border-l-4 border-orange-500/50">
            <div className="text-xs uppercase tracking-wider text-orange-300 mb-2">Metadata Rights — Three Tiers</div>
            <div className="space-y-2">
              {[
                { tier: 'Likely Already Permitted', desc: 'Basic product analytics, anonymized aggregate benchmarking, platform improvement', color: 'text-green-300' },
                { tier: 'Requires Explicit Consent', desc: 'Commercial data products (e.g., selling site benchmarks to sponsors), training AI on customer-specific patterns, sharing metrics with WCG post-acquisition', color: 'text-yellow-300' },
                { tier: 'Requires Going Back to Customers', desc: 'Any use that could identify specific sites, sponsors, or studies — even indirectly via re-identification of aggregated data', color: 'text-red-300' },
              ].map((t) => (
                <div key={t.tier} className="flex items-start gap-2 text-xs text-cream/70">
                  <span className={`${t.color} font-medium flex-shrink-0`}>{t.tier}:</span>
                  <span>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WCG Implications */}
          <div className="p-4 rounded-xl bg-purple-500/10 border-l-4 border-purple-500/50">
            <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">WCG Acquisition Implications</div>
            <p className="text-xs text-cream/70 mb-2">The highest-value synergy (combined WCG protocol data &times; Apollo site operational data) <span className="text-cream/90 font-medium">depends on metadata rights being secured</span>. If Apollo&apos;s existing contracts do not permit data sharing with a parent company, WCG would need customer consent &mdash; creating timeline risk and potential churn.</p>
            <p className="text-xs text-cream/60"><span className="text-cream/90 font-medium">Recommendation:</span> Data room request should include Apollo&apos;s standard customer agreement (site-facing and sponsor-facing), specifically the data use, privacy, and aggregation clauses.</p>
          </div>

          {/* Inferences */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-orange-300 mb-1">Inferences</div>
            {[
              'Apollo has likely not yet fully commercialized its metadata asset. Diligence call focused on reporting and ETL (Snowflake + dbt + Fivetran), not productized data intelligence. The Kafka upgrade is about real-time reporting, not analytics-as-a-product.',
              'Securing metadata rights retroactively is achievable but non-trivial. Most SaaS companies embed data use provisions in contract renewals — systematic approach could secure rights across the majority of the base within 12–18 months.',
            ].map((inf, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                <AlertTriangle className="w-3 h-3 text-orange-300 mt-0.5 flex-shrink-0" />
                <span>{inf}</span>
              </div>
            ))}
          </div>

        </div>
  )

  slideContentMap['dd-data-architecture'] = (
        <div className="space-y-5 px-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-orange-400 mb-2">Deep Dive Supplement — DD-4</div>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-2">Data Architecture Gap Assessment &amp; Modernization Cost</h2>
            <p className="text-cream/50 text-sm">Apollo&apos;s infrastructure manages <em>documents</em> but lacks a <em>data architecture</em> for operational metrics needed to support AI products and premium analytics.</p>
          </div>

          {/* Current State */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <Layers className="w-5 h-5 text-sage-300 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">Current Architecture</h3>
              <ul className="space-y-1 text-xs text-cream/70">
                <li>&bull; <span className="text-cream/90 font-medium">Databases:</span> MongoDB + PostgreSQL</li>
                <li>&bull; <span className="text-cream/90 font-medium">Data lake:</span> Snowflake</li>
                <li>&bull; <span className="text-cream/90 font-medium">ETL:</span> Fivetran (ingestion) + dbt (transformation)</li>
                <li>&bull; <span className="text-cream/90 font-medium">Reporting latency:</span> 15-min intervals (constrained by Snowflake compute)</li>
                <li>&bull; <span className="text-cream/90 font-medium">In-progress:</span> Kafka migration for real-time streaming (4&ndash;5 month project)</li>
                <li>&bull; <span className="text-cream/90 font-medium">Neo4j:</span> POC/testing only, not in production</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-cream mb-2">What&apos;s Missing</h3>
              <ul className="space-y-1 text-xs text-cream/70">
                <li>&bull; Granular user behavior events (page-level engagement, session duration, click paths)</li>
                <li>&bull; Dimensional data model for operational KPIs (startup time, consent cycle time, query speed)</li>
                <li>&bull; Real-time analytics or streaming dashboards</li>
                <li>&bull; Feature store or ML pipeline for AI model training</li>
                <li>&bull; Self-service analytics layer for customers or internal teams</li>
              </ul>
            </div>
          </div>

          {/* Investment Tiers */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-orange-500/40">
                  <th className="text-left p-2 text-cream/80 font-medium">Tier</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Investment</th>
                  <th className="text-left p-2 text-cream/80 font-medium">Timeline</th>
                  <th className="text-left p-2 text-cream/80 font-medium">What It Enables</th>
                </tr>
              </thead>
              <tbody className="text-cream/70">
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-green-300">Tier 1: Real-Time Streaming</td>
                  <td className="p-2">$500K&ndash;$1M</td>
                  <td className="p-2">4&ndash;5 months</td>
                  <td className="p-2">Eliminates 15-min lag; real-time notifications and live dashboards. <span className="text-green-300 font-medium">In progress (Kafka)</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-yellow-300">Tier 2: Operational Metrics</td>
                  <td className="p-2">$1.5&ndash;$2.5M</td>
                  <td className="p-2">6&ndash;9 months</td>
                  <td className="p-2">Site benchmarking, study startup analysis, consent tracking, sponsor dashboards. <span className="text-red-300 font-medium">Does not exist</span></td>
                </tr>
                <tr className="border-b border-cream/5">
                  <td className="p-2 font-medium text-purple-300">Tier 3: AI-Ready Platform</td>
                  <td className="p-2">$2&ndash;$4M</td>
                  <td className="p-2">12&ndash;18 months</td>
                  <td className="p-2">Feature store, ML pipeline, model serving, AI-powered risk scoring and prediction. <span className="text-red-300 font-medium">Does not exist</span></td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-orange-500/40">
                  <td className="p-2 font-medium text-cream/90">Total (all tiers)</td>
                  <td className="p-2 font-medium text-cream/90">$4&ndash;$7.5M</td>
                  <td className="p-2 font-medium text-cream/90">18&ndash;24 months</td>
                  <td className="p-2 text-cream/60">Sequential with partial overlap; Tier 3 requires Tier 2</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Inferences */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-orange-300 mb-1">Inferences</div>
            {[
              'Tier 2 (operational metrics data model) is the most critical gap — without it Apollo cannot offer operational intelligence products and WCG cannot combine protocol data with site data for predictive analytics.',
              'Current data team appears sized for operational support, not platform-building. WCG should expect to invest in 3–5 additional data engineering FTEs to execute Tiers 2 and 3.',
              '$4–7.5M total over 18–24 months is modest relative to Apollo\'s enterprise value and the revenue upside from productized data intelligence.',
            ].map((inf, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-cream/70">
                <AlertTriangle className="w-3 h-3 text-orange-300 mt-0.5 flex-shrink-0" />
                <span>{inf}</span>
              </div>
            ))}
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
