'use client'

import React, { useEffect, useState } from 'react'
import type { DashboardData } from './types'
import { DashboardHeader } from './charts/DashboardHeader'
import { KpiCards } from './charts/KpiCards'
import { ProductivityChart } from './charts/ProductivityChart'
import { QaChurnChart } from './charts/QaChurnChart'
import { AvailabilityChart } from './charts/AvailabilityChart'
import { SizeComplexityHeatmap } from './charts/SizeComplexityHeatmap'
import { CumulativeChart } from './charts/CumulativeChart'
import { SurveySection } from './charts/SurveySection'
import { MethodologyFooter } from './charts/MethodologyFooter'

export function KpiDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/dashboard-data.json')
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#15803d]/30 border-t-[#15803d] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#57534e]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader data={data} />
        <KpiCards data={data} />
        <ProductivityChart data={data} />
        <QaChurnChart data={data} />

        <div className="grid grid-cols-3 gap-4 mb-8">
          <AvailabilityChart data={data} />
          <SizeComplexityHeatmap data={data} />
          <CumulativeChart data={data} />
        </div>

        {data.survey && <SurveySection survey={data.survey} />}
        <MethodologyFooter data={data} />
      </div>
    </div>
  )
}
