'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, ExternalLink, FileUp, Loader2, RotateCcw, Send, Wrench } from 'lucide-react'

import { SUGGESTIONS } from '@/lib/mcp/prompts'
import type { DesignBrief, ProtocolIndexEntry } from '@/lib/trialCorpus'
import { EXAMPLE_PROTOCOLS } from '@/lib/strategistExamples'
import { BriefPanel, type BriefMode, type ShippedDecision } from './BriefPanel'
import { DataConnectorsPanel } from './DataConnectorsPanel'
import { InsightPanel, type Insight } from './InsightPanel'
import { DEFAULT_TEMPLATE_KEY } from '@/lib/strategistTemplates'
import { Markdown } from './Markdown'
import { OutputTemplatePanel } from './OutputTemplatePanel'
import { ProtocolPicker, sourceKey, type BriefSource } from './ProtocolPicker'
import { wcg } from './wcgTheme'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const TOOL_LABELS: Record<string, string> = {
  get_design_brief: 'Reading the design brief',
  draft_criteria_burden: 'Ranking criteria by screening burden',
  procedure_sensitivity: 'Running the sensitivity analysis',
  endpoint_timeline_sensitivity: 'Modelling endpoint timeline impact',
  trial_cost: 'Building the cost model',
  site_footprint: 'Building the site & country footprint',
  design_structure: 'Cutting the cohort by design structure',
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
}

const PLACEHOLDERS: Record<BriefMode, string> = {
  hero: 'Ask a what-if, or select an element from the brief…',
  corpus: 'Ask a what-if about this protocol…',
  blank: 'Describe the trial you want to design…',
}

/** Shared width for everything in the chat column. */
const COL = 'max-w-3xl mx-auto'

const PANEL_MIN = 320
const PANEL_MAX = 720
const PANEL_KEY = 'strategist.panelWidth'
const TEMPLATE_KEY = 'strategist.outputTemplate'

/**
 * Everything a document's session carries. Conversations are scoped to one
 * document under review: switching documents parks the current session and
 * restores the target's, so the model never sees two protocols' histories
 * interleaved and nothing is destroyed by browsing.
 */
interface DocSession {
  messages: Message[]
  insights: Insight[]
  decisions: ShippedDecision[]
  publishedDoc: { webViewLink?: string } | null
}

/** Decision logs persist per document across reloads; chat is session-only. */
const decisionsStorageKey = (k: string) => `strategist.decisions.${k}`

