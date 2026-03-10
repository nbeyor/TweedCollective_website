'use client'

import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'
import { chartTheme } from '@/lib/slideTemplates'

interface Props {
  data: CopilotDashboardData
}

const TEAM_COLOR = chartTheme.dashboard.pilot
const BASELINE_COLOR = chartTheme.dashboard.baseline
const COPILOT_COLOR = '#2563eb'
const VELOCITY_COLOR = '#d97706'
const TRANSITION_BG = 'rgba(148,163,184,0.08)'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CumulativeChart({ data }: Props) {
  const { weekly, summary } = data

  // Compute cumulative from weekly totalTickets (full timeline)
  const cumulative = useMemo(() => {
    let total = 0
    return weekly.map(w => {
      total += w.totalTickets
      return total
    })
  }, [weekly])

  // 4-week rolling velocity (tickets/week)
  const velocity = useMemo(() => {
    const window = data.rollingWindow
    return weekly.map((_, i) => {
      const windowEntries = weekly.slice(Math.max(0, i - window + 1), i + 1)
        .filter(e => !e.lowConfidence)
      if (windowEntries.length < 2) return null
      return windowEntries.reduce((s, e) => s + e.totalTickets, 0) / windowEntries.length
    })
  }, [weekly, data.rollingWindow])

  // Phase boundary indices
  const transitionStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'transition')
    return idx >= 0 ? idx : 0
  }, [weekly])

  const matureStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'mature')
    return idx >= 0 ? idx : weekly.length
  }, [weekly])

  const labels = weekly.map(e => formatWeekLabel(e.week))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = [
    {
      type: 'line',
      label: 'Cumulative tickets',
      data: cumulative,
      borderColor: TEAM_COLOR,
      backgroundColor: `${TEAM_COLOR}20`,
      fill: true,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: weekly.map(e => e.lowConfidence ? 0 : 3),
      pointHoverRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'line',
      label: 'Velocity (4w avg)',
      data: velocity,
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
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
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
          text: 'Cumulative Tickets',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
        },
        grid: { color: '#f5f5f4' },
      },
      y1: {
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tickets/week',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: VELOCITY_COLOR,
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
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
          pointStyleWidth: 8,
          boxHeight: 6,
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
      },
      tooltip: {
        backgroundColor: '#1c1917',
        titleFont: { family: 'DM Sans, sans-serif', size: 11 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 10 },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const v = ctx.parsed.y
            if (v == null) return ''
            if (ctx.dataset.label?.includes('Velocity')) return `${ctx.dataset.label}: ${v.toFixed(1)} tix/wk`
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

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Cumulative Output & Velocity
      </h3>
      <p className="text-[10px] text-[#a8a29e] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Total tickets over time with {data.rollingWindow}-week rolling velocity (tickets/week)
      </p>
      <div style={{ height: 200 }}>
        <Chart type="line" data={{ labels, datasets: datasets as never }} options={options as never} />
      </div>
      <div
        className="mt-3 rounded-lg px-3 py-2 text-center"
        style={{ backgroundColor: '#dcfce7', fontFamily: 'DM Sans, sans-serif' }}
      >
        <span className="text-xs font-semibold text-[#15803d]">
          {cumulative[cumulative.length - 1] ?? 0} total tickets across {summary.team_authors} developers
        </span>
      </div>
    </div>
  )
}
