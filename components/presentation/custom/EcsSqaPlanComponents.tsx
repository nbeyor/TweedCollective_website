'use client'

import React from 'react'
import { FileText, Code2, ShieldCheck, BookOpen } from 'lucide-react'

// ============================================
// Slide 1 — Agent-Only Delivery Model
// 3 columns (Product / Dev / SQA) + shared foundation bar
// ============================================

interface DeliveryColumn {
  title: string
  iconKey: 'product' | 'development' | 'sqa'
  responsibilities: string[]
  agentActions: string[]
  tools: string[]
}

interface Foundation {
  title: string
  items: string[]
}

const columnIcon = {
  product: FileText,
  development: Code2,
  sqa: ShieldCheck,
}

export function EcsSqaDeliveryModelSlide({
  heading,
  description,
  columns,
  foundation,
  footerTakeaway,
}: {
  slideId: string
  heading: string
  description?: string
  columns: DeliveryColumn[]
  foundation: Foundation
  footerTakeaway: string
}) {
  return (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">{heading}</h2>
      {description && (
        <p className="text-cream/60 text-sm leading-relaxed mb-4 max-w-4xl">{description}</p>
      )}

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {columns.map((col, i) => {
          const Icon = columnIcon[col.iconKey]
          return (
            <div
              key={i}
              className="rounded-xl border border-sage/30 bg-sage/5 p-3 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-sage/20">
                <div className="w-7 h-7 rounded-md bg-sage/15 border border-sage/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-sage-bright" />
                </div>
                <h3 className="text-sm font-semibold text-sage-bright">{col.title}</h3>
              </div>

              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-wider text-cream/50 mb-1">
                  Responsibilities
                </p>
                <ul className="space-y-0.5">
                  {col.responsibilities.map((item, j) => (
                    <li key={j} className="text-[11px] text-cream/75 flex items-start gap-1.5 leading-snug">
                      <span className="w-1 h-1 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-wider text-cream/50 mb-1">
                  Agents do
                </p>
                <ul className="space-y-0.5">
                  {col.agentActions.map((item, j) => (
                    <li key={j} className="text-[11px] text-cream/75 flex items-start gap-1.5 leading-snug">
                      <span className="w-1 h-1 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-2 border-t border-sage/20">
                <p className="text-[10px] uppercase tracking-wider text-cream/50 mb-1">Tools</p>
                <div className="flex flex-wrap gap-1">
                  {col.tools.map((tool, j) => (
                    <span
                      key={j}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-cream/10 border border-cream/15 text-cream/80"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Shared foundation bar */}
      <div className="rounded-xl border border-gold/30 bg-gold/10 p-3 mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-4 h-4 text-gold" />
          <p className="text-sm font-semibold text-gold">{foundation.title}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-6">
          {foundation.items.map((item, i) => (
            <span key={i} className="text-[11px] text-cream/70 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-gold/70 rounded-full flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Footer takeaway */}
      <div className="rounded-xl border border-sage/30 bg-sage/10 px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-0.5">
          Takeaway
        </p>
        <p className="text-xs text-cream/80 leading-relaxed">{footerTakeaway}</p>
      </div>
    </div>
  )
}

// ============================================
// Slide 3 — Dual-Track Roadmap
// Two horizontal swim lanes × 3 months
// ============================================

interface RoadmapTrack {
  title: string
  variant: 'primary' | 'accent'
  phases: string[][]
}

export function EcsSqaRoadmapSlide({
  heading,
  description,
  months,
  tracks,
  bottomMessages,
  footerTakeaway,
}: {
  slideId: string
  heading: string
  description?: string
  months: string[]
  tracks: RoadmapTrack[]
  bottomMessages: string[]
  footerTakeaway: string
}) {
  const variantStyles = {
    primary: {
      border: 'border-sage/30',
      bg: 'bg-sage/5',
      headerBg: 'bg-sage/15',
      headerText: 'text-sage-bright',
      bullet: 'bg-sage/60',
    },
    accent: {
      border: 'border-gold/30',
      bg: 'bg-gold/5',
      headerBg: 'bg-gold/15',
      headerText: 'text-gold',
      bullet: 'bg-gold/60',
    },
  }

  return (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">{heading}</h2>
      {description && (
        <p className="text-cream/60 text-sm leading-relaxed mb-3 max-w-4xl">{description}</p>
      )}

      {/* Month headers */}
      <div className="grid mb-2" style={{ gridTemplateColumns: '140px repeat(3, 1fr)', gap: '8px' }}>
        <div />
        {months.map((m, i) => (
          <div key={i} className="text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-cream/10 border border-cream/20">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                {m}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Track swim lanes */}
      <div className="flex flex-col gap-2 mb-3">
        {tracks.map((track, ti) => {
          const s = variantStyles[track.variant]
          return (
            <div
              key={ti}
              className="grid items-stretch"
              style={{ gridTemplateColumns: '140px repeat(3, 1fr)', gap: '8px' }}
            >
              {/* Track label */}
              <div
                className={`rounded-lg border ${s.border} ${s.headerBg} flex items-center px-3 py-2`}
              >
                <span className={`text-xs font-semibold ${s.headerText} leading-tight`}>
                  {track.title}
                </span>
              </div>

              {/* Month phases */}
              {track.phases.map((phase, pi) => (
                <div
                  key={pi}
                  className={`rounded-lg border ${s.border} ${s.bg} p-2.5`}
                >
                  <ul className="space-y-1">
                    {phase.map((item, bi) => (
                      <li
                        key={bi}
                        className="text-[11px] text-cream/80 flex items-start gap-1.5 leading-snug"
                      >
                        <span
                          className={`w-1 h-1 mt-1.5 ${s.bullet} rounded-full flex-shrink-0`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Bottom messages strip */}
      <div className="rounded-xl border border-cream/15 bg-cream/5 px-4 py-2 mb-2">
        <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center">
          {bottomMessages.map((msg, i) => (
            <span
              key={i}
              className="text-[11px] text-cream/75 flex items-center gap-1.5"
            >
              <span className="w-1 h-1 bg-cream/50 rounded-full flex-shrink-0" />
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Footer takeaway */}
      <div className="rounded-xl border border-sage/30 bg-sage/10 px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-0.5">
          Takeaway
        </p>
        <p className="text-xs text-cream/80 leading-relaxed">{footerTakeaway}</p>
      </div>
    </div>
  )
}
