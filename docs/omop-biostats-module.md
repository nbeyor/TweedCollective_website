# OMOP Biostatistics Analytics Module — build documentation

**Source PRD:** OMOP Biostatistics Analytics Module PRD v0.1 (2026-08-28)
**Built:** 2026-08-28, integrated into the Clinical Trial Protocol Strategist as the funnel's leading question (strategist PRD v1.4)
**Tests:** `npm run test:biostats` (88 checks — reference fixtures, validation rejections, idempotency, RWD signal, end-to-end)

## What this is

A deterministic backend module that loads a synthetic longitudinal dataset in an OMOP CDM v5.4 subset, derives standard cohort statistics, and executes a fixed catalog of common clinical-trial design analyses. The host application (the strategist workspace, or any API caller) requests a named analysis with validated parameters. **No LLM selects the method, generates executable code, or changes statistical assumptions** — in the strategist, the chat model's only roles are grounding assumptions through the fixed `rwd_summary` descriptive tool and interpreting completed runs.

## Architecture (four bounded services, PRD §4)

| Stage | Implementation | Output |
|---|---|---|
| Synthetic data | `pipeline/generate_omop_dataset.py` → `public/data/omop-demo/` (columnar JSON + manifest) | Versioned OMOP tables |
| Cohort service | `lib/omop/cohorts.ts` (`POST /api/analytics/cohorts/{id}/materialize`) | Versioned cohort record |
| RWD summaries | `lib/omop/summaries.ts` (`POST /api/analytics/rwd-summaries/{fn}`) | Rates, variance, censoring, accrual, retention, journey |
| Analytics engine | `lib/biostats/engine.ts` + `groupSequential.ts` + `stats.ts` (`POST /api/analytics/analysis-runs`) | Power / sample-size result |
| Result store | Content-addressed run records (`GET /api/analytics/analysis-runs/{run_id}`) | Reproducible analysis run record |

## The OMOP demo dataset

A **separate data asset from the trial corpus** (`public/data/trial-corpus/`); the two stores share nothing and version independently.

- **10,800 synthetic patients**, 2019–2025, seeded (`seed 20260828`, dataset v1.0.0), all records synthetic-marked. Dates ship as integer day offsets from the manifest epoch (2019-01-01).
- **Tables** (PRD §5): PERSON, OBSERVATION_PERIOD, VISIT_OCCURRENCE, CONDITION_OCCURRENCE, DRUG_EXPOSURE, PROCEDURE_OCCURRENCE, MEASUREMENT, DEATH, CONCEPT / CONCEPT_ANCESTOR, COHORT / COHORT_DEFINITION. Concepts use the OMOP custom-vocabulary 2-billion ID range (`TWEED-DEMO`) — no claim to licensed Athena content.
- **Disease cohorts with encoded signal** so the summaries find real structure:
  - *Advanced NSCLC* (2,600) — overall survival median ~17 mo; anti-PD-1 exposure carries an encoded HR ≈ 0.72 vs chemo-only (KM medians 20.5 vs 14.9 mo); progression events; 21-day treatment cycles; CT imaging cadence.
  - *Heart failure* (3,100) — 12-month HF-hospitalization risk 0.300 (denominator rule below); NT-proBNP / LVEF; guideline drug eras; SGLT2i users encoded lower.
  - *Severe asthma* (3,100; 699 severe-eosinophilic) — baseline FEV1 60.6 ± 13.9 % predicted with ~19% missingness; exacerbation events ~1.1/yr, biologic users lower.
- Realistic **missingness** (labs absent at a share of visits), **censoring** (disenrollment ~9%/yr plus administrative end), treatment exposure, binary and time-to-event outcomes — the PRD §5 seed-data requirements.
- Regenerate with `python3 pipeline/generate_omop_dataset.py` (fully deterministic; manifest carries per-file SHA-256 prefixes).

**Predefined cohorts** (materialized at generation time by applying the definition logic over the generated tables): 101 advanced NSCLC · 102 NSCLC on anti-PD-1 · 103 NSCLC chemo-only · 201 heart failure · 301 severe asthma · 302 severe eosinophilic asthma.

## Fixed RWD summary functions (PRD §6, plus one)

All deterministic, callable by ID, parameters bounded, unknown endpoints/cohorts rejected with the registered list. Every result carries a `provenance` block: source, dataset version, function version, cohort id/name/logic/n, windows, estimate date, caveat.

