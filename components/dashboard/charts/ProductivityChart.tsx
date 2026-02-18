'use client'

import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Line } from 'react-chartjs-2'
import type { DashboardData } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, annotationPlugin)

interface Props {
  data: DashboardData
}

const PILOT_COLOR = '#15803d'
const NONPILOT_COLOR = '#d97706'
const MUTED_COLOR = 'rgba(168,162,158,0.3)'
const BASELINE_COLOR = '#94a3b8'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ProductivityChart({ data }: Props) {
  const { baselineWeekly, weekly, baseline } = data
  const pilotStartIdx = baselineWeekly.length

  const merged = useMemo(() => {
    const baseEntries = baselineWeekly.map(b => ({
      week: b.week,
      nonpilotProductivity: b.nonpilotProductivity,
      pilotProductivity: null as number | null,
      lowConfidence: b.lowConfidence,
      isPilotPeriod: false,
      pilotRolling: null as number | null,
    }))

    const pilotEntries = weekly.map(w => ({
      week: w.week,
      nonpilotProductivity: w.nonpilotProductivity,
      pilotProductivity: w.pilotProductivity as number | null,
      lowConfidence: w.lowConfidence,
      isPilotPeriod: true,
      pilotRolling: w.pilotProductivityRolling,
    }))

    return [...baseEntries, ...pilotEntries]
  }, [baselineWeekly, weekly])

  // Compute non-pilot rolling average across entire timeline (4-week window, skip lowConfidence, min 2 pts)
  const npRolling = useMemo(() => {
    const window = data.rollingWindow
    return merged.map((_, i) => {
      const windowEntries = merged.slice(Math.max(0, i - window + 1), i + 1)
        .filter(e => !e.lowConfidence)
      if (windowEntries.length < 2) return null
      const avg = windowEntries.reduce((s, e) => s + e.nonpilotProductivity, 0) / windowEntries.length
      return avg
    })
  }, [merged, data.rollingWindow])

  const labels = merged.map(e => formatWeekLabel(e.week))

  const chartData = {
    labels,
    datasets: [
      // 1. Pilot rolling avg — solid green line, pilot period only
      {
        label: 'Pilot (rolling avg)',
        data: merged.map(e => e.pilotRolling),
        borderColor: PILOT_COLOR,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false,
        order: 2,
      },
      // 2. Non-pilot rolling avg — dashed amber, full timeline
      {
        label: 'Non-Pilot (rolling avg)',
        data: npRolling,
        borderColor: NONPILOT_COLOR,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [6, 3],
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: false,
        order: 3,
      },
      // 3. Pilot raw dots — green circles, pilot period only
      {
        label: 'Pilot (weekly)',
        data: merged.map(e => e.isPilotPeriod ? e.pilotProductivity : null),
        borderColor: merged.map(e => e.lowConfidence ? MUTED_COLOR : PILOT_COLOR),
        backgroundColor: merged.map(e => e.lowConfidence ? MUTED_COLOR : PILOT_COLOR),
        pointRadius: merged.map(e => e.isPilotPeriod ? (e.lowConfidence ? 3 : 5) : 0),
        pointStyle: 'circle',
        showLine: false,
        order: 1,
      },
      // 4. Non-pilot raw dots — amber diamonds, full timeline
      {
        label: 'Non-Pilot (weekly)',
        data: merged.map(e => e.nonpilotProductivity),
        borderColor: merged.map(e => e.lowConfidence ? MUTED_COLOR : NONPILOT_COLOR),
        backgroundColor: merged.map(e => e.lowConfidence ? MUTED_COLOR : NONPILOT_COLOR),
        pointRadius: merged.map(e => e.lowConfidence ? 2.5 : 3.5),
        pointStyle: 'rectRot',
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
            return `${ctx.dataset.label}: ${v.toFixed(3)}`
          },
        },
      },
      annotation: {
        annotations: {
          baselineAvg: {
            type: 'line' as const,
            yMin: baseline.productivity,
            yMax: baseline.productivity,
            borderColor: BASELINE_COLOR,
            borderWidth: 1.5,
            borderDash: [4, 4],
            label: {
              display: true,
              content: `Baseline avg: ${baseline.productivity.toFixed(3)}`,
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
        Productivity — Tickets Completed per FTE-day
      </h2>
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options as never} />
      </div>
    </div>
  )
}
