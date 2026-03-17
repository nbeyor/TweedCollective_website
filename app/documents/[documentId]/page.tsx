'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PresentationLayout from '@/components/presentation/PresentationLayout'
import type { Slide } from '@/components/presentation/PresentationLayout'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { renderSlides } from '@/components/presentation/SlideRenderer'
import { customComponentRegistry } from '@/components/presentation/custom'
import { getDocumentConfigById } from '@/content/documents'
import { loadDocumentContent } from '@/content/documents/loader'
import type { SlideData } from '@/lib/types'

export default function DocumentPage() {
  const params = useParams()
  const documentId = params.documentId as string

  const [slides, setSlides] = useState<Slide[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const config = getDocumentConfigById(documentId)

  useEffect(() => {
    if (!documentId) return

    loadDocumentContent(documentId)
      .then((slideData: SlideData[] | null) => {
        if (!slideData) {
          setError('Document content not found')
          return
        }
        setSlides(renderSlides(slideData, customComponentRegistry))
      })
      .catch((e: Error) => {
        setError(e.message)
      })
  }, [documentId])

  if (!config) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-cream/60 text-lg">Document not found</p>
          <a href="/documents" className="text-sage-bright text-sm mt-2 inline-block hover:underline">
            Back to documents
          </a>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Error loading document</p>
          <p className="text-cream/40 text-sm">{error}</p>
          <a href="/documents" className="text-sage-bright text-sm mt-4 inline-block hover:underline">
            Back to documents
          </a>
        </div>
      </div>
    )
  }

  if (!slides) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-3" />
          <p className="text-cream/40 text-sm">Loading presentation...</p>
        </div>
      </div>
    )
  }

  return (
    <DocumentAccessWrapper documentId={documentId} documentTitle={config.title}>
      <PresentationLayout
        title={config.title}
        subtitle={config.description}
        slides={slides}
        classificationBanner={config.visibility === 'unlisted' ? 'Confidential' : undefined}
        documentId={documentId}
      />
    </DocumentAccessWrapper>
  )
}
