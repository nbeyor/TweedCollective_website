'use client'

/**
 * One chart token rendered as an InsightPanel-style card. Fixed panels go
 * through the same FixedCharts components the workspace uses; generated specs
 * render the same sandboxed HTML document (buildChartHtml is a pure module).
 */

import React from 'react'

import { FixedChart } from '@/components/protocol-strategist/FixedCharts'
import { wcg } from '@/components/protocol-strategist/wcgTheme'
import { buildChartHtml } from '@/lib/generatedChart'
import type { ChartPayload } from './clientToken'

export function ChartCard({ payload }: { payload: ChartPayload }) {
  if (payload.kind === 'fixed') {
    return <FixedChart panel={payload.panel} expanded />
  }
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: wcg.surface, borderColor: wcg.border }}
    >
      <iframe
        sandbox=""
        srcDoc={buildChartHtml(payload.spec)}
        title={payload.spec.title}
        className="w-full border-0"
        style={{ height: 520 }}
      />
    </div>
  )
}
