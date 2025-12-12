import React from 'react'
import Link from 'next/link'
import { FileText, ExternalLink, Clock, ChevronRight, Presentation, BookOpen, BarChart3, Code2 } from 'lucide-react'

// Document metadata - add new documents here
const documents = [
  {
    id: 'health-tech-market-2024',
    title: 'Health-Tech Market Landscape 2024',
    description: 'Comprehensive analysis of the health-tech market trends, emerging technologies, and investment opportunities shaping the industry.',
    category: 'Market Research',
    icon: BarChart3,
    date: '2024-01',
    readTime: '15 min',
    thumbnail: '/img/documents/market-landscape.svg',
    href: '/documents/health-tech-market-2024',
    featured: true,
  },
  {
    id: 'vibe-coding-pe-life-sciences',
    title: 'VIBE Coding in PE & Life Sciences',
    description: 'How next-gen coding agents reshape product velocity, talent, and value creation in PE-backed life sciences companies.',
    category: 'Executive Briefing',
    icon: Code2,
    date: '2024-12',
    readTime: '25 min',
    thumbnail: '/img/documents/vibe-coding.svg',
    href: '/documents/vibe-coding-pe-life-sciences',
    featured: true,
  },
  {
    id: 'ai-integration-framework',
    title: 'AI Integration Framework',
    description: 'How to effectively integrate AI capabilities into your health-tech product roadmap and operations.',
    category: 'Presentation',
    icon: Presentation,
    date: '2024-03',
    readTime: '12 min',
    thumbnail: '/img/documents/ai-framework.svg',
    href: '/documents/ai-integration-framework',
    featured: false,
  },
]

export default function DocumentsPage() {
  const featuredDocs = documents.filter(d => d.featured)
  const otherDocs = documents.filter(d => !d.featured)

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
            <p className="body-large max-w-2xl">
              Explore our collection of research, playbooks, and presentations designed to help 
              health-tech leaders accelerate growth and navigate complex markets.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Documents */}
      {featuredDocs.length > 0 && (
        <section className="section">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2>Featured Resources</h2>
              <span className="caption text-warm-gray/60">{featuredDocs.length} featured</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredDocs.map((doc, index) => (
                <FeaturedDocumentCard key={doc.id} document={doc} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Documents Grid */}
      <section className="section bg-stone/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2>All Resources</h2>
            <span className="caption text-warm-gray/60">{documents.length} documents</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <DocumentCard key={doc.id} document={doc} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
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

interface Document {
  id: string
  title: string
  description: string
  category: string
  icon: React.ElementType
  date: string
  readTime: string
  thumbnail: string
  href: string
  featured: boolean
}

function FeaturedDocumentCard({ document, index }: { document: Document; index: number }) {
  const Icon = document.icon
  
  return (
    <Link 
      href={document.href}
      className="group card-interactive flex flex-col md:flex-row overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-sage/15 to-terra/15 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-cream/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-10 h-10 text-sage" />
          </div>
        </div>
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="badge bg-cream/95 text-charcoal shadow-sm">
            {document.category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col justify-center p-6 md:p-8">
        <h3 className="mb-3 group-hover:text-sage transition-colors">{document.title}</h3>
        <p className="body-small mb-4 line-clamp-2">{document.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-warm-gray/70">
          <span className="flex items-center gap-1.5">
            <Clock className="icon-xs" />
            {document.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-sage group-hover:translate-x-1 transition-transform">
            View Document
            <ChevronRight className="icon-xs" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function DocumentCard({ document, index }: { document: Document; index: number }) {
  const Icon = document.icon
  
  return (
    <Link 
      href={document.href}
      className="group card-interactive flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-sage/10 to-terra/10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-cream/90 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-sage" />
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-cream/95 text-charcoal text-[10px] shadow-sm">
            {document.category}
          </span>
        </div>
        
        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-cream/95 shadow-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ExternalLink className="icon-sm text-sage" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h4 className="mb-2 group-hover:text-sage transition-colors line-clamp-2">
          {document.title}
        </h4>
        <p className="body-small line-clamp-2 mb-3">{document.description}</p>
        
        <div className="flex items-center gap-3 text-xs text-warm-gray/60">
          <span className="flex items-center gap-1">
            <Clock className="icon-xs" />
            {document.readTime}
          </span>
        </div>
      </div>
    </Link>
  )
}

