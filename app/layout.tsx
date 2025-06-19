import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tweed Collective - Operations · Advisory · Incubation',
  description: 'A fractional-operator platform that helps growth-stage health-tech companies and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.',
  keywords: 'health-tech, operations, advisory, incubation, fractional executives, AI strategy, digital health',
  authors: [{ name: 'Nate Beyor, PhD' }],
  openGraph: {
    title: 'Tweed Collective - Operations · Advisory · Incubation',
    description: 'A fractional-operator platform that helps growth-stage health-tech companies and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tweed Collective - Operations · Advisory · Incubation',
    description: 'A fractional-operator platform that helps growth-stage health-tech companies and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 