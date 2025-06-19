'use client'

import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 bg-neutral-cream/80 backdrop-blur-md border-b border-primary-sage/10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 border-2 border-primary-sage rounded-lg overflow-hidden">
                <div className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary-coral to-transparent" />
                <div className="absolute h-full w-[2px] left-1/2 -translate-x-1/2 bg-gradient-to-b from-transparent via-primary-sage to-transparent" />
              </div>
            </div>
            <span className="text-xl font-medium">Tweed Collective</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/partners" className="nav-link">Partners</Link>
            <Link href="/projects" className="nav-link">Projects</Link>
            <Link href="/tools" className="nav-link">Tools</Link>
            <Link href="/insights" className="nav-link">Insights</Link>
            <Link href="/book-call" className="btn-primary">Book a Call</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header 