'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { getScenario } from '@/lib/grex/scenarios'
import { CompactSummary } from './CompactSummary'
import { ProcessingPill } from './ProcessingIndicator'
import { ScoreBadge } from './ScoreBadge'
import { useVerification } from './useVerification'

const SCENARIO = getScenario('function-health')!

/**
 * Surface A — the browser extension, simulated on a recreated snapshot of a
 * real marketing page. The user "browses"; GREX checks the page passively
 * and a floating score pill appears. The pill is the entire interface until
 * clicked; the explanation lives on the shared report page.
 */
export function BrowserSim() {
  const [panelOpen, setPanelOpen] = useState(false)
  const { run, runCanned } = useVerification()

  // Passive processing: landing on the page starts the check automatically.
  useEffect(() => {
    runCanned(SCENARIO)
  }, [runCanned])

  const site = SCENARIO.content.kind === 'site' ? SCENARIO.content : null
  if (!site) return null

  return (
    <div>
      {/* Browser chrome */}
      <div
        className="relative overflow-hidden"
        style={{
          border: '1px solid var(--grex-border)',
          borderRadius: 12,
          background: 'var(--grex-surface)',
          boxShadow: '0 12px 40px rgba(14,42,51,0.10)',
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: 'var(--grex-surface-raised)', borderBottom: '1px solid var(--grex-border)' }}
        >
          <div className="flex gap-1.5">
            {['#E8695A', '#E8B44E', '#5DBB63'].map((c) => (
              <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />
            ))}
          </div>
          <div
            className="flex-1 px-3 py-1 text-[12px] truncate"
            style={{
              background: 'var(--grex-surface)',
              border: '1px solid var(--grex-border)',
              borderRadius: 6,
              color: 'var(--grex-muted)',
            }}
          >
            🔒 {site.url}
          </div>
        </div>

        {/* Recreated marketing page. Styled as its own site, not GREX chrome. */}
        <div className="relative min-h-[480px] max-h-[580px] overflow-y-auto" style={{ background: '#FBFAF7' }}>
          <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: '1px solid #ECE8DF' }}>
            <span className="text-[17px] font-bold tracking-tight" style={{ color: '#1A1A18' }}>
              {site.brand}
            </span>
            <div className="flex gap-5">
              {site.nav.map((item) => (
                <span key={item} className="text-[12.5px]" style={{ color: '#6B675E' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="px-8 pt-12 pb-8 max-w-2xl">
            <h1
              className="text-[34px] leading-tight font-bold tracking-tight"
              style={{ color: '#1A1A18' }}
            >
              {site.hero.headline}
            </h1>
            <p className="mt-3 text-[15.5px] leading-relaxed" style={{ color: '#55524A' }}>
              {site.hero.sub}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span
                className="px-5 py-2.5 text-[13.5px] font-semibold rounded-full"
                style={{ background: '#1A1A18', color: '#FBFAF7' }}
              >
                Join Function
              </span>
              <span className="text-[13px] font-medium" style={{ color: '#55524A' }}>
                {site.priceLine}
              </span>
            </div>
          </div>

          <div className="px-8 pb-10 grid grid-cols-3 gap-4 max-w-2xl">
            {site.stats.map((s) => (
              <div key={s.label} className="pt-4" style={{ borderTop: '2px solid #1A1A18' }}>
                <p className="text-[24px] font-bold" style={{ color: '#1A1A18' }}>
                  {s.value}
                </p>
                <p className="text-[12px] leading-snug mt-1" style={{ color: '#6B675E' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <p className="px-8 pb-8 text-[10.5px]" style={{ color: '#9B978C' }}>
            {site.footnote}
          </p>

          {/* The floating GREX widget */}
          <div className="absolute bottom-5 right-5 flex flex-col items-end gap-3">
            <AnimatePresence>
              {panelOpen && run.result && run.reportHref && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  <CompactSummary result={run.result} reportHref={run.reportHref} />
                </motion.div>
              )}
            </AnimatePresence>
            {run.running ? (
              <ProcessingPill />
            ) : run.result ? (
              <button
                onClick={() => setPanelOpen((o) => !o)}
                aria-label="GREX score — open summary"
                className="transition-transform hover:scale-105"
              >
                <ScoreBadge score={run.result.score} size="pill" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed max-w-2xl" style={{ color: 'var(--grex-muted)' }}>
        The widget is intentionally unobtrusive: a number, nothing else, until you ask. Clicking it
        opens the compact summary; &ldquo;See why&rdquo; resolves to the shared explanation page
        every surface uses. Here the page&apos;s concrete claims mostly check out — the score says
        so quietly, without a single red flag where none is warranted.
      </p>
    </div>
  )
}
