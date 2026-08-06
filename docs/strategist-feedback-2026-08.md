# Protocol Strategist — changes from the Pfizer & HiBio interviews

**Date:** 2026-08-06
**Source:** Two product-feedback interviews — a Pfizer clinical-operations director (oncology) and a HiBio clinical-development director (transplant). Transcripts and call summaries on file.
**Companion docs:** `clinical-trial-strategist-prd.md`, `clinical-trial-protocol-strategist-plan.md`

This note records what the two interviews said, what we changed in the strategist because of it, and what we deliberately left for later.

## What we heard

Both directors were bullish on the category and liked the interface — the chat-plus-controls layout, the honest "I don't have that data" behavior, and the sensitivity framing. Neither had been *wowed* yet, and both said the same thing about why: **the tool has to answer the few questions they actually make decisions on, and answer them well.** Four themes drove the changes.

1. **Answer a few questions really well: cost, site footprint, timelines, endpoints.** The Pfizer director walked us straight through them — "what are the costs? what are the timelines? what is the site distribution and country footprint? … building out that blueprint." She pushed hardest on **cost** (a per-patient cost linked to the schedule of assessments, split into direct and indirect, rolled to a total, benchmarked to fair-market value) and **site footprint** ("build a site and country footprint for me — tell me where I should run my trial, how many sites based on the sample size, and hit my regulatory targets"). HiBio echoed cost, endpoints, and "I don't want to forget about clinical operations."

2. **Running these as sensitivities is the value-add.** "If you have 10 sites vs 20 vs 50, domestic vs international, here's the range of recruit timelines and costs" — "that's exactly what I want. I want it to be dynamic … what is my probability of hitting my target." A defensible range beats a point estimate they then have to defend to governance.

3. **Solving the blank-whiteboard problem through the left controls is valuable — improve it.** "If you just gave me a blank slate of 'what do you want to ask it?' … I like this because it's like a funnel, it starts narrowing down your thought process." The controls are the differentiator against a raw agent in Gemini/Copilot; make them do more work.

4. **Other data sources matter: expert interviews, costs, regulatory.** Expert/KOL feedback is "the bread and butter," captured today only ad hoc; a Fair Market Value database exists internally and is a gap; regulatory precedent ("what concerns does the FDA consistently bring up? are the endpoints acceptable?") kept coming up, especially from HiBio.

## What we changed

### 1. Cost is now a first-class question (`trial_cost`)

New tool and chart. It builds a **per-patient cost from the schedule of assessments** — procedure unit costs from `procedure_operations` weighted by the site mix, per-visit overhead, plus indirect (data-management minutes from `assessment_operations`, and per-site activation and maintenance over the enrollment window) — splits **direct vs indirect**, and rolls to a **total study cost**. It returns three grounded scenarios at the comparator cohort's p25 / median / p75 SoA intensity, so cost comes back as a **lean / as-drafted / rich range** rather than one number. Every dollar traces to a corpus table; the coefficients that convert effort to dollars are named in `lib/trialCorpus.ts` (`COST`) and flagged as synthetic fair-market scaffolding, not a quote. This directly answers the Pfizer director's per-patient-linked-to-SoA and direct/indirect/total asks, and the FMV gap she named.

### 2. Site footprint is now a first-class question (`site_footprint`)

New tool and chart. Given a target N, a site count, and **regulatory region floors** (default ≥20% North America, the FDA US-enrollment target she cited), it recommends a **country allocation** using each country's measured per-site enrollment rate and startup time from the site table, meeting the floors first and then filling with the fastest enrollers. It prices the **site-count sensitivity** — lean / planned / aggressive — reporting recruit timeline and activation cost for each, which is the "10 vs 20 vs 50 sites" ask almost verbatim. The chart plots expected subjects by country (the "he can't map it, there's no geography" gap) plus the per-scenario timeline. Honest limit surfaced in the tool output: the corpus carries 12 countries and no China, so a China floor can't be grounded here.

### 3. Left controls reorganized around exactly the four key questions, and made to work on a blank page

The "Analyses" panel was a flat set of data-category checkboxes. It's now a **decision funnel** organized around exactly the four questions the directors named — **Cost, Site footprint, Timelines, Endpoints** — each a collapsible group expanding to a short list of grounded, chart-backed analyses. The eligibility and amendment analyses were folded into the four (screening burden under Timelines, amendment cost under Cost) rather than given their own bucket, so the funnel stays at four.

