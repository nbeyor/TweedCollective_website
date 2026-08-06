'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'

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
 * stack here, newest first. The iframe carries no script — sandbox is fully
 * locked — so a malformed chart can never reach the page.
 */
export function InsightPanel({ insights }: { insights: Insight[] }) {
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
      {insights.map((it) =>
        it.kind === 'fixed' ? (
          <FixedChart key={it.key} panel={it.panel} />
        ) : (
          <GeneratedChartCard key={it.key} chart={it.chart} />
        )
      )}
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
