import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BarChart3, FileText, ChevronRight } from 'lucide-react'
import { requireClientAccess } from '@/lib/client-access'
import { getClientConfig } from '@/content/clients'

export default async function ClientHomePage({ params }: { params: { clientSlug: string } }) {
  await requireClientAccess(params.clientSlug)

  const client = getClientConfig(params.clientSlug)
  if (!client) {
    notFound()
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <span className="mono-label mb-4 block">// {client.name}</span>
      <h1 className="text-cream mb-8">Deliverables</h1>

      <div className="space-y-4 max-w-3xl">
        {client.deliverables.map((deliverable) => {
          const Icon = deliverable.kind === 'dashboard' ? BarChart3 : FileText
          return (
            <Link
              key={deliverable.href}
              href={deliverable.href}
              className="card p-6 flex items-center gap-5 group hover:border-sage/50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-sage-light" />
              </div>
              <div className="flex-grow min-w-0">
                <h2 className="text-cream text-lg font-semibold mb-1">{deliverable.title}</h2>
                {deliverable.description && (
                  <p className="text-sm text-stone">{deliverable.description}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-stone group-hover:text-sage-light group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
