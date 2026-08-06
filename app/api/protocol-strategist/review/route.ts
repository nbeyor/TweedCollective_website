/**
 * Review — read a document back with its comment threads and produce a revised
 * document (Doc B).
 *
 * Thin wrapper over lib/strategistPublish.ts reviseDoc (shared with the MCP
 * revise_doc tool). Doc B is a separate file, not tracked changes: the Drive
 * API exposes neither Google Docs suggestion mode nor edit-in-place. So the
 * revision carries a change log at the top, each entry keyed to the comment it
 * answers — which is the part that makes the loop read as collaboration rather
 * than regeneration.
 *
 * POST { fileId, shareWith? }
 */

import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { PublishError, reviseDoc } from '@/lib/strategistPublish'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 503 })
  }

  let body: { fileId?: string; shareWith?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const fileId = body.fileId?.trim()
  if (!fileId) return Response.json({ error: 'fileId is required.' }, { status: 400 })

  try {
    const result = await reviseDoc({ fileId, shareWith: body.shareWith })
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
