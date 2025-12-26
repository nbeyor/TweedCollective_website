import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Tweed Collective - Scale Health-Tech Revenue with Fractional Operators & AI-Powered Playbooks',
  description: 'Health-tech companies accelerate revenue with our fractional operators and AI-powered execution frameworks',
  keywords: 'health-tech, fractional operators, revenue acceleration, biotech consulting, startup scaling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" 
            rel="stylesheet" 
          />
        </head>
        <body className="antialiased">
          <div className="min-h-screen flex flex-col bg-cream">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
