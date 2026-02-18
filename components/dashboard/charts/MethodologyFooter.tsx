'use client'

import React from 'react'
import type { DashboardData } from '../types'

interface Props {
  data: DashboardData
}

export function MethodologyFooter({ data }: Props) {
  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-[#fafaf9] p-6">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Methodology
      </h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px] text-[#57534e] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <div>
          <strong className="text-[#1c1917]">Productivity:</strong> Tickets completed ÷ (Roster × {data.config.workdaysPerWeek} workdays).
          Roster = {data.config.pilotCount} pilot, {data.config.nonPilotCount} non-pilot, every week.
        </div>
        <div>
          <strong className="text-[#1c1917]">QA Churn Rate:</strong> Tickets with QAChurnLines &gt; 0 ÷ Total tickets.
        </div>
        <div>
          <strong className="text-[#1c1917]">Availability:</strong> Unique pilot devs with any PR activity that week ÷ {data.config.pilotCount}.
        </div>
        <div>
          <strong className="text-[#1c1917]">Pilot ticket:</strong> ≥1 PR by a pilot UUID AND ticket completed after {data.pilotStart}.
        </div>
        <div>
          <strong className="text-[#1c1917]">Low-confidence week:</strong> &lt; {data.minTicketsThreshold} total tickets.
          Excluded from rolling averages. Shown dimmed on charts.
        </div>
        <div>
          <strong className="text-[#1c1917]">Rolling average:</strong> {data.rollingWindow}-week window, min 2 data points, high-confidence weeks only.
        </div>
        <div className="col-span-2">
          <strong className="text-[#1c1917]">Summary productivity:</strong> Mean of per-week productivity across{' '}
          {data.summary.weeks_of_data} high-confidence weeks only.
          Baseline period: {data.baseline.date_range} ({data.baseline.tickets} tickets, {data.baseline.authors} authors).
        </div>
      </div>
      <p className="mt-3 text-[10px] text-[#a8a29e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        Generated {data.generated} · Data range: {data.dataRange}
      </p>
    </div>
  )
}
