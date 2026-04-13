'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { ProjectThroughputChart } from '@/components/copilot-dashboard/charts/ProjectThroughputChart'

export default function ProjectsPage() {
  return (
    <DocumentAccessWrapper
      documentId="ecs-sdlc-dashboard"
      documentTitle="Project Throughput — Breadth & Velocity"
    >
      <ProjectThroughputChart />
    </DocumentAccessWrapper>
  )
}
