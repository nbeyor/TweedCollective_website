'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { CopilotKpiDashboard } from '@/components/copilot-dashboard/CopilotKpiDashboard'

export default function DashboardPage() {
  return (
    <DocumentAccessWrapper
      documentId="ecs-sdlc-dashboard"
      documentTitle="eCS SDLC Dashboard — Copilot Adoption & Team Productivity"
    >
      <CopilotKpiDashboard />
    </DocumentAccessWrapper>
  )
}
