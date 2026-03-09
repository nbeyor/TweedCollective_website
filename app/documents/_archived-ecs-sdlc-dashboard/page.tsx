'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { KpiDashboard } from '@/components/dashboard/KpiDashboard'

export default function DashboardPage() {
  return (
    <DocumentAccessWrapper
      documentId="ecs-sdlc-dashboard"
      documentTitle="eCS SDLC Dashboard — AI Dev Pilot KPIs"
    >
      <KpiDashboard />
    </DocumentAccessWrapper>
  )
}
