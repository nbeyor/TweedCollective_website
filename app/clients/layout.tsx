import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import TweedLogo from '@/components/ui/tweed-logo'

export const metadata: Metadata = {
  title: 'Client Workspace',
  description: 'Tweed Collective client workspace.',
  robots: { index: false, follow: false },
}

export default async function ClientsLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in?redirect_url=%2Fclients')
  }

  return (
    <div className="min-h-screen bg-void">
      {/* Minimal chrome: wordmark and account button only */}
      <div className="border-b border-slate/30 bg-carbon">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <TweedLogo animated={false} size={28} />
            <span className="font-sans font-semibold tracking-tight text-cream group-hover:text-sage-light transition-colors">
              Tweed Collective
            </span>
          </Link>
          <UserButton />
        </div>
      </div>
      {children}
    </div>
  )
}
