'use client'

import React from 'react'
import { stageData, segmentData } from '@/content/documents/health-tech-market'
import * as LucideIcons from 'lucide-react'
import { iconRegistry } from '@/lib/slideTemplates'

function resolveIcon(name: string) {
  const lucideName = (iconRegistry as Record<string, string>)[name] || name
  return (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[lucideName]
}

export function StageSlide({ stage }: { stage: string }) {
  const data = stageData[stage as keyof typeof stageData]
  if (!data) return null
  const Icon = typeof data.icon === 'string' ? resolveIcon(data.icon) : null

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">By Stage</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">{data.title}</h2>
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">{data.description}</p>
      <div className="space-y-4">
        {data.themes.map((theme, index) => (
          <div key={index} className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                {Icon && <Icon className="w-6 h-6 text-purple-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-cream mb-3">{theme.title}</h3>
                <ul className="space-y-2">
                  {theme.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-sage mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SegmentSlide({ segment }: { segment: string }) {
  const data = segmentData[segment as keyof typeof segmentData]
  if (!data) return null
  const Icon = typeof data.icon === 'string' ? resolveIcon(data.icon) : null

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">By Segment</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">{data.title}</h2>
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">{data.description}</p>
      <div className="space-y-4">
        {data.themes.map((theme, index) => (
          <div key={index} className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                {Icon && <Icon className="w-6 h-6 text-green-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-cream mb-3">{theme.title}</h3>
                <ul className="space-y-2">
                  {theme.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-sage mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
