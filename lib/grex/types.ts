/**
 * GREX shared verification data model.
 *
 * Both the canned demo scenarios and the live verify endpoint produce a
 * VerificationResult; every surface renders scores from this one shape so
 * the explanation page never needs to know where a result came from.
 */

export type GrexSurface = 'browser' | 'screenshot' | 'mcp'

export type ProcessingState =
  | 'PENDING'
  | 'EXTRACTING'
  | 'SEARCHING'
  | 'EVALUATING'
  | 'COMPLETE'

export type Verifiability =
  | 'VERIFIABLE'
  | 'OPINION'
  | 'PREDICTION'
  | 'PERSONAL_EXPERIENCE'
  | 'TOO_VAGUE'

export type ClaimVerdict = 'SUPPORTED' | 'CONTRADICTED' | 'INSUFFICIENT_EVIDENCE'

export type ScoreBand = 'strong' | 'moderate' | 'mixed' | 'weak'

export interface Evidence {
  id: string
  url: string
  sourceName: string
  title: string
  snippet: string
  stance: 'supports' | 'contradicts' | 'context'
}

export interface ClaimEvaluation {
  verdict: ClaimVerdict
  /** Model-internal confidence, 0–1. Retained for methodology work, not shown as the score. */
  confidence: number
  rationale: string
  evidence: Evidence[]
}

export interface Claim {
  id: string
  text: string
  verifiability: Verifiability
  /** Present only for VERIFIABLE claims. */
  evaluation?: ClaimEvaluation
}

export interface Score {
  /** 0–100, or null when there was nothing verifiable to check. */
  value: number | null
  band: ScoreBand | null
  /** Consumer wording: 'Strong evidence' … 'Weak evidence' | 'Nothing to check'. */
  label: string
  special?: 'NO_VERIFIABLE_CLAIMS'
}

export interface VerificationResult {
  id: string
  surface: GrexSurface
  mode: 'canned' | 'live'
  /** e.g. "News article — The Meridian Post", "Screenshot — text message". */
  contentLabel: string
  submittedText: string
  /** Level-2 one-to-two sentence summary. */
  summary: string
  claims: Claim[]
  score: Score
  checkedAt: string // ISO timestamp
  /** 'degraded' when web search was unavailable during a live run. */
  evidenceMode: 'web' | 'degraded'
}

export const SCORING_METHODOLOGY_VERSION = 'v0.1'

export function bandFor(value: number): ScoreBand {
  if (value >= 80) return 'strong'
  if (value >= 60) return 'moderate'
  if (value >= 40) return 'mixed'
  return 'weak'
}

export const BAND_LABELS: Record<ScoreBand, string> = {
  strong: 'Strong evidence',
  moderate: 'Moderate evidence',
  mixed: 'Mixed evidence',
  weak: 'Weak evidence',
}

export function scoreFor(value: number | null): Score {
  if (value === null) {
    return { value: null, band: null, label: 'Nothing to check', special: 'NO_VERIFIABLE_CLAIMS' }
  }
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const band = bandFor(clamped)
  return { value: clamped, band, label: BAND_LABELS[band] }
}

export interface ClaimCounts {
  verifiable: number
  supported: number
  contradicted: number
  insufficient: number
}

export function countClaims(claims: Claim[]): ClaimCounts {
  const verifiable = claims.filter((c) => c.verifiability === 'VERIFIABLE' && c.evaluation)
  return {
    verifiable: verifiable.length,
    supported: verifiable.filter((c) => c.evaluation!.verdict === 'SUPPORTED').length,
    contradicted: verifiable.filter((c) => c.evaluation!.verdict === 'CONTRADICTED').length,
    insufficient: verifiable.filter((c) => c.evaluation!.verdict === 'INSUFFICIENT_EVIDENCE').length,
  }
}

/**
 * V0 aggregate: supported=1, insufficient=0.5, contradicted=0, averaged × 100.
 * Deliberately transparent and replaceable (methodology is versioned).
 */
export function v0Score(counts: ClaimCounts): number | null {
  if (counts.verifiable === 0) return null
  const total = counts.supported * 1 + counts.insufficient * 0.5 + counts.contradicted * 0
  return (total / counts.verifiable) * 100
}
