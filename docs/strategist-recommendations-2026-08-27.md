# Demo Prototype - Suggested Changes vs PRD v1.0
**From the round 2 demo sessions (Regeneron x2, Roche, Novartis, Ipsen) plus re-read of rounds 1-2. Each item cites the PRD section it modifies and who asked. August 27, 2026. Revised same day per direction: keep the prototype and PRD simple while the data science proof work runs. No new connectors, no artifact-creation push. HTML charts carry testing. Flexible artifact inputs and outputs stays as a design insight, not a build item.**

The one-line summary: round 2 validated the architecture and attacked the numbers. The build priority shifts from adding features to making the existing answers auditable and compliant, while the proof plan does the heavy lifting. Verdict to beat: "This tool is wonderful. It's not ready right now."

---

## P0 - Fix before the next round of demos

### 1. Enforce regulatory floors in the footprint engine, and fix the 7% US answer
**PRD refs: §4.2 (site footprint), §7.2 (grounding contract), UC9.**
The PRD already specifies a default ≥20% North America floor. The live demo recommended 7% US on the NSCLC Phase 2 protocol and the Regeneron clin dev physician caught it immediately, citing an FDA filing rejected with under 10% US patients. This is a grounding-contract failure in the flagship use case, and it converted an enthusiastic session into "not ready."

