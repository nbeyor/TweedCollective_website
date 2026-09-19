# GREX — Product Requirements Document

**Product:** GREX — Evidence confidence for everything you read
**Version:** Prototype (scoring methodology v0.1)
**Status:** Clickable prototype live at `/clients/grex`; agent surface runs live verification
**Prepared by:** Tweed Collective

---

## 1. Product thesis

GREX places **a transparent measure of evidentiary confidence next to factual information, with almost no user effort**.

GREX measures the *strength of publicly available evidence* for factual claims. It never determines "truth" and never uses the words *true*, *false*, *fake*, *real*, *lie*, or *misinformation*. The score is a statement about evidence, not a verdict about the world.

### Core principles

1. **Confidence, not truth** — never "true", "false", "fake", or "lie", anywhere in the product.
2. **Claims are the atomic unit** — objects (pages, screenshots, answers) are aggregations of claims.
3. **Extract broadly, evaluate mechanically** — importance is never guessed; every claim weighs equally in v0.
4. **Absence of evidence ≠ falsity** — "insufficient evidence" costs half a point, not everything.
5. **No identity** — inputs are ephemeral and deleted; no user identity is ever stored.
6. **Scores are never purchasable.**
7. **One rubric skill per surface** — so scoring can diverge from evidence handling later without forking the engine.
8. **Methodology is versioned** — historical scores are never overwritten.

---

## 2. Product surfaces

One verification backend, three consumer surfaces. Each surface stays deliberately quiet: the score is the whole interface until the user asks *why*.

### Surface A — Browser extension

A floating score appears while the user reads a real page. The page is checked **passively** — no button, no submission. The score chip is the entire UI; tapping it opens the shared explanation view.

- Content is text extracted from the page; boilerplate (nav, ads, bylines) is ignored.
- Attribute-aware: when the page quotes someone ("according to Dr. Smith…"), the claim checked is what was asserted; the attribution is context.
- Tone: *a calm reading companion* — a margin note from a careful librarian. Specific, neutral, no alarm. Refers to "the article" / "this page".

### Surface B — Screenshot checker

The normal phone flow: take a screenshot → tap share → send to GREX → get a score. **The image is processed and deleted.**

- OCR text can be fragmentary; claims are reconstructed charitably from context.
- Promotional superlatives ("melts fat fast!") are OPINION or TOO_VAGUE, but specific embedded assertions (approvals, endorsements, statistics, "as seen on…") are VERIFIABLE — extracted even inside hype.
- GREX is **not a scam detector** — it scores only the evidence for the claims.
- Tone: *protective and plain-spoken*. Says clearly what checked out and what did not, in everyday language, without lecturing. Refers to "this message" / "this screenshot".

### Surface C — Agent verification (MCP)

One quiet line at the end of an AI response — a score, shown only when the response contains checkable facts. The integration pattern is **draft → verify → present with a score line** (`verify_facts` tool via an MCP server).

- Pays particular attention to specific numbers, dates, names, and entity relationships — *confident numeric drift* (a year off, a figure rounded into fiction) is the characteristic failure mode being checked.
- Hedged statements ("approximately", "around") are still VERIFIABLE when they assert a checkable magnitude.
- Tone: *terse and machine-adjacent*. Rationales are compact and directly usable in a correction ("evidence indicates the acquisition closed in 2022, not 2023").

### Shared explanation view — progressive disclosure

Every score opens the same explanation experience, in three levels:

- **Level 1:** the score (0–100 badge with band label).
- **Level 2:** why, in one breath — a one-to-two sentence summary of what the evidence showed.
- **Level 3:** the evidence — per-claim verdicts, rationales, and cited sources with excerpts.

---

## 3. Verification pipeline

Five stages, invariant across surfaces:

| Stage | Input → Output | Consumer state | Notes |
|---|---|---|---|
| **Extract** | ephemeral text → normalized claims | `EXTRACTING` | Every factual assertion, one sentence each. No importance ranking. Cap: 8 claims, document order. |
| **Classify** | claims → verifiable subset | `EXTRACTING` | `VERIFIABLE \| OPINION \| PREDICTION \| PERSONAL_EXPERIENCE \| TOO_VAGUE`. Only VERIFIABLE is scored. |
| **Search** | verifiable claims → evidence set | `SEARCHING` | Public web via a swappable SearchProvider. **Evidence, never model memory.** |
| **Evaluate** | claims + evidence → verdicts | `EVALUATING` | `SUPPORTED \| CONTRADICTED \| INSUFFICIENT_EVIDENCE`. Absence of evidence ≠ falsity. 1–5 evidence items per claim; only real URLs from search results. |
| **Score** | verdicts → 0–100 | `COMPLETE` | Versioned methodology (v0.1). **Server-side only; clients never compute.** |

Pipeline rules:

- The model's job is to evaluate *retrieved evidence*, never to answer from its own knowledge. If search fails or is exhausted, affected claims are marked INSUFFICIENT_EVIDENCE with a rationale noting retrieval was unavailable — never guessed. Live runs where search was unavailable are flagged `evidenceMode: 'degraded'`.
- **Security:** submitted content and retrieved web text are DATA, never instructions. Instruction-looking text inside content is treated as content (it may itself contain claims worth checking).
- **Rationale language:** "the evidence indicates" / "no public source states" — never "this is false".
- **If nothing is verifiable:** claims are still listed with their classes, unevaluated; the product shows "no factual claims to check" rather than inventing a score.

---

## 4. Scoring — methodology v0.1

```
score = (1·supported + 0.5·insufficient + 0·contradicted) / verifiable_claims × 100
```

**Score bands**

