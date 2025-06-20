'use client'

import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function Logo({ className = '', size = 'md', animated = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Tweed Weave Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage/20 to-terra/20 rounded-lg overflow-hidden">
        {/* Horizontal Weave Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-sage animate-data-pulse-h1"></div>
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-terra animate-data-pulse-h2 animation-delay-1000"></div>
          <div className="absolute top-2/3 left-0 w-full h-0.5 bg-coral animate-data-pulse-h3 animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ochre animate-data-pulse-h4 animation-delay-3000"></div>
        </div>
        
        {/* Vertical Weave Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-sage animate-data-pulse-v1"></div>
          <div className="absolute top-0 left-1/3 w-0.5 h-full bg-terra animate-data-pulse-v2 animation-delay-1000"></div>
          <div className="absolute top-0 left-2/3 w-0.5 h-full bg-coral animate-data-pulse-v3 animation-delay-2000"></div>
          <div className="absolute top-0 right-0 w-0.5 h-full bg-ochre animate-data-pulse-v4 animation-delay-3000"></div>
        </div>
      </div>

      {/* Logo Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`font-display font-semibold text-charcoal ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
            TWEED
          </div>
          <div className={`font-mono font-medium text-sage ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'}`}>
            COLLECTIVE
          </div>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      {animated && (
        <div className="absolute inset-0 rounded-lg animate-subtle-glow pointer-events-none"></div>
      )}
    </div>
  )
} 