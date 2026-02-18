'use client'

import React from 'react'
import type { DashboardData } from '../types'

interface Props {
  data: DashboardData
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
  const { summary, baseline, availability } = data

  const weeksAbove50 = availability.filter(a => a.availability_pct >= 0.5).length
  const availabilityPct = (weeksAbove50 / availability.length) * 100

  const pilotChurnBetter = summary.pilot_qa_churn <= summary.nonpilot_qa_churn
  const productivityDelta = ((summary.pilot_productivity - baseline.productivity) / baseline.productivity) * 100
  const churnDelta = ((summary.pilot_qa_churn - baseline.qa_churn_rate) / baseline.qa_churn_rate) * 100

  const cards: CardDef[] = [
    {
      label: 'Pilot Productivity',
      value: summary.pilot_productivity.toFixed(3),
      delta: `${productivityDelta >= 0 ? '+' : ''}${productivityDelta.toFixed(0)}% vs baseline`,
      context: `tickets / FTE-day (baseline: ${baseline.productivity.toFixed(3)})`,
      accent: '#15803d',
      accentBg: '#dcfce7',
    },
    {
      label: 'Productivity Multiple',
      value: `${summary.productivity_ratio.toFixed(2)}×`,
      delta: summary.productivity_ratio >= 1 ? 'Pilot ≥ Non-Pilot' : 'Non-Pilot ahead',
      context: `${summary.weeks_of_data} high-confidence weeks`,
      accent: '#15803d',
      accentBg: '#dcfce7',
    },
    {
      label: 'Pilot QA Churn',
      value: `${(summary.pilot_qa_churn * 100).toFixed(1)}%`,
      delta: `${churnDelta >= 0 ? '+' : ''}${churnDelta.toFixed(0)}% vs baseline (${(baseline.qa_churn_rate * 100).toFixed(1)}%)`,
      context: `Non-pilot: ${(summary.nonpilot_qa_churn * 100).toFixed(1)}%`,
      accent: pilotChurnBetter ? '#15803d' : '#d97706',
      accentBg: pilotChurnBetter ? '#dcfce7' : '#fef3c7',
    },
    {
      label: 'AI Output Share',
      value: `${(summary.ai_output_share * 100).toFixed(1)}%`,
      delta: `${summary.pilot_tickets} of ${summary.total_tickets} tickets`,
      context: `${((data.config.pilotCount / (data.config.pilotCount + data.config.nonPilotCount)) * 100).toFixed(0)}% of developers`,
      accent: '#57534e',
      accentBg: '#f5f5f4',
    },
    {
      label: 'Availability',
      value: `${availabilityPct.toFixed(0)}%`,
      delta: `${weeksAbove50} of ${availability.length} weeks ≥ 50% active`,
      context: `${data.config.pilotCount} pilot developers`,
      accent: '#15803d',
      accentBg: '#dcfce7',
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
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
