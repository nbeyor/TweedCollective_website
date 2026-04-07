'use client'

import React from 'react'

// ============================================
// Slide 7 — Three-Lane Decision Sort
// Partner (widest) | Build (medium) | Danger Zone (narrow, amber)
// ============================================

interface LaneItem {
  text: string
}

interface Lane {
  title: string
  description: string
  items: LaneItem[]
  variant: 'default' | 'build' | 'danger'
  width: 'wide' | 'medium' | 'narrow'
}

export function ThreeLaneSortSlide({ slideId, sectionLabel, heading, description, lanes, bottomBar }: {
  slideId: string
  sectionLabel?: string
  heading: string
  description?: string
  lanes: Lane[]
  bottomBar?: string
}) {
  const variantStyles = {
    default: {
      border: 'border-sage/30',
      bg: 'bg-sage/8',
      headerBg: 'bg-sage/15',
      headerText: 'text-sage-bright',
      bullet: 'bg-sage/60',
    },
    build: {
      border: 'border-cream/20',
      bg: 'bg-cream/5',
      headerBg: 'bg-cream/10',
      headerText: 'text-cream',
      bullet: 'bg-cream/40',
    },
    danger: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      headerBg: 'bg-amber-500/15',
      headerText: 'text-amber-400',
      bullet: 'bg-amber-500/60',
    },
  }

  const widthClasses = {
    wide: 'flex-[2]',
    medium: 'flex-[1.3]',
    narrow: 'flex-1',
  }

  return (
    <div className="flex flex-col justify-center">
      {sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{heading}</h2>
      {description && <p className="text-cream/60 text-sm leading-relaxed mb-5 max-w-3xl">{description}</p>}

      {/* Entry point */}
      <div className="flex justify-center mb-4">
        <div className="px-4 py-1.5 bg-cream/10 border border-cream/20 rounded-full">
          <span className="text-xs text-cream/70">New capability needed</span>
        </div>
      </div>
      <div className="flex justify-center mb-3">
        <div className="w-0.5 h-4 bg-cream/20" />
      </div>

      {/* Three lanes */}
      <div className="flex gap-3">
        {lanes.map((lane, i) => {
          const styles = variantStyles[lane.variant]
          return (
            <div key={i} className={`${widthClasses[lane.width]} flex flex-col`}>
              <div className={`rounded-xl border ${styles.border} ${styles.bg} p-4 flex-1`}>
                <div className={`${styles.headerBg} rounded-lg px-3 py-2 mb-3`}>
                  <h3 className={`text-sm font-semibold ${styles.headerText}`}>{lane.title}</h3>
                </div>
                <p className="text-xs text-cream/60 mb-3 leading-relaxed">{lane.description}</p>
                <ul className="space-y-1.5">
                  {lane.items.map((item, j) => (
                    <li key={j} className="text-xs text-cream/70 flex items-start gap-2">
                      <span className={`w-1 h-1 mt-1.5 ${styles.bullet} rounded-full flex-shrink-0`} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {bottomBar && (
        <div className="mt-6 bg-sage/10 border border-sage/30 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-1">Bottom Line</p>
          <p className="text-sm text-cream/70 leading-relaxed">{bottomBar}</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Slide 8 — Split Dashboard Mockup
// Live (green/populated) vs Neglected (grayed out)
// ============================================

interface DashboardMetric {
  label: string
  value?: string
  status?: 'green' | 'amber' | 'red' | 'none'
  trend?: 'up' | 'down' | 'flat' | 'none'
}

interface DashboardPanel {
  title: string
  variant: 'live' | 'neglected'
  lastUpdated?: string
  metrics: DashboardMetric[]
}

export function SplitDashboardSlide({ slideId, sectionLabel, heading, panels, contentGroups }: {
  slideId: string
  sectionLabel?: string
  heading: string
  panels: DashboardPanel[]
  contentGroups?: Array<{
    title: string
    items: string[]
  }>
}) {
  const statusColors = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    none: 'bg-cream/20',
  }

  return (
    <div className="flex flex-col justify-center">
      {sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{heading}</h2>

      {/* Dashboard panels */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {panels.map((panel, i) => {
          const isLive = panel.variant === 'live'
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                isLive
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-cream/10 bg-cream/3 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${isLive ? 'text-green-400' : 'text-cream/40'}`}>
                  {panel.title}
                </h3>
                {panel.lastUpdated && (
                  <span className={`text-[10px] ${isLive ? 'text-cream/40' : 'text-red-400/60'}`}>
                    {panel.lastUpdated}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {panel.metrics.map((metric, j) => (
                  <div key={j} className={`flex items-center justify-between py-1.5 px-2 rounded ${isLive ? 'bg-cream/5' : 'bg-cream/3'}`}>
                    <span className={`text-xs ${isLive ? 'text-cream/70' : 'text-cream/30'}`}>{metric.label}</span>
                    <div className="flex items-center gap-2">
                      {metric.value ? (
                        <span className={`text-xs font-medium ${isLive ? 'text-cream' : 'text-cream/20'}`}>{metric.value}</span>
                      ) : (
                        <span className="text-[10px] text-cream/20 italic">no data</span>
                      )}
                      <div className={`w-2 h-2 rounded-full ${statusColors[metric.status || 'none']}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Content groups below dashboard */}
      {contentGroups && contentGroups.length > 0 && (
        <div className="space-y-4">
          {contentGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-cream mb-2">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map((item, j) => (
                  <li key={j} className="text-xs text-cream/70 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 mt-1 bg-sage/60 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Slide 9 — Before/After Portfolio Scatter
// Chaotic dots → Focused, connected dots
// ============================================

export function PortfolioScatterSlide({ slideId, sectionLabel, heading, beforeLabel, afterLabel, beforeDots, afterDots, outcomes, contentGroups }: {
  slideId: string
  sectionLabel?: string
  heading: string
  beforeLabel: string
  afterLabel: string
  beforeDots: Array<{ label?: string; x: number; y: number; cut?: boolean }>
  afterDots: Array<{ label: string; x: number; y: number; color?: string }>
  outcomes: string[]
  contentGroups?: Array<{
    title: string
    icon?: string
    items: string[]
  }>
}) {
  return (
    <div className="flex flex-col justify-center">
      {sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{heading}</h2>

      {/* Before/After visualization */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Before */}
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-cream/30 mb-2">{beforeLabel}</div>
          <div className="relative bg-cream/3 border border-cream/10 rounded-xl p-4 h-40">
            <svg viewBox="0 0 300 120" className="w-full h-full">
              {beforeDots.map((dot, i) => (
                <g key={i}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.cut ? 4 : 5}
                    fill={dot.cut ? 'transparent' : `rgba(245, 244, 240, ${0.15 + Math.random() * 0.15})`}
                    stroke={dot.cut ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 244, 240, 0.2)'}
                    strokeWidth="1"
                  />
                  {dot.cut && (
                    <>
                      <line x1={dot.x - 4} y1={dot.y - 4} x2={dot.x + 4} y2={dot.y + 4} stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1" />
                      <line x1={dot.x + 4} y1={dot.y - 4} x2={dot.x - 4} y2={dot.y + 4} stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1" />
                    </>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* After */}
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-cream/30 mb-2">{afterLabel}</div>
          <div className="relative bg-cream/3 border border-cream/10 rounded-xl p-4 h-40">
            <svg viewBox="0 0 300 120" className="w-full h-full">
              {/* Connection lines to outcomes */}
              {afterDots.map((dot, i) => (
                <line
                  key={`line-${i}`}
                  x1={dot.x}
                  y1={dot.y}
                  x2={75 + i * 60}
                  y2={115}
                  stroke="rgba(107, 142, 111, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}
              {afterDots.map((dot, i) => (
                <g key={i}>
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={10}
                    fill="rgba(107, 142, 111, 0.2)"
                    stroke="rgba(107, 142, 111, 0.5)"
                    strokeWidth="1.5"
                  />
                  <text x={dot.x} y={dot.y + 3} textAnchor="middle" fill="rgba(245, 244, 240, 0.7)" fontSize="7" fontWeight="600">{dot.label}</text>
                </g>
              ))}
              {/* Outcome labels at bottom */}
              {outcomes.map((outcome, i) => (
                <text key={i} x={75 + i * 60} y={115} textAnchor="middle" fill="rgba(107, 142, 111, 0.6)" fontSize="6">{outcome}</text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Content groups */}
      {contentGroups && contentGroups.length > 0 && (
        <div className="space-y-4">
          {contentGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-cream mb-2">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map((item, j) => (
                  <li key={j} className="text-xs text-cream/70 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 mt-1 bg-sage/60 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Slide 11 — Role Anatomy / Org X-Ray
// Concentric rings around a central role
// ============================================

interface RingLayer {
  label: string
  description: string
  status: 'complete' | 'partial' | 'missing'
}

export function RoleAnatomySlide({ slideId, sectionLabel, heading, centerLabel, rings, contentGroups }: {
  slideId: string
  sectionLabel?: string
  heading: string
  centerLabel: string
  rings: RingLayer[]
  contentGroups?: Array<{
    title: string
    items: string[]
  }>
}) {
  const statusStyles = {
    complete: { stroke: 'rgba(107, 142, 111, 0.6)', fill: 'rgba(107, 142, 111, 0.08)', label: 'text-sage-bright' },
    partial: { stroke: 'rgba(234, 179, 8, 0.5)', fill: 'rgba(234, 179, 8, 0.05)', label: 'text-amber-400' },
    missing: { stroke: 'rgba(239, 68, 68, 0.3)', fill: 'transparent', label: 'text-red-400/60', dasharray: '6 4' },
  }

  return (
    <div className="flex flex-col justify-center">
      {sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{heading}</h2>

      <div className="flex gap-8 items-start">
        {/* Ring diagram */}
        <div className="flex-shrink-0 w-64">
          <svg viewBox="0 0 260 260" className="w-full h-auto">
            {/* Rings from outermost to innermost */}
            {[...rings].reverse().map((ring, i) => {
              const idx = rings.length - 1 - i
              const radius = 120 - (idx * 22)
              const styles = statusStyles[ring.status]
              return (
                <circle
                  key={i}
                  cx="130"
                  cy="130"
                  r={radius}
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth="1.5"
                  strokeDasharray={ring.status === 'missing' ? '6 4' : 'none'}
                />
              )
            })}
            {/* Center */}
            <circle cx="130" cy="130" r={30} fill="rgba(107, 142, 111, 0.2)" stroke="rgba(107, 142, 111, 0.5)" strokeWidth="2" />
            <text x="130" y="127" textAnchor="middle" fill="rgba(245, 244, 240, 0.8)" fontSize="8" fontWeight="600">Innovation</text>
            <text x="130" y="137" textAnchor="middle" fill="rgba(245, 244, 240, 0.8)" fontSize="8" fontWeight="600">Leader</text>
          </svg>
        </div>

        {/* Ring legend */}
        <div className="flex-1 space-y-3">
          {rings.map((ring, i) => {
            const styles = statusStyles[ring.status]
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0 border" style={{
                  borderColor: styles.stroke,
                  backgroundColor: ring.status === 'complete' ? styles.stroke : 'transparent',
                }} />
                <div>
                  <span className={`text-xs font-semibold ${styles.label}`}>{ring.label}</span>
                  <p className="text-xs text-cream/60 mt-0.5 leading-relaxed">{ring.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content groups below diagram */}
      {contentGroups && contentGroups.length > 0 && (
        <div className="space-y-4 mt-6">
          {contentGroups.map((group, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-cream mb-2">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map((item, j) => (
                  <li key={j} className="text-xs text-cream/70 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 mt-1 bg-sage/60 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
