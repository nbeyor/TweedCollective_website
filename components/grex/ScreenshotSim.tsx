'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'
import { countClaims } from '@/lib/grex/types'
import { getScenario } from '@/lib/grex/scenarios'
import { ProcessingIndicator } from './ProcessingIndicator'
import { ScoreBadge } from './ScoreBadge'
import { SimTab } from './SimChrome'
import { useVerification } from './useVerification'

const SCENARIO = getScenario('screenshot-text')!

type Phase = 'viewing' | 'sheet' | 'processing' | 'result'
type Mode = 'scenario' | 'paste'

/**
 * Surface B — the screenshot checker. Screenshot → share sheet → GREX →
 * score. The screenshot is processed ephemerally and deleted; the score
 * screen links to the same shared explanation page as every surface.
 */
export function ScreenshotSim() {
  const [mode, setMode] = useState<Mode>('scenario')
  const [phase, setPhase] = useState<Phase>('viewing')
  const [pasteText, setPasteText] = useState('')
  const { run, runCanned, runLive, reset } = useVerification()

  useEffect(() => {
    if (phase === 'processing' && run.state === 'COMPLETE' && run.result) {
      setPhase('result')
    }
  }, [phase, run.state, run.result])

  useEffect(() => {
    setPhase('viewing')
    reset()
  }, [mode, reset])

  const share = () => setPhase('sheet')
  const tapGrex = () => {
    setPhase('processing')
    if (mode === 'scenario') runCanned(SCENARIO)
    else void runLive('screenshot', pasteText)
  }
  const done = () => {
    setPhase('viewing')
    reset()
  }

  const messages = SCENARIO.content.kind === 'messages' ? SCENARIO.content : null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <SimTab active={mode === 'scenario'} onClick={() => setMode('scenario')}>
          Suspicious text
        </SimTab>
        <SimTab active={mode === 'paste'} onClick={() => setMode('paste')}>
          Check your own text · live
        </SimTab>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Phone frame */}
        <div
          className="relative mx-auto lg:mx-0 overflow-hidden shrink-0"
          style={{
            width: 330,
            height: 640,
            borderRadius: 44,
            border: '10px solid #1A1D24',
            background: 'var(--grex-surface)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}
        >
          {/* Screen content */}
          <div className="h-full flex flex-col">
            {mode === 'scenario' && messages ? (
              <>
                <div
                  className="px-4 pt-6 pb-3 text-center"
                  style={{ background: 'var(--grex-surface-raised)', borderBottom: '1px solid var(--grex-border)' }}
                >
                  <p className="text-[13px] font-medium" style={{ color: 'var(--grex-ink)' }}>
                    {messages.sender}
                  </p>
                  <p className="text-[10.5px]" style={{ color: 'var(--grex-muted)' }}>
                    Unknown sender
                  </p>
                </div>
                <div className="flex-1 px-3.5 py-4 space-y-2 overflow-y-auto">
                  {messages.bubbles.map((b, i) => (
                    <div
                      key={i}
                      className="max-w-[85%] px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                      style={{
                        background: 'var(--grex-surface-raised)',
                        border: '1px solid var(--grex-border)',
                        borderRadius: '16px 16px 16px 4px',
                        color: 'var(--grex-ink)',
                      }}
                    >
                      {b}
                    </div>
                  ))}
                  <p className="text-[10px] pt-2" style={{ color: 'var(--grex-muted)' }}>
                    Fictional message generated for demonstration.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col px-4 pt-8 pb-4">
                <p className="text-[13px] font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
                  Your screenshot text
                </p>
                <p className="text-[11.5px] mb-3 leading-relaxed" style={{ color: 'var(--grex-muted)' }}>
                  Stand-in for OCR: paste the text a screenshot would contain, then share it to{' '}
                  {GREX_BRAND.name}. Runs the live pipeline with real web evidence.
                </p>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  maxLength={6000}
                  placeholder="Paste the text from a message, post, or product page…"
                  className="flex-1 w-full p-3 text-[13px] leading-relaxed outline-none resize-none"
                  style={{
                    background: 'var(--grex-surface-raised)',
                    border: '1px solid var(--grex-border)',
                    borderRadius: 12,
                    color: 'var(--grex-ink)',
                  }}
                />
              </div>
            )}

            {/* Share affordance */}
            <div className="px-4 pb-5 pt-3" style={{ borderTop: '1px solid var(--grex-border)' }}>
              <button
                onClick={share}
                disabled={phase !== 'viewing' || (mode === 'paste' && pasteText.trim().length < 40)}
                className="w-full py-2.5 text-[13.5px] font-medium disabled:opacity-40"
                style={{
                  background: 'var(--grex-surface-raised)',
                  border: '1px solid var(--grex-border)',
                  borderRadius: 12,
                  color: 'var(--grex-ink)',
                }}
              >
                ⬆︎ Share screenshot
              </button>
            </div>
          </div>

          {/* Share sheet + processing + result overlays */}
          <AnimatePresence>
            {phase !== 'viewing' && (
              <motion.div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ background: 'rgba(10,12,18,0.45)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                  className="px-4 pt-4 pb-6"
                  style={{
                    background: 'var(--grex-surface)',
                    borderRadius: '20px 20px 34px 34px',
                    minHeight: phase === 'sheet' ? 180 : 360,
                  }}
                >
                  {phase === 'sheet' && (
                    <>
                      <p className="text-[12px] font-medium mb-4" style={{ color: 'var(--grex-muted)' }}>
                        Share to…
                      </p>
                      <div className="flex gap-4">
                        {['Messages', 'Mail', 'Photos'].map((app) => (
                          <div key={app} className="flex flex-col items-center gap-1.5 opacity-45">
                            <span
                              className="w-12 h-12 rounded-2xl"
                              style={{ background: 'var(--grex-surface-raised)', border: '1px solid var(--grex-border)' }}
                            />
                            <span className="text-[10px]" style={{ color: 'var(--grex-body)' }}>
                              {app}
                            </span>
                          </div>
                        ))}
                        <button onClick={tapGrex} className="flex flex-col items-center gap-1.5">
                          <span
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[15px] font-bold"
                            style={{ background: 'var(--grex-accent)', color: 'var(--grex-accent-ink)' }}
                          >
                            G
                          </span>
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                            {GREX_BRAND.name}
                          </span>
                        </button>
                      </div>
                    </>
                  )}

                  {phase === 'processing' && (
                    <div className="pt-6">
                      <p className="text-[15px] font-semibold mb-5" style={{ color: 'var(--grex-ink)' }}>
                        Checking…
                      </p>
                      <ProcessingIndicator state={run.state} />
                      {run.error && (
                        <>
                          <p className="mt-5 text-[12.5px]" style={{ color: 'var(--grex-contradicted)' }}>
                            {run.error}
                          </p>
                          <button
                            onClick={done}
                            className="mt-3 text-[12.5px] underline"
                            style={{ color: 'var(--grex-muted)' }}
                          >
                            Close
                          </button>
                        </>
                      )}
                      <p className="mt-6 text-[11px] leading-relaxed" style={{ color: 'var(--grex-muted)' }}>
                        The screenshot is processed in memory and deleted. {GREX_BRAND.name} keeps
                        the claims, not your image.
                      </p>
                    </div>
                  )}

                  {phase === 'result' && run.result && (
                    <div className="pt-5">
                      <ScoreBadge score={run.result.score} size="panel" />
                      {!run.result.score.special && (
                        <p className="mt-3 text-[12.5px]" style={{ color: 'var(--grex-body)' }}>
                          {countClaims(run.result.claims).verifiable} factual claims checked
                        </p>
                      )}
                      {run.reportHref && (
                        <Link
                          href={run.reportHref}
                          className="mt-4 flex items-center justify-center w-full py-2.5 text-[13px] font-medium"
                          style={{
                            background: 'var(--grex-accent)',
                            color: 'var(--grex-accent-ink)',
                            borderRadius: 12,
                          }}
                        >
                          See why →
                        </Link>
                      )}
                      <button
                        onClick={done}
                        className="mt-2 w-full py-2 text-[12.5px]"
                        style={{ color: 'var(--grex-muted)' }}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-md">
          <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
            Screenshot → Share → {GREX_BRAND.name}
          </h3>
          <p className="text-[13.5px] leading-relaxed mb-4" style={{ color: 'var(--grex-body)' }}>
            The screenshot surface exists for user-triggered uncertainty: a forwarded message, a
            product claim, a headline that feels off. No app to open, no link to click — especially
            not a suspicious one. Share the screenshot and get a score.
          </p>
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
            Note what it is <em>not</em>: a scam detector. GREX checks the factual claims the
            screenshot contains. In practice, that catches most scams anyway — their claims
            don&apos;t survive contact with evidence.
          </p>
        </div>
      </div>
    </div>
  )
}
