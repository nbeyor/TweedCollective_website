# ECS SDLC Dashboard — Analytics Reference

This document describes each analytic in the ECS SDLC Copilot Dashboard, including its purpose and underlying computation logic.

## Three-Phase Model (Core Framework)

All analytics are organized around a three-phase timeline:

- **Phase 1 — Pre-AI Baseline** (before Oct 1, 2025): No AI tools in use. Serves as the control period for before/after comparisons.
- **Phase 2 — Transition** (Oct 1, 2025 – Feb 6, 2026): AI rollout with uneven 26–74% weekly adoption. Shown on charts but excluded from KPI comparisons.
- **Phase 3 — Mature Adoption** (Feb 7, 2026+): 80%+ weekly Copilot adoption. Compared against the pre-AI baseline.

---

## KPI Cards (Summary Metrics)

### Team Productivity (vs pre-AI)

- **Purpose:** Measure whether AI adoption has improved team throughput, normalized for team size and work time.
- **Logic:** Mean-of-weekly productivity during the mature period compared to the same metric from the baseline period. Weekly productivity = `tickets_completed / (unique_authors_that_week × 5 workdays)`. Only "confident" weeks (≥5 tickets) contribute to the mean. The KPI shows the percentage delta: `((mature_productivity − baseline_productivity) / baseline_productivity) × 100`.

### QA Churn (vs pre-AI)

- **Purpose:** Track whether AI-assisted code requires more or less QA rework compared to the pre-AI baseline.
- **Logic:** `tickets_with_qa_churn_lines > 0 / total_tickets`, computed as an overall rate across the entire period (not mean-of-weekly). The delta is `((mature_qa_churn − baseline_qa_churn) / baseline_qa_churn) × 100`. A negative delta indicates quality improvement. Color-coded amber if churn is worse than baseline.

### Total Output (mature period)

- **Purpose:** Provide raw volume context — how many tickets were completed, by how many developers, over how many high-confidence weeks.
- **Logic:** Simple aggregate count of tickets where `pr_end_date >= mature_start`. No normalization or formula applied.

### Copilot Adoption (current)

- **Purpose:** Show the current week's Copilot penetration within the team.
- **Logic:** `weekly_active_copilot_users / rolling_4_week_active_users × 100` for the most recent week in GitHub Copilot telemetry. The denominator is the count of distinct users with any Copilot activity in the trailing 4 weeks (including the current week) — not lifetime users, so churned/inactive seats drop out of the denominator and don't suppress the apparent rate. The delta line shows the monthly adoption trend (first month unique users → last month unique users).

### Weekly Active Users

- **Purpose:** Show the headcount of developers actively using Copilot in the most recent week, broken down by usage intensity.
- **Logic:** Count of distinct `github_user_id` values in Copilot telemetry for the most recent Saturday-ending week. User tiers are computed on cumulative lifetime days: Heavy = 30+ active days, Medium = 10–29 days, Light = <10 days.

### Copilot Acceptance Rate

- **Purpose:** Measure how useful developers find AI suggestions — what proportion they actually keep.
- **Logic:** `code_acceptance_activity_count / code_generation_activity_count × 100` for the most recent week. Context shows the total suggestion volume.

### Copilot Impact on Productivity

- **Purpose:** Directly compare productivity between tickets where the author was actively using Copilot vs tickets where they were not.
- **Logic:** A ticket is classified as "Copilot-assisted" if its PR author (`author_uuid`) appears in Copilot telemetry during the same Saturday-ending week as the PR completion date. Productivity is computed per group: `tickets / (unique_authors × distinct_weeks × 5)`. The KPI shows the percentage lift: `((assisted_prod − non_assisted_prod) / non_assisted_prod) × 100`.

---

## Time Series Charts

### Team Productivity vs Pre-AI Baseline

- **Purpose:** Visualize weekly team productivity across three phases with a Copilot adoption overlay.
- **Primary axis (left):** Tickets/FTE-day. Shows both weekly raw data points and a 4-week rolling average line. The rolling average is computed only over "confident" weeks (≥5 tickets) and requires at least 2 data points in the window to emit a value. Low-confidence weeks are shown as smaller, dimmed dots. Transition-phase dots use a diamond marker shape.
- **Secondary axis (right):** Copilot adoption percentage — the percentage of developers using Copilot that week, rendered as a filled area chart.
- **Annotations:** Horizontal dashed line at the pre-AI baseline productivity (mean-of-weekly from baseline period). Vertical dashed lines mark "AI Rollout" (Oct 1, 2025) and "80%+ Adoption" (Feb 7, 2026). The transition zone is shaded gray.
- **Dev-dept adoption overlay:** A second, dashed blue line shows adoption within the Development department only. The all-users adoption line dips whenever a wave of non-engineering seats (Management, SQA, Product, Support…) is onboarded — sporadic new users inflate the rolling 4-week denominator without being active every week. The dev-only line is the like-for-like signal for "are the engineers still using it."

### Output Volume — PRs & Code vs Tickets

- **Purpose:** Reconcile ticket-based productivity with raw output counts from external tools (Bitbucket/Qlik PR dashboards). Tickets/FTE-day can hold flat while PR volume hits records if the same tickets are being delivered as more, smaller PRs.
- **PR volume mode:** Grouped weekly bars of PRs merged vs Jira tickets closed, with a 4-week rolling **PRs-per-ticket** line on the right axis and a dashed pre-AI baseline for that ratio (mean of weekly ratios over confident baseline weeks).
- **Lines/FTE-day mode:** Weekly total PR lines ÷ (active authors × 5 workdays), raw dots plus 4-week rolling average, with the pre-AI baseline as a dashed line. If tickets/FTE-day is flat but lines/FTE-day rose, each ticket carries more code.
- **Data:** `totalPRs` (sum of per-ticket PR counts) and `totalLines` (sum of per-ticket PR lines) per week, emitted by the pipeline alongside the existing weekly series.

### Quality — QA Churn Rate vs Copilot Acceptance Rate

- **Purpose:** Track code quality alongside AI suggestion quality over time to see if they correlate.
- **Primary axis (left):** QA Churn Rate (%) — percentage of tickets with any QA rework lines (`qa_churn_lines > 0`). Shows weekly raw dots plus a 4-week rolling average, using the same confidence/window logic as the productivity chart. Lower churn is better.
- **Secondary axis (right):** Copilot Acceptance Rate (%) — 4-week rolling average of `code_acceptances / code_generations × 100`, aligned to the main weekly timeline by matching Saturday-ending week keys from Copilot telemetry.
- **Annotations:** Horizontal dashed line at the pre-AI baseline churn rate. Same phase boundary markers as the productivity chart.

### Cumulative Output & Velocity

- **Purpose:** Show total team throughput accumulation over time and whether the team is accelerating or decelerating.
- **Area (left axis):** Running cumulative sum of all tickets completed across the full timeline (including all phases).
- **Dashed line (right axis):** 4-week rolling velocity = average tickets/week over the rolling window, computed only over confident weeks (≥5 tickets, minimum 2 data points in window).
- **Annotations:** Same three-phase markers (AI Rollout, 80%+ Adoption, transition zone shading). Summary callout at the bottom shows total ticket count and developer headcount.

### Copilot Adoption Over Time

- **Purpose:** Show the trajectory of Copilot usage within the team over time.
- **Bars (left axis):** Weekly count of distinct active Copilot users from GitHub telemetry, bucketed into Saturday-ending weeks (same week alignment as PR data).
- **Line (right axis):** Weekly total code generation events (AI suggestion count) from Copilot telemetry.

---

## Comparison Analytics

### Copilot-Assisted vs Non-Assisted (Grouped Bar Chart)

