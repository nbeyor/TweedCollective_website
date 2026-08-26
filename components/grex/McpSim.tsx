'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'

import { GREX_BRAND } from '@/lib/grex/brand'
import { getScenario } from '@/lib/grex/scenarios'
import { countClaims, type VerificationResult } from '@/lib/grex/types'
import { SimTab } from './SimChrome'
import { useVerification } from './useVerification'

const SCENARIO = getScenario('mcp-ai-answer')!

type Mode = 'scenario' | 'paste'

function toolResultJson(result: VerificationResult, reportHref: string | null) {
  const counts = countClaims(result.claims)
  if (result.score.special === 'NO_VERIFIABLE_CLAIMS') {
    return JSON.stringify({ status: 'NO_VERIFIABLE_CLAIMS' }, null, 2)
  }
  return JSON.stringify(
    {
      score: result.score.value,
      verifiable_claims: counts.verifiable,
      supported: counts.supported,
      contradicted: counts.contradicted,
      insufficient_evidence: counts.insufficient,
      verification_url: reportHref ?? `/clients/grex/report/${result.id}`,
    },
    null,
    2
  )
}

/**
 * Surface C — MCP. An agent transcript showing the ambient pattern: the host
 * agent drafts a factual answer, calls verify_facts before presenting it,
 * and cites the GREX score alongside the response.
 */
