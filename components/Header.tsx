'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Team', href: '/team' },
  { name: 'Case Studies', href: '/projects' },
  { name: 'Tools', href: '/tools' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sophisticated py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative">
            <div className="flex items-center">
              <Logo 
                animated={true} 
                size="sm" 
                className="mr-3"
              />
              <span className={`font-display text-lg font-semibold transition-colors duration-300 ${
                isScrolled ? 'text-charcoal' : 'text-cream'
              }`}>
                Tweed Collective
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  pathname === item.href
                    ? isScrolled
                      ? 'text-sage'
                      : 'text-coral'
                    : isScrolled
                    ? 'text-charcoal hover:text-sage'
                    : 'text-cream hover:text-coral'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/contact" className="btn-primary text-sm">
              Book a Call
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${
                isScrolled ? 'text-charcoal' : 'text-cream'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <div className="py-2 space-y-1 bg-cream/95 backdrop-blur-sm rounded-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-sage/10 text-sage'
                    : 'text-charcoal hover:bg-sage/5 hover:text-sage'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Link 
                href="/contact" 
                className="btn-primary w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 