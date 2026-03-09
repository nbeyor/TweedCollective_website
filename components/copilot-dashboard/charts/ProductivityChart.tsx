'use client'

import React, { useMemo } from 'react'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'
import { chartTheme } from '@/lib/slideTemplates'

interface Props {
  data: CopilotDashboardData
}

const TEAM_COLOR = chartTheme.dashboard.pilot
const MUTED_COLOR = chartTheme.dashboard.muted
const BASELINE_COLOR = chartTheme.dashboard.baseline
const COPILOT_COLOR = '#2563eb'
const TRANSITION_BG = 'rgba(148,163,184,0.08)'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ProductivityChart({ data }: Props) {
  const { weekly, baseline } = data

  // Find phase boundary indices
  const transitionStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'transition')
    return idx >= 0 ? idx : 0
  }, [weekly])

  const matureStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'mature')
    return idx >= 0 ? idx : weekly.length
  }, [weekly])

  // Team rolling average across entire timeline
  const teamRolling = useMemo(() => {
    const window = data.rollingWindow
    return weekly.map((_, i) => {
      const windowEntries = weekly.slice(Math.max(0, i - window + 1), i + 1)
        .filter(e => !e.lowConfidence)
      if (windowEntries.length < 2) return null
      return windowEntries.reduce((s, e) => s + e.teamProductivity, 0) / windowEntries.length
    })
  }, [weekly, data.rollingWindow])

  const labels = weekly.map(e => formatWeekLabel(e.week))
  const hasCopilot = weekly.some(e => e.copilotPct != null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = [
    // 1. Team rolling avg — solid green line
    {
      type: 'line',
      label: 'Team (rolling avg)',
      data: teamRolling,
      borderColor: TEAM_COLOR,
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
      spanGaps: false,
      yAxisID: 'y',
      order: 2,
    },
    // 2. Team raw dots — color by phase
    {
      type: 'line',
      label: 'Team (weekly)',
      data: weekly.map(e => e.teamProductivity),
      borderColor: weekly.map(e =>
        e.lowConfidence ? MUTED_COLOR :
        e.phase === 'transition' ? '#a8a29e' : TEAM_COLOR
      ),
      backgroundColor: weekly.map(e =>
        e.lowConfidence ? MUTED_COLOR :
        e.phase === 'transition' ? '#a8a29e' : TEAM_COLOR
      ),
      pointRadius: weekly.map(e => e.lowConfidence ? 2.5 : 4),
      pointStyle: weekly.map(e => e.phase === 'transition' ? 'rectRot' : 'circle'),
      showLine: false,
      yAxisID: 'y',
      order: 1,
    },
  ]

  // 3. Copilot adoption % area (right axis) — only if data exists
  if (hasCopilot) {
    datasets.push({
      type: 'line',
      label: 'Copilot Adoption %',
      data: weekly.map(e => e.copilotPct),
      borderColor: COPILOT_COLOR,
      backgroundColor: `${COPILOT_COLOR}15`,
      fill: true,
      borderWidth: 1.5,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 3,
      spanGaps: false,
      yAxisID: 'y1',
      order: 4,
    })
  }

  const scales: Record<string, unknown> = {
    x: {
      ticks: {
        maxTicksLimit: 12,
        maxRotation: 0,
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        color: '#a8a29e',
      },
      grid: { display: false },
    },
    y: {
      position: 'left',
      beginAtZero: true,
      title: {
        display: true,
        text: 'Tickets / FTE-day',
        font: { family: 'DM Sans, sans-serif', size: 11 },
        color: '#57534e',
      },
      ticks: {
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        color: '#a8a29e',
        callback: (v: number | string) => typeof v === 'number' ? v.toFixed(2) : v,
      },
      grid: { color: '#f5f5f4' },
    },
  }

  if (hasCopilot) {
    scales.y1 = {
      position: 'right',
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: '% Devs Using Copilot',
        font: { family: 'DM Sans, sans-serif', size: 11 },
        color: COPILOT_COLOR,
      },
      ticks: {
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        color: COPILOT_COLOR,
        callback: (v: number | string) => typeof v === 'number' ? `${v}%` : v,
      },
      grid: { display: false },
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales,
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
          filter: (item: { text: string }) => !item.text.includes('weekly'),
        },
      },
      tooltip: {
        backgroundColor: '#1c1917',
        titleFont: { family: 'DM Sans, sans-serif', size: 12 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 11 },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const v = ctx.parsed.y
            if (v == null) return ''
            if (ctx.dataset.label?.includes('Copilot')) return `${ctx.dataset.label}: ${v.toFixed(0)}%`
            return `${ctx.dataset.label}: ${v.toFixed(3)}`
          },
        },
      },
      annotation: {
        annotations: {
          // Horizontal baseline avg line
          baselineAvg: {
            type: 'line' as const,
            yMin: baseline.productivity,
            yMax: baseline.productivity,
            borderColor: BASELINE_COLOR,
            borderWidth: 1.5,
            borderDash: [4, 4],
            label: {
              display: true,
              content: `Pre-AI baseline: ${baseline.productivity.toFixed(3)}`,
              position: 'start' as const,
              backgroundColor: 'rgba(148,163,184,0.1)',
              color: BASELINE_COLOR,
              font: { family: 'JetBrains Mono, monospace', size: 10 },
              padding: 4,
            },
          },
          // Transition zone shading
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
              font: { family: 'DM Sans, sans-serif', size: 10, style: 'italic' as const },
              padding: 4,
            },
          },
          // Vertical line: AI Rollout Begins
          rolloutStart: {
            type: 'line' as const,
            xMin: transitionStartIdx - 0.5,
            xMax: transitionStartIdx - 0.5,
            borderColor: BASELINE_COLOR,
            borderWidth: 1.5,
            borderDash: [4, 4],
            label: {
              display: true,
              content: 'AI Rollout',
              position: 'start' as const,
              backgroundColor: 'rgba(148,163,184,0.1)',
              color: BASELINE_COLOR,
              font: { family: 'DM Sans, sans-serif', size: 10 },
              padding: 4,
            },
          },
          // Vertical line: 80%+ Adoption
          matureStart: {
            type: 'line' as const,
            xMin: matureStartIdx - 0.5,
            xMax: matureStartIdx - 0.5,
            borderColor: COPILOT_COLOR,
            borderWidth: 1.5,
            borderDash: [4, 4],
            label: {
              display: true,
              content: '80%+ Adoption',
              position: 'start' as const,
              backgroundColor: 'rgba(37,99,235,0.1)',
              color: COPILOT_COLOR,
              font: { family: 'DM Sans, sans-serif', size: 10 },
              padding: 4,
            },
          },
        },
      },
    },
  }

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
      <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Team Productivity vs Pre-AI Baseline
      </h2>
      <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Tickets/FTE-day across three phases: pre-AI baseline, transition (Oct–Feb 6), and mature adoption (80%+, Feb 7+)
      </p>
      <div style={{ height: 320 }}>
        <Chart type="line" data={{ labels, datasets: datasets as never }} options={options as never} />
      </div>
    </div>
  )
}
