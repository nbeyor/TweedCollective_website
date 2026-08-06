/**
 * Publish — produce the updated protocol as a Google Doc.
 *
 * The one artifact this workspace writes to Drive is the protocol itself: the
 * design brief with every shipped decision applied in place. The decision log
 * is registered separately in the workspace (left panel, chat) and is NOT part
 * of the published document — a reader gets the protocol as it now stands, not
 * a meeting report about how it got there.
 *
 * The model writes HTML rather than plain text so Drive's conversion preserves
 * headings, tables, and emphasis. The document is written to the configured
 * Drive folder and optionally shared with a reviewer.
 *
 * POST { messages: [{role, content}], context?, decisions?, title?, shareWith? }
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { createDoc, shareDoc } from '@/lib/googleDocs'
import { deriveBriefFromProtocol, designBrief, type DesignBrief } from '@/lib/trialCorpus'

import type { BriefSource } from '../route'

export const runtime = 'nodejs'
export const maxDuration = 300

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

const DOC_SYSTEM = `You are producing the updated protocol design document for a clinical trial. You are given the current design brief, the decision log (decisions the study team has already shipped), and the strategy conversation for context.

Output **HTML only** — no markdown, no code fences, no commentary before or after. Use h1 for the title, h2/h3 for sections, p, ul/ol, strong/em, and table/tr/th/td where the content is genuinely tabular. Do not include <html>, <head>, or <body> tags; start at the h1. Do not use inline styles or CSS — Google Docs discards them and they make the file harder to edit.

Write the protocol, not a report about the session:

- Reproduce the full design — indication, phase, objectives and endpoints, arms and randomization, eligibility criteria, target enrollment and site plan, schedule of assessments — as a complete document a study team can take to protocol writing.
- Apply every decision from the decision log **in place**: a dropped criterion is absent, a revised element appears in its revised form, an added element appears where it belongs. Where a decision changed an element, you may mark it inline with a brief parenthetical "(revised)" — nothing more.
- Do NOT include a decision log, a "summary of where things stand", meeting notes, rationale sections, or any narrative about the conversation. The decision log lives in the workspace, not in this document. Open questions the team has explicitly left open may appear as a short "Open items" list at the end.
- If no design brief is provided (the team started from a blank page), draft the protocol the conversation converged on, applying the same rules.

End with a short section titled "Provenance and limits" stating that the supporting figures come from a synthetic demonstration corpus generated for this exercise — no real sponsor, site, or participant — and are sound for reasoning about mechanism but not as evidence about any real indication.`

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClientDecision {
  element_id?: string
  element_label?: string
  decision?: string
  rationale?: string
  alternatives_considered?: Array<{ option?: string; tradeoff?: string }>
  evidence?: string[]
}

function resolveBrief(source: unknown): DesignBrief | null {
  const s = source as BriefSource | undefined
  if (!s) return designBrief() // no context sent — the hero brief is the default document
  if (s.kind === 'blank') return null
  if (s.kind === 'corpus') {
    return typeof s.protocolId === 'string' ? deriveBriefFromProtocol(s.protocolId) : null
  }
  return designBrief()
}

function decisionBlock(decisions: ClientDecision[]): string {
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

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 503 })
  }

  let body: {
    messages?: ClientMessage[]
    context?: unknown
    decisions?: ClientDecision[]
    title?: string
    shareWith?: string
  }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const brief = resolveBrief(body.context)
  const decisions = Array.isArray(body.decisions) ? body.decisions.slice(0, 50) : []

  const transcript = (body.messages ?? [])
    .filter((m) => typeof m.content === 'string' && m.content.trim())
    .map((m) => `${m.role === 'user' ? 'Study team' : 'Strategist'}: ${m.content}`)
    .join('\n\n')

  if (!transcript && !decisions.length) {
    return Response.json({ error: 'Nothing to publish — no conversation or shipped decisions.' }, { status: 400 })
  }

  const sections: string[] = ['Produce the updated protocol document.']
  sections.push(
    brief
      ? `## Current design brief\n\n${JSON.stringify(brief, null, 2)}`
      : '## Current design brief\n\nNone — the team started from a blank page; draft the protocol from the conversation.'
  )
  sections.push(`## Decision log (already shipped — apply in place)\n\n${decisionBlock(decisions)}`)
  if (transcript) sections.push(`## Strategy conversation (context only)\n\n${transcript}`)

  try {
    const client = new Anthropic()
    const res = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      output_config: { effort: 'high' },
      system: DOC_SYSTEM,
      messages: [{ role: 'user', content: sections.join('\n\n---\n\n') }],
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

    const title =
      body.title?.trim() ||
      (brief ? `${brief.title} — Updated Protocol` : 'Updated Protocol Draft')

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
