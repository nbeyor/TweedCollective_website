/**
 * Static content for the architecture page. Kept terse by design — the page
 * renders diagrams, tables, and a worked calculation, not prose.
 */

export interface PipelineStage {
  name: string
  input: string
  output: string
  /** The processing state consumers see while this stage runs. */
  state: string
  /** One line, rendered small. */
  note: string
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    name: 'Extract',
    input: 'ephemeral text',
    output: 'normalized claims',
    state: 'EXTRACTING',
    note: 'Every factual assertion, one sentence each. No importance ranking.',
  },
  {
    name: 'Classify',
    input: 'claims',
    output: 'verifiable subset',
    state: 'EXTRACTING',
    note: 'VERIFIABLE | OPINION | PREDICTION | PERSONAL | TOO_VAGUE. Only the first is scored.',
  },
  {
    name: 'Search',
    input: 'verifiable claims',
    output: 'evidence set',
    state: 'SEARCHING',
    note: 'Public web via a swappable SearchProvider. Evidence, never model memory.',
  },
  {
    name: 'Evaluate',
    input: 'claims + evidence',
    output: 'verdicts',
    state: 'EVALUATING',
    note: 'SUPPORTED | CONTRADICTED | INSUFFICIENT_EVIDENCE. Absence of evidence ≠ falsity.',
  },
  {
    name: 'Score',
    input: 'verdicts',
    output: '0–100',
    state: 'COMPLETE',
    note: 'Versioned methodology (v0.1). Server-side only; clients never compute.',
  },
]

export interface DataEntity {
  name: string
  fields: string[]
  note: string
}

export const DATA_MODEL: DataEntity[] = [
  {
    name: 'verification_event',
    fields: ['id', 'surface', 'created_at', 'object_ref?', 'methodology_version'],
    note: 'No user identity, ever.',
  },
  {
    name: 'claim',
    fields: ['id', 'event_id', 'normalized_claim'],
    note: 'The atomic unit; raw inputs deleted after processing.',
  },
  {
    name: 'evidence',
    fields: ['id', 'claim_id', 'source_url', 'excerpt', 'retrieved_at'],
    note: 'Minimum excerpt, never whole pages.',
  },
  {
    name: 'claim_evaluation',
    fields: ['id', 'claim_id', 'status', 'confidence?', 'model', 'model_version', 'eval_version'],
    note: 'Full provenance for methodology work.',
  },
  {
    name: 'score',
    fields: ['event_id', 'score', 'supported', 'contradicted', 'insufficient', 'verifiable_count'],
    note: 'Derived metadata lives in a separate regenerable layer.',
  },
]

export interface Milestone {
  name: string
  prototype: string
}

export const MILESTONES: Milestone[] = [
  { name: 'M1 · Verification engine (API, model + search adapters, v0 scoring, DB)', prototype: 'Live here (agent surface)' },
  { name: 'M2 · Shared explanation web app', prototype: 'Built — every score opens it' },
  { name: 'M3 · Chrome extension', prototype: 'Simulated (browser surface)' },
  { name: 'M4 · iOS share extension', prototype: 'Simulated (screenshot surface)' },
  { name: 'M5 · MCP server (verify_facts, thin adapter)', prototype: 'Simulated + live (agent surface)' },
  { name: 'M6 · Anonymous event telemetry', prototype: 'Out of prototype scope' },
]

/** One-line principles, rendered as a compact footer strip. */
export const PRINCIPLES: string[] = [
  'Confidence, not truth — never “true”, “false”, “fake”, or “lie”.',
  'Claims are the atomic unit; objects are aggregations.',
  'Extract broadly, evaluate mechanically — importance is not guessed.',
  'No identity; inputs are ephemeral and deleted.',
  'Scores are never purchasable.',
  'One rubric skill per surface, so scoring can diverge from evidence.',
]
