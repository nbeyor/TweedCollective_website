'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { SizeComplexityTrends } from '@/components/copilot-dashboard/charts/SizeComplexityTrends'

export default function SizeComplexityTrendsPage() {
  return (
    <DocumentAccessWrapper
      documentId="ecs-sdlc-dashboard"
      documentTitle="Size × Complexity — Week-over-Week Trends"
    >
      <SizeComplexityTrends />
    </DocumentAccessWrapper>
  )
}
