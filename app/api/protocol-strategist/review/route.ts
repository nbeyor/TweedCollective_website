/**
 * Review — read a document back with its comment threads and produce a revised
 * document (Doc B).
 *
 * Doc B is a separate file, not tracked changes: the Drive API exposes neither
 * Google Docs suggestion mode nor edit-in-place. So the revision carries a
 * change log at the top, each entry keyed to the comment it answers — which is
 * the part that makes the loop read as collaboration rather than regeneration.
 *
 * POST { fileId, shareWith? }
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { createDoc, getDocMeta, readComments, readDoc, shareDoc } from '@/lib/googleDocs'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

const REVIEW_SYSTEM = `You are revising a working document in response to a reviewer's margin comments.

Output **HTML only** — no markdown, no code fences, no commentary before or after. Use h1 for the title, h2/h3 for sections, p, ul/ol, strong/em, and table where genuinely tabular. No <html>/<head>/<body> tags, no inline styles.

Open the document with an h2 section titled "Changes in this revision". Under it, one bullet per comment you addressed, in this shape:

  <li><strong>[C1]</strong> Reviewer asked &lt;what they asked&gt; — &lt;what you changed, or why you did not&gt;</li>

Use the comment reference numbers exactly as given to you. Every comment gets an entry, including ones you decided not to act on — say so and give the reason in a clause. Do not invent comments that were not raised.

Then reproduce the full revised document beneath, with the changes incorporated in place. Revise only what the comments call for and what those changes make inconsistent elsewhere; leave the rest of the author's text alone. You are answering margin notes, not rewriting someone else's document.

Where a comment asks a question rather than requesting a change, answer it in the document text if the answer belongs there, and note in the change log that you did.`

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
    const [meta, text, comments] = await Promise.all([
      getDocMeta(fileId),
      readDoc(fileId, 'text'),
      readComments(fileId),
    ])

    const open = comments.filter((c) => !c.resolved)
    if (!open.length) {
      return Response.json(
        {
          error:
            'That document has no open comments. Add margin comments in Google Docs, then run review again.',
          document: meta,
          resolvedComments: comments.length,
        },
        { status: 409 }
      )
    }

    const commentBlock = open
      .map((c, i) => {
        const anchor = c.quotedText ? `\n  anchored to: "${c.quotedText}"` : '\n  (not anchored to specific text)'
        const replies = c.replies.length
          ? `\n  thread: ${c.replies.map((r) => `${r.author}: ${r.content}`).join(' | ')}`
          : ''
        return `[C${i + 1}] ${c.author}: ${c.content}${anchor}${replies}`
      })
      .join('\n\n')

    const client = new Anthropic()
    const res = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      output_config: { effort: 'high' },
      system: REVIEW_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Revise the document below in response to the reviewer's comments.\n\n## Reviewer comments\n\n${commentBlock}\n\n## Current document: ${meta.name}\n\n${text}`,
        },
      ],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming)

    if (res.stop_reason === 'refusal') {
      return Response.json({ error: 'The model declined to revise this document.' }, { status: 422 })
    }

    const html = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .replace(/^\s*```(?:html)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim()

    if (!html) return Response.json({ error: 'The model returned no revision.' }, { status: 502 })

    const revision = await createDoc({
      title: `${meta.name} — revised`,
      html,
    })

    if (body.shareWith?.includes('@')) {
      try {
        await shareDoc(revision.id, body.shareWith, 'writer')
      } catch {
        // Non-fatal: the revision exists and is linkable.
      }
    }

    return Response.json({
      source: meta,
      revision,
      commentsAddressed: open.length,
      comments: open.map((c, i) => ({
        ref: `C${i + 1}`,
        author: c.author,
        content: c.content,
        quotedText: c.quotedText,
      })),
      usage: res.usage,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