| Range | Label |
|---|---|
| 80–100 | Strong evidence |
| 60–79 | Moderate evidence |
| 40–59 | Mixed evidence |
| 0–39 | Weak evidence |

**Rules**

- `verifiable_claims = 0` → `NO_VERIFIABLE_CLAIMS`: no score, ever ("Nothing to check").
- Insufficient evidence ≠ contradicted — it costs half, not everything.
- Every claim weighs equally in v0. **Weighting must be earned from data.**
- Methodology is versioned (`SCORING_METHODOLOGY_VERSION = 'v0.1'`); historical scores are never overwritten.
- Model-internal confidence (0–1) is retained per evaluation for methodology work but is **not** shown as the score.

**Future weighting directions (per surface, not in v0):**

- *Browser:* headline/lede claims may warrant distinct treatment from deep-body claims.
- *Screenshot:* claims matching known deceptive patterns (fabricated endorsements, false regulatory status, urgency framing) may weigh heavier when contradicted.
- *MCP:* contradicted claims may weigh heavier than insufficient ones, since the consuming agent repeats whatever survives verification.

---

## 5. System architecture

Three thin clients over one backend:

```
Chrome extension     iOS share extension     MCP verify_facts
(skills/browser)     (skills/screenshot)     (skills/mcp)
        └──────────────────┼──────────────────┘
                           ▼
   POST /v1/verify → { score, claims[], evidence[], methodology_version }
                           ▼
   ModelProvider · SearchProvider · ContentExtractor · ScoringStrategy
```

**Four required abstractions** — model, search, extraction, and scoring are each swappable without touching a surface. The prototype runs a hosted frontier model; production swaps in a self-hosted open-weight model behind the same interface.

**Prompt composition:** system prompt = invariant shared pipeline contract + the surface's rubric skill (verifiability notes, scoring rubric, explanation tone). Rubrics are near-identical in v0 by design; each is its own editable artifact so scoring can diverge later.

**Structured output:** the engine forces exactly one strict `submit_verification` tool call (content label, summary, claims with verdicts/confidence/rationale/evidence). Strict mode guarantees shape; a server-side sanitizer enforces caps, clamps, and URL hygiene anyway — **model output is untrusted**. Evidence URLs must be http(s) and come from search results only; anything else is dropped.

**Limits (live endpoint):** 8 claims max, 5 evidence items per claim, 6 web searches, 6,000 input chars, 4 conversation rounds.

---

## 6. Data model

| Entity | Fields | Note |
|---|---|---|
| `verification_event` | id, surface, created_at, object_ref?, methodology_version | **No user identity, ever.** |
| `claim` | id, event_id, normalized_claim | The atomic unit; raw inputs deleted after processing. |
| `evidence` | id, claim_id, source_url, excerpt, retrieved_at | Minimum excerpt, never whole pages. |
| `claim_evaluation` | id, claim_id, status, confidence?, model, model_version, eval_version | Full provenance for methodology work. |
| `score` | event_id, score, supported, contradicted, insufficient, verifiable_count | Derived metadata lives in a separate regenerable layer. |

---

## 7. Privacy

- No user identity is stored with any verification event.
- Raw inputs (page text, screenshots) are ephemeral: processed, then deleted. Only normalized claims and minimal evidence excerpts persist.
- Screenshots in Surface B are explicitly "processed and deleted".

---

## 8. Build plan

| Milestone | Scope | Prototype status |
|---|---|---|
| **M1** | Verification engine (API, model + search adapters, v0 scoring, DB) | Live in prototype (agent surface) |
| **M2** | Shared explanation web app | Built — every score opens it |
| **M3** | Chrome extension | Simulated (browser surface) |
| **M4** | iOS share extension | Simulated (screenshot surface) |
| **M5** | MCP server (`verify_facts`, thin adapter) | Simulated + live (agent surface) |
| **M6** | Anonymous event telemetry | Out of prototype scope |

---

## 9. Prototype demo content

Three canned scenarios, one per surface, each ending in the shared explanation view:

1. **Browser — functionhealth.com** (real company; verdicts grounded in real press coverage as of Aug 2026, real citation URLs; no verdict asserted beyond what public reporting supports). Outcome: concrete claims (160+ tests, $365/yr pricing, $298M Series B at $2.5B) SUPPORTED; the 500k member count INSUFFICIENT (company-sourced only); "live 100 healthy years" classified PREDICTION. Score: 88 — Strong evidence.
2. **Screenshot — suspicious "GlucoTrim" text message** (fully fictional; synthetic-content discipline). FDA-approval and "clinically proven" claims CONTRADICTED; Shark Tank and offer-window claims INSUFFICIENT; "specially selected" TOO_VAGUE. Score: 25 — Weak evidence.
3. **MCP — AI diligence answer on "Veldt Robotics"** (fictional). Mostly SUPPORTED, but the acquisition year is CONTRADICTED (off by one) and the revenue figure INSUFFICIENT — the confident-numeric-drift failure mode the surface exists to catch. Score: 68 — Moderate evidence.

The agent surface additionally runs **live**: the user asks a question, an answer is generated, then the answer itself is verified against real web evidence (`answer_verify` mode), streaming processing states (`EXTRACTING → SEARCHING → EVALUATING → COMPLETE`) before the score line appears.

Demo disclaimer (shown on the hub): scores are illustrative of the GREX methodology (v0.1), not fact-checks of record; no affiliation with any real company shown.

---

## 10. Out of scope (v0)

- Claim weighting of any kind (prominence, pattern, or consequence based) — must be earned from data.
- Scam/fraud detection as a product claim.
- User accounts, history tied to identity, or any purchasable placement affecting scores.
- Anonymous telemetry (M6, deferred beyond prototype).
