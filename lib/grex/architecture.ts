/**
 * Static content for the architecture page: the verifier pipeline, the
 * three-surfaces/one-backend model, the sparse data model, and the build
 * plan — the PRD's companion, rendered.
 */

export interface PipelineStage {
  name: string
  input: string
  output: string
  description: string
  /** The processing state consumers see while this stage runs. */
  state: string
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    name: 'Claim extraction',
    input: 'Ephemeral text',
    output: 'Normalized claims',
    state: 'EXTRACTING',
    description:
      'The model extracts every distinct factual assertion and normalizes each into one self-contained sentence. Extraction is broad — no attempt to guess which claims "matter".',
  },
  {
    name: 'Verifiability',
    input: 'Normalized claims',
    output: 'Verifiable subset',
    state: 'EXTRACTING',
    description:
      'Each claim is classified: verifiable fact, opinion, prediction, personal experience, or too vague. Only verifiable claims proceed; the rest are shown but never scored.',
  },
  {
    name: 'Evidence search',
    input: 'Verifiable claims',
    output: 'Evidence set',
    state: 'SEARCHING',
    description:
      'Search queries are generated per claim and run against the public web through a swappable SearchProvider. The model evaluates retrieved evidence — it is explicitly forbidden from answering out of its own pretrained knowledge.',
  },
  {
    name: 'Evaluation',
    input: 'Claims + evidence',
    output: 'Per-claim verdicts',
    state: 'EVALUATING',
    description:
      'Each claim is judged against its evidence: supported, contradicted, or insufficient evidence. Insufficient is not contradicted — absence of evidence is never treated as falsity.',
  },
  {
    name: 'Scoring',
    input: 'Verdicts',
    output: '0–100 score',
    state: 'COMPLETE',
    description:
      'v0.1 is deliberately transparent: supported = 1, insufficient = 0.5, contradicted = 0, averaged × 100. The methodology is versioned and replaceable without touching any surface. No verifiable claims → no score, ever.',
  },
]

export interface SurfaceNode {
  name: string
  context: string
  hypothesis: string
}

export const SURFACE_NODES: SurfaceNode[] = [
  {
    name: 'Browser extension',
    context: 'Ambient information consumption',
    hypothesis: 'Do people glance at a passive score while reading?',
  },
  {
    name: 'Screenshot checker',
    context: 'User-triggered uncertainty',
    hypothesis: 'Do people reach for a check when something feels off?',
  },
  {
    name: 'MCP verify_facts',
    context: 'AI-generated factual information',
    hypothesis: 'Do agents defer to independent verification?',
  },
]

export interface DataEntity {
  name: string
  fields: string[]
  note: string
}

export const DATA_MODEL: DataEntity[] = [
  {
    name: 'VerificationEvent',
    fields: ['id', 'surface', 'created_at', 'object_reference?', 'methodology_version'],
    note: 'One request to GREX. No user identity — no account, no device ID, no fingerprint, ever.',
  },
  {
    name: 'Claim',
    fields: ['id', 'event_id', 'normalized_claim'],
    note: 'The atomic unit and the strategic data asset. Raw inputs (screenshots, page text) are processed ephemerally and deleted.',
  },
  {
    name: 'Evidence',
    fields: ['id', 'claim_id', 'source_url', 'excerpt', 'retrieved_at'],
    note: 'Minimum public-source text needed to explain the evaluation — never whole fetched pages.',
  },
  {
    name: 'ClaimEvaluation',
    fields: ['id', 'claim_id', 'status', 'confidence?', 'model', 'model_version', 'eval_version'],
    note: 'Full technical provenance, so methodology questions ("did model B calibrate better?") stay answerable.',
  },
  {
    name: 'Score',
    fields: ['event_id', 'score', 'supported', 'contradicted', 'insufficient', 'verifiable_count'],
    note: 'Deliberately simple. Derived classifications (topic, geography, scam-likeness) live in a separate regenerable metadata layer.',
  },
]

export interface Milestone {
  name: string
  detail: string
  prototype: string
}

export const MILESTONES: Milestone[] = [
  {
    name: 'M1 · Verification engine',
    detail: 'API, open-model adapter, search adapter, extraction, evaluation, v0 scoring, database. Nothing else until this works end-to-end on pasted text.',
    prototype: 'Simulated live here by the "check your own text" mode on every surface.',
  },
  {
    name: 'M2 · Shared explanation web app',
    detail: 'Score, claim counts, claim details, evidence links, methodology indicator — the one explanation surface everything resolves to.',
    prototype: 'Built: every score in this prototype opens the same report page.',
  },
  {
    name: 'M3 · Chrome extension',
    detail: 'Page extraction, submission, processing state, floating score, compact panel.',
    prototype: 'Simulated on the browser surface page.',
  },
  {
    name: 'M4 · iOS share extension',
    detail: 'Share target, ephemeral image processing, OCR, score screen, image deletion.',
    prototype: 'Simulated on the screenshot surface page.',
  },
  {
    name: 'M5 · MCP server',
    detail: 'verify_facts tool as a thin adapter over the same API — no duplicated verification logic.',
    prototype: 'Simulated on the agent surface page.',
  },
  {
    name: 'M6 · Instrumentation',
    detail: 'Anonymous event telemetry: verifications, scores displayed, explanations opened, evidence clicked. Events, not people.',
    prototype: 'Out of scope for the clickable prototype.',
  },
]

export const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: 'Confidence, not truth',
    body: 'A score means: based on the evidence found, how strongly are the factual claims supported? The product never says true, false, fake, or lie.',
  },
  {
    title: 'Claims are the atomic unit',
    body: 'GREX does not score websites, people, companies, or models. Objects contain claims; object scores are aggregations of claim evaluations. The methodology can evolve without touching any product surface.',
  },
  {
    title: 'Extract broadly, evaluate mechanically',
    body: 'V0 does not decide which claims are "important". Every verifiable claim is checked and weighted equally; sophistication must be earned from observed data, not designed in.',
  },
  {
    title: 'No identity, ephemeral inputs',
    body: 'No accounts, no user IDs, no fingerprints. Screenshots and page text are processed in memory and deleted; the persistent layer stores derived claims and evidence, not source material.',
  },
  {
    title: 'Scores are never purchasable',
    body: 'No advertiser, merchant, or publisher can pay to raise a score, suppress an evaluation, or tilt evidence weighting. Commercial systems stay technically and organizationally separate from scoring.',
  },
  {
    title: 'Per-surface rubric skills',
    body: 'Each surface carries its own scoring-rubric skill (browser, screenshot, agent). They start near-identical by design — the structure exists so rubrics can diverge from evidence, not assumption.',
  },
]