| Function ID | Returns |
|---|---|
| `cohort_characterization` | N, age, sex, top baseline conditions/treatments, baseline measurements |
| `binary_endpoint_rate` | events, denominator, risk, **Wilson 95% CI**, censoring exclusions |
| `continuous_endpoint_summary` | N, missingness, mean (±95% CI), SD, median, quartiles |
| `time_to_event_summary` | events, person-years, censoring, **Kaplan–Meier** median + 12/24-mo survival (Greenwood log-log CIs), monthly curve |
| `accrual_summary` | eligible patients by calendar month and site; empirical p25/median/p75 monthly flow; months-to-target scenarios under an **explicit** capture-rate assumption |
| `retention_summary` | follow-up distribution; loss-to-follow-up by 6-month interval, deaths and administrative censoring separated |
| `patient_journey` *(v1.4 addition)* | the registered SoA template's scheduled events laid against observed monthly care intensity, retention, milestone medians (first treatment, first imaging, progression, death), and scheduled-imaging vs observed-imaging adherence |

Binary-rate denominator rule: a member counts if they had the event within the window **or** carried complete potential follow-up; members censored early without an event are excluded and reported (`excluded_for_censoring`), with a warning when that share is large.

Registered endpoints (binary / continuous / time-to-event) are a fixed list in `lib/omop/summaries.ts`, each declaring its OMOP resolution and valid cohorts.

## Fixed biostatistics analytics catalog (PRD §7)

Ten registered analyses, versioned, each with a typed parameter schema (required fields, defaults, ranges, enums, descriptions) served by `GET /api/analytics`:

`ss_continuous_2arm` · `ss_binary_2arm` · `ss_survival_2arm` · `ss_noninferiority_continuous` · `ss_noninferiority_binary` · `power_continuous_2arm` · `power_binary_2arm` · `power_survival_2arm` · `gs_survival_2arm` · `scenario_grid`