- **Purpose:** Directly compare outcomes for tickets where the author was actively using Copilot vs tickets where they were not during the mature period.
- **Matching logic:** A ticket is "Copilot-assisted" when the PR author's `author_uuid` has any Copilot telemetry activity during the same Saturday-ending week that the PR was completed. All other mature-period tickets are "non-assisted."
- **Bars:** Side-by-side grouped bars showing Productivity (tickets/FTE-day) and QA Churn Rate for assisted vs non-assisted groups.
- **Intensity breakdown (sub-table):** Assisted tickets are further segmented by Copilot suggestion volume per ticket: Low (1–10 suggestions), Medium (11–50), High (51+). Each bucket shows ticket count and QA churn rate, enabling analysis of whether heavier AI usage correlates with different quality outcomes.

---

## Heatmaps

### Size × Complexity — Productivity vs Baseline (2×2 Grid)

- **Purpose:** Determine whether AI-driven productivity gains hold across different ticket characteristics, or are concentrated in a specific size/complexity category.
- **Dimensions:**
  - **Size:** Total lines of code across all PRs for a ticket. Buckets: `0–150` vs `151+`.
  - **Complexity:** Maximum files touched by any single PR for the ticket. Buckets: `1–5` vs `6+`.
- **Cell logic:** Each cell shows the percentage change in productivity vs baseline: `(post_productivity − baseline_productivity) / baseline_productivity × 100%`. Productivity per cell is the **mean of weekly** per-bucket productivity — for each week where the bucket shipped ≥1 ticket, `tickets_that_week / (bucket-active authors that week × 5 workdays)`, averaged over the period's weeks. This is the same series plotted on the Size × Complexity Trends page and mirrors the main chart's mean-of-weekly methodology, so heatmap deltas, trends-page baselines, and the headline productivity number are all directly comparable. (An earlier version pooled bucket tickets over the full-period author roster × all weeks, which deflated baselines ~2–4× relative to the weekly series.)
- **Color scale:** Green shades indicate improvement (darker green = larger gain), red shades indicate regression.

### Size × Complexity — QA Churn vs Baseline (2×2 Grid)

- **Purpose:** Same dimensional breakdown but for code quality. Reveals whether AI-generated code quality varies by ticket size and complexity.
- **Cell logic:** `(post_qa_churn − baseline_qa_churn) / baseline_qa_churn × 100%`. QA churn per cell = `tickets_with_qa_churn / total_tickets_in_bucket`.
- **Color scale:** Inverted from the productivity heatmap — green means churn *decreased* (quality improved), red means churn increased (quality regressed).

---

## Sub-Pages

The main dashboard links to three drill-down pages. They share the three-phase model and the Saturday-ending week alignment, but compute additional metrics not shown on the main dashboard.

### ROI Analysis — Capacity & Dollar Value (`/documents/ecs-sdlc-dashboard/roi`)

- **Purpose:** Translate the measured productivity uplift into an estimated capacity gain (FTE-equivalent) and dollar value.
- **Aggregation unit:** Month (`YYYY-MM`), built by grouping confident weekly rows that also have Copilot telemetry. Low-confidence weeks and weeks missing `copilotActiveUsers` / `copilotPct` are dropped before aggregating.
- **Per-month inputs (computed client-side in `RoiCapacityChart.tsx`):**
  - `avgProductivity` — mean of that month's weekly `teamProductivity` values.
  - `avgCopilotUsers` — mean of that month's weekly distinct active Copilot users.
  - `avgAdoptionPct` — mean of that month's weekly Copilot adoption percentage.
- **Per-month outputs:**
  - `upliftPct = max(0, (avgProductivity − baseline.productivity) / baseline.productivity)` — floored at zero so months below baseline don't generate negative "savings."
  - `fteEquivalent = avgCopilotUsers × upliftPct` — the month's productivity gain expressed in whole-FTE terms.
  - `dollarValue = fteEquivalent × (fully-loaded annual cost / 12)`.
  - `cumulativeDollar` — running sum of `dollarValue` across months in chronological order.
