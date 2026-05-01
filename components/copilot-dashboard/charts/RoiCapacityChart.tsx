'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'
import { chartTheme } from '@/lib/slideTemplates'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
)

const FULLY_LOADED_ANNUAL = 150_000
const MONTHLY_COST = FULLY_LOADED_ANNUAL / 12

const GREEN = chartTheme.dashboard.pilot       // #15803d
const GREEN_BG = '#dcfce7'
const BLUE = '#2563eb'
const DARK = '#1c1917'

interface MonthBucket {
  label: string         // e.g. "Oct 2025"
  month: string         // e.g. "2025-10"
  avgProductivity: number
  avgCopilotUsers: number
  avgAdoptionPct: number
  upliftPct: number
  fteEquivalent: number
  dollarValue: number
  cumulativeDollar: number
}

function aggregateMonths(data: CopilotDashboardData): MonthBucket[] {
  const baselineProd = data.baseline.productivity
  const byMonth = new Map<string, { prods: number[]; users: number[]; pcts: number[] }>()

  for (const w of data.weekly) {
    if (w.lowConfidence) continue
    if (w.copilotActiveUsers == null || w.copilotPct == null) continue

    // w.week is the Saturday week-end label. Attribute to the month containing
    // the week's midpoint (Wednesday = Saturday − 3 days) so boundary weeks land
    // in the month where the majority of their days fall.
    const weekEnd = new Date(w.week + 'T00:00:00Z')
    const midpoint = new Date(weekEnd)
    midpoint.setUTCDate(midpoint.getUTCDate() - 3)
    const monthKey = `${midpoint.getUTCFullYear()}-${String(midpoint.getUTCMonth() + 1).padStart(2, '0')}`
    if (!byMonth.has(monthKey)) {
      byMonth.set(monthKey, { prods: [], users: [], pcts: [] })
    }
    const bucket = byMonth.get(monthKey)!
    bucket.prods.push(w.teamProductivity)
    bucket.users.push(w.copilotActiveUsers)
    bucket.pcts.push(w.copilotPct)
  }

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length

  const months: MonthBucket[] = []
  let cumulative = 0

  const sortedKeys = Array.from(byMonth.keys()).sort()
  for (const key of sortedKeys) {
    const b = byMonth.get(key)!
    const avgProd = avg(b.prods)
    const avgUsers = avg(b.users)
    const avgPct = avg(b.pcts)
    const uplift = Math.max(0, (avgProd - baselineProd) / baselineProd)
    const fte = avgUsers * uplift
    const dollars = fte * MONTHLY_COST
    cumulative += dollars

    const d = new Date(key + '-15')
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    months.push({
      label,
      month: key,
      avgProductivity: avgProd,
      avgCopilotUsers: avgUsers,
      avgAdoptionPct: avgPct,
      upliftPct: uplift,
      fteEquivalent: fte,
      dollarValue: dollars,
      cumulativeDollar: cumulative,
    })
  }

  return months
}

