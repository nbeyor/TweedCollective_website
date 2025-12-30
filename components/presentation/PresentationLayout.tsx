'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Menu, X, Maximize2, Minimize2 } from 'lucide-react'

export interface Slide {
  id: string
  title: string
  content: React.ReactNode
  notes?: string
}

interface PresentationLayoutProps {
  title: string
  subtitle?: string
  slides: Slide[]
  logo?: React.ReactNode
}

export default function PresentationLayout({
  title,
  subtitle,
  slides,
  logo
}: PresentationLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const totalSlides = slides.length
  const slide = slides[currentSlide]

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50

  // Update progress
  useEffect(() => {
    setProgress(((currentSlide + 1) / totalSlides) * 100)
  }, [currentSlide, totalSlides])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setCurrentSlide(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Escape') {
      setIsMenuOpen(false)
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    } else if (e.key === 'f') {
      toggleFullscreen()
    }
  }, [totalSlides])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Touch/swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      nextSlide()
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide()
    }
  }

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsMenuOpen(false)
  }

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0))

  return (
    <div
      className="min-h-screen bg-void text-cream flex flex-col relative overflow-hidden"
      style={{ paddingTop: '80px' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, #8B5CF6 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, #22D3EE 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 80px 80px'
        }} />
      </div>
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate/30 z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-violet to-helix-cyan transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Home button removed - Tweed Collective logo in header serves this purpose */}
        </div>
        
        {/* Navigation Controls - Responsive */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center max-w-2xl mx-auto">
          {/* Previous Button - Icon only on mobile, text on desktop */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 p-2 md:px-3 md:py-2 rounded-xl text-cream/70 hover:text-cream hover:bg-violet/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm hidden md:inline">Previous</span>
          </button>

          {/* Slide Counter - Simplified on mobile, dots on desktop */}
          <div className="flex items-center gap-2.5 px-2 md:px-4">
            {/* Mobile: Just show "3 / 10" */}
            <div className="flex md:hidden items-center gap-1.5">
              <span className="text-sm text-cream/70 font-mono">{currentSlide + 1}</span>
              <span className="text-xs text-cream/40">/</span>
              <span className="text-sm text-cream/70 font-mono">{totalSlides}</span>
            </div>

            {/* Desktop: Show slide dots */}
            <div className="hidden md:flex items-center gap-2.5">
              <span className="text-sm text-cream/70 font-mono min-w-[1.5rem] text-right">{currentSlide + 1}</span>
              <div className="flex items-center gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-6 h-2 bg-violet'
                        : 'w-2 h-2 bg-cream/30 hover:bg-cream/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <span className="text-sm text-cream/70 font-mono min-w-[1.5rem] text-left">{totalSlides}</span>
            </div>
          </div>

          {/* Next Button - Icon only on mobile, text on desktop */}
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-1.5 p-2 md:px-3 md:py-2 rounded-xl text-cream/70 hover:text-cream hover:bg-violet/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next slide"
          >
            <span className="text-sm hidden md:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-cream/60 hover:text-cream hover:bg-violet/10 transition-all"
            title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="icon-md" /> : <Maximize2 className="icon-md" />}
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-cream/60 hover:text-cream hover:bg-violet/10 transition-all"
          >
            {isMenuOpen ? <X className="icon-md" /> : <Menu className="icon-md" />}
          </button>
        </div>
      </nav>

      {/* Slide Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-5xl mx-auto">
          {slide.content}
        </div>
      </main>

      {/* Slide Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-void/95 backdrop-blur-md z-50 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="h-full overflow-auto py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-sans text-cream">{title}</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg text-cream/60 hover:text-cream hover:bg-violet/10 transition-all"
              >
                <X className="icon-lg" />
              </button>
            </div>
            
            <div className="grid gap-3">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    index === currentSlide
                      ? 'bg-violet/20 border-violet/50 text-cream'
                      : 'bg-cream/5 border-slate text-cream/70 hover:bg-violet/10 hover:border-violet/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-cream/40 w-8">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium">{s.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 left-4 text-xs text-zinc hidden lg:block font-mono">
        ← → to navigate • F for fullscreen • ESC to close
      </div>
    </div>
  )
}
