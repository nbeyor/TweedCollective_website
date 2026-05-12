# ECS SDLC Copilot Dashboard — Build Specification

This document specifies every analytic in the dashboard with enough detail to rebuild it from scratch using SQL and Power BI (or any equivalent stack). For each metric it lists: the source fields, the exact step-by-step calculation, and how the visual decomposes into Power BI visuals.

The reference implementation lives in:
- **Pipeline:** `pipeline/refresh_copilot.py` (Python, pandas)
- **SQL port:** `pipeline/sql/copilot_dashboard_queries.sql` (PostgreSQL — already mirrors the Python and is the recommended starting point)
- **Front end:** `components/copilot-dashboard/`

---

## 1. Source Data

Two source datasets feed the entire dashboard. Both arrive as Excel sheets today; load them into your warehouse as the two tables below.

### 1.1 `pr_jira_metrics` — one row per pull request

Source sheet: `Pull Requests` or `Pull MM_DD_YY` in the export workbook.

| Column | Type | Description |
|---|---|---|
| `jira_ticket` | TEXT | Jira ticket key the PR is linked to (e.g. `MYAPP-123`). The grouping key for all ticket-level aggregations. |
| `title` | TEXT | Ticket title. Display only. |
| `author_uuid` | UUID/TEXT | Stable developer identifier. Used to count unique authors and to join to Copilot telemetry. |
| `first_activity` | DATE | First activity on the PR. Optional. If missing, aliased to `first_ready_for_qa_date`. |
| `first_ready_for_qa_date` | DATE | When the PR first hit "Ready for QA." Optional. |
| `pr_start` | DATE | PR open date. |
| `pr_end` | DATE | PR close/merge date. **All time bucketing keys off this column.** |
| `pr_files` | INT | Files touched by this PR. Drives the complexity bucket. |
| `pr_lines` | INT | Lines changed in this PR. Drives the size bucket. |
| `pr_ai` | INT | Legacy AI flag (unused in current calculations). |
| `churn_lines` | INT | Lines later rewritten (any churn). Not currently surfaced. |
| `qa_churn_lines` | INT | Lines rewritten after QA started. Drives QA churn rate. |

### 1.2 `copilot_telemetry` — one row per user per day

Source sheet: `AI All MM_DD_YY` (new format, has `AuthorUUID` and supports PR correlation) or `Copilot_All` (legacy, GitHub user IDs only).

Normalize to these canonical columns:

| Column | Type | Description |
|---|---|---|
| `event_day` | DATE | The activity date. |
| `user_id` | TEXT | `AuthorUUID` in the new format, `GithubUserId` in the legacy format. Must equal `pr_jira_metrics.author_uuid` for correlation to work. |
| `suggestions` | INT | Code generation suggestions shown that day (`suggestionCount` / `CodeGenerationActivityCount`). |
| `acceptances` | INT | Suggestions accepted (`acceptedSuggestionCount` / `CodeAcceptanceActivityCount`). |
| `loc_added` | INT | Lines added (`LineCountAdded` / `LocAddedSum`). |
| `used_agent` | BOOL | Whether agent mode was used that day. New format only. |
| `used_chat` | BOOL | Whether chat was used that day. New format only. |

Fill all numeric NULLs with 0 on load.

---

## 2. Common Derivations (build these once and reuse)

Every metric below is built on top of these shared transformations. Build them as views/queries in SQL and as a star-schema model in Power BI (`Tickets` fact table + `WeeklyTeam` fact table + `WeeklyCopilot` fact table + a shared `DateDim` keyed on Saturday-ending week).

### 2.1 Saturday-ending week (`week_ending`)

PR data and Copilot telemetry are aligned to the same week-ending Saturday.

- **Python:** `dt.to_period('W-SAT').dt.end_time.dt.normalize()`
- **PostgreSQL:** `(date_trunc('week', d::date + 2) + INTERVAL '5 days')::date`
- **Power BI (DAX):** `Week Ending = 'Date'[Date] + (7 - WEEKDAY('Date'[Date], 1)) MOD 7` adjusted so Saturday is the end of week. Easiest: add a calculated column on `DateDim` using the same arithmetic.

Apply to `pr_end` for PRs and to `event_day` for Copilot telemetry.

### 2.2 Ticket aggregation (`v_tickets`) — PR → ticket

Group `pr_jira_metrics` by `jira_ticket`:

| Output column | Calculation |
|---|---|
| `pr_count` | `COUNT(*)` |
| `pr_end_date` | `MAX(pr_end)` — the ticket "completes" when its last PR closes. |
| `week_ending` | Saturday-ending week of `pr_end_date`. |
| `max_files` | `MAX(pr_files)` — biggest single PR for the ticket. |
| `total_lines` | `SUM(pr_lines)` across all PRs. |
| `total_qa_churn_lines` | `SUM(qa_churn_lines)`. |
| `author_uuids` | Distinct `author_uuid` values concatenated (a ticket can have multiple co-authors). |
| `has_qa_churn` | `total_qa_churn_lines > 0` (bool). |
| `size_bucket` | `total_lines <= 300` → `'0-300'`, else `'301+'`. |
| `complexity_bucket` | `max_files <= 10` → `'1-10'`, else `'11+'`. |
| `project` | First token of `jira_ticket` before the `-`, uppercased (e.g. `MYAPP-123` → `MYAPP`). Used by the Projects page. |

### 2.3 Three-phase model

| Phase | Window (on `pr_end_date` or `week_ending`) | Role |
|---|---|---|
| **Baseline** | `< 2025-10-01` | Pre-AI control. Compared *against*. |
| **Transition** | `2025-10-01` to `2026-02-06` | Uneven rollout. Shown on charts, excluded from KPI deltas. |
| **Mature** | `>= 2026-02-07` | 80%+ adoption. Compared *to* baseline. |

Constants (all in code as `BASELINE_END`, `MATURE_START`, `WORKDAYS_PER_WEEK`, `ROLLING_WINDOW`, `MIN_TICKETS_THRESHOLD`):
- `WORKDAYS_PER_WEEK = 5`
- `ROLLING_WINDOW = 4` weeks
- `MIN_TICKETS_THRESHOLD = 5` tickets/week to count as "confident"

### 2.4 Confidence flag

A week is **confident** when `total_tickets_that_week >= 5`. Low-confidence weeks are:
- Shown on charts as small dimmed dots.
- Excluded from rolling averages.
- Excluded from KPI period averages.
- Still counted in raw cumulative totals.

### 2.5 4-week rolling average

For any weekly series, the rolling average at week *w* is:
- Take the 4 most recent **confident** weeks where `week_ending <= w` (slide a 4-row window over the confident-weeks-only series).
- Average the metric values.
- Emit `NULL` unless the window contains at least **2 data points**. (Exception: `SizeComplexityTrends` allows 1 — see §8.3.)

In SQL this is a `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW` window over a CTE that filters `low_confidence = false`. In Power BI, use a measure with `CALCULATE` over a date window restricted to confident weeks.

### 2.6 FTE-day denominator

Productivity is always tickets per FTE-day. The denominator depends on the scope:

- **Per-week:** `unique_authors_that_week × 5`
- **Per-period (mean-of-weekly):** compute per-week productivity, then average across confident weeks in the period.
- **Per-period (pooled, used in heatmaps only):** `unique_authors_in_period × distinct_weeks_in_period × 5`

The `unique_authors` in any cell with zero tickets uses `max(authors, 1)` to avoid divide-by-zero.

### 2.7 Mean-of-weekly vs pooled — which to use

Two different patterns are used intentionally:

- **Productivity** comparisons (KPI, assisted vs not, weekly chart) use **mean-of-weekly**. Weekly productivity is noisy; averaging weeks dampens outlier weeks.
- **QA churn** comparisons (KPI, assisted vs not, heatmap cells) use the **pooled rate** = `tickets_with_churn / total_tickets` over the entire period. Pooling avoids over-weighting low-volume weeks.
- **Heatmap productivity** uses **pooled** (`tickets / authors / weeks / 5`) because the per-cell weekly series is too sparse for mean-of-weekly to be meaningful.

If you change which pattern a metric uses, you'll get different numbers — flag this for any future tweaks.

### 2.8 Adoption denominator

Two different "team size" denominators are used and they are not the same number:

- **Copilot adoption %** uses `total distinct user_id in copilot_telemetry` as the denominator (i.e., users who have ever appeared in telemetry, which is the licensed pool).
- **Weekly Active Users** card uses the same denominator for the "of X developers" line.
- The team-level productivity calc uses `unique authors that wrote PRs that week` instead — a different population.

Document this clearly in any tooltip; reviewers will ask why the two "team size" numbers don't match.

