'use client'

import React from 'react'
import Link from 'next/link'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Logo animated={false} size="sm" />
              <span className="text-xl font-medium">Tweed Collective</span>
            </Link>
            <p className="text-stone/80 max-w-xs">
              Fusing seasoned operators with AI-powered execution to catalyze the next wave of data-driven health-tech leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-stone/80 hover:text-sage transition-colors">About</Link></li>
              <li><Link href="/services" className="text-stone/80 hover:text-sage transition-colors">Services</Link></li>
              <li><Link href="/team" className="text-stone/80 hover:text-sage transition-colors">Team</Link></li>
              <li><Link href="/projects" className="text-stone/80 hover:text-sage transition-colors">Case Studies</Link></li>
              <li><Link href="/tools" className="text-stone/80 hover:text-sage transition-colors">Tools</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hello@tweedcollective.com" 
                  className="text-stone/80 hover:text-sage transition-colors"
                >
                  hello@tweedcollective.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="text-stone/80 hover:text-sage transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/tweedcollective" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone/80 hover:text-sage transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-medium mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-stone/80 hover:text-sage transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-stone/80 hover:text-sage transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone/10">
          <p className="text-stone/60 text-sm">
            © {new Date().getFullYear()} Tweed Collective. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 