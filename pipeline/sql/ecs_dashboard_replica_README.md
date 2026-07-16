# eCS SDLC AI KPI Dashboard — Core SQL Replica

**Companion script:** `ecs_dashboard_replica_core.sql`
**Replicates:** the warehouse layer behind `eCS_SDLC_AI_KPI_v2.pbix` (Fabric
`SDLC_Copilot_Warehouse`, schema `dbo`), scoped to the **core productivity and
quality metrics** only.

The pbix imports each warehouse view as-is — there are no Power Query
transformations. So to rehost the report you only need to (1) run this script
on your SQL Server / Azure SQL / Fabric Warehouse database, (2) load the two
base tables, and (3) repoint each query's `Source` step
(`Sql.Database("<server>", "<database>")`) at your instance. View and column
names in the script match the pbix bindings exactly.

---

## 1. What the script creates

| Object | Type | Feeds in the pbix |
|---|---|---|
| `dbo.dashboard_config` | 1-row table | phase dates + constants (replaces hard-coded values) |
| `dbo.pr_jira_metrics` | table | PR/Jira export (one row per PR) |
| `dbo.copilot_telemetry` | table | Copilot telemetry (one row per user per day) |
| `dbo.v_tickets` | view | ticket-level detail; DAX workarounds (e.g. output volume) |
| `dbo.v_weekly_team_metrics` | view | productivity chart, QA churn chart, cumulative/velocity, ROI measures |
| `dbo.v_baseline_metrics` | view | pre-AI baseline reference line + KPI labels |
| `dbo.v_team_summary` | view | headline KPI cards (Team Productivity, QA Churn, Total Output) |
| `dbo.v_copilot_weekly_adoption` | view | adoption overlay, acceptance rate, weekly-active-users KPIs |
| `dbo.v_copilot_user_tiers` | view | user-tier label, adoption-trend label |

## 2. What is intentionally NOT included

Per guidance, the four newer analytical views that exist in the original
warehouse are **omitted** — the focus is on making the basic productivity and
quality metrics calculate identically first:

| Omitted view | pbix visuals/measures that depend on it |
|---|---|
| `v_copilot_assisted_summary` | "Copilot Impact on Productivity" KPI card (`Copilot Productivity Impact`), assisted-vs-non-assisted labels, `Copilot-Assisted Value` / `Non-Assisted Value` measures |
| `v_copilot_assisted_weekly` | assisted vs non-assisted weekly comparison chart |
| `v_copilot_intensity` | Copilot intensity bucket table (low/medium/high suggestions) |
| `v_size_complexity` | both Size × Complexity heatmaps and their cell-label measures |

If the replica report keeps those visuals, they will show errors/blanks until
the views are added. Removing the visuals (or the whole page) is cleaner for a
core-only replica. Note these views also carry the known open calculation
issues (assisted/non-assisted classification, QA-churn sign flip, intensity
including non-mature phases), which is part of why they are excluded from the
core replica.

## 3. Calculation conventions (must-match rules)

These are the rules that make the core numbers reconcile. If a replica number
diverges, check these first:

1. **Week boundary** — Sun–Sat bucket labeled by the Sunday that ends it
   *exclusively*: `week_ending` = the next Sunday **strictly after** the
   date, so a Sunday date rolls into the *following* week. This was verified
   against every one of the 1,365 tickets in the pbix (7 tickets with a
   Sunday `pr_end` land in the next week — a pure ISO Mon–Sun rule gets
   those 7 wrong). Computed from the fixed Sunday anchor `1899-12-31` so the
   result is independent of `SET DATEFIRST` / locale.
2. **Ticket grain** — PRs are aggregated to the Jira ticket; a ticket lands in
   the week of its **latest** `pr_end`. All of the ticket's PR authors count
   toward that week's author denominator.
3. **Productivity** = `tickets / (unique authors × 5 workdays)`.
   Period-level productivity (baseline, mature) is the **mean of weekly**
   values over *confident* weeks (≥ 5 tickets) — never pooled `SUM/SUM`.
4. **QA churn rate** = `tickets with qa_churn_lines > 0 / total tickets`,
   **pooled** across the period (intentionally different from productivity:
   weekly productivity numerators are small and noisy, so mean-of-weekly
   dampens outliers; churn is a simple ratio where pooling is cleaner).
5. **Low-confidence week** — fewer than 5 tickets; excluded from all rolling
   averages and from period productivity means.
6. **Rolling averages** — calendar-anchored 4-week window
   `(week_ending − 21 days … week_ending)`, confident weeks only, and **≥ 2
   qualifying points required** or the value is NULL.
7. **Partial trailing week** — any week whose Sunday is later than the max
   observed `pr_end` (or `event_day` for telemetry) is dropped from view
   output entirely.
8. **Adoption denominator** — `copilot_pct` divides weekly active users by
   the **distinct users active in the trailing 4 weeks**, not lifetime users.
9. **Phases** — baseline `< 2025-10-01`, transition `2025-10-01 …
   2026-02-06`, mature `≥ 2026-02-07`. Held in `dbo.dashboard_config`.

## 4. Differences vs. the structure baked into the pbix

