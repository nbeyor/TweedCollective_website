'use client'

import React from 'react'
import { Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Get in Touch</h1>
            <p className="body-large mb-8">
              Ready to accelerate your health-tech company's growth? We'd love to hear about your challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-sage/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-sage" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal mb-1">Email</p>
                        <a 
                          href="mailto:hello@tweedcollective.ai" 
                          className="text-sage hover:text-sage/80 text-lg font-medium"
                        >
                          hello@tweedcollective.ai
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-terra/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-terra" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal mb-1">Location</p>
                        <p className="text-warm-gray text-lg">
                          Los Angeles, California
                        </p>
                        <p className="text-warm-gray text-sm">
                          In the heart of the growing health-tech ecosystem
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-stone/30 p-6 rounded-lg">
                  <h3 className="mb-4">Why Los Angeles?</h3>
                  <p className="text-sm text-warm-gray mb-4">
                    LA is rapidly becoming a hub for health-tech innovation, with world-class research institutions, 
                    a growing biotech corridor, and access to both Silicon Valley and San Diego's life sciences expertise.
                  </p>
                  <p className="text-sm text-warm-gray">
                    Our location gives us unique access to talent, capital, and partnerships that drive successful health-tech scaling.
                  </p>
                </div>
              </div>

              {/* LA Tech Ecosystem Image Placeholder */}
              <div className="relative">
                <div className="bg-gradient-to-br from-sage/20 to-terra/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-12 h-12 text-sage" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Los Angeles Tech Ecosystem</h3>
                    <p className="text-warm-gray text-sm">
                      Health-tech innovation hub with access to world-class talent and capital
                    </p>
                    <p className="text-xs text-warm-gray mt-2">
                      [Image placeholder - LA skyline with health-tech overlay]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-sage">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-cream mb-6">
              Ready to Start the Conversation?
            </h2>
            <p className="body-large text-cream/90 mb-8 max-w-2xl mx-auto">
              Whether you're looking to scale operations, need strategic advisory, or want to explore new ventures, 
              we're here to help accelerate your health-tech journey.
            </p>
            <a 
              href="mailto:hello@tweedcollective.ai"
              className="btn-primary bg-cream text-charcoal hover:bg-cream/90 inline-flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send us an email</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 