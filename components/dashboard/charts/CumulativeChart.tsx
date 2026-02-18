'use client'

import React from 'react'
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
import { Line } from 'react-chartjs-2'
import type { DashboardData } from '../types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface Props {
  data: DashboardData
}

const PILOT_COLOR = '#15803d'
const NONPILOT_COLOR = '#d97706'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CumulativeChart({ data }: Props) {
  const { cumulative, summary, config } = data
  const labels = cumulative.map(c => formatWeekLabel(c.week))

  const aiSharePct = (summary.ai_output_share * 100).toFixed(0)
  const devSharePct = ((config.pilotCount / (config.pilotCount + config.nonPilotCount)) * 100).toFixed(0)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pilot (cumulative)',
        data: cumulative.map(c => c.pilot_cumulative),
        borderColor: PILOT_COLOR,
        backgroundColor: `${PILOT_COLOR}20`,
        fill: true,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
        order: 2,
      },
      {
        label: 'Non-Pilot (cumulative)',
        data: cumulative.map(c => c.nonpilot_cumulative),
        borderColor: NONPILOT_COLOR,
        backgroundColor: `${NONPILOT_COLOR}20`,
        fill: true,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
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
          maxTicksLimit: 6,
          maxRotation: 0,
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tickets',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
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
      },
    },
  }

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Cumulative Output
      </h3>
      <div style={{ height: 180 }}>
        <Line data={chartData} options={options as never} />
      </div>
      <div
        className="mt-3 rounded-lg px-3 py-2 text-center"
        style={{ backgroundColor: '#dcfce7', fontFamily: 'DM Sans, sans-serif' }}
      >
        <span className="text-xs font-semibold text-[#15803d]">
          {devSharePct}% of devs → {aiSharePct}% of output
        </span>
      </div>
    </div>
  )
}
