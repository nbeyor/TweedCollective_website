'use client'

import React, { useEffect, useState } from 'react'
import { useAuth, useClerk } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, ArrowLeft, Mail } from 'lucide-react'

interface MagicLinkStatus {
  status: 'loading' | 'valid' | 'invalid' | 'used' | 'expired' | 'email-mismatch'
  documentId?: string
  error?: string
  targetEmail?: string
}

export default function MagicLinkPage() {
  const { userId, isLoaded } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()
  const params = useParams()
  const token = (params?.token as string) || ''
  const [magicLinkStatus, setMagicLinkStatus] = useState<MagicLinkStatus>({ status: 'loading' })
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    if (!token) {
      setMagicLinkStatus({ status: 'invalid', error: 'Invalid invitation link' })
      return
    }

    async function checkMagicLink() {
      if (!token) return
      
      try {
        const response = await fetch(`/api/magic-link/${token}`)
        const data = await response.json()

        if (response.status === 404) {
          setMagicLinkStatus({ status: 'invalid', error: data.error })
          return
        }

        if (response.status === 410) {
          setMagicLinkStatus({
            status: data.error?.includes('expired') ? 'expired' : 'used',
            error: data.error
          })
          return
        }

        if (response.status === 403 && data.error === 'Email mismatch') {
          setMagicLinkStatus({
            status: 'email-mismatch',
            error: data.message,
            targetEmail: data.targetEmail
          })
          return
        }

        if (data.needsAuth) {
          // Automatically redirect to sign-in page with redirect_url
          const redirectUrl = encodeURIComponent(`/magic-link/${token}`)
          router.push(`/sign-in?redirect_url=${redirectUrl}`)
          return
        }

        if (data.success) {
          setMagicLinkStatus({
            status: 'valid',
            documentId: data.documentId
          })
          // Redirect to document after short delay
          setTimeout(() => {
            router.push(`/documents/${data.documentId}`)
          }, 1500)
          return
        }

        setMagicLinkStatus({ status: 'invalid', error: data.error || 'Unknown error' })
      } catch (error) {
        console.error('Error checking invitation link:', error)
        setMagicLinkStatus({ status: 'invalid', error: 'Failed to validate invitation link' })
      }
    }

    // Only check magic link if user is not authenticated yet
    // If user is authenticated, the other useEffect will handle redemption
    if (isLoaded && token && !userId) {
      checkMagicLink()
    }
  }, [token, isLoaded, userId, router])

  useEffect(() => {
    // If user just signed in and we have a token, automatically redeem the magic link
    // This handles the case when user returns from sign-in page
    if (isLoaded && userId && token && magicLinkStatus.status === 'loading') {
      redeemMagicLink()
    }
  }, [isLoaded, userId, token, magicLinkStatus.status])

  async function redeemMagicLink() {
    if (redeeming || !token) return
    
    setRedeeming(true)
    try {
      const response = await fetch(`/api/magic-link/${token}`)
      const data = await response.json()

      if (data.success) {
        setMagicLinkStatus({
          status: 'valid',
          documentId: data.documentId
        })
        // Redirect to document
        setTimeout(() => {
          router.push(`/documents/${data.documentId}`)
        }, 1500)
      } else if (response.status === 403 && data.error === 'Email mismatch') {
        setMagicLinkStatus({
          status: 'email-mismatch',
          error: data.message,
          targetEmail: data.targetEmail
        })
      } else {
        setMagicLinkStatus({
          status: response.status === 410 ? (data.error?.includes('expired') ? 'expired' : 'used') : 'invalid',
          error: data.error || 'Failed to redeem invitation'
        })
      }
    } catch (error) {
      console.error('Error redeeming invitation:', error)
      setMagicLinkStatus({ status: 'invalid', error: 'Failed to redeem invitation' })
    } finally {
      setRedeeming(false)
    }
  }

  async function handleSignOutAndRetry() {
    await signOut()
    // After sign out, redirect to sign-in with this page as return URL
    const redirectUrl = encodeURIComponent(`/magic-link/${token}`)
    router.push(`/sign-in?redirect_url=${redirectUrl}`)
  }

  if (magicLinkStatus.status === 'loading' || redeeming) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold mx-auto mb-4 animate-spin" />
          <p className="text-cream/70">Validating invitation...</p>
        </div>
      </div>
    )
  }

  // Email mismatch - user signed in with wrong email
  if (magicLinkStatus.status === 'email-mismatch') {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-yellow-400" />
          </div>
          
          <h2 className="text-2xl font-serif text-cream mb-2">Wrong Email Address</h2>
          <p className="text-sm text-cream/70 mb-4">
            This invitation was sent to:
          </p>
          <p className="text-lg font-mono text-gold mb-4">
            {magicLinkStatus.targetEmail}
          </p>
          <p className="text-sm text-cream/70 mb-6">
            Please sign in with that email address to access this document.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleSignOutAndRetry}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage/90 transition-colors"
            >
              <span>Sign In with Different Email</span>
            </button>
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

  if (magicLinkStatus.status === 'invalid' || magicLinkStatus.status === 'expired' || magicLinkStatus.status === 'used') {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-2xl font-serif text-cream mb-2">
            {magicLinkStatus.status === 'expired' ? 'Invitation Expired' : 
             magicLinkStatus.status === 'used' ? 'Invitation Already Used' : 
             'Invalid Invitation'}
          </h2>
          <p className="text-sm text-cream/70 mb-6">
            {magicLinkStatus.error || 'This invitation link is no longer valid.'}
          </p>
          
          <div className="space-y-3">
            <Link
              href="/documents"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-cream/20 text-cream/80 hover:bg-cream/10 transition-colors"
            >
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        
        <h2 className="text-2xl font-serif text-cream mb-2">Access Granted!</h2>
        <p className="text-sm text-cream/70 mb-6">
          You now have access to this document. Redirecting you now...
        </p>
        
        <div className="w-full bg-cream/10 rounded-full h-2 overflow-hidden">
          <div className="bg-gold h-full animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}

