'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Loader2, RotateCcw, Send, Wrench } from 'lucide-react'

import { Markdown } from '@/components/protocol-strategist/Markdown'
import { wcg } from '@/components/protocol-strategist/wcgTheme'
import { AUTHORING_SUGGESTIONS } from '@/lib/protocol-authoring/library'
import type { ReviewFinding, ReviewRound } from '@/lib/protocol-authoring/tools'

import { InsightRail, type ChartInsight } from './InsightRail'
import { OutlinePanel, type ShippedDecision } from './OutlinePanel'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const TOOL_LABELS: Record<string, string> = {
  get_protocol_overview: 'Reading the protocol outline',
  get_protocol_section: 'Reading the draft',
  eligibility_funnel: 'Walking the eligibility funnel',
  power_analysis: 'Running the power analysis',
  patient_burden: 'Scoring the visit burden',
  country_viability: 'Rating the country footprint',
  regulatory_requirements: 'Sweeping regulatory requirements',
  enrollment_projection: 'Projecting the enrollment curve',
  file_review_findings: 'Filing review findings',
  draft_criteria_burden: 'Ranking criteria by screening burden',
  procedure_sensitivity: 'Running the sensitivity analysis',
  endpoint_timeline_sensitivity: 'Modelling endpoint timeline impact',
  trial_cost: 'Building the cost model',
  site_footprint: 'Building the site & country footprint',
  site_level_breakdown: 'Cutting the slip by site type',
  comparator_landscape: 'Placing the draft against comparators',
  amendment_risk_sweep: 'Sweeping amendment history',
  render_chart: 'Drawing a chart',
  ship_decision: 'Registering the decision in the log',
  describe_corpus: 'Reading the data dictionary',
  query_cohort: 'Querying comparator cohort',
  get_protocol: 'Pulling protocol detail',
  benchmark_protocol: 'Benchmarking against peers',
  analyze_criteria: 'Analyzing eligibility criteria',
  design_outcome_relationships: 'Measuring design–outcome relationships',
}

/** Shared width for everything in the chat column. */
const COL = 'max-w-3xl mx-auto'

const PANEL_MIN = 320
const PANEL_MAX = 720
const PANEL_KEY = 'foundry.panelWidth'
const DECISIONS_KEY = 'foundry.decisions.horizon-lung-301'

function loadStoredDecisions(): ShippedDecision[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(DECISIONS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function storeDecisions(decisions: ShippedDecision[]) {
  try {
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions))
  } catch {
    // Storage full or blocked — the on-page log still works for this session.
  }
}

