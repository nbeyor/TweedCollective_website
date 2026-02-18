'use client'

import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { DashboardData } from '../types'

interface Props {
  data: DashboardData
}

const PILOT_COLOR = '#15803d'
const NONPILOT_COLOR = '#d97706'
const BASELINE_COLOR = '#94a3b8'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function QaChurnChart({ data }: Props) {
  const { baselineWeekly, weekly, baseline } = data

  const merged = useMemo(() => {
    const baseConfident = baselineWeekly
      .filter(b => !b.lowConfidence)
      .map(b => ({
        week: b.week,
        npRate: b.nonpilotQARate,
        pilotRate: null as number | null,
        isPilotPeriod: false,
      }))

    const pilotConfident = weekly
      .filter(w => !w.lowConfidence)
      .map(w => ({
        week: w.week,
        npRate: w.nonpilotQARate,
        pilotRate: w.pilotQARate,
        isPilotPeriod: true,
      }))

    return [...baseConfident, ...pilotConfident]
  }, [baselineWeekly, weekly])

  const pilotStartIdx = useMemo(() => {
    return merged.findIndex(e => e.isPilotPeriod)
  }, [merged])

  const labels = merged.map(e => formatWeekLabel(e.week))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pilot QA Churn',
        data: merged.map(e => e.pilotRate != null ? e.pilotRate * 100 : null),
        borderColor: PILOT_COLOR,
        backgroundColor: PILOT_COLOR,
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: merged.map(e => e.isPilotPeriod ? 4 : 0),
        pointStyle: 'circle',
        spanGaps: false,
        order: 2,
      },
      {
        label: 'Non-Pilot QA Churn',
        data: merged.map(e => e.npRate != null ? e.npRate * 100 : null),
        borderColor: NONPILOT_COLOR,
        backgroundColor: NONPILOT_COLOR,
        borderWidth: 2,
        borderDash: [6, 3],
        tension: 0.3,
        pointRadius: 3,
        pointStyle: 'rectRot',
        spanGaps: false,
        order: 3,
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
              content: 'Pilot start',
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
        Quality — QA Churn Rate (High-Confidence Weeks Only)
      </h2>
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options as never} />
      </div>
    </div>
  )
}
