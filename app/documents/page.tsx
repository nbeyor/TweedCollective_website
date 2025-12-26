import React from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Presentation, BarChart3, Code2, Lock, Globe, UserPlus } from 'lucide-react'
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'

// Document visibility types:
// - 'public': Anyone can view, no authentication required
// - 'listed': Listed on documents page, requires auth + access
// - 'unlisted': NOT listed on documents page, only accessible via direct link with auth + access

type DocumentVisibility = 'public' | 'listed' | 'unlisted'

interface DocumentMeta {
  id: string
  title: string
  description: string
  category: string
  icon: React.ElementType
  date: string
  readTime: string
  href: string
  visibility: DocumentVisibility
}

// Document metadata - add new documents here
const documents: DocumentMeta[] = [
  {
    id: 'health-tech-market-2024',
    title: 'Health-Tech Market Landscape: Entering 2026',
    description: 'Investment themes across stages (seed/venture/growth/buyout) and segments (pharmatech/provider-payor/consumer).',
    category: 'Market Research',
    icon: BarChart3,
    date: '2025-12',
    readTime: '20 min',
    href: '/documents/health-tech-market-2024',
    visibility: 'public',
  },
  {
    id: 'vibe-coding-pe-life-sciences',
    title: 'The Evolution of VIBE Coding in Enterprise - for PE Investors',
    description: 'How next-gen coding agents reshape product velocity, talent, and value creation in PE-backed companies.',
    category: 'Executive Briefing',
    icon: Code2,
    date: '2024-12',
    readTime: '25 min',
    href: '/documents/vibe-coding-pe-life-sciences',
    visibility: 'listed',
  },
  {
    id: 'ai-integration-framework',
    title: 'AI Integration Framework',
    description: 'How to effectively integrate AI capabilities into your health-tech product roadmap and operations.',
    category: 'Presentation',
    icon: Presentation,
    date: '2024-03',
    readTime: '12 min',
    href: '/documents/ai-integration-framework',
    visibility: 'listed',
  },
]

export default function DocumentsPage() {
  // Only show public and listed documents (not unlisted)
  const visibleDocs = documents.filter(d => d.visibility !== 'unlisted')

  return (
    <div className="pt-28">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-terra/5 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="caption mb-4 block">Resources</span>
            <h1 className="mb-6">Documents & Insights</h1>
            <p className="body-large max-w-2xl mb-6">
              Explore our collection of research, playbooks, and presentations designed to help 
              health-tech leaders accelerate growth and navigate complex markets.
            </p>
            <SignedOut>
              <div className="flex items-center gap-4">
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-purple-600 text-cream hover:bg-purple-700 transition-colors shadow-md">
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up for Access</span>
                  </button>
                </SignUpButton>
                <span className="text-warm-gray text-sm">to view protected documents</span>
              </div>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Documents List */}
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

      {/* CTA Section */}
      <section className="section bg-stone/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="caption mb-4 block">Stay Updated</span>
            <h2 className="mb-6">Get New Resources First</h2>
            <p className="body-large mb-8 max-w-xl mx-auto">
              Join our mailing list to receive the latest research, playbooks, and insights 
              delivered directly to your inbox.
            </p>
            <Link href="/contact" className="btn-primary">
              <span>Subscribe to Updates</span>
              <ChevronRight className="icon-sm" />
            </Link>
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
      className="group flex items-center gap-6 p-5 rounded-xl border border-stone/30 bg-cream hover:border-sage/50 hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-sage/20 to-terra/20 flex items-center justify-center group-hover:scale-105 transition-transform">
        <Icon className="w-7 h-7 text-sage" />
      </div>
      
      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-charcoal group-hover:text-sage transition-colors truncate">
            {document.title}
          </h3>
          {isPublic ? (
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sage/20 text-sage">
              <Globe className="w-3 h-3" />
              Public
            </span>
          ) : (
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              <Lock className="w-3 h-3" />
              Protected
            </span>
          )}
        </div>
        <p className="text-sm text-warm-gray line-clamp-1 mb-2">{document.description}</p>
        <div className="flex items-center gap-4 text-xs text-warm-gray/70">
          <span className="badge-secondary">{document.category}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {document.readTime}
          </span>
        </div>
      </div>
      
      {/* Arrow */}
      <div className="flex-shrink-0">
        <ChevronRight className="w-5 h-5 text-warm-gray/50 group-hover:text-sage group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}
