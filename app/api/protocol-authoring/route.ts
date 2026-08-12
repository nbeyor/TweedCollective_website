/**
 * Protocol Foundry — streaming chat endpoint.
 *
 * Mirrors the strategist route (model server-side, SSE frames, tool loop);
 * adds the `findings` frame that carries review-board rounds to the UI.
 *
 * Emits SSE frames: thinking | text | tool | tool_result | panel | chart |
 * ship | findings | done | error
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { buildChartHtml, type GeneratedChartSpec } from '@/lib/generatedChart'
import {
  sanitizeDecisions,
  sanitizeFindings,
  stripAux,
  systemPrompt,
  type ClientMessage,
} from '@/lib/protocol-authoring/prompt'
import { runTool, TOOLS } from '@/lib/protocol-authoring/tools'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-authoring'

const MODEL = 'claude-opus-5'
const EFFORT = process.env.FOUNDRY_EFFORT ?? process.env.STRATEGIST_EFFORT ?? 'medium'
const MAX_TOOL_ROUNDS = 12

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured for this deployment.' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    )
  }

  let body: { messages?: ClientMessage[]; decisions?: unknown; findings?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), { status: 400 })
  }
  const decisions = sanitizeDecisions(body.decisions)
  const findings = sanitizeFindings(body.findings)

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
          const params = {
            model: MODEL,
            max_tokens: 16000,
            thinking: { type: 'adaptive', display: 'summarized' },
            output_config: { effort: EFFORT },
            system: [
              {
                type: 'text',
                text: systemPrompt(decisions, findings),
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
              const output = (await runTool(call.name, call.input as Record<string, unknown>)) as Record<
                string,
                unknown
              >
              send('tool_result', { name: call.name, ok: true })

              // Aux fields drive UI surfaces (fixed panel charts, generated
              // charts, review findings, the decision log) but are stripped
              // from what the model sees.
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
                if (output._findings) {
                  send('findings', output._findings as object)
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
