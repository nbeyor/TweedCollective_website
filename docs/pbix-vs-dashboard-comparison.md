# Power BI (eCS_SDLC_AI_KPI_v2.pbix) vs Website Dashboard — Calculation Comparison

**Scope:** Reconciles the SQL/M/DAX calculations inside `eCS_SDLC_AI_KPI_v2.pbix` against the
eCS SDLC dashboard's underlying analytics in this repo
(`pipeline/refresh_copilot.py` → `public/data/copilot-dashboard-data.json`, reference SQL in
`pipeline/sql/copilot_dashboard_queries.sql`, methodology in `docs/ecs-dashboard-analytics.md`).

**Data vintages compared:** the pbix import contains data through week ending **2026-07-05**;
the website JSON was generated **2026-07-15** with data through **2026-07-10** (latest full week
ending **2026-07-12**). Several "differences" are purely this one-refresh gap — they are called
out separately from genuine methodology differences below.

---

## 1. What's actually inside the pbix

There are **no hand-written SQL queries** in the pbix. Each of its 10 Power Query (M) sources is a
plain view binding to a Microsoft Fabric warehouse:

```
Sql.Database("...datawarehouse.fabric.microsoft.com", "SDLC_Copilot_Warehouse")
  → dbo.v_weekly_team_metrics, dbo.v_tickets, dbo.v_team_summary, dbo.v_size_complexity,
    dbo.v_copilot_weekly_adoption, dbo.v_copilot_user_tiers, dbo.v_copilot_intensity,
    dbo.v_copilot_assisted_weekly, dbo.v_copilot_assisted_summary, dbo.v_baseline_metrics
```

So the calculation logic lives in **two places**: (a) the warehouse view definitions (not visible in
the pbix — only their output rows are), and (b) ~70 DAX measures layered on top. The repo's
reference SQL file was written to be the canonical warehouse implementation, but the warehouse
views **do not match it exactly** — names differ and, more importantly, some numbers are not
reproducible from the reference SQL (Section 4).

### View name mapping

| pbix / warehouse view | Reference SQL view (`copilot_dashboard_queries.sql`) | Website pipeline function |
|---|---|---|
| `v_tickets` | `v_tickets` (Query 0) | `aggregate_to_tickets()` |
| `v_weekly_team_metrics` | `v_weekly_team_metrics` (Query 1) | `compute_weekly_team_metrics()` |
| `v_baseline_metrics` | `v_baseline_metrics` (Query 2) | `compute_baseline()` |
| `v_team_summary` | `v_mature_summary` (Query 3) | `compute_team_summary()` |
| `v_size_complexity` | `v_size_complexity_heatmap` (Query 4) | `compute_size_complexity()` |
| `v_copilot_weekly_adoption` | `v_copilot_adoption_weekly` (Query 5) | `compute_copilot_adoption()` |
| `v_copilot_user_tiers` | `v_copilot_user_tiers` (Query 6) | `compute_copilot_adoption()` (tiers) |
| `v_copilot_assisted_weekly` | `v_copilot_pr_correlation_weekly` (Query 7) | `compute_copilot_pr_correlation()` |
| `v_copilot_assisted_summary` | `v_copilot_pr_correlation_summary` (Query 7b) | same (summary portion) |
| `v_copilot_intensity` | `v_copilot_intensity_buckets` (Query 8) | same (intensity portion) |

---

## 2. KPI-card reconciliation (the snapshot numbers)

| Card (snapshot) | pbix shows | Website (Jul 15 data) | Verdict |
|---|---|---|---|
| Team Productivity | **0.43**, +11.7%, pre-AI 0.384 | 0.441, +14.7%, pre-AI 0.384 | ✅ Same methodology (mean-of-weekly, confident mature weeks). Gap = data vintage (21 vs 23 mature weeks). See §4.4 for a small internal inconsistency. |
| QA Churn | **22.4%**, −8.1% vs 24.4% | 23.1%, −5.4% vs 24.4% | ✅ Same methodology (pooled ticket rate). Vintage only. |
| Total Output | **687**, 27 devs, 21 weeks | 737, 27 devs, 23 weeks | ✅ Vintage only. |
| Copilot Adoption (current) | **66.7%**, "10 → 28 monthly users" | 71.7%, "10 → 34 monthly users" | ✅ Same formula (latest week ÷ rolling-4-week distinct users: 28/42 = 66.7% for Jul 5; 33/46 = 71.7% for Jul 12). Vintage only. Sub-label "53 of 28 developers" is a **DAX label bug** — see §3.1. |
| Weekly Active Users | **28**, "of 28 developers", 29/6/18 tiers | 33, "of 31 developers", 29/7/18 tiers | ⚠️ Value is vintage-only; "of 28" is a **DAX label bug** (§3.2). Tiers sum to 53 lifetime users, so "28 of 28" is internally incoherent on the card. |
| Copilot Acceptance Rate | **78.6%**, 1,890 suggestions | 77.3%, 3,235 suggestions | ✅ Identical formula (latest-week accepts ÷ suggestions: 1,486/1,890 = 78.6% for Jul 5). Vintage only. |
| Second "Copilot Adoption (current)" — **57.8%**, 616/71, 0.709 vs 0.449 | — | "Copilot Impact on Productivity": **+60.4%**, 569/168, 0.379 vs 0.237 | ❌ Card **title is a copy-paste error** (it is the assisted-vs-non-assisted productivity lift, not adoption), and the underlying numbers genuinely diverge — see §4.1–4.3. |

Bottom line on the snapshot: five of seven cards agree with the website's math and differ only
because the pbix is one refresh behind. The problems concentrate in (a) three label/title bugs,
and (b) everything derived from the Copilot-assisted correlation and intensity views.

---

## 3. DAX label/title bugs (cosmetic but visible)

1. **"53 of 28 developers"** — measure `Weekly Active Users Label_1` concatenates the operands in
   reverse order: `FORMAT(TotalDevelopers) & " of " & FORMAT(ActiveUsers)` where
   TotalDevelopers = 53 (lifetime distinct Copilot users) and ActiveUsers = 28 (latest week).
   The website's equivalent label is `{totalCopilotUsers} of {teamSize}` = "54 of 31 developers"
   (`KpiCards.tsx:68`). Note the website's own label is also questionable — telemetry contains more
   user IDs (54) than the configured team size (31; `config.copilotCoveragePct` = 174%), so this
   label confuses readers on both platforms.
2. **"of 28 developers"** under Weekly Active Users — measure `Weekly Active Users Label` assigns
   the latest week's `active_users` to its `TotalUsers` variable, so the card reads "28 … of 28
   developers". The website uses the fixed team size (31). The warehouse has no team-size table,
   which is why the DAX author reached for the wrong column.
3. **Duplicate card title** — the 57.8% card is titled "Copilot Adoption (current)" but its
   measure is `Copilot Productivity Impact` = (assisted − non-assisted) ÷ non-assisted
   productivity. Website title: "Copilot Impact on Productivity".

---

## 4. Genuine calculation divergences (not vintage, not labels)

### 4.1 Copilot-assisted classification differs → 616/71 vs 569/168

The website rule (`compute_copilot_pr_correlation`): a ticket is *assisted* if any of its PRs was
authored by an `AuthorUUID` with `suggestions > 0` in the **same Mon–Sun ISO week** as that PR's
end date. Through the same cutoff (Jul 5), the website classifies **554 assisted / 122
non-assisted**; the warehouse view in the pbix says **616 / 71** (89.7% assisted vs 82%).
Week-by-week the two disagree in *both* directions (e.g. week of Mar 1: warehouse 20/8 vs website
23/5; week of Apr 5: warehouse 24/3 vs website 17/10), so this is not explainable by data vintage
alone — the warehouse's matching rule (join key, week alignment, or the `suggestions > 0`
threshold) differs from the pipeline's.

### 4.2 Assisted productivity levels are ~1.9× the website's — and don't match the pbix's own weekly view