---

## 3. KPI Cards

Six to seven cards across the top of the main dashboard. Each card has `value`, `delta`, and `context`. Render in Power BI as Card visuals; the delta belongs on a smaller secondary line or chip.

### 3.1 Team Productivity (vs pre-AI)

| Field | Detail |
|---|---|
| **Value displayed** | `summary.team_productivity` (3 decimal places) |
| **Delta displayed** | `((mature - baseline) / baseline) × 100` (signed, 1 decimal) |
| **Context displayed** | `"tickets / FTE-day (pre-AI: <baseline.productivity>)"` |

**Calculation (matches SQL Query 3 / `compute_team_summary`):**
1. Build weekly team productivity over **all** weeks: per week, `tickets_that_week / (unique_authors_that_week × 5)`.
2. Filter to confident weeks only (`tickets_that_week >= 5`).
3. **Baseline value** = `AVG(weekly_productivity)` for weeks where `week_ending < 2025-10-01`.
4. **Mature value** = `AVG(weekly_productivity)` for weeks where `week_ending >= 2026-02-07`.
5. **Delta** = `(mature - baseline) / baseline × 100`.

### 3.2 QA Churn (vs pre-AI)

| Field | Detail |
|---|---|
| **Value** | `summary.team_qa_churn × 100` (1 decimal, as a percent) |
| **Delta** | `((mature_rate - baseline_rate) / baseline_rate) × 100` (signed) |
| **Color** | Green if `mature <= baseline`, amber otherwise |

**Calculation (pooled, not mean-of-weekly):**
1. `mature_rate` = `COUNT(tickets WHERE has_qa_churn AND pr_end_date >= mature_start) / COUNT(tickets WHERE pr_end_date >= mature_start)`.
2. `baseline_rate` = same calculation, with `pr_end_date < baseline_end`.
3. Negative delta = quality improved.

### 3.3 Total Output (mature period)

| Field | Detail |
|---|---|
| **Value** | `COUNT(tickets WHERE pr_end_date >= mature_start)` |
| **Delta** | `team_authors` count (distinct authors in mature period) |
| **Context** | `weeks_of_data` = count of confident mature weeks |

No comparison, just a raw scale anchor.

### 3.4 Copilot Adoption (current)

| Field | Detail |
|---|---|
| **Value** | `copilotPct` for the most recent week in `copilot_telemetry` |
| **Delta** | `adoptionTrend` string: `"<first_month_unique_users> → <last_month_unique_users> monthly users"` |
| **Context** | `"<totalCopilotUsers> of <teamSize> developers"` |

**Calculation:**
1. For each week, compute `active_users / total_users_ever_in_telemetry × 100`.
2. The KPI shows the value for `MAX(week_ending)`.
3. The trend label compares the **first and last calendar month** unique user counts, not weekly.

### 3.5 Weekly Active Users

| Field | Detail |
|---|---|
| **Value** | Distinct `user_id` in `copilot_telemetry` for the most recent Saturday-ending week |
| **Delta** | `"of <teamSize> developers"` |
| **Context** | `"<heavy> heavy / <medium> medium / <light> light"` |

**Tier calculation (uses entire telemetry history, not just the current week):**
- For each `user_id`, compute `days_active = COUNT(DISTINCT event_day)`.
- Tier:
  - `days_active >= 30` → Heavy
  - `days_active >= 10 AND days_active < 30` → Medium
  - `days_active < 10` → Light
- Card shows the count of users in each tier (lifetime classification, not current-week).

### 3.6 Copilot Acceptance Rate

| Field | Detail |
|---|---|
| **Value** | `SUM(acceptances) / SUM(suggestions) × 100` for the most recent week (1 decimal) |
| **Delta** | `SUM(suggestions)` for that week, formatted with thousands separator |
| **Context** | `"overall weekly acceptance rate"` |

### 3.7 Copilot Impact on Productivity

| Field | Detail |
|---|---|
| **Value** | `productivityLift` = `((assisted_prod − non_assisted_prod) / non_assisted_prod) × 100` (signed) |
| **Delta** | `"<assistedTickets> assisted / <nonAssistedTickets> non-assisted"` |
| **Context** | `"<assisted_prod> vs <non_assisted_prod> tix/FTE-day"` |