export function FoundryWorkspace() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [reply, setReply] = useState('')
  const [thinking, setThinking] = useState(false)
  const [tools, setTools] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<ChartInsight[]>([])
  const [rounds, setRounds] = useState<ReviewRound[]>([])
  const [decisions, setDecisions] = useState<ShippedDecision[]>([])
  const [shipNotice, setShipNotice] = useState<string | null>(null)
  const [lastEvent, setLastEvent] = useState<{ surface: 'charts' | 'findings'; seq: number } | null>(null)

  // Resizable insight rail.
  const [panelWidth, setPanelWidth] = useState(420)
  const drag = useRef<{ startX: number; startW: number } | null>(null)

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const seq = useRef(0)

  useEffect(() => {
    setDecisions(loadStoredDecisions())
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, reply, tools])

  // Auto-grow the composer with its content, up to ~9 rows, then scroll inside.
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }, [input])

  useEffect(() => {
    const saved = Number(localStorage.getItem(PANEL_KEY))
    if (saved >= PANEL_MIN && saved <= PANEL_MAX) setPanelWidth(saved)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || streaming) return

      const next = [...messages, { role: 'user' as const, content: trimmed }]
      setMessages(next)
      setInput('')
      setReply('')
      setTools([])
      setError(null)
      setShipNotice(null)
      setStreaming(true)

      // Compact finding summaries so the model remembers its board across turns.
      const findingSummaries = rounds.flatMap((r) =>
        r.findings.map((f) => ({
          id: f.id,
          section_id: f.section_id,
          severity: f.severity,
          title: f.title,
          lens: f.lens,
        }))
      )

      let accumulated = ''
      try {
        const res = await fetch('/api/protocol-authoring', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: next, decisions, findings: findingSummaries }),
        })
        if (!res.ok || !res.body) {
          const detail = await res.text()
          throw new Error(detail.slice(0, 300) || `Request failed (${res.status})`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const frames = buffer.split('\n\n')
          buffer = frames.pop() ?? ''

          for (const frame of frames) {
            const line = frame.split('\n').find((l) => l.startsWith('data: '))
            if (!line) continue
            let evt: { type: string; [k: string]: unknown }
            try {
              evt = JSON.parse(line.slice(6))
            } catch {
              continue
            }

            switch (evt.type) {
              case 'thinking':
                setThinking(true)
                break
              case 'text':
                setThinking(false)
                accumulated += String(evt.text ?? '')
                setReply(accumulated)
                break
              case 'tool':
                setThinking(false)
                setTools((t) => [...t, String(evt.name)])
                break
              case 'panel': {
                const panel = evt.panel as { chart: string; data: Record<string, unknown> }
                seq.current += 1
                const freshKey = `p${seq.current}`
                // One card per fixed chart type: identical repeats are dropped,
                // changed data replaces the old card at the top.
                setInsights((prev) => {
                  const idx = prev.findIndex((it) => it.kind === 'fixed' && it.panel.chart === panel.chart)
                  if (idx === -1) return [{ kind: 'fixed', key: freshKey, panel }, ...prev]
                  const existing = prev[idx]
                  if (
                    existing.kind === 'fixed' &&
                    JSON.stringify(existing.panel.data) === JSON.stringify(panel.data)
                  ) {
                    return prev
                  }
                  return [
                    { kind: 'fixed', key: freshKey, panel },
                    ...prev.filter((_, i) => i !== idx),
                  ]
                })
                setLastEvent({ surface: 'charts', seq: seq.current })
                break
              }
              case 'chart': {
                seq.current += 1
                setInsights((prev) => [
                  {
                    kind: 'generated',
                    key: `g${seq.current}`,
                    chart: {
                      id: String(evt.id ?? seq.current),
                      title: String(evt.title ?? 'Chart'),
                      html: String(evt.html ?? ''),
                      caption: (evt.caption as string) ?? null,
                    },
                  },
                  ...prev,
                ])
                setLastEvent({ surface: 'charts', seq: seq.current })
                break
              }
              case 'findings': {
                const round = evt.round as ReviewRound | undefined
                if (round && Array.isArray(round.findings)) {
                  seq.current += 1
                  setRounds((prev) => [round, ...prev])
                  setLastEvent({ surface: 'findings', seq: seq.current })
                }
                break
              }
              case 'ship': {
                const entry = (evt.entry ?? {}) as ShippedDecision
                setDecisions((prev) => {
                  const next = [...prev, entry]
                  storeDecisions(next)
                  return next
                })
                setShipNotice(`Shipped “${entry.element_label}” — registered in the decision log.`)
                break
              }
              case 'error':
                setError(String(evt.error))
                break
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setThinking(false)
        setStreaming(false)
        if (accumulated) {
          setMessages((m) => [...m, { role: 'assistant', content: accumulated }])
          setReply('')
        }
      }
    },
    [messages, streaming, decisions, rounds]
  )

  const reset = useCallback(() => {
    if (streaming) return
    if (
      messages.length &&
      !window.confirm('Clear this conversation, its charts, and the findings board? The decision log is kept.')
    ) {
      return
    }
    setMessages([])
    setReply('')
    setTools([])
    setError(null)
    setInsights([])
    setRounds([])
    setShipNotice(null)
  }, [messages.length, streaming])

  const discussFinding = useCallback((f: ReviewFinding) => {
    setInput(
      `Let's talk through finding ${f.id} — "${f.title}" (${f.severity}, ${f.section_title}). What are my options, and what does each cost?`
    )
    inputRef.current?.focus()
  }, [])

  const adoptFinding = useCallback(
    (f: ReviewFinding) => {
      send(
        `Adopt review finding ${f.id} — "${f.title}". Apply the proposed rewrite to the draft and ship it as a decision with the finding's rationale and basis.`
      )
    },
    [send]
  )

  const startDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { startX: e.clientX, startW: panelWidth }
    },
    [panelWidth]
  )
  const moveDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const dx = drag.current.startX - e.clientX
    setPanelWidth(Math.min(PANEL_MAX, Math.max(PANEL_MIN, drag.current.startW + dx)))
  }, [])
  const endDrag = useCallback(() => {
    if (!drag.current) return
    drag.current = null
    setPanelWidth((w) => {
      localStorage.setItem(PANEL_KEY, String(w))
      return w
    })
  }, [])

  const allFindings = rounds.flatMap((r) => r.findings)
  const adoptedIds = new Set(decisions.map((d) => d.element_id))
  const empty = messages.length === 0

  return (
    <div
      className="h-full flex flex-col lg:flex-row"
      style={{ background: wcg.page, ['--panel-w' as string]: `${panelWidth}px` } as React.CSSProperties}
    >
      {/* Outline panel */}
      <aside
        className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r max-h-72 lg:max-h-none"
        style={{ background: wcg.surface, borderColor: wcg.border }}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 pt-4">
            <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
              Draft under authoring
            </p>
            <h2 className="text-[15px] font-semibold leading-snug" style={{ color: wcg.ink }}>
              HORIZON-Lung-301
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: wcg.muted }}>
              Phase III · 1L PD-L1-high NSCLC · N=600 · dual primary PFS/OS
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: wcg.faint }}>
              Meridian Oncology · MRD-2026-0301 · Draft v0.3
            </p>
          </div>
          <OutlinePanel
            findings={allFindings}
            decisions={decisions}
            streaming={streaming}
            onPickQuestion={(q) => {
              setInput(q)
              inputRef.current?.focus()
            }}
            onRun={send}
          />
        </div>
      </aside>

      {/* Chat */}
      <section className="flex-1 min-w-0 flex flex-col">
        <div
          className="border-b px-5 py-2 flex items-center justify-end gap-2 shrink-0"
          style={{ background: wcg.surface, borderColor: wcg.border }}
        >
          <button
            onClick={reset}
            disabled={streaming || (!messages.length && !insights.length && !rounds.length)}
            title="Clear the conversation, charts, and findings"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium disabled:opacity-40 transition-colors"
            style={{ background: wcg.surface, borderColor: wcg.borderStrong, color: wcg.body }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {empty && (
            <div className={`${COL} pt-4`}>
              <p className="text-[14px] leading-relaxed mb-5" style={{ color: wcg.body }}>
                The draft is loaded. Click a section to pressure-test it, run an analysis from the
                library, convene the review board — or start from a question below. Charts and
                findings land on the right.
              </p>
              <div className="space-y-2">
                {AUTHORING_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left px-4 py-3 rounded-lg border text-[13.5px] transition-colors"
                    style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.ink }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={COL}>
              {m.role === 'user' ? (
                <div className="flex justify-end">
                  <div
                    className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap"
                    style={{ background: wcg.navy, color: '#fff' }}
                  >
                    {m.content}
                  </div>
                </div>
              ) : (
                <Markdown>{m.content}</Markdown>
              )}
            </div>
          ))}

          {(tools.length > 0 || thinking) && streaming && (
            <div className={`${COL} space-y-1.5`}>
              {thinking && (
                <div className="flex items-center gap-2 text-[12px]" style={{ color: wcg.muted }}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Reasoning…</span>
                </div>
              )}
              {tools.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color: wcg.muted }}>
                  <Wrench className="w-3.5 h-3.5" style={{ color: wcg.teal }} />
                  <span>{TOOL_LABELS[t] ?? t}</span>
                </div>
              ))}
            </div>
          )}

          {reply && (
            <div className={COL}>
              <Markdown>{reply}</Markdown>
            </div>
          )}

          {shipNotice && (
            <div
              className={`${COL} flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px]`}
              style={{ background: '#ECFBF6', borderColor: wcg.teal, color: wcg.navy }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: wcg.good }} />
              {shipNotice}
            </div>
          )}

          {error && (
            <div
              className={`${COL} rounded-lg border px-4 py-3 text-[13px]`}
              style={{ background: '#FDECE7', borderColor: wcg.bad, color: '#8A3520' }}
            >
              {error}
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="border-t px-5 py-4" style={{ background: wcg.surface, borderColor: wcg.border }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className={`${COL} flex items-end gap-3`}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              placeholder="Ask a what-if, pick a section, or convene the review board…"
              disabled={streaming}
              className="flex-1 resize-none overflow-y-auto rounded-lg border px-4 py-3 text-[14px] focus:outline-none disabled:opacity-50"
              style={{ background: wcg.surface, borderColor: wcg.borderStrong, color: wcg.ink, maxHeight: 220 }}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="rounded-lg px-4 py-3 text-white disabled:opacity-40 transition-colors"
              style={{ background: wcg.teal }}
              aria-label="Send"
            >
              {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </section>

      {/* Resize handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize insight panel"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="hidden lg:block w-1.5 shrink-0 cursor-col-resize transition-colors hover:bg-[#CBD5E1]"
        style={{ background: wcg.border, touchAction: 'none' }}
      />

      {/* Insight rail */}
      <aside
        className="w-full lg:w-[var(--panel-w)] shrink-0 border-t lg:border-t-0 max-h-96 lg:max-h-none"
        style={{ background: wcg.page, borderColor: wcg.border }}
      >
        <InsightRail
          insights={insights}
          rounds={rounds}
          adoptedIds={adoptedIds}
          lastEvent={lastEvent}
          onDiscussFinding={discussFinding}
          onAdoptFinding={adoptFinding}
        />
      </aside>
    </div>
  )
}