- **Key assumption — hard-coded:** Fully-loaded annual cost per developer = **$230,000** (`RoiCapacityChart.tsx:37`). This is not configurable and is not currently surfaced in the UI. Anyone reading the chart should know the dollar figures scale linearly with this constant.
- **Chart:** Monthly bars for capacity gain (FTE-equivalent), overlaid with a line for cumulative dollar value.

### Project Throughput (`/documents/ecs-sdlc-dashboard/projects`)

- **Purpose:** Show whether AI adoption is broadening the team's output across *more* projects, not just accelerating a single area.
- **"Project"** = the Jira project key prefix extracted during ticket aggregation (pipeline `aggregate_to_tickets`).
- **Period summary (baseline vs mature), per period:**
  - `unique_projects` — distinct projects that saw any completed ticket.
  - `total_tickets` — ticket count in the period.
  - `tickets_per_project` — **mean of weekly ratios**: for each week, `tickets_that_week / distinct_projects_that_week`; then averaged across weeks in the period. This is time-normalized so periods of different length are comparable.
  - `avg_projects_per_week` — mean of weekly distinct-project counts (a "breadth" measure).
- **Weekly series:** Per week, emits `activeProjects`, `totalTickets`, `ticketsPerProject` (= `totalTickets / activeProjects`), and `phase` tag.
- **Rolling velocity line:** 4-week rolling mean of `ticketsPerProject` (client-side in `ProjectThroughputChart.tsx`).
- **Top-10 table:** Per project, compares baseline vs mature `tickets`, `weeksActive`, and `velocity = tickets / weeksActive` (tickets per active week, not per calendar week). Ranked by mature ticket count (then baseline tickets as tiebreaker). The `velocityDelta` column shows the percentage change vs baseline; `N/A` is shown when baseline velocity is zero.

### Size × Complexity Trends (`/documents/ecs-sdlc-dashboard/size-complexity-trends`)

- **Purpose:** Same 2×2 size/complexity grid as the heatmaps, but as **time series** rather than single-point period comparisons — lets you see *when* the change happened in each bucket.
- **Per-cell weekly row** (pipeline `compute_size_complexity_weekly`), emitted for every (week × size × complexity) combination including empty buckets:
  - `tickets` — ticket count in that bucket that week.
  - `authors` — distinct author UUIDs in that bucket that week (split from the aggregated `AuthorUUIDs` list).
  - `productivity = tickets / (max(authors, 1) × 5 workdays)` — note the `max(..., 1)` guard prevents divide-by-zero on empty weeks.
  - `qaChurn` — mean of `HasQAChurn` in the bucket that week, or `null` if no tickets.
  - `lowConfidence` — `true` when `tickets < 5`.
  - `phase` — baseline / transition / mature tag.
- **Rendering:** One small-multiple chart per bucket. User can toggle metric (productivity / QA churn / both) and smoothing (raw vs 4-week rolling mean). A horizontal reference line per bucket shows that bucket's baseline value from the heatmap dataset — computed with the same weekly per-bucket-author formula as the plotted series (see heatmap Cell logic above), so the dashed line runs through the middle of the baseline-phase data rather than far below it.
- **Nuance — different rolling-avg rule:** The rolling mean here emits a value whenever ≥1 data point exists in the window (`SizeComplexityTrends.tsx:49–64`), unlike the main-dashboard rolling averages which require ≥2. This is intentional — per-bucket series are sparse and a ≥2 rule would leave too many gaps — but it means the earliest weeks of a trend line can be based on a single point and should not be read as "stable."

---

## Key Definitions

