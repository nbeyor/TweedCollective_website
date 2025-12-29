'use client'

import React, { useEffect, useState } from 'react'
import { useAuth, SignUpButton, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'

interface MagicLinkStatus {
  status: 'loading' | 'valid' | 'invalid' | 'used' | 'expired' | 'needs-auth'
  documentId?: string
  error?: string
}

export default function MagicLinkPage({ params }: { params: { token: string } }) {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()
  const [magicLinkStatus, setMagicLinkStatus] = useState<MagicLinkStatus>({ status: 'loading' })
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    async function checkMagicLink() {
      try {
        const response = await fetch(`/api/magic-link/${params.token}`)
        const data = await response.json()

        if (response.status === 404 || response.status === 410) {
          setMagicLinkStatus({
            status: response.status === 410 ? (data.error?.includes('expired') ? 'expired' : 'used') : 'invalid',
            error: data.error
          })
          return
        }

        if (data.needsAuth) {
          setMagicLinkStatus({
            status: 'needs-auth',
            documentId: data.documentId
          })
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
        console.error('Error checking magic link:', error)
        setMagicLinkStatus({ status: 'invalid', error: 'Failed to validate magic link' })
      }
    }

    if (isLoaded && token) {
      checkMagicLink()
    }
  }, [token, isLoaded, userId, router])

  useEffect(() => {
    // If user just signed in and we're waiting for auth, check again
    if (isLoaded && userId && magicLinkStatus.status === 'needs-auth' && token) {
      redeemMagicLink()
    }
  }, [isLoaded, userId, magicLinkStatus.status, token])

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
      } else {
        setMagicLinkStatus({
          status: response.status === 410 ? (data.error?.includes('expired') ? 'expired' : 'used') : 'invalid',
          error: data.error || 'Failed to redeem magic link'
        })
      }
    } catch (error) {
      console.error('Error redeeming magic link:', error)
      setMagicLinkStatus({ status: 'invalid', error: 'Failed to redeem magic link' })
    } finally {
      setRedeeming(false)
    }
  }

  if (magicLinkStatus.status === 'loading' || redeeming) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold mx-auto mb-4 animate-spin" />
          <p className="text-cream/70">Validating magic link...</p>
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
            {magicLinkStatus.status === 'expired' ? 'Link Expired' : 
             magicLinkStatus.status === 'used' ? 'Link Already Used' : 
             'Invalid Link'}
          </h2>
          <p className="text-sm text-cream/70 mb-6">
            {magicLinkStatus.error || 'This magic link is no longer valid.'}
          </p>
          
          <div className="space-y-3">
            <Link
              href="/documents"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage-light transition-colors"
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

  if (magicLinkStatus.status === 'needs-auth') {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          
          <h2 className="text-2xl font-serif text-cream mb-2">Sign In Required</h2>
          <p className="text-sm text-cream/70 mb-6">
            Please sign in or create an account to access this document. Your access will be granted automatically after you sign in.
          </p>
          
          <div className="space-y-3">
            <SignUpButton mode="modal">
              <button className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-gold text-void font-semibold hover:bg-gold-light transition-colors">
                <span>Sign Up</span>
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage-light transition-colors">
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
