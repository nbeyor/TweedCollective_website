'use client'

import React from 'react'
import { Mail, MapPin, ChevronRight } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-helix-cyan/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mono-label mb-4 block">// Contact</span>
            <h1 className="text-cream mb-6">Get in Touch</h1>
            <p className="body-large text-stone mb-8">
              Ready to accelerate your health-tech company's growth? We'd love to hear about your challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <span className="mono-label mb-4 block">// Reach Out</span>
                  <h2 className="text-cream mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-violet/10 rounded-lg flex items-center justify-center border border-violet/30">
                        <Mail className="w-6 h-6 text-violet" />
                      </div>
                      <div>
                        <p className="font-medium text-cream mb-1">Email</p>
                        <a 
                          href="mailto:hello@tweedcollective.ai" 
                          className="text-violet hover:text-violet-light text-lg font-medium transition-colors"
                        >
                          hello@tweedcollective.ai
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-helix-cyan/10 rounded-lg flex items-center justify-center border border-helix-cyan/30">
                        <MapPin className="w-6 h-6 text-helix-cyan" />
                      </div>
                      <div>
                        <p className="font-medium text-cream mb-1">Location</p>
                        <p className="text-stone text-lg">
                          Los Angeles, California
                        </p>
                        <p className="text-zinc text-sm">
                          In the heart of the growing health-tech ecosystem
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-graphite p-6 rounded-lg border border-slate">
                  <h3 className="text-cream mb-4">Why Los Angeles?</h3>
                  <p className="text-sm text-stone mb-4">
                    LA is rapidly becoming a hub for health-tech innovation, with world-class research institutions, 
                    a growing biotech corridor, and access to both Silicon Valley and San Diego's life sciences expertise.
                  </p>
                  <p className="text-sm text-stone">
                    Our location gives us unique access to talent, capital, and partnerships that drive successful health-tech scaling.
                  </p>
                </div>
              </div>

              {/* LA Tech Ecosystem Image Placeholder */}
              <div className="relative">
                <div className="bg-gradient-to-br from-violet/10 to-helix-cyan/10 rounded-2xl p-8 h-96 flex items-center justify-center border border-slate">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-violet/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet/30">
                      <MapPin className="w-12 h-12 text-violet" />
                    </div>
                    <h3 className="text-xl font-semibold text-cream mb-2">Los Angeles Tech Ecosystem</h3>
                    <p className="text-stone text-sm">
                      Health-tech innovation hub with access to world-class talent and capital
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-violet relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet via-violet-light/20 to-violet" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-cream mb-6">
              Ready to Start the Conversation?
            </h2>
            <p className="body-large text-cream/80 mb-8 max-w-2xl mx-auto">
              Whether you're looking to scale operations, need strategic advisory, or want to explore new ventures, 
              we're here to help accelerate your health-tech journey.
            </p>
            <a 
              href="mailto:hello@tweedcollective.ai"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cream text-carbon rounded-xl font-medium hover:bg-cream/90 transition-colors group"
            >
              <Mail className="w-4 h-4" />
              <span>Send us an email</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
