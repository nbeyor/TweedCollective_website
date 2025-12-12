'use client'

import React from 'react'

// Title Slide - Opening slide with large title
export function TitleSlide({ 
  title, 
  subtitle, 
  author,
  date 
}: { 
  title: string
  subtitle?: string
  author?: string
  date?: string
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl md:text-7xl font-serif font-light text-cream mb-6 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl md:text-2xl text-cream/70 mb-8 max-w-2xl">
          {subtitle}
        </p>
      )}
      {(author || date) && (
        <div className="flex items-center gap-4 text-sm text-cream/40">
          {author && <span>{author}</span>}
          {author && date && <span className="w-1 h-1 bg-cream/40 rounded-full" />}
          {date && <span>{date}</span>}
        </div>
      )}
    </div>
  )
}

// Section Slide - Divider between major sections
export function SectionSlide({ 
  number, 
  title, 
  description 
}: { 
  number?: string | number
  title: string
  description?: string
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      {number && (
        <span className="text-8xl font-serif font-light text-sage/30 mb-4">
          {String(number).padStart(2, '0')}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-serif text-cream mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-cream/60 max-w-xl">
          {description}
        </p>
      )}
    </div>
  )
}

// Content Slide - Standard slide with title and content
export function ContentSlide({ 
  title, 
  children,
  layout = 'default'
}: { 
  title: string
  children: React.ReactNode
  layout?: 'default' | 'centered' | 'wide'
}) {
  const layoutClasses = {
    default: 'max-w-3xl',
    centered: 'max-w-2xl text-center mx-auto',
    wide: 'max-w-4xl'
  }

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-8">
        {title}
      </h2>
      <div className={`${layoutClasses[layout]} text-cream/80 text-lg leading-relaxed`}>
        {children}
      </div>
    </div>
  )
}

// Bullet Slide - Slide with bullet points
export function BulletSlide({ 
  title, 
  bullets,
  columns = 1
}: { 
  title: string
  bullets: (string | { text: string; sub?: string[] })[]
  columns?: 1 | 2
}) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-10">
        {title}
      </h2>
      <ul className={`space-y-4 ${columns === 2 ? 'columns-2 gap-12' : ''}`}>
        {bullets.map((bullet, index) => {
          const isObject = typeof bullet === 'object'
          const text = isObject ? bullet.text : bullet
          const sub = isObject ? bullet.sub : undefined
          
          return (
            <li 
              key={index} 
              className="flex items-start gap-4 break-inside-avoid"
            >
              <span className="w-2 h-2 mt-2.5 bg-sage rounded-full flex-shrink-0" />
              <div>
                <span className="text-lg text-cream/90">{text}</span>
                {sub && sub.length > 0 && (
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {sub.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/60">
                        <span className="w-1.5 h-1.5 mt-2 bg-terra/60 rounded-full flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Stats Slide - Slide with key metrics
export function StatsSlide({ 
  title, 
  stats 
}: { 
  title?: string
  stats: { value: string; label: string; description?: string }[]
}) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      {title && (
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-12 text-center">
          {title}
        </h2>
      )}
      <div className={`grid gap-8 ${
        stats.length === 2 ? 'grid-cols-2' : 
        stats.length === 3 ? 'grid-cols-3' : 
        stats.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'
      }`}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="text-center p-6 rounded-2xl bg-cream/5 border border-cream/10"
          >
            <div className="text-5xl md:text-6xl font-serif font-light text-sage mb-2">
              {stat.value}
            </div>
            <div className="text-sm uppercase tracking-wider text-cream/60 mb-1">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-xs text-cream/40 mt-2">
                {stat.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Quote Slide - Large quote with attribution
export function QuoteSlide({ 
  quote, 
  author, 
  role 
}: { 
  quote: string
  author?: string
  role?: string
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <blockquote className="text-2xl md:text-4xl font-serif font-light text-cream leading-relaxed max-w-3xl mb-8">
        <span className="text-sage text-5xl leading-none">"</span>
        {quote}
        <span className="text-sage text-5xl leading-none">"</span>
      </blockquote>
      {(author || role) && (
        <cite className="not-italic text-cream/60">
          {author && <span className="font-medium text-cream/80">{author}</span>}
          {role && <span className="block text-sm mt-1">{role}</span>}
        </cite>
      )}
    </div>
  )
}

// Image Slide - Slide with large image
export function ImageSlide({ 
  title, 
  src, 
  alt, 
  caption 
}: { 
  title?: string
  src: string
  alt: string
  caption?: string
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {title && (
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <p className="text-sm text-cream/50 mt-4 text-center">
          {caption}
        </p>
      )}
    </div>
  )
}

// Two Column Slide
export function TwoColumnSlide({ 
  title, 
  left, 
  right 
}: { 
  title?: string
  left: React.ReactNode
  right: React.ReactNode
}) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      {title && (
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-10">
          {title}
        </h2>
      )}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="text-cream/80 text-lg leading-relaxed">
          {left}
        </div>
        <div className="text-cream/80 text-lg leading-relaxed">
          {right}
        </div>
      </div>
    </div>
  )
}

// Comparison Slide - Before/After or Option A/B
export function ComparisonSlide({ 
  title,
  leftLabel,
  rightLabel,
  left,
  right,
  leftColor = 'coral',
  rightColor = 'sage'
}: { 
  title?: string
  leftLabel: string
  rightLabel: string
  left: React.ReactNode
  right: React.ReactNode
  leftColor?: 'coral' | 'terra' | 'warm-gray'
  rightColor?: 'sage' | 'ochre' | 'gold'
}) {
  const leftColors = {
    coral: 'border-coral/50 bg-coral/10',
    terra: 'border-terra/50 bg-terra/10',
    'warm-gray': 'border-warm-gray/50 bg-warm-gray/10'
  }
  
  const rightColors = {
    sage: 'border-sage/50 bg-sage/10',
    ochre: 'border-ochre/50 bg-ochre/10',
    gold: 'border-gold/50 bg-gold/10'
  }

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      {title && (
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-10 text-center">
          {title}
        </h2>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border ${leftColors[leftColor]}`}>
          <h3 className="text-lg font-semibold text-cream mb-4">{leftLabel}</h3>
          <div className="text-cream/70">{left}</div>
        </div>
        <div className={`p-6 rounded-2xl border ${rightColors[rightColor]}`}>
          <h3 className="text-lg font-semibold text-cream mb-4">{rightLabel}</h3>
          <div className="text-cream/70">{right}</div>
        </div>
      </div>
    </div>
  )
}

// CTA/Closing Slide
export function ClosingSlide({ 
  title, 
  message, 
  cta,
  ctaHref,
  contact 
}: { 
  title: string
  message?: string
  cta?: string
  ctaHref?: string
  contact?: { email?: string; website?: string }
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl md:text-5xl font-serif text-cream mb-6">
        {title}
      </h2>
      {message && (
        <p className="text-xl text-cream/70 mb-8 max-w-xl">
          {message}
        </p>
      )}
      {cta && (
        <a 
          href={ctaHref || '#'} 
          className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-cream rounded-xl text-lg font-medium hover:bg-sage/90 transition-colors mb-8"
        >
          {cta}
        </a>
      )}
      {contact && (
        <div className="flex flex-col items-center gap-2 text-cream/50">
          {contact.email && <span>{contact.email}</span>}
          {contact.website && <span>{contact.website}</span>}
        </div>
      )}
    </div>
  )
}

