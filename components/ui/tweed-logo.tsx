'use client'

import React from 'react'

interface TweedLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export default function TweedLogo({ size = 36, className = '', animated = true }: TweedLogoProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={className}
      aria-label="Tweed Collective Logo"
    >
      {/* Outer container */}
      <rect
        x="2"
        y="2"
        width="32"
        height="32"
        rx="4"
        fill="none"
        stroke="#3A3A45"
        strokeWidth="1"
      />

      {/* Horizontal threads (sage/taupe) */}
      <line x1="6" y1="10" x2="30" y2="10" stroke="#4A5D4C" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="18" x2="30" y2="18" stroke="#8C7B6B" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="26" x2="30" y2="26" stroke="#4A5D4C" strokeWidth="2" strokeLinecap="round" />

      {/* Vertical threads (brown/gold) - offset to show weaving */}
      <line x1="10" y1="6" x2="10" y2="14" stroke="#A89685" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="22" x2="10" y2="30" stroke="#C4A772" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="6" x2="18" y2="22" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="14" x2="26" y2="30" stroke="#B5846F" strokeWidth="2" strokeLinecap="round" />

      {/* Node intersections (brown/gold circles) */}
      <circle cx="10" cy="10" r="2" fill="#C4A772">
        {animated && (
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="18" cy="18" r="2.5" fill="#D4AF37">
        {animated && (
          <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite" begin="0.5s" />
        )}
      </circle>
      <circle cx="26" cy="26" r="2" fill="#A89685">
        {animated && (
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" begin="1s" />
        )}
      </circle>

      {/* Additional intersection points */}
      <circle cx="18" cy="10" r="1.5" fill="#D4AF37" opacity="0.7">
        {animated && (
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4.2s" repeatCount="indefinite" begin="0.3s" />
        )}
      </circle>
      <circle cx="26" cy="18" r="1.5" fill="#C4A772" opacity="0.7">
        {animated && (
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.8s" repeatCount="indefinite" begin="0.8s" />
        )}
      </circle>
      <circle cx="10" cy="26" r="1.5" fill="#B5846F" opacity="0.7">
        {animated && (
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" begin="1.2s" />
        )}
      </circle>
    </svg>
  )
}

// Simple static version for small sizes
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
      <line x1="7" y1="4" x2="7" y2="20" stroke="#A89685" strokeWidth="1.5" />
      <line x1="12" y1="4" x2="12" y2="20" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="17" y1="4" x2="17" y2="20" stroke="#C4A772" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="1.5" fill="#C4A772" />
      <circle cx="12" cy="12" r="2" fill="#D4AF37" />
      <circle cx="17" cy="17" r="1.5" fill="#A89685" />
    </svg>
  )
}
