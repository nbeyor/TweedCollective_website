'use client'

import React from 'react'
import { Chart } from 'react-chartjs-2'
import type { DashboardData } from '../types'

interface Props {
  data: DashboardData
}

const PILOT_COLOR = '#15803d'
const NONPILOT_COLOR = '#d97706'

function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function AvailabilityChart({ data }: Props) {
  const { availability, weekly } = data
  const labels = availability.map(a => formatWeekLabel(a.week))

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Active Pilot Devs',
        data: availability.map(a => a.active_pilot_devs),
        backgroundColor: `${PILOT_COLOR}99`,
        borderColor: PILOT_COLOR,
        borderWidth: 1,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Total Tickets',
        data: weekly.map(w => w.totalTickets),
        borderColor: NONPILOT_COLOR,
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
          maxTicksLimit: 6,
          maxRotation: 0,
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
        },
        grid: { display: false },
      },
      y: {
        position: 'left' as const,
        beginAtZero: true,
        max: 7,
        title: {
          display: true,
          text: 'Active Devs',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
        ticks: {
          stepSize: 1,
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
          text: 'Tickets',
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
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
        Pilot Availability
      </h3>
      <div style={{ height: 220 }}>
        <Chart type="bar" data={chartData} options={options as never} />
      </div>
    </div>
  )
}
