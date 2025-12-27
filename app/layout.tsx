import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Tweed Collective - Operators and Builders at the AI × Life Sciences Frontier',
  description: 'Advisory for investors, fractional leadership with equity alignment, and venture building at the convergence of biotechnology and artificial intelligence.',
  keywords: 'AI life sciences, biotech consulting, fractional operators, venture building, due diligence, computational biology',
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
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" 
            rel="stylesheet" 
          />
        </head>
        <body className="antialiased">
          <div className="min-h-screen flex flex-col bg-void">
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
