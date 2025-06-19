'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  const navigation = {
    services: [
      { name: 'Operations', href: '/services#operations' },
      { name: 'Advisory', href: '/services#advisory' },
      { name: 'Incubation', href: '/services#incubation' },
    ],
    company: [
      { name: 'About', href: '/team' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Approach', href: '/approach' },
      { name: 'Insights', href: '/insights' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-custom">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TC</span>
                </div>
                <span className="text-xl font-bold">Tweed Collective</span>
              </div>
              <p className="text-navy-200 mb-6 max-w-md">
                A fractional-operator platform that helps growth-stage health-tech companies and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-navy-200">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:hello@tweedcollective.com" className="hover:text-white transition-colors">
                    hello@tweedcollective.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-navy-200">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-navy-200">
                  <MapPin className="w-5 h-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-navy-200 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-navy-200 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-navy-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-navy-300 text-sm mb-4 md:mb-0">
                © 2024 Tweed Collective. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4">
                  <a
                    href="https://linkedin.com/company/tweed-collective"
                    className="text-navy-300 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/tweedcollective"
                    className="text-navy-300 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
                
                <div className="flex space-x-4 text-sm">
                  {navigation.legal.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-navy-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 