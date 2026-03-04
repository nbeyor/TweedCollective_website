'use client'

import React, { useState } from 'react'

// Timeline slide - interactive expandable timeline
export function TimelineSlide({ heading, items }: {
  heading: string
  items: Array<{
    id: number
    label: string
    date: string
    source: string
    title: string
    description: string
    metrics: string[]
    anecdote?: string
  }>
}) {
  const [activeId, setActiveId] = useState(items.length - 1)
  const active = items[activeId] || items[0]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">{heading}</h2>

      {/* Timeline Bar */}
      <div className="relative mb-8 px-4">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-cream/20" />
        <div className="flex justify-between relative">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`relative flex flex-col items-center group cursor-pointer ${
                item.id === activeId ? 'z-10' : ''
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                item.id === activeId
                  ? 'bg-sage border-sage scale-125'
                  : item.id < activeId
                    ? 'bg-sage/30 border-sage/50'
                    : 'bg-void border-cream/30 group-hover:border-sage'
              }`} />
              <span className={`text-[10px] mt-2 whitespace-nowrap transition-colors ${
                item.id === activeId ? 'text-cream font-medium' : 'text-cream/40'
              }`}>
                {item.label}
              </span>
              <span className={`text-[9px] transition-colors ${
                item.id === activeId ? 'text-cream/60' : 'text-cream/20'
              }`}>
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Detail */}
      <div className="p-6 rounded-xl border border-cream/20 bg-cream/5 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold text-cream">{active.title}</h3>
          <span className="text-xs text-cream/40">{active.source}</span>
        </div>
        <p className="text-sm text-cream/70 mb-4">{active.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {active.metrics.map((m, i) => (
            <span key={i} className="text-xs bg-sage/15 text-sage-bright px-2.5 py-1 rounded-full">{m}</span>
          ))}
        </div>
        {active.anecdote && (
          <div className="p-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/10">
            <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">Anecdote</div>
            <p className="text-sm text-cream/80">{active.anecdote}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Adoption stances detailed slide
export function AdoptionStancesDetailedSlide({ heading, stances }: {
  heading: string
  stances: Array<{
    level: number
    title: string
    subtitle: string
    characteristics: string[]
    messaging: string
    changeMgmt?: string
    implications?: string[]
    risks?: string
    caseStudy?: string
  }>
}) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">{heading}</h2>
      <div className="space-y-4">
        {stances.map((stance, index) => (
          <div key={index} className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-cream">Stance {stance.level} — {stance.title} ({stance.subtitle})</h3>
            </div>
            <div className="space-y-3 text-xs text-cream/70">
              <div>
                <strong className="text-cream">Characteristics:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  {stance.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sage mt-1">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-cream">Messaging:</strong> {stance.messaging}
              </div>
              {stance.changeMgmt && (
                <div>
                  <strong className="text-cream">Change-Mgmt Needs:</strong> {stance.changeMgmt}
                </div>
              )}
              {stance.implications && (
                <div>
                  <strong className="text-cream">Implications:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    {stance.implications.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sage mt-1">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stance.risks && (
                <div>
                  <strong className="text-cream">Risks:</strong> {stance.risks}
                </div>
              )}
              {stance.caseStudy && (
                <div className="p-3 rounded-lg border-l-4 border-purple-500 bg-purple-500/10 mt-2">
                  <strong className="text-purple-300">{stance.caseStudy}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
