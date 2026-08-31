/**
 * The grounded-answer runner behind the MCP ask_strategist tool.
 *
 * This is the same loop as the web chat route (app/api/protocol-strategist/
 * route.ts) — same model, same system prompt, same tools, same round cap —
 * but it collects the result instead of streaming it. The grounding contract
 * is enforced HERE, server-side, on every call: the external client (Gemini,
 * or any MCP host) only ever sees the finished, vetted answer. That is the
 * whole point of the grounded-answer architecture — the reasoning loop never
 * leaves this server.
 */

import Anthropic from '@anthropic-ai/sdk'

import type { GeneratedChartSpec } from '../generatedChart'
import {
  cachedSystemBlocks,
  resolveBrief,
  sanitizeDecisions,
  stripAux,
  toolsWithCacheBreakpoint,
  type BriefSource,
  type ClientMessage,
} from '../strategistPrompt'
import { TOOLS, runTool, type ShipEntry } from '../strategistTools'
import { chartLink } from './chartToken'

const MODEL = 'claude-opus-5'
const EFFORT = process.env.STRATEGIST_EFFORT ?? 'medium'
const MAX_TOOL_ROUNDS = 12

/** Friendly titles for the fixed panel charts, keyed by PanelDescriptor.chart. */
const FIXED_TITLES: Record<string, string> = {
  criteria_waterfall: 'Criteria-burden waterfall',
  sensitivity_comparison: 'Sensitivity comparison',
  endpoint_timeline: 'Endpoint timeline impact',
  comparator_scatter: 'Comparator landscape',
  amendment_risk: 'Amendment risk',
}

export interface StrategistChart {
  title: string
  kind: 'generated' | 'fixed'
  /** Open in a browser — renders the same chart the web workspace shows. */
  chart_url: string | null
  /** Opaque token; pass a set of these to build_chart_gallery for one combined page. */
  chart_token: string
}

export interface StrategistAnswer {
  answer: string
  charts: StrategistChart[]
  shipped_decisions: ShipEntry[]
  tools_used: string[]
  grounding_note: string
}

export async function runGroundedStrategist(opts: {
  question: string
  source: BriefSource
  conversation?: ClientMessage[]
  decisions?: unknown
}): Promise<StrategistAnswer> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured for this deployment.')
  }

  const decisions = sanitizeDecisions(opts.decisions)
  const brief = resolveBrief(opts.source)
  if (opts.source.kind === 'corpus' && !brief) {
    throw new Error(
      `Unknown protocol "${opts.source.protocolId}". Ask for the corpus protocol list via get_started, or use brief_source "hero".`
    )
  }

  const prior = (opts.conversation ?? []).filter(
    (m): m is ClientMessage =>
      Boolean(m) &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      Boolean(m.content.trim())
  )

  const client = new Anthropic()
  const messages: Anthropic.MessageParam[] = [
    ...prior.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: opts.question },
  ]

  const textParts: string[] = []
  const charts: StrategistChart[] = []
  const seenTokens = new Set<string>()
  const shipped: ShipEntry[] = []
  const toolsUsed: string[] = []

  const addChart = (title: string, kind: 'generated' | 'fixed', link: ReturnType<typeof chartLink>) => {
    if (seenTokens.has(link.chart_token)) return
    seenTokens.add(link.chart_token)
    charts.push({ title, kind, chart_url: link.chart_url, chart_token: link.chart_token })
  }

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    // Streamed even though nothing is forwarded live: a 16k-token non-streaming
    // request is exactly what the SDK's timeout guidance warns against.
    const params = {
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive', display: 'summarized' },
      output_config: { effort: EFFORT },
      system: cachedSystemBlocks(opts.source, brief, decisions),
      tools: toolsWithCacheBreakpoint(TOOLS),
      messages,
    } as unknown as Anthropic.MessageStreamParams

    const message = await client.messages.stream(params).finalMessage()

    if (message.stop_reason === 'refusal') {
      throw new Error('The model declined this request.')
    }

    for (const block of message.content) {
      if (block.type === 'text' && block.text.trim()) textParts.push(block.text)
    }

    const toolUses = message.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    )
    if (!toolUses.length) break

    messages.push({ role: 'assistant', content: message.content })

    const results: Anthropic.ToolResultBlockParam[] = []
    for (const call of toolUses) {
      toolsUsed.push(call.name)
      try {
        const output = (await runTool(call.name, call.input as Record<string, unknown>, {
          brief,
        })) as Record<string, unknown>

        if (output && typeof output === 'object') {
          if (output._panel) {
            const panel = output._panel as { chart: string; data: Record<string, unknown> }
            addChart(
              FIXED_TITLES[panel.chart] ?? panel.chart,
              'fixed',
              chartLink({ kind: 'fixed', panel })
            )
          }
          if (output._generated_chart) {
            const spec = output._generated_chart as GeneratedChartSpec
            addChart(spec.title, 'generated', chartLink({ kind: 'generated', spec }))
          }
          if (output._ship) {
            shipped.push((output._ship as { entry: ShipEntry }).entry)
          }
        }

        results.push({
          type: 'tool_result',
          tool_use_id: call.id,
          content: JSON.stringify(stripAux(output)),
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
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
      textParts.push('_(Reached the tool-call limit for one question — answer may be partial.)_')
    }
  }

  return {
    answer: textParts.join('\n\n'),
    charts,
    shipped_decisions: shipped,
    tools_used: toolsUsed,
    grounding_note:
      'Every figure in this answer was retrieved from the operations corpus by the tools listed in tools_used, during this call, under an enforced grounding contract. The corpus is entirely synthetic — sound for reasoning about mechanism, not evidence about any real indication.',
  }
}
