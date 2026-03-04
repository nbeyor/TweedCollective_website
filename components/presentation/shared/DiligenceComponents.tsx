'use client'

import React from 'react'
import { AlertCircle, Check, AlertTriangle, Search } from 'lucide-react'

// Rating badge for HIGH/MEDIUM/LOW assessments
export function RatingBadge({ rating, size = 'sm' }: { rating: string; size?: 'sm' | 'lg' }) {
  const colorMap: Record<string, string> = {
    'HIGH': 'bg-green-500/20 text-green-300 border-green-500/30',
    'MEDIUM-HIGH': 'bg-green-500/15 text-green-300 border-green-500/25',
    'MEDIUM': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'MEDIUM-LOW': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
    'LOW-MEDIUM': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
    'LOW': 'bg-red-500/20 text-red-300 border-red-500/30',
    'GAP': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'STRONG': 'bg-green-500/20 text-green-300 border-green-500/30',
    'MODERATE': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'LOWER': 'bg-green-500/15 text-green-300 border-green-500/25',
    'HIGHER': 'bg-red-500/20 text-red-300 border-red-500/30',
  }
  const cls = colorMap[rating.toUpperCase()] || colorMap['MEDIUM']
  const pad = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
  return <span className={`inline-flex items-center rounded-full border font-mono font-medium ${cls} ${pad}`}>{rating}</span>
}

// Status dot for readiness/progress indicators
export function StatusDot({ color }: { color: 'green' | 'yellow' | 'red' | 'unknown' }) {
  const cls: Record<string, string> = {
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    unknown: 'bg-cream/30',
  }
  return <span className={`inline-block w-3 h-3 rounded-full ${cls[color]}`} />
}

// Readiness icon for AI readiness assessments
// Supports both `status` (original) and `level` props for compatibility
export function ReadinessIcon({ status, level }: { status?: 'ready' | 'developing' | 'unknown' | 'strong'; level?: 'high' | 'medium' | 'low' }) {
  // If level prop is used, map to status
  if (level) {
    const levelToStatus: Record<string, 'ready' | 'developing' | 'unknown'> = {
      high: 'ready',
      medium: 'developing',
      low: 'unknown',
    }
    status = levelToStatus[level]
  }
  if (status === 'ready' || status === 'strong') return <Check className="w-4 h-4 text-green-400 inline" />
  if (status === 'developing') return <AlertTriangle className="w-4 h-4 text-yellow-400 inline" />
  return <Search className="w-4 h-4 text-cream/40 inline" />
}

// Gap sticker for highlighting gaps in assessment
// Supports both `count`+`label` (original) and just `label` props
export function GapSticker({ count, label }: { count?: number; label?: string }) {
  // If count is provided, use original rendering
  if (count !== undefined) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/90 text-void rounded shadow-lg shadow-amber-500/20 rotate-[-1deg] select-none">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{count} {label || (count === 1 ? 'Gap' : 'Gaps')}</span>
      </div>
    )
  }
  // Fallback: label-only rendering
  return (
    <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/25 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium">
      {label}
    </span>
  )
}

// Gap callout box for detailed gap explanations
// Supports both `gapCount`+`children` (original) and `title`+`children` props
export function GapCallout({ children, gapCount, title }: { children: React.ReactNode; gapCount?: number; title?: string }) {
  // If gapCount is provided, use original rendering
  if (gapCount !== undefined) {
    return (
      <div className="relative p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <div className="absolute -top-3 right-4">
          <GapSticker count={gapCount} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Open Questions &amp; Gaps</span>
        </div>
        {children}
      </div>
    )
  }
  // Fallback: title-based rendering
  return (
    <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
      <p className="text-xs font-semibold text-amber-300 mb-2">{title}</p>
      <div className="text-sm text-cream/70">{children}</div>
    </div>
  )
}

// Gap tag for inline gap indicators (no props required — renders "GAP" label)
export function GapTag({ children }: { children?: React.ReactNode }) {
  if (children) {
    return (
      <span className="inline-flex items-center bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded px-1.5 py-0.5 text-[10px] font-mono">
        {children}
      </span>
    )
  }
  return <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase tracking-wider rounded border border-amber-500/30 mx-0.5">GAP</span>
}

// Section header used in assessment slides
export function SectionHeader({ section, title, subtitle }: { section: string; title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{section}</div>
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">{title}</h2>
      {subtitle && <p className="text-cream/50 text-sm">{subtitle}</p>}
    </div>
  )
}
