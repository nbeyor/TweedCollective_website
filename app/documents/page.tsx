import React from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Lock, Globe, UserPlus } from 'lucide-react'
import { SignUpButton, SignedOut } from '@clerk/nextjs'
import { getPublicDocuments } from '@/content/documents'
import type { DocumentMeta } from '@/lib/types'

// Get visible documents from centralized registry
const documents = getPublicDocuments()

export default function DocumentsPage() {
  // Documents are already filtered by getPublicDocuments()
  const visibleDocs = documents

  return (
    <div className="pt-28 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-taupe/5" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Resources</span>
            <h1 className="text-cream mb-6">Documents & Insights</h1>
            <p className="body-large text-stone max-w-2xl mb-6">
              Explore our collection of research, playbooks, and presentations designed to help 
              health-tech leaders accelerate growth and navigate complex markets.
            </p>
            <SignedOut>
              <div className="flex items-center gap-4">
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-sage text-cream hover:bg-sage-light transition-colors shadow-glow-sage">
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up for Access</span>
                  </button>
                </SignUpButton>
                <span className="text-zinc text-sm">to view protected documents</span>
              </div>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Documents List - Light Cards on Dark */}
        <section className="section">
          <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {visibleDocs.map((doc, index) => (
                <DocumentListItem key={doc.id} document={doc} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

function DocumentListItem({ document, index }: { document: DocumentMeta; index: number }) {
  const Icon = document.icon
  const isPublic = document.visibility === 'public'
  
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
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-carbon group-hover:text-sage transition-colors truncate">
          {document.title}
          </h3>
          {isPublic ? (
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sage/20 text-sage">
              <Globe className="w-3 h-3" />
              Public
            </span>
          ) : (
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sage/10 text-sage-light">
              <Lock className="w-3 h-3" />
              Protected
            </span>
          )}
        </div>
        <p className="text-sm text-stone line-clamp-1 mb-2">{document.description}</p>
        <div className="flex items-center gap-4 text-xs text-zinc">
          <span className="px-2 py-0.5 rounded bg-pearl text-stone">{document.category}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {document.readTime}
          </span>
        </div>
      </div>
      
      {/* Arrow */}
      <div className="flex-shrink-0">
        <ChevronRight className="w-5 h-5 text-stone group-hover:text-sage-light group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}
