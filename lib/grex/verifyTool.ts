/**
 * The strict submit_verification tool the live endpoint forces the model to
 * call, plus the server-side sanitizer that turns its raw input into a
 * VerificationResult. Strict mode guarantees shape; the sanitizer enforces
 * caps, clamps, and URL hygiene anyway — model output is untrusted.
 */

import { MAX_CLAIMS, MAX_EVIDENCE_PER_CLAIM } from './skills/shared'
import {
  countClaims,
  scoreFor,
  v0Score,
  type Claim,
  type ClaimVerdict,
  type Evidence,
  type GrexSurface,
  type Verifiability,
  type VerificationResult,
} from './types'

const VERIFIABILITIES = ['VERIFIABLE', 'OPINION', 'PREDICTION', 'PERSONAL_EXPERIENCE', 'TOO_VAGUE']
const VERDICTS = ['SUPPORTED', 'CONTRADICTED', 'INSUFFICIENT_EVIDENCE', 'NOT_EVALUATED']
const STANCES = ['supports', 'contradicts', 'context']

export const SUBMIT_VERIFICATION_TOOL = {
  name: 'submit_verification',
  description:
    'Submit the completed verification result. Call exactly once, after all claims are extracted, classified, searched, and evaluated.',
  strict: true,
  input_schema: {
    type: 'object' as const,
    properties: {
      content_label: {
        type: 'string',
        description: 'Short description of what was checked, e.g. "News article excerpt".',
      },
      summary: {
        type: 'string',
        description: 'One-to-two sentence summary of what the evidence showed.',
      },
      claims: {
        type: 'array',
        items: {
          type: 'object' as const,
          properties: {
            text: { type: 'string', description: 'The normalized claim, one sentence.' },
            verifiability: { type: 'string', enum: VERIFIABILITIES },
            verdict: {
              type: 'string',
              enum: VERDICTS,
              description: 'NOT_EVALUATED for non-verifiable claims.',
            },
            confidence: { type: 'number', description: '0–1; 0 for NOT_EVALUATED.' },
            rationale: {
              type: 'string',
              description: 'What the evidence showed; empty string for NOT_EVALUATED.',
            },
            evidence: {
              type: 'array',
              items: {
                type: 'object' as const,
                properties: {
                  url: { type: 'string', description: 'Real URL from search results only.' },
                  source_name: { type: 'string' },
                  title: { type: 'string' },
                  snippet: { type: 'string', description: 'Excerpt under 40 words.' },
                  stance: { type: 'string', enum: STANCES },
                },
                required: ['url', 'source_name', 'title', 'snippet', 'stance'],
                additionalProperties: false,
              },
            },
          },
          required: ['text', 'verifiability', 'verdict', 'confidence', 'rationale', 'evidence'],
          additionalProperties: false,
        },
      },
    },
    required: ['content_label', 'summary', 'claims'],
    additionalProperties: false,
  },
}

const clip = (s: unknown, max: number): string =>
  typeof s === 'string' ? s.slice(0, max) : ''

function safeUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString().slice(0, 500) : null
  } catch {
    return null
  }
}

/** Build the canonical VerificationResult from untrusted tool input. */
export function sanitizeVerification(
  raw: unknown,
  meta: { id: string; surface: GrexSurface; submittedText: string; evidenceMode: 'web' | 'degraded' }
): VerificationResult {
  const input = (raw ?? {}) as Record<string, unknown>
  const rawClaims = Array.isArray(input.claims) ? input.claims.slice(0, MAX_CLAIMS) : []

  const claims: Claim[] = rawClaims.map((c, i) => {
    const rc = (c ?? {}) as Record<string, unknown>
    const verifiability = (
      VERIFIABILITIES.includes(rc.verifiability as string) ? rc.verifiability : 'TOO_VAGUE'
    ) as Verifiability
    const claim: Claim = {
      id: `${meta.id}-c${i}`,
      text: clip(rc.text, 400),
      verifiability,
    }
    const verdict = rc.verdict as string
    if (verifiability === 'VERIFIABLE' && VERDICTS.includes(verdict) && verdict !== 'NOT_EVALUATED') {
      const rawEvidence = Array.isArray(rc.evidence) ? rc.evidence.slice(0, MAX_EVIDENCE_PER_CLAIM) : []
      const evidence: Evidence[] = rawEvidence.flatMap((e, j) => {
        const re = (e ?? {}) as Record<string, unknown>
        const url = safeUrl(re.url)
        if (!url) return []
        return [
          {
            id: `${meta.id}-c${i}-e${j}`,
            url,
            sourceName: clip(re.source_name, 120) || new URL(url).hostname,
            title: clip(re.title, 200),
            snippet: clip(re.snippet, 400),
            stance: (STANCES.includes(re.stance as string) ? re.stance : 'context') as Evidence['stance'],
          },
        ]
      })
      const confidence = typeof rc.confidence === 'number' ? Math.max(0, Math.min(1, rc.confidence)) : 0.5
      claim.evaluation = {
        verdict: verdict as ClaimVerdict,
        confidence,
        rationale: clip(rc.rationale, 600),
        evidence,
      }
    }
    return claim
  })

  return {
    id: meta.id,
    surface: meta.surface,
    mode: 'live',
    contentLabel: clip(input.content_label, 120) || 'Submitted content',
    submittedText: meta.submittedText.slice(0, 280),
    summary: clip(input.summary, 600),
    claims,
    score: scoreFor(v0Score(countClaims(claims))),
    checkedAt: new Date().toISOString(),
    evidenceMode: meta.evidenceMode,
  }
}
