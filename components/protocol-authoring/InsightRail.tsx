'use client'

import React, { useEffect, useState } from 'react'
import { BarChart3, Maximize2, ShieldAlert, X } from 'lucide-react'

import { wcg } from '@/components/protocol-strategist/wcgTheme'
import type { ReviewFinding, ReviewRound } from '@/lib/protocol-authoring/tools'

import { AuthoringFixedChart, type PanelDescriptor } from './AuthoringCharts'
import { FindingsRoundCard } from './FindingsCards'

export interface GeneratedChart {
  id: string
  title: string
  html: string
  caption?: string | null
}

export type ChartInsight =
  | { kind: 'fixed'; key: string; panel: PanelDescriptor }
  | { kind: 'generated'; key: string; chart: GeneratedChart }

/**
 * The Foundry's right rail: charts and review findings, in two tabs. Chart
 * cards behave exactly like the strategist's insight panel (stack newest
 * first, expand to a lightbox); the Findings tab holds review-board rounds.
 * The rail auto-switches to whichever surface just received content, with the
 * other tab badging its count.
 */
export function InsightRail({
  insights,
  rounds,
  adoptedIds,
  lastEvent,
  onDiscussFinding,
  onAdoptFinding,
}: {
  insights: ChartInsight[]
  rounds: ReviewRound[]
  adoptedIds: Set<string>
  /** Bumps when new content lands: drives the auto-switch. */
  lastEvent: { surface: 'charts' | 'findings'; seq: number } | null
  onDiscussFinding: (f: ReviewFinding) => void
  onAdoptFinding: (f: ReviewFinding) => void
}) {
  const [tab, setTab] = useState<'charts' | 'findings'>('charts')
  const [expanded, setExpanded] = useState<ChartInsight | null>(null)

  useEffect(() => {
    if (lastEvent) setTab(lastEvent.surface)
  }, [lastEvent])

  const findingsCount = rounds.reduce((a, r) => a + r.findings.length, 0)

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex items-center gap-1 border-b px-3 py-2 shrink-0"
        style={{ background: wcg.surface, borderColor: wcg.border }}
      >
        <RailTab active={tab === 'charts'} onClick={() => setTab('charts')}>
          <BarChart3 className="w-3.5 h-3.5" /> Charts{insights.length ? ` (${insights.length})` : ''}
        </RailTab>
        <RailTab active={tab === 'findings'} onClick={() => setTab('findings')}>
          <ShieldAlert className="w-3.5 h-3.5" /> Findings{findingsCount ? ` (${findingsCount})` : ''}
        </RailTab>
      </div>

      {tab === 'charts' ? (
        insights.length ? (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {insights.map((it) => (
              <div key={it.key} className="relative group">
                <button
                  onClick={() => setExpanded(it)}
                  aria-label="Expand chart"
                  title="Expand"
                  className="absolute top-2.5 right-2.5 z-10 rounded-md p-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: wcg.surfaceMuted, color: wcg.muted, border: `1px solid ${wcg.border}` }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {it.kind === 'fixed' ? <AuthoringFixedChart panel={it.panel} /> : <GeneratedChartCard chart={it.chart} />}
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon={<BarChart3 className="w-8 h-8 mb-3" strokeWidth={1.3} />}
            text="Charts land here as you interrogate the draft — the eligibility funnel, power curves, burden profiles, cost buildups, and enrollment projections."
          />
        )
      ) : rounds.length ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {rounds.map((r, i) => (
            <FindingsRoundCard
              key={i}
              round={r}
              adoptedIds={adoptedIds}
              onDiscuss={onDiscussFinding}
              onAdopt={onAdoptFinding}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon={<ShieldAlert className="w-8 h-8 mb-3" strokeWidth={1.3} />}
          text="Convene the review board — full board or a single lens — and its findings file here: severity, the exact quote, the regulatory basis, and a proposed rewrite."
        />
      )}

      <Lightbox insight={expanded} onClose={() => setExpanded(null)} />
    </div>
  )
}

function RailTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors"
      style={{
        background: active ? wcg.surfaceMuted : 'transparent',
        color: active ? wcg.ink : wcg.muted,
      }}
    >
      {children}
    </button>
  )
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8" style={{ color: wcg.faint }}>
      {icon}
      <p className="text-[13px] leading-relaxed" style={{ color: wcg.muted }}>
        {text}
      </p>
    </div>
  )
}

function GeneratedChartCard({ chart }: { chart: GeneratedChart }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: wcg.surface, borderColor: wcg.border }}>
      <div className="px-4 pt-3">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.purple }}>
          Generated · this session
        </p>
      </div>
      <iframe
        title={chart.title}
        srcDoc={chart.html}
        sandbox=""
        className="w-full block border-0"
        style={{ height: 340 }}
      />
    </div>
  )
}

/** Full-screen view for one chart card. Esc, backdrop, or X to close. */
function Lightbox({ insight, onClose }: { insight: ChartInsight | null; onClose: () => void }) {
  useEffect(() => {
    if (!insight) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [insight, onClose])

  if (!insight) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(6, 23, 43, 0.62)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative rounded-2xl shadow-2xl overflow-y-auto"
        style={{ width: 'min(1100px, 94vw)', maxHeight: '90vh', background: wcg.page }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 rounded-lg p-1.5 transition-colors"
          style={{ background: wcg.surface, color: wcg.muted, border: `1px solid ${wcg.border}` }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-4 sm:p-6">
          {insight.kind === 'fixed' ? (
            <AuthoringFixedChart panel={insight.panel} expanded />
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ background: wcg.surface, borderColor: wcg.border }}>
              <div className="px-4 pt-3">
                <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.purple }}>
                  Generated · this session
                </p>
              </div>
              <iframe
                title={insight.chart.title}
                srcDoc={insight.chart.html}
                sandbox=""
                className="w-full block border-0"
                style={{ height: 'min(70vh, 640px)' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
