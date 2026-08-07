/**
 * The MCP surface of the Protocol Strategist — grounded-answer architecture.
 *
 * Deliberately small: the external model (Gemini, or any MCP host) never gets
 * the raw analytics tools or corpus data. It gets ask_strategist, whose answer
 * is produced end-to-end by the server-side grounded loop, plus guidance tools
 * (the left panel's blank-whiteboard fix), chart-gallery assembly, and the
 * Drive publish/review flows — whose document HTML is likewise authored
 * server-side. The client's only job is to relay what the tools return.
 */

import { fromJsonSchema, type CallToolResult, type McpServer } from '@modelcontextprotocol/server'

import { googleCredentialStatus, getDocMeta, readComments, readDoc } from '../googleDocs'
import { resolveBrief, type BriefSource, type ClientMessage } from '../strategistPrompt'
import { publishProtocol, PublishError, reviseDoc, type PublishDecision } from '../strategistPublish'
import { decodeChartToken, publicBaseUrl } from './chartToken'
import { ANALYTICS, DATA_CATEGORIES, MODE_DESCRIPTIONS, SUGGESTIONS, matchAnalyses } from './prompts'
import { runGroundedStrategist } from './strategistAnswer'

// ------------------------------------------------------------- utilities ---

function parseBriefSource(raw: unknown): BriefSource {
  if (typeof raw !== 'string' || !raw.trim() || raw === 'hero') return { kind: 'hero' }
  if (raw === 'blank') return { kind: 'blank' }
  return { kind: 'corpus', protocolId: raw.trim() }
}

function ok(payload: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] }
}

function fail(message: string, extra?: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ error: message, ...extra }) }],
    isError: true,
  }
}

async function guarded(run: () => Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await run()
  } catch (err) {
    if (err instanceof PublishError) return fail(err.message, err.extra)
    return fail(err instanceof Error ? err.message : String(err))
  }
}

function requireDrive(): CallToolResult | null {
  const status = googleCredentialStatus()
  if (!status.ok) return fail(`Google Drive is not configured for this deployment: ${status.detail}`)
  return null
}

const BRIEF_SOURCE_PROP = {
  brief_source: {
    type: 'string',
    description:
      'Which document to work on: "hero" (default — the pre-drafted Phase 2 NSCLC design brief), "blank" (design from scratch), or a corpus protocol id like "TCX-0042" (a completed trial under review).',
  },
} as const

const CONVERSATION_PROP = {
  conversation: {
    type: 'array',
    description:
      'Prior turns of THIS strategist session, oldest first, when the question is a follow-up. Pass the user questions and the strategist answer text from earlier ask_strategist calls so the strategist keeps context. Omit for a fresh question.',
    items: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['user', 'assistant'] },
        content: { type: 'string' },
      },
      required: ['role', 'content'],
    },
  },
} as const

const DECISIONS_PROP = {
  decisions: {
    type: 'array',
    description:
      'The shipped-decision log for this session. Every ask_strategist result may return shipped_decisions — accumulate them client-side and pass the full list back on every later call, so the strategist treats decided elements as settled.',
    items: {
      type: 'object',
      properties: {
        element_id: { type: 'string' },
        element_label: { type: 'string' },
        decision: { type: 'string' },
        rationale: { type: 'string' },
        alternatives_considered: {
          type: 'array',
          items: {
            type: 'object',
            properties: { option: { type: 'string' }, tradeoff: { type: 'string' } },
          },
        },
        evidence: { type: 'array', items: { type: 'string' } },
      },
      required: ['decision'],
    },
  },
} as const

// ---------------------------------------------------------------- server ---

export const SERVER_INFO = { name: 'protocol-strategist', version: '1.0.0' }

export const SERVER_INSTRUCTIONS = `Tweed Collective's Protocol Strategist: an AI clinical trial strategist grounded in a synthetic operations corpus (Phase 2 NSCLC focus). Start with get_started. Ask design and sensitivity questions through ask_strategist — its answers are produced under an enforced server-side grounding contract (every figure traces to a corpus tool call), so relay them faithfully and NEVER add, adjust, or estimate quantitative figures yourself. Present chart_url links to the user; they open rendered charts. Carry shipped_decisions and conversation turns forward between calls. Publish the updated protocol to Google Drive with publish_protocol; run the comment-revision loop with read_doc_comments and revise_doc.`

