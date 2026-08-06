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

### Coming with the sample data
| # | Gap | Note |
|---|---|---|
| 5 | **Data schema and vocabulary** | 3–5 real records is enough; corpus gets synthesized from them. Need: unit of record (protocol / arm / criterion / site), fields, and provenance (CT.gov extract? client protocols? Airtable?). |
| 6 | **Confidentiality confirmation** | Explicit confirmation the sample is non-identifiable. If any of it is client-confidential or patient-level, the build goes fully synthetic and the page is labeled as such. |

### Unresolved, not yet assigned
| # | Gap | Note |
|---|---|---|
| 7 | **Client identity and demo date** | Drives scope and how much polish is affordable. |
| 8 | **Demo format** | Live-driven by Nate, or clickable by the client? Changes how much guardrailing the chat needs. |
| 9 | **Demo access mechanism** | Clerk account per attendee, or magic link (infrastructure already exists)? |
| 10 | **Auto-merge posture** | Pushing to `claude/**` merges to `main` and deploys. Allow it for this work, or gate the workflow for the duration? |

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
