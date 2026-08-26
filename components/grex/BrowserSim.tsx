'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { scenariosForSurface, type GrexScenario } from '@/lib/grex/scenarios'
import { CompactSummary } from './CompactSummary'
import { SimTab } from './SimChrome'
import { ProcessingPill } from './ProcessingIndicator'
import { ScoreBadge } from './ScoreBadge'
import { useVerification } from './useVerification'

const SCENARIOS = scenariosForSurface('browser')

type Mode = { kind: 'scenario'; scenario: GrexScenario } | { kind: 'paste' }

/**
 * Surface A — the browser extension, simulated. The user "browses"; GREX
 * checks the page passively and a floating score pill appears. The pill is
 * the entire interface until clicked; the explanation lives on the shared
 * report page.
 */
export function BrowserSim() {
  const [mode, setMode] = useState<Mode>({ kind: 'scenario', scenario: SCENARIOS[0] })
  const [panelOpen, setPanelOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const { run, runCanned, runLive, reset } = useVerification()

  // Passive processing: navigating to a page starts the check automatically.
  useEffect(() => {
    setPanelOpen(false)
    if (mode.kind === 'scenario') runCanned(mode.scenario)
    else reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode.kind === 'scenario' ? mode.scenario.id : 'paste'])

  const article =
    mode.kind === 'scenario' && mode.scenario.content.kind === 'article'
      ? mode.scenario.content
      : null

  const url =
    mode.kind === 'paste'
      ? 'grex.example/check-your-own'
      : `themeridianpost.example/${mode.kind === 'scenario' ? mode.scenario.id : ''}`

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {SCENARIOS.map((s) => (
          <SimTab
            key={s.id}
            active={mode.kind === 'scenario' && mode.scenario.id === s.id}
            onClick={() => setMode({ kind: 'scenario', scenario: s })}
          >
            {s.label}
          </SimTab>
        ))}
        <SimTab active={mode.kind === 'paste'} onClick={() => setMode({ kind: 'paste' })}>
          Check your own text · live
        </SimTab>
      </div>

      {/* Browser chrome */}
      <div
        className="relative overflow-hidden"
        style={{
          border: '1px solid var(--grex-border)',
          borderRadius: 12,
          background: 'var(--grex-surface)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
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
            {url}
          </div>
        </div>

        <div className="relative min-h-[460px] max-h-[560px] overflow-y-auto">
          {article ? (
            <article className="px-8 py-8 max-w-2xl mx-auto">
              <p
                className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3"
                style={{ color: 'var(--grex-contradicted)' }}
              >
                {article.outlet}
              </p>
              <h1
                className="text-[26px] leading-snug font-bold mb-2"
                style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}
              >
                {article.headline}
              </h1>
              <p className="text-[12.5px] mb-6" style={{ color: 'var(--grex-muted)' }}>
                {article.byline} · {article.date}
              </p>
              <div className="space-y-4">
                {article.paragraphs.map((p, i) => (
                  <p key={i} className="text-[15px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-8 text-[11px]" style={{ color: 'var(--grex-muted)' }}>
                Fictional article generated for demonstration.
              </p>
            </article>
          ) : (
            <div className="px-8 py-8 max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
                Paste anything you&apos;re reading
              </h2>
              <p className="text-[13px] mb-4" style={{ color: 'var(--grex-body)' }}>
                This mode runs the real GREX pipeline: claims are extracted and checked against live
                web evidence. Expect 30–90 seconds.
              </p>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={9}
                maxLength={6000}
                placeholder="Paste a paragraph or two of factual content…"
                className="w-full p-3 text-[14px] leading-relaxed outline-none resize-y"
                style={{
                  background: 'var(--grex-surface-raised)',
                  border: '1px solid var(--grex-border)',
                  borderRadius: 8,
                  color: 'var(--grex-ink)',
                }}
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => {
                    setPanelOpen(false)
                    void runLive('browser', pasteText)
                  }}
                  disabled={run.running || pasteText.trim().length < 40}
                  className="px-5 py-2 text-[13.5px] font-medium disabled:opacity-50"
                  style={{
                    background: 'var(--grex-accent)',
                    color: 'var(--grex-accent-ink)',
                    borderRadius: 'var(--grex-radius-chip)',
                  }}
                >
                  {run.running ? 'Checking…' : 'Check this page'}
                </button>
                {run.error && (
                  <p className="text-[12.5px]" style={{ color: 'var(--grex-contradicted)' }}>
                    {run.error}
                  </p>
                )}
              </div>
            </div>
          )}

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
        opens the compact summary; &ldquo;See why&rdquo; resolves to the same shared explanation
        page every surface uses. An em dash means the page contained nothing checkable — GREX never
        invents a score.
      </p>
    </div>
  )
}
