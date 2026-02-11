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
          src="/api/dashboard-content"
          title="Portfolio Dashboard"
          className="w-full border-0"
          style={{ height: 'calc(100vh - 5rem)' }}
        />
      </div>
    </DocumentAccessWrapper>
  )
}
