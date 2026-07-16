# Power BI (eCS_SDLC_AI_KPI_v2.pbix) vs Website Dashboard — Calculation Comparison (v2)

**Status:** Second pass, run after the July 2026 website dashboard rework (KPI card
restructure, size/complexity methodology change, output-volume + dev-adoption analytics,
ROI partial-month handling). The pbix analyzed is the same `eCS_SDLC_AI_KPI_v2.pbix`
(data through week ending **2026-07-05**); the website JSON was regenerated **2026-07-16**
with data through **2026-07-10**.

**How to read this:** every difference is tagged with where the fix belongs —
**[Warehouse]** = the Fabric `SDLC_Copilot_Warehouse` view definitions (feeds the pbix),
**[pbix]** = DAX measures / report visuals inside the Power BI file,
**[Website]** = this repo (pipeline, components, or docs),
**[Refresh]** = no logic change, just refresh/re-import.

---

## 1. Quick verdict

The website rework did **not** change the headline team numbers — same data, same
methodology, so the five KPIs that reconciled last time still reconcile
(737 tickets / +14.7% productivity / −5.4% QA churn / 71.7% adoption on the website vs the
pbix's one-refresh-older 687 / +11.7% / −8.1% / 66.7%). What the rework did do:

1. **Restructured the KPI row** — four of the pbix's seven cards no longer exist on the
   website, and a new "Copilot Impact on QA Churn" card was added that puts the biggest
   unresolved warehouse discrepancy (the QA sign flip) directly on screen.
2. **Replaced the size/complexity heatmap productivity formula** (pooled → mean-of-weekly)
   on top of the earlier bucket-cut change — the pbix heatmap is now wrong on two axes.
3. **Added analytics the warehouse can't feed yet** — weekly PR/line output volume and a
   Development-department adoption series.
4. **Tightened partial-period handling** (client-side `trimIncompleteWeeks`, ROI months
   flagged "(partial)" and excluded from peak-month) — the pbix ROI page doesn't do this.

Nothing in the rework resolved the warehouse-side divergences from the first report; all
of them remain open and one of them (QA churn sign flip) got more visible.

---

## 2. KPI card row — layout now diverges by design decision

Website `KpiCards.tsx` now renders **four** cards; the pbix still renders the old
seven-card layout.

| pbix card | Website equivalent now | Difference / fix |
|---|---|---|
| Team Productivity — big number **0.43**, "+11.7%" pill | "Team Productivity" — big number **+14.7%**, absolute "0.441 tickets/FTE-day" beneath | Same math; the website flipped which number is the headline (delta first). **[pbix]** presentation change if parity is wanted; **[Refresh]** for the value gap. |
| QA Churn — big number **22.4%**, "−8.1%" pill | "QA Churn" — big number **−5.4%**, absolute "23.1% churn rate" beneath | Same as above. **[pbix]** presentation + **[Refresh]**. |
| Total Output (687 / 27 devs / 21 wks) | **Removed from website** | Decide whether the pbix keeps it (it's harmless and reconciles). **[None / product decision]** |
| Copilot Adoption (current) 66.7% | **Removed from website** (adoption now lives only as the chart overlay) | If kept in pbix: the "53 of 28 developers" label is still a reversed-operand DAX bug (`Weekly Active Users Label_1`). **[pbix]** |
| Weekly Active Users 28 | **Removed from website** | If kept: "of 28 developers" label bug (`Weekly Active Users Label` uses last week's actives as the denominator). **[pbix]** |
| Copilot Acceptance Rate 78.6% | **Removed from website** | Value was formula-identical; card removal is a product decision. **[None / product decision]** |
| Second "Copilot Adoption (current)" **57.8%** | "Copilot Impact on Productivity" **+60.4%** | Title still a copy-paste error in the pbix **[pbix]**; the numeric gap is the warehouse classification issue (§4). **[Warehouse]** |
| — (no card) | **NEW: "Copilot Impact on QA Churn" +32.4%** (assisted 24.4% vs non-assisted 18.5%, flagged amber = worse) | The pbix has the columns (`v_copilot_assisted_summary.assisted_qa_churn / non_assisted_qa_churn / qa_churn_delta_pct`) but no card — and its values say the **opposite** (−7.1%, assisted better). Adding the card is **[pbix]**; making the number trustworthy is **[Warehouse]** (§4). |

---

## 3. Size × Complexity heatmap — now diverges on two axes **[Warehouse]**

The website changed the per-bucket productivity formula in `compute_size_complexity()`:

- **Old (still in pbix/warehouse and in the reference SQL):** pooled —
  `bucket_tickets / (full-period authors × full-period weeks × 5)`.
- **New (website):** **mean-of-weekly** — for each week where the bucket shipped ≥1
  ticket, `tickets / (bucket-active authors that week × 5)`, averaged over the period.
  Rationale (from the commit): the pooled denominator deflated baselines 2–4× vs the
  plotted weekly series, making every bucket read "way above baseline" even during the
  baseline period. QA churn cells stay pooled (unchanged).

Combined with the earlier bucket-cut change, the pbix heatmap now differs in **both cuts
and formula**:

| | pbix / warehouse | Website (current) |
|---|---|---|
| Size cuts | 0–300 / 301+ lines | **0–150 / 151+** |
| Complexity cuts | 1–10 / 11+ files | **1–5 / 6+** |
| Productivity per cell | pooled full-period | **mean-of-weekly, bucket-active authors** |
| Example: small/simple baseline | 0.128 | **0.317** |
| Example: small/simple post | 0.156 | **0.349** |

No cell in the pbix heatmap is comparable to the website anymore. **Fix: [Warehouse]** —
rebuild `v_size_complexity` with the 150/5 cuts and the mean-of-weekly formula (derive the
summary from the weekly per-bucket series, as the pipeline now does). The pbix DAX
(`Productivity vs Baseline %`, cell labels) reads view columns and needs no change once
the view is rebuilt. Note the repo's reference SQL
(`pipeline/sql/copilot_dashboard_queries.sql`, Query 4) still encodes the old cuts and the
pooled formula — update it first so the warehouse has a correct spec to build from.
**[Website]** (the SQL file lives here) then **[Warehouse]**.

---

## 4. Copilot-assisted correlation — still the biggest open issue **[Warehouse]**

Unchanged from the first report, but now more consequential because the website surfaces
the QA delta as a headline KPI card:

- **Classification:** warehouse 616 assisted / 71 non-assisted vs website 554 / 122
  through the same cutoff; week-by-week disagreements go in both directions, so it is not
  a data-vintage artifact. The website rule is: author UUID has `suggestions > 0` in the
  **same Mon–Sun ISO week** as the PR's end date.
- **QA churn sign flip:** warehouse −7.1% (assisted *better*) vs website +32.4% (assisted
  *worse*). The two dashboards still tell opposite quality stories, and the website now
  displays its version on an amber warning card. Do not quote either until unified.
- **Productivity levels:** warehouse summary 0.709/0.449 remains unreproducible from its
  own weekly view (~0.41/0.37) — the ~8 authors/week implied denominator matches the
  reference SQL's `LIMIT 1` first-author-only counting defect (Query 7).
- **Intensity buckets:** warehouse still includes all phases (1,056 tickets > 687 mature)
  with ~12× inflated average suggestions; website is mature-only, suggestions > 0.
- **NULL handling:** warehouse weekly view still emits `0.2` productivity / `0.000001`
  rates for empty groups instead of NULL.

**Fix: [Warehouse]** for all five, using the corrected reference SQL as the spec.

---

## 5. New website analytics with no warehouse/pbix counterpart

### 5.1 Output Volume — PRs & code vs tickets **[Warehouse]**, workaround **[pbix]**

The pipeline now emits `totalPRs` and `totalLines` per week (sums of per-ticket PR counts
and PR lines), and a new `OutputVolumeChart` shows PRs-merged vs tickets-closed with a
rolling **PRs-per-ticket** line and its pre-AI baseline, plus a lines/FTE-day mode. Its
purpose is reconciling ticket productivity with Bitbucket/Qlik PR counts (more, smaller
PRs per ticket).

- The warehouse `v_weekly_team_metrics` has no PR/line columns → **[Warehouse]**: add
  `total_prs`, `total_lines` to the view.
- Interim **[pbix]** workaround: the imported `v_tickets` already carries `pr_count` and
  `total_lines`, so `SUM(pr_count)` / `SUM(total_lines)` by `week_ending` reproduces the
  series in DAX today.

### 5.2 Development-department adoption series **[Warehouse]** then **[pbix]**

The pipeline now classifies each telemetry user by modal `Department` and emits
`devActiveUsers` / `devRollingActiveUsers` / `devCopilotPct` per week; the productivity
chart overlays the dev-only adoption line (rationale: non-engineering seat waves inflate
the rolling denominator — e.g. latest week all-users 71.7% vs dev-only 75.0%, and 79.2% vs
66.7% for the pbix's latest week). The warehouse has **no Department data at all** — no
column on `v_copilot_weekly_adoption`, no user dimension. **Fix: [Warehouse]** (land the
Department column from the telemetry export, add the three dev columns to the adoption
view), then **[pbix]** to overlay the line.

### 5.3 Removed website features (no pbix action)

The Projects/throughput page (`ProjectThroughputChart`) was deleted, and the adoption
bar chart + both heatmaps were dropped from the main dashboard page. The pbix never had
the projects view, so nothing to do; whether the pbix keeps its adoption/heatmap visuals
is a product choice, not a defect.

---

## 6. Partial-period handling — website tightened, pbix didn't **[pbix]**

- The website now applies `trimIncompleteWeeks()` at fetch time (drops any week ending
  past `dataCutoff` from every series) — this generalizes what the warehouse views already
  do server-side, so no warehouse gap here.
- **ROI page:** the month containing the data cutoff is labeled **"(partial)"** and is
  **excluded from the peak-month callout** (it still shows as the current run rate). The
  pbix's `Peak Capacity` / `Peak Month Label` / `Show ROI Month` measures include the
  partial month, so after a refresh early in a month the pbix can crown a 1-week month as
  peak or show a misleading run-rate. **Fix: [pbix]** — add an `is_partial` flag to
  `DimMonth` (or filter `Peak Capacity`'s month set to months whose last week ≤ cutoff)
  and suffix the label. The website also dropped `avgAdoptionPct` from its ROI month
  buckets; the pbix `Copilot Adoption %` measure (unweighted `AVERAGE(copilot_pct)`) no
  longer has a website counterpart on that page.

---

## 7. Ticket-count reconciliation — 1,931 (Atchu) vs 1,396 (website)

The two numbers count **different grains of work** from the same export
(`Pull Requests and AI 2026 07 14`, merges through Jul 15). The reconciliation is exact:

| Step | Count |
|---|---|
| Distinct Jira tickets with ≥1 merged PR, through Jul 10 (website's universe) | **1,395** |
| + tickets whose last PR merged Jul 11–14 | +27 → 1,422 |
| + extra (ticket × week) episodes — a ticket counted once per week it had a PR merge | +362 → 1,784 |
| + PRs with a **blank Jira key**, counted individually | +147 → **1,931** |

So Atchu's 1,931 is a **ticket-week episode count plus keyless PRs**: the query groups by
ticket *and* week, so the 229 tickets whose PRs span multiple weeks (up to 10 weeks for
one ticket) are counted once per week, and the 147 PRs with no Jira key each count as
their own item. The website counts each distinct ticket once — in the week of its **last**
PR merge — and drops keyless PRs (`aggregate_to_tickets()`; the loader's null-key rule).

Implications:

- **Neither number is "wrong"** — they answer different questions. "How many tickets did
  we complete?" → 1,396. "How many ticket-weeks of PR activity happened?" → 1,784 (+147
  unattributed PRs). For tickets/FTE-day productivity, the distinct-ticket count is the
  right numerator; episode counting would double-pay tickets that drag across weeks.
- **This is not the driver of the §4 correlation divergences** — those compare the
  warehouse vs the website on the same distinct-ticket grain. Atchu's count is a third
  system with a different grain.
- **The 147 keyless PRs (~6% of all PRs) deserve a decision**: they are real merged work
  invisible to every ticket-based metric on both dashboards. Either enforce Jira keys at
  PR creation or surface them as an "unattributed PRs" line on the Output Volume chart.
  **[Website]** + upstream process.
- The multi-week spread is also why PR counts outrun ticket counts (2,377 PRs → 1,423
  tickets) — exactly what the new Output Volume chart's PRs-per-ticket line tracks.

---

## 8. Unchanged housekeeping items

| Item | Fix |
|---|---|
| pbix data is one refresh behind (week of Jul 5 vs Jul 12) | **[Refresh]** |
| `v_team_summary` vs `v_weekly_team_metrics` snapshotted at different times inside the pbix (687/21wk vs 718/22wk) | **[Warehouse]** — refresh all views in one pass |
| Abandoned DAX (`Copilot_Adoption_Pct` counts tickets as "users"; `FTE Saved Weekly` family uses a different ROI formula than `Monthly Capacity Released`) | **[pbix]** — delete or align |
| DAX rolling averages impose no ≥2-point minimum (website requires ≥2 everywhere except size/complexity trends) | **[pbix]** |
| Docs still say "Saturday-ending" weeks in two Key-Definitions rows (Copilot-assisted, Partial week); code is Mon–Sun ISO / Sunday-ending throughout | **[Website]** — docs fix |
| Baseline 0.384 (warehouse) vs 0.3844 (website) | Rounding; ignore |

---

## 9. Recommended order of work

1. **[Website]** Update `pipeline/sql/copilot_dashboard_queries.sql` to match the current
   pipeline: 150/5 bucket cuts, mean-of-weekly per-bucket heatmap productivity, fixed
   Query 7 author counting, mature-only intensity, NULL (not placeholder) empty groups,
   `total_prs`/`total_lines` on the weekly view, dev-department adoption columns. This
   file is the contract the warehouse should be rebuilt from.
2. **[Warehouse]** Rebuild the Fabric views from that spec in a single refresh, and align
   the assisted-ticket classification rule — then re-check whether the QA churn delta is
   +32% or −7%; that answer changes the Copilot quality narrative.
3. **[pbix]** Retitle the 57.8% card, fix/retire the two developer-count labels, add the
   "Copilot Impact on QA Churn" card, add the output-volume visual (from `v_tickets` until
   the view lands), add partial-month exclusion to the ROI peak measures, delete abandoned
   measures, then refresh.
