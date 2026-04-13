'use client'

import React from 'react'
import type { Slide } from '@/components/presentation/PresentationLayout'
import type {
  SlideData, SlideContent, TitleSlideContent, TextSlideContent,
  GridSlideContent, ComparisonSlideContent, TimelineSlideContent,
  ListSlideContent, FrameworkSlideContent, MetricsSlideContent,
  CaseStudySlideContent, SourcesSlideContent, TableSlideContent,
  FunnelSlideContent, SpectrumSlideContent, ChartSlideContent,
  VennSlideContent, QuotesSlideContent,
  CustomSlideContent, GridItem, MetricCard,
} from '@/lib/types'
import * as LucideIcons from 'lucide-react'
import { iconRegistry } from '@/lib/slideTemplates'

// Custom component registry type
export type CustomComponentRegistry = Record<string, React.ComponentType<Record<string, unknown>>>

// Icon resolver - maps semantic names or Lucide names to components
function IconComponent({ name, className }: { name: string; className?: string }) {
  // First check the semantic icon registry
  const lucideName = (iconRegistry as Record<string, string>)[name] || name
  const Icon = (LucideIcons as Record<string, unknown>)[lucideName] as React.ComponentType<{ className?: string }> | undefined
  if (!Icon) return null
  return <Icon className={className || 'w-5 h-5'} />
}

// InsightBox component used across multiple slide types
function InsightBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-8 bg-sage/10 border border-sage/30 rounded-xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-sage-bright mb-2">{label}</p>
      <p className="text-sm text-cream/70 leading-relaxed">{text}</p>
    </div>
  )
}