`v_copilot_assisted_summary` reports assisted/non-assisted productivity of **0.709 / 0.449**.
Neither number is reproducible from the pbix's *own* `v_copilot_assisted_weekly` rows, whose
mean-of-weekly is **0.409 / 0.368**. The website reports **0.379 / 0.237**. The implied
denominator in the warehouse summary is ≈8 authors/week (vs the website's 11–13), which is the
signature of counting only **one author per ticket** — the reference SQL's Query 7 contains
exactly this defect (`COUNT(DISTINCT (SELECT p.author_uuid ... LIMIT 1))` counts distinct
*first* authors only). Because numerator and denominator groups are inflated by a similar factor,
the headline **lift lands in the same ballpark (+57.8% vs +60.4%) largely by cancellation** — the
underlying levels shown on the card ("0.709 vs 0.449 tix/FTE-day") are not comparable to the
website's ("0.379 vs 0.237").

### 4.3 The QA-churn quality story flips sign

- Warehouse/pbix: assisted QA churn **0.2224 vs 0.2394** non-assisted → **−7.1%** (*assisted code
  is cleaner*).
- Website: assisted **0.2443 vs 0.1845** → **+32.4%** (*assisted code needs more QA rework*).

Both use the same pooled formula (`tickets_with_churn / tickets`); the flip is caused entirely by
the classification difference in §4.1 — moving ~100 tickets between the groups reverses the
conclusion. **This is the most decision-relevant discrepancy**: the two dashboards currently
support opposite narratives about Copilot's quality impact. Until the classification rule is
unified, neither delta should be quoted.

### 4.4 Summary vs weekly views inside the pbix disagree slightly

`v_team_summary` says 687 tickets / 21 confident mature weeks / 0.4289, but recomputing from the
pbix's own `v_weekly_team_metrics` gives 718 mature tickets / 22 confident weeks / 0.4318. The
summary and weekly views appear to have been snapshotted at different refresh times (or apply the
partial-week cutoff differently). Small today, but it means the pbix can contradict itself after
a refresh.

### 4.5 Size × Complexity buckets are stale

The pbix `v_size_complexity` uses the old cuts — size **0-300 / 301+** lines, complexity
**1-10 / 11+** files. The website pipeline now uses **0-150 / 151+** and **1-5 / 6+**
(`copilot-dashboard-data.json → bucketing`, `components/copilot-dashboard/charts/buckets.ts`).
The four heatmap cells are therefore not comparable between the two dashboards at all. (The
reference SQL file also still has the old 300/10 cuts — it's behind the pipeline too.)

### 4.6 Copilot intensity view ignores the mature filter and double-counts suggestions

pbix `v_copilot_intensity`: 31 low / 131 medium / 894 high = **1,056 tickets** — more than the
687 mature tickets, so it clearly includes baseline/transition tickets. Website (mature only,
suggestions > 0): 23 / 77 / 469 = 569. Average suggestions in the "high" bucket: **5,236 vs
435** (~12×), consistent with summing the author's weekly suggestion totals once per PR (a ticket
with several PRs in one week re-counts the same week's suggestions) and/or over all phases.

### 4.7 Placeholder values instead of NULL in the weekly assisted view

For weeks with zero non-assisted tickets, the warehouse emits `non_assisted_productivity = 0.2`
(i.e. `1/(1×5)` — a COALESCE-to-1 artifact) and QA rates like `0.000001`, where the reference SQL
and the website emit NULL. Any DAX `AVERAGE` over these columns silently ingests fake 0.2 rows.
(The reference SQL's convention — NULL — is the right one.)

### 4.8 DAX measures that deviate from the website's ROI/rolling logic

- **Two inconsistent ROI formulas coexist**: `Monthly Capacity Released` = `max(0, avgCopilotUsers
  × upliftPct) × $19,166.67` — this matches the website's `RoiCapacityChart.tsx` ($230k/12 ✓).
  But `FTE Saved Weekly` = `(current − baseline productivity) × team_authors × 5` is a different
  (gain × headcount) model that will not reconcile with the monthly one.
- **Monthly ROI inputs**: the website drops weeks that are low-confidence **or missing Copilot
  telemetry** before monthly aggregation; DAX `Monthly Productivity` only filters
  `low_confidence = 0`.
- **`Copilot Adoption %`** = `AVERAGE(copilot_pct)/100` — an unweighted average of weekly
  percentages; the website's headline is latest-week only. Fine for a trend visual, wrong if
  surfaced as "current adoption".
- **`Copilot_Adoption_Pct`** (the SUMMARIZE-based measure) counts
  `DISTINCTCOUNT(v_tickets[jira_ticket])` where its own comments say "users" — it measures ticket
  counts, not users. It appears abandoned; it should be deleted before someone binds a visual
  to it.
- **Rolling averages**: website requires ≥2 qualifying points in the 4-week window (except
  Size×Complexity Trends); the DAX rolling measures (`Productivity Rolling Avg`, `Velocity 4W
  Avg`, `Acceptance Rate Rolling Avg`) impose no minimum-point rule, so the earliest weeks can
  render single-point "averages".

### 4.9 Documentation nit

`docs/ecs-dashboard-analytics.md` describes weeks as "Saturday-ending" in several places, but the
pipeline and reference SQL both use Mon–Sun ISO weeks with **Sunday** `week_ending`
(`to_period('W-SUN')`). The doc should be corrected; the code is consistent.

---

## 5. Recommendations

1. **Rebuild the Fabric warehouse views from `pipeline/sql/copilot_dashboard_queries.sql`** (after
   updating that file's size/complexity cuts to 150/5 and fixing its Query 7 `LIMIT 1` author
   count). The file's header already states the contract: Power BI should bind to the views and
   never recompute aggregates in DAX/M — the pbix honors that for the base metrics, which is why
   those five KPI cards reconcile perfectly.
2. **Unify the assisted-ticket rule** (AuthorUUID + same ISO Mon–Sun week + suggestions > 0) and
   re-verify the QA churn delta before quoting it anywhere — today the two dashboards tell
   opposite quality stories (§4.3).
3. **Fix the three DAX label bugs** (§3): swap the operands in `Weekly Active Users Label_1`,
   point `Weekly Active Users Label` at a real team-size value, and retitle the 57.8% card
   "Copilot Impact on Productivity". Add a tiny `config` table (team_size = 31) to the warehouse
   so labels stop improvising denominators.
4. **Refresh all views in one pass** so `v_team_summary` and `v_weekly_team_metrics` come from the
   same cut (§4.4).
5. **Filter `v_copilot_intensity` to mature-period tickets with suggestions > 0** and dedupe
   author-week suggestion sums (§4.6); emit NULL, not 0.2/0.000001 placeholders, for empty groups
   (§4.7).
6. **Prune abandoned DAX** (`Copilot_Adoption_Pct`, the `FTE Saved Weekly` family, commented-out
   variants) so future maintainers don't bind visuals to dead logic.
