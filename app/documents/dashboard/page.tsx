'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { KpiDashboard } from '@/components/dashboard/KpiDashboard'

export default function DashboardPage() {
  return (
    <DocumentAccessWrapper
      documentId="dashboard"
      documentTitle="AI Dev Pilot — KPI Dashboard"
    >
      <KpiDashboard />
    </DocumentAccessWrapper>
  )
}