**Calculation (matches SQL Query 7b):**
1. For each PR, compute the Saturday-ending week of `pr_end`.
2. Left join `pr_jira_metrics` to a per-user-per-week roll-up of `copilot_telemetry` on `(author_uuid = user_id, week_ending)`. The PR is `copilot_assisted` if `SUM(suggestions) > 0` in that join.
3. Aggregate PRs to tickets; a ticket is `copilot_assisted` if **any** of its PRs were assisted.
4. Filter to mature-period tickets (`pr_end_date >= mature_start`).
5. For each (week, assisted/not) group, compute `tickets / (unique_authors × 5)`.
6. Take the mean of those per-week productivity values within each group.
7. Lift = `((assisted_mean − non_assisted_mean) / non_assisted_mean) × 100`.

---

## 4. Time-Series Charts (Power BI decomposition)

A single chart in the React UI is one Chart.js canvas with multiple series overlaid. In Power BI, **build each series as its own visual** and stack them either as a combo chart (when the chart type allows) or as overlapping/aligned visuals on the same X axis.

### 4.1 Productivity Chart → 3 Power BI visuals

The React version puts all three on one canvas. In Power BI, you'll want:

#### Visual A — Weekly raw productivity (scatter)

- **X axis:** `week_ending`
- **Y axis (left):** `team_productivity` (raw, not rolling)
- **Mark type:** Scatter / dot plot. Use color and size to encode confidence + phase:
  - **Phase color:** baseline = grey, transition = amber, mature = green.
  - **Confidence:** confident weeks = full-size filled dot; low-confidence weeks = small dimmed dot.
  - **Shape:** transition weeks render as a diamond in the React version (skip this if Power BI doesn't support it — the color is sufficient).
- **Data source:** Per-week, `total_tickets / (unique_authors × 5)`. See SQL Query 1.

#### Visual B — Rolling-average line (line)

- **Same X axis as Visual A**, overlaid as a combo line.
- **Y axis (left, same scale as A):** 4-week rolling average of `team_productivity`, computed only over confident weeks (≥2 points required, else NULL).
- **Style:** solid line, no markers. Color = green (mature accent).
- **Annotation:** horizontal dashed line at `baseline.productivity`.
- **Phase markers:** vertical dashed lines at `2025-10-01` ("AI Rollout") and `2026-02-07` ("80%+ Adoption"). Shade `2025-10-01` to `2026-02-07` light grey as the transition zone.

#### Visual C — Copilot adoption overlay (area, secondary axis)

- **Same X axis.**
- **Y axis (right):** `copilotPct` (filled area chart, blue, semi-transparent).
- **Data source:** `copilot_telemetry` aggregated weekly. Match on `week_ending` to the PR weekly series.

In Power BI, Visuals A+B+C can be a single combo chart with a secondary Y-axis if you turn off the line markers on the rolling line.

### 4.2 QA Churn vs Copilot Acceptance Rate → 2 visuals

#### Visual A — QA churn rolling

- **X axis:** `week_ending`
- **Y axis (left, %):**
  - Raw dots: weekly `teamQARate × 100` with confidence/phase styling identical to §4.1A.
  - Overlaid line: 4-week rolling avg over confident weeks (NULL QA rates excluded).
- **Annotation:** horizontal dashed line at `baseline.qa_churn_rate × 100`. Same phase markers as §4.1.

#### Visual B — Copilot acceptance rolling (secondary axis)

- **X axis:** same week_ending.
- **Y axis (right, %):** 4-week rolling avg of `acceptances / suggestions × 100` from `copilot_telemetry`, aligned to the main timeline by matching the week_ending key. (If Copilot has a week with no matching PR week, that row is simply absent — don't synthesize.)

### 4.3 Cumulative Output & Velocity → 2 visuals

#### Visual A — Cumulative area

- **X axis:** `week_ending` across the **entire** timeline (all three phases).
- **Y axis (left):** running sum of `total_tickets` ordered by `week_ending`. Use a filled area.
- This visual ignores the confidence filter — it's a raw cumulative.

#### Visual B — Rolling velocity (dashed line, secondary axis)

- **Same X axis.**
- **Y axis (right):** 4-week rolling **average** of `total_tickets` over confident weeks only (`AVG(total_tickets)` over the 4-row window). ≥2 confident points required.
- **Style:** dashed line.

Phase markers and transition shading same as §4.1.

### 4.4 Copilot Adoption Over Time → 2 visuals

This chart is built from `copilot_telemetry` only.

#### Visual A — Weekly active users (bars)

- **X axis:** `week_ending` (Saturday-ending bucketing same as PR data).
- **Y axis (left):** `COUNT(DISTINCT user_id)` per week.
- No rolling, no confidence filter — raw weekly counts.

#### Visual B — Weekly code generation (line, secondary axis)

- **Same X axis.**
- **Y axis (right):** `SUM(suggestions)` per week.

---

## 5. Comparison Analytics

### 5.1 Copilot-Assisted vs Non-Assisted — Grouped bars + intensity table

#### Bars visual

- Two bar groups side-by-side:
  - **Productivity:** `assistedProductivity` vs `nonAssistedProductivity` (mean-of-weekly per group, see §3.7).
  - **QA Churn Rate:** `assistedQAChurn` vs `nonAssistedQAChurn` (pooled rate per group: `tickets_with_churn / tickets` within each group, full mature period).
- Filter: mature period only.

#### Intensity sub-table

Mature-period tickets are further bucketed by **total Copilot suggestions on the ticket** (`SUM(copilot_suggestions)` across all PRs):

| Bucket | Range |
|---|---|
| Low | 1 – 10 suggestions |
| Medium | 11 – 50 suggestions |
| High | 51+ suggestions |

(Tickets with 0 suggestions are "none" and live in the non-assisted group — they don't appear in the intensity table.)

For each bucket, compute:
- `tickets` = COUNT
- `productivity` = `tickets / (unique_authors_in_bucket × distinct_weeks_in_bucket × 5)` — **pooled**, not mean-of-weekly. (This is one of the few productivity values that uses pooled — keep it consistent if regenerating.)
- `qaChurn` = `tickets_with_qa_churn / tickets`
- `avgSuggestions` = `AVG(total_suggestions)`

Display as a small table or as a stacked bar with the three intensity slices. See SQL Query 8.

---

## 6. Heatmaps (2×2 grids)

### 6.1 Productivity heatmap

- **Rows:** Size bucket (`0-300`, `301+`).
- **Cols:** Complexity bucket (`1-10`, `11+`).
- **Cell:** `(post_productivity − baseline_productivity) / baseline_productivity` (signed fraction, displayed as a percent).
- **Per-cell productivity (pooled):**
  - `post_productivity` = `tickets_in_(bucket × mature_period) / (unique_authors_full_mature × distinct_weeks_full_mature × 5)`
  - `baseline_productivity` = same, with full-baseline-period authors/weeks.
  - **Important:** the FTE-day denominator uses the **full-period** author and week counts, not per-cell. This means the four cells use the same denominator within a period — only the numerator (tickets) varies by cell.
- **Color:** divergent scale centered at 0. Green = improvement, red = regression. Bin breakpoints (in the React version) at ±20%, ±50%, ±100%.

In Power BI: matrix visual with a measure for the percentage delta and conditional formatting on the cell color.

### 6.2 QA churn heatmap

- Same row/column structure.
- **Cell:** `(post_qa_churn − baseline_qa_churn) / baseline_qa_churn`.
- **Per-cell QA churn:** `tickets_with_qa_churn / tickets_in_(bucket × period)` — fully self-contained per cell.
- **Color:** **inverted** from §6.1. Green = churn decreased (quality improved), red = churn increased.

See SQL Query 4.

---

## 7. Sub-Pages

Three drill-down pages link from the main dashboard. They share `v_tickets`, the phase model, and the week alignment.

### 7.1 ROI Analysis — Capacity & Dollar Value

Goal: translate measured productivity uplift into FTE-equivalent capacity and dollars.

**Aggregation unit:** month (`YYYY-MM`).

**Inputs per month** (built from the weekly chart series):
- Drop weeks where `low_confidence = true`.
- Drop weeks where `copilotActiveUsers IS NULL` or `copilotPct IS NULL`.
- Group remaining rows by `LEFT(week_ending, 7)`. For each month:
  - `avgProductivity` = `AVG(teamProductivity)`
  - `avgCopilotUsers` = `AVG(copilotActiveUsers)`
  - `avgAdoptionPct` = `AVG(copilotPct)`

**Per-month outputs:**

| Field | Calculation |
|---|---|
| `upliftPct` | `MAX(0, (avgProductivity − baseline.productivity) / baseline.productivity)` — **floored at zero**. Months below baseline contribute 0. |
| `fteEquivalent` | `avgCopilotUsers × upliftPct` |
| `dollarValue` | `fteEquivalent × (FULLY_LOADED_ANNUAL / 12)` |
| `cumulativeDollar` | Running sum of `dollarValue` ordered chronologically |

**Hard-coded constant:** `FULLY_LOADED_ANNUAL = $150,000`. Lives in `RoiCapacityChart.tsx:37` only. Surface it in the UI or make it configurable if reviewers will ask.

**Visuals:**
- **Bar (left axis):** monthly `fteEquivalent`.
- **Line (right axis):** `cumulativeDollar`.

### 7.2 Project Throughput

A "project" is the Jira project key prefix (`MYAPP-123` → `MYAPP`, uppercased).

**Period summaries** (one block per period — baseline and mature):

| Field | Calculation |
|---|---|
| `unique_projects` | `COUNT(DISTINCT project)` over tickets in the period |
| `total_tickets` | `COUNT(tickets)` |
| `tickets_per_project` | For each week in the period, compute `tickets_that_week / DISTINCT(projects_that_week)`; then average across weeks. (Time-normalized so periods of different length compare fairly.) |
| `avg_projects_per_week` | `AVG(DISTINCT(projects_that_week))` across weeks in the period — a "breadth" measure. |

**Period deltas:** `mature - baseline` formatted as a signed percent string. Returns `N/A` if `baseline == 0`.

**Weekly series** (for the line chart):
| Field | Calculation |
|---|---|
| `activeProjects` | `COUNT(DISTINCT project)` in that week |
| `totalTickets` | `COUNT(tickets)` in that week |
| `ticketsPerProject` | `totalTickets / activeProjects` for that week |
| `phase` | baseline / transition / mature tag |

**Rolling velocity line:** 4-week rolling mean of `ticketsPerProject` (client-side derivation; same window logic as the main rolling rule, ≥2 points required).

**Top-10 table:** per project, ranked by `matureTickets DESC` (tiebreaker `baselineTickets DESC`):

| Field | Calculation |
|---|---|
| `baselineTickets` / `matureTickets` | COUNT(tickets) in the project, in each period |
| `baselineWeeksActive` / `matureWeeksActive` | `COUNT(DISTINCT week_ending)` for the project in each period |
| `baselineVelocity` / `matureVelocity` | `tickets / weeksActive` per period — tickets per **active week**, not per calendar week |
| `velocityDelta` | Signed percent string; `N/A` when baseline velocity is zero |

### 7.3 Size × Complexity Trends (time series per bucket)

Per (week × size × complexity) cell — emits a row for every combination including zero-ticket cells so the front-end has a continuous series:

| Field | Calculation |
|---|---|
| `tickets` | `COUNT(tickets)` in (week × size × complexity) |
| `authors` | `COUNT(DISTINCT author_uuid)` in that cell |
| `productivity` | `tickets / (MAX(authors, 1) × 5)` |
| `qaChurn` | `AVG(has_qa_churn)` in that cell, or `NULL` if `tickets = 0` |
| `lowConfidence` | `tickets < 5` |
| `phase` | baseline / transition / mature |

**Rendering:** small-multiples — one line chart per bucket. User toggles between metric (productivity / QA / both) and smoothing (raw / 4-week rolling).

**Nuance — different rolling rule:** this chart's rolling mean accepts windows with only **1** data point (other charts require ≥2). The reasoning: per-bucket series are sparse and a ≥2 rule leaves too many gaps. Reader takeaway: early trend points on this page can be a single-observation average; don't read short runs as stable.

---

## 8. Key Definitions

| Term | Definition |
|---|---|
| **Ticket** | A Jira ticket. One or more PRs aggregated to ticket level via `jira_ticket` grouping. |
| **Week ending** | Saturday-ending ISO week. Applies to PRs (`pr_end`) and Copilot (`event_day`). |
| **Confident week** | A week with ≥5 total tickets. Low-confidence weeks are excluded from rolling averages and KPI period averages. |
| **Rolling average** | 4-week sliding window over confident weeks only. Requires ≥2 data points (exception: Size × Complexity Trends → ≥1). |
| **QA churn** | A ticket where `SUM(qa_churn_lines) > 0` across its PRs. |
| **Size bucket** | `SUM(pr_lines)` per ticket → `0–300` or `301+`. |
| **Complexity bucket** | `MAX(pr_files)` per ticket → `1–10` or `11+`. |
| **User tier** | Lifetime Copilot active days: Heavy (≥30), Medium (10–29), Light (<10). Lifetime, not per-period. |
| **Copilot-assisted ticket** | A ticket whose PR author has Copilot telemetry activity (suggestions > 0) in the same Saturday-ending week as the PR's `pr_end`. Ticket is assisted if **any** of its PRs are assisted. |
| **FTE-day** | One developer working one day. Productivity denominator: `unique_authors × 5` (per week) or `unique_authors × distinct_weeks × 5` (pooled). |
| **Project** | First token of `jira_ticket` before the `-`, uppercased. |
| **Mean-of-weekly** | Compute per-week metric, then average over weeks in the period. Used for productivity comparisons. |
| **Pooled rate** | `events / observations` across the whole period in one shot. Used for QA churn comparisons and heatmap cell productivity. |

---

## 9. Implementation Notes & Gotchas

A few things a reviewer will ask about — call them out in the Power BI report's methodology page:

1. **Two different "team size" denominators.** Copilot adoption uses the licensed Copilot user pool (`COUNT(DISTINCT user_id) FROM copilot_telemetry`). Productivity uses PR authors per week. The two are different populations and the numbers will not match.

2. **ROI zero-floor.** The ROI page clamps monthly uplift at 0. Months below baseline contribute $0, not negative dollars. This understates variability but avoids "negative ROI" artifacts.

3. **`$150,000/year` is hard-coded.** This drives every dollar figure on the ROI page linearly. Surface it or make it a parameter.

4. **Pooled vs mean-of-weekly.** Productivity uses mean-of-weekly almost everywhere — except in the size/complexity heatmap cells and the intensity sub-table, which use pooled. This is intentional (sparse per-cell weekly series), but means a savvy reader will spot that the heatmap "post period productivity" doesn't equal the KPI's `team_productivity`.

5. **Acceptance rate alignment.** The QA chart's right-axis acceptance rate is built from `copilot_telemetry` then joined to the main PR timeline on `week_ending`. If Copilot has data for a week with no completed PRs, the acceptance value won't show on the chart. This is normally fine; flag it if you see a missing acceptance week.

6. **"Current" / "this week."** KPI cards labeled "current" read `MAX(week_ending)` from Copilot telemetry. The dashboard front-end additionally filters out weeks ending after the configured `dataRange.end` so a partial final week doesn't show.

7. **Adoption delta line.** The Copilot Adoption KPI's arrow compares **first-month vs last-month unique users** (monthly granularity), not week-over-week. That's why it can disagree visually with the weekly adoption bar chart.

8. **Tiers are lifetime.** Heavy/Medium/Light are computed over the entire telemetry history, not the current period. A user can be in the "Heavy" tier even if they've stopped using Copilot, as long as they had ≥30 active days at any point.

9. **PR → ticket aggregation hides co-authorship counts.** A ticket worked on by 3 authors counts as 1 ticket in the numerator, but contributes 3 to that week's `unique_authors`. This makes productivity slightly conservative on co-authored tickets — intentional, and consistent across periods.

10. **Pipeline pre-computation.** Most metrics are precomputed by `pipeline/refresh_copilot.py` and written to `public/data/copilot-dashboard-data.json`. Only rolling averages, ROI monthly aggregation, and chart styling happen client-side. In Power BI you can either rebuild the precomputation in SQL (recommended — `pipeline/sql/copilot_dashboard_queries.sql` is a direct port) or import the JSON directly.

---

## 10. Reference SQL

A working PostgreSQL implementation of every metric above is in **`pipeline/sql/copilot_dashboard_queries.sql`**. The numbered queries map to:

| Query | Covers |
|---|---|
| `v_tickets` view | §2.2 ticket aggregation |
| Query 1 | §4.1 productivity chart (raw + rolling) and §3.1 KPI feed |
| Query 2 | §3.1, §3.2 baseline values |
| Query 3 | §3.1, §3.2, §3.3 mature-period summary with deltas |
| Query 4 | §6.1, §6.2 heatmaps |
| Query 5 | §3.4, §3.5, §3.6, §4.4 Copilot adoption weekly |
| Query 6 | §3.5 user tiers + adoption trend |
| Query 7 / 7b | §3.7, §5.1 assisted vs non-assisted |
| Query 8 | §5.1 intensity buckets |

Start from there, then build the Power BI semantic model on top — one fact table per query output, joined to a shared Date dimension keyed on Saturday-ending week.
