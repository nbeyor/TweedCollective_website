'use client'

import React from 'react'
import {
  RadarChart, PieChart, HorizontalBarChart, QuadrantChart,
} from '@/components/charts'
import { RatingBadge, SectionHeader } from '../shared/DiligenceComponents'
import {
  Check, AlertTriangle, Rocket, TrendingUp, DollarSign, Zap,
  Brain, Database, Users, Target, BarChart3, ArrowRight, ArrowUpRight,
  Layers, AlertCircle, Minus, CheckCircle2,
} from 'lucide-react'

// ---- SLIDE 2: Executive Summary ----
export function ExecutiveSummarySlide({ sectionLabel, heading, summaryText, radarChart, strengths, risks, immediateFocus }: {
  sectionLabel: string
  heading: string
  summaryText: string
  radarChart: { labels: string[]; values: number[]; height: number }
  strengths: string[]
  risks: string[]
  immediateFocus: string[]
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <p className="text-sm text-cream/80 leading-relaxed">{summaryText}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3">AI Maturity Radar</h3>
          <RadarChart labels={radarChart.labels} values={radarChart.values} height={radarChart.height} />
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
            <h3 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
              <Check className="w-4 h-4" /> Top Strengths
            </h3>
            <ol className="space-y-1.5 text-xs text-cream/70 list-decimal list-inside">
              {strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <h3 className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Top Risks
            </h3>
            <ol className="space-y-1.5 text-xs text-cream/70 list-decimal list-inside">
              {risks.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </div>
          <div className="p-4 bg-sage/10 border border-sage/30 rounded-xl">
            <h3 className="text-sm font-semibold text-sage-bright mb-2 flex items-center gap-2">
              <Rocket className="w-4 h-4" /> Immediate Focus
            </h3>
            <ol className="space-y-1.5 text-xs text-cream/70 list-decimal list-inside">
              {immediateFocus.map((f, i) => <li key={i}>{f}</li>)}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 3: Business Drivers ----
export function BusinessDriversSlide({ sectionLabel, heading, revenueMix, costStructure, economicSensitivities }: {
  sectionLabel: string
  heading: string
  revenueMix: { title: string; items: Array<{ label: string; value: number }>; suffix: string; maxValue: number; height: number }
  costStructure: { title: string; segments: Array<{ label: string; value: number; color: string }>; height: number }
  economicSensitivities: { title: string; headers: string[]; rows: Array<{ area: string; impact: string; ebitda: string }> }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sage-bright" />
            {revenueMix.title}
          </h3>
          <HorizontalBarChart items={revenueMix.items} suffix={revenueMix.suffix} maxValue={revenueMix.maxValue} height={revenueMix.height} />
        </div>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-sage-bright" />
            {costStructure.title}
          </h3>
          <PieChart segments={costStructure.segments} height={costStructure.height} />
        </div>
      </div>
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <h3 className="text-sm font-semibold text-cream mb-3">{economicSensitivities.title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cream/10">
                {economicSensitivities.headers.map((h, i) => (
                  <th key={i} className="text-left py-2 pr-4 text-cream/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {economicSensitivities.rows.map((row, i) => (
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
  )
}

// ---- SLIDE 4: Assessment Table (KINETICS) ----
const stageColorMap: Record<string, string> = {
  yellow: 'bg-yellow-500/20 text-yellow-300',
  taupe: 'bg-taupe/30 text-taupe-light',
  green: 'bg-green-500/20 text-green-300',
  neutral: 'bg-cream/10 text-cream/50',
}

const cardIconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-5 h-5 text-sage-bright" />,
  Layers: <Layers className="w-5 h-5 text-taupe-light" />,
  Brain: <Brain className="w-5 h-5 text-helix-cyan" />,
  AlertCircle: <AlertCircle className="w-5 h-5 text-gold" />,
}

const valuePotentialColor: Record<string, string> = {
  'High': 'bg-green-500/20 text-green-300',
  'Moderate': 'bg-yellow-500/20 text-yellow-300',
  'Low–Moderate': 'bg-taupe/30 text-taupe-light',
  'Low': 'bg-cream/10 text-cream/50',
}

export function AssessmentTableSlide({ sectionLabel, heading, subtitle, callout, sections, cards }: {
  sectionLabel: string
  heading: string
  subtitle: string
  callout?: string
  sections: Array<{
    title: string
    rows: Array<{ name: string; description: string; valueSource: string; valuePotential: string }>
  }>
  cards: Array<{ name: string; description: string; icon: string; highlight: boolean }>
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      {callout && (
        <div className="p-3 bg-sage/10 border border-sage/30 rounded-xl">
          <p className="text-xs text-cream/90 italic leading-relaxed">{callout}</p>
        </div>
      )}
      {sections.map((section, si) => (
        <div key={si} className="space-y-2">
          <h3 className="text-sm font-semibold text-cream/90">{section.title}</h3>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cream/10">
                    <th className="text-left py-2 pr-4 text-cream/50 font-medium">Initiative</th>
                    <th className="text-left py-2 pr-4 text-cream/50 font-medium">Description</th>
                    <th className="text-left py-2 pr-4 text-cream/50 font-medium">Value Source</th>
                    <th className="text-left py-2 pr-4 text-cream/50 font-medium">Value Potential</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, i) => (
                    <tr key={i} className="border-b border-cream/5">
                      <td className="py-2.5 pr-4 text-cream/90 font-medium">{row.name}</td>
                      <td className="py-2.5 pr-4 text-cream/60">{row.description}</td>
                      <td className="py-2.5 pr-4 text-cream/60">{row.valueSource}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${valuePotentialColor[row.valuePotential] || valuePotentialColor['Low']}`}>{row.valuePotential}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
      <div className="grid md:grid-cols-4 gap-3">
        {cards.map(card => (
          <div key={card.name} className={`p-3 rounded-xl border ${card.highlight ? 'bg-sage/10 border-sage/30' : 'bg-white/5 border-cream/10'}`}>
            <div className="mb-2">{cardIconMap[card.icon] || <Brain className="w-5 h-5 text-cream/40" />}</div>
            <h4 className="text-xs font-semibold text-cream mb-1">{card.name}</h4>
            <p className="text-[10px] text-cream/50 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- SLIDE 5: DIFFUSION ----
export function DiffusionSlide({ sectionLabel, heading, subtitle, table, quadrantChart }: {
  sectionLabel: string
  heading: string
  subtitle: string
  table: { headers: string[]; rows: Array<{ name: string; positioning: string; revenue: string; risk: string }> }
  quadrantChart: {
    title: string
    xLabel: string
    yLabel: string
    quadrants: [string, string, string, string]
    points: Array<{ label: string; x: number; y: number }>
    height: number
  }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cream/10">
                  {table.headers.map((h, i) => (
                    <th key={i} className="text-left py-2 pr-3 text-cream/50 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-2 pr-3 text-cream/90 font-medium">{row.name}</td>
                    <td className="py-2 pr-3 text-cream/60">{row.positioning}</td>
                    <td className="py-2 pr-3 text-cream/60">{row.revenue}</td>
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
            {quadrantChart.title}
          </h3>
          <QuadrantChart
            xLabel={quadrantChart.xLabel}
            yLabel={quadrantChart.yLabel}
            quadrants={quadrantChart.quadrants}
            points={quadrantChart.points}
            height={quadrantChart.height}
          />
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 6: Differentiating Assets ----
export function DifferentiatingAssetsSlide({ sectionLabel, heading, subtitle, moatChart, dataFlow, insightText }: {
  sectionLabel: string
  heading: string
  subtitle: string
  moatChart: { title: string; items: Array<{ label: string; value: number }>; suffix: string; maxValue: number; height: number }
  dataFlow: { title: string; sources: string[]; outputs: string[] }
  insightText: string
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-sage-bright" />
            {moatChart.title}
          </h3>
          <HorizontalBarChart items={moatChart.items} suffix={moatChart.suffix} maxValue={moatChart.maxValue} height={moatChart.height} />
        </div>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-helix-cyan" />
            {dataFlow.title}
          </h3>
          <DataFlowDiagram sources={dataFlow.sources} outputs={dataFlow.outputs} />
          <div className="mt-4 p-3 bg-sage/5 border border-sage/15 rounded-lg">
            <p className="text-[10px] text-cream/60 leading-relaxed">{insightText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Data flow diagram sub-component
export function DataFlowDiagram({ sources, outputs }: { sources: string[]; outputs: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <div className="space-y-1.5 flex-shrink-0">
        {sources.map(s => (
          <div key={s} className="px-2.5 py-1.5 bg-taupe/15 border border-taupe/25 rounded text-[10px] md:text-xs text-cream/70 text-right whitespace-nowrap">{s}</div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="text-cream/20 text-lg">&rarr;</div>
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="px-4 py-3 bg-sage/20 border-2 border-sage/40 rounded-xl text-sm text-cream font-semibold flex items-center gap-2">
          <Database className="w-4 h-4 text-sage-bright" />
          ION Data Lake
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="text-cream/20 text-lg">&rarr;</div>
      </div>
      <div className="space-y-1.5 flex-shrink-0">
        {outputs.map(o => (
          <div key={o} className="px-2.5 py-1.5 bg-sage/10 border border-sage/20 rounded text-[10px] md:text-xs text-cream/70 whitespace-nowrap">{o}</div>
        ))}
      </div>
    </div>
  )
}

// ---- SLIDE 7: Governance ----
export function GovernanceSlide({ sectionLabel, heading, governanceStructure, scorecard, observedGaps }: {
  sectionLabel: string
  heading: string
  governanceStructure: { title: string; items: Array<{ frequency: string; body: string; description: string }> }
  scorecard: { title: string; items: Array<{ item: string; status: boolean }> }
  observedGaps: string[]
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-sage-bright" />
            {governanceStructure.title}
          </h3>
          <div className="space-y-3">
            {governanceStructure.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 px-2 py-0.5 bg-sage/20 text-sage-bright text-[10px] font-mono font-medium rounded mt-0.5">{item.frequency}</span>
                <div>
                  <span className="text-sm text-cream/90 font-medium">{item.body}</span>
                  <p className="text-[10px] text-cream/50">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-3">{scorecard.title}</h3>
            <div className="space-y-2">
              {scorecard.items.map((check, i) => (
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
              {observedGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Minus className="w-3 h-3 mt-0.5 text-amber-400 flex-shrink-0" />{gap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 8: Route Reagent ----
export function RouteReagentSlide({ sectionLabel, heading, subtitle, metrics, financialImpact }: {
  sectionLabel: string
  heading: string
  subtitle: string
  metrics: Array<{ metric: string; before: string; target: string; delta: string }>
  financialImpact: {
    title: string
    lineItems: Array<{ label: string; value: string; highlight?: boolean }>
    roiHighlight: { value: string; label: string; sublabel: string }
  }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map(row => (
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
            <span className="inline-block mt-2 text-sm font-mono font-bold text-green-400">{row.delta}</span>
          </div>
        ))}
      </div>
      <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
        <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gold" />
          {financialImpact.title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 font-mono text-sm">
            {financialImpact.lineItems.map((item, i) => (
              <div key={i} className={`flex justify-between text-cream/60 ${item.highlight ? 'border-t border-cream/10 pt-2' : ''}`}>
                <span>{item.label}</span>
                <span className={item.highlight ? 'text-gold font-bold' : 'text-cream/90'}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl font-mono font-bold text-green-400">{financialImpact.roiHighlight.value}</span>
              <p className="text-xs text-cream/50 mt-2">{financialImpact.roiHighlight.label}</p>
              <p className="text-[10px] text-cream/30 mt-1">{financialImpact.roiHighlight.sublabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 9: Pantheon ----
export function PantheonSlide({ sectionLabel, heading, subtitle, metrics, evolutionThesis }: {
  sectionLabel: string
  heading: string
  subtitle: string
  metrics: Array<{ metric: string; current: string; future: string; delta: string }>
  evolutionThesis: string
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.map(row => (
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
            <span className={`inline-block mt-2 text-xs font-mono font-bold ${row.delta === '—' ? 'text-cream/50' : 'text-green-400'}`}>{row.delta}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-sage/5 border border-sage/20 rounded-xl">
        <p className="text-sm text-cream/70 leading-relaxed">
          <strong className="text-cream">The Pantheon evolution thesis:</strong> {evolutionThesis}
        </p>
      </div>
    </div>
  )
}

// ---- SLIDE 10: Roadmap ----
const roadmapVariantStyles: Record<string, { border: string; badge: string }> = {
  green: {
    border: 'border-l-green-500 bg-green-500/5',
    badge: 'bg-green-500/20 text-green-300 border-green-500/30',
  },
  sage: {
    border: 'border-l-sage bg-sage/5',
    badge: 'bg-sage/20 text-sage-bright border-sage/30',
  },
  taupe: {
    border: 'border-l-taupe bg-taupe/5',
    badge: 'bg-taupe/20 text-taupe-light border-taupe/30',
  },
  red: {
    border: 'border-l-red-500 bg-red-500/5',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
}

export function RoadmapSlide({ sectionLabel, heading, categories, foundation, workflowIntegration }: {
  sectionLabel: string
  heading: string
  categories: Array<{ action: string; variant: string; items: string[] }>
  foundation: { action: string; title: string; description: string }
  workflowIntegration: { title: string; description: string; workflows: Array<{ workflow: string; tools: string; gap: string }> }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const styles = roadmapVariantStyles[cat.variant] || roadmapVariantStyles.sage
          return (
            <div key={cat.action} className={`p-4 rounded-xl border-l-4 ${styles.border}`}>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-3 ${styles.badge}`}>{cat.action}</span>
              <ul className="space-y-1.5">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cream/80">
                    <ArrowRight className="w-3 h-3 mt-1 text-cream/30 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      <div className="p-4 rounded-xl border-2 border-helix-cyan/30 bg-helix-cyan/5">
        <div className="flex items-center gap-3 mb-3">
          <Database className="w-5 h-5 text-helix-cyan" />
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-300 border-green-500/30 mr-2">{foundation.action}</span>
            <span className="text-sm font-semibold text-cream">{foundation.title}</span>
          </div>
        </div>
        <p className="text-xs text-cream/70 leading-relaxed">{foundation.description}</p>
      </div>
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">{workflowIntegration.title}</span>
        </div>
        <p className="text-xs text-cream/70 leading-relaxed mb-3">{workflowIntegration.description}</p>
        <div className="grid md:grid-cols-3 gap-3">
          {workflowIntegration.workflows.map((item, i) => (
            <div key={i} className="p-2.5 bg-white/5 border border-cream/5 rounded-lg">
              <h5 className="text-[10px] uppercase tracking-wider text-cream/50 mb-1">{item.workflow}</h5>
              <p className="text-[10px] text-cream/70 mb-1"><strong className="text-cream/80">Tools:</strong> {item.tools}</p>
              <p className="text-[10px] text-amber-300/70"><strong>Gap:</strong> {item.gap}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 11: Change Management ----
const barColorMap: Record<string, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
}

export function ChangeManagementSlide({ sectionLabel, heading, readiness, requiredActions }: {
  sectionLabel: string
  heading: string
  readiness: { title: string; items: Array<{ dimension: string; score: number; color: string }> }
  requiredActions: { title: string; items: Array<{ action: string; urgency: string; description: string }> }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4">{readiness.title}</h3>
          <div className="space-y-3">
            {readiness.items.map(item => (
              <div key={item.dimension} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-cream/70">{item.dimension}</span>
                  <span className="text-cream/90 font-mono">{item.score}/10</span>
                </div>
                <div className="h-2 bg-cream/5 rounded-full overflow-hidden">
                  <div className={`h-full ${barColorMap[item.color] || 'bg-sage'} rounded-full transition-all`} style={{ width: `${item.score * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-gold" />
            {requiredActions.title}
          </h3>
          <div className="space-y-3">
            {requiredActions.items.map((item, i) => (
              <div key={i} className="p-3 bg-white/5 border border-cream/5 rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs text-cream/90 font-medium">{item.action}</span>
                  <span className="flex-shrink-0 px-1.5 py-0.5 bg-gold/20 text-gold text-[9px] font-mono rounded">{item.urgency}</span>
                </div>
                <p className="text-[10px] text-cream/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 12: Quantifying Upside ----
export function QuantifyingUpsideSlide({ sectionLabel, heading, subtitle, ebitdaModel, enterpriseValue }: {
  sectionLabel: string
  heading: string
  subtitle: string
  ebitdaModel: {
    title: string
    headers: string[]
    rows: Array<{ category: string; year1: string; year3: string }>
    totals: { label: string; year1: string; year3: string }
  }
  enterpriseValue: {
    title: string
    lineItems: Array<{ label: string; value: string; color?: string; bold?: boolean }>
    multiples: Array<{ label: string; value: string }>
  }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            {ebitdaModel.title}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/10">
                {ebitdaModel.headers.map((h, i) => (
                  <th key={i} className={`py-2.5 pr-4 text-cream/50 font-medium ${i > 0 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {ebitdaModel.rows.map((row, i) => (
                <tr key={i} className="border-b border-cream/5">
                  <td className="py-2.5 pr-4 text-cream/80 font-sans">{row.category}</td>
                  <td className="py-2.5 px-4 text-right text-cream/70">{row.year1}</td>
                  <td className="py-2.5 pl-4 text-right text-cream/70">{row.year3}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-cream/20">
                <td className="py-3 pr-4 text-cream font-sans font-semibold">{ebitdaModel.totals.label}</td>
                <td className="py-3 px-4 text-right text-gold font-bold">{ebitdaModel.totals.year1}</td>
                <td className="py-3 pl-4 text-right text-gold font-bold">{ebitdaModel.totals.year3}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-5 bg-white/5 border border-cream/10 rounded-xl flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-cream mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sage-bright" />
            {enterpriseValue.title}
          </h3>
          <div className="space-y-4 font-mono text-sm">
            {enterpriseValue.lineItems.map((item, i) => (
              <div key={i} className={`flex justify-between text-cream/60 ${item.bold ? 'border-t border-cream/10 pt-3' : ''}`}>
                <span>{item.label}</span>
                <span className={item.bold ? 'text-cream font-bold' : item.color === 'green' ? 'text-green-400' : 'text-cream/90'}>{item.value}</span>
              </div>
            ))}
            <div className="mt-4 p-4 bg-gold/5 border border-gold/20 rounded-lg space-y-2">
              {enterpriseValue.multiples.map((m, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-cream/70">{m.label}</span>
                  <span className="text-gold font-bold">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 13: Final Recommendation ----
const recommendationVariantStyles: Record<string, { border: string; iconColor: string }> = {
  green: { border: 'border-green-500/30 bg-green-500/5', iconColor: 'text-green-400' },
  sage: { border: 'border-sage/30 bg-sage/5', iconColor: 'text-sage-bright' },
  gold: { border: 'border-gold/30 bg-gold/5', iconColor: 'text-gold' },
  cyan: { border: 'border-helix-cyan/30 bg-helix-cyan/5', iconColor: 'text-helix-cyan' },
}

export function FinalRecommendationSlide({ sectionLabel, heading, recommendations, operatingPrinciples, strategicShifts }: {
  sectionLabel: string
  heading: string
  recommendations: Array<{ num: string; title: string; subtitle: string; description: string; variant: string }>
  operatingPrinciples: string[]
  strategicShifts: string[]
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.map(card => {
          const styles = recommendationVariantStyles[card.variant] || recommendationVariantStyles.sage
          return (
            <div key={card.num} className={`p-5 rounded-xl border ${styles.border}`}>
              <span className={`text-3xl font-mono font-bold ${styles.iconColor} opacity-50`}>{card.num}</span>
              <h3 className="text-sm font-semibold text-cream mt-2 mb-1">{card.title}</h3>
              <span className="text-[10px] uppercase tracking-wider text-cream/40">{card.subtitle}</span>
              <p className="text-xs text-cream/60 mt-3 leading-relaxed">{card.description}</p>
            </div>
          )
        })}
      </div>
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <div className="grid md:grid-cols-2 gap-4 text-sm text-cream/70">
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-2">Operating Principles</h4>
            {operatingPrinciples.map((p, i) => (
              <p key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 mt-1 text-sage-bright flex-shrink-0" />{p}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-cream/40 mb-2">Strategic Shifts</h4>
            {strategicShifts.map((s, i) => (
              <p key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 mt-1 text-gold flex-shrink-0" />{s}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