export function McpSim() {
  const [mode, setMode] = useState<Mode>('scenario')
  const [started, setStarted] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const { run, runCanned, runLive, reset } = useVerification()

  const scenarioContent = SCENARIO.content.kind === 'agent' ? SCENARIO.content : null
  const userPrompt =
    mode === 'scenario' ? scenarioContent!.userPrompt : 'Verify this draft answer before I use it.'
  const draftAnswer = mode === 'scenario' ? scenarioContent!.assistantAnswer : pasteText

  const start = () => {
    setStarted(true)
    if (mode === 'scenario') runCanned(SCENARIO)
    else void runLive('mcp', pasteText)
  }
  const restart = () => {
    setStarted(false)
    reset()
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setStarted(false)
    reset()
  }

  const finalMessage = (() => {
    if (!run.result) return null
    const r = run.result
    if (r.score.special === 'NO_VERIFIABLE_CLAIMS') {
      return `${GREX_BRAND.name} found no externally verifiable claims in this content, so there's nothing to independently confirm — presenting as drafted.`
    }
    const counts = countClaims(r.claims)
    const caveats: string[] = []
    if (counts.contradicted > 0)
      caveats.push(
        `${counts.contradicted} ${counts.contradicted === 1 ? 'claim is' : 'claims are'} contradicted by the evidence — I've flagged ${counts.contradicted === 1 ? 'it' : 'them'} below rather than presenting ${counts.contradicted === 1 ? 'it' : 'them'} as fact`
      )
    if (counts.insufficient > 0)
      caveats.push(
        `${counts.insufficient} couldn't be verified against public sources and should be treated as unconfirmed`
      )
    return `Independent verification: ${GREX_BRAND.name} scored this answer ${r.score.value}/100 (${r.score.label.toLowerCase()}). ${counts.supported} of ${counts.verifiable} checked claims are supported${caveats.length ? '; ' + caveats.join('; ') : ''}. Full evidence at the verification link.`
  })()

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <SimTab active={mode === 'scenario'} onClick={() => switchMode('scenario')}>
          AI diligence answer
        </SimTab>
        <SimTab active={mode === 'paste'} onClick={() => switchMode('paste')}>
          Verify your own answer · live
        </SimTab>
      </div>

      <div
        className="p-5 sm:p-7"
        style={{
          background: 'var(--grex-surface)',
          border: '1px solid var(--grex-border)',
          borderRadius: 12,
        }}
      >
        {mode === 'paste' && !started && (
          <div className="mb-5">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={5}
              maxLength={6000}
              placeholder="Paste an AI-generated factual answer (or any factual paragraph) to run through verify_facts…"
              className="w-full p-3 text-[13.5px] leading-relaxed outline-none resize-y"
              style={{
                background: 'var(--grex-surface-raised)',
                border: '1px solid var(--grex-border)',
                borderRadius: 8,
                color: 'var(--grex-ink)',
              }}
            />
          </div>
        )}

        {!started ? (
          <button
            onClick={start}
            disabled={mode === 'paste' && pasteText.trim().length < 40}
            className="px-5 py-2 text-[13.5px] font-medium disabled:opacity-50"
            style={{
              background: 'var(--grex-accent)',
              color: 'var(--grex-accent-ink)',
              borderRadius: 'var(--grex-radius-chip)',
            }}
          >
            {mode === 'scenario' ? 'Play the exchange' : 'Run verify_facts · live'}
          </button>
        ) : (
          <div className="space-y-4">
            {/* User turn */}
            <Bubble role="user">{userPrompt}</Bubble>

            {/* Assistant drafts, then verifies */}
            <Bubble role="assistant">
              <p className="mb-2">{draftAnswer}</p>
              <p className="text-[12px] italic" style={{ color: 'var(--grex-muted)' }}>
                This response contains externally verifiable factual claims — calling{' '}
                <code style={{ fontFamily: 'var(--grex-font-mono)' }}>verify_facts</code> before
                presenting it.
              </p>
            </Bubble>

            {/* Tool call */}
            <ToolBlock
              title={`verify_facts ${run.running ? '· running' : '· complete'}`}
              running={run.running}
            >
              {JSON.stringify({ content: draftAnswer.slice(0, 120) + (draftAnswer.length > 120 ? '…' : '') }, null, 2)}
            </ToolBlock>

            {run.error && (
              <p className="text-[13px]" style={{ color: 'var(--grex-contradicted)' }}>
                {run.error}{' '}
                <button onClick={restart} className="underline" style={{ color: 'var(--grex-muted)' }}>
                  Reset
                </button>
              </p>
            )}

            {/* Tool result + final answer */}
            {run.result && (
              <>
                <ToolBlock title="verify_facts → result" running={false}>
                  {toolResultJson(run.result, run.reportHref)}
                </ToolBlock>
                <Bubble role="assistant">
                  <p>{finalMessage}</p>
                  {run.reportHref && (
                    <Link
                      href={run.reportHref}
                      className="inline-block mt-2 text-[12.5px] font-medium hover:underline"
                      style={{ color: 'var(--grex-accent)' }}
                    >
                      Open verification report →
                    </Link>
                  )}
                </Bubble>
                <button onClick={restart} className="text-[12.5px] underline" style={{ color: 'var(--grex-muted)' }}>
                  Replay
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed max-w-2xl" style={{ color: 'var(--grex-muted)' }}>
        The MCP server is a thin adapter over the same verification engine: agents call{' '}
        <code style={{ fontFamily: 'var(--grex-font-mono)' }}>verify_facts</code> explicitly, or
        their system instructions tell them to verify factual output before presenting it (the
        ambient pattern shown here). The structured result carries the score, the counts, and the
        same shared verification URL a human would see.
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
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

function ToolBlock({
  title,
  running,
  children,
}: {
  title: string
  running: boolean
  children: string
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div
        className="overflow-hidden"
        style={{
          border: '1px solid var(--grex-border)',
          borderRadius: 'var(--grex-radius-chip)',
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-medium"
          style={{ background: 'var(--grex-surface-raised)', color: 'var(--grex-muted)' }}
        >
          {running && (
            <motion.span
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--grex-accent)' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {title}
        </div>
        <pre
          className="px-3 py-2.5 text-[12px] leading-relaxed overflow-x-auto"
          style={{
            fontFamily: 'var(--grex-font-mono)',
            color: 'var(--grex-body)',
            background: 'var(--grex-surface)',
          }}
        >
          {children}
        </pre>
      </div>
    </motion.div>
  )
}
