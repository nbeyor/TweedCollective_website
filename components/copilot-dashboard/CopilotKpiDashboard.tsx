'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
)

import type { CopilotDashboardData } from './types'
import { trimIncompleteWeeks } from './utils'
import { DashboardHeader } from './charts/DashboardHeader'
import { KpiCards } from './charts/KpiCards'
import { ProductivityChart } from './charts/ProductivityChart'
import { OutputVolumeChart } from './charts/OutputVolumeChart'
import { QaChurnChart } from './charts/QaChurnChart'
import { CumulativeChart } from './charts/CumulativeChart'
import { SurveySection } from './charts/SurveySection'
import { CopilotCorrelationChart } from './charts/CopilotCorrelationChart'
import { MethodologyFooter } from './charts/MethodologyFooter'

export function CopilotKpiDashboard() {
  const [data, setData] = useState<CopilotDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/copilot-dashboard-data.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load dashboard data: ${r.status}`)
        return r.json()
      })
      .then(d => setData(trimIncompleteWeeks(d)))
      .catch(e => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center p-8 rounded-xl border border-red-200 bg-white max-w-md">
          <p className="text-red-600 font-semibold mb-2">Dashboard Error</p>
          <p className="text-sm text-[#57534e]">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2563eb]/30 border-t-[#2563eb] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#57534e]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        <DashboardHeader data={data} />
        <div className="mb-6 flex gap-3">
          <Link
            href="/clients/ecs/sdlc-dashboard/roi"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-medium text-[#15803d] shadow-sm hover:bg-[#f0fdf4] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            View ROI Analysis →
          </Link>
          <Link
            href="/clients/ecs/sdlc-dashboard/size-complexity-trends"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-medium text-[#15803d] shadow-sm hover:bg-[#f0fdf4] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            View Size × Complexity Trends →
          </Link>
          <Link
            href="/clients/ecs/sdlc-dashboard/users"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-medium text-[#15803d] shadow-sm hover:bg-[#f0fdf4] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            View Per-Developer Breakdown →
          </Link>
        </div>
        <KpiCards data={data} />
        <ProductivityChart data={data} />
        <OutputVolumeChart data={data} />
        <QaChurnChart data={data} copilotAdoption={data.copilotAdoption} />

        <div className="grid grid-cols-2 gap-4 mb-8">
          <CopilotCorrelationChart data={data} />
          <CumulativeChart data={data} />
        </div>

        {data.survey && <SurveySection survey={data.survey} />}

        <MethodologyFooter data={data} />
      </div>
    </div>
  )
}
