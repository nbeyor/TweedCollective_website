'use client'

import React from 'react'

export default function TweedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Tweed Weave Pattern */}
          <pattern id="tweedWeave" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* Horizontal threads (sage) */}
            <line x1="0" y1="15" x2="60" y2="15" stroke="#4A5D4C" strokeWidth="1" opacity="0.4" />
            <line x1="0" y1="30" x2="60" y2="30" stroke="#C4A772" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="45" x2="60" y2="45" stroke="#4A5D4C" strokeWidth="1" opacity="0.4" />
            
            {/* Vertical threads (brown/gold) */}
            <line x1="15" y1="0" x2="15" y2="60" stroke="#A89685" strokeWidth="1" opacity="0.3" />
            <line x1="30" y1="0" x2="30" y2="60" stroke="#D4AF37" strokeWidth="1" opacity="0.25" />
            <line x1="45" y1="0" x2="45" y2="60" stroke="#C4A772" strokeWidth="1" opacity="0.3" />
            
            {/* Diagonal accents */}
            <line x1="0" y1="0" x2="60" y2="60" stroke="#D4AF37" strokeWidth="0.5" opacity="0.15" />
            <line x1="60" y1="0" x2="0" y2="60" stroke="#A89685" strokeWidth="0.5" opacity="0.1" />
          </pattern>

          {/* Radial gradient for vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#0A0A0C" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Base weave pattern */}
        <rect width="100%" height="100%" fill="url(#tweedWeave)" />
        
        {/* Vignette overlay */}
        <rect width="100%" height="100%" fill="url(#vignette)" />

        {/* Network nodes with pulse animation */}
        <g className="network-nodes">
          {/* Top left cluster */}
          <circle cx="15%" cy="20%" r="3" fill="#D4AF37" opacity="0.4">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;4;3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="18%" cy="25%" r="2" fill="#C4A772" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          
          {/* Top right cluster */}
          <circle cx="80%" cy="15%" r="2.5" fill="#A89685" opacity="0.35">
            <animate attributeName="opacity" values="0.25;0.7;0.25" dur="4.2s" repeatCount="indefinite" begin="1s" />
          </circle>
          <circle cx="85%" cy="22%" r="2" fill="#4A5D4C" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.8s" repeatCount="indefinite" begin="0.3s" />
          </circle>

          {/* Center area */}
          <circle cx="50%" cy="45%" r="4" fill="#D4AF37" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite" begin="2s" />
            <animate attributeName="r" values="4;5;4" dur="5s" repeatCount="indefinite" begin="2s" />
          </circle>

          {/* Bottom left */}
          <circle cx="25%" cy="75%" r="2.5" fill="#C4A772" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.5;0.15" dur="4.5s" repeatCount="indefinite" begin="1.5s" />
          </circle>
          
          {/* Bottom right */}
          <circle cx="75%" cy="80%" r="3" fill="#A89685" opacity="0.35">
            <animate attributeName="opacity" values="0.25;0.7;0.25" dur="3.7s" repeatCount="indefinite" begin="0.8s" />
          </circle>
          <circle cx="82%" cy="72%" r="2" fill="#4A5D4C" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="4.3s" repeatCount="indefinite" begin="2.2s" />
          </circle>

          {/* Connection lines between nodes */}
          <line x1="15%" y1="20%" x2="18%" y2="25%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.15" />
          <line x1="80%" y1="15%" x2="85%" y2="22%" stroke="#A89685" strokeWidth="0.5" opacity="0.15" />
          <line x1="50%" y1="45%" x2="75%" y2="80%" stroke="#C4A772" strokeWidth="0.5" opacity="0.1" />
          <line x1="25%" y1="75%" x2="50%" y2="45%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.1" />
        </g>
      </svg>
    </div>
  )
}






