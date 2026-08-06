/**
 * Codify — turn the strategy conversation into a Google Doc (Doc A).
 *
 * The model writes HTML rather than plain text so Drive's conversion preserves
 * headings, tables, and emphasis. The document is written to the configured
 * Drive folder and optionally shared with a reviewer.
 *
 * POST { messages: [{role, content}], title?, shareWith? }
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { createDoc, shareDoc } from '@/lib/googleDocs'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

const DOC_SYSTEM = `You are turning a protocol strategy conversation into a working document a study team will edit and comment on.

Output **HTML only** — no markdown, no code fences, no commentary before or after. Use h1 for the title, h2/h3 for sections, p, ul/ol, strong/em, and table/tr/th/td where the content is genuinely tabular. Do not include <html>, <head>, or <body> tags; start at the h1. Do not use inline styles or CSS — Google Docs discards them and they make the file harder to edit.

Write the document the conversation earned, not a template. Include the recommendations that were actually reached, the evidence behind them, and the open questions — and leave out sections the conversation never covered. A reader who was not in the conversation should be able to act on it.

Structure it so it can be commented on: put each distinct recommendation under its own heading, so a reviewer's margin note attaches to something specific rather than to a wall of text.

End with a short section titled "Provenance and limits" stating that the supporting figures come from a synthetic demonstration corpus generated for this exercise — no real sponsor, site, or participant — and are sound for reasoning about mechanism but not as evidence about any real indication.`

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Models sometimes wrap HTML in a fence despite instructions. Strip it. */
function unfence(s: string): string {
  return s
    .replace(/^\s*```(?:html)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()
}

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 503 })
  }

  let body: { messages?: ClientMessage[]; title?: string; shareWith?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const transcript = (body.messages ?? [])
    .filter((m) => typeof m.content === 'string' && m.content.trim())
    .map((m) => `${m.role === 'user' ? 'Study team' : 'Strategist'}: ${m.content}`)
    .join('\n\n')

  if (!transcript) {
    return Response.json({ error: 'No conversation to codify.' }, { status: 400 })
  }

  try {
    const client = new Anthropic()
    const res = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      output_config: { effort: 'high' },
      system: DOC_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Codify this strategy conversation into a working document.\n\n---\n\n${transcript}`,
        },
      ],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming)

    if (res.stop_reason === 'refusal') {
      return Response.json({ error: 'The model declined to produce this document.' }, { status: 422 })
    }

    const html = unfence(
      res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
    )
    if (!html) return Response.json({ error: 'The model returned no document content.' }, { status: 502 })

    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    const title =
      body.title?.trim() ||
      (titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '') ||
      'Protocol Strategy Working Document'

    const doc = await createDoc({ title, html })

    if (body.shareWith?.includes('@')) {
      try {
        await shareDoc(doc.id, body.shareWith, 'writer')
      } catch (err) {
        // The document exists; a sharing failure shouldn't discard it.
        return Response.json({
          ...doc,
          shared: false,
          shareError: err instanceof Error ? err.message : String(err),
          usage: res.usage,
        })
      }
    }

    return Response.json({ ...doc, shared: Boolean(body.shareWith), usage: res.usage })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
