'use client'

import React from 'react'
import Link from 'next/link'
import TweedLogo from './ui/tweed-logo'
import { Mail, Phone, Linkedin, ArrowUpRight } from 'lucide-react'

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Operators', href: '/operators' },
  { name: 'Projects', href: '/projects' },
  { name: 'Documents', href: '/documents' },
]

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,159,126,0.08),transparent_50%)]" />
      
      <div className="container mx-auto py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <TweedLogo animated={false} size={40} />
              <span className="text-xl font-semibold tracking-tight group-hover:text-sage transition-colors">
                Tweed Collective
              </span>
            </Link>
            <p className="text-stone/70 text-sm leading-relaxed max-w-xs">
              Fusing seasoned operators with AI-powered execution to catalyze the next wave of data-driven health-tech leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/50 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-stone/80 hover:text-sage transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="icon-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/50 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hello@tweedcollective.com" 
                  className="text-stone/80 hover:text-sage transition-colors inline-flex items-center gap-3 group"
                >
                  <Mail className="icon-md text-sage/60 group-hover:text-sage transition-colors" />
                  <span>hello@tweedcollective.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="text-stone/80 hover:text-sage transition-colors inline-flex items-center gap-3 group"
                >
                  <Phone className="icon-md text-sage/60 group-hover:text-sage transition-colors" />
                  <span>+1 (234) 567-890</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/tweedcollective" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone/80 hover:text-sage transition-colors inline-flex items-center gap-3 group"
                >
                  <Linkedin className="icon-md text-sage/60 group-hover:text-sage transition-colors" />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/50 mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-stone/80 hover:text-sage transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone/80 hover:text-sage transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-stone/50 text-sm">
            © {new Date().getFullYear()} Tweed Collective. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-stone/50 text-sm">
            <span>Built with</span>
            <span className="text-coral">♥</span>
            <span>for health-tech innovators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
