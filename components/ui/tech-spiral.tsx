'use client'

import React from 'react'

interface TechSpiralProps {
  className?: string
}

export default function TechSpiral({ className = '' }: TechSpiralProps) {
  return (
    <div className={`absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-20 pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 400 800"
        className="h-full w-full animate-helix-rotate"
        style={{ animationDuration: '40s' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#4A5D4C" />
            <stop offset="100%" stopColor="#A89685" />
          </linearGradient>
          <radialGradient id="spiralGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Single spiral path - tech aesthetic with nodes */}
        <path
          d="M 200,0 
             Q 250,50 200,100
             Q 150,150 200,200
             Q 250,250 200,300
             Q 150,350 200,400
             Q 250,450 200,500
             Q 150,550 200,600
             Q 250,650 200,700
             Q 150,750 200,800
             Q 250,850 200,900
             Q 150,950 200,1000
             Q 250,1050 200,1100
             Q 150,1150 200,1200
             Q 250,1250 200,1300
             Q 150,1350 200,1400
             Q 250,1450 200,1500
             Q 150,1550 200,1600"
          fill="none"
          stroke="url(#spiralGradient)"
          strokeWidth="2.5"
          opacity="0.7"
        />

        {/* Tech nodes along the spiral - representing data points */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18) * (Math.PI / 180)
          const radius = 50 + (i * 8)
          const x = 200 + Math.cos(angle) * radius
          const y = i * 80 + Math.sin(angle) * 20
          
          return (
            <g key={`node-${i}`}>
              {/* Outer glow */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="url(#spiralGlow)"
                opacity="0.4"
              />
              {/* Main node */}
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={i % 3 === 0 ? "#D4AF37" : "#4A5D4C"}
                opacity="0.8"
              />
              {/* Inner highlight */}
              <circle
                cx={x}
                cy={y}
                r="1.5"
                fill="#C4A772"
                opacity="0.9"
              />
            </g>
          )
        })}

        {/* Connection lines between nodes - network aesthetic */}
        {[...Array(19)].map((_, i) => {
          const angle1 = (i * 18) * (Math.PI / 180)
          const angle2 = ((i + 1) * 18) * (Math.PI / 180)
          const radius1 = 50 + (i * 8)
          const radius2 = 50 + ((i + 1) * 8)
          const x1 = 200 + Math.cos(angle1) * radius1
          const y1 = i * 80 + Math.sin(angle1) * 20
          const x2 = 200 + Math.cos(angle2) * radius2
          const y2 = (i + 1) * 80 + Math.sin(angle2) * 20
          
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 4 === 0 ? "#8B5CF6" : "#4A5D4C"}
              strokeWidth="1"
              opacity="0.3"
            />
          )
        })}

        {/* Subtle grid overlay for tech aesthetic */}
        <defs>
          <pattern id="techGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="400" height="1600" fill="url(#techGrid)" opacity="0.2" />
      </svg>
    </div>
  )
}





