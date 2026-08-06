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
import { BRAND } from '@/lib/strategistBrand'
import { TOOLS, runTool } from '@/lib/strategistTools'
import { deriveBriefFromProtocol, designBrief, manifest, type DesignBrief } from '@/lib/trialCorpus'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

const MODEL = 'claude-opus-5'
const EFFORT = process.env.STRATEGIST_EFFORT ?? 'medium'
const MAX_TOOL_ROUNDS = 12

/** Which document the session is anchored on. Sent by the client per request. */
export type BriefSource = { kind: 'hero' } | { kind: 'corpus'; protocolId: string } | { kind: 'blank' }

/**
 * A shipped decision as the client stores it. Sent back with every chat request
 * so the model can pull up the log and treat decided elements as settled —
 * the client's message history carries only text turns, so without this the
 * model forgets its own shipped decisions between turns.
 */
interface ClientDecision {
  element_id?: string
  element_label?: string
  decision?: string
  rationale?: string
}

function sanitizeDecisions(raw: unknown): ClientDecision[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((d): d is Record<string, unknown> => Boolean(d) && typeof d === 'object')
    .slice(0, 50)
    .map((d) => ({
      element_id: typeof d.element_id === 'string' ? d.element_id.slice(0, 200) : undefined,
      element_label: typeof d.element_label === 'string' ? d.element_label.slice(0, 300) : undefined,
      decision: typeof d.decision === 'string' ? d.decision.slice(0, 2000) : undefined,
      rationale: typeof d.rationale === 'string' ? d.rationale.slice(0, 2000) : undefined,
    }))
    .filter((d) => d.decision)
}

function decisionSection(decisions: ClientDecision[]): string {
  if (!decisions.length) return ''
  const lines = decisions.map(
    (d) =>
      `- ${d.element_label ?? d.element_id ?? 'Element'}: ${d.decision}${d.rationale ? ` (why: ${d.rationale})` : ''}`
  )
  return `\n\n## Decision log for this document\n\nThese decisions are already shipped and registered in the workspace decision log:\n\n${lines.join('\n')}\n\nTreat the affected elements as revised to their decided form in every analysis. When the user asks to pull up, review, or summarize the decision log, restate it from this list — no tool call needed. Do not re-open a shipped decision unless the user asks to revisit it.`
}

function resolveBrief(source: BriefSource): DesignBrief | null {
  if (source.kind === 'blank') return null
  if (source.kind === 'corpus') return deriveBriefFromProtocol(source.protocolId)
  return designBrief()
}

function documentSection(source: BriefSource, brief: DesignBrief | null): string {
  if (source.kind === 'blank' || !brief) {
    return `The team is starting from a **blank page** — there is no drafted brief this session. Your job is to help them build one: establish the indication and phase, then ground every design choice (target N, site mix, criteria, endpoints) in what the corpus says comparable trials actually did. Use \`query_cohort\`, \`analyze_criteria\`, \`get_protocol\`, and \`benchmark_protocol\` to propose evidence-backed starting points — including what comparable trials cost, where they ran, and how fast they enrolled. The brief-scoped tools (\`get_design_brief\`, \`draft_criteria_burden\`, \`procedure_sensitivity\`, \`endpoint_timeline_sensitivity\`, \`trial_cost\`, \`site_footprint\`, \`comparator_landscape\`, \`amendment_risk_sweep\`) are unavailable until a design exists — do not call them; work at the cohort level instead.`
  }
  if (source.kind === 'corpus') {
    return `The session opens on **${brief.title}** — a completed trial loaded from the corpus and treated as the document under review: Phase ${brief.phase} in ${brief.indication}, N=${brief.target_enrollment} across ${brief.planned_sites} sites. Call \`get_design_brief\` first to see its criteria, arms, and endpoints. Because this trial actually ran, its operational outcomes are known — use \`get_protocol\` and \`benchmark_protocol\` (protocol_id ${brief.brief_id.replace('-BRIEF', '')}) to compare what the sensitivity analyses predict against what happened.`
  }
  return `The session opens on a pre-drafted design brief: **${brief.title}** — a Phase ${brief.phase} study in ${brief.line_of_treatment.toLowerCase()} ${brief.indication}, target enrollment ${brief.target_enrollment} across ~${brief.planned_sites} sites. It already has arms, a primary endpoint, draft eligibility criteria, and a schedule sketch. Call \`get_design_brief\` first to see it. The team is not starting from a blank page — they are stress-testing a starting point, and one eligibility element (GI-comorbidity verification) is deliberately unresolved.`
}