function formatDollars(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`
  return `$${v.toFixed(0)}`
}

function formatDollarsLong(v: number): string {
  return '$' + Math.round(v).toLocaleString('en-US')
}

export function RoiCapacityChart() {
  const [data, setData] = useState<CopilotDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/copilot-dashboard-data.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load data: ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  const months = useMemo(() => {
    if (!data) return []
    return aggregateMonths(data)
  }, [data])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center p-8 rounded-xl border border-red-200 bg-white max-w-md">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p className="text-sm text-[#57534e]">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2563eb]/30 border-t-[#2563eb] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#57534e]">Loading ROI analysis...</p>
        </div>
      </div>
    )
  }

  const totalCumulative = months.length > 0 ? months[months.length - 1].cumulativeDollar : 0
  const currentRunRate = months.length > 0 ? months[months.length - 1].dollarValue : 0
  const peakMonth = months.reduce((max, m) => m.dollarValue > max.dollarValue ? m : max, months[0])

  const kpiCards = [
    {
      label: 'Total Capacity Released',
      value: formatDollarsLong(totalCumulative),
      context: `Cumulative across ${months.length} months`,
      accent: GREEN,
      accentBg: GREEN_BG,
    },
    {
      label: 'Current Monthly Run Rate',
      value: formatDollarsLong(currentRunRate),
      context: `${months[months.length - 1]?.fteEquivalent.toFixed(1) ?? '0'} FTE-equivalents`,
      accent: GREEN,
      accentBg: GREEN_BG,
    },
    {
      label: 'Peak Month',
      value: formatDollarsLong(peakMonth?.dollarValue ?? 0),
      context: peakMonth?.label ?? '—',
      accent: '#d97706',
      accentBg: '#fef3c7',
    },
  ]

  // --- Primary Chart: Monthly dollarized capacity + adoption overlay ---
  const primaryLabels = months.map(m => m.label)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const primaryDatasets: any[] = [
    {
      type: 'bar',
      label: 'Capacity Released ($/mo)',
      data: months.map(m => m.dollarValue),
      backgroundColor: `${GREEN}cc`,
      borderColor: GREEN,
      borderWidth: 1,
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'line',
      label: 'Copilot Adoption %',
      data: months.map(m => m.avgAdoptionPct),
      borderColor: BLUE,
      backgroundColor: `${BLUE}15`,
      fill: true,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      yAxisID: 'y1',
      order: 1,
    },
  ]

  const primaryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
        },
        grid: { display: false },
      },
      y: {
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Capacity Released ($ / month)',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
          callback: (v: number | string) => typeof v === 'number' ? formatDollars(v) : v,
        },
        grid: { color: '#f5f5f4' },
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Copilot Adoption %',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: BLUE,
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: BLUE,
          callback: (v: number | string) => typeof v === 'number' ? `${v}%` : v,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyleWidth: 10,
          boxHeight: 6,
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
      },
      tooltip: {
        backgroundColor: DARK,
        titleFont: { family: 'DM Sans, sans-serif', size: 12 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 11 },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const v = ctx.parsed.y
            if (v == null) return ''
            if (ctx.dataset.label?.includes('Adoption')) return `Adoption: ${v.toFixed(0)}%`
            return `Capacity: ${formatDollarsLong(v)}`
          },
        },
      },
      annotation: {
        annotations: {
          fteLine: {
            type: 'line' as const,
            yMin: MONTHLY_COST,
            yMax: MONTHLY_COST,
            yScaleID: 'y',
            borderColor: '#a8a29e',
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              display: true,
              content: `1 FTE = ${formatDollars(MONTHLY_COST)}/mo`,
              position: 'start' as const,
              backgroundColor: 'rgba(168,162,158,0.1)',
              color: '#a8a29e',
              font: { family: 'JetBrains Mono, monospace', size: 9 },
              padding: 3,
            },
          },
        },
      },
    },
  }

  // --- Cumulative Chart ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cumulativeDatasets: any[] = [
    {
      type: 'line',
      label: 'Cumulative Capacity Released',
      data: months.map(m => m.cumulativeDollar),
      borderColor: GREEN,
      backgroundColor: `${GREEN}20`,
      fill: true,
      borderWidth: 2.5,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      yAxisID: 'y',
    },
    {
      type: 'line',
      label: 'FTE-Equivalents',
      data: months.map(m => m.fteEquivalent),
      borderColor: '#d97706',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 3],
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
      yAxisID: 'y1',
    },
  ]

  const cumulativeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
        },
        grid: { display: false },
      },
      y: {
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative $',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
          callback: (v: number | string) => typeof v === 'number' ? formatDollars(v) : v,
        },
        grid: { color: '#f5f5f4' },
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'FTE-Equivalents Released',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#d97706',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#d97706',
          callback: (v: number | string) => typeof v === 'number' ? v.toFixed(1) : v,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyleWidth: 10,
          boxHeight: 6,
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
      },
      tooltip: {
        backgroundColor: DARK,
        titleFont: { family: 'DM Sans, sans-serif', size: 12 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 11 },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const v = ctx.parsed.y
            if (v == null) return ''
            if (ctx.dataset.label?.includes('FTE')) return `FTE-equiv: ${v.toFixed(1)}`
            return `Cumulative: ${formatDollarsLong(v)}`
          },
        },
      },
    },
  }

  // --- Detail table data ---
  const tableRows = months.map(m => ({
    label: m.label,
    adoption: `${m.avgAdoptionPct.toFixed(0)}%`,
    users: m.avgCopilotUsers.toFixed(1),
    uplift: `+${(m.upliftPct * 100).toFixed(1)}%`,
    fte: m.fteEquivalent.toFixed(1),
    monthly: formatDollarsLong(m.dollarValue),
    cumulative: formatDollarsLong(m.cumulativeDollar),
  }))

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/documents/ecs-sdlc-dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#1c1917] mb-4 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-[1.75rem] font-semibold text-[#1c1917] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            ROI Analysis — Dollarized Capacity Released
          </h1>
          <p className="text-sm text-[#57534e] max-w-3xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Engineering capacity released through AI-assisted productivity gains, expressed in dollar terms.
            As Copilot adoption grew and productivity increased, the team effectively unlocked additional
            engineering capacity without adding headcount.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {kpiCards.map((card) => (
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
              <p className="text-[11px] text-[#a8a29e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {card.context}
              </p>
            </div>
          ))}
        </div>

        {/* Primary Chart: Monthly Capacity + Adoption */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Monthly Capacity Released vs. Copilot Adoption
          </h2>
          <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Dollar value of engineering capacity unlocked each month, overlaid with team-wide adoption rate
          </p>
          <div style={{ height: 340 }}>
            <Chart type="bar" data={{ labels: primaryLabels, datasets: primaryDatasets as never }} options={primaryOptions as never} />
          </div>
        </div>

        {/* Cumulative Chart */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Cumulative Capacity Released
          </h2>
          <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Running total of dollarized capacity with FTE-equivalents released over time
          </p>
          <div style={{ height: 280 }}>
            <Chart type="line" data={{ labels: primaryLabels, datasets: cumulativeDatasets as never }} options={cumulativeOptions as never} />
          </div>
          <div
            className="mt-3 rounded-lg px-3 py-2 text-center"
            style={{ backgroundColor: GREEN_BG, fontFamily: 'DM Sans, sans-serif' }}
          >
            <span className="text-xs font-semibold" style={{ color: GREEN }}>
              {formatDollarsLong(totalCumulative)} total capacity released — equivalent to {(totalCumulative / FULLY_LOADED_ANNUAL).toFixed(1)} FTE-years
            </span>
          </div>
        </div>

        {/* Detail Table */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm overflow-x-auto">
          <h2 className="text-base font-semibold text-[#1c1917] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Monthly Breakdown
          </h2>
          <table className="w-full text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <thead>
              <tr className="text-left text-[10px] text-[#a8a29e] uppercase tracking-wider" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                <th className="pb-2 pr-4">Month</th>
                <th className="pb-2 pr-4 text-right">Adoption</th>
                <th className="pb-2 pr-4 text-right">Avg Users</th>
                <th className="pb-2 pr-4 text-right">Uplift</th>
                <th className="pb-2 pr-4 text-right">FTE-Equiv</th>
                <th className="pb-2 pr-4 text-right">Monthly $</th>
                <th className="pb-2 text-right">Cumulative $</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.label} className="border-t border-[#f5f5f4] text-[11px] text-[#1c1917]">
                  <td className="py-2 pr-4">{row.label}</td>
                  <td className="py-2 pr-4 text-right">{row.adoption}</td>
                  <td className="py-2 pr-4 text-right">{row.users}</td>
                  <td className="py-2 pr-4 text-right" style={{ color: GREEN }}>{row.uplift}</td>
                  <td className="py-2 pr-4 text-right">{row.fte}</td>
                  <td className="py-2 pr-4 text-right font-medium">{row.monthly}</td>
                  <td className="py-2 text-right font-medium">{row.cumulative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Methodology Footer */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Methodology & Assumptions
          </h3>
          <div className="text-[11px] text-[#57534e] space-y-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <p>
              <strong>Fully-loaded engineer cost:</strong>{' '}
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>${(FULLY_LOADED_ANNUAL / 1000).toFixed(0)}k/year</span>{' '}
              (<span style={{ fontFamily: 'JetBrains Mono, monospace' }}>${(MONTHLY_COST / 1000).toFixed(1)}k/month</span>)
            </p>
            <p>
              <strong>Capacity Released formula:</strong> For each month: (Avg Active Copilot Users) &times; (Productivity Uplift vs Pre-AI Baseline) &times; Monthly Engineer Cost.
              Productivity uplift is the percentage increase in tickets/FTE-day relative to the pre-AI baseline
              of <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{data.baseline.productivity.toFixed(4)}</span> tickets/FTE-day.
            </p>
            <p>
              <strong>Interpretation:</strong> This represents the dollar-equivalent of additional engineering output
              generated by AI-assisted productivity gains — as if the organization had hired additional engineers
              to achieve the same throughput increase.
            </p>
            <p>
              <strong>Limitations:</strong> Weeks with fewer than {data.minTicketsThreshold} tickets are excluded as low-confidence.
              Months with negative productivity uplift are floored at $0. This metric captures throughput gains only and does not
              account for quality improvements (e.g., reduced QA churn) or developer satisfaction benefits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
