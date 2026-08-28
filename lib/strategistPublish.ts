/**
 * Server-side publish and review flows for the Protocol Strategist.
 *
 * Extracted from app/api/protocol-strategist/codify/route.ts and
 * review/route.ts so the web workspace routes and the MCP tools
 * (publish_protocol, revise_doc) run the exact same document authoring.
 * The document HTML is ALWAYS written by the server-side model under these
 * system prompts — never by an external client — which is what keeps the
 * published protocol on the right side of the grounding contract.
 */

import Anthropic from '@anthropic-ai/sdk'

import { createDoc, getDocMeta, readComments, readDoc, shareDoc, type DocRef } from './googleDocs'
import type { DesignBrief } from './trialCorpus'

const DOC_SYSTEM = `You are producing the updated protocol design document for a clinical trial. You are given the current design brief, the decision log (decisions the study team has already shipped), and the strategy conversation for context.

Output **HTML only** — no markdown, no code fences, no commentary before or after. Use h1 for the title, h2/h3 for sections, p, ul/ol, strong/em, and table/tr/th/td where the content is genuinely tabular. Do not include <html>, <head>, or <body> tags; start at the h1. Do not use inline styles or CSS — Google Docs discards them and they make the file harder to edit.

Write the protocol, not a report about the session:

- Reproduce the full design — indication, phase, objectives and endpoints, arms and randomization, eligibility criteria, target enrollment and site plan, schedule of assessments — as a complete document a study team can take to protocol writing.
- Apply every decision from the decision log **in place**: a dropped criterion is absent, a revised element appears in its revised form, an added element appears where it belongs. Where a decision changed an element, you may mark it inline with a brief parenthetical "(revised)" — nothing more.
- Do NOT include a decision log, a "summary of where things stand", meeting notes, rationale sections, or any narrative about the conversation. The decision log lives in the workspace, not in this document. Open questions the team has explicitly left open may appear as a short "Open items" list at the end.
- If no design brief is provided (the team started from a blank page), draft the protocol the conversation converged on, applying the same rules.

End with a short section titled "Provenance and limits" stating that the supporting figures come from a synthetic demonstration corpus generated for this exercise — no real sponsor, site, or participant — and are sound for reasoning about mechanism but not as evidence about any real indication.`

const REVIEW_SYSTEM = `You are revising a working document in response to a reviewer's margin comments.

Output **HTML only** — no markdown, no code fences, no commentary before or after. Use h1 for the title, h2/h3 for sections, p, ul/ol, strong/em, and table where genuinely tabular. No <html>/<head>/<body> tags, no inline styles.

Open the document with an h2 section titled "Changes in this revision". Under it, one bullet per comment you addressed, in this shape:

  <li><strong>[C1]</strong> Reviewer asked &lt;what they asked&gt; — &lt;what you changed, or why you did not&gt;</li>

Use the comment reference numbers exactly as given to you. Every comment gets an entry, including ones you decided not to act on — say so and give the reason in a clause. Do not invent comments that were not raised.

Then reproduce the full revised document beneath, with the changes incorporated in place. Revise only what the comments call for and what those changes make inconsistent elsewhere; leave the rest of the author's text alone. You are answering margin notes, not rewriting someone else's document.

Where a comment asks a question rather than requesting a change, answer it in the document text if the answer belongs there, and note in the change log that you did.`

export interface PublishDecision {
  element_id?: string
  element_label?: string
  decision?: string
  rationale?: string
  alternatives_considered?: Array<{ option?: string; tradeoff?: string }>
  evidence?: string[]
}

function decisionBlock(decisions: PublishDecision[]): string {
  if (!decisions.length) return 'No decisions have been shipped yet — publish the design as it stands.'
  return decisions
    .map((d, i) => {
      const lines = [`${i + 1}. ${d.element_label ?? d.element_id ?? 'Element'}: ${d.decision ?? ''}`]
      if (d.rationale) lines.push(`   Why: ${d.rationale}`)
      for (const a of d.alternatives_considered ?? []) {
        if (a?.option) lines.push(`   Rejected: ${a.option}${a.tradeoff ? ` — ${a.tradeoff}` : ''}`)
      }
      for (const e of d.evidence ?? []) lines.push(`   Evidence: ${e}`)
      return lines.join('\n')
    })
    .join('\n')
}

