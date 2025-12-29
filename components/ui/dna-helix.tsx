'use client'

import React from 'react'

interface DNAHelixProps {
  className?: string
}

export default function DNAHelix({ className = '' }: DNAHelixProps) {
  return (
    <div className={`absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-15 pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 200 800"
        className="h-full w-full animate-helix-rotate"
        style={{ animationDuration: '30s' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="helixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="helixGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* First strand */}
        <path
          d="M100,0 
             Q150,50 100,100 
             Q50,150 100,200 
             Q150,250 100,300 
             Q50,350 100,400 
             Q150,450 100,500 
             Q50,550 100,600 
             Q150,650 100,700 
             Q50,750 100,800
             Q150,850 100,900
             Q50,950 100,1000
             Q150,1050 100,1100
             Q50,1150 100,1200
             Q150,1250 100,1300
             Q50,1350 100,1400
             Q150,1450 100,1500
             Q50,1550 100,1600"
          fill="none"
          stroke="url(#helixGradient)"
          strokeWidth="3"
          opacity="0.6"
        />

        {/* Second strand (offset) */}
        <path
          d="M100,0 
             Q50,50 100,100 
             Q150,150 100,200 
             Q50,250 100,300 
             Q150,350 100,400 
             Q50,450 100,500 
             Q150,550 100,600 
             Q50,650 100,700 
             Q150,750 100,800
             Q50,850 100,900
             Q150,950 100,1000
             Q50,1050 100,1100
             Q150,1150 100,1200
             Q50,1250 100,1300
             Q150,1350 100,1400
             Q50,1450 100,1500
             Q150,1550 100,1600"
          fill="none"
          stroke="url(#helixGradient2)"
          strokeWidth="3"
          opacity="0.6"
        />

        {/* Base pairs - horizontal connections */}
        {[...Array(32)].map((_, i) => (
          <line
            key={i}
            x1={i % 2 === 0 ? 60 : 140}
            y1={i * 50 + 25}
            x2={i % 2 === 0 ? 140 : 60}
            y2={i * 50 + 25}
            stroke={i % 3 === 0 ? '#8B5CF6' : '#22D3EE'}
            strokeWidth="1.5"
            opacity="0.4"
          />
        ))}

        {/* Phosphate nodes */}
        {[...Array(16)].map((_, i) => (
          <React.Fragment key={`nodes-${i}`}>
            <circle
              cx={i % 2 === 0 ? 150 : 50}
              cy={i * 100}
              r="4"
              fill="#8B5CF6"
              opacity="0.5"
            />
            <circle
              cx={i % 2 === 0 ? 50 : 150}
              cy={i * 100}
              r="4"
              fill="#22D3EE"
              opacity="0.5"
            />
          </React.Fragment>
        ))}
      </svg>
    </div>
  )
}

