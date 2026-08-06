'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Loader2, Send, Wrench } from 'lucide-react'

import type { DesignBrief } from '@/lib/trialCorpus'
import { BriefPanel, type ShippedDecision } from './BriefPanel'
import { InsightPanel, type Insight } from './InsightPanel'
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
  site_level_breakdown: 'Cutting the slip by site type',
  comparator_landscape: 'Placing the draft against comparators',
  amendment_risk_sweep: 'Sweeping amendment history',
  render_chart: 'Drawing a chart',
  ship_decision: 'Shipping the decision to the brief',
  describe_corpus: 'Reading the data dictionary',
  query_cohort: 'Querying comparator cohort',
  get_protocol: 'Pulling protocol detail',
  benchmark_protocol: 'Benchmarking against peers',
  analyze_criteria: 'Analyzing eligibility criteria',
}

const SUGGESTIONS = [
  'Which criteria in this draft will cost us the most eligible patients?',
  'Medical wants an endoscopy screen to verify GI disease. How does that hit my recruitment timeline?',
  'Before this goes to writing, which elements are most likely to force an amendment?',
]

export function StrategistWorkspace({
  brief,
  briefDocLink,
}: {
  brief: DesignBrief
  briefDocLink?: string | null
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

  const endRef = useRef<HTMLDivElement>(null)
  const seq = useRef(0)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, reply, tools])

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
      setStreaming(true)

      let accumulated = ''
      try {
        const res = await fetch('/api/protocol-strategist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: next }),
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
                setInsights((prev) => [{ kind: 'fixed', key: `p${seq.current}`, panel }, ...prev])
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
                const written = Boolean(evt.written)
                const doc = (evt.doc ?? null) as ShippedDecision['doc']
                setDecisions((prev) => [...prev, { ...entry, written, doc }])
                setShipNotice(
                  written
                    ? `Shipped “${entry.element_label}” — written to the brief.`
                    : `Shipped “${entry.element_label}” — logged on-page.`
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
    [messages, streaming]
  )

  const empty = messages.length === 0

  return (
    <div className="h-full flex flex-col lg:flex-row" style={{ background: wcg.page }}>
      {/* Brief panel */}
      <aside
        className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r max-h-72 lg:max-h-none"
        style={{ background: wcg.surface, borderColor: wcg.border }}
      >
        <BriefPanel brief={brief} decisions={decisions} onPickElement={setInput} docLink={briefDocLink} />
      </aside>

      {/* Chat */}
      <section className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {empty && (
            <div className="max-w-2xl mx-auto pt-4">
              <p className="text-[14px] leading-relaxed mb-5" style={{ color: wcg.body }}>
                The document on the left is a drafted trial design. Select an element to interrogate it, or
                ask a what-if below. Every figure traces to WCG IntelX operations data — sensitivity
                answers come back as options with tradeoffs, and charts render on the right.
              </p>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
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
            <div key={i} className="max-w-2xl mx-auto">
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
                <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap" style={{ color: wcg.body }}>
                  {m.content}
                </div>
              )}
            </div>
          ))}

          {(tools.length > 0 || thinking) && streaming && (
            <div className="max-w-2xl mx-auto space-y-1.5">
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
            <div
              className="max-w-2xl mx-auto text-[14.5px] leading-relaxed whitespace-pre-wrap"
              style={{ color: wcg.body }}
            >
              {reply}
            </div>
          )}

          {shipNotice && (
            <div
              className="max-w-2xl mx-auto flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px]"
              style={{ background: '#ECFBF6', borderColor: wcg.teal, color: wcg.navy }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: wcg.good }} />
              {shipNotice}
            </div>
          )}

          {error && (
            <div
              className="max-w-2xl mx-auto rounded-lg border px-4 py-3 text-[13px]"
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
            className="max-w-2xl mx-auto flex items-end gap-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              placeholder="Ask a what-if, or select an element from the brief…"
              disabled={streaming}
              className="flex-1 resize-none rounded-lg border px-4 py-3 text-[14px] focus:outline-none disabled:opacity-50"
              style={{ background: wcg.surface, borderColor: wcg.borderStrong, color: wcg.ink }}
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

      {/* Insight panel */}
      <aside
        className="w-full lg:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l max-h-96 lg:max-h-none"
        style={{ background: wcg.page, borderColor: wcg.border }}
      >
        <InsightPanel insights={insights} />
      </aside>
    </div>
  )
}
