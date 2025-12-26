'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import TweedLogo from './ui/tweed-logo'
import { ChevronRight } from 'lucide-react'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Operators', href: '/operators' },
  { name: 'Projects', href: '/projects' },
  { name: 'Documents', href: '/documents' },
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

  // Don't show CTA button on contact page
  const showCTA = pathname !== '/contact'

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-cream/98 backdrop-blur-md shadow-[0_1px_0_rgba(139,159,126,0.15)] py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group">
            <div className="flex items-center gap-3">
              <TweedLogo 
                animated={true} 
                size={36} 
                className="mr-3"
                withText={false}
              />
              <span className={`font-sans font-semibold text-lg tracking-tight transition-colors ${
                pathname?.startsWith('/documents') 
                  ? 'text-cream' 
                  : 'text-charcoal'
              }`}>
                Tweed Collective
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Pill Container */}
          <div 
            className={`hidden lg:flex items-center px-2 py-1.5 rounded-full transition-all duration-500 ${
              isScrolled 
                ? 'bg-purple-900/80 border border-purple-800/50 backdrop-blur-sm' 
                : 'bg-purple-900/60 backdrop-blur-sm border border-purple-700/40'
            }`}
          >
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${
                    isActive
                      ? 'text-cream bg-purple-700/50'
                      : 'text-cream/80 hover:text-cream hover:bg-purple-800/40'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* CTA Button & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {showCTA && (
              <Link 
                href="/contact" 
                className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'bg-sage text-cream hover:bg-sage/90 shadow-sm hover:shadow-md'
                    : 'bg-cream text-charcoal hover:bg-cream/90 shadow-lg'
                }`}
              >
                <span>Book a Call</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-charcoal hover:bg-stone/50'
                    : 'text-cream hover:bg-cream/20'
                }`}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'bg-purple-600 text-cream hover:bg-purple-700 shadow-sm'
                    : 'bg-purple-600 text-cream hover:bg-purple-700 shadow-md'
                }`}>
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              isScrolled 
                ? 'bg-stone/50 hover:bg-stone' 
                : 'bg-cream/10 hover:bg-cream/20'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 transform transition-all duration-300 ${
                  isScrolled ? 'bg-charcoal' : 'bg-cream'
                } ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}
              />
              <span
                className={`absolute h-0.5 w-5 transform transition-all duration-300 ${
                  isScrolled ? 'bg-charcoal' : 'bg-cream'
                } ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
              />
              <span
                className={`absolute h-0.5 w-5 transform transition-all duration-300 ${
                  isScrolled ? 'bg-charcoal' : 'bg-cream'
                } ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}
              />
            </div>
          </button>
        </nav>

        {/* Mobile Navigation - Slide Down Panel */}
        <div
          className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${
            isMenuOpen ? 'max-h-[32rem] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 px-2 bg-cream/98 backdrop-blur-md rounded-2xl border border-stone/30 shadow-lg">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-sage/10 text-sage'
                      : 'text-charcoal/80 hover:bg-stone/50 hover:text-charcoal'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-colors ${
                    pathname === item.href ? 'text-sage' : 'text-charcoal/30'
                  }`} />
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-stone/30 px-2 space-y-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-3 px-6 rounded-xl text-base font-medium transition-colors text-charcoal hover:bg-stone/50">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-3 px-6 rounded-xl text-base font-medium transition-colors bg-purple-600 text-cream hover:bg-purple-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center py-3">
                  <UserButton />
                </div>
              </SignedIn>
              {showCTA && (
                <Link 
                  href="/contact" 
                  className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-sage text-cream rounded-xl font-medium hover:bg-sage/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Book a Call</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
