# Synthetic Trial Corpus — Schema, Provenance, and Encoded Signal

**Generator:** `pipeline/generate_trial_corpus.py` (+ `trial_corpus_content.py`, `trial_corpus_sensitivity.py`)
**Output:** `public/data/trial-corpus/` — 17 JSON files, ~7.4 MB
**Regenerate:** `python3 pipeline/generate_trial_corpus.py --out public/data/trial-corpus`
**Seed:** `20260806` — fixed. Reruns are byte-identical.
**Version:** `2.0.0` — 150 protocols (30 NSCLC), weighted toward thoracic oncology for the hero flow; adds the v0.2 sensitivity layer.

## v0.2 sensitivity layer (new in 2.0.0)

Four artefacts carry the PRD's sensitivity flow. All deterministic, all synthetic.

| File | Grain | Carries |
|---|---|---|
| `procedure_operations.json` | one row per (procedure × site type) | scheduling lag, in-house availability, patient refusal, unit cost, staffing dependency — the numbers a procedure what-if (UC2/UC4) reads |
| `assessment_operations.json` | one row per assessment | CRF data points, site entry minutes, query lag, database-lock contribution — the endpoint what-if (UC3) |
| `criterion_attribution.json` | one row per (TA × criterion) | mean screen-fail attribution across protocols using it — the criteria-burden waterfall (UC1) |
| `design_brief.json` | one object | the pre-drafted Phase 2 2L NSCLC brief the demo opens on, with selectable element ids and the GI-verification hook |

`description_of_change.json` gains `timing_months_from_fpi` and `cost_estimate_usd`
(the ~$500K framing) so the amendment-risk sweep (UC6) resolves to months and
dollars. The engine that composes these into scenarios lives in
`lib/trialCorpus.ts` — the model constructs scenarios and narrates; the arithmetic
is all in the data it retrieves.

> **Entirely synthetic.** No real sponsor, site, investigator, protocol, or participant.
> Generated for demonstration only. Not fit for any clinical, regulatory, or operational
> decision.

---

## What it is

Two layers joined on `protocol_id`:

| Layer | Modelled on | Status of source |
|---|---|---|
| **Protocol structure** | WCG Trial IntelX™ Data Dictionary v1.1 — 15 deliverable sheets | Sample output supplied (2 Phase 2 asthma protocols); summary exhibit only, full dictionary not available |
| **Operational outcomes** | KMR Clinical Data Workbook — Trial Info (85 fields) + Site Info (65 fields) | **Field names only, zero data.** Every value in this layer is synthesized. |

The join is the point. Trial IntelX describes what a protocol *demands*; KMR describes what
*happened*. Neither alone supports an insight a protocol lead doesn't already have.

## Corpus shape

| | |
|---|---|
| Protocols | 150 (v2.0.0; 30 in NSCLC) |
| Sites | 3,040 |
| Eligibility criteria rows | 9,592 |
| SOA time-and-event rows | 9,304 |

Criteria and SOA row counts per protocol were tuned to match the supplied sample
(64–73 criteria, 62 SOA rows).

**Therapeutic areas** — Respiratory 30, Oncology 30, Immunology & Inflammation 24,
Cardiometabolic 20, Neurology 16. Respiratory and Oncology carry the depth.

**Phases** — weighted toward 2 and 3, as a real portfolio is.

## Files

| File | Shape | Contents |
|---|---|---|
| `protocols.json` | 120 records | Trial Representation Summary (32 fields) + derived indices + KMR operational fields, flattened |
| `eligibility.json` | columnar, 7,827 rows | 15 Data Dictionary fields + `criterion_type` |
| `soa_grid.json` | 120 records | Schedule of Assessments grid rollups (22 fields) |
| `soa_events.json` | columnar, 7,649 rows | Time & Event, 42 fields incl. LOINC/CPT and invasiveness |
| `sites.json` | columnar, 2,361 rows | KMR Site Info: cycle dates, enrollment, deviations, demographics |
| `objectives.json` / `endpoints.json` | columnar | Primary/secondary/tertiary, with domain |
| `dosing.json` | columnar | Dosing Schedule (7 fields) |
| `concomitant_medications.json` / `prohibited_medications.json` | columnar | Con-med sheets |
| `document_history.json` / `description_of_change.json` | columnar | Amendments and what each changed |
| `vocabularies.json` | object | Controlled vocabularies + provenance flags |
| `manifest.json` | object | Counts, versions, file sizes, disclaimer |

**Columnar format** — big tables ship as `{columns: [...], rows: [[...]], rowCount: n}`
rather than arrays of objects. Roughly 60% smaller. Expand on read.

`soa_events.json` is 3.4 MB on its own. Query it server-side; do not fetch it whole into
the browser. Everything else is comfortably client-loadable.

---

## Extensions beyond the published schema

Flagged so they are never mistaken for Trial IntelX fields:

| Field | Where | Why |
|---|---|---|
| `criterion_type` | eligibility | **The gap worth knowing about.** The sample's summary sheet reports `inclusion_criteria_count` and `exclusion_criteria_count`, and both reconcile exactly to row counts — but the Eligibility Criteria sheet carries no per-row flag. The information exists upstream and is dropped in the deliverable. Without it you cannot separate "who qualifies" from "who is ruled out". |
| `restrictiveness_index` | protocols | 0–100. How hard the criteria set is to pass. |
| `burden_index` | protocols | 0–100. Participant assessment load. |
| `diversity_drag_index` | protocols | 0–100. How far the criteria narrow the population beyond the clinical question. |
| `startup_days` | sites | Site selection → initiation. |
| `total_endpoints_count` | protocols | Convenience rollup. |

### How the three indices are scaled

Each is a blend of **percentile rank (60%)** and **min-max (40%)** across the corpus.
Pure min-max left the right-skewed burden distribution bunched at the bottom behind a
single outlier; pure percentile made the histograms suspiciously flat. The blend keeps a
plausible shape while making "82nd percentile for assessment burden" literally true of
this corpus.

They are **corpus-relative**, not absolute. A restrictiveness of 70 means "restrictive
compared to these 120 protocols," nothing more.

---

## Encoded signal

The corpus is **not random**. Design choices drive operational outcomes through an
explicit causal model, so the analytics find real structure rather than noise. Measured on
the generated data:

| Relationship | Pearson r |
|---|---|
| restrictiveness → screen-fail rate | **+0.92** |
| burden → dropout rate | **+0.93** |
| burden → total protocol deviations | **+0.68** |
| screen-fail rate → enrollment duration | **+0.61** |
| restrictiveness → enrollment duration | **+0.60** |
| restrictiveness → major amendments | **+0.43** |

Amendments are also *targeted*: protocols above 55 restrictiveness amend their eligibility
sections first, and high-burden protocols amend the schedule of assessments. The amendment
record shows the sponsor discovering the problem mid-flight.

`burden × screen-fail` runs slightly **negative** (−0.28). That's phase structure, not a
bug: late-phase trials run longer schedules (more burden) but broader criteria (less
restrictive).

### The diversity finding — and the trap in it

High-`diversity_drag` criteria — BMI caps, eGFR floors, ANC floors that ignore benign
ethnic neutropenia, study-partner requirements, education minimums for cognitive norming,
"able to attend all visits" — narrow the enrolled population through two channels:

1. **Within-site**: enrollment shifts toward the local majority group.
2. **Site mix**: restrictive protocols concentrate in academic centres and away from
   community and safety-net sites.

Measured, US sites only: low-drag protocols enroll **29.7%** non-White participants,
high-drag protocols **13.4%**.

**The trap:** at the whole-corpus level that correlation nearly vanishes (r = −0.17),
because country mix swamps it — a protocol that happened to run sites in Japan reads as
low-diversity regardless of its criteria. Controlled for country, r is −0.73 to −0.83.

This is textbook Simpson's paradox, and it is in the corpus deliberately. Any analysis
that doesn't stratify by geography will reach the wrong conclusion. Worth knowing before
someone plots it live.

---

## Known limits

- **Enum values are reconstructed.** The Data Dictionary summary names Appendices A–I but
  doesn't reproduce their permitted values. `vocabularies.json` marks each vocabulary
  `observed_in_sample`, `inferred`, or `tweed_extension`. The inferred ones — notably
  Amendment Type — should be replaced when the full v1.1 dictionary is available.
- **Two source protocols.** All clinical content outside Respiratory is constructed from
  domain conventions, not from Trial IntelX output. The *shape* is faithful; the
  vocabulary in Oncology, I&I, Cardiometabolic, and Neurology has not been checked against
  real Trial IntelX extractions.
- **The operational layer has no empirical anchor.** KMR supplied field names only.
  Cycle times, screen-fail rates, and deviation counts are plausible, not benchmarked.
  If real KMR data arrives, recalibrate the base rates in `build_operational()`.
- **Sites are fictional but plausible-looking.** Names are generated from patterns
  (`{city} University Medical Center`). None are real. Worth stating on screen if the demo
  shows a site map.
