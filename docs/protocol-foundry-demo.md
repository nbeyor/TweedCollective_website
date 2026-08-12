# Protocol Foundry — AI Protocol Authoring (demo)

**Route:** `/clients/protocol-authoring` · **Workspace slug:** `protocol-authoring`
**Companion docs:** `clinical-protocol-strategist-demo.md` (the baseline workspace this one is built from), `trial-corpus.md` (the shared operations corpus)

## What it is

A second client-facing workspace built on the Protocol Strategist's user-validated UX
(three-region layout, chat-mediated analysis, charts landing in a right rail, decision
log, WCG theme), re-centered from *pressure-testing a design brief* to *authoring an
actual protocol draft*. The shape and question space follow the client's ProtocolForge
example (ClinSphere Protocol Foundry): a structured protocol document, a broad
analytics library, and a multi-reviewer board.

The draft under authoring is **HORIZON-Lung-301** — a fictional Meridian Oncology
Phase III trial of MRD-1872 + pembrolizumab vs pembrolizumab in first-line PD-L1-high
metastatic NSCLC (adapted from the client's demo content): 11 chapters / 22 sections of
real protocol prose, a 14-visit × 38-procedure Schedule of Activities grid, and a
mapped design brief.

## What's new versus the strategist

- **Protocol section outline** (left panel, Protocol tab): the draft's full section
  spine. Clicking a section tees a section-scoped pressure-test question; review
  findings badge the sections they hit (red = critical, amber = major).
- **Review board**: six reviewer lenses (Biostatistics, Regulatory, Safety & Medical
  Monitoring, Clinical Operations, Ethics & Consent, Data Standards) or the full board.
  The model reads the actual sections (`get_protocol_section`), grounds statistical and
  operational findings in the analytics, then files one `file_review_findings` call per
  round. Findings render as cards in the rail's Findings tab — severity, verbatim
  quote, recommendation, regulatory basis, proposed before/after rewrite — and each can
  be **discussed** (tees a chat message) or **adopted & shipped** (chat-mediated
  `ship_decision`, resolving it into the decision log).
- **Augmented analytics library** (Analyses tab), covering the client demo's widget
  classes as grounded tools with fixed charts:
  - `eligibility_funnel` — US patient-pool funnel per criterion gate
  - `power_analysis` — Schoenfeld events/power/dropout-inflation, power curve vs true HR
  - `patient_burden` — per-visit burden over the SoA grid, heaviest-visit callout
  - `country_viability` — footprint board (pool, rate, startup, regulatory risk)
  - `regulatory_requirements` — per-country blockers/warnings with lead-time impacts
  - `enrollment_projection` — site-activation-ramped enrollment curves (slower/planned/faster)
- **Corpus engines reused**: the HORIZON draft is also expressed as a `DesignBrief`
  (`lib/protocol-authoring/horizonBrief.ts`, criterion vocabulary mapped to the corpus),
  so `draft_criteria_burden`, `procedure_sensitivity`, `trial_cost`, `site_footprint`,
  `endpoint_timeline_sensitivity`, `comparator_landscape`, `amendment_risk_sweep`, and
  the cohort tools run unchanged from `lib/strategistTools.ts`.

## File map

| Piece | Path |
| --- | --- |
| Protocol content (chapters/sections, markdown bodies) | `lib/protocol-authoring/horizonProtocol.ts` |
| SoA grid (visits, procedures, burden weights) | `lib/protocol-authoring/horizonSoA.ts` |
| Design-brief mapping into the corpus engines | `lib/protocol-authoring/horizonBrief.ts` |
| Authoring analytics models | `lib/protocol-authoring/analytics.ts` |
| Tool surface + review board | `lib/protocol-authoring/tools.ts` |
| System prompt / request shaping | `lib/protocol-authoring/prompt.ts` |
| Left-panel data (outline, groups, lenses) | `lib/protocol-authoring/library.ts` |
| Brand switch | `lib/protocol-authoring/brand.ts` |
| Streaming chat route | `app/api/protocol-authoring/route.ts` |
| Workspace UI | `components/protocol-authoring/*`, `app/clients/protocol-authoring/page.tsx` |

## Mechanics

Same architecture as the strategist: `claude-opus-5` server-side with a tool loop,
adaptive thinking, prompt caching, SSE frames to the browser. New SSE frame:
`findings` (a review round). The client sends back both the decision log and a
compacted findings list each turn so the model keeps its board across turns.

Access: Clerk-gated under `/clients/` plus the per-user `protocol-authoring` workspace
grant (registered in `content/clients.ts`, managed from `/admin`). The API route
enforces the same grant.

All content is synthetic. HORIZON-Lung-301, MRD-1872, Meridian Oncology, the funnel,
country, and regulatory figures are fictional demonstration scaffolding.
