'use client'

import React from 'react'
import type { Slide } from '@/components/presentation/PresentationLayout'
import type {
  SlideData, SlideContent, TitleSlideContent, TextSlideContent,
  GridSlideContent, ComparisonSlideContent, TimelineSlideContent,
  ListSlideContent, FrameworkSlideContent, MetricsSlideContent,
  CaseStudySlideContent, SourcesSlideContent, TableSlideContent,
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center max-w-3xl">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    <div className="min-h-[50vh] flex flex-col justify-center">
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
    case 'custom': {
      if (customComponents && content.componentId in customComponents) {
        const Component = customComponents[content.componentId]
        return <Component {...(content.props || {})} />
      }
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-cream/40">Custom component &quot;{content.componentId}&quot; not registered</p>
        </div>
      )
    }
    default:
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
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
