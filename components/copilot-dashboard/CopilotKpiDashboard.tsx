'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
import { DashboardHeader } from './charts/DashboardHeader'
import { KpiCards } from './charts/KpiCards'
import { ProductivityChart } from './charts/ProductivityChart'
import { QaChurnChart } from './charts/QaChurnChart'
import { CopilotAdoptionChart } from './charts/CopilotAdoptionChart'
import { SizeComplexityHeatmap } from './charts/SizeComplexityHeatmap'
import { SizeComplexityQaHeatmap } from './charts/SizeComplexityQaHeatmap'
import { CumulativeChart } from './charts/CumulativeChart'
import { SurveySection } from '../dashboard/charts/SurveySection'
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
      .then(setData)
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

  // Filter out incomplete last week (week date > data range end)
  const filtered = useMemo(() => {
    if (!data) return null
    const dataRangeEnd = data.dataRange.split(' to ')[1] ?? ''
    if (!dataRangeEnd) return data
    return {
      ...data,
      weekly: data.weekly.filter(w => w.week <= dataRangeEnd),
      cumulative: data.cumulative.filter(w => w.week <= dataRangeEnd),
      availability: data.availability.filter(w => w.week <= dataRangeEnd),
      copilotAdoption: data.copilotAdoption ? {
        ...data.copilotAdoption,
        weekly: data.copilotAdoption.weekly.filter(w => w.week <= dataRangeEnd),
      } : null,
    }
  }, [data])

  if (!filtered) {
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
        <DashboardHeader data={filtered} />
        <KpiCards data={filtered} />
        <ProductivityChart data={filtered} />
        <QaChurnChart data={filtered} copilotAdoption={filtered.copilotAdoption} />

        <div className="grid grid-cols-2 gap-4 mb-8">
          <CopilotAdoptionChart data={filtered} />
          <SizeComplexityHeatmap data={filtered} />
          <SizeComplexityQaHeatmap data={filtered} />
          <CumulativeChart data={filtered} />
        </div>

        {filtered.survey && <SurveySection survey={filtered.survey} />}

        <MethodologyFooter data={filtered} />
      </div>
    </div>
  )
}
