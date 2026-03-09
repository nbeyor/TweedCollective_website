'use client'

import React from 'react'
import type { CopilotDashboardData } from '../types'
import { chartTheme, colors } from '@/lib/slideTemplates'

const TEAM_ACCENT = chartTheme.dashboard.pilot
const TEAM_BG = colors.green[100]
const COPILOT_ACCENT = '#2563eb' // blue for copilot
const COPILOT_BG = '#dbeafe'
const NEUTRAL_ACCENT = colors.neutral[600]
const NEUTRAL_BG = colors.neutral[100]

interface Props {
  data: CopilotDashboardData
}

interface CardDef {
  label: string
  value: string
  delta: string
  context: string
  accent: string
  accentBg: string
}

export function KpiCards({ data }: Props) {
  const { summary, baseline } = data

  const productivityDelta = ((summary.team_productivity - baseline.productivity) / baseline.productivity) * 100
  const churnDelta = ((summary.team_qa_churn - baseline.qa_churn_rate) / baseline.qa_churn_rate) * 100
  const churnBetter = summary.team_qa_churn <= baseline.qa_churn_rate

  const cards: CardDef[] = [
    {
      label: 'Team Productivity (vs baseline)',
      value: summary.team_productivity.toFixed(3),
      delta: `${productivityDelta >= 0 ? '+' : ''}${productivityDelta.toFixed(1)}% vs baseline`,
      context: `tickets / FTE-day (baseline: ${baseline.productivity.toFixed(3)})`,
      accent: TEAM_ACCENT,
      accentBg: TEAM_BG,
    },
    {
      label: 'QA Churn (vs baseline)',
      value: `${(summary.team_qa_churn * 100).toFixed(1)}%`,
      delta: `${churnDelta >= 0 ? '+' : ''}${churnDelta.toFixed(1)}% vs baseline (${(baseline.qa_churn_rate * 100).toFixed(1)}%)`,
      context: `lower is better`,
      accent: churnBetter ? TEAM_ACCENT : '#d97706',
      accentBg: churnBetter ? TEAM_BG : '#fef3c7',
    },
    {
      label: 'Total Output (post-pilot)',
      value: `${summary.total_tickets}`,
      delta: `${summary.team_authors} developers`,
      context: `${summary.weeks_of_data} high-confidence weeks`,
      accent: NEUTRAL_ACCENT,
      accentBg: NEUTRAL_BG,
    },
  ]

  if (data.copilotAdoption) {
    const adoption = data.copilotAdoption
    const lastWeek = adoption.weekly[adoption.weekly.length - 1]
    cards.push({
      label: 'Copilot Adoption (current)',
      value: `${lastWeek?.copilotPct ?? 0}%`,
      delta: adoption.adoptionTrend,
      context: `${adoption.totalCopilotUsers} of ${data.config.teamSize} developers`,
      accent: COPILOT_ACCENT,
      accentBg: COPILOT_BG,
    })
    cards.push({
      label: 'Avg Daily Copilot Users',
      value: `${adoption.avgDailyUsersRecent}`,
      delta: `last 4 weeks`,
      context: `${adoption.userTiers.heavy} heavy / ${adoption.userTiers.medium} medium / ${adoption.userTiers.light} light`,
      accent: COPILOT_ACCENT,
      accentBg: COPILOT_BG,
    })
    cards.push({
      label: 'Code Generations (latest week)',
      value: lastWeek ? `${lastWeek.totalCodeGen.toLocaleString()}` : '—',
      delta: `${lastWeek?.activeUsers ?? 0} active users`,
      context: `${lastWeek?.locAdded?.toLocaleString() ?? 0} lines added`,
      accent: COPILOT_ACCENT,
      accentBg: COPILOT_BG,
    })
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
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
              {card.delta}
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
