'use client'

import React from 'react'
import { useAuth, useUser, SignUpButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Lock, ArrowLeft, Mail, UserPlus } from 'lucide-react'

interface DocumentAccessWrapperProps {
  documentId: string
  documentTitle?: string
  children: React.ReactNode
}

export default function DocumentAccessWrapper({ documentId, documentTitle, children }: DocumentAccessWrapperProps) {
  const { userId, isLoaded } = useAuth()
  const { user } = useUser()
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null)
  const [isChecking, setIsChecking] = React.useState(true)
  const [adminEmails, setAdminEmails] = React.useState<string[]>([])

  // Fetch admin emails for access request mailto link
  React.useEffect(() => {
    async function fetchAdminEmails() {
      try {
        const response = await fetch('/api/admin/emails')
        const data = await response.json()
        if (data.emails && data.emails.length > 0) {
          setAdminEmails(data.emails)
        }
      } catch (error) {
        console.error('Error fetching admin emails:', error)
      }
    }
    fetchAdminEmails()
  }, [])

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
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-sage" />
          </div>
          
          {userId ? (
            // User is signed in but doesn't have access
            <>
              <h2 className="text-2xl font-serif text-cream mb-2">Access Not Available</h2>
              <p className="text-sm text-cream/70 mb-6">
                Access is not available to this user. If you believe you should have access to this document, 
                please request access below.
              </p>
              <div className="space-y-3">
                <a
                  href={`mailto:${adminEmails.length > 0 ? adminEmails.join(',') : 'support@tweedcollective.ai'}?subject=${encodeURIComponent(`Document Access Request: ${documentTitle || documentId}`)}&body=${encodeURIComponent(`Hi,\n\nI would like to request access to the following document:\n\nDocument: ${documentTitle || documentId}\nDocument ID: ${documentId}\nUser Email: ${user?.primaryEmailAddress?.emailAddress || 'Not available'}\nUser ID: ${userId}\n\nThank you.`)}`}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Request Access</span>
                </a>
                <Link
                  href="/documents"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-cream/20 text-cream/80 hover:bg-cream/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Documents</span>
                </Link>
              </div>
            </>
          ) : (
            // User is not signed in
            <>
              <h2 className="text-2xl font-serif text-cream mb-2">Sign In Required</h2>
              <p className="text-sm text-cream/70 mb-6">
                This document requires authentication. Please sign in or create an account to access this content.
              </p>
              <div className="space-y-3">
                <SignUpButton mode="modal">
                  <button className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage/90 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-taupe text-cream font-semibold hover:bg-taupe/90 transition-colors">
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <Link
                  href="/documents"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-cream/20 text-cream/80 hover:bg-cream/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Documents</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
