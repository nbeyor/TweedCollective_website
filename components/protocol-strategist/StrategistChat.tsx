'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Send, Wrench } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ToolActivity {
  name: string
  input: Record<string, unknown>
}

interface DocResult {
  id: string
  name: string
  webViewLink: string
}

const TOOL_LABELS: Record<string, string> = {
  describe_corpus: 'Reading the data dictionary',
  query_cohort: 'Querying comparator cohort',
  get_protocol: 'Pulling protocol detail',
  benchmark_protocol: 'Benchmarking against peers',
  analyze_criteria: 'Analyzing eligibility criteria',
  analyze_enrollment_diversity: 'Analyzing enrolled population',
  design_outcome_relationships: 'Measuring design-to-outcome relationships',
}

export function StrategistChat({ suggestions = [] }: { suggestions?: string[] }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [reply, setReply] = useState('')
  const [thinking, setThinking] = useState(false)
  const [tools, setTools] = useState<ToolActivity[]>([])
  const [error, setError] = useState<string | null>(null)
  const [doc, setDoc] = useState<DocResult | null>(null)
  const [codifying, setCodifying] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
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
                setTools((t) => [
                  ...t,
                  { name: String(evt.name), input: (evt.input ?? {}) as Record<string, unknown> },
                ])
                break
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

  const codify = useCallback(async () => {
    setCodifying(true)
    setError(null)
    try {
      const res = await fetch('/api/protocol-strategist/codify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Failed (${res.status})`)
      setDoc(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setCodifying(false)
    }
  }, [messages])

  const empty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {empty && (
          <div className="max-w-2xl mx-auto pt-8">
            <p className="text-stone text-sm leading-relaxed mb-6">
              Ask about eligibility burden, assessment load, amendment risk, comparator design, or
              enrolled-population composition. The strategist queries the trial corpus rather than
              answering from memory, and will show you what it pulled.
            </p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left px-4 py-3 rounded-lg border border-slate bg-graphite/60 text-pearl text-sm hover:border-sage-bright hover:bg-graphite transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="max-w-3xl mx-auto">
            {m.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-sage px-4 py-3 text-cream text-sm leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ) : (
              <div className="prose-strategist text-pearl text-[15px] leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            )}
          </div>
        ))}

        {(tools.length > 0 || thinking) && streaming && (
          <div className="max-w-3xl mx-auto space-y-1.5">
            {thinking && (
              <div className="flex items-center gap-2 text-stone text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Reasoning…</span>
              </div>
            )}
            {tools.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-stone text-xs">
                <Wrench className="w-3.5 h-3.5 text-sage-bright" />
                <span>{TOOL_LABELS[t.name] ?? t.name}</span>
              </div>
            ))}
          </div>
        )}

        {reply && (
          <div className="max-w-3xl mx-auto text-pearl text-[15px] leading-relaxed whitespace-pre-wrap">
            {reply}
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto rounded-lg border border-rust/50 bg-rust/10 px-4 py-3 text-sm text-rust">
            {error}
          </div>
        )}

        {doc && (
          <div className="max-w-3xl mx-auto rounded-lg border border-sage-bright/40 bg-sage/10 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-cream">
              <FileText className="w-4 h-4 text-sage-bright" />
              <span>Working document created:</span>
              <a
                href={doc.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-bright underline underline-offset-2 hover:text-cream"
              >
                {doc.name}
              </a>
            </div>
            <p className="text-stone text-xs mt-2">
              Comment on it in Google Docs, then run review to get a revised document with a change
              log keyed to your comments.
            </p>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="border-t border-slate bg-carbon px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-end gap-3"
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
              placeholder="Ask about the protocol…"
              disabled={streaming}
              className="flex-1 resize-none rounded-lg border border-slate bg-graphite px-4 py-3 text-pearl text-sm placeholder:text-stone/70 focus:border-sage-bright focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="rounded-lg bg-sage px-4 py-3 text-cream hover:bg-sage-light disabled:opacity-40 transition-colors"
              aria-label="Send"
            >
              {streaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          {messages.length >= 2 && (
            <button
              onClick={codify}
              disabled={codifying || streaming}
              className="mt-3 inline-flex items-center gap-2 text-xs text-stone hover:text-sage-bright disabled:opacity-40 transition-colors"
            >
              {codifying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              {codifying ? 'Writing document…' : 'Codify this into a working document'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