Crucially, the **blank / net-new mode** previously showed *no* controls at all — just a "nothing drafted yet" message, which is the blank-whiteboard problem at its worst. It now shows the same four-question funnel, with each analysis phrased at the comparator-cohort level ("what does a trial like this typically cost?"), so a team starting from scratch gets the same substrate to dig in.

### 4. Data connectors bucketed to declutter

The connector list had grown crowded — every source in every category listed flat. It's now four **collapsed buckets** — Licensed & real-world data, Regulatory & competitive, Cost & fair-market value, Internal — each showing a source count and how many are requested, and breaking out to its example sources only when opened. The new sources answer point 4 of the feedback: **Regulatory & competitive** (FDA/EMA guidance & precedent, AdComm/CRL history, registries), **Cost & fair-market value** (FMV benchmarks, grant-plan budgets, portfolio finance like Planisware/RAPID), and the internal "KOL & advisory input" reframed as **Expert & KOL interviews**. Still preview affordances, provisioned per engagement.

### 5. Charts default to showing the sensitivity

Encoded a charting policy so the visuals match the range-based questions: **line** charts carry a low / medium / high band across a continuous knob, **bar** charts compare discrete scenarios, and **heatmaps** explore two parameters at once (e.g. site count × country, or eligibility strictness × endpoint load) — the default when the user varies two knobs together or crosses multiple selected options. The generated-chart engine now renders heatmaps inline (self-contained SVG, no external requests), and the model is instructed to reach for them over several separate charts when two dimensions matter.

### 6. Site footprint shows a map

The footprint panel now leads with an **inline SVG proportional-symbol world map** — continent silhouettes drawn from coarse polygons, country bubbles placed at real lat/long and sized by expected enrollment, colored by region, with a size legend and the scenario timeline below. It is fully self-contained (no tile server, no external request), so it renders within the page CSP that blocks the usual mapping libraries. This is the "he can't map it, there's no geography" gap from the Pfizer call, now closed.

### 7. Model guidance

The system prompt names the four headline questions, points the model at `trial_cost` and `site_footprint`, states the standing preference to answer each as a sensitivity range, and carries the charting policy above. Blank-mode guidance lists the new brief-scoped tools as unavailable until a design exists.

## Deliberately deferred

- **Probability of hitting the target.** Both directors wanted a confidence number on the blueprint ("what is my probability of hitting my target"). This needs a calibrated model of enrollment variance; the honest version is more than a coefficient, so it's not in this pass. The footprint timeline is a point estimate for now.
- **A survey-grade choropleth map.** The footprint map is a proportional-symbol map on coarse continent silhouettes — recognizable and self-contained, but not a precise country-shape choropleth. A real basemap is a heavier asset; the data supports upgrading it when we want it.
- **Endpoint regulatory acceptability.** HiBio wanted "have all the endpoints been acceptable to all the regulatory bodies … which studies failed and why." That's a regulatory-precedent dataset we don't hold in the corpus; the new Regulatory connector is where it would plug in.
- **Voice input and an in-Gemini/Copilot agent surface.** Both raised the "another portal" concern and asked for voice and native-agent embedding. That's a distribution decision above this demo, noted in the PRD's platform vision.
- **Delivery-phase tooling** (medical monitoring, data review). Explicitly out of scope — this demo stays upstream, which both directors agreed is the right entry point.

## Files touched

- `lib/trialCorpus.ts` — `trialCostModel`, `siteFootprint`, and the `COST` / region-mapping helpers.
- `lib/strategistTools.ts` — `trial_cost` and `site_footprint` tool definitions and execution.
- `components/protocol-strategist/FixedCharts.tsx` — cost-breakdown and site-footprint charts.
- `components/protocol-strategist/BriefPanel.tsx` — decision-question explorer; blank mode now carries controls.
- `components/protocol-strategist/DataConnectorsPanel.tsx` — regulatory, cost/FMV, and expert-interview sources.
- `components/protocol-strategist/StrategistWorkspace.tsx` — tool labels and starter questions.
- `app/api/protocol-strategist/route.ts` — system-prompt guidance for the four questions and new tools.
