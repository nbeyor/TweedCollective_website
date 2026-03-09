'use client'

import React from 'react'
import type { CopilotDashboardData } from '../types'

interface Props {
  data: CopilotDashboardData
}

export function MethodologyFooter({ data }: Props) {
  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-[#fafaf9] p-6">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Methodology
      </h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px] text-[#57534e] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <div className="col-span-2">
          <strong className="text-[#1c1917]">Three-phase model:</strong>{' '}
          <strong>Pre-AI baseline</strong> (before {data.baselineEnd}) — no AI tools; {data.baseline.tickets} tickets, {data.baseline.authors} authors.{' '}
          <strong>Transition</strong> ({data.baselineEnd} – {data.matureStart}) — AI rollout, uneven 26–74% weekly adoption; shown but excluded from KPI comparisons.{' '}
          <strong>Mature adoption</strong> ({data.matureStart}+) — 80%+ weekly Copilot adoption; compared against pre-AI baseline.
        </div>
        <div>
          <strong className="text-[#1c1917]">Productivity:</strong> Tickets completed ÷ (Active authors × {data.config.workdaysPerWeek} workdays).
          Active authors counted per week from PR data.
        </div>
        <div>
          <strong className="text-[#1c1917]">QA Churn Rate:</strong> Tickets with QAChurnLines &gt; 0 ÷ Total tickets.
        </div>
        <div>
          <strong className="text-[#1c1917]">Copilot Adoption:</strong> Weekly active Copilot users from GitHub telemetry ÷ total users with Copilot access.
          {data.config.totalCopilotUsers != null && ` ${data.config.totalCopilotUsers} of ${data.config.teamSize} developers (${data.config.copilotCoveragePct}%).`}
        </div>
        <div>
          <strong className="text-[#1c1917]">User Tiers:</strong> Heavy = 30+ active days, Medium = 10–29, Light = &lt;10.
        </div>
        <div>
          <strong className="text-[#1c1917]">Low-confidence week:</strong> &lt; {data.minTicketsThreshold} total tickets.
          Excluded from rolling averages. Shown dimmed on charts.
        </div>
        <div>
          <strong className="text-[#1c1917]">Rolling average:</strong> {data.rollingWindow}-week window, min 2 data points, high-confidence weeks only.
        </div>
        <div className="col-span-2">
          <strong className="text-[#1c1917]">Why team-wide (not pilot vs non-pilot):</strong> Copilot telemetry shows {data.config.copilotCoveragePct ?? '~96'}% of developers actively use AI tools.
          The non-pilot group is not a true control. This dashboard compares the entire team at mature adoption against the pre-AI baseline.
        </div>
      </div>
      <p className="mt-3 text-[10px] text-[#a8a29e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        Generated {data.generated} · Data range: {data.dataRange}
      </p>
    </div>
  )
}
