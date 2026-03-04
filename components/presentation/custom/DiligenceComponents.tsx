'use client'

import React from 'react'
import { RatingBadge, GapCallout, StatusDot } from '../shared/DiligenceComponents'

/**
 * Chart slide for due diligence documents.
 * Renders Chart.js charts with data passed as props.
 */
export function DiligenceChartSlide({ heading, sectionLabel, description, chartType, chartData, chartOptions, height, insightBox }: {
  heading: string
  sectionLabel?: string
  description?: string
  chartType: 'bar' | 'doughnut' | 'line'
  chartData: Record<string, unknown>
  chartOptions?: Record<string, unknown>
  height?: number
  insightBox?: { label: string; text: string }
}) {
  // Dynamic import to avoid SSR issues with Chart.js
  const [ChartComponent, setChartComponent] = React.useState<React.ComponentType<{ data: unknown; options: unknown }> | null>(null)

  React.useEffect(() => {
    import('react-chartjs-2').then(mod => {
      const components: Record<string, React.ComponentType<{ data: unknown; options: unknown }>> = {
        bar: mod.Bar as unknown as React.ComponentType<{ data: unknown; options: unknown }>,
        doughnut: mod.Doughnut as unknown as React.ComponentType<{ data: unknown; options: unknown }>,
        line: mod.Line as unknown as React.ComponentType<{ data: unknown; options: unknown }>,
      }
      setChartComponent(() => components[chartType] || mod.Bar as unknown as React.ComponentType<{ data: unknown; options: unknown }>)
    })
  }, [chartType])

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      {sectionLabel && <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-4">{heading}</h2>
      {description && <p className="text-cream/60 mb-6">{description}</p>}
      <div className="bg-cream/5 border border-cream/10 rounded-2xl p-6">
        <div style={{ height: height || 300 }}>
          {ChartComponent && <ChartComponent data={chartData} options={chartOptions || {}} />}
        </div>
      </div>
      {insightBox && (
        <div className="mt-6 bg-sage/10 border border-sage/30 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-2">{insightBox.label}</p>
          <p className="text-sm text-cream/70 leading-relaxed">{insightBox.text}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Assessment grid for due diligence documents.
 * Renders a grid of assessment categories with ratings.
 */
export function DiligenceAssessmentGrid({ heading, sectionLabel, description, assessments, columns, insightBox }: {
  heading: string
  sectionLabel?: string
  description?: string
  assessments: Array<{
    title: string
    rating?: string
    items?: string[]
    description?: string
    icon?: string
    gaps?: string[]
  }>
  columns?: number
  insightBox?: { label: string; text: string }
}) {
  const colClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      {sectionLabel && <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-4">{heading}</h2>
      {description && <p className="text-cream/60 mb-6">{description}</p>}
      <div className={`grid gap-4 ${colClass}`}>
        {assessments.map((item, i) => (
          <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-cream">{item.title}</h3>
              {item.rating && <RatingBadge rating={item.rating} />}
            </div>
            {item.description && <p className="text-xs text-cream/60 mb-2">{item.description}</p>}
            {item.items && (
              <ul className="space-y-1.5">
                {item.items.map((li, j) => (
                  <li key={j} className="text-xs text-cream/70 flex items-start gap-2">
                    <span className="w-1 h-1 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                    {li}
                  </li>
                ))}
              </ul>
            )}
            {item.gaps && item.gaps.length > 0 && (
              <GapCallout title="Gaps Identified">
                <ul className="space-y-1">
                  {item.gaps.map((g, j) => (
                    <li key={j} className="text-xs">{g}</li>
                  ))}
                </ul>
              </GapCallout>
            )}
          </div>
        ))}
      </div>
      {insightBox && (
        <div className="mt-6 bg-sage/10 border border-sage/30 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-2">{insightBox.label}</p>
          <p className="text-sm text-cream/70 leading-relaxed">{insightBox.text}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Synergy/implementation timeline for due diligence documents.
 */
export function DiligenceSynergySlide({ heading, sectionLabel, description, waves, insightBox }: {
  heading: string
  sectionLabel?: string
  description?: string
  waves: Array<{
    title: string
    timeline: string
    items: Array<{ initiative: string; impact?: string; description?: string }>
  }>
  insightBox?: { label: string; text: string }
}) {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      {sectionLabel && <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{sectionLabel}</div>}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-4">{heading}</h2>
      {description && <p className="text-cream/60 mb-6">{description}</p>}
      <div className="space-y-4">
        {waves.map((wave, i) => (
          <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-sage/20 text-sage-bright flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-cream">{wave.title}</h3>
                <span className="text-xs text-cream/50">{wave.timeline}</span>
              </div>
            </div>
            <div className="space-y-2">
              {wave.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                  <div>
                    <span className="text-cream/80 font-medium">{item.initiative}</span>
                    {item.impact && <span className="text-sage-bright ml-2">({item.impact})</span>}
                    {item.description && <p className="text-cream/50 mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {insightBox && (
        <div className="mt-6 bg-sage/10 border border-sage/30 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-2">{insightBox.label}</p>
          <p className="text-sm text-cream/70 leading-relaxed">{insightBox.text}</p>
        </div>
      )}
    </div>
  )
}
