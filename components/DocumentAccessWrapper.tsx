'use client'

import React from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Lock, ArrowLeft } from 'lucide-react'

interface DocumentAccessWrapperProps {
  documentId: string
  children: React.ReactNode
}

export default function DocumentAccessWrapper({ documentId, children }: DocumentAccessWrapperProps) {
  const { userId, isLoaded } = useAuth()
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null)
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    async function verifyAccess() {
      if (!isLoaded) return
      
      if (!userId) {
        setHasAccess(false)
        setIsChecking(false)
        return
      }

      try {
        const response = await fetch('/api/document-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId }),
        })
        
        const data = await response.json()
        setHasAccess(data.hasAccess)
      } catch (error) {
        console.error('Error verifying access:', error)
        setHasAccess(false)
      } finally {
        setIsChecking(false)
      }
    }

    verifyAccess()
  }, [userId, isLoaded, documentId])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cream/70">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-serif text-cream mb-2">Access Restricted</h2>
          <p className="text-sm text-cream/70 mb-6">
            {userId 
              ? "You don't have access to this document. Please contact your administrator to request access."
              : "Please sign in to access this document."
            }
          </p>
          <div className="space-y-3">
            {!userId && (
              <Link
                href="/sign-in"
                className="block w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage/90 transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/documents"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-cream/20 text-cream/80 hover:bg-cream/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
