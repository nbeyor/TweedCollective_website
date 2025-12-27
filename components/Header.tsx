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
          ? 'bg-carbon/95 backdrop-blur-md border-b border-slate/50 py-3' 
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
                className="mr-2"
              />
              <span className="font-sans font-semibold text-lg tracking-tight text-cream transition-colors group-hover:text-sage-light">
                Tweed Collective
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Dark Pill Container */}
          <div 
            className={`hidden lg:flex items-center px-2 py-1.5 rounded-full transition-all duration-500 ${
              isScrolled 
                ? 'bg-graphite/80 border border-slate/50 backdrop-blur-sm' 
                : 'bg-graphite/60 backdrop-blur-sm border border-slate/40'
            }`}
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${
                    isActive
                      ? 'text-cream bg-sage/20'
                      : 'text-stone hover:text-cream hover:bg-slate/50'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sage" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA Button & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {showCTA && (
              <a 
                href="mailto:hello@tweedcollective.ai" 
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-sage text-cream hover:bg-sage-light hover:shadow-glow-sage"
              >
                <span>Reach Out</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 text-stone hover:text-cream hover:bg-slate/50">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-sage text-sage-light hover:bg-sage/10">
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
                ? 'bg-slate/50 hover:bg-slate' 
                : 'bg-graphite/50 hover:bg-graphite'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 bg-cream transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-cream transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-cream transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
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
          <div className="py-4 px-2 bg-carbon/98 backdrop-blur-md rounded-2xl border border-slate/50 shadow-lg">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-violet/10 text-violet'
                      : 'text-stone hover:bg-slate/50 hover:text-cream'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-colors ${
                    pathname === item.href ? 'text-violet' : 'text-zinc'
                  }`} />
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate/30 px-2 space-y-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-3 px-6 rounded-xl text-base font-medium transition-colors text-stone hover:bg-slate/50 hover:text-cream">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-3 px-6 rounded-xl text-base font-medium transition-colors border border-sage text-sage-light hover:bg-sage/10">
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
                <a 
                  href="mailto:hello@tweedcollective.ai" 
                  className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-sage text-cream rounded-xl font-medium hover:bg-sage-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Reach Out</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
