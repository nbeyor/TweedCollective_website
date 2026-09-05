import React from 'react'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'
import { starts } from '@/data/marketing'
import { CONTACT_EMAIL, contactMailto } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start with a live deal walk, a portfolio initiative review, or a one-company operating program.',
}

export default function ContactPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// Contact</span>
            <h1 className="text-cream mb-6">How do you want to start?</h1>
            <p className="body-large text-stone max-w-2xl">
              Three conversations. Same spine. Write {CONTACT_EMAIL} and name the one that fits.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            {starts.map((start) => (
              <div key={start.id} id={start.id} className="card p-8 flex flex-col scroll-mt-32">
                <h2 className="text-cream text-2xl mb-3">{start.title}</h2>
                <p className="text-stone text-sm leading-relaxed mb-6">{start.summary}</p>
                <p className="text-xs font-mono uppercase tracking-wider text-zinc mb-2">
                  What you get
                </p>
                <p className="text-cream text-sm leading-relaxed flex-grow mb-8">{start.youGet}</p>
                <a
                  href={contactMailto(start.subject)}
                  className="btn-primary self-start group"
                >
                  <span>Write us</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>

          <div className="max-w-xl">
            <p className="mono-label mb-3">Direct</p>
            <a
              href={contactMailto()}
              className="font-mono text-lg text-cream hover:text-sage-light transition-colors select-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
