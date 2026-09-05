import React from 'react'
import type { Metadata } from 'next'
import EmailCTA from '@/components/EmailCTA'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Tweed Collective.',
}

export default function ContactPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Contact</span>
            <h1 className="text-cream mb-6">Get in touch</h1>
            <p className="body-large text-stone mb-8">
              Tell us what you're working on. We read everything and reply to most.
            </p>
            <EmailCTA />
          </div>
        </div>
      </section>
    </div>
  )
}
