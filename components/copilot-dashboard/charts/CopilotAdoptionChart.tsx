'use client'

import React from 'react'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'

interface Props {
  data: CopilotDashboardData
}

const COPILOT_COLOR = '#2563eb'
const CODE_GEN_COLOR = '#15803d'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CopilotAdoptionChart({ data }: Props) {
  const { availability } = data
  if (!availability || availability.length === 0) return null

  const labels = availability.map(a => formatWeekLabel(a.week))

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Active Copilot Users',
        data: availability.map(a => a.copilot_active_users),
        backgroundColor: `${COPILOT_COLOR}66`,
        borderColor: COPILOT_COLOR,
        borderWidth: 1,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Code Generations',
        data: availability.map(a => a.code_gen),
        borderColor: CODE_GEN_COLOR,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 2,
        yAxisID: 'y1',
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
          text: 'Active Users',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
        ticks: {
          stepSize: 5,
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
          text: 'Code Generations',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: CODE_GEN_COLOR,
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: CODE_GEN_COLOR,
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
      },
    },
  }

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Copilot Adoption Over Time
      </h3>
      <div style={{ height: 220 }}>
        <Chart type="bar" data={chartData} options={options as never} />
      </div>
    </div>
  )
}