function loadStoredDecisions(k: string): ShippedDecision[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(decisionsStorageKey(k)) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function storeDecisions(k: string, decisions: ShippedDecision[]) {
  try {
    localStorage.setItem(decisionsStorageKey(k), JSON.stringify(decisions))
  } catch {
    // Storage full or blocked — the on-page log still works for this session.
  }
}

export function StrategistWorkspace({
  brief,
  briefDocLink,
  protocols,
}: {
  brief: DesignBrief
  briefDocLink?: string | null
  protocols: ProtocolIndexEntry[]
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [reply, setReply] = useState('')
  const [thinking, setThinking] = useState(false)
  const [tools, setTools] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [decisions, setDecisions] = useState<ShippedDecision[]>([])
  const [shipNotice, setShipNotice] = useState<string | null>(null)

  // Output template: what shape Publish produces. Persisted across reloads.
  const [templateKey, setTemplateKey] = useState<string>(DEFAULT_TEMPLATE_KEY)
  const [customOutline, setCustomOutline] = useState('')

  // Document under review.
  const [source, setSource] = useState<BriefSource>({ kind: 'hero' })
  const [activeBrief, setActiveBrief] = useState<DesignBrief | null>(brief)
  const [briefLoading, setBriefLoading] = useState(false)

  // Publish to Google Doc.
  const [publishing, setPublishing] = useState(false)
  const [publishedDoc, setPublishedDoc] = useState<{ webViewLink?: string } | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [docsReady, setDocsReady] = useState<{ ok: boolean; detail: string } | null>(null)

  // Resizable insight panel.
  const [panelWidth, setPanelWidth] = useState(400)
  const drag = useRef<{ startX: number; startW: number } | null>(null)

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const seq = useRef(0)

  // Parked sessions for documents browsed earlier this visit, by source key.
  const parked = useRef(new Map<string, DocSession>())

  // Restore this document's persisted decision log on first load.
  useEffect(() => {
    setDecisions(loadStoredDecisions(sourceKey({ kind: 'hero' })))
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

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TEMPLATE_KEY) ?? 'null')
      if (saved && typeof saved === 'object') {
        if (typeof saved.key === 'string') setTemplateKey(saved.key)
        if (typeof saved.customOutline === 'string') setCustomOutline(saved.customOutline)
      }
    } catch {
      // Corrupt or blocked storage — keep the default template.
    }
  }, [])

  const changeTemplate = useCallback((key: string, outline: string) => {
    setTemplateKey(key)
    setCustomOutline(outline)
    try {
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify({ key, customOutline: outline }))
    } catch {
      // Storage blocked — the setting still holds for this session.
    }
  }, [])

  // One live probe of the Drive folder so Publish fails fast with a reason
  // instead of after a 30-second model call.
  useEffect(() => {
    fetch('/api/protocol-strategist/health?scope=google')
      .then((r) => r.json())
      .then((d) => {
        const g = d?.checks?.google
        if (g && typeof g.ok === 'boolean') setDocsReady({ ok: g.ok, detail: String(g.detail ?? '') })
      })
      .catch(() => {})
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

      let accumulated = ''
      try {
        const res = await fetch('/api/protocol-strategist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: next, context: source, decisions }),
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
                // One card per fixed chart type: a repeat with identical data is
                // dropped (the model consulted the tool again, nothing new to
                // show); changed data replaces the old card at the top.
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
                break
              }
              case 'ship': {
                const entry = (evt.entry ?? {}) as ShippedDecision
                setDecisions((prev) => {
                  const next = [...prev, entry]
                  storeDecisions(sourceKey(source), next)
                  return next
                })
                setShipNotice(
                  `Shipped “${entry.element_label}” — registered in the decision log. Publish when you want the updated protocol as a doc.`
                )
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
    [messages, streaming, source, decisions]
  )

  /** Wipe the current document's decision log — a fresh start for this project. */
  const clearDecisions = useCallback(() => {
    if (!decisions.length) return
    if (!window.confirm('Clear the decision log for this document? This cannot be undone.')) return
    setDecisions([])
    storeDecisions(sourceKey(source), [])
  }, [decisions.length, source])

  /** Clear the current document's conversation and charts. Its decision log stays. */
  const clearConversation = useCallback(() => {
    setMessages([])
    setReply('')
    setTools([])
    setError(null)
    setInsights([])
    setShipNotice(null)
    setPublishedDoc(null)
    setPublishError(null)
  }, [])

  const reset = useCallback(() => {
    if (streaming) return
    if (
      messages.length &&
      !window.confirm('Clear this conversation and its charts? The decision log is kept.')
    ) {
      return
    }
    clearConversation()
    parked.current.delete(sourceKey(source))
  }, [messages.length, streaming, clearConversation, source])

  const switchSource = useCallback(
    async (next: BriefSource) => {
      if (sourceKey(next) === sourceKey(source) || streaming) return

      // Park this document's session, restore the target's. Nothing is lost by
      // browsing, and each conversation stays scoped to one document — the
      // model never sees two protocols' histories mixed together.
      parked.current.set(sourceKey(source), { messages, insights, decisions, publishedDoc })
      const restored = parked.current.get(sourceKey(next))
      setMessages(restored?.messages ?? [])
      setInsights(restored?.insights ?? [])
      setDecisions(restored?.decisions ?? loadStoredDecisions(sourceKey(next)))
      setPublishedDoc(restored?.publishedDoc ?? null)
      setReply('')
      setTools([])
      setError(null)
      setShipNotice(null)
      setPublishError(null)

      setSource(next)
      if (next.kind === 'hero') {
        setActiveBrief(brief)
        return
      }
      if (next.kind === 'blank') {
        setActiveBrief(null)
        return
      }
      setActiveBrief(null)
      setBriefLoading(true)
      try {
        const res = await fetch(
          `/api/protocol-strategist/brief?protocol_id=${encodeURIComponent(next.protocolId)}`
        )
        if (!res.ok) throw new Error(`Could not load ${next.protocolId} (${res.status}).`)
        setActiveBrief((await res.json()) as DesignBrief)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        setSource({ kind: 'hero' })
        setActiveBrief(brief)
      } finally {
        setBriefLoading(false)
      }
    },
    [source, streaming, messages, insights, decisions, publishedDoc, brief]
  )

  const publish = useCallback(async () => {
    if ((!messages.length && !decisions.length) || streaming || publishing) return
    setPublishing(true)
    setPublishError(null)
    setPublishedDoc(null)
    try {
      // Publishes the session's grounded content in the selected output
      // template — the full protocol by default. The decision log itself stays
      // in the workspace; it is never published as a document.
      const res = await fetch('/api/protocol-strategist/codify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages,
          context: source,
          decisions,
          template: { key: templateKey, customOutline },
        }),
      })
      const data = (await res.json()) as { webViewLink?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? `Publish failed (${res.status}).`)
      setPublishedDoc(data)
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : String(err))
    } finally {
      setPublishing(false)
    }
  }, [messages, decisions, source, streaming, publishing, templateKey, customOutline])

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

  const mode: BriefMode = source.kind
  const empty = messages.length === 0
  const publishDisabled =
    (!messages.length && !decisions.length) ||
    streaming ||
    publishing ||
    (docsReady !== null && !docsReady.ok)

  return (
    <div
      className="h-full flex flex-col lg:flex-row"
      style={{ background: wcg.page, ['--panel-w' as string]: `${panelWidth}px` } as React.CSSProperties}
    >
      {/* Brief panel */}
      <aside
        className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r max-h-72 lg:max-h-none"
        style={{ background: wcg.surface, borderColor: wcg.border }}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 pt-4">
            <ProtocolPicker
              source={source}
              heroLabel={`${brief.indication} — drafted brief`}
              examples={EXAMPLE_PROTOCOLS}
              protocols={protocols}
              onSelect={switchSource}
            />
          </div>
          {briefLoading ? (
            <div className="flex items-center gap-2 px-4 py-6 text-[12.5px]" style={{ color: wcg.muted }}>
              <Loader2 className="w-4 h-4 animate-spin" /> Loading protocol…
            </div>
          ) : (
            <BriefPanel
              brief={activeBrief}
              mode={mode}
              decisions={decisions}
              onPickElement={setInput}
              onRunAnalysis={send}
              onClearDecisions={clearDecisions}
              docLink={briefDocLink}
            />
          )}
          <OutputTemplatePanel
            templateKey={templateKey}
            customOutline={customOutline}
            onChange={changeTemplate}
          />
          <DataConnectorsPanel />
        </div>
      </aside>

      {/* Chat */}
      <section className="flex-1 min-w-0 flex flex-col">
        <div
          className="border-b px-5 py-2 flex items-center justify-end gap-2 shrink-0"
          style={{ background: wcg.surface, borderColor: wcg.border }}
        >
          {publishedDoc?.webViewLink && (
            <a
              href={publishedDoc.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium"
              style={{ background: '#ECFBF6', borderColor: wcg.teal, color: wcg.navy }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Google Docs
            </a>
          )}
          {publishError && (
            <span className="text-[11.5px] truncate max-w-[40ch]" style={{ color: wcg.bad }} title={publishError}>
              {publishError}
            </span>
          )}
          <button
            onClick={reset}
            disabled={streaming || (!messages.length && !insights.length)}
            title="Clear the conversation and charts"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium disabled:opacity-40 transition-colors"
            style={{ background: wcg.surface, borderColor: wcg.borderStrong, color: wcg.body }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={publish}
            disabled={publishDisabled}
            title={
              docsReady && !docsReady.ok
                ? `Google Docs is not available: ${docsReady.detail}`
                : 'Publish the updated protocol — the design with every shipped decision applied — as a Google Doc'
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40 transition-colors"
            style={{ background: wcg.navy }}
          >
            {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
            {publishing ? 'Publishing…' : 'Publish updated protocol'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {empty && (
            <div className={`${COL} pt-4`}>
              <p className="text-[14px] leading-relaxed mb-5" style={{ color: wcg.body }}>
                {mode === 'blank'
                  ? 'Describe the trial you have in mind — every design choice gets grounded in the operations corpus — or start from a question below.'
                  : 'Pick data categories in the Analyses tab to tee up chart-backed questions, click any element of the brief, or ask a what-if below. Charts land on the right.'}
              </p>
              <div className="space-y-2">
                {SUGGESTIONS[mode].map((s) => (
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
              placeholder={PLACEHOLDERS[mode]}
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

      {/* Insight panel */}
      <aside
        className="w-full lg:w-[var(--panel-w)] shrink-0 border-t lg:border-t-0 max-h-96 lg:max-h-none"
        style={{ background: wcg.page, borderColor: wcg.border }}
      >
        <InsightPanel insights={insights} />
      </aside>
    </div>
  )
}
