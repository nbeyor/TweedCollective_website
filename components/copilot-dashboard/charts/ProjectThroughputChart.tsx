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
import type { CopilotDashboardData, ProjectWeeklyEntry } from '../types'
import { chartTheme } from '@/lib/slideTemplates'
import { formatWeekLabel } from '../utils'

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

const BREADTH_COLOR = chartTheme.dashboard.pilot       // green: breadth bars
const BREADTH_BG = '#dcfce7'
const VELOCITY_COLOR = '#d97706'                        // amber: velocity line
const COPILOT_COLOR = '#2563eb'
const BASELINE_COLOR = chartTheme.dashboard.baseline
const TRANSITION_BG = 'rgba(148,163,184,0.08)'
const DARK = '#1c1917'
const ROLLING_WINDOW = 4

function rollingAverage(values: (number | null)[], window: number): (number | null)[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1).filter((v): v is number => v != null)
    if (slice.length < 2) return null
    return slice.reduce((s, v) => s + v, 0) / slice.length
  })
}

export function ProjectThroughputChart() {
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

  // Trim any weekly rows beyond the data-range end (mirrors main dashboard behavior)
  const weekly = useMemo<ProjectWeeklyEntry[]>(() => {
    if (!data?.projects) return []
    const dataRangeEnd = data.dataRange.split(' to ')[1] ?? ''
    if (!dataRangeEnd) return data.projects.weekly
    return data.projects.weekly.filter(w => w.week <= dataRangeEnd)
  }, [data])

  const rollingVelocity = useMemo(
    () => rollingAverage(weekly.map(w => (w.activeProjects > 0 ? w.ticketsPerProject : null)), ROLLING_WINDOW),
    [weekly],
  )

  const transitionStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'transition')
    return idx >= 0 ? idx : 0
  }, [weekly])
  const matureStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'mature')
    return idx >= 0 ? idx : weekly.length
  }, [weekly])

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
          <p className="text-sm text-[#57534e]">Loading project throughput...</p>
        </div>
      </div>
    )
  }

  if (!data.projects) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
          <Link
            href="/documents/ecs-sdlc-dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#1c1917] mb-4 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Back to Dashboard
          </Link>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-amber-800 font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Project tracking data not yet generated
            </p>
            <p className="text-sm text-amber-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Re-run <code className="text-xs bg-white px-1 rounded">python pipeline/refresh_copilot.py</code> to populate the <code className="text-xs bg-white px-1 rounded">projects</code> section of the dashboard JSON.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { projects } = data
  const labels = weekly.map(w => formatWeekLabel(w.week))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = [
    {
      type: 'bar',
      label: 'Active Projects (breadth)',
      data: weekly.map(w => w.activeProjects),
      backgroundColor: `${BREADTH_COLOR}b3`,
      borderColor: BREADTH_COLOR,
      borderWidth: 1,
      borderRadius: 3,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'line',
      label: `Tickets / Project (${ROLLING_WINDOW}w avg)`,
      data: rollingVelocity,
      borderColor: VELOCITY_COLOR,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 3],
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
      spanGaps: false,
      yAxisID: 'y1',
      order: 1,
    },
  ]

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 0,
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
        },
        grid: { display: false },
      },
      y: {
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Active Projects / week',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
        ticks: {
          precision: 0,
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
        },
        grid: { color: '#f5f5f4' },
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tickets per Project',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: VELOCITY_COLOR,
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: VELOCITY_COLOR,
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
            if (ctx.dataset.label?.includes('Tickets / Project')) {
              return `${ctx.dataset.label}: ${v.toFixed(2)} tix/project`
            }
            return `${ctx.dataset.label}: ${v}`
          },
        },
      },
      annotation: {
        annotations: {
          transitionZone: {
            type: 'box' as const,
            xMin: transitionStartIdx - 0.5,
            xMax: matureStartIdx - 0.5,
            backgroundColor: TRANSITION_BG,
            borderWidth: 0,
            label: {
              display: true,
              content: 'Transition',
              position: { x: 'center' as const, y: 'start' as const },
              color: '#a8a29e',
              font: { family: 'DM Sans, sans-serif', size: 9, style: 'italic' as const },
              padding: 3,
            },
          },
          rolloutStart: {
            type: 'line' as const,
            xMin: transitionStartIdx - 0.5,
            xMax: transitionStartIdx - 0.5,
            borderColor: BASELINE_COLOR,
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              display: true,
              content: 'AI Rollout',
              position: 'start' as const,
              backgroundColor: 'rgba(148,163,184,0.1)',
              color: BASELINE_COLOR,
              font: { family: 'DM Sans, sans-serif', size: 9 },
              padding: 3,
            },
          },
          matureStart: {
            type: 'line' as const,
            xMin: matureStartIdx - 0.5,
            xMax: matureStartIdx - 0.5,
            borderColor: COPILOT_COLOR,
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              display: true,
              content: '80%+ Adoption',
              position: 'start' as const,
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: COPILOT_COLOR,
              font: { family: 'DM Sans, sans-serif', size: 9 },
              padding: 3,
            },
          },
        },
      },
    },
  }

  const { baseline, mature, delta, topProjects } = projects

  const kpiCards = [
    {
      label: 'Unique Projects (mature)',
      value: String(mature.unique_projects),
      context: `Baseline: ${baseline.unique_projects} · ${delta.projects_vs_baseline} vs baseline`,
    },
    {
      label: 'Avg Projects / Week',
      value: mature.avg_projects_per_week.toFixed(2),
      context: `Baseline: ${baseline.avg_projects_per_week.toFixed(2)} · ${delta.breadth_vs_baseline} vs baseline`,
    },
    {
      label: 'Tickets / Project',
      value: mature.tickets_per_project.toFixed(2),
      context: `Baseline: ${baseline.tickets_per_project.toFixed(2)} · ${delta.velocity_vs_baseline} vs baseline`,
    },
  ]

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
            Project Throughput — Breadth & Velocity
          </h1>
          <p className="text-sm text-[#57534e] max-w-3xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Tickets are grouped by Jira project key (e.g. <code className="text-xs bg-[#f5f5f4] px-1 rounded">MYAPP-123</code> → project <code className="text-xs bg-[#f5f5f4] px-1 rounded">MYAPP</code>).
            Compares the pre-AI baseline window against the mature adoption window to ask: <em>are we engaging a broader
            portfolio of projects, and/or closing tickets within each project faster?</em>
          </p>
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-3 inline-block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Experimental view — data derived from existing ticket IDs, no new inputs required.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {kpiCards.map(card => (
            <div
              key={card.label}
              className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {card.label}
              </p>
              <p
                className="text-3xl font-semibold mb-1"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: BREADTH_COLOR }}
              >
                {card.value}
              </p>
              <p className="text-[11px] text-[#a8a29e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {card.context}
              </p>
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Weekly Project Breadth & Ticket Velocity
          </h2>
          <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Bars: distinct Jira projects touched each week · Line: {ROLLING_WINDOW}-week rolling average of tickets per active project
          </p>
          <div style={{ height: 320 }}>
            <Chart type="bar" data={{ labels, datasets: datasets as never }} options={options as never} />
          </div>
        </div>

        {/* Top projects table */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm overflow-x-auto">
          <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Top Projects — Baseline vs Mature
          </h2>
          <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Ranked by mature-period ticket count. Velocity = tickets / weeks active within each period. Green rows improved, red rows slowed.
          </p>
          {topProjects.length === 0 ? (
            <p className="text-sm text-[#a8a29e] italic" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              No projects with activity in either period yet.
            </p>
          ) : (
            <table className="w-full text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <thead>
                <tr className="text-left text-[10px] text-[#a8a29e] uppercase tracking-wider border-b border-[#e7e5e4]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4 text-right">Baseline Tix</th>
                  <th className="py-2 pr-4 text-right">Mature Tix</th>
                  <th className="py-2 pr-4 text-right">Baseline Vel.</th>
                  <th className="py-2 pr-4 text-right">Mature Vel.</th>
                  <th className="py-2 text-right">Δ Velocity</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map(row => {
                  const positive = row.velocityDelta.startsWith('+') && row.velocityDelta !== '+0.0%'
                  const negative = row.velocityDelta.startsWith('-')
                  const rowBg = positive ? 'bg-[#f0fdf4]' : negative ? 'bg-[#fef2f2]' : ''
                  const deltaColor = positive ? '#15803d' : negative ? '#b91c1c' : '#57534e'
                  return (
                    <tr key={row.project} className={`border-b border-[#f5f5f4] ${rowBg}`}>
                      <td className="py-2 pr-4 font-semibold text-[#1c1917]">{row.project}</td>
                      <td className="py-2 pr-4 text-right text-[#57534e]">{row.baselineTickets}</td>
                      <td className="py-2 pr-4 text-right text-[#57534e]">{row.matureTickets}</td>
                      <td className="py-2 pr-4 text-right text-[#57534e]">{row.baselineVelocity.toFixed(2)}</td>
                      <td className="py-2 pr-4 text-right text-[#57534e]">{row.matureVelocity.toFixed(2)}</td>
                      <td className="py-2 text-right font-semibold" style={{ color: deltaColor }}>
                        {row.velocityDelta}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Interpretation */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            How to read this
          </h2>
          <div className="space-y-2 text-sm text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <p><span className="font-semibold text-[#15803d]">Breadth up + velocity up</span> → capacity expansion. Team engaging more projects AND finishing more tickets per project. The hoped-for Copilot story.</p>
            <p><span className="font-semibold text-[#1c1917]">Breadth flat + velocity up</span> → focus. Same portfolio, closing tickets faster. Also a positive signal.</p>
            <p><span className="font-semibold text-[#b91c1c]">Breadth up + velocity down</span> → context-switching tax. More projects open, but progress per project is thinner. Worth flagging.</p>
            <p className="text-[11px] italic pt-2 border-t border-[#f5f5f4] mt-3">
              Caveat: Jira project keys don't always map 1:1 to business projects. Some teams use a single Jira project for many initiatives. Treat this as a directional signal, not a definitive measure of "project delivery."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
