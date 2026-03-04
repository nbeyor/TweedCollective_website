'use client'

import React from 'react'

// Regulatory segmentation map
export function RegulatoryMapSlide({ regions, note }: {
  regions: Array<{ name: string; description: string }>
  note?: string
}) {
  const regionColors: Record<string, string> = {
    'European Union': 'border-red-500/30 bg-red-500/5',
    'United Kingdom': 'border-yellow-500/30 bg-yellow-500/5',
    'United States': 'border-green-500/30 bg-green-500/5',
    'Japan': 'border-green-500/30 bg-green-500/5',
  }

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">Slide 04</div>
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">Regulatory Segmentation Map</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {regions.map((region, i) => (
          <div key={i} className={`rounded-xl border p-5 ${regionColors[region.name] || 'border-cream/20 bg-cream/5'}`}>
            <h3 className="text-lg font-semibold text-cream mb-2">{region.name}</h3>
            <p className="text-sm text-cream/70">{region.description}</p>
          </div>
        ))}
      </div>
      {note && (
        <p className="text-xs text-cream/40 italic">{note}</p>
      )}
    </div>
  )
}
