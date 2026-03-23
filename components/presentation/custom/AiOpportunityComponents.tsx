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
  Shield, FileText, Replace, Activity, Clock, ChevronDown,
  Gauge, ListChecks, Calendar, Lightbulb, GitBranch,
  Server, Lock, Plug, FolderSearch,
} from 'lucide-react'

// ---- SLIDE 3: Evaluation Framework ----
const evaluationVariantStyles: Record<string, { border: string; iconColor: string }> = {
  green: { border: 'border-green-500/30 bg-green-500/5', iconColor: 'text-green-400' },
  sage: { border: 'border-sage/30 bg-sage/5', iconColor: 'text-sage-bright' },
  gold: { border: 'border-gold/30 bg-gold/5', iconColor: 'text-gold' },
  cyan: { border: 'border-helix-cyan/30 bg-helix-cyan/5', iconColor: 'text-helix-cyan' },
}

export function EvaluationFrameworkSlide({ sectionLabel, heading, cards }: {
  sectionLabel?: string
  heading: string
  cards: Array<{ num: string; title: string; description: string; variant: string }>
}) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center px-4">
      {sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{heading}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map(card => {
          const styles = evaluationVariantStyles[card.variant] || evaluationVariantStyles.sage
          return (
            <div key={card.num} className={`p-5 rounded-xl border ${styles.border}`}>
              <span className={`text-3xl font-mono font-bold ${styles.iconColor} opacity-50`}>{card.num}</span>
              <h3 className="text-sm font-semibold text-cream mt-2 mb-1">{card.title}</h3>
              <p className="text-xs text-cream/60 leading-relaxed">{card.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- SLIDE 2: Executive Summary ----
export function ExecutiveSummarySlide({ sectionLabel, heading, summaryText, radarChart, strengths, risks, immediateFocus }: {
  sectionLabel?: string
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3">AI Maturity Radar</h3>
          <RadarChart labels={radarChart.labels} values={radarChart.values} height={radarChart.height} />
          {summaryText && (
            <p className="mt-3 text-[10px] text-cream/50 italic leading-relaxed whitespace-pre-line">{summaryText}</p>
          )}
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
export function BusinessDriversSlide({ sectionLabel, heading, revenueMix, costStructure, economicSensitivities, revenueMixSource, costStructureSource, economicSensitivityRationale }: {
  sectionLabel?: string
  heading: string
  revenueMix?: { title: string; items: Array<{ label: string; value: number }>; suffix: string; maxValue: number; height: number }
  costStructure?: { title: string; segments: Array<{ label: string; value: number; color: string }>; height: number }
  economicSensitivities?: { title: string; headers: string[]; rows: Array<{ area: string; impact: string; ebitda: string }> }
  revenueMixSource?: string
  costStructureSource?: string
  economicSensitivityRationale?: string
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      {(revenueMix || costStructure) && (
        <div className="grid md:grid-cols-2 gap-6">
          {revenueMix && (
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sage-bright" />
                {revenueMix.title}
              </h3>
              <HorizontalBarChart items={revenueMix.items} suffix={revenueMix.suffix} maxValue={revenueMix.maxValue} height={revenueMix.height} />
              {revenueMixSource && (
                <p className="mt-2 text-[10px] text-cream/50 italic leading-relaxed">{revenueMixSource}</p>
              )}
            </div>
          )}
          {costStructure && (
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-sage-bright" />
                {costStructure.title}
              </h3>
              <PieChart segments={costStructure.segments} height={costStructure.height} />
              {costStructureSource && (
                <p className="mt-2 text-[10px] text-cream/50 italic leading-relaxed">{costStructureSource}</p>
              )}
            </div>
          )}
        </div>
      )}
      {economicSensitivities && (
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
          {economicSensitivityRationale && (
            <p className="mt-3 text-[10px] text-cream/50 italic leading-relaxed">{economicSensitivityRationale}</p>
          )}
        </div>
      )}
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

export function AssessmentTableSlide({ sectionLabel, heading, subtitle, callout, valuePotentialFootnote, sections, cards }: {
  sectionLabel?: string
  heading: string
  subtitle: string
  callout?: string
  valuePotentialFootnote?: string
  sections: Array<{
    title: string
    rows: Array<{ name: string; description: string; valueSource: string; valuePotential: string; rationale?: string; displacementRisk?: string }>
  }>
  cards?: Array<{ name: string; description: string; icon: string; highlight: boolean }>
}) {
  const hasRationale = sections.some(s => s.rows.some(r => r.rationale))
  const hasDisplacementRisk = sections.some(s => s.rows.some(r => r.displacementRisk))
  return (
    <div className="space-y-4 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      {callout && (
        <div className="p-3 bg-sage/10 border border-sage/30 rounded-xl">
          <p className="text-xs text-cream/90 italic leading-relaxed">{callout}</p>
        </div>
      )}
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left py-1.5 pr-4 text-cream/50 font-medium">Initiative</th>
                <th className="text-left py-1.5 pr-4 text-cream/50 font-medium">Description</th>
                <th className="text-left py-1.5 pr-4 text-cream/50 font-medium">Value Source</th>
                <th className="text-left py-1.5 pr-4 text-cream/50 font-medium">Value Potential</th>
                {hasDisplacementRisk && <th className="text-left py-1.5 pr-4 text-cream/50 font-medium">Displacement Risk</th>}
                {hasRationale && <th className="text-left py-1.5 text-cream/50 font-medium">Rationale</th>}
              </tr>
            </thead>
            <tbody>
              {sections.map((section, si) => {
                const colCount = 4 + (hasDisplacementRisk ? 1 : 0) + (hasRationale ? 1 : 0)
                return (
                  <React.Fragment key={si}>
                    {sections.length > 1 && (
                      <tr className="border-b border-cream/10">
                        <td colSpan={colCount} className="py-3 text-sm font-semibold text-cream/90">{section.title}</td>
                      </tr>
                    )}
                    {section.rows.map((row, i) => (
                      <tr key={i} className="border-b border-cream/5">
                        <td className="py-2.5 pr-4 text-cream/90 font-medium">{row.name}</td>
                        <td className="py-2.5 pr-4 text-cream/60">{row.description}</td>
                        <td className="py-2.5 pr-4 text-cream/60">{row.valueSource}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${valuePotentialColor[row.valuePotential] || valuePotentialColor['Low']}`}>{row.valuePotential}</span>
                        </td>
                        {hasDisplacementRisk && <td className="py-2.5 pr-4 text-cream/60">{row.displacementRisk ?? '—'}</td>}
                        {hasRationale && <td className="py-2.5 text-cream/60 leading-relaxed">{row.rationale ?? '—'}</td>}
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {valuePotentialFootnote && (
        <div className="p-3 bg-cream/5 border border-cream/10 rounded-xl">
          <p className="text-[10px] text-cream/60 italic leading-relaxed">{valuePotentialFootnote}</p>
        </div>
      )}
      {cards && cards.length > 0 && (
        <div className="grid md:grid-cols-4 gap-3">
          {cards.map(card => (
            <div key={card.name} className={`p-3 rounded-xl border ${card.highlight ? 'bg-sage/10 border-sage/30' : 'bg-white/5 border-cream/10'}`}>
              <div className="mb-2">{cardIconMap[card.icon] || <Brain className="w-5 h-5 text-cream/40" />}</div>
              <h4 className="text-xs font-semibold text-cream mb-1">{card.name}</h4>
              <p className="text-[10px] text-cream/50 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- SLIDE 5: DIFFUSION ----
export function DiffusionSlide({ sectionLabel, heading, subtitle, table, quadrantChart }: {
  sectionLabel?: string
  heading: string
  subtitle: string
  table: { headers: string[]; rows: Array<{ name: string; positioning: string; revenue: string; risk: string }> }
  quadrantChart?: {
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
      <div className={quadrantChart ? 'grid md:grid-cols-2 gap-6' : ''}>
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
        {quadrantChart && (
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
        )}
      </div>
    </div>
  )
}

// ---- SLIDE 6: Differentiating Assets ----
export function DifferentiatingAssetsSlide({ sectionLabel, heading, subtitle, moatChart, dataFlow, insightText }: {
  sectionLabel?: string
  heading: string
  subtitle: string
  moatChart: { title: string; items: Array<{ label: string; value: number; rationale?: string }>; suffix: string; maxValue: number; height: number }
  dataFlow: { title: string; sources: string[]; nonProprietarySources?: string[]; outputs: string[] }
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
          <div className="space-y-3">
            {moatChart.items.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-cream/70">{item.label}</span>
                  <span className="text-[11px] text-cream/50 font-mono">{item.value}{moatChart.suffix}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.value / moatChart.maxValue) * 100}%`,
                      backgroundColor: item.value >= 9 ? '#8fbc8f' : item.value >= 6 ? '#8fbc8faa' : item.value >= 3 ? '#8fbc8f66' : '#8fbc8f44',
                    }}
                  />
                </div>
                {item.rationale && (
                  <p className="text-[9px] text-cream/40 mt-1 leading-snug italic">{item.rationale}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-helix-cyan" />
            {dataFlow.title}
          </h3>
          <DataFlowDiagram sources={dataFlow.sources} nonProprietarySources={dataFlow.nonProprietarySources} outputs={dataFlow.outputs} />
          <div className="mt-4 p-3 bg-sage/5 border border-sage/15 rounded-lg">
            <p className="text-[10px] text-cream/60 leading-relaxed">{insightText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Data flow diagram sub-component
export function DataFlowDiagram({ sources, nonProprietarySources, outputs }: { sources: string[]; nonProprietarySources?: string[]; outputs: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <div className="space-y-1.5 flex-shrink-0">
        {sources.map(s => (
          <div key={s} className="px-2.5 py-1.5 bg-taupe/15 border border-taupe/25 rounded text-[10px] md:text-xs text-cream/70 text-right whitespace-nowrap">{s}</div>
        ))}
        {nonProprietarySources?.map(s => (
          <div key={s} className="px-2.5 py-1.5 bg-gray-500/20 border border-gray-500/30 rounded text-[10px] md:text-xs text-cream/40 text-right whitespace-nowrap">
            {s} <span className="text-[8px] text-cream/30 italic ml-1">not proprietary</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="text-cream/20 text-lg">&rarr;</div>
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="px-3 py-3 bg-sage/20 border-2 border-sage/40 rounded-xl text-sm text-cream font-semibold flex flex-col items-center gap-1 text-center">
          <Database className="w-4 h-4 text-sage-bright" />
          <span>ION</span>
          <span>Data</span>
          <span>Lake</span>
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
  sectionLabel?: string
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
  sectionLabel?: string
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
  sectionLabel?: string
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
  sectionLabel?: string
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

export function ChangeManagementSlide({ sectionLabel, heading, readiness, requiredActions, meetingStructure, optionalAITalentCallout, discussionBullets }: {
  sectionLabel?: string
  heading: string
  readiness: { title: string; items: Array<{ dimension: string; score: number; color: string }> }
  requiredActions?: { title: string; items: Array<{ action: string; urgency: string; description: string }> }
  meetingStructure?: Array<{ cadence: string; forum: string; purpose: string; attendees: string }>
  optionalAITalentCallout?: string
  discussionBullets?: string[]
}) {
  // Bold the first two words of a dimension string
  const boldFirstTwoWords = (text: string) => {
    const words = text.split(' ')
    if (words.length <= 2) return <span className="font-bold text-cream">{text}</span>
    const firstTwo = words.slice(0, 2).join(' ')
    const rest = words.slice(2).join(' ')
    return <><span className="font-bold text-cream">{firstTwo}</span> {rest}</>
  }

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
                  <span className="text-cream/70">{boldFirstTwoWords(item.dimension)}</span>
                  <span className="text-cream/90 font-mono">{item.score}/10</span>
                </div>
                <div className="h-2 bg-cream/5 rounded-full overflow-hidden">
                  <div className={`h-full ${barColorMap[item.color] || 'bg-sage'} rounded-full transition-all`} style={{ width: `${item.score * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {(discussionBullets && discussionBullets.length > 0) && (
            <div className="p-4 bg-amber-500/5 border border-dashed border-amber-500/30 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">For Discussion</span>
              <ul className="mt-2 space-y-2 text-xs text-cream/70 leading-relaxed">
                {discussionBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {meetingStructure && meetingStructure.length > 0 ? (
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" /> Meeting Structure to Drive Change
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-cream/10">
                      <th className="text-left py-2 pr-2 text-cream/50 font-medium">Cadence</th>
                      <th className="text-left py-2 pr-2 text-cream/50 font-medium">Forum</th>
                      <th className="text-left py-2 pr-2 text-cream/50 font-medium">Purpose</th>
                      <th className="text-left py-2 text-cream/50 font-medium">Attendees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetingStructure.map((row, i) => (
                      <tr key={i} className="border-b border-cream/5">
                        <td className="py-2 pr-2 text-cream/80 font-medium">{row.cadence}</td>
                        <td className="py-2 pr-2 text-cream/70">{row.forum}</td>
                        <td className="py-2 pr-2 text-cream/60">{row.purpose}</td>
                        <td className="py-2 text-cream/60">{row.attendees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : requiredActions && (
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
          )}
        </div>
      </div>
    </div>
  )
}

// ---- SLIDE 12: Quantifying Upside ----
export function QuantifyingUpsideSlide({ sectionLabel, heading, subtitle, ebitdaModel, enterpriseValue }: {
  sectionLabel?: string
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
  sectionLabel?: string
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

// ---- Product Value Story (Sections 7-15) ----
// Edit guide: single Value Potential badge (replaces Defensibility + Value Framework); max 2 leading indicators; no "What Has to Be True"
export function ProductValueStorySlide({ sectionLabel, heading, description, users, replaces, valuePotential, leadingIndicators, valueEstimate, defensibility, valueMapping, assumptions }: {
  sectionLabel?: string
  heading: string
  description: string
  users: string
  replaces: string
  valuePotential?: { rating: string; rationale: string }
  leadingIndicators: string[]
  valueEstimate: string
  defensibility?: { rating: string; text: string }
  valueMapping?: string
  assumptions?: string[]
}) {
  const vp = valuePotential ?? (defensibility ? { rating: defensibility.rating, rationale: defensibility.text } : null)
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sage-bright" /> What It Does
            </h3>
            <p className="text-xs text-cream/70 leading-relaxed">{description}</p>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-bright" /> Who Uses It
            </h3>
            <p className="text-xs text-cream/70 leading-relaxed">{users}</p>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
              <Replace className="w-4 h-4 text-sage-bright" /> What It Replaces
            </h3>
            <p className="text-xs text-cream/70 leading-relaxed">{replaces}</p>
          </div>
        </div>
        {/* Right column */}
        <div className="space-y-4">
          {vp && (
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-sage-bright" /> Value Potential
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <RatingBadge rating={vp.rating} />
              </div>
              <p className="text-xs text-cream/70 leading-relaxed">{vp.rationale}</p>
            </div>
          )}
          {!vp && defensibility && (
            <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-sage-bright" /> Value Potential
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <RatingBadge rating={defensibility.rating} />
              </div>
              <p className="text-xs text-cream/70 leading-relaxed">{defensibility.text}</p>
            </div>
          )}
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sage-bright" /> Leading Indicators
            </h3>
            <ul className="space-y-1 text-xs text-cream/70">
              {(leadingIndicators.slice(0, 2)).map((ind, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-3 h-3 mt-0.5 text-cream/30 flex-shrink-0" />{ind}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
            <h3 className="text-sm font-semibold text-cream mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gold" /> Value Estimate
            </h3>
            <p className="text-xs text-cream/70 leading-relaxed">{valueEstimate}</p>
          </div>
        </div>
      </div>
      {/* "What Has to Be True" removed per edit guide */}
    </div>
  )
}

// ---- Compact Product Value Stories (multiple products per slide) ----
export function ProductValueStoryCompactSlide({ sectionLabel, heading, products }: {
  sectionLabel?: string
  heading: string
  products: Array<{
    name: string
    subtitle: string
    defensibility: string
    description: string
    valueEstimate: string
    keyAssumption: string
  }>
}) {
  return (
    <div className="space-y-4 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-3">
        {products.map(product => (
          <div key={product.name} className="p-3 bg-white/5 border border-cream/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-cream">{product.name}</h3>
                <span className="text-[10px] text-cream/40">{product.subtitle}</span>
              </div>
              <RatingBadge rating={product.defensibility} />
            </div>
            <p className="text-xs text-cream/70 leading-relaxed">{product.description}</p>
            <div className="p-2 bg-sage/5 border border-sage/15 rounded-lg">
              <span className="text-[10px] text-sage-bright font-medium">Value: </span>
              <span className="text-[10px] text-cream/70 font-mono">{product.valueEstimate}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 mt-0.5 text-gold flex-shrink-0" />
              <span className="text-[10px] text-cream/50 leading-relaxed">{product.keyAssumption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Section 5: AI Value Framework ----
export function ValueFrameworkSlide({ sectionLabel, heading, description, internalBuckets, externalBuckets }: {
  sectionLabel?: string
  heading: string
  description?: string
  internalBuckets: Array<{ bucket: string; definition: string; kpis: string }>
  externalBuckets: Array<{ bucket: string; definition: string; kpis: string }>
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      {description && (
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <p className="text-sm text-cream/80 leading-relaxed">{description}</p>
        </div>
      )}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
          <Layers className="w-4 h-4 text-sage-bright" /> Internal Value Buckets
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {internalBuckets.map((b, i) => (
            <div key={i} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h4 className="text-xs font-semibold text-cream mb-2">{b.bucket}</h4>
              <p className="text-[10px] text-cream/60 leading-relaxed mb-2">{b.definition}</p>
              <div className="text-[10px] text-cream/50">
                <span className="font-medium text-cream/70">KPIs:</span> {b.kpis}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gold" /> External Value Buckets
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {externalBuckets.map((b, i) => (
            <div key={i} className="p-4 bg-white/5 border border-cream/10 rounded-xl">
              <h4 className="text-xs font-semibold text-cream mb-2">{b.bucket}</h4>
              <p className="text-[10px] text-cream/60 leading-relaxed mb-2">{b.definition}</p>
              <div className="text-[10px] text-cream/50">
                <span className="font-medium text-cream/70">KPIs:</span> {b.kpis}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- Section 6: AI Editorial Platform (Super Product) ----
// Edit guide: reframe as Opportunities (not problems), table format Opportunity | Impact
export function SuperProductSlide({ sectionLabel, heading, opportunities, problems, stages, features, efficiencies, valueTable, totalLow, totalHigh }: {
  sectionLabel?: string
  heading: string
  opportunities?: Array<{ opportunity: string; impact: string }>
  problems?: string[]
  stages?: Array<{ name: string; component: string; description: string }>
  features?: Array<{ feature: string; source: string; description: string }>
  efficiencies?: Array<{ title: string; description: string }>
  valueTable?: Array<{ area: string; ftes: string; lowValue: string; highValue: string; target: string }>
  totalLow?: string
  totalHigh?: string
}) {
  const opps = opportunities ?? (problems?.map(p => {
    const dash = p.indexOf(' — ')
    return dash >= 0 ? { opportunity: p.slice(0, dash), impact: p.slice(dash + 3) } : { opportunity: p, impact: '' }
  }) ?? [])
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      {/* Pipeline visualization */}
      {stages && stages.length > 0 && (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-sage-bright" /> Integrated Pipeline
        </h3>
        <div className="space-y-2">
          {stages.map((stage, i) => (
            <div key={i} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-sage/20 border border-sage/40 flex items-center justify-center text-xs font-mono text-sage-bright font-bold">{i + 1}</div>
                {i < stages.length - 1 && <div className="flex-1 w-px bg-sage/20 my-1" />}
              </div>
              <div className="flex-1 p-3 bg-white/5 border border-cream/10 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-cream">{stage.name}</span>
                  <span className="text-[10px] text-cream/40 font-mono">({stage.component})</span>
                </div>
                <p className="text-[10px] text-cream/60 leading-relaxed">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      {/* Opportunities (reframed from problems per edit guide) */}
      {opps.length > 0 && (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-sage-bright" /> Opportunities
        </h3>
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left py-2 pr-4 text-cream/50 font-medium">Opportunity</th>
                <th className="text-left py-2 text-cream/50 font-medium">Impact</th>
              </tr>
            </thead>
            <tbody>
              {opps.map((o, i) => (
                <tr key={i} className="border-b border-cream/5">
                  <td className="py-2 pr-4 text-cream/90 font-medium">{o.opportunity}</td>
                  <td className="py-2 text-cream/70 leading-relaxed">{o.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  )
}

// ---- Section 16a: Internal Productivity Value Summary (p22) ----
export function InternalProductivityValueSlide({ sectionLabel, heading, rows, totalLow, totalHigh }: {
  sectionLabel?: string
  heading: string
  rows: Array<{
    initiative: string
    primaryValueDriver: string
    ftes: string
    comp: string
    lowUplift: string
    lowValue: string
    highUplift: string
    highValue: string
    rationale: string
  }>
  totalLow: string
  totalHigh: string
}) {
  return (
    <div className="space-y-4 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <p className="text-xs text-cream/60 italic">Outside in estimates to indicate directional value potential based on simple assumptions</p>
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Initiative</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Primary Value Driver</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">FTEs</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Comp</th>
                <th className="text-right py-2 pr-2 text-cream/50 font-medium">Low Uplift</th>
                <th className="text-right py-2 pr-2 text-cream/50 font-medium">Low Value</th>
                <th className="text-right py-2 pr-2 text-cream/50 font-medium">High Uplift</th>
                <th className="text-right py-2 pr-2 text-cream/50 font-medium">High Value</th>
                <th className="text-left py-2 text-cream/50 font-medium">Rationale</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-cream/5">
                  <td className="py-2 pr-2 text-cream/90 font-sans font-medium">{row.initiative}</td>
                  <td className="py-2 pr-2 text-cream/70 font-sans">{row.primaryValueDriver}</td>
                  <td className="py-2 pr-2 text-cream/60">{row.ftes}</td>
                  <td className="py-2 pr-2 text-cream/60">{row.comp}</td>
                  <td className="py-2 pr-2 text-right text-cream/60">{row.lowUplift}</td>
                  <td className="py-2 pr-2 text-right text-cream/60">{row.lowValue}</td>
                  <td className="py-2 pr-2 text-right text-cream/60">{row.highUplift}</td>
                  <td className="py-2 pr-2 text-right text-cream/60">{row.highValue}</td>
                  <td className="py-2 text-cream/60 font-sans leading-relaxed">{row.rationale}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-cream/20">
                <td colSpan={5} className="py-2.5 pr-2 text-cream font-sans font-semibold">TOTAL INTERNAL</td>
                <td className="py-2.5 pr-2 text-right text-gold font-bold">{totalLow}</td>
                <td className="py-2.5 pr-2" />
                <td className="py-2.5 pr-2 text-right text-gold font-bold">{totalHigh}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---- Section 16b: External Revenue Upside (pAdd) ----
export function ExternalRevenueSlide({ sectionLabel, heading, rows, totalLow, totalHigh }: {
  sectionLabel?: string
  heading: string
  rows: Array<{
    product: string
    primaryValueDriver: string
    lowAssumptions: string
    lowRevenue: string
    highAssumptions: string
    highRevenue: string
    rationale: string
  }>
  totalLow: string
  totalHigh: string
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <p className="text-xs text-cream/60 italic">Outside in estimates to indicate directional value potential based on simple assumptions</p>
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Product</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Primary Value Driver</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Low Assumptions</th>
                <th className="text-right py-2 pr-2 text-cream/50 font-medium">Low Revenue</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">High Assumptions</th>
                <th className="text-right py-2 pr-2 text-cream/50 font-medium">High Revenue</th>
                <th className="text-left py-2 text-cream/50 font-medium">Rationale</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-cream/5">
                  <td className="py-2 pr-2 text-cream/90 font-sans font-medium">{row.product}</td>
                  <td className="py-2 pr-2 text-cream/70 font-sans">{row.primaryValueDriver}</td>
                  <td className="py-2 pr-2 text-cream/60 font-sans">{row.lowAssumptions}</td>
                  <td className="py-2 pr-2 text-right text-cream/60">{row.lowRevenue}</td>
                  <td className="py-2 pr-2 text-cream/60 font-sans">{row.highAssumptions}</td>
                  <td className="py-2 pr-2 text-right text-cream/60">{row.highRevenue}</td>
                  <td className="py-2 text-cream/60 font-sans leading-relaxed">{row.rationale}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-cream/20">
                <td colSpan={3} className="py-2.5 pr-2 text-cream font-sans font-semibold">TOTAL EXTERNAL</td>
                <td className="py-2.5 pr-2 text-right text-gold font-bold">{totalLow}</td>
                <td className="py-2.5 pr-2" />
                <td className="py-2.5 pr-2 text-right text-gold font-bold">{totalHigh}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---- Section 16: Value Quantification (combined — kept for reference; prefer Internal + External separate) ----
export function ValueQuantificationSlide({ sectionLabel, heading, subtitle, internalTable, externalTable, combinedSummary, totalOpportunity }: {
  sectionLabel?: string
  heading: string
  subtitle: string
  internalTable: {
    headers: string[]
    rows: Array<{ area: string; ftes: string; comp: string; target: string; lowUplift: string; lowValue: string; highUplift: string; highValue: string }>
    totalLow: string
    totalHigh: string
  }
  externalTable: {
    headers: string[]
    rows: Array<{ product: string; lowAssumptions: string; lowRevenue: string; highAssumptions: string; highRevenue: string }>
    totalLow: string
    totalHigh: string
  }
  combinedSummary: Array<{ category: string; low: string; high: string }>
  totalOpportunity: { low: string; high: string; pctLow: string; pctHigh: string }
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} subtitle={subtitle} />
      <div className="grid md:grid-cols-2 gap-6">
        {/* Internal Productivity */}
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-sage-bright" /> Internal Productivity
          </h3>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-[10px]">
              <thead className="sticky top-0 bg-void">
                <tr className="border-b border-cream/10">
                  {internalTable.headers.map((h, i) => (
                    <th key={i} className="text-left py-1.5 pr-2 text-cream/50 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono">
                {internalTable.rows.map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-1.5 pr-2 text-cream/80 font-sans">{row.area}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.ftes}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.comp}</td>
                    <td className="py-1.5 pr-2 text-cream/60 font-sans">{row.target}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.lowUplift}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.lowValue}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.highUplift}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.highValue}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-cream/20">
                  <td colSpan={5} className="py-2 pr-2 text-cream font-sans font-semibold">Total</td>
                  <td className="py-2 pr-2 text-gold font-bold">{internalTable.totalLow}</td>
                  <td className="py-2 pr-2" />
                  <td className="py-2 pr-2 text-gold font-bold">{internalTable.totalHigh}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* External Revenue */}
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" /> External Revenue
          </h3>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-[10px]">
              <thead className="sticky top-0 bg-void">
                <tr className="border-b border-cream/10">
                  {externalTable.headers.map((h, i) => (
                    <th key={i} className="text-left py-1.5 pr-2 text-cream/50 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono">
                {externalTable.rows.map((row, i) => (
                  <tr key={i} className="border-b border-cream/5">
                    <td className="py-1.5 pr-2 text-cream/80 font-sans">{row.product}</td>
                    <td className="py-1.5 pr-2 text-cream/60 font-sans">{row.lowAssumptions}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.lowRevenue}</td>
                    <td className="py-1.5 pr-2 text-cream/60 font-sans">{row.highAssumptions}</td>
                    <td className="py-1.5 pr-2 text-cream/60">{row.highRevenue}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-cream/20">
                  <td colSpan={2} className="py-2 pr-2 text-cream font-sans font-semibold">Total</td>
                  <td className="py-2 pr-2 text-gold font-bold">{externalTable.totalLow}</td>
                  <td className="py-2 pr-2" />
                  <td className="py-2 pr-2 text-gold font-bold">{externalTable.totalHigh}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Combined Summary */}
      <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl">
        <h3 className="text-sm font-semibold text-gold mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gold" /> Combined Value Summary
        </h3>
        <div className="space-y-2 font-mono text-sm">
          {combinedSummary.map((row, i) => (
            <div key={i} className="flex justify-between text-cream/70">
              <span className="font-sans">{row.category}</span>
              <span>{row.low} &ndash; {row.high}</span>
            </div>
          ))}
          <div className="flex justify-between border-t-2 border-gold/30 pt-3 mt-3">
            <span className="font-sans text-cream font-semibold">Total Opportunity</span>
            <span className="text-gold font-bold">{totalOpportunity.low} &ndash; {totalOpportunity.high}</span>
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-cream/50 font-sans">({totalOpportunity.pctLow} &ndash; {totalOpportunity.pctHigh} of revenue)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Section 17: Leading Indicators ----
export function LeadingIndicatorsSlide({ sectionLabel, heading, coreArgument, leadingIndicators, makingMeasurementWork, recommendation }: {
  sectionLabel?: string
  heading: string
  coreArgument?: string
  leadingIndicators: Array<{ category: string; indicator: string; sourceSlides: string; howToMeasure: string }>
  makingMeasurementWork?: string[]
  recommendation?: string
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      {/* Core argument callout */}
      {coreArgument && (
        <div className="p-4 bg-sage/10 border border-sage/30 rounded-xl">
          <p className="text-sm text-cream/90 leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-sage-bright flex-shrink-0 mt-0.5" />
            {coreArgument}
          </p>
        </div>
      )}
      {/* Leading indicators table — full width */}
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" /> Leading Indicators
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Category</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Indicator</th>
                <th className="text-left py-2 pr-2 text-cream/50 font-medium">Source Slide(s)</th>
                <th className="text-left py-2 text-cream/50 font-medium">How to Measure</th>
              </tr>
            </thead>
            <tbody>
              {leadingIndicators.map((row, i) => (
                <tr key={i} className="border-b border-cream/5">
                  <td className="py-2 pr-2 text-cream/80 font-medium">{row.category}</td>
                  <td className="py-2 pr-2 text-cream/70">{row.indicator}</td>
                  <td className="py-2 pr-2 text-cream/60">{row.sourceSlides}</td>
                  <td className="py-2 text-cream/60 leading-relaxed">{row.howToMeasure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {recommendation && (
        <div className="p-4 bg-sage/5 border border-sage/20 rounded-xl">
          <h3 className="text-xs uppercase tracking-wider text-sage-bright font-semibold mb-2 flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Recommendation
          </h3>
          <p className="text-xs text-cream/70 leading-relaxed">{recommendation}</p>
        </div>
      )}
    </div>
  )
}

// ---- Section 19: Phased Roadmap ----
const phasedVariantStyles: Record<string, { border: string; badge: string; line: string }> = {
  green: {
    border: 'border-green-500/30 bg-green-500/5',
    badge: 'bg-green-500/20 text-green-300 border-green-500/30',
    line: 'bg-green-500/30',
  },
  sage: {
    border: 'border-sage/30 bg-sage/5',
    badge: 'bg-sage/20 text-sage-bright border-sage/30',
    line: 'bg-sage/30',
  },
  gold: {
    border: 'border-gold/30 bg-gold/5',
    badge: 'bg-gold/20 text-gold border-gold/30',
    line: 'bg-gold/30',
  },
}

export function RoadmapPhasedSlide({ sectionLabel, heading, phases, fourCards }: {
  sectionLabel?: string
  heading: string
  phases?: Array<{
    phase: string
    title: string
    items: string[]
    variant: string
  }>
  fourCards?: Array<{ num: string; title: string; description: string; variant: string }>
}) {
  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      {/* Four recommendation cards */}
      {fourCards && fourCards.length > 0 && (
      <div className="grid md:grid-cols-2 gap-4">
        {fourCards.map(card => {
          const styles = recommendationVariantStyles[card.variant] || recommendationVariantStyles.sage
          return (
            <div key={card.num} className={`p-5 rounded-xl border ${styles.border}`}>
              <span className={`text-3xl font-mono font-bold ${styles.iconColor} opacity-50`}>{card.num}</span>
              <h3 className="text-sm font-semibold text-cream mt-2 mb-1">{card.title}</h3>
              <p className="text-xs text-cream/60 leading-relaxed">{card.description}</p>
            </div>
          )
        })}
      </div>
      )}
      {/* Phased timeline */}
      {phases && phases.length > 0 && (
      <div className="space-y-3">
        {phases.map((phase, i) => {
          const styles = phasedVariantStyles[phase.variant] || phasedVariantStyles.sage
          return (
            <div key={i} className="flex items-stretch gap-4">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold ${styles.badge}`}>
                  {i + 1}
                </div>
                {i < phases.length - 1 && <div className={`flex-1 w-px my-1 ${styles.line}`} />}
              </div>
              <div className={`flex-1 p-4 rounded-xl border ${styles.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}>{phase.phase}</span>
                  <span className="text-sm font-semibold text-cream">{phase.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-cream/70">
                      <ArrowRight className="w-3 h-3 mt-0.5 text-cream/30 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}

// ---- ION Data Lake Deep Dive ----
export function IonDataLakeSlide({ sectionLabel, heading, acquisition, analytics, activation, requirements }: {
  sectionLabel?: string
  heading: string
  acquisition?: { publicData: string[]; proprietaryData: string[] }
  analytics?: string[]
  activation?: string[]
  requirements?: Array<{ requirement: string; description: string }>
}) {
  return (
    <div className="space-y-6 px-4">
      <div>
        {sectionLabel && <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>}
        <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2 max-w-[280px]">{heading}</h2>
      </div>
      {(acquisition || analytics || activation) && (
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl">
        {acquisition && (
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-sage-bright" /> Acquisition
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-cream/40 mb-1.5">Public / Commercial Data</h4>
              <ul className="space-y-1">
                {acquisition.publicData.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[10px] text-cream/60">
                    <Minus className="w-2.5 h-2.5 mt-0.5 text-cream/30 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-sage-bright/80 mb-1.5">Proprietary Data</h4>
              <ul className="space-y-1">
                {acquisition.proprietaryData.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[10px] text-cream/70">
                    <Minus className="w-2.5 h-2.5 mt-0.5 text-sage-bright flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        )}

        {analytics && (
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-helix-cyan" /> AI Analytics
          </h3>
          <ul className="space-y-1.5">
            {analytics.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[10px] text-cream/70">
                <ArrowRight className="w-2.5 h-2.5 mt-0.5 text-helix-cyan flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
        )}

        {activation && (
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold" /> Activation
          </h3>
          <ul className="space-y-1.5">
            {activation.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[10px] text-cream/70">
                <ArrowRight className="w-2.5 h-2.5 mt-0.5 text-gold flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
      )}

      {requirements && (
      <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
        <h3 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-sage-bright" /> Technical Requirements for AI Viability
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left py-2 pr-4 text-cream/50 font-medium w-32">Requirement</th>
                <th className="text-left py-2 text-cream/50 font-medium">What It Means</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req, i) => (
                <tr key={i} className="border-b border-cream/5">
                  <td className="py-2.5 pr-4 text-cream/90 font-medium align-top">{req.requirement}</td>
                  <td className="py-2.5 text-cream/60 leading-relaxed">{req.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  )
}

// ---- Combined Value Waterfall ----
export function CombinedValueWaterfallSlide({ sectionLabel, heading, internalItems, externalItems, internalTotal, externalTotal, grandTotal, footnote }: {
  sectionLabel?: string
  heading: string
  internalItems: Array<{ label: string; low: string; high: string; midpoint: number }>
  externalItems: Array<{ label: string; low: string; high: string; midpoint: number }>
  internalTotal: { low: string; high: string }
  externalTotal: { low: string; high: string }
  grandTotal: { low: string; high: string; pctLow: string; pctHigh: string }
  footnote: string
}) {
  const maxMid = Math.max(
    ...internalItems.map(i => i.midpoint),
    ...externalItems.map(i => i.midpoint),
  )
  const barScale = (mid: number) => `${Math.max(8, (mid / maxMid) * 100)}%`

  return (
    <div className="space-y-6 px-4">
      <SectionHeader section={sectionLabel} title={heading} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-sage-bright" /> Internal Productivity
          </h3>
          <div className="space-y-2">
            {internalItems.map((item, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-cream/70">{item.label}</span>
                  <span className="text-cream/50 font-mono">{item.low}–{item.high}</span>
                </div>
                <div className="h-3 bg-cream/5 rounded-full overflow-hidden">
                  <div className="h-full bg-sage/60 rounded-full" style={{ width: barScale(item.midpoint) }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-cream/10 text-xs">
              <span className="text-cream font-semibold">Internal Subtotal</span>
              <span className="text-sage-bright font-mono font-bold">{internalTotal.low}–{internalTotal.high}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-cream/10 rounded-xl">
          <h3 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" /> External Revenue
          </h3>
          <div className="space-y-2">
            {externalItems.map((item, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-cream/70">{item.label}</span>
                  <span className="text-cream/50 font-mono">{item.low}–{item.high}</span>
                </div>
                <div className="h-3 bg-cream/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold/60 rounded-full" style={{ width: barScale(item.midpoint) }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-cream/10 text-xs">
              <span className="text-cream font-semibold">External Subtotal</span>
              <span className="text-gold font-mono font-bold">{externalTotal.low}–{externalTotal.high}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-gold/5 border-2 border-gold/30 rounded-xl text-center">
        <p className="text-xs uppercase tracking-wider text-cream/40 mb-2">Total Year 1 AI Impact</p>
        <p className="text-3xl md:text-4xl font-mono font-bold text-gold">{grandTotal.low} – {grandTotal.high}</p>
        <p className="text-sm text-cream/50 mt-1">{grandTotal.pctLow}–{grandTotal.pctHigh} of revenue</p>
      </div>

      <div className="p-3 bg-cream/5 border border-cream/10 rounded-xl">
        <p className="text-[10px] text-cream/50 leading-relaxed">{footnote}</p>
      </div>
    </div>
  )
}