- Make the floor a hard constraint in `site_footprint`: allocations satisfy the floor first, then optimize on enrollment rates (this is UC9's spec, verify the tool actually honors it and that the prompt makes the floor non-negotiable).
- Surface the floor in the answer: "US at 22%, above the 20% regulatory floor" so compliance is visible, not implicit.
- Add a floor-editing affordance (the user's real floors differ by indication and agency posture).

### 2. Evidence lineage in the chat surface
**PRD refs: §7.2 (named coefficients), §7.4, product-expert MVP list ("evidence view").**
Novartis: "Nowhere here do I see a link or a section in terms of sources... scientists, if there's a number they don't understand, they're not trusting." The evidence view is already on the MVP list. Promote it into the demo now:

- Per-number source chips in answers: which corpus tables, how many records, what filters.
- A browsable corpus library panel (Novartis asked to open and inspect the repo protocols).
- Scenario definitions on demand: what lean / as-drafted / rich means, which assessments each includes (Ipsen: "that's the part that will trip people up"). Offer the alternative anchor Ipsen suggested: "benchmark against your own last five trials in this TA" once internal connectors exist, and say so honestly until then.
- Keep the best-guess flag: when a number is an estimate, say it and ask, "would you agree?" (Novartis's collaboration framing).

### 3. Onboard from a study schema, not only a brief
**PRD refs: §5 (three modes), A2.**
Pfizer clin ops: "Sometimes all we have is a study-design one-slider. I wouldn't have all this information yet." Roche and Regeneron start from concept sheets. Add a fourth entry point between Blank and Hero: paste or upload a skeletal design (indication, phase, arms, endpoints, target N) and get the funnel scoped to it, with honest gaps ("no SoA yet, cost answers will be comparator-level").

---

## P1 - Next build cycle

### 5. Probability of success, the honest version
**PRD refs: §14 (deferred), A12.**
The deferral threshold is met: both round 1 testers, Regeneron clin ops in round 2, and the AZ exec KPI frame from Wave 1. Build the defensible version, not a model: an empirical percentile against the comparator cohort ("designs with this burden and footprint completed enrollment on time in 68% of comparator trials"), drivers named, presented as a range like everything else. Explicitly label what it is not (no fitted enrollment-variance model yet). Sequence it behind the backtest in the proof plan so the number ships already validated.

### 6. Chart interactivity: one knob per fixed chart
**PRD refs: §7.4, §9.**
Regeneron clin ops asked to toggle site count on the footprint chart instead of re-prompting. Novartis asked whether charts are editable. Add a single slider or toggle to the two headline fixed charts (site count on footprint, SoA intensity on cost) that re-runs the underlying tool. Keep the chat as the general path. This is also the cheapest demo-wow per unit of build.

### 7. Study-design structure as a funnel category
**PRD refs: §4, §5 (decision funnel).**
Regeneron clin ops: interrogate design type itself (single-arm vs crossover vs basket, blinding, comparator choice) as a category alongside the four questions. Start with comparator-cohort evidence ("what designs did similar trials use, with what enrollment outcomes") rather than recommendation logic.

### 8. Oncology-first depth, and stop showing the mixed-TA picker to oncology audiences
**PRD refs: §10 (corpus), §5 (Corpus mode).**
Regeneron clin dev: three protocols spanning oncology and general medicine reads as "too broad to be accurate." Oncology has distinct FDA expectations, site dynamics (academic centers refusing Phase 3, community-site identification, population alignment), and vendor precedent (Flatiron and IQVIA split oncology out). For oncology demos, present an oncology-only protocol set and lean on the 30-protocol NSCLC depth. Longer term, deepen oncology operational realism in the corpus (site-type dynamics above, ideally a site-registry layer).

### 9. Innovation-lens probe
**PRD refs: §4 (folded analyses), §7.3.**
Ipsen: every trial at his company gets asked "did you consider DCT, wearables, ePRO, biobanking?" Add a canned analysis that sweeps the draft for these options with burden/timeline/cost deltas where the corpus supports them and honest refusal where it does not. His ePRO what-if worked well in session until the chart failed (see 12).

### 10. Publish flow: version chain, not new copies
**PRD refs: §7.5, §7.6, A10.**
Roche named the risk in the current design: every publish emits a fresh Google Doc and "multiple copies flying around" is what document-control cultures fear. Near-term fix is narrative plus mechanics: publish updates one canonical doc with a version history section, and the decision log records the chain. This also tees up the SharePoint/M365 direction from the product-expert review without building it yet.

### 11. Demo QA sweep
**PRD refs: §12 (success criteria 2, 5).**
Two live failures in round 2: the ePRO timeline chart failed to render in the Ipsen session (fallback showed, page held, but the moment was lost), and the footprint floor miss in item 1. Add both prompts to the scripted test set (UC-level regression: the Ipsen ePRO chain and a "recommended country footprint" run on each hero protocol with floor assertions).

---

## P2 - Roadmap, keep deferred but re-scored

- **Artifact export (moved from P0 by direction).** Three round 2 users routed outputs to governance decks: chart export to PPT/Excel, session-to-deck compilation, decision-log appendix ("that would enthrall me"). The demand is real and recorded. Held for now to keep the prototype simple: HTML charts carry testing, and the flexible inputs-and-outputs insight lives in the PRD as a principle, not a build.
- **Competitive intelligence layer (moved from P1 by direction).** Three requesters want active trials, competitor site overlap, and pipeline moves in the same surface. Doing it right means a new data layer, so it parks with the proof plan's data-sourcing decisions rather than the build list.
- **RWD-validated analytic as a proof asset.** Not a demo feature: run one headline analytic (patient-journey or screen-fail sensitivity) against a real licensed data set and publish the validation. Two round 2 experts independently framed this as the credibility unlock. Candidate for the engagement's data-science track.
- **Site-level registry data.** Regeneron clin dev wants named-site reasoning (US oncology site registry, community-site identification, population alignment). High value, big data lift, sequence after the oncology-depth work.
- **Year-by-year cost phasing** (Ipsen): small extension of the cost tool once budget-cycle framing matters, note it in the cost answer's honest-limits line until then.
- **Voice input** (Pfizer, round 1): unchanged, stays deferred.
- **Delivery surfaces.** Keep both doors per the corpus split: the hosted workspace (preferred by Hi-Bio and fine for Regeneron clin ops) and the MCP server (Pfizer/Gemini, Regeneron clin dev/Claude). No change to §7.8, but stop describing MCP as the endgame in demo narration. It is one of two front doors.
- **Multi-user sessions.** Raised by Roche and Novartis, still a distinct product problem. Hold the line at the shared-doc boundary for now, with item 10 as the bridge.

---

## Baseline assumption deltas to log in the PRD (§15)

- A2 refined: starting artifact is often a one-page schema (item 3).
- A4 extended: seat-dependent lead question, regulatory alignment joining the set (items 1, 2).
- A11 softened: two delivery doors, not one winner.
- A12 broken: un-defer probability of success, sequenced behind the backtest (item 5).
- A9 validated: decision log confirmed unprompted (Ipsen). Governance export demand recorded, held in P2 by direction.
- New principle to log: flexible artifact inputs and outputs is a design insight the research keeps confirming. Keep the PRD simple: no new connectors or export builds while the proof plan runs.
