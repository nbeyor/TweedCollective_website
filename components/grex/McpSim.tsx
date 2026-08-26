'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'
import { getScenario } from '@/lib/grex/scenarios'
import type { VerificationResult } from '@/lib/grex/types'
import { ScoreLine } from './ScoreLine'
import { useVerification } from './useVerification'

const SCENARIO = getScenario('mcp-ai-answer')!

interface Exchange {
  id: string
  question: string
  answer: string
  status: 'answering' | 'checking' | 'done'
  result?: VerificationResult
  reportHref?: string
  /** Muted note shown when GREX deliberately adds nothing (or on error). */
  annotation?: string
}

const CANNED_CREATIVE: { question: string; answer: string } = {
  question: 'Write a two-line tagline for our team offsite invite.',
  answer:
    'Two days to trade the inbox for the lake.\nCome sharpen the questions we’re too busy to ask.',
}

const NO_FACTS_NOTE = `No checkable facts in this response — ${GREX_BRAND.name} adds nothing.`

/**
 * Surface C — MCP. A chat player showing the integration as it should feel:
 * the agent answers normally, verify_facts runs between drafting and
 * presenting, and the entire product is one quiet score line at the end of
 * the response — present only when the response contained checkable facts.
 * The input at the bottom is live: your question gets a real answer, and the
 * answer (not the question) gets verified.
 */
export function McpSim() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [input, setInput] = useState('')
  const [liveId, setLiveId] = useState<string | null>(null)
  const { run, runAnswerVerify } = useVerification()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const seeded = useRef(false)

  // Seed playback: the factual exchange (line appears), then the creative
  // exchange (nothing appears) — the gate is the demo.
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    const scenarioContent = SCENARIO.content.kind === 'agent' ? SCENARIO.content : null
    if (!scenarioContent) return
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))

    at(300, () =>
      setExchanges([
        { id: 'canned-1', question: scenarioContent.userPrompt, answer: '', status: 'answering' },
      ])
    )
    at(1100, () =>
      setExchanges((xs) =>
        xs.map((x) =>
          x.id === 'canned-1' ? { ...x, answer: scenarioContent.assistantAnswer, status: 'checking' } : x
        )
      )
    )
    at(3600, () =>
      setExchanges((xs) =>
        xs.map((x) =>
          x.id === 'canned-1'
            ? {
                ...x,
                status: 'done',
                result: SCENARIO.result,
                reportHref: `/clients/grex/report/${SCENARIO.id}`,
              }
            : x
        )
      )
    )
    at(4600, () =>
      setExchanges((xs) => [
        ...xs,
        { id: 'canned-2', question: CANNED_CREATIVE.question, answer: '', status: 'answering' },
      ])
    )
    at(5400, () =>
      setExchanges((xs) =>
        xs.map((x) =>
          x.id === 'canned-2'
            ? { ...x, answer: CANNED_CREATIVE.answer, status: 'done', annotation: NO_FACTS_NOTE }
            : x
        )
      )
    )
    return () => {
      // Allow re-seeding after a strict-mode unmount/remount cycle.
      timers.current.forEach(clearTimeout)
      timers.current = []
      seeded.current = false
      setExchanges([])
    }
  }, [])

  // Sync the live run into its exchange.
  useEffect(() => {
    if (!liveId) return
    setExchanges((xs) =>
      xs.map((x) => {
        if (x.id !== liveId) return x
        if (run.error) {
          return { ...x, status: 'done', annotation: run.error }
        }
        if (run.result) {
          const noFacts = run.result.score.special === 'NO_VERIFIABLE_CLAIMS'
          return {
            ...x,
            answer: run.answerText || x.answer,
            status: 'done',
            result: noFacts ? undefined : run.result,
            reportHref: run.reportHref ?? undefined,
            annotation: noFacts ? NO_FACTS_NOTE : undefined,
          }
        }
        return {
          ...x,
          answer: run.answerText,
          status: run.answerDone ? 'checking' : 'answering',
        }
      })
    )
  }, [liveId, run])

  const ask = () => {
    const question = input.trim()
    if (question.length < 8 || run.running) return
    const id = `live-${Date.now()}`
    setExchanges((xs) => [...xs, { id, question, answer: '', status: 'answering' }])
    setLiveId(id)
    setInput('')
    void runAnswerVerify(question)
  }

  return (
    <div>
      <div
        className="p-5 sm:p-7"
        style={{
          background: 'var(--grex-surface)',
          border: '1px solid var(--grex-border)',
          borderRadius: 12,
        }}
      >
        <div className="space-y-5 min-h-[280px]">
          {exchanges.map((x) => (
            <div key={x.id} className="space-y-3">
              <Bubble role="user">{x.question}</Bubble>
              <Bubble role="assistant">
                {x.answer ? (
                  <p className="whitespace-pre-line">{x.answer}</p>
                ) : (
                  <ThinkingDots label="answering" />
                )}
                {x.status === 'checking' && (
                  <div className="mt-3 pt-2.5" style={{ borderTop: '1px solid var(--grex-border)' }}>
                    <ThinkingDots label="checking facts" />
                  </div>
                )}
                {x.status === 'done' && x.result && x.reportHref && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <ScoreLine result={x.result} reportHref={x.reportHref} />
                  </motion.div>
                )}
              </Bubble>
              {x.status === 'done' && x.annotation && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11.5px] italic pl-1"
                  style={{ color: 'var(--grex-muted)' }}
                >
                  {x.annotation}
                </motion.p>
              )}
            </div>
          ))}
        </div>

        {/* Live input — the connected part */}
        <div className="mt-6 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') ask()
            }}
            maxLength={500}
            placeholder="Ask a factual question — the answer gets verified live (30–90s)…"
            className="flex-1 px-3.5 py-2.5 text-[13.5px] outline-none"
            style={{
              background: 'var(--grex-surface-raised)',
              border: '1px solid var(--grex-border)',
              borderRadius: 'var(--grex-radius-chip)',
              color: 'var(--grex-ink)',
            }}
          />
          <button
            onClick={ask}
            disabled={run.running || input.trim().length < 8}
            className="px-5 py-2.5 text-[13.5px] font-medium disabled:opacity-50"
            style={{
              background: 'var(--grex-accent)',
              color: 'var(--grex-accent-ink)',
              borderRadius: 'var(--grex-radius-chip)',
            }}
          >
            Ask
          </button>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed max-w-2xl" style={{ color: 'var(--grex-muted)' }}>
        Behind the line: the host agent calls{' '}
        <code style={{ fontFamily: 'var(--grex-font-mono)' }}>verify_facts</code> between drafting
        and presenting. A response with checkable facts gets one quiet score line; a response
        without them gets nothing — the product never explains itself unprompted. The MCP server is
        a thin adapter over the same engine and the same shared report as every other surface.
      </p>
    </div>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const user = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={user ? 'flex justify-end' : 'flex justify-start'}
    >
      <div
        className="max-w-[85%] px-4 py-3 text-[13.5px] leading-relaxed"
        style={{
          background: user ? 'var(--grex-accent-soft)' : 'var(--grex-surface-raised)',
          border: '1px solid var(--grex-border)',
          borderRadius: user ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          color: 'var(--grex-ink)',
          minWidth: user ? undefined : 220,
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

function ThinkingDots({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--grex-muted)' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full"
          style={{ background: 'var(--grex-muted)' }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
      {label}
    </span>
  )
}
