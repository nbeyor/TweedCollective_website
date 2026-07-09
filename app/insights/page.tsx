import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getDocumentsByVisibility } from '@/content/documents'
import type { DocumentMeta } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Research and points of view on AI in life sciences from Tweed Collective.',
}

const documents = getDocumentsByVisibility('public')

function formatDate(date: string): string {
  const [year, month] = date.split('-').map(Number)
  if (!year || !month) return date
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[month - 1]} ${year}`
}

export default function InsightsPage() {
  return (
    <div className="pt-28 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-taupe/5" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Insights</span>
            <h1 className="text-cream mb-6">Insights</h1>
            <p className="body-large text-stone max-w-2xl">
              Research and points of view on AI in life sciences.
            </p>
          </div>
        </div>
      </section>

      {/* Insights List */}
      <section className="section">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <InsightListItem key={doc.id} document={doc} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function InsightListItem({ document, index }: { document: DocumentMeta; index: number }) {
  const Icon = document.icon

  return (
    <Link
      href={document.href}
      className="group card-light flex items-center gap-6 p-6 hover:shadow-card-light-hover"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-sage/10 to-taupe/10 flex items-center justify-center group-hover:scale-105 transition-transform">
        <Icon className="w-7 h-7 text-sage-light" />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-semibold text-carbon group-hover:text-sage transition-colors mb-1">
          {document.title}
        </h3>
        <p className="text-sm text-stone line-clamp-1 mb-2">{document.description}</p>
        <div className="flex items-center gap-4 text-xs text-zinc">
          {document.author && <span>{document.author}</span>}
          <span>{formatDate(document.date)}</span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0">
        <ChevronRight className="w-5 h-5 text-stone group-hover:text-sage-light group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}