| # | Difference | Why / impact |
|---|---|---|
| 1 | **Only 6 of the 10 warehouse views** are created | Deliberate scope cut (see §2). |
| 2 | **Config table instead of hard-coded constants** | Phase dates and thresholds live in `dbo.dashboard_config` so the replica can be re-based without editing every view. Values shipped match the pbix (Oct 1 2025 / Feb 7 2026 / 5 / 5). |
| 3 | **`month_start` rule was reverse-engineered** | The original view SQL wasn't available; `month_start` was derived empirically from the pbix data: first day of the month containing **`week_ending − 3 days`**. This reproduces every one of the 92 weekly rows in the pbix, including all 17 month-boundary weeks. |
| 3b | **Week boundary differs from the website/reference SQL** | The website pipeline and the repo's PostgreSQL reference use a Mon–Sun ISO week where a Sunday date maps to *itself*; the pbix warehouse empirically maps Sunday dates to the *next* week (see §3, rule 1). The replica matches the **pbix**. Impact is limited to items landing exactly on a Sunday (7 of 1,365 tickets in the current data). |
| 4 | **Flags emitted as INT 0/1** (`has_qa_churn`, `low_confidence`) | Matches how the pbix model actually imports them (whole numbers, not booleans). |
| 5 | **Size/complexity buckets kept at 0-300 lines / 1-10 files** | These are the cuts baked into the pbix's `v_tickets`. Be aware the Tweed website dashboard has since moved to 150 lines / 5 files — the replica deliberately matches the pbix, not the website. If the buckets are later realigned, only `v_tickets`' two `CASE` expressions change. |
| 6 | **Views are live, not snapshots** | In the original warehouse, different views were refreshed at different times (e.g. the pbix's `v_team_summary` says 687 tickets / 21 weeks while its `v_weekly_team_metrics` already had 22 weeks). In this script every view derives from the same base tables at query time, so that class of inconsistency cannot occur — but it also means replica numbers will match the pbix only when the replica is loaded with the same data vintage. |
| 7 | **T-SQL dialect** | Written for SQL Server 2016 SP1+ / Azure SQL / Fabric Warehouse (`CREATE OR ALTER VIEW`, no `GREATEST`/`DATETRUNC`, `STDEV` for the sample standard deviation). The repo also has a PostgreSQL reference implementation (`copilot_dashboard_queries.sql`) with older view names (`v_mature_summary`, `v_copilot_adoption_weekly`, …); this script uses the **pbix names**. |
| 8 | **`agent_users` / `chat_users` will be 0 with new-format telemetry** | The AuthorUUID-based telemetry export has no agent/chat flags; the columns exist for schema compatibility (the pbix shows 0s for the same reason). |

## 5. What stays in Power BI (not in SQL)

The pbix contains model objects the replica keeps on the Power BI side —
do **not** try to build these in SQL:

- **Calculated tables (DAX):** `Date` (calendar 2025-01-01 → 2026-12-31),
  `DimMonth` (fact months ≥ Oct 2025 from the two weekly views),
  `Assumptions` (`Cost_per_FTE_per_month = 19166.67`,
  `Workdays_per_month = 20` — drives all $-value ROI measures),
  `Metric Axis`, `Measures Table`.
- **Calculated columns (DAX):** `v_weekly_team_metrics[Month Year]`,
  `[Month Sort]`; `v_copilot_weekly_adoption[Week Label]`, `[Week Sort]`.
- **All measures** (~70). The core KPI measures are thin wrappers over the
  view columns (`MAX(v_team_summary[team_productivity])`, etc.), so once the
  six views return the right numbers, the cards light up unchanged.

Two known DAX label defects exist in the pbix (`Weekly Active Users Label`
uses the latest week's active users as its own denominator, and
`Weekly Active Users Label_1` reverses the operands). They are report-side
bugs, not warehouse issues — a faithful replica will reproduce them; fixing
them is a one-line DAX change each.

## 6. Validation targets

With the same data vintage as the attached pbix (PR data through
**2026-07-05**, baseline window 2025-07-02 → 2025-09-30), the views should
return:

| View | Expected values |
|---|---|
| `v_baseline_metrics` | tickets **242**, authors **20**, workdays **70**, productivity **0.3840**, qa_churn_rate **0.2438** |
| `v_team_summary` | total_tickets **687**, team_authors **27**, team_productivity **0.4289**, productivity_vs_baseline_pct **+11.7**, team_qa_churn **0.2242**, qa_vs_baseline_pct **−8.1**, weeks_of_data **21** |
| `v_copilot_user_tiers` | total **53**, heavy **29**, medium **6**, light **18**, avg_daily_users_recent **15.2**, trend `10 → 28 monthly users` |
| `v_weekly_team_metrics` (spot check, week 2026-02-08) | 32 tickets, 13 authors, productivity 0.492308, qa rate 0.156250 |
| `v_copilot_weekly_adoption` (spot check, week 2026-01-11) | 20 active users, 95.2 %, 1,871 gen / 472 accept |

Small last-decimal differences (e.g. 0.3840 vs 0.3844) are rounding artifacts
and acceptable; anything larger means a convention in §3 was missed.

**Validation performed:** every rule in this script was checked against the
data embedded in the attached pbix — the week-ending rule against all 1,365
tickets, `month_start` against all 92 weekly rows, and the weekly
productivity / QA-churn / rolling-average columns recomputed row-by-row from
`v_tickets`. All headline numbers above reproduce exactly.

**One known irreproducible artifact:** the pbix's first two weekly rows
(2025-07-06, 2025-07-13) carry rolling values (`0.325` productivity /
`0.0676` QA) that cannot be derived from the view's own data under any
standard 4-week window — they appear to be stale values from an earlier
warehouse refresh (the same refresh-skew issue already known between
`v_team_summary` and `v_weekly_team_metrics`). The replica correctly emits
NULL for those two cells per the ≥ 2-confident-points rule, which matches
every other row in the pbix exactly. Do not chase this difference.