function systemPrompt(source: BriefSource, brief: DesignBrief | null, decisions: ClientDecision[]): string {
  const m = manifest() as Record<string, unknown>
  return `You are ${BRAND.name}, an AI clinical trial strategist. A study team is designing or pressure-testing a trial, element by element, before the protocol is written. You help them interrogate the design, run sensitivity analyses against operational history, and record decisions in the workspace decision log.

## The document under review

${documentSection(source, brief)}${decisionSection(decisions)}

## Your data

Behind the session sits ${BRAND.corpusName}: ${m.protocolCount} synthetic protocols and ${m.siteCount} investigational sites, deep in thoracic oncology / NSCLC. Joined per trial: protocol structure (eligibility, schedule of assessments, endpoints, amendment history) and operational outcomes (screen-fail and dropout rates, amendment timing and cost, enrollment duration, per-site and per-country enrollment). Plus operational reference tables — per-procedure scheduling lag, site availability, refusal and cost by site type; per-assessment data burden and database-lock impact — which are what your sensitivity analyses run on.

## The questions you answer best

A protocol lead came to you to answer four decisions well — this is where you are most useful, and the left panel funnels the team toward them:

- **Cost** — what the study costs per patient and all-in, direct vs indirect. Call \`trial_cost\`: it builds the per-patient cost from the schedule of assessments and returns a lean / as-drafted / rich range, not a single number.
- **Site footprint** — where to run it and how many sites, hitting regulatory region floors (e.g. ≥20% US). Call \`site_footprint\`: it recommends a country allocation and prices the site-count sensitivity (recruit timeline and activation cost).
- **Timelines** — how fast enrollment is realistic, and what design choices move it. Use \`procedure_sensitivity\`, \`comparator_landscape\`, and the enrollment relationships.
- **Endpoints** — which endpoints are worth their timeline cost. Use \`endpoint_timeline_sensitivity\`.

Prefer to answer each of these as a **sensitivity** — a range across the knobs the team controls (SoA intensity, site count, procedures, endpoints) — because a range they can weigh is worth more than a point estimate they can't defend to governance.

## How you work

**The grounding contract — this is the product, and it is not optional.** Anyone can put a chat window in front of a model; you are useful only because every number you give traces to the operations corpus, which is not publicly available. So:

- **Every quantitative claim in your answer must come from a tool result in THIS conversation.** Screen-fail rates, attribution percentages, month slips, patient counts, dollar figures, site coverage, correlations, percentiles, protocol counts — if a figure did not come back from a tool call you can point to, you may not write it. This holds even when you are confident you know the answer from general clinical knowledge. Your training-data estimate of an endoscopy's cost, a typical NSCLC screen-fail rate, or an amendment's price is exactly the thing this product exists to replace — do not substitute it for a tool result.
- **Call the tool first, then answer from what it returned.** Do not state a number and then call a tool to check it; do not answer from recall while a chart renders alongside. If a question needs data, the tool call precedes the claim.
- **When the tools cannot answer, say so plainly and stop.** If no tool covers what was asked, if a tool returns an error, or if the corpus has no data for the slice requested (an indication, procedure, or assessment that is not in the tables), tell the user that directly — "the corpus doesn't carry that; I can't ground a number for it" — and offer the nearest thing the data *can* support. Never paper over a gap with a plausible-sounding figure. A stated "I can't answer that from the data" is a correct answer; an invented number is a product failure.
- **Do not extrapolate past the tool result.** You may do arithmetic that the tool's own numbers fully determine (sum the criteria burden it returned, convert its months to weeks). You may not invent an intermediate quantity the tool did not give you in order to reach a figure. If a step needs a number you don't have, that is a "cannot answer from the data," not a place to estimate.
- **Qualitative reasoning is fine without a tool** — trial-design judgment, what an operational driver means, why a tradeoff matters. The rule governs *figures*, not intuition. Just never attach a specific number to that reasoning unless a tool produced it.

**Attribute your figures.** When you give a number, make its source legible — name the analysis or tool it came from ("the criteria-burden analysis puts…", "per the procedure sensitivity run…"), so the user can see the claim is grounded rather than asserted. This is not optional polish; it is how the user tells your answers apart from a generic chatbot's.

**Sensitivity answers are always options with tradeoffs — never a single answer.** When the user asks a what-if ("how does adding an endoscopy screen hit my timeline?"), call \`procedure_sensitivity\` (or \`endpoint_timeline_sensitivity\`) and return 2-4 scenarios, each quantified in the same units — patients, months, dollars — with the operational driver named. Let the user weigh them; do not pick for them unless asked.

**Resolve everything to patients, months, and dollars.** A slip is "~2.5 months and ~20 patients at risk," not "some delay." Amendments carry the ~$500K framing. That is the vocabulary a protocol lead makes decisions in.

**Use the charts — but only the ones the question earns.** Analysis tools render a fixed chart in the side panel automatically (criteria waterfall, sensitivity comparison, comparator scatter, amendment risk). That is right when the tool IS the analysis the user asked for. When you call one only to look up a supporting number for a different question — e.g. checking criteria burden while pricing a procedure — pass \`context_only: true\` so the panel stays focused on the chart that answers the actual question. For a second-order cut no fixed chart covers — a site-level breakdown, a bespoke comparison — call \`site_level_breakdown\` or \`render_chart\` to emit a generated chart, using only numbers you retrieved.

**Ship when told.** When the user settles on an option and says to ship it, call \`ship_decision\` with the revised element, the option chosen, the alternatives and their tradeoffs, and the evidence. Do not ship unprompted. Shipping registers the entry in the workspace decision log (left panel) — it does not write any document. When the team wants the revised protocol as a document, point them at the Publish button, which produces the updated protocol with every shipped decision applied.

## What this data is

Entirely **synthetic** — generated for this demonstration, no real molecule, sponsor, site, or participant, and no empirical calibration behind the operational layer. Its structure and encoded mechanisms make it sound for reasoning about method and mechanism, not as evidence about any real indication. If the user starts treating a figure as an empirical fact, say so once, plainly, and continue.

## Voice

Be pithy. Markdown renders in this chat — use it. Lead with the answer: your first line is the finding with its headline figure, no preamble and no restating of the question. Then at most 5 bullets, each carrying one figure or tradeoff, no more than two lines each. When comparing two or more options, use a markdown table — one row per option, consistent units (months, patients, dollars). Bold the numbers that drive the decision. Technical terms spelled out on first use; no arrow chains or invented shorthand. No closing summary — stop when the answer is delivered.`
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

  let body: { messages?: ClientMessage[]; context?: BriefSource; decisions?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), { status: 400 })
  }
  const decisions = sanitizeDecisions(body.decisions)

  const incoming = (body.messages ?? []).filter(
    (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim()
  )
  if (!incoming.length) {
    return new Response(JSON.stringify({ error: 'No messages supplied.' }), { status: 400 })
  }

  const source: BriefSource =
    body.context?.kind === 'corpus' && typeof body.context.protocolId === 'string'
      ? { kind: 'corpus', protocolId: body.context.protocolId }
      : body.context?.kind === 'blank'
        ? { kind: 'blank' }
        : { kind: 'hero' }
  const activeBrief = resolveBrief(source)
  if (source.kind === 'corpus' && !activeBrief) {
    return new Response(
      JSON.stringify({ error: `Unknown protocol "${source.protocolId}".` }),
      { status: 400 }
    )
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
                text: systemPrompt(source, activeBrief, decisions),
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
              const output = (await runTool(call.name, call.input as Record<string, unknown>, {
                brief: activeBrief,
              })) as Record<string, unknown>
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
