'use client'

import React from 'react'
import Link from 'next/link'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-neutral-charcoal text-neutral-cream py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Logo animated={false} size="sm" />
              <span className="text-xl font-medium">Tweed Collective</span>
            </Link>
            <p className="text-neutral-stone/80 max-w-xs">
              Fusing seasoned operators with AI-powered execution to catalyze the next wave of data-driven health-tech leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Services</Link></li>
              <li><Link href="/partners" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Partners</Link></li>
              <li><Link href="/projects" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Projects</Link></li>
              <li><Link href="/tools" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Tools</Link></li>
              <li><Link href="/insights" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Insights</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hello@tweedcollective.ai" 
                  className="text-neutral-stone/80 hover:text-primary-sage transition-colors"
                >
                  hello@tweedcollective.ai
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/tweedcollective" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-stone/80 hover:text-primary-sage transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/tweedcollective" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-stone/80 hover:text-primary-sage transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-medium mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-stone/80 hover:text-primary-sage transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-stone/10">
          <p className="text-neutral-stone/60 text-sm">
            © {new Date().getFullYear()} Tweed Collective. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 