'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * Wraps pages in the marketing header and footer, except in the client
 * workspace (/clients), which renders its own minimal chrome.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isClientWorkspace = pathname === '/clients' || pathname.startsWith('/clients/')

  if (isClientWorkspace) {
    return <main className="flex-grow">{children}</main>
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
