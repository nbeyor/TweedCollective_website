'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { UserAdoptionHeatmap } from '@/components/copilot-dashboard/charts/UserAdoptionHeatmap'

export default function UsersPage() {
  return (
    <DocumentAccessWrapper
      documentId="ecs-sdlc-dashboard"
      documentTitle="Per-Developer Adoption & Productivity"
    >
      <UserAdoptionHeatmap />
    </DocumentAccessWrapper>
  )
}
