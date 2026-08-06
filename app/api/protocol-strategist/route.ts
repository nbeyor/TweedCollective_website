/**
 * Protocol Strategist — streaming chat endpoint.
 *
 * The model runs server-side so the API key never reaches the browser (the
 * site's CSP is connect-src 'self', so a direct browser call would be blocked
 * regardless). Tool calls execute here against the synthetic trial corpus and
 * loop back into the same stream.
 *
 * Emits SSE frames: thinking | text | tool | tool_result | done | error
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { TOOLS, runTool } from '@/lib/strategistTools'
import { manifest } from '@/lib/trialCorpus'

export const runtime = 'nodejs'
export const maxDuration = 300

const MODEL = 'claude-opus-5'
const EFFORT = process.env.STRATEGIST_EFFORT ?? 'medium'
const MAX_TOOL_ROUNDS = 12

function systemPrompt(): string {
  const m = manifest() as Record<string, unknown>
  return `You are a clinical trial protocol strategist advising a study team during protocol design.

## Your data

You have query access to a corpus of ${m.protocolCount} protocols and ${m.siteCount} investigational sites spanning Respiratory, Oncology, Immunology & Inflammation, Cardiometabolic, and Neurology. Two layers are joined per trial:

- **Protocol structure** — the full Trial IntelX(TM) sheet schema: eligibility criteria with operators, values, units and timepoints; schedule of assessments with invasiveness and LOINC/CPT coding; objectives, endpoints, dosing, concomitant medications, amendment history.
- **Operational outcomes** — cycle times, screen-fail and dropout rates, amendment and deviation counts, enrollment duration, and per-site enrollment broken out by race, ethnicity, gender and age band.

Three derived indices are available on every protocol, each scaled 0-100 relative to this corpus: \`restrictiveness_index\` (how hard the criteria are to pass), \`burden_index\` (participant assessment load), and \`diversity_drag_index\` (how far the criteria narrow the population beyond the clinical question).

## How to work

Query before you answer. You have tools for cohort statistics, single-protocol detail, percentile benchmarking, criterion-level frequency analysis, enrolled-population composition, and measured design-to-outcome relationships. Reach for them rather than reasoning from general clinical knowledge — a number you retrieved beats a number you recall, and the user can check the first one.

Lead with the finding. Open with what you found and what it means for the protocol, then the supporting figures. A study team wants "these four exclusion criteria are doing most of the screening damage and two of them are non-standard for this indication" before they want a table.

Quantify against peers, not in the abstract. "78th percentile for exclusion count among Phase 3 asthma trials" tells a protocol lead something; "55 exclusion criteria" does not.

Separate what the data shows from what you infer. The corpus has real structure in it, and you should use it — but say which claims rest on a measured relationship and which are your clinical judgment.

**Stratify by country before comparing enrolled populations.** Across the whole corpus, country mix swamps the criteria effect and the relationship between criteria design and enrolled diversity nearly vanishes. Within a country it is strong. An unstratified comparison produces a confidently wrong answer — always pass a country when using the diversity tool, and say you have done so.

## What this data is

It is **synthetic** — generated for demonstration, with no real sponsor, site, investigator, protocol, or participant, and no empirical calibration behind the operational layer. Its structure faithfully mirrors the Trial IntelX schema and the design-to-outcome mechanisms are deliberately encoded, which makes it sound for reasoning about mechanism and for showing method. It is not sound as evidence about the real world. If a user starts treating a figure as an empirical fact about their indication, say so once, plainly, and continue.

## Voice

Write like a seasoned colleague, not a report generator. Complete sentences, technical terms spelled out, no arrow chains or invented shorthand. Use a table when the data is genuinely tabular; otherwise prose. Keep it to the length the question needs — a direct question gets a direct answer, not headers and sections.`
}

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured for this deployment.' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    )
  }

  let body: { messages?: ClientMessage[] }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), { status: 400 })
  }

  const incoming = (body.messages ?? []).filter(
    (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim()
  )
  if (!incoming.length) {
    return new Response(JSON.stringify({ error: 'No messages supplied.' }), { status: 400 })
  }

  const client = new Anthropic()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, ...(data as object) })}\n\n`))
      }

      const messages: Anthropic.MessageParam[] = incoming.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      let usage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0 }

      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          // Adaptive thinking is on by default on Opus 5; display: 'summarized'
          // surfaces a readable summary so the UI can show progress instead of
          // a long silent pause. max_tokens caps thinking + text together.
          const params = {
            model: MODEL,
            max_tokens: 16000,
            thinking: { type: 'adaptive', display: 'summarized' },
            output_config: { effort: EFFORT },
            system: [
              {
                type: 'text',
                text: systemPrompt(),
                cache_control: { type: 'ephemeral' },
              },
            ],
            tools: TOOLS,
            messages,
          } as unknown as Anthropic.MessageStreamParams

          const ms = client.messages.stream(params)

          ms.on('streamEvent', (event) => {
            if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                send('text', { text: event.delta.text })
              } else if (event.delta.type === 'thinking_delta') {
                send('thinking', { text: event.delta.thinking })
              }
            }
          })

          const message = await ms.finalMessage()
          usage = {
            input_tokens: usage.input_tokens + (message.usage.input_tokens ?? 0),
            output_tokens: usage.output_tokens + (message.usage.output_tokens ?? 0),
            cache_read_input_tokens:
              usage.cache_read_input_tokens + (message.usage.cache_read_input_tokens ?? 0),
          }

          if (message.stop_reason === 'refusal') {
            send('error', { error: 'The model declined this request.' })
            break
          }

          const toolUses = message.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
          )

          if (!toolUses.length) {
            send('done', { usage, stop_reason: message.stop_reason, model: message.model })
            break
          }

          messages.push({ role: 'assistant', content: message.content })

          const results: Anthropic.ToolResultBlockParam[] = []
          for (const call of toolUses) {
            send('tool', { name: call.name, input: call.input })
            try {
              const output = await runTool(call.name, call.input as Record<string, unknown>)
              send('tool_result', { name: call.name, ok: true })
              results.push({
                type: 'tool_result',
                tool_use_id: call.id,
                content: JSON.stringify(output),
              })
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err)
              send('tool_result', { name: call.name, ok: false, error: msg })
              results.push({
                type: 'tool_result',
                tool_use_id: call.id,
                content: `Tool failed: ${msg}`,
                is_error: true,
              })
            }
          }

          messages.push({ role: 'user', content: results })

          if (round === MAX_TOOL_ROUNDS - 1) {
            send('error', { error: 'Reached the tool-call limit for one turn.' })
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        send('error', { error: msg })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}
