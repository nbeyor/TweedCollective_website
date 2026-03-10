'use client'

import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { CopilotDashboardData, CopilotAdoption } from '../types'
import { chartTheme } from '@/lib/slideTemplates'
import { formatWeekLabel } from '../utils'

interface Props {
  data: CopilotDashboardData
  copilotAdoption?: CopilotAdoption | null
}

const TEAM_COLOR = chartTheme.dashboard.pilot
const MUTED_COLOR = chartTheme.dashboard.muted
const BASELINE_COLOR = chartTheme.dashboard.baseline
const COPILOT_COLOR = '#2563eb'
const TRANSITION_BG = 'rgba(148,163,184,0.08)'

export function QaChurnChart({ data, copilotAdoption }: Props) {
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

  // Team QA rolling across entire timeline
  const teamRolling = useMemo(() => {
    const window = data.rollingWindow
    return weekly.map((_, i) => {
      const windowEntries = weekly.slice(Math.max(0, i - window + 1), i + 1)
        .filter(e => !e.lowConfidence)
        .filter(e => e.teamQARate != null)
      if (windowEntries.length < 2) return null
      const avg = windowEntries.reduce((s, e) => s + (e.teamQARate ?? 0), 0) / windowEntries.length
      return avg * 100
    })
  }, [weekly, data.rollingWindow])

  // Acceptance rate 4-week rolling average (aligned to main weekly by week field)
  const acceptanceRolling = useMemo(() => {
    if (!copilotAdoption?.weekly?.length) return null
    // Build week → acceptance rate map
    const rateByWeek = new Map<string, number>()
    for (const w of copilotAdoption.weekly) {
      if (w.totalCodeGen > 0) {
        rateByWeek.set(w.week, (w.totalCodeAccept / w.totalCodeGen) * 100)
      }
    }
    // Map to main weekly timeline and compute rolling avg
    const raw = weekly.map(e => rateByWeek.get(e.week) ?? null)
    const window = data.rollingWindow
    return raw.map((_, i) => {
      const vals: number[] = []
      for (let j = Math.max(0, i - window + 1); j <= i; j++) {
        if (raw[j] != null) vals.push(raw[j]!)
      }
      if (vals.length < 2) return null
      return vals.reduce((s, v) => s + v, 0) / vals.length
    })
  }, [weekly, copilotAdoption, data.rollingWindow])

  const labels = weekly.map(e => formatWeekLabel(e.week))

  const datasets = [
    {
      label: 'QA Churn (rolling avg)',
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
    {
      label: 'QA Churn (weekly)',
      data: weekly.map(e => e.teamQARate != null ? e.teamQARate * 100 : null),
      borderColor: weekly.map(e =>
        e.lowConfidence ? MUTED_COLOR :
        e.phase === 'transition' ? '#a8a29e' : TEAM_COLOR
      ),
      backgroundColor: weekly.map(e =>
        e.lowConfidence ? MUTED_COLOR :
        e.phase === 'transition' ? '#a8a29e' : TEAM_COLOR
      ),
      pointRadius: weekly.map(e => e.lowConfidence ? 2.5 : 4),
      pointStyle: weekly.map(e => e.phase === 'transition' ? 'rectRot' as const : 'circle' as const),
      showLine: false,
      yAxisID: 'y',
      order: 1,
    },
  ]

  if (acceptanceRolling) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    datasets.push({
      label: 'Acceptance Rate (rolling avg)',
      data: acceptanceRolling,
      borderColor: COPILOT_COLOR,
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
      spanGaps: false,
      yAxisID: 'y1',
      order: 3,
      borderDash: [6, 3],
    } as any)
  }

  const chartData = { labels, datasets }

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
          maxTicksLimit: 12,
          maxRotation: 0,
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'QA Churn Rate (%)',
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#a8a29e',
          callback: (v: number | string) => typeof v === 'number' ? `${v.toFixed(0)}%` : v,
        },
        grid: { color: '#f5f5f4' },
      },
      ...(acceptanceRolling ? {
        y1: {
          beginAtZero: true,
          position: 'right' as const,
          max: 50,
          title: {
            display: true,
            text: 'Acceptance Rate (%)',
            font: { family: 'DM Sans, sans-serif', size: 11 },
            color: COPILOT_COLOR,
          },
          ticks: {
            font: { family: 'JetBrains Mono, monospace', size: 10 },
            color: COPILOT_COLOR,
            callback: (v: number | string) => typeof v === 'number' ? `${v.toFixed(0)}%` : v,
          },
          grid: { display: false },
        },
      } : {}),
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
          filter: (item: { text: string }) => !item.text.includes('(weekly)'),
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
            return `${ctx.dataset.label}: ${v.toFixed(1)}%`
          },
        },
      },
      annotation: {
        annotations: {
          baselineChurn: {
            type: 'line' as const,
            yMin: baseline.qa_churn_rate * 100,
            yMax: baseline.qa_churn_rate * 100,
            borderColor: BASELINE_COLOR,
            borderWidth: 1.5,
            borderDash: [4, 4],
            label: {
              display: true,
              content: `Pre-AI baseline: ${(baseline.qa_churn_rate * 100).toFixed(1)}%`,
              position: 'start' as const,
              backgroundColor: 'rgba(148,163,184,0.1)',
              color: BASELINE_COLOR,
              font: { family: 'JetBrains Mono, monospace', size: 10 },
              padding: 4,
            },
          },
          transitionZone: {
            type: 'box' as const,
            xMin: transitionStartIdx - 0.5,
            xMax: matureStartIdx - 0.5,
            backgroundColor: TRANSITION_BG,
            borderWidth: 0,
          },
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
        Quality — QA Churn Rate vs Copilot Acceptance Rate
      </h2>
      <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        QA churn (% tickets with rework, lower is better) vs acceptance rate (% AI suggestions kept, {data.rollingWindow}-week rolling avg)
      </p>
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options as never} />
      </div>
    </div>
  )
}
