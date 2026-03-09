'use client'

import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'
import { chartTheme } from '@/lib/slideTemplates'

interface Props {
  data: CopilotDashboardData
}

const TEAM_COLOR = chartTheme.dashboard.pilot
const MUTED_COLOR = chartTheme.dashboard.muted
const BASELINE_COLOR = chartTheme.dashboard.baseline

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function QaChurnChart({ data }: Props) {
  const { baselineWeekly, weekly, baseline } = data
  const pilotStartIdx = baselineWeekly.length

  const merged = useMemo(() => {
    const baseEntries = baselineWeekly.map(b => ({
      week: b.week,
      teamRate: b.teamQARate,
      lowConfidence: b.lowConfidence,
      isPostPilot: false,
      teamRolling: null as number | null,
    }))

    const postEntries = weekly.map(w => ({
      week: w.week,
      teamRate: w.teamQARate,
      lowConfidence: w.lowConfidence,
      isPostPilot: true,
      teamRolling: w.teamQARateRolling,
    }))

    return [...baseEntries, ...postEntries]
  }, [baselineWeekly, weekly])

  // Team QA rolling across entire timeline
  const teamRolling = useMemo(() => {
    const window = data.rollingWindow
    return merged.map((_, i) => {
      const windowEntries = merged.slice(Math.max(0, i - window + 1), i + 1)
        .filter(e => !e.lowConfidence)
        .filter(e => e.teamRate != null)
      if (windowEntries.length < 2) return null
      const avg = windowEntries.reduce((s, e) => s + (e.teamRate ?? 0), 0) / windowEntries.length
      return avg * 100
    })
  }, [merged, data.rollingWindow])

  const labels = merged.map(e => formatWeekLabel(e.week))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Team (rolling avg)',
        data: teamRolling,
        borderColor: TEAM_COLOR,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false,
        order: 2,
      },
      {
        label: 'Team (weekly)',
        data: merged.map(e => e.teamRate != null ? e.teamRate * 100 : null),
        borderColor: merged.map(e => e.lowConfidence ? MUTED_COLOR : TEAM_COLOR),
        backgroundColor: merged.map(e => e.lowConfidence ? MUTED_COLOR : TEAM_COLOR),
        pointRadius: merged.map(e => e.lowConfidence ? 2.5 : 4),
        pointStyle: 'circle' as const,
        showLine: false,
        order: 1,
      },
    ],
  }

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
              content: `Baseline: ${(baseline.qa_churn_rate * 100).toFixed(1)}%`,
              position: 'start' as const,
              backgroundColor: 'rgba(148,163,184,0.1)',
              color: BASELINE_COLOR,
              font: { family: 'JetBrains Mono, monospace', size: 10 },
              padding: 4,
            },
          },
          pilotStart: {
            type: 'line' as const,
            xMin: pilotStartIdx - 0.5,
            xMax: pilotStartIdx - 0.5,
            borderColor: BASELINE_COLOR,
            borderWidth: 1.5,
            borderDash: [4, 4],
            label: {
              display: true,
              content: 'Copilot rollout',
              position: 'start' as const,
              backgroundColor: 'rgba(148,163,184,0.1)',
              color: BASELINE_COLOR,
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
      <h2 className="text-base font-semibold text-[#1c1917] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Quality — Team QA Churn Rate vs Baseline
      </h2>
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options as never} />
      </div>
    </div>
  )
}