| Term | Definition |
|------|------------|
| **Ticket** | A Jira ticket, which may have one or more associated pull requests. PRs are aggregated to the ticket level. |
| **Week ending** | Saturday-ending ISO week. PR data and Copilot telemetry share this alignment. |
| **Confident week** | A week with ≥5 total tickets. Low-confidence weeks are excluded from rolling averages. |
| **Rolling average** | 4-week sliding window over confident weeks only. Requires ≥2 data points in the window to produce a value. (Exception: Size × Complexity Trends requires only ≥1.) |
| **QA churn** | Any ticket where `qa_churn_lines > 0` across its PRs. Indicates QA rework was needed. |
| **Size bucket** | Sum of `pr_lines` across all PRs for the ticket: `0–150` or `151+`. |
| **Complexity bucket** | Maximum `pr_files` from any single PR for the ticket: `1–5` or `6+`. |
| **Department** | Modal `Department` value from the user's PR rows, falling back to AI-telemetry rows for users who never authored a PR. Drives the per-user page filter and the dev-only adoption series. |
| **User tier** | Copilot usage intensity based on cumulative active days over the entire telemetry dataset (not per-period): Heavy (≥30), Medium (10–29), Light (<10). |
| **Copilot-assisted** | A ticket whose PR author had Copilot telemetry activity during the same Saturday-ending week as the PR completion. |
| **Partial week** | A week whose Saturday end-date is later than `max(PREnd)` in the input data (i.e., the most recent week is still in progress at export time). Pipeline emits `partial: true` for these rows. Excluded from the Team Productivity mean-of-weekly KPI, from the main productivity chart's rolling average, and from the ROI monthly rollup. Still rendered on the productivity time series as a dimmed dot with a "Partial week" tooltip. |
| **FTE-day** | One developer working one day. Productivity denominator = unique authors × 5 workdays per week. |
| **Project** | The Jira project key prefix of a ticket. Used for breadth/velocity analysis on the Projects page. |

---

## Implementation Notes

A few implementation details that don't affect *what* each metric means, but that a reader reviewing the numbers will want to know:

- **Pipeline vs client-side:** Most metrics (baseline comparisons, per-bucket productivity, weekly series, Copilot correlation) are precomputed in `pipeline/refresh_copilot.py` and written to `/public/data/copilot-dashboard-data.json`. The client only does light derivations: rolling averages, ROI monthly aggregation, and chart styling. If a number looks wrong, check the pipeline first.
- **Mean-of-weekly vs pooled:** Productivity comparisons (KPI, heatmaps' period productivity, Copilot-assisted vs not) use the **mean-of-weekly** pattern: compute per-week productivity, then average across weeks in the period. QA churn comparisons use the **pooled / overall rate** pattern: `tickets_with_churn / total_tickets` across the whole period. These are intentionally different — the productivity numerator is small and noisy at the weekly level, so mean-of-weekly dampens outliers; QA churn is a simple ratio where pooling is cleaner.
- **"Current" week:** KPI cards labeled "(current)" or "(this week)" read the most recent Saturday-ending week in the Copilot telemetry. The dashboard also filters out any week ending after the configured data range end, so the final partial week does not appear.
- **Adoption delta line:** The Copilot Adoption KPI's delta arrow compares **first-month unique users** vs **last-month unique users** (monthly granularity), not week-over-week. That's why it can show a very different direction from the weekly bar chart.
- **ROI floor:** The ROI page clamps monthly uplift at zero. A month where average productivity dipped below baseline contributes $0, not a negative value. This prevents "negative ROI" artifacts from single noisy months but also means the chart understates variability.
- **Partial-week handling:** The pipeline records `dataCutoff` (latest observed `PREnd`) on the JSON and marks any week whose Saturday-end is after the cutoff as `partial: true`. Partial weeks are dropped from the Team Productivity KPI (Python `compute_team_summary`), from the productivity chart's rolling average, and from the ROI monthly aggregation. QA churn, cumulative output, project throughput, and size-complexity trends currently still include partial weeks.
