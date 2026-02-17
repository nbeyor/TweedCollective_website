'use client'

import React from 'react'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'

export default function DashboardPage() {
  return (
    <DocumentAccessWrapper
      documentId="dashboard"
      documentTitle="Portfolio Dashboard"
    >
      <div className="min-h-screen bg-void pt-20">
        <iframe
          src="/dashboards/portfolio.html"
          title="Portfolio Dashboard"
          className="w-full border-0"
          style={{ height: 'calc(100vh - 5rem)' }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </DocumentAccessWrapper>
  )
}
