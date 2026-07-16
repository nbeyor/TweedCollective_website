'use client'

import React from 'react'
import type { CopilotDashboardData } from '../types'
import { chartTheme, colors } from '@/lib/slideTemplates'

const TEAM_ACCENT = chartTheme.dashboard.pilot
const TEAM_BG = colors.green[100]
const COPILOT_ACCENT = '#2563eb' // blue for copilot
const COPILOT_BG = '#dbeafe'
const WARN_ACCENT = '#d97706'
const WARN_BG = '#fef3c7'

interface Props {
  data: CopilotDashboardData
}

interface CardDef {
  label: string
  value: string
  absolute: string
  context: string
  accent: string
  accentBg: string
}

export function KpiCards({ data }: Props) {
  const { summary, baseline } = data

  const productivityDelta = ((summary.team_productivity - baseline.productivity) / baseline.productivity) * 100
  const churnDelta = ((summary.team_qa_churn - baseline.qa_churn_rate) / baseline.qa_churn_rate) * 100
  const churnBetter = summary.team_qa_churn <= baseline.qa_churn_rate
  const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

  const cards: CardDef[] = [
    {
      label: 'Team Productivity',
      value: fmtPct(productivityDelta),
      absolute: `${summary.team_productivity.toFixed(3)} tickets / FTE-day`,
      context: `vs pre-AI baseline ${baseline.productivity.toFixed(3)}`,
      accent: productivityDelta >= 0 ? TEAM_ACCENT : WARN_ACCENT,
      accentBg: productivityDelta >= 0 ? TEAM_BG : WARN_BG,
    },
    {
      label: 'QA Churn',
      value: fmtPct(churnDelta),
      absolute: `${(summary.team_qa_churn * 100).toFixed(1)}% churn rate`,
      context: `vs pre-AI baseline ${(baseline.qa_churn_rate * 100).toFixed(1)}% · lower is better`,
      accent: churnBetter ? TEAM_ACCENT : WARN_ACCENT,
      accentBg: churnBetter ? TEAM_BG : WARN_BG,
    },
  ]

  if (data.copilotPrCorrelation) {
    const corr = data.copilotPrCorrelation
    const liftPositive = corr.assistedProductivity >= corr.nonAssistedProductivity
    const churnLower = corr.assistedQAChurn <= corr.nonAssistedQAChurn
    cards.push({
      label: 'Copilot Impact on Productivity',
      value: corr.productivityLift,
      absolute: `${corr.assistedProductivity.toFixed(3)} vs ${corr.nonAssistedProductivity.toFixed(3)} tix/FTE-day`,
      context: 'copilot-assisted vs non-assisted tickets',
      accent: liftPositive ? COPILOT_ACCENT : WARN_ACCENT,
      accentBg: liftPositive ? COPILOT_BG : WARN_BG,
    })
    cards.push({
      label: 'Copilot Impact on QA Churn',
      value: corr.qaChurnDelta,
      absolute: `${(corr.assistedQAChurn * 100).toFixed(1)}% vs ${(corr.nonAssistedQAChurn * 100).toFixed(1)}% churn`,
      context: 'copilot-assisted vs non-assisted · lower is better',
      accent: churnLower ? COPILOT_ACCENT : WARN_ACCENT,
      accentBg: churnLower ? COPILOT_BG : WARN_BG,
    })
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {card.label}
          </p>
          <p
            className="text-3xl font-semibold mb-1"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: card.accent }}
          >
            {card.value}
          </p>
          <p className="text-xs text-[#57534e] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium mr-1"
              style={{ backgroundColor: card.accentBg, color: card.accent }}
            >
              {card.absolute}
            </span>
          </p>
          <p className="text-[11px] text-[#a8a29e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {card.context}
          </p>
        </div>
      ))}
    </div>
  )
}