export function registerStrategist(server: McpServer): void {
  // ---- the product: grounded Q&A --------------------------------------
  server.registerTool(
    'ask_strategist',
    {
      title: 'Ask the Protocol Strategist',
      description:
        'Ask the Protocol Strategist a clinical trial design or sensitivity question ("Which criteria cost us the most patients?", "How does an added endoscopy screen hit my timeline?"). The strategist runs its own grounded analysis loop server-side against the operations corpus and returns a finished answer: every figure in it was retrieved by a corpus tool during the call. Relay the answer faithfully — do not add or adjust numbers. Results may include chart_url links (rendered charts — show them to the user) and shipped_decisions (accumulate and pass back on later calls).',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: "The user's question, phrased as they asked it.",
          },
          ...BRIEF_SOURCE_PROP,
          ...CONVERSATION_PROP,
          ...DECISIONS_PROP,
        },
        required: ['question'],
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      return guarded(async () => {
        const result = await runGroundedStrategist({
          question: String(input.question ?? ''),
          source: parseBriefSource(input.brief_source),
          conversation: input.conversation as ClientMessage[] | undefined,
          decisions: input.decisions,
        })
        return ok({
          ...result,
          relay_instructions:
            'Present the answer to the user as-is (markdown). Do not alter or add quantitative figures. Offer the chart_url links. If shipped_decisions is non-empty, keep the entries and include them in the decisions array of future ask_strategist and publish_protocol calls.',
        })
      })
    }
  )

  // ---- guidance: the left panel, as tools ------------------------------
  server.registerTool(
    'get_started',
    {
      title: 'Get started with the Protocol Strategist',
      description:
        'Call this first. Returns what the Protocol Strategist is, the three session modes, ready-to-use starter questions, the data categories the corpus covers, and the catalog of one-click analyses — everything needed to guide a user who does not know what to ask.',
      inputSchema: fromJsonSchema({ type: 'object', properties: {} }),
    },
    async () =>
      ok({
        what_this_is:
          'An AI clinical trial strategist for pressure-testing protocol designs against operational history. Behind it sits a synthetic corpus of protocols and investigational sites (thoracic oncology / NSCLC focus) joined with operational outcomes: screen-fail and dropout rates, amendment timing and cost, enrollment durations, per-procedure scheduling and refusal data.',
        modes: (Object.keys(MODE_DESCRIPTIONS) as Array<keyof typeof MODE_DESCRIPTIONS>).map(
          (mode) => ({
            brief_source: mode === 'corpus' ? 'a protocol id, e.g. TCX-0042' : mode,
            description: MODE_DESCRIPTIONS[mode],
            starter_questions: SUGGESTIONS[mode],
          })
        ),
        data_categories: DATA_CATEGORIES,
        analyses: ANALYTICS.map((a) => ({
          id: a.id,
          label: a.label,
          renders: a.chart,
          relates: a.categories,
          question: a.prompt,
        })),
        how_to_use: [
          'Every question goes through ask_strategist — the strategist analyzes server-side and returns a grounded answer. Relay it without adding numbers of your own.',
          'For follow-ups, pass the prior turns in conversation and any shipped_decisions in decisions.',
          'Chart results carry a chart_url — share the link; it opens the rendered chart. Combine several with build_chart_gallery.',
          'When the user settles a design decision and says to ship it, ask_strategist records it and returns it in shipped_decisions — carry those forward.',
          'publish_protocol writes the updated protocol (decisions applied) to Google Drive as a Google Doc. After a human adds margin comments, read_doc_comments shows them and revise_doc produces the comment-keyed revision.',
        ],
        data_caveat:
          'The corpus is entirely synthetic — generated for demonstration. Sound for reasoning about method and mechanism, not evidence about any real indication.',
      })
  )

  server.registerTool(
    'list_analyses',
    {
      title: 'List available analyses',
      description:
        'Browse the catalog of one-click analyses by data category (eligibility, procedures, enrollment, sites, endpoints, amendments). Returns ready-to-ask questions for ask_strategist. With no categories, returns the single-category starters.',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          categories: {
            type: 'array',
            items: {
              type: 'string',
              enum: DATA_CATEGORIES.map((c) => c.key),
            },
            description: 'Data categories to relate. Analyses matching all given categories rank first.',
          },
        },
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      const categories = Array.isArray(input.categories) ? input.categories.map(String) : []
      return ok({
        analyses: matchAnalyses(categories).map((a) => ({
          id: a.id,
          label: a.label,
          renders: a.chart,
          relates: a.categories,
          question: a.prompt,
        })),
        usage: 'Feed a question verbatim to ask_strategist.',
      })
    }
  )

  // ---- charts ----------------------------------------------------------
  server.registerTool(
    'build_chart_gallery',
    {
      title: 'Build a chart gallery',
      description:
        'Combine chart_tokens collected from ask_strategist results into one gallery page — the equivalent of the workspace insight panel. Returns a gallery_url to share with the user.',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          chart_tokens: {
            type: 'array',
            items: { type: 'string' },
            description: 'chart_token values from previous ask_strategist results, in display order.',
          },
        },
        required: ['chart_tokens'],
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      const tokens = Array.isArray(input.chart_tokens) ? input.chart_tokens.map(String) : []
      if (!tokens.length) return fail('chart_tokens is empty.')
      const invalid = tokens.filter((t) => !decodeChartToken(t))
      if (invalid.length) {
        return fail(
          `${invalid.length} of ${tokens.length} tokens are not valid chart tokens. Pass chart_token values exactly as returned.`
        )
      }
      const joined = tokens.join(',')
      if (joined.length > 100_000) {
        return fail('Too many charts for one gallery URL — split into two galleries.')
      }
      return ok({
        gallery_url: `${publicBaseUrl()}/charts/gallery#t=${joined}`,
        charts: tokens.length,
      })
    }
  )

  // ---- Google Drive: publish and the comment-revision loop -------------
  server.registerTool(
    'publish_protocol',
    {
      title: 'Publish the updated protocol to Google Drive',
      description:
        'Produce the updated protocol document — the design brief with every shipped decision applied in place — as a Google Doc in the configured Drive folder. The document is authored server-side by the strategist from the decision log; do not write protocol text yourself. Returns the Doc link. Optionally shares it with a reviewer by email.',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          ...DECISIONS_PROP,
          ...BRIEF_SOURCE_PROP,
          ...CONVERSATION_PROP,
          title: { type: 'string', description: 'Document title. Defaults to "<brief title> — Updated Protocol".' },
          share_with: { type: 'string', description: 'Email address to share the document with (writer access).' },
        },
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      const denied = requireDrive()
      if (denied) return denied
      return guarded(async () => {
        const decisions = Array.isArray(input.decisions)
          ? (input.decisions as PublishDecision[]).slice(0, 50)
          : []
        const conversation = Array.isArray(input.conversation)
          ? (input.conversation as ClientMessage[])
          : []
        const transcript = conversation
          .filter((m) => typeof m.content === 'string' && m.content.trim())
          .map((m) => `${m.role === 'user' ? 'Study team' : 'Strategist'}: ${m.content}`)
          .join('\n\n')
        const result = await publishProtocol({
          brief: resolveBrief(parseBriefSource(input.brief_source)),
          decisions,
          transcript,
          title: typeof input.title === 'string' ? input.title : undefined,
          shareWith: typeof input.share_with === 'string' ? input.share_with : undefined,
        })
        return ok({
          ...result,
          next_step:
            'Share webViewLink with the user. After a human reviewer adds margin comments in Google Docs, read_doc_comments lists them and revise_doc produces the revision.',
        })
      })
    }
  )

  server.registerTool(
    'read_doc',
    {
      title: 'Read a published Google Doc',
      description:
        'Read back a Google Doc this workspace published (or any Doc the service account can see): metadata plus the document text.',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          file_id: { type: 'string', description: 'The Google Doc file id (from a publish result or Doc URL).' },
          format: { type: 'string', enum: ['text', 'html'], description: 'Export format. Default text.' },
        },
        required: ['file_id'],
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      const denied = requireDrive()
      if (denied) return denied
      return guarded(async () => {
        const fileId = String(input.file_id ?? '').trim()
        if (!fileId) return fail('file_id is required.')
        const format = input.format === 'html' ? 'html' : 'text'
        const [meta, content] = await Promise.all([getDocMeta(fileId), readDoc(fileId, format)])
        return ok({ document: meta, format, content })
      })
    }
  )

  server.registerTool(
    'read_doc_comments',
    {
      title: 'Read a Google Doc’s margin comments',
      description:
        'List the human comment threads on a published Google Doc, each with the text it is anchored to and its resolved state. Use before revise_doc to show the user what reviewers asked for.',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          file_id: { type: 'string', description: 'The Google Doc file id.' },
        },
        required: ['file_id'],
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      const denied = requireDrive()
      if (denied) return denied
      return guarded(async () => {
        const fileId = String(input.file_id ?? '').trim()
        if (!fileId) return fail('file_id is required.')
        const comments = await readComments(fileId)
        return ok({
          open: comments.filter((c) => !c.resolved),
          resolved: comments.filter((c) => c.resolved),
        })
      })
    }
  )

  server.registerTool(
    'revise_doc',
    {
      title: 'Revise a Doc from its margin comments',
      description:
        'Run the review loop on a published Google Doc: reads the document and its OPEN margin comments, then produces a revised Doc B — authored server-side — whose change log is keyed to each comment. Do not write the revision yourself. Fails with guidance if the document has no open comments.',
      inputSchema: fromJsonSchema({
        type: 'object',
        properties: {
          file_id: { type: 'string', description: 'The Google Doc file id to revise.' },
          share_with: { type: 'string', description: 'Email address to share the revision with (writer access).' },
        },
        required: ['file_id'],
      }),
    },
    async (args) => {
      const input = (args ?? {}) as Record<string, unknown>
      const denied = requireDrive()
      if (denied) return denied
      return guarded(async () => {
        const fileId = String(input.file_id ?? '').trim()
        if (!fileId) return fail('file_id is required.')
        const result = await reviseDoc({
          fileId,
          shareWith: typeof input.share_with === 'string' ? input.share_with : undefined,
        })
        return ok(result)
      })
    }
  )

  registerPrompts(server)
}

