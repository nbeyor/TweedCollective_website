'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Shield, Settings, Users, FileText, ExternalLink, Lock, Globe, Eye, EyeOff, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getAllDocuments } from '@/content/documents'
import type { DocumentMeta } from '@/lib/types'

interface Tool {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  requiresAdmin?: boolean
}

const TOOLS: Tool[] = [
  {
    id: 'admin',
    title: 'Admin Dashboard',
    description: 'Manage users, document access, and send invitations',
    href: '/admin',
    icon: <Users className="w-6 h-6" />,
    requiresAdmin: true,
  },
]

// Get all documents including unlisted ones for internal view
const ALL_DOCUMENTS = getAllDocuments().filter(doc => doc.id !== 'internal-access')

export default function InternalPage() {
  const { userId, isLoaded } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded || !userId) {
        setHasAccess(false)
        return
      }

      try {
        // Check admin status
        const adminResponse = await fetch('/api/admin/check')
        const adminData = await adminResponse.json()
        
        if (adminData.isAdmin) {
          setIsAdmin(true)
          setHasAccess(true)
          return
        }

        // Check internal-access permission
        const accessResponse = await fetch('/api/document-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: 'internal-access' })
        })
        const accessData = await accessResponse.json()
        
        setIsAdmin(false)
        setHasAccess(accessData.hasAccess)
      } catch (error) {
        console.error('Error checking access:', error)
        setHasAccess(false)
      }
    }

    checkAccess()
  }, [userId, isLoaded])

  // Loading state
  if (!isLoaded || hasAccess === null) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin"></div>
      </div>
    )
  }

  // Not signed in
  if (!userId) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-cream/50" />
          <h1 className="text-2xl font-semibold text-cream mb-2">Sign In Required</h1>
          <p className="text-stone mb-6">Please sign in to access internal tools.</p>
          <Link href="/sign-in?redirect_url=/internal" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // No access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-cream/50" />
          <h1 className="text-2xl font-semibold text-cream mb-2">Access Restricted</h1>
          <p className="text-stone mb-6">
            You don&apos;t have access to internal tools. Contact an administrator if you believe this is an error.
          </p>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-sage" />
              <h1 className="text-3xl font-semibold text-cream">Internal Tools</h1>
            </div>
            <p className="text-stone">
              Access internal tools and resources for the Tweed Collective team.
            </p>
          </div>

          {/* Tools Grid */}
          {isAdmin && (
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group p-6 rounded-xl bg-carbon border border-slate hover:border-sage/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-sage/10 text-sage group-hover:bg-sage/20 transition-colors">
                      {tool.icon}
                    </div>
                    <ExternalLink className="w-5 h-5 text-stone opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-cream mb-2">{tool.title}</h3>
                  <p className="text-stone text-sm">{tool.description}</p>
                  {tool.requiresAdmin && (
                    <span className="inline-block mt-3 px-2 py-1 rounded text-xs font-medium bg-sage/10 text-sage">
                      Admin Only
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* All Documents Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-sage" />
              <h2 className="text-xl font-semibold text-cream">All Documents</h2>
            </div>
            <p className="text-stone mb-6 text-sm">
              Complete document registry including unlisted documents. Visibility indicates how documents appear on the public site.
            </p>
            <div className="space-y-3">
              {ALL_DOCUMENTS.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentRow({ document }: { document: DocumentMeta }) {
  const Icon = document.icon
  
  const getVisibilityBadge = () => {
    switch (document.visibility) {
      case 'public':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            <Globe className="w-3 h-3" />
            Public
          </span>
        )
      case 'listed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sage/20 text-sage-light">
            <Eye className="w-3 h-3" />
            Listed (Protected)
          </span>
        )
      case 'unlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-taupe/20 text-taupe">
            <EyeOff className="w-3 h-3" />
            Unlisted
          </span>
        )
    }
  }
  
  return (
    <Link
      href={document.href}
      className="group flex items-center gap-4 p-4 rounded-xl bg-carbon border border-slate hover:border-sage/50 transition-all duration-300"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-sage" />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-medium text-cream group-hover:text-sage-light transition-colors truncate">
            {document.title}
          </h3>
          {getVisibilityBadge()}
        </div>
        <div className="flex items-center gap-3 text-xs text-stone">
          <span>{document.category}</span>
          <span>•</span>
          <span>{document.readTime}</span>
          <span>•</span>
          <span className="font-mono text-zinc">{document.id}</span>
        </div>
      </div>
      
      <ChevronRight className="flex-shrink-0 w-4 h-4 text-stone group-hover:text-sage-light group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

