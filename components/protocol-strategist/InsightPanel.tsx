'use client'

import React, { useState } from 'react'
import { BarChart3, Maximize2 } from 'lucide-react'

import { ChartLightbox } from './ChartLightbox'
import { FixedChart, type PanelDescriptor } from './FixedCharts'
import { wcg } from './wcgTheme'

export interface GeneratedChart {
  id: string
  title: string
  html: string
  caption?: string | null
}

export type Insight =
  | { kind: 'fixed'; key: string; panel: PanelDescriptor }
  | { kind: 'generated'; key: string; chart: GeneratedChart }

/**
 * The insight side panel. Fixed charts (pre-built, wired to corpus data the tool
 * retrieved) and generated charts (self-contained SVG in a sandboxed iframe)
 * stack here, newest first. Every card can expand into a full-screen lightbox.
 * The iframe carries no script — sandbox is fully locked — so a malformed chart
 * can never reach the page.
 */
export function InsightPanel({ insights }: { insights: Insight[] }) {
  const [expanded, setExpanded] = useState<Insight | null>(null)

  if (!insights.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8" style={{ color: wcg.faint }}>
        <BarChart3 className="w-8 h-8 mb-3" strokeWidth={1.3} />
        <p className="text-[13px] leading-relaxed" style={{ color: wcg.muted }}>
          Charts appear here as you interrogate the draft — a criteria-burden
          waterfall, sensitivity comparisons, the comparator landscape, and
          site-level breakdowns.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
      {insights.map((it) => (
        <div key={it.key} className="relative group">
          <button
            onClick={() => setExpanded(it)}
            aria-label="Expand chart"
            title="Expand"
            className="absolute top-2.5 right-2.5 z-10 rounded-md p-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ background: wcg.surfaceMuted, color: wcg.muted, border: `1px solid ${wcg.border}` }}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {it.kind === 'fixed' ? <FixedChart panel={it.panel} /> : <GeneratedChartCard chart={it.chart} />}
        </div>
      ))}
      <ChartLightbox insight={expanded} onClose={() => setExpanded(null)} />
    </div>
  )
}

function GeneratedChartCard({ chart }: { chart: GeneratedChart }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: wcg.surface, borderColor: wcg.border }}>
      <div className="px-4 pt-3">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.purple }}>
          Generated · this session
        </p>
      </div>
      <iframe
        title={chart.title}
        srcDoc={chart.html}
        sandbox=""
        className="w-full block border-0"
        style={{ height: 340 }}
      />
    </div>
  )
}
