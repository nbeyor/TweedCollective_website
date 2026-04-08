'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { RoiCapacityChart } from '@/components/copilot-dashboard/charts/RoiCapacityChart'

export default function RoiPage() {
  return (
    <DocumentAccessWrapper
      documentId="ecs-sdlc-dashboard"
      documentTitle="ROI Analysis — Dollarized Capacity Released"
    >
      <RoiCapacityChart />
    </DocumentAccessWrapper>
  )
}
