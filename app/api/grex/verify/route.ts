/**
 * GREX live verification endpoint.
 *
 * POST { surface, content, mode? } → SSE frames:
 *   answer_delta { text }   (answer_verify mode: the generated answer, streaming)
 *   answer       { text }   (answer_verify mode: the complete answer)
 *   state  { state: EXTRACTING | SEARCHING | EVALUATING }
 *   result { result: VerificationResult }
 *   done   { usage }
 *   error  { error }
 *
 * mode 'verify' (default) verifies the submitted content directly.
 * mode 'answer_verify' (mcp surface) first generates an assistant answer to
 * the submitted question, then verifies THE ANSWER — the agent-integration
 * pattern: draft, verify, then present with a score line.
 *
 * One Claude conversation runs the verification: the web_search server tool
 * retrieves real evidence, and a strict submit_verification tool call
 * returns the structured result (robust alongside search citation blocks,
 * and the same tool-loop idiom as the other workspace endpoints).
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { runVerification } from '@/lib/grex/runVerification'
import type { GrexSurface } from '@/lib/grex/types'

export const runtime = 'nodejs'
export const maxDuration = 300

const WORKSPACE_SLUG = 'grex'
const MODEL = 'claude-opus-5'
const MAX_CONTENT_CHARS = 6000

const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const
type Effort = (typeof EFFORTS)[number]
const ANSWER_EFFORT: Effort = 'low'

/** MMS is a worker surface. It is not exposed on this Clerk-gated route. */
const SURFACES: GrexSurface[] = ['browser', 'screenshot', 'mcp']

// Processing states are monotonic for the client stepper.
const STAGE_ORDER = ['EXTRACTING', 'SEARCHING', 'EVALUATING'] as const

const ANSWER_SYSTEM = `You are a concise, knowledgeable assistant. Answer the user's question directly in two to five sentences. Include specific facts — names, dates, figures — where they belong in a good answer; a creative or subjective request gets a creative or subjective answer with no invented facts. Plain prose only, no headers or lists.`

type Send = (type: string, data?: object) => void

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured for this deployment.' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    )
  }

  let body: { surface?: string; content?: string; mode?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), { status: 400 })
  }

  const surface = body.surface as GrexSurface
  if (!SURFACES.includes(surface)) {
    return new Response(JSON.stringify({ error: 'Unknown surface.' }), { status: 400 })
  }
  const mode = body.mode === 'answer_verify' ? 'answer_verify' : 'verify'
  if (mode === 'answer_verify' && surface !== 'mcp') {
    return new Response(JSON.stringify({ error: 'answer_verify is only available on the mcp surface.' }), {
      status: 400,
    })
  }
  const content = typeof body.content === 'string' ? body.content.trim().slice(0, MAX_CONTENT_CHARS) : ''
  const minChars = mode === 'answer_verify' ? 8 : 20
  if (content.length < minChars) {
    return new Response(JSON.stringify({ error: 'Provide at least a sentence or two.' }), {
      status: 400,
    })
  }

  const client = new Anthropic()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send: Send = (type, data = {}) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, ...data })}\n\n`))
        } catch {
          /* client went away */
        }
      }

      // Keepalive so proxies don't buffer/close during long thinking spans.
      const heartbeat = setInterval(() => send('ping'), 10_000)

      let stageIdx = 0
      const advanceStage = (stage: (typeof STAGE_ORDER)[number]) => {
        const idx = STAGE_ORDER.indexOf(stage)
        if (idx > stageIdx) {
          stageIdx = idx
          send('state', { state: stage })
        }
      }

      const usage = { input_tokens: 0, output_tokens: 0 }

      try {
        let toVerify = content

        if (mode === 'answer_verify') {
          // Phase 1: generate the assistant answer, streaming it to the client.
          const answerStream = client.messages.stream({
            model: MODEL,
            max_tokens: 1024,
            thinking: { type: 'adaptive' },
            output_config: { effort: ANSWER_EFFORT },
            system: ANSWER_SYSTEM,
            messages: [{ role: 'user', content }],
          })
          answerStream.on('text', (delta) => send('answer_delta', { text: delta }))
          const answerMessage = await answerStream.finalMessage()
          usage.input_tokens += answerMessage.usage.input_tokens
          usage.output_tokens += answerMessage.usage.output_tokens
          const answerText = answerMessage.content
            .filter((b): b is Anthropic.TextBlock => b.type === 'text')
            .map((b) => b.text)
            .join('')
            .trim()
          send('answer', { text: answerText })
          if (!answerText) {
            send('error', { error: 'No answer was generated. Try again.' })
            return
          }
          toVerify = answerText
        }

        // Phase 2: verify (the answer in answer_verify mode, else the content).
        send('state', { state: 'EXTRACTING' })
        const outcome = await runVerification({
          client,
          surface,
          content: toVerify,
          onStage: advanceStage,
        })
        usage.input_tokens += outcome.usage.input_tokens
        usage.output_tokens += outcome.usage.output_tokens
        if (outcome.ok) {
          send('result', { result: outcome.result })
          send('done', { usage })
        } else {
          send('error', { error: 'The check ran out of rounds without producing a result. Try again.' })
        }
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? `Verification service error (${err.status ?? 'network'}).`
            : 'Verification failed unexpectedly.'
        console.error('[grex/verify]', err)
        send('error', { error: message })
      } finally {
        clearInterval(heartbeat)
        try {
          controller.close()
        } catch {
          /* already closed */
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}