/** Models sometimes wrap HTML in a fence despite instructions. Strip it. */
function unfence(s: string): string {
  return s
    .replace(/^\s*```(?:html)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()
}

export class PublishError extends Error {
  constructor(
    message: string,
    readonly status: number = 500,
    readonly extra?: Record<string, unknown>
  ) {
    super(message)
  }
}

/**
 * Codify: the model applies the decision log to the brief, writes the protocol
 * HTML, and the document lands in Drive. Returns the DocRef plus share status.
 */
export async function publishProtocol(opts: {
  brief: DesignBrief | null
  decisions: PublishDecision[]
  transcript?: string
  title?: string
  shareWith?: string
  /** Optional output template: the document follows this structure instead of the default full protocol. */
  template?: { label: string; outline: string } | null
}): Promise<DocRef & { shared: boolean; shareError?: string; usage: unknown }> {
  const { brief, decisions } = opts
  if (!opts.transcript && !decisions.length) {
    throw new PublishError('Nothing to publish — no conversation or shipped decisions.', 400)
  }

  const sections: string[] = ['Produce the updated protocol document.']
  sections.push(
    brief
      ? `## Current design brief\n\n${JSON.stringify(brief, null, 2)}`
      : '## Current design brief\n\nNone — the team started from a blank page; draft the protocol from the conversation.'
  )
  sections.push(`## Decision log (already shipped — apply in place)\n\n${decisionBlock(decisions)}`)
  if (opts.template?.outline) {
    sections.push(
      `## Output template (structure requirement)\n\nThe team selected an output template: **${opts.template.label}**. ${opts.template.outline}\n\nThe template governs STRUCTURE only — every other rule above still holds: decisions applied in place, no session narrative, no invented figures, and the closing "Provenance and limits" section stays.`
    )
  }
  if (opts.transcript) sections.push(`## Strategy conversation (context only)\n\n${opts.transcript}`)

  const client = new Anthropic()
  const res = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    output_config: { effort: 'high' },
    system: DOC_SYSTEM,
    messages: [{ role: 'user', content: sections.join('\n\n---\n\n') }],
  } as unknown as Anthropic.MessageCreateParamsNonStreaming)

  if (res.stop_reason === 'refusal') {
    throw new PublishError('The model declined to produce this document.', 422)
  }

  const html = unfence(
    res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
  )
  if (!html) throw new PublishError('The model returned no document content.', 502)

  const docKind = opts.template?.label ?? 'Updated Protocol'
  const title = opts.title?.trim() || (brief ? `${brief.title} — ${docKind}` : `${docKind} — Draft`)

  const doc = await createDoc({ title, html })

  if (opts.shareWith?.includes('@')) {
    try {
      await shareDoc(doc.id, opts.shareWith, 'writer')
    } catch (err) {
      // The document exists; a sharing failure shouldn't discard it.
      return {
        ...doc,
        shared: false,
        shareError: err instanceof Error ? err.message : String(err),
        usage: res.usage,
      }
    }
  }

  return { ...doc, shared: Boolean(opts.shareWith), usage: res.usage }
}

export interface ReviseResult {
  source: DocRef
  revision: DocRef
  commentsAddressed: number
  comments: Array<{ ref: string; author: string; content: string; quotedText: string | null }>
  usage: unknown
}

/**
 * Review: read a Doc back with its open comment threads and produce a revised
 * Doc B whose change log is keyed to those comments.
 */
export async function reviseDoc(opts: { fileId: string; shareWith?: string }): Promise<ReviseResult> {
  const [meta, text, comments] = await Promise.all([
    getDocMeta(opts.fileId),
    readDoc(opts.fileId, 'text'),
    readComments(opts.fileId),
  ])

  const open = comments.filter((c) => !c.resolved)
  if (!open.length) {
    throw new PublishError(
      'That document has no open comments. Add margin comments in Google Docs, then run review again.',
      409,
      { document: meta, resolvedComments: comments.length }
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
    throw new PublishError('The model declined to revise this document.', 422)
  }

  const html = unfence(
    res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
  )
  if (!html) throw new PublishError('The model returned no revision.', 502)

  const revision = await createDoc({ title: `${meta.name} — revised`, html })

  if (opts.shareWith?.includes('@')) {
    try {
      await shareDoc(revision.id, opts.shareWith, 'writer')
    } catch {
      // Non-fatal: the revision exists and is linkable.
    }
  }

  return {
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
  }
}
