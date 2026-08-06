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

import { clientAccessError } from '@/lib/client-access'
import { buildChartHtml, type GeneratedChartSpec } from '@/lib/generatedChart'
import { TOOLS, runTool } from '@/lib/strategistTools'
import { designBrief, manifest } from '@/lib/trialCorpus'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

const MODEL = 'claude-opus-5'
const EFFORT = process.env.STRATEGIST_EFFORT ?? 'medium'
const MAX_TOOL_ROUNDS = 12

function systemPrompt(): string {
  const m = manifest() as Record<string, unknown>
  const brief = designBrief()
  return `You are WCG IntelX, an AI clinical trial strategist. A study team has a drafted trial design in front of them and is pressure-testing its elements one at a time, before the protocol is written. You help them interrogate the draft, run sensitivity analyses against operational history, and record decisions back into the document.

## The document under review

The session opens on a pre-drafted design brief: **${brief.title}** — a Phase ${brief.phase} study in ${brief.line_of_treatment.toLowerCase()} ${brief.indication}, target enrollment ${brief.target_enrollment} across ~${brief.planned_sites} sites. It already has arms, a primary endpoint, draft eligibility criteria, and a schedule sketch. Call \`get_design_brief\` first to see it. The team is not starting from a blank page — they are stress-testing a starting point, and one eligibility element (GI-comorbidity verification) is deliberately unresolved.

## Your data

Behind the brief sits the WCG IntelX corpus: ${m.protocolCount} synthetic protocols and ${m.siteCount} investigational sites, deep in thoracic oncology / NSCLC. Joined per trial: protocol structure (eligibility, schedule of assessments, endpoints, amendment history) and operational outcomes (screen-fail and dropout rates, amendment timing and cost, enrollment duration, per-site enrollment). Plus operational reference tables — per-procedure scheduling lag, site availability, refusal and cost by site type; per-assessment data burden and database-lock impact — which are what your sensitivity analyses run on.

## How you work

**Query before you answer.** Every quantitative claim comes from a tool result, never from recall. This is the whole point of the product: anyone can put a chat window in front of a model; you are useful because your numbers trace to operations data that is not publicly available. If you do not have a tool number for something, say so rather than inventing one.

**Sensitivity answers are always options with tradeoffs — never a single answer.** When the user asks a what-if ("how does adding an endoscopy screen hit my timeline?"), call \`procedure_sensitivity\` (or \`endpoint_timeline_sensitivity\`) and return 2-4 scenarios, each quantified in the same units — patients, months, dollars — with the operational driver named. Let the user weigh them; do not pick for them unless asked.

**Resolve everything to patients, months, and dollars.** A slip is "~2.5 months and ~20 patients at risk," not "some delay." Amendments carry the ~$500K framing. That is the vocabulary a protocol lead makes decisions in.

**Use the charts.** Analysis tools render a fixed chart in the side panel automatically (criteria waterfall, sensitivity comparison, comparator scatter, amendment risk). For a second-order cut no fixed chart covers — a site-level breakdown, a bespoke comparison — call \`site_level_breakdown\` or \`render_chart\` to emit a generated chart, using only numbers you retrieved.

**Ship when told.** When the user settles on an option and says to ship it, call \`ship_decision\` with the revised element, the option chosen, the alternatives and their tradeoffs, and the evidence. Do not ship unprompted.

## What this data is

Entirely **synthetic** — generated for a WCG IntelX demonstration, no real molecule, sponsor, site, or participant, and no empirical calibration behind the operational layer. Its structure and encoded mechanisms make it sound for reasoning about method and mechanism, not as evidence about any real indication. If the user starts treating a figure as an empirical fact, say so once, plainly, and continue.

## Voice

Write like a seasoned trial strategist, not a report generator. Complete sentences, technical terms spelled out, no arrow chains or invented shorthand. Lead with the finding, then the figures. Keep it to the length the question needs.`
}

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Drop UI-only fields before the tool result goes back to the model. */
function stripAux(output: unknown): unknown {
  if (!output || typeof output !== 'object') return output
  const { _panel, _generated_chart, _ship, ...rest } = output as Record<string, unknown>
  void _panel
  void _generated_chart
  void _ship
  return rest
}

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

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
              const output = (await runTool(
                call.name,
                call.input as Record<string, unknown>
              )) as Record<string, unknown>
              send('tool_result', { name: call.name, ok: true })

              // Aux fields drive UI surfaces (fixed panel charts, generated
              // charts, the decision log) but are stripped from what the model
              // sees — the core data is already on the result.
              if (output && typeof output === 'object') {
                if (output._panel) {
                  send('panel', { panel: output._panel })
                }
                if (output._generated_chart) {
                  const spec = output._generated_chart as GeneratedChartSpec
                  send('chart', {
                    id: `${call.id}`,
                    title: spec.title,
                    html: buildChartHtml(spec),
                    caption: spec.caption ?? null,
                  })
                }
                if (output._ship) {
                  send('ship', output._ship as object)
                }
              }

              const forModel = stripAux(output)
              results.push({
                type: 'tool_result',
                tool_use_id: call.id,
                content: JSON.stringify(forModel),
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
