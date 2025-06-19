'use client'

import React from 'react'

interface LogoProps {
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Logo: React.FC<LogoProps> = ({ animated = true, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  }

  if (animated) {
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        {/* Container */}
        <div className="absolute inset-0 border-2 border-primary-sage rounded-[20px] overflow-hidden">
          {/* Horizontal Streams */}
          <div className="absolute top-[15%] w-full h-[3px] bg-gradient-to-r from-transparent via-primary-coral to-transparent animate-data-pulse-h1" />
          <div className="absolute top-[35%] w-full h-[3px] bg-gradient-to-r from-transparent via-primary-coral to-transparent animate-data-pulse-h2" />
          <div className="absolute top-[55%] w-full h-[3px] bg-gradient-to-r from-transparent via-primary-coral to-transparent animate-data-pulse-h3" />
          <div className="absolute top-[75%] w-full h-[3px] bg-gradient-to-r from-transparent via-primary-coral to-transparent animate-data-pulse-h4" />
          
          {/* Vertical Streams */}
          <div className="absolute left-[20%] w-[3px] h-full bg-gradient-to-b from-transparent via-primary-sage to-transparent animate-data-pulse-v1" />
          <div className="absolute left-[40%] w-[3px] h-full bg-gradient-to-b from-transparent via-primary-sage to-transparent animate-data-pulse-v2" />
          <div className="absolute left-[60%] w-[3px] h-full bg-gradient-to-b from-transparent via-primary-sage to-transparent animate-data-pulse-v3" />
          <div className="absolute left-[80%] w-[3px] h-full bg-gradient-to-b from-transparent via-primary-sage to-transparent animate-data-pulse-v4" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {/* Container */}
      <div 
        className="absolute inset-0 border-2 border-primary-sage rounded-[20px] overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 40% 60%, rgba(139, 159, 126, 0.12), rgba(160, 114, 90, 0.08), transparent)'
        }}
      >
        {/* Horizontal Lines */}
        <div 
          className="absolute top-[15%] left-[5%] w-[78%] h-[3px] rounded-[1.5px] opacity-90 -rotate-[0.5deg]"
          style={{
            background: 'linear-gradient(90deg, transparent 25%, rgba(212, 123, 106, 0.7) 35%, #D47B6A 45%, #D47B6A 55%, rgba(212, 123, 106, 0.7) 65%, transparent 75%)',
            filter: 'drop-shadow(0 1px 2px rgba(139, 159, 126, 0.3))'
          }}
        />
        <div 
          className="absolute top-[35%] left-[12%] w-[75%] h-[3px] rounded-[1.5px] opacity-90 rotate-[0.3deg]"
          style={{
            background: 'linear-gradient(90deg, transparent 20%, rgba(212, 123, 106, 0.6) 28%, #D47B6A 38%, #D47B6A 62%, rgba(212, 123, 106, 0.6) 72%, transparent 80%)',
            filter: 'drop-shadow(0 1px 2px rgba(139, 159, 126, 0.3))'
          }}
        />
        <div 
          className="absolute top-[55%] left-[8%] w-[72%] h-[3px] rounded-[1.5px] opacity-90 -rotate-[0.2deg]"
          style={{
            background: 'linear-gradient(90deg, transparent 28%, rgba(212, 123, 106, 0.8) 38%, #D47B6A 48%, #D47B6A 52%, rgba(212, 123, 106, 0.8) 62%, transparent 72%)',
            filter: 'drop-shadow(0 1px 2px rgba(139, 159, 126, 0.3))'
          }}
        />
        <div 
          className="absolute top-[75%] left-[15%] w-[68%] h-[3px] rounded-[1.5px] opacity-90 rotate-[0.4deg]"
          style={{
            background: 'linear-gradient(90deg, transparent 32%, rgba(212, 123, 106, 0.5) 42%, #D47B6A 47%, #D47B6A 53%, rgba(212, 123, 106, 0.5) 58%, transparent 68%)',
            filter: 'drop-shadow(0 1px 2px rgba(139, 159, 126, 0.3))'
          }}
        />
        
        {/* Vertical Lines */}
        <div 
          className="absolute left-[20%] top-[10%] w-[3px] h-[72%] rounded-[1.5px] opacity-90 -rotate-[0.3deg]"
          style={{
            background: 'linear-gradient(180deg, transparent 25%, rgba(139, 159, 126, 0.7) 35%, #8B9F7E 45%, #8B9F7E 55%, rgba(139, 159, 126, 0.7) 65%, transparent 75%)',
            filter: 'drop-shadow(1px 0 2px rgba(160, 114, 90, 0.3))'
          }}
        />
        <div 
          className="absolute left-[40%] top-[6%] w-[3px] h-[78%] rounded-[1.5px] opacity-90 rotate-[0.5deg]"
          style={{
            background: 'linear-gradient(180deg, transparent 20%, rgba(139, 159, 126, 0.6) 28%, #8B9F7E 38%, #8B9F7E 62%, rgba(139, 159, 126, 0.6) 72%, transparent 80%)',
            filter: 'drop-shadow(1px 0 2px rgba(160, 114, 90, 0.3))'
          }}
        />
        <div 
          className="absolute left-[60%] top-[12%] w-[3px] h-[68%] rounded-[1.5px] opacity-90 -rotate-[0.4deg]"
          style={{
            background: 'linear-gradient(180deg, transparent 28%, rgba(139, 159, 126, 0.8) 38%, #8B9F7E 48%, #8B9F7E 52%, rgba(139, 159, 126, 0.8) 62%, transparent 72%)',
            filter: 'drop-shadow(1px 0 2px rgba(160, 114, 90, 0.3))'
          }}
        />
        <div 
          className="absolute left-[80%] top-[18%] w-[3px] h-[65%] rounded-[1.5px] opacity-90 rotate-[0.2deg]"
          style={{
            background: 'linear-gradient(180deg, transparent 32%, rgba(139, 159, 126, 0.5) 42%, #8B9F7E 47%, #8B9F7E 53%, rgba(139, 159, 126, 0.5) 58%, transparent 68%)',
            filter: 'drop-shadow(1px 0 2px rgba(160, 114, 90, 0.3))'
          }}
        />
        
        {/* Intersection Points */}
        <div 
          className="absolute top-[34%] left-[38%] w-1 h-1 rounded-full opacity-95 animate-subtle-glow"
          style={{
            background: 'radial-gradient(circle, #D4AF37, rgba(212, 175, 55, 0.7))',
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        />
        <div 
          className="absolute top-[53%] left-[58%] w-1 h-1 rounded-full opacity-95 animate-subtle-glow"
          style={{
            background: 'radial-gradient(circle, #D4AF37, rgba(212, 175, 55, 0.7))',
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute top-[73%] left-[18%] w-1 h-1 rounded-full opacity-95 animate-subtle-glow"
          style={{
            background: 'radial-gradient(circle, #D4AF37, rgba(212, 175, 55, 0.7))',
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute top-[13%] left-[78%] w-1 h-1 rounded-full opacity-95 animate-subtle-glow"
          style={{
            background: 'radial-gradient(circle, #D4AF37, rgba(212, 175, 55, 0.7))',
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            animationDelay: '3s'
          }}
        />
      </div>
    </div>
  )
}

export default Logo 