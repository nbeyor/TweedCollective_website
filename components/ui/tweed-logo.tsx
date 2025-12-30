'use client'

import React from 'react'

interface TweedLogoProps {
  animated?: boolean
  size?: number
  className?: string
}

export default function TweedLogo({ animated = true, size = 48, className = '' }: TweedLogoProps) {
  const logoClass = animated ? 'tweed-logo-animated' : 'tweed-logo-static'
  
  return (
    <div 
      className={`${logoClass} ${className}`}
      style={{ width: size, height: size }}
      aria-label="Tweed Collective Logo"
    >
      {animated ? (
        // Animated data streams flowing through
        <>
          <div className="data-stream-h"></div>
          <div className="data-stream-h"></div>
          <div className="data-stream-h"></div>
          <div className="data-stream-h"></div>
          <div className="data-stream-v"></div>
          <div className="data-stream-v"></div>
          <div className="data-stream-v"></div>
          <div className="data-stream-v"></div>
        </>
      ) : (
        // Static lines only
        <>
          <div className="static-line-h"></div>
          <div className="static-line-h"></div>
          <div className="static-line-h"></div>
          <div className="static-line-h"></div>
          <div className="static-line-v"></div>
          <div className="static-line-v"></div>
          <div className="static-line-v"></div>
          <div className="static-line-v"></div>
        </>
      )}
    </div>
  )
}

// Simple static SVG version for small sizes or when animation is not desired
export function TweedLogoSimple({ size = 24, className = '' }: Omit<TweedLogoProps, 'animated'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-label="Tweed Collective Logo"
    >
      <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="#3A3A45" strokeWidth="1" />
      <line x1="4" y1="7" x2="20" y2="7" stroke="#4A5D4C" strokeWidth="1.5" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="#8C7B6B" strokeWidth="1.5" />
      <line x1="4" y1="17" x2="20" y2="17" stroke="#4A5D4C" strokeWidth="1.5" />
      <line x1="7" y1="4" x2="7" y2="20" stroke="#C4A772" strokeWidth="1.5" />
      <line x1="12" y1="4" x2="12" y2="20" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="17" y1="4" x2="17" y2="20" stroke="#C4A772" strokeWidth="1.5" />
    </svg>
  )
}
