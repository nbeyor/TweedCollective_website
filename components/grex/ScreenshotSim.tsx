'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'
import { getScenario } from '@/lib/grex/scenarios'
import { countClaims } from '@/lib/grex/types'
import { ProcessingIndicator } from './ProcessingIndicator'
import { ScoreBadge } from './ScoreBadge'
import { useVerification } from './useVerification'

const SCENARIO = getScenario('screenshot-text')!

// The normal phone flow, played back: screenshot → thumbnail → share → GREX.
type Phase = 'idle' | 'flash' | 'thumbnail' | 'sheet' | 'processing' | 'result'

/**
 * Surface B — the screenshot checker. No custom UI in the demo phone: the
 * user takes an ordinary screenshot, taps its thumbnail, shares to GREX from
 * the system share sheet, and gets a score. The image is processed
 * ephemerally; the score screen links to the shared explanation page.
 */
export function ScreenshotSim() {
  const [phase, setPhase] = useState<Phase>('idle')
  const { run, runCanned, reset } = useVerification()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  useEffect(() => {
    if (phase === 'processing' && run.state === 'COMPLETE' && run.result) {
      setPhase('result')
    }
  }, [phase, run.state, run.result])

  const play = () => {
    clearTimers()
    reset()
    setPhase('flash')
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))
    at(450, () => setPhase('thumbnail'))
    at(2100, () => setPhase('sheet'))
    at(4200, () => {
      setPhase('processing')
      runCanned(SCENARIO)
    })
  }

  const replay = () => {
    clearTimers()
    reset()
    setPhase('idle')
  }

  const messages = SCENARIO.content.kind === 'messages' ? SCENARIO.content : null
  if (!messages) return null

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Phone frame */}
      <div className="shrink-0 mx-auto lg:mx-0">
        <div
          className="relative overflow-hidden"
          style={{
            width: 330,
            height: 640,
            borderRadius: 44,
            border: '10px solid #14252C',
            background: 'var(--grex-surface)',
            boxShadow: '0 20px 60px rgba(14,42,51,0.25)',
          }}
        >
          {/* Messages app */}
          <div className="h-full flex flex-col">
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
          </div>

          {/* Screenshot flash */}
          <AnimatePresence>
            {phase === 'flash' && (
              <motion.div
                className="absolute inset-0"
                style={{ background: '#FFFFFF' }}
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            )}
          </AnimatePresence>

          {/* Screenshot thumbnail (iOS-style, bottom-left) with share affordance */}
          <AnimatePresence>
            {(phase === 'thumbnail' || phase === 'sheet') && (
              <motion.div
                className="absolute left-3 bottom-4"
                initial={{ opacity: 0, scale: 1.6, x: 40, y: -120 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: 74,
                    height: 148,
                    borderRadius: 10,
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
                    background: 'var(--grex-surface-raised)',
                  }}
                >
                  <div className="p-1.5 space-y-1">
                    {[26, 44, 38].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          height: h / 2.2,
                          width: '85%',
                          borderRadius: 4,
                          background: 'var(--grex-border)',
                        }}
                      />
                    ))}
                  </div>
                  {phase === 'thumbnail' && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(14,37,44,0.35)' }}
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[15px]"
                        style={{ background: '#FFFFFF', color: '#14252C' }}
                      >
                        ⬆︎
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share sheet, processing, and result overlays */}
          <AnimatePresence>
            {(phase === 'sheet' || phase === 'processing' || phase === 'result') && (
              <motion.div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ background: 'rgba(10,24,29,0.45)' }}
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
                    minHeight: phase === 'sheet' ? 190 : 360,
                  }}
                >
                  {phase === 'sheet' && (
                    <>
                      <p className="text-[12px] font-medium mb-4" style={{ color: 'var(--grex-muted)' }}>
                        Share screenshot to…
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
                        <div className="flex flex-col items-center gap-1.5">
                          <motion.span
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[15px] font-bold"
                            style={{ background: 'var(--grex-accent)', color: 'var(--grex-accent-ink)' }}
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                          >
                            G
                          </motion.span>
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--grex-ink)' }}>
                            {GREX_BRAND.name}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {phase === 'processing' && (
                    <div className="pt-6">
                      <p className="text-[15px] font-semibold mb-5" style={{ color: 'var(--grex-ink)' }}>
                        Checking…
                      </p>
                      <ProcessingIndicator state={run.state} />
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
                        onClick={replay}
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

        <div className="mt-4 flex justify-center">
          <button
            onClick={phase === 'idle' ? play : replay}
            className="px-5 py-2 text-[13px] font-medium"
            style={{
              background: phase === 'idle' ? 'var(--grex-accent)' : 'var(--grex-surface)',
              color: phase === 'idle' ? 'var(--grex-accent-ink)' : 'var(--grex-body)',
              border: '1px solid var(--grex-border)',
              borderRadius: 'var(--grex-radius-pill)',
            }}
          >
            {phase === 'idle' ? 'Play the flow' : 'Replay'}
          </button>
        </div>
      </div>

      <div className="max-w-md">
        <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'var(--grex-ink)' }}>
          Screenshot → Share → {GREX_BRAND.name}
        </h3>
        <p className="text-[13.5px] leading-relaxed mb-4" style={{ color: 'var(--grex-body)' }}>
          Nothing new to learn: the user takes an ordinary screenshot, taps its thumbnail, and{' '}
          {GREX_BRAND.name} sits in the system share sheet like any other app. That is the entire
          interface — no app to open first, no link to click, especially not a suspicious one.
        </p>
        <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
          Note what it is <em>not</em>: a scam detector. {GREX_BRAND.name} checks the factual claims
          the screenshot contains. In practice, that catches most scams anyway — their claims
          don&apos;t survive contact with evidence.
        </p>
      </div>
    </div>
  )
}