// --------------------------------------------------------------- prompts ---

/**
 * The left panel's one-click analyses and mode starters as MCP prompts.
 * Clients that surface prompts (Gemini CLI shows them as slash commands) get
 * the same guided on-ramps as the web workspace; tool-only clients (ADK) get
 * the identical catalog through get_started / list_analyses.
 */
function registerPrompts(server: McpServer): void {
  const briefSourceArg = fromJsonSchema({
    type: 'object',
    properties: {
      brief_source: {
        type: 'string',
        description: 'Optional: "hero" (default), "blank", or a corpus protocol id like "TCX-0042".',
      },
    },
  })

  for (const a of ANALYTICS) {
    server.registerPrompt(
      a.id,
      {
        title: a.label,
        description: `${a.label} — renders: ${a.chart}. Relates: ${a.categories.join(' × ')}.`,
        argsSchema: briefSourceArg,
      },
      (args) => {
        const source = (args as Record<string, unknown> | undefined)?.brief_source
        const scope = typeof source === 'string' && source.trim() ? ` (brief_source: ${source.trim()})` : ''
        return {
          messages: [
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: `Use the ask_strategist tool${scope} with this question, then relay its grounded answer and any chart links:\n\n${a.prompt}`,
              },
            },
          ],
        }
      }
    )
  }

  const starters: Array<{ name: string; mode: 'hero' | 'blank'; title: string }> = [
    { name: 'start-hero-review', mode: 'hero', title: 'Pressure-test the drafted design brief' },
    { name: 'start-blank-design', mode: 'blank', title: 'Design a protocol from a blank page' },
  ]
  for (const s of starters) {
    server.registerPrompt(
      s.name,
      { title: s.title, description: MODE_DESCRIPTIONS[s.mode] },
      () => ({
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `Start a Protocol Strategist session${s.mode === 'blank' ? ' with brief_source "blank"' : ''}. First call get_started, tell me briefly what the strategist can do in this mode, and offer these starter questions:\n\n${SUGGESTIONS[s.mode].map((q) => `- ${q}`).join('\n')}`,
            },
          },
        ],
      })
    )
  }

  server.registerPrompt(
    'start-corpus-review',
    {
      title: 'Review a completed trial from the corpus',
      description: MODE_DESCRIPTIONS.corpus,
      argsSchema: fromJsonSchema({
        type: 'object',
        properties: {
          protocol_id: { type: 'string', description: 'Corpus protocol id, e.g. TCX-0042.' },
        },
        required: ['protocol_id'],
      }),
    },
    (args) => {
      const id = String((args as Record<string, unknown> | undefined)?.protocol_id ?? '').trim()
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `Start a Protocol Strategist session on corpus protocol ${id} (pass brief_source: "${id}" to ask_strategist). Offer these starter questions:\n\n${SUGGESTIONS.corpus.map((q) => `- ${q}`).join('\n')}`,
            },
          },
        ],
      }
    }
  )
}