**Methods basis** (in place of the PRD's R packages — see *PRD deltas*):

- Continuous sample size: normal approximation with the **Guenther** t-correction (`+ z²/4` per arm) — matches `power.t.test`'s classic δ=0.5/SD=1/80% example at 64/group.
- Binary: pooled-variance z formula (**Lachin 1981**), no continuity correction (documented).
- Survival: **Schoenfeld** events + per-arm event probability under exponential survival, exponential dropout, uniform accrual (Simpson integration over entry times) — reproduces the textbook HR 0.75 → 380 events.
- Noninferiority: one-sided shifted-margin z (**Blackwelder**), unpooled variance for binary.
- Group-sequential: **Lan-DeMets error spending** (O'Brien-Fleming-like and Pocock-like), efficacy boundaries and crossing probabilities by the standard recursive numerical integration (Jennison & Turnbull ch. 19; grid h = 0.02 on [−8, 8]); drift solved for target power; event inflation vs the fixed design. LD-OBF K=2 boundaries reproduce the published 2.963 / 1.969.
- `scenario_grid`: repeats one registered analysis over an explicit 1–2 parameter grid (≤100 cells); every cell fully validated.

**Functional requirements (PRD §9), as implemented:**

- Unknown analysis IDs, unexpected fields, out-of-range values, and incomplete requests are rejected **before** anything executes, with the allowed field list in the error.
- Optional fields carry schema defaults; applied defaults are recorded in `defaulted_fields` and surfaced as a warning ("confirm they match the intended design").
- RWD-derived inputs arrive with caller-supplied `derived_from` labels (field, function, cohort, window, estimate date, uncertainty) echoed onto the run record; the workbench attaches them automatically and drops the label if the user edits the value.
- Results return total and per-arm N, achieved power where applicable, event targets, echoed assumptions, warnings, a plain-language interpretation, and machine-readable calculation details (z-values, intermediate quantities, exact pre-rounding N). Display rounding only; full precision in `calculation`.
- **Idempotency:** `run_id = sha256(analysis_id, analysis_version, engine_version, canonical(inputs))`. Identical normalized inputs ⇒ identical run_id and byte-identical outputs.
- Engine stamp on every run: engine name/version, deterministic flag, `seed: null` (no simulation in the registered set), methods basis.
- No arbitrary code path exists: the engine is pure TypeScript with a closed dispatch table; there is no expression evaluator, no dynamic import, no outbound call.

## API (PRD §8 → App Router)

| PRD endpoint | Implementation |
|---|---|
| `GET /analytics` | `GET /api/analytics` — catalog, schemas, RWD functions, endpoints, cohorts, dataset manifest |
| `POST /cohorts/{definition_id}/materialize` | `POST /api/analytics/cohorts/{definitionId}/materialize` |
| `POST /rwd-summaries/{function_id}` | `POST /api/analytics/rwd-summaries/{functionId}` |
| `POST /analysis-runs` | `POST /api/analytics/analysis-runs` |
| `GET /analysis-runs/{run_id}` | `GET /api/analytics/analysis-runs/{runId}` |

All routes sit behind the same Clerk workspace gate as the strategist (`protocol-strategist`). Example request/response follow the PRD §8 shape; the PRD's example (`ss_binary_2arm`, 0.30 vs 0.22, 80%, 10% dropout) returns 471 evaluable per arm — pinned in the test suite.

## Verification (PRD §10 acceptance criteria)

`scripts/test-biostats.ts`, run via `npm run test:biostats`:

1. **Reference fixtures** — `pipeline/biostats_reference.py` independently implements the documented formulas with scipy distributions and its own GS recursion (finer grid, h = 0.01), and embeds published-value assertions (power.t.test 64/group; Schoenfeld ~380 events; LD-OBF 2.9626/1.9686). Tolerances: sample sizes **exact integer match**; power ±0.001; event probabilities ±0.005; GS z-boundaries ±0.005; inflation factor ±0.01.
2. **Unregistered execution impossible** — unknown analysis id, unknown/injected field, out-of-range value, wrong version, oversized grid, grid-over-grid: all rejected.
3. **Reproducibility** — same normalized inputs ⇒ same run_id, identical outputs; runs retrievable; version changes visible in the record (analysis_version + engine.version + dataset version on RWD provenance).
4. **RWD signal** — encoded values reproduced (HF 12-mo risk 812/2707 = 0.300; NSCLC chemo-only KM median 14.9 mo with the IO cohort >3 mo longer; FEV1 60.6 ± 13.9 with missingness; monotone KM; 4-interval retention).
5. **End-to-end** — control rate derived from OMOP (cohort 201, `hf_hospitalization`, 12 mo) passed as an explicitly `derived_from`-labeled input into `ss_binary_2arm`, reproducibly.

Numeric primitives: `normInv` (Acklam + Halley refinement) accurate to ~1e-7 — ample for design formulas; `normCdf` via the Numerical Recipes erfc (~1.2e-7 fractional).

## Strategist integration (v1.4 surface)

- **Funnel reorder:** biostatistics → study design → endpoints → regulatory → site footprint → timelines → cost (`components/protocol-strategist/BriefPanel.tsx`).
- **Biostatistics workbench** (`BiostatsPanel.tsx`): the user picks a registered analysis and cohort, pulls RWD defaults ("Pre-fill from RWD" — value lands labeled with cohort, estimate date, and uncertainty; editing the value drops the label), confirms every assumption, runs. Results render as a fixed insight-panel chart (`biostats_result`: per-arm N bars / power gauge / GS boundary plot) and register in the session's run context.
- **Patient journey** runs from the same panel and renders the `patient_journey` fixed chart: SoA events (top band) over observed retention and care intensity, milestone medians, and scheduled-vs-observed imaging adherence.
- **Chat**: one new grounded tool, `rwd_summary` (descriptive only); completed workbench runs travel with each request (like the decision log) so the model can cite them across turns. The system prompt forbids the model from computing any design statistic and routes those asks to the panel.

## PRD deltas (deliberate, founder-approved 2026-08-28)

1. **TypeScript engine instead of R services.** The site deploys as a serverless Next.js app (Vercel); there is no R runtime. The registered analyses are implemented in deterministic TypeScript from the same standard formulas the PRD's packages implement, and gated against independently computed reference fixtures with documented tolerances. The PRD's contracts (fixed registry, versioned schemas, validation, provenance) are kept in full. A production path can swap the engine for a pinned R image behind the same `/analysis-runs` contract.
2. **Columnar JSON instead of PostgreSQL/DuckDB.** Same pattern as the trial corpus: a seeded Python pipeline emits versioned columnar JSON read server-side. The OMOP table and column names follow CDM v5.4 so the schema stays portable to a SQL store.
3. **Result store is content-addressed, in-memory per instance.** Serverless has no durable disk; determinism supplies the PRD's idempotency and reproducibility (re-POSTing inputs reproduces the identical record), and the 404 on a cold instance says exactly that.
4. **A front-end exists** (the PRD scoped backend-only). Founder direction: biostatistics joins the strategist funnel first, with the workbench as the deterministic surface — the module's "host application."
5. **`patient_journey` added** to the RWD summary registry (founder direction): trial events over the patient-journey timeline, RWD-informed, relative to the SoA.
6. **Simulation-backed methods (simtrial-class) not included** in v1; the registered set is closed-form/numerical and needs no seeds (`seed: null` recorded per run for the provenance contract).
