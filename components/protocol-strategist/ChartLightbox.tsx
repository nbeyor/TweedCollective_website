'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

import { FixedChart } from './FixedCharts'
import type { Insight } from './InsightPanel'
import { wcg } from './wcgTheme'

/**
 * Full-screen presentation view for one insight. Fixed charts re-render at an
 * expanded height; generated charts re-render the same sandboxed srcDoc iframe
 * larger — the inline SVG scales to fill (svg { width:100%; height:auto }).
 * Closes on Esc, backdrop click, or the X.
 */
export function ChartLightbox({ insight, onClose }: { insight: Insight | null; onClose: () => void }) {
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
            <FixedChart panel={insight.panel} expanded />
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
