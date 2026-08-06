# Clinical Trial Protocol Strategist — Client Demo Plan

**Status:** Pre-build. Scoping only, awaiting PRD.
**Date:** 2026-08-06
**Branch:** `claude/clinical-trial-demo-page-2fz552`

---

## Context

A client-facing demo sub-page on the Tweed Collective site presenting an AI "clinical trial protocol strategist." Three layers:

1. **Chat** — the interaction layer where the user strategizes against protocol data
2. **Analytics/visualization** — the evidence the strategist reasons over, rendered on-page
3. **Google Docs output** — the user tells the strategist to codify the conversation; it writes a working document, then reads that document back (with the human's comments) and returns suggested edits as a second document

The third layer is the differentiator. It models a collaboration loop rather than one-shot generation.

---

## Repo Findings (starting point)

### Stack
Next.js 14 App Router, TypeScript, Tailwind, Clerk auth, Chart.js + react-chartjs-2, framer-motion, lucide-react. Airtable and Resend already wired.

### Two existing page patterns — they are not interchangeable
| Pattern | Where | How it works |
|---|---|---|
| **Slide deck** | `content/documents/{id}.ts` | Pure data (`SlideData[]`), registered in `index.ts` + `loader.ts`, rendered by the dynamic route. **No page file.** |
| **Dashboard** | `app/clients/ecs/sdlc-dashboard` | JSON in `public/data/`, fetched at runtime, Chart.js components. Reference impl: `components/copilot-dashboard/` |

This demo is closer to the dashboard pattern, plus a net-new chat surface.

### Auth
`middleware.ts` gates everything not explicitly listed as public. `/clients/*` is **already protected**; `/insights/*` is public. Magic-link infrastructure exists at `/api/magic-link` and `/magic-link/[token]`.

### Constraints found
| Constraint | Consequence |
|---|---|
| **No LLM integration exists anywhere in the repo** | Net-new. No API route calls a model today. |
| CSP is `connect-src 'self'` (`next.config.js`) | Browser cannot call an LLM or Google directly. All calls proxy through a Next API route — which is correct anyway, keeps keys server-side. |
| Existing env vars: `AIRTABLE_BASE`, `AIRTABLE_TOKEN`, `CLERK_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | No `ANTHROPIC_API_KEY`. No Google credentials. Both must be added. |
| `AGENTS.md` is strict | No hardcoded content in components; no hex colors outside `lib/slideTemplates.ts`; document metadata only in `content/documents/index.ts`. Build must comply. |
| ⚠️ `.github/workflows/auto-merge-claude-branches.yml` | **Every push to `claude/**` auto-merges to `main` and deploys.** No staging gap. |

---

## Decisions Made

### 1. New Anthropic Console project — do not reuse the other demo's
Rationale: separate spend line (so the demo's actual cost is reportable), and a key revocable after the demo without breaking the other project.

- Key goes in Vercel env as `ANTHROPIC_API_KEY` (prod + preview)
- Set a spend cap on the project
- Default model: `claude-opus-5`

### 2. Output destination is Google Docs — not the site's slide system
Two readings of "output to our work document" were on the table: export into the site's existing `SlideData[]` deck system under `/insights`, or write to Google Docs. **Google Docs is the choice.** The slide-export path is dropped for this demo.

### 3. Doc B is a separate document, not tracked changes
Native Google Docs *suggestion mode* is not reachable through the available Drive connector, and there is no edit-in-place. A second document is the only path — and the right shape for it is the revised section with a change log at the top, **each entry keyed to the human comment it answers.**

### 4. The review step reads comments, not just prose
The Drive connector can return a Doc's content *with comment threads inline*, anchored to their text. The review loop should key off those comments. That is the difference between "the AI rewrote my document" and "the AI answered my margin notes."

### 5. Doc A generated as HTML, converted by Drive
Plain-text upload produces an unformatted wall. Generating HTML and letting Drive convert preserves headings, tables, and emphasis.

---

## Google Docs Integration — Capabilities and the Credential Gap

### What the Drive connector supports
| Capability | Available |
|---|---|
| Create a Google Doc from HTML/text | Yes |
| Read a Doc's content | Yes |
| Read a Doc's **comment threads**, inline and anchored | Yes |
| Copy a Doc | Yes |
| Search Drive | Yes |
| **Edit a Doc in place** | **No** |
| **Native suggestion mode / tracked changes** | **No** |

### The gap that needs resolving before build
The Drive connection available in the Claude session is authorized to that session under Nate's account. **The deployed Next.js app cannot use it.** For the page itself to write Docs, it needs its own credentials.

| Option | Trade | Verdict |
|---|---|---|
| **Google service account** | App creates docs in the service account's Drive and shares the link. Docs owned by a robot rather than by Nate or the client — invisible in a demo. | **Recommended for the demo** |
| **Per-user Google OAuth** | Doc lands in the client's own Drive. Better story. Real OAuth work plus a consent screen. | Production path; wrong trade for demo timeline |
| **Pre-seeded** | Button renders the doc in-page and links to one created out of band. Reads identically on screen. | Fallback if credentials don't land in time |

Note: account is a personal Gmail, not Workspace — so no shared-drive folder. The service account creates docs in its own Drive and shares them out. That works.

### Demo-day choreography warning
The review loop is inherently asynchronous — a human has to go edit the doc. Live, that is dead air. Build the real loop, but have a **pre-commented Doc A** ready so the payoff shows in ten seconds, then let the client try the slow path themselves.

---

## Working Assumptions (defaults if the PRD doesn't override)

- Route: `/clients/{client}/protocol-strategist` (inherits Clerk gating automatically)
- Chat proxied server-side via `app/api/protocol-strategist/route.ts`, streaming
- Synthetic data in `public/data/`
- Colors from `chartTheme` / `lib/slideTemplates.ts` per `AGENTS.md`
- Nothing user-visible pushed until explicitly cleared

---

## Open Gaps

### Blocking, with lead time — owner: Nate, not in the PRD
| # | Gap | Needed |
|---|---|---|
| 1 | **Anthropic API key** | New Console project, key in Vercel, spend cap set |
| 2 | **Google credentials** | Decision on service account vs OAuth vs pre-seeded; if service account, GCP project + service account JSON |

These two are the only items with external lead time. Everything else can start from the PRD.

### Coming in the PRD
| # | Gap | Note |
|---|---|---|
| 3 | **Hero use case** | "Clinical trial protocol strategist" is a category, not a demo. Candidates raised: eligibility-criteria burden, protocol complexity / amendment risk, enrollment feasibility by site, endpoint selection vs. what has succeeded in the indication. Open-ended chat with no hero job demos badly. |
| 4 | **Visualization spec** | Must state what the reader *concludes*, not just what is on the axes. Suggested hero: criteria-burden waterfall (eligible population shrinking criterion by criterion), plus a comparator-landscape scatter. |

### ~~Coming with the sample data~~ — CLOSED 2026-08-06
| # | Gap | Resolution |
|---|---|---|
| 5 | ~~Data schema and vocabulary~~ | **Closed.** Three files supplied: Trial IntelX Data Dictionary v1.1 summary exhibit, Trial IntelX sample output (2 Phase 2 asthma protocols across all 15 sheets), and the KMR Clinical Data Workbook field list. Corpus generated — 120 protocols, 2,361 sites. See `docs/trial-corpus.md`. |
| 6 | ~~Confidentiality confirmation~~ | **Closed by inspection.** The sample protocols are de-identified (`acuteasthma1/2`, `protocol_number: N/A`, no sponsor or NCT identifiers) and contain no patient-level data. The generated corpus is fully synthetic regardless. |

**Decisions taken on the corpus** (2026-08-06):
- Mixed therapeutic areas, deep in Respiratory and Oncology
- Full join: protocol structure + trial operational + site level
- ~120 protocols / ~2,400 sites
- `criterion_type` added as a documented Tweed extension

**Standing note on the Trial IntelX schema.** The Data Dictionary is a WCG contract exhibit
and the sample output is a WCG deliverable. The demo reproduces that schema's *shape* for a
different client audience. Worth a decision on how visibly Trial IntelX is credited — or
whether the demo should present a Tweed-named schema that happens to be compatible.

### Unresolved, not yet assigned
| # | Gap | Note |
|---|---|---|
| 7 | **Client identity and demo date** | Drives scope and how much polish is affordable. |
| 8 | **Demo format** | Live-driven by Nate, or clickable by the client? Changes how much guardrailing the chat needs. |
| 9 | **Demo access mechanism** | Clerk account per attendee, or magic link (infrastructure already exists)? |
| ~~10~~ | ~~Auto-merge posture~~ | **Closed 2026-08-06 — auto-merge to `main` approved.** |

---

## Build Status (2026-08-06, v0.2 — PRD-aligned)

The PRD v0.2 hero flow is built end to end: the demo opens on a pre-drafted NSCLC
design brief, the user pressure-tests its elements, sensitivity analyses return
options with tradeoffs (patients / months / dollars), fixed and generated charts
render in the side panel, and shipped decisions write back to the brief. Branding
is WCG IntelX (deep navy + teal, light clinical surface), with a "powered by
Tweed Collective" mark. The WCG palette is a reconstruction — the sandbox network
blocked wcgclinical.com — and lives as one swappable constant in
`components/protocol-strategist/wcgTheme.ts` (mirrored in `lib/generatedChart.ts`)
for exact hexes to drop in.

| Piece | Path | State |
|---|---|---|
| Corpus v2.0.0 (NSCLC depth) | `pipeline/generate_trial_corpus.py` + `trial_corpus_sensitivity.py` | 150 protocols (30 NSCLC), 3,040 sites; new tables: procedure_operations, assessment_operations, criterion_attribution, design_brief; amendment economics (timing + ~$500K cost) |
| Sensitivity engine | `lib/trialCorpus.ts` | Deterministic, corpus-sourced: criteria waterfall, procedure sensitivity (scenarios in patients/months/dollars), endpoint timeline, amendment-risk sweep, comparator landscape, site-level breakdown |
| Tool surface | `lib/strategistTools.ts` | +8 hero tools incl. `render_chart` and `ship_decision`; existing corpus tools retained |
| Chat route | `app/api/protocol-strategist/route.ts` | System prompt scoped to the brief + sensitivity loop; forwards `panel`/`chart`/`ship` SSE events |
| Generated charts | `lib/generatedChart.ts` | Self-contained inline-SVG (no script), sandboxed iframe, fallback on malformed spec |
| Ship-it | `lib/googleDocs.ts` `shipDecisionToBrief` | Docs API append to the brief's decision log; degrades to on-page log when creds/doc id absent |
| Page + workspace | `app/clients/protocol-strategist/page.tsx`, `components/protocol-strategist/*` | Brief panel · chat · insight side panel; fixed charts (Chart.js, WCG theme) + generated charts |
| Pre-seeded brief doc | Google Drive | Created in Nate's Drive: `1nfCiXxjQ0TiYVhV_CKbg66bkeVlFMvwngc_loDBNqZM` |

**To wire ship-it to the real doc:** set `STRATEGIST_BRIEF_DOC_ID` to the doc id
above and share that doc with the service account as Editor. Without it, ship-it
still demos — decisions land in the on-page decision log.

### Earlier plumbing (v0.1)

Plumbing is in. Hero visualization and system-prompt specialization wait on the PRD.

| Piece | Path | State |
|---|---|---|
| Corpus query layer | `lib/trialCorpus.ts` | Cohort filtering, percentile benchmarking, criteria frequency, enrolled-population composition, design→outcome correlations |
| Strategist tool surface | `lib/strategistTools.ts` | 7 tools; descriptions state *when* to call, not just what they do |
| Streaming chat | `app/api/protocol-strategist/route.ts` | SSE; server-side tool loop; `claude-opus-5`, adaptive thinking summarized, prompt caching on the system prefix |
| Health check | `app/api/protocol-strategist/health/route.ts` | Verifies key, corpus, tools, Google credentials in one request |
| Google Docs bridge | `lib/googleDocs.ts` | Create from HTML, export text, **read comment threads with anchored text**, share |
| Codify → Doc A | `app/api/protocol-strategist/codify/route.ts` | Conversation → HTML → Google Doc |
| Review → Doc B | `app/api/protocol-strategist/review/route.ts` | Reads Doc A + open comments → revision with change log keyed to each comment |
| Demo page | `app/clients/protocol-strategist/page.tsx` | Clerk-gated via existing middleware; chat + tool activity + codify |
| Corpus tracing | `next.config.js` | `outputFileTracingIncludes` — `public/` is CDN-served and not bundled into lambdas by default; verified 14 corpus files traced |

**Env vars required in Vercel:**

| Var | Status |
|---|---|
| `ANTHROPIC_API_KEY` | ✅ set |
| `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` | ⏳ pending — base64 of the service account key file (needed for codify/review + ship-it) |
| `GOOGLE_DRIVE_FOLDER_ID` | ⏳ pending — destination folder for codify/review docs |
| `STRATEGIST_BRIEF_DOC_ID` | ⏳ pending — the pre-seeded brief doc id (`1nfCiXxjQ0TiYVhV_CKbg66bkeVlFMvwngc_loDBNqZM`); ship-it appends here. Share the doc with the service account as Editor. |
| `STRATEGIST_EFFORT` | optional — defaults to `medium`; raise to `high` for depth over latency |

**Note on testing.** `/api/protocol-strategist/health` sits behind Clerk (it makes a billed model call, so it must not be open). It has to be opened from a signed-in browser — it cannot be reached from a Claude Code session.

### Framing question still open
> What is the one insight you want the client to walk away repeating?

The demo lands or dies on whether the model says something a protocol lead did not already know. The build should run backward from that sentence.

---

## Build Sequence (once gaps 1–6 close)

1. Synthesize the data corpus from the sample; land it in `public/data/`
2. Server-side chat route with streaming; system prompt scoped to the hero use case
3. Chat UI + the hero visualization, wired to the same underlying data
4. "Codify" → HTML generation → Doc A via Drive
5. "Review" → read Doc A with comments → Doc B with change log keyed to comments
6. Access setup (Clerk or magic link), pre-seeded demo doc, dry run