// ---- TITLE SLIDE ----
function renderTitle(content: TitleSlideContent) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {content.badge && (
        <span className="inline-block px-4 py-1.5 bg-sage/20 text-sage-bright text-sm font-medium rounded-full mb-6">
          {content.badge}
        </span>
      )}
      <h1 className="text-5xl md:text-7xl font-serif font-light text-cream mb-6 leading-tight max-w-4xl">
        {content.headline}
      </h1>
      <p className="text-xl md:text-2xl text-cream/60 max-w-2xl">
        {content.subtitle}
      </p>
      {content.metrics && content.metrics.length > 0 && (
        <div className={`grid gap-6 mt-10 ${content.metrics.length === 3 ? 'grid-cols-1 md:grid-cols-3' : content.metrics.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-4'} w-full max-w-4xl`}>
          {content.metrics.map((m: MetricCard, i: number) => (
            <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5 text-center">
              <div className="text-3xl md:text-4xl font-serif font-light text-sage mb-1">{m.value}</div>
              <div className="text-sm text-cream/80 font-medium">{m.label}</div>
              {m.sublabel && <div className="text-xs text-cream/50 mt-1">{m.sublabel}</div>}
              {m.source && <div className="text-[10px] text-cream/30 mt-2">{m.source}</div>}
            </div>
          ))}
        </div>
      )}
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- TEXT SLIDE ----
function renderText(content: TextSlideContent) {
  const bodyArr = Array.isArray(content.body) ? content.body : [content.body]
  return (
    <div className="flex flex-col justify-center max-w-3xl">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{content.heading}</h2>
      <div className="space-y-4">
        {bodyArr.map((p: string, i: number) => (
          <p key={i} className="text-cream/70 text-lg leading-relaxed">{p}</p>
        ))}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- GRID SLIDE ----
function renderGrid(content: GridSlideContent) {
  const cols = content.columns || 3
  const colsClass = cols === 2 ? 'md:grid-cols-2' : cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'
  const isHorizontal = content.layout === 'horizontal-cards'

  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{content.heading}</h2>
      {content.description && (
        <p className="text-cream/60 text-base leading-relaxed mb-6 max-w-3xl">{content.description}</p>
      )}
      {content.headerSection && (
        <div className="bg-sage/10 border border-sage/30 rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-sage-bright mb-2">{content.headerSection.heading}</p>
          <ul className="space-y-1.5">
            {content.headerSection.items.map((item: string, i: number) => (
              <li key={i} className="text-sm text-cream/70 flex items-start gap-2">
                <span className="w-1.5 h-1.5 mt-1.5 bg-sage-bright rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={`grid gap-4 ${isHorizontal ? 'grid-cols-1 ' + colsClass : 'grid-cols-1 ' + colsClass}`}>
        {content.items.map((item: GridItem, i: number) => (
          <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5 hover:bg-cream/8 transition-all">
            {item.icon && <IconComponent name={item.icon} className="w-6 h-6 text-sage-bright mb-3" />}
            <h3 className="text-lg font-semibold text-cream mb-2">{item.title}</h3>
            {item.subtitle && <p className="text-xs text-cream/50 mb-2">{item.subtitle}</p>}
            {item.description && <p className="text-sm text-cream/60 leading-relaxed">{item.description}</p>}
            {item.items && item.items.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {item.items.map((li: string, j: number) => (
                  <li key={j} className="text-sm text-cream/70 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                    {li}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- COMPARISON SLIDE ----
function renderComparison(content: ComparisonSlideContent) {
  const variantStyles = {
    positive: 'border-green-500/30 bg-green-500/5',
    negative: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-cream/20 bg-cream/5',
  }

  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-8">{content.heading}</h2>
      {content.description && <p className="text-cream/60 mb-6">{content.description}</p>}
      <div className="grid md:grid-cols-2 gap-6">
        {[content.left, content.right].map((col, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${variantStyles[col.variant]}`}>
            <h3 className="text-xl font-semibold text-cream mb-4">{col.title}</h3>
            <ul className="space-y-2">
              {col.items.map((item: string, j: number) => (
                <li key={j} className="text-sm text-cream/70 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-cream/40 rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {col.footer && <p className="mt-4 text-xs text-cream/50 italic border-t border-cream/10 pt-3">{col.footer}</p>}
          </div>
        ))}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- TIMELINE SLIDE ----
// (Note: The interactive timeline with expandable items is handled by the custom 'TimelineSlide' component.
//  This renders a basic static timeline for the standard 'timeline' type.)
function renderTimeline(content: TimelineSlideContent) {
  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-8">{content.heading}</h2>
      <div className="space-y-6">
        {content.items.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-sage rounded-full" />
              {i < content.items.length - 1 && <div className="w-0.5 flex-1 bg-sage/30 mt-1" />}
            </div>
            <div className="pb-6">
              <div className="text-xs text-sage-bright font-medium">{item.date}</div>
              <h3 className="text-lg font-semibold text-cream mt-1">{item.label}</h3>
              <p className="text-sm text-cream/60 mt-1">{item.description}</p>
              {item.metrics && item.metrics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.metrics.map((m, j) => (
                    <span key={j} className="text-xs bg-sage/15 text-sage-bright px-2 py-0.5 rounded-full">{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- LIST SLIDE ----
function renderList(content: ListSlideContent) {
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{content.heading}</h2>
      {content.description && <p className="text-cream/60 mb-6">{content.description}</p>}
      <div className="space-y-6">
        {content.groups.map((group, i) => (
          <div key={i}>
            {group.title && <h3 className="text-lg font-semibold text-cream mb-3">{group.title}</h3>}
            <ul className="space-y-2">
              {group.items.map((item, j) => (
                <li key={j} className="text-sm text-cream/70 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                  <div>
                    <span>{item.text}</span>
                    {item.subtext && <span className="block text-xs text-cream/50 mt-0.5">{item.subtext}</span>}
                  </div>
                </li>
              ))}
            </ul>
            {group.footer && <p className="text-xs text-cream/50 mt-2 italic">{group.footer}</p>}
          </div>
        ))}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- FRAMEWORK SLIDE ----
function renderFramework(content: FrameworkSlideContent) {
  const isHorizontal = content.layout === 'horizontal'

  if (isHorizontal) {
    const count = content.levels.length
    // Chevron clip: flat left for first, indented left for middle/last;
    // pointed right for all but last; flat right for last.
    const buildClip = (i: number) => {
      const isFirst = i === 0
      const isLast = i === count - 1
      const indent = 18 // px
      const left = isFirst ? '0 0' : `${indent}px 0`
      const topRight = isLast ? 'calc(100% - 0px) 0' : `calc(100% - ${indent}px) 0`
      const rightMid = isLast ? '100% 50%' : '100% 50%'
      const bottomRight = isLast ? 'calc(100% - 0px) 100%' : `calc(100% - ${indent}px) 100%`
      const bottomLeft = isFirst ? '0 100%' : `${indent}px 100%`
      const leftMid = isFirst ? '0 50%' : `0 50%`
      return `polygon(${left}, ${topRight}, ${rightMid}, ${bottomRight}, ${bottomLeft}, ${leftMid})`
    }

    return (
      <div className="flex flex-col justify-center">
        {content.sectionLabel && (
          <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
        )}
        <h2 className="text-2xl md:text-3xl font-serif font-light text-cream mb-3">{content.heading}</h2>
        {content.description && <p className="text-cream/60 text-sm mb-5 leading-relaxed">{content.description}</p>}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {content.levels.map((level, i) => {
            const isFirst = i === 0
            const isLast = i === count - 1
            return (
              <div
                key={i}
                className="relative bg-sage/10 flex flex-col"
                style={{
                  clipPath: buildClip(i),
                  paddingLeft: isFirst ? '1rem' : '1.75rem',
                  paddingRight: isLast ? '1rem' : '1.75rem',
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-sage-bright text-void flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {level.level}
                  </span>
                  {level.badge && (
                    <span className="text-[10px] bg-cream/10 text-sage-bright px-2 py-0.5 rounded-full whitespace-nowrap">
                      {level.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-cream mb-1.5 leading-tight">{level.title}</h3>
                <p className="text-xs text-cream/70 leading-relaxed flex-1">{level.description}</p>
                {level.details?.outcome && (
                  <div className="mt-2.5 bg-void/30 rounded-md p-2 border-l-2 border-sage-bright">
                    <span className="text-[10px] font-semibold text-sage-bright uppercase tracking-wide">Outcome</span>
                    <p className="text-xs text-cream/80 mt-0.5 leading-snug">{level.details.outcome}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{content.heading}</h2>
      {content.description && <p className="text-cream/60 mb-6">{content.description}</p>}
      <div className="space-y-4">
        {content.levels.map((level, i) => (
          <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-sage/20 text-sage-bright flex items-center justify-center text-sm font-bold">
                {level.level}
              </span>
              <h3 className="text-lg font-semibold text-cream">{level.title}</h3>
              {level.badge && (
                <span className="ml-auto text-xs bg-sage/15 text-sage-bright px-2.5 py-1 rounded-full">{level.badge}</span>
              )}
            </div>
            <p className="text-sm text-cream/70">{level.description}</p>
            {level.details && (
              <div className="mt-3 grid md:grid-cols-3 gap-3 text-xs">
                {level.details.whenToUse && (
                  <div className="bg-cream/5 rounded-lg p-3">
                    <span className="font-semibold text-sage-bright">When to use:</span>
                    <p className="text-cream/60 mt-1">{level.details.whenToUse}</p>
                  </div>
                )}
                {level.details.risk && (
                  <div className="bg-cream/5 rounded-lg p-3">
                    <span className="font-semibold text-amber-400">Risk:</span>
                    <p className="text-cream/60 mt-1">{level.details.risk}</p>
                  </div>
                )}
                {level.details.outcome && (
                  <div className="bg-cream/5 rounded-lg p-3">
                    <span className="font-semibold text-helix-cyan">Outcome:</span>
                    <p className="text-cream/60 mt-1">{level.details.outcome}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- METRICS SLIDE ----
function renderMetrics(content: MetricsSlideContent) {
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{content.heading}</h2>
      {content.description && <p className="text-cream/60 mb-6">{content.description}</p>}
      <div className="space-y-4">
        {content.kpis.map((kpi, i) => (
          <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              {kpi.icon && <IconComponent name={kpi.icon} className="w-6 h-6 text-sage-bright mt-0.5" />}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-cream">{kpi.title}</h3>
                <p className="text-sm text-cream/60 mt-1">{kpi.metric}</p>
                <div className="mt-2">
                  {(Array.isArray(kpi.target) ? kpi.target : [kpi.target]).map((t: string, j: number) => (
                    <p key={j} className="text-sm text-sage-bright flex items-start gap-2 mt-1">
                      <span className="w-1.5 h-1.5 mt-1.5 bg-sage-bright rounded-full flex-shrink-0" />
                      {t}
                    </p>
                  ))}
                </div>
                {kpi.marketAnchor && (
                  <p className="text-xs text-cream/40 mt-3 italic">{kpi.marketAnchor}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- CASE STUDY SLIDE ----
function renderCaseStudy(content: CaseStudySlideContent) {
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{content.heading}</h2>
      {content.metrics && content.metrics.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {content.metrics.map((m: MetricCard, i: number) => (
            <div key={i} className="bg-sage/10 border border-sage/30 rounded-xl p-5 text-center">
              <div className="text-3xl font-serif font-light text-sage-bright">{m.value}</div>
              <div className="text-sm text-cream/80 mt-1">{m.label}</div>
              {m.sublabel && <div className="text-xs text-cream/50 mt-1">{m.sublabel}</div>}
              {m.source && <div className="text-[10px] text-cream/30 mt-2">{m.source}</div>}
            </div>
          ))}
        </div>
      )}
      {content.sections && content.sections.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {content.sections.map((section: GridItem, i: number) => (
            <div key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-cream mb-3">{section.title}</h3>
              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item: string, j: number) => (
                    <li key={j} className="text-sm text-cream/70 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 mt-1.5 bg-sage/60 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {content.anecdote && (
        <div className="bg-cream/5 border border-cream/10 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-sage-bright mb-1">{content.anecdote.label}</p>
          <p className="text-sm text-cream/70">{content.anecdote.text}</p>
        </div>
      )}
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- SOURCES SLIDE ----
function renderSources(content: SourcesSlideContent) {
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-8">{content.heading}</h2>
      <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
        {content.sections.map((section, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold text-cream mb-3">{section.title}</h3>
            <ol start={section.startNumber || 1} className="space-y-2 list-decimal list-inside">
              {section.items.map((item, j) => (
                <li key={j} className="text-sm text-cream/60">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sage-bright hover:text-sage underline">
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- TABLE SLIDE ----
function renderTable(content: TableSlideContent) {
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{content.heading}</h2>
      {content.description && <p className="text-cream/60 mb-6">{content.description}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-sage/40">
              {content.headers.map((h: string, i: number) => (
                <th key={i} className="py-3 px-4 text-sm font-semibold text-cream/90" style={content.columnWidths?.[i] ? { width: content.columnWidths[i] } : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row: string[], i: number) => (
              <tr key={i} className="border-b border-cream/10">
                {row.map((cell: string, j: number) => (
                  <td
                    key={j}
                    className={`py-3 px-4 text-sm ${
                      j === 0 && content.highlightFirstColumn
                        ? 'font-medium text-cream'
                        : 'text-cream/60'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- FUNNEL SLIDE ----
function renderFunnel(content: FunnelSlideContent) {
  const totalStages = content.stages.length
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{content.heading}</h2>
      {content.description && <p className="text-cream/60 text-base leading-relaxed mb-6 max-w-3xl">{content.description}</p>}
      <div className="relative flex flex-col items-center gap-0">
        {content.inputLabel && (
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-3">{content.inputLabel}</div>
        )}
        {content.stages.map((stage, i) => {
          const widthPct = 100 - (i * (60 / totalStages))
          const opacity = 0.08 + (i * 0.04)
          return (
            <div key={i} className="relative w-full flex flex-col items-center">
              {i > 0 && (
                <div className="w-0.5 h-3 bg-sage/30" />
              )}
              <div
                className="border border-sage/30 rounded-xl p-4 transition-all"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: `rgba(107, 142, 111, ${opacity})`,
                }}
              >
                <div className="flex items-start gap-3">
                  {stage.icon && <IconComponent name={stage.icon} className="w-5 h-5 text-sage-bright mt-0.5 flex-shrink-0" />}
                  <div>
                    <h3 className="text-base font-semibold text-cream">{stage.title}</h3>
                    <p className="text-sm text-cream/60 mt-1 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {content.outputLabel && (
          <>
            <div className="w-0.5 h-3 bg-sage/30" />
            <div className="px-4 py-2 bg-sage/20 border border-sage/40 rounded-lg">
              <span className="text-sm font-semibold text-sage-bright">{content.outputLabel}</span>
            </div>
          </>
        )}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- SPECTRUM SLIDE ----
function renderSpectrum(content: SpectrumSlideContent) {
  const totalCards = content.cards.length
  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{content.heading}</h2>
      {content.description && <p className="text-cream/60 text-base leading-relaxed mb-6 max-w-3xl">{content.description}</p>}
      {(content.leftLabel || content.rightLabel) && (
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-xs uppercase tracking-wider text-cream/40">{content.leftLabel}</span>
          <div className="flex-1 mx-4 h-px bg-gradient-to-r from-cream/10 via-cream/20 to-cream/40" />
          <span className="text-xs uppercase tracking-wider text-cream/40">{content.rightLabel}</span>
        </div>
      )}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(totalCards, 5)}, 1fr)` }}>
        {content.cards.map((card, i) => {
          const intensity = 0.05 + (i * (0.15 / Math.max(totalCards - 1, 1)))
          const borderIntensity = 0.15 + (i * (0.35 / Math.max(totalCards - 1, 1)))
          return (
            <div
              key={i}
              className="rounded-xl p-4 transition-all"
              style={{
                backgroundColor: `rgba(107, 142, 111, ${intensity})`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `rgba(107, 142, 111, ${borderIntensity})`,
              }}
            >
              {card.icon && <IconComponent name={card.icon} className="w-5 h-5 text-sage-bright mb-2" />}
              <h3 className="text-sm font-semibold text-cream mb-1.5">{card.title}</h3>
              <p className="text-xs text-cream/60 leading-relaxed">{card.description}</p>
            </div>
          )
        })}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- CHART SLIDE ----
function renderChart(content: ChartSlideContent) {
  const lineColors: Record<string, string> = {
    sage: '#6B8E6F',
    taupe: '#A89685',
    gold: '#D4AF37',
    red: '#ef4444',
    green: '#22c55e',
  }

  // Generate SVG path based on line style
  function getPath(style: string, index: number): string {
    const yBase = index === 0 ? 20 : 50
    switch (style) {
      case 'exponential':
        return `M 40 ${180 - yBase} Q 200 ${175 - yBase} 300 ${160 - yBase} Q 400 ${130 - yBase} 500 ${60 - yBase} Q 550 ${20 - yBase} 580 ${10 - yBase}`
      case 'staircase':
        return `M 40 ${180 - yBase} L 120 ${180 - yBase} L 120 ${155 - yBase} L 220 ${155 - yBase} L 220 ${125 - yBase} L 340 ${125 - yBase} L 340 ${85 - yBase} L 460 ${85 - yBase} L 460 ${40 - yBase} L 580 ${40 - yBase}`
      case 'flat':
        return `M 40 ${155 - yBase} L 580 ${140 - yBase}`
      case 'linear':
        return `M 40 ${180 - yBase} L 580 ${60 - yBase}`
      default:
        return `M 40 ${180 - yBase} L 580 ${60 - yBase}`
    }
  }

  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{content.heading}</h2>
      {content.description && <p className="text-cream/60 text-base leading-relaxed mb-4 max-w-3xl">{content.description}</p>}
      <div className="relative bg-cream/3 border border-cream/10 rounded-2xl p-6">
        {/* Y-axis label */}
        {content.yLabel && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-cream/30 whitespace-nowrap">{content.yLabel}</div>
        )}
        {/* SVG Chart */}
        <svg viewBox="0 0 620 200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          <line x1="40" y1="180" x2="580" y2="180" stroke="rgba(245,244,240,0.1)" strokeWidth="1" />
          <line x1="40" y1="130" x2="580" y2="130" stroke="rgba(245,244,240,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="80" x2="580" y2="80" stroke="rgba(245,244,240,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="30" x2="580" y2="30" stroke="rgba(245,244,240,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          {/* Lines */}
          {content.lines.map((line, i) => (
            <path
              key={i}
              d={getPath(line.style, i)}
              fill="none"
              stroke={lineColors[line.color || 'sage']}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={0.9}
            />
          ))}
          {/* Gap annotation */}
          {content.gapAnnotation && content.lines.length >= 2 && (
            <>
              <line x1="480" y1="45" x2="480" y2="120" stroke="rgba(245,244,240,0.3)" strokeWidth="1" strokeDasharray="3 3" />
              <text x="490" y="85" fill="rgba(245,244,240,0.5)" fontSize="9" fontStyle="italic">{content.gapAnnotation}</text>
            </>
          )}
        </svg>
        {/* Legend */}
        <div className="flex items-center gap-6 mt-3 justify-center">
          {content.lines.map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded" style={{ backgroundColor: lineColors[line.color || 'sage'] }} />
              <span className="text-xs text-cream/50">{line.label}</span>
            </div>
          ))}
        </div>
        {/* X-axis label */}
        {content.xLabel && (
          <div className="text-center mt-2 text-[10px] text-cream/30">{content.xLabel}</div>
        )}
        {/* Zone labels */}
        {content.zones && content.zones.length > 0 && (
          <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: `repeat(${content.zones.length}, 1fr)` }}>
            {content.zones.map((zone, i) => (
              <div key={i} className="text-center">
                <div className="text-xs font-semibold text-sage-bright">{zone.label}</div>
                {zone.sublabel && <div className="text-[10px] text-cream/40 mt-0.5">{zone.sublabel}</div>}
                {zone.description && <div className="text-[10px] text-cream/50 mt-1 leading-relaxed">{zone.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- VENN SLIDE ----
function renderVenn(content: VennSlideContent) {
  const circleColors: Record<string, { bg: string; border: string; text: string }> = {
    sage: { bg: 'rgba(107, 142, 111, 0.15)', border: 'rgba(107, 142, 111, 0.4)', text: 'text-sage-bright' },
    taupe: { bg: 'rgba(168, 150, 133, 0.15)', border: 'rgba(168, 150, 133, 0.4)', text: 'text-taupe-light' },
    gold: { bg: 'rgba(212, 175, 55, 0.15)', border: 'rgba(212, 175, 55, 0.4)', text: 'text-gold-light' },
    purple: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: 'text-purple-400' },
    green: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: 'text-green-400' },
  }
  const defaultColors = ['sage', 'taupe', 'gold', 'purple']

  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-3">{content.heading}</h2>
      {content.description && <p className="text-cream/60 text-base leading-relaxed mb-6 max-w-3xl">{content.description}</p>}
      <div className="relative flex items-center justify-center py-6">
        {/* Visual circles representation */}
        <div className="relative w-full max-w-lg aspect-square">
          {content.circles.map((circle, i) => {
            const colorKey = circle.color || defaultColors[i % defaultColors.length]
            const colors = circleColors[colorKey] || circleColors.sage
            const positions = [
              { top: '5%', left: '15%' },
              { top: '5%', right: '15%' },
              { bottom: '5%', left: '15%' },
              { bottom: '5%', right: '15%' },
            ]
            const pos = positions[i % positions.length]
            return (
              <div
                key={i}
                className="absolute w-[55%] aspect-square rounded-full flex items-center justify-center p-6"
                style={{
                  backgroundColor: colors.bg,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: colors.border,
                  ...pos,
                }}
              >
                <div className="text-center">
                  {circle.icon && <IconComponent name={circle.icon} className={`w-5 h-5 mx-auto mb-1.5 ${colors.text}`} />}
                  <div className={`text-xs font-semibold ${colors.text}`}>{circle.label}</div>
                  <div className="text-[10px] text-cream/50 mt-1 leading-relaxed max-w-[120px]">{circle.description}</div>
                </div>
              </div>
            )
          })}
          {/* Center intersection label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-sage/20 border border-sage/40 rounded-lg px-3 py-2">
            <span className="text-xs font-semibold text-sage-bright whitespace-nowrap">{content.centerLabel}</span>
          </div>
        </div>
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- QUOTES SLIDE ----
function renderQuotes(content: QuotesSlideContent) {
  const variantStyles = {
    positive: { bubble: 'border-green-500/20 bg-green-500/5', accent: 'text-green-400' },
    negative: { bubble: 'border-red-500/20 bg-red-500/5', accent: 'text-red-400' },
    neutral: { bubble: 'border-cream/15 bg-cream/5', accent: 'text-cream/60' },
  }

  return (
    <div className="flex flex-col justify-center">
      {content.sectionLabel && (
        <div className="text-xs uppercase tracking-wider text-sage-bright mb-2">{content.sectionLabel}</div>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-6">{content.heading}</h2>
      {content.description && <p className="text-cream/60 mb-6">{content.description}</p>}
      <div className={`grid gap-6 ${content.columns.length === 2 ? 'md:grid-cols-2' : content.columns.length === 3 ? 'md:grid-cols-3' : 'grid-cols-1'}`}>
        {content.columns.map((col, i) => {
          const styles = variantStyles[col.variant]
          return (
            <div key={i}>
              <h3 className="text-base font-semibold text-cream mb-1">{col.title}</h3>
              {col.headerNote && <p className="text-[10px] text-cream/30 italic mb-3">{col.headerNote}</p>}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {col.quotes.map((quote, j) => (
                  <div key={j} className={`rounded-lg border p-3 ${styles.bubble}`}>
                    <p className="text-xs text-cream/70 leading-relaxed italic">{quote}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {content.insightBox && <InsightBox label={content.insightBox.label} text={content.insightBox.text} />}
    </div>
  )
}

// ---- MAIN: Convert SlideData to Slide ----
function renderSlideContent(
  slide: SlideData,
  customComponents?: CustomComponentRegistry
): React.ReactNode {
  const content = slide.content

  switch (content.type) {
    case 'title': return renderTitle(content)
    case 'text': return renderText(content)
    case 'grid': return renderGrid(content)
    case 'comparison': return renderComparison(content)
    case 'timeline': return renderTimeline(content)
    case 'list': return renderList(content)
    case 'framework': return renderFramework(content)
    case 'metrics': return renderMetrics(content)
    case 'case-study': return renderCaseStudy(content)
    case 'sources': return renderSources(content)
    case 'table': return renderTable(content)
    case 'funnel': return renderFunnel(content)
    case 'spectrum': return renderSpectrum(content)
    case 'chart': return renderChart(content)
    case 'venn': return renderVenn(content)
    case 'quotes': return renderQuotes(content)
    case 'custom': {
      if (customComponents && content.componentId in customComponents) {
        const Component = customComponents[content.componentId]
        return <Component {...(content.props || {})} />
      }
      return (
        <div className="flex items-center justify-center">
          <p className="text-cream/40">Custom component &quot;{content.componentId}&quot; not registered</p>
        </div>
      )
    }
    default:
      return (
        <div className="flex items-center justify-center">
          <p className="text-cream/40">Unknown slide type</p>
        </div>
      )
  }
}

/**
 * Convert SlideData[] into Slide[] for PresentationLayout
 */
export function renderSlides(
  slides: SlideData[],
  customComponents?: CustomComponentRegistry
): Slide[] {
  return slides.map(slide => ({
    id: slide.id,
    title: slide.title,
    content: renderSlideContent(slide, customComponents),
  }))
}
