/**
 * Publish — produce the updated protocol as a Google Doc.
 *
 * Thin wrapper over lib/strategistPublish.ts (shared with the MCP
 * publish_protocol tool). The one artifact this workspace writes to Drive is
 * the protocol itself: the design brief with every shipped decision applied
 * in place. The decision log is registered separately in the workspace and is
 * NOT part of the published document.
 *
 * POST { messages: [{role, content}], context?, decisions?, title?, shareWith? }
 */

import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { resolveBrief, type BriefSource } from '@/lib/strategistPrompt'
import { publishProtocol, PublishError, type PublishDecision } from '@/lib/strategistPublish'
import { resolveTemplate } from '@/lib/strategistTemplates'
import { designBrief, type DesignBrief } from '@/lib/trialCorpus'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

function briefFromContext(source: unknown): DesignBrief | null {
  const s = source as BriefSource | undefined
  if (!s) return designBrief() // no context sent — the hero brief is the default document
  return resolveBrief(s)
}

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 503 })
  }

  let body: {
    messages?: ClientMessage[]
    context?: unknown
    decisions?: PublishDecision[]
    title?: string
    shareWith?: string
    template?: { key?: string; customOutline?: string }
  }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const brief = briefFromContext(body.context)
  const decisions = Array.isArray(body.decisions) ? body.decisions.slice(0, 50) : []
  const template = resolveTemplate(body.template?.key, body.template?.customOutline)

  const transcript = (body.messages ?? [])
    .filter((m) => typeof m.content === 'string' && m.content.trim())
    .map((m) => `${m.role === 'user' ? 'Study team' : 'Strategist'}: ${m.content}`)
    .join('\n\n')

  try {
    const result = await publishProtocol({
      brief,
      decisions,
      transcript,
      title: body.title,
      shareWith: body.shareWith,
      template,
    })
    return Response.json(result)
  } catch (err) {
    if (err instanceof PublishError) {
      return Response.json({ error: err.message, ...err.extra }, { status: err.status })
    }
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
