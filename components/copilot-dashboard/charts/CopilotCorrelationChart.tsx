'use client'

import React from 'react'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'

interface Props {
  data: CopilotDashboardData
}

const ASSISTED_COLOR = '#2563eb'
const NON_ASSISTED_COLOR = '#a8a29e'
const QA_ASSISTED_COLOR = '#dc2626'
const QA_NON_ASSISTED_COLOR = '#f97316'

export function CopilotCorrelationChart({ data }: Props) {
  const corr = data.copilotPrCorrelation
  if (!corr) return null

  // Summary comparison: grouped bars for productivity and QA churn
  const chartData = {
    labels: ['Productivity (tix/FTE-day)', 'QA Churn Rate'],
    datasets: [
      {
        label: `Copilot-Assisted (${corr.assistedTickets} tickets)`,
        data: [corr.assistedProductivity, corr.assistedQAChurn],
        backgroundColor: [`${ASSISTED_COLOR}99`, `${QA_ASSISTED_COLOR}99`],
        borderColor: [ASSISTED_COLOR, QA_ASSISTED_COLOR],
        borderWidth: 1,
      },
      {
        label: `Non-Assisted (${corr.nonAssistedTickets} tickets)`,
        data: [corr.nonAssistedProductivity, corr.nonAssistedQAChurn],
        backgroundColor: [`${NON_ASSISTED_COLOR}99`, `${QA_NON_ASSISTED_COLOR}99`],
        borderColor: [NON_ASSISTED_COLOR, QA_NON_ASSISTED_COLOR],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: { family: 'DM Sans, sans-serif', size: 10 },
          color: '#57534e',
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
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

  const intensity = corr.copilotIntensity
  const intensityRows = ['low', 'medium', 'high'].filter(
    k => intensity[k] && intensity[k].tickets > 0
  )

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Copilot-Assisted vs Non-Assisted (Mature Period)
      </h3>
      <p className="text-[10px] text-[#a8a29e] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Tickets matched by author + week overlap &middot; {corr.assistedTickets} of {corr.totalTickets} tickets ({Math.round(corr.assistedTickets / corr.totalTickets * 100)}%) had Copilot-active authors
      </p>
      <div style={{ height: 180 }}>
        <Chart type="bar" data={chartData} options={options as never} />
      </div>

      {intensityRows.length > 0 && (
        <div className="mt-4 border-t border-[#f5f5f4] pt-3">
          <p className="text-[10px] font-medium text-[#a8a29e] uppercase tracking-wider mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            By Copilot Intensity (suggestions/ticket)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {intensityRows.map(k => {
              const b = intensity[k]
              const label = k === 'low' ? '≤10' : k === 'medium' ? '11–50' : '51+'
              return (
                <div key={k} className="rounded-lg bg-[#fafaf9] p-2 text-center">
                  <p className="text-[10px] text-[#a8a29e] uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {k} ({label})
                  </p>
                  <p className="text-sm font-semibold text-[#1c1917]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {b.tickets} tix
                  </p>
                  <p className="text-[10px] text-[#57534e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    QA: {(b.qaChurn * 100).toFixed(0)}%
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
