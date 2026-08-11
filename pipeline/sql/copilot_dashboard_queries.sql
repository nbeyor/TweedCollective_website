-- ============================================================================
-- eCS SDLC Copilot Dashboard — PostgreSQL Analytics Queries (complete)
--
-- Converted from: pipeline/refresh_copilot.py
-- Source: Team-wide productivity vs pre-AI baseline with Copilot adoption overlay
--
-- This file is the complete SQL representation of the eCS dashboard as it
-- ships today, and the contract any external warehouse (e.g. the Fabric
-- SDLC_Copilot_Warehouse behind the pbix) should be rebuilt from. It matches
-- the current pipeline methodology:
--   • 150-line / 5-file size × complexity bucket cuts
--   • mean-of-weekly per-bucket heatmap productivity (not pooled)
--   • correct distinct-author counting in the assisted/non-assisted split
--   • mature-only, suggestions > 0 intensity buckets
--   • NULL (never placeholder values) for empty groups
--   • total_prs / total_lines output-volume columns on the weekly view
--   • Development-department adoption columns on the adoption view
--
-- Three-phase model:
--   Phase 1 (Baseline):   pre-Oct 2025 — no AI tools
--   Phase 2 (Transition): Oct 1, 2025 – Feb 6, 2026 — AI rollout, uneven adoption
--   Phase 3 (Mature):     Feb 7, 2026+ — 80%+ weekly Copilot adoption
--
-- Conventions (must match pipeline/refresh_copilot.py):
--   - Week boundary: Mon 00:00 → Sun 23:59:59 (ISO calendar week).
--     `week_ending` is the Sunday date.
--   - Partial trailing week (week_ending > max observed pr_end / event_day)
--     is hidden entirely from every query result. The filter is applied at
--     the PR-row / telemetry-row level BEFORE aggregation (see v_prs): a
--     ticket whose latest PR fell in the partial week slides back to the
--     week of its previous PR rather than disappearing.
--   - Rolling averages: 4-week calendar-anchored window tailing each
--     Sunday week_ending. Low-confidence weeks inside the window are
--     dropped; ≥2 remaining points required or NULL.
--   - Productivity = tickets / (unique authors × 5 workdays). Period-level
--     productivity is MEAN-OF-WEEKLY over confident weeks (never pooled
--     SUM/SUM). QA churn is POOLED (tickets with churn / total tickets) —
--     intentionally different; churn is a simple share where pooling is
--     denominator-consistent.
--   - Size × complexity cuts: 150 lines / 5 files (labels '0-150'/'151+'
--     and '1-5'/'6+'). Data-driven cuts near the 65th pct of lines and the
--     61st pct of files; kept as constants so bucket labels stay stable
--     across refreshes and comparable to baseline. (The pre-2026-07 cuts
--     were 300/10 — any consumer still on those is stale.)
--   - Null-key rows (NULL jira_ticket, author_uuid, pr_end, user_id, or
--     event_day) MUST be dropped by the loader before insert; the table
--     DDL below enforces this with NOT NULL as a safety net.
--
-- Usage: Run the file top-to-bottom to install all tables and views. Once
--        installed, external consumers (Power BI, Metabase, notebooks) should
--        bind directly to the named views below — NOT recompute these
--        aggregates in Power Query / DAX / M.
--
--        Consumer-facing views (defined inline with the numbered queries):
--          v_prs                              — PR rows, partial week hidden
--          v_tickets                          — PR→ticket aggregation (Query 0)
--          v_weekly_team_metrics              — Query 1 (+ output volume)
--          v_baseline_metrics                 — Query 2
--          v_mature_summary                   — Query 3
--          v_size_complexity_weekly           — Query 4a (trends page series)
--          v_size_complexity_heatmap          — Query 4b (derived from 4a)
--          v_copilot_adoption_weekly          — Query 5 (+ dev-dept cohort)
--          v_copilot_user_tiers               — Query 6
--          v_copilot_pr_correlation_weekly    — Query 7
--          v_copilot_pr_correlation_summary   — Query 7b
--          v_copilot_intensity_buckets        — Query 8
--
--        Dashboard features intentionally NOT modeled in SQL (client-side or
--        removed):
--          • ROI capacity/dollar page — client-side monthly rollup over
--            v_weekly_team_metrics + v_copilot_adoption_weekly with a
--            hard-coded $230k fully-loaded cost assumption (RoiCapacityChart).
--          • Per-developer drill-down — pipeline-only (blinded aliases,
--            email/department maps; not a warehouse concern).
--          • Project throughput page — removed from the dashboard July 2026.
--
--        Caller must SET app.* config vars (see CONFIGURATION below) at the
--        session level before selecting from these views.
-- ============================================================================


-- ── CONFIGURATION ───────────────────────────────────────────────────────────
-- Set these as session-level variables. Referenced in queries via current_setting().
SET app.baseline_end   = '2025-10-01';   -- End of pre-AI baseline period
SET app.mature_start   = '2026-02-07';   -- Start of 80%+ Copilot adoption
SET app.workdays_per_week     = '5';
SET app.rolling_window        = '4';
SET app.min_tickets_threshold = '5';
-- Size × complexity cuts are hard-coded in v_tickets / the bucket grids
-- (150 lines / 5 files) because the bucket *labels* are part of the contract
-- and must stay stable across refreshes.


-- ============================================================================
-- TABLE DEFINITIONS
-- ============================================================================

-- PR/Jira metrics — one row per pull request, joined with Jira ticket data.
-- Maps to the "Current dashboard data" / "Pull MM_DD_YY" Excel sheet.
CREATE TABLE IF NOT EXISTS pr_jira_metrics (
    jira_ticket              TEXT        NOT NULL,
    title                    TEXT,
    author_uuid              UUID        NOT NULL,
    first_activity           DATE,
    first_ready_for_qa_date  DATE,
    pr_start                 DATE,
    pr_end                   DATE        NOT NULL,
    pr_files                 INTEGER     NOT NULL DEFAULT 0,
    pr_lines                 INTEGER     NOT NULL DEFAULT 0,
    pr_ai                    INTEGER     NOT NULL DEFAULT 0,
    churn_lines              INTEGER     NOT NULL DEFAULT 0,
    qa_churn_lines           INTEGER     NOT NULL DEFAULT 0
);

-- Copilot / AI telemetry — one row per user per day.
-- Supports two source formats:
--   Legacy: "Copilot_All" sheet (GithubUserId-based)
--   New:    "AI All MM_DD_YY" sheet (AuthorUUID-based, enables PR correlation)
--
-- Column names use the canonical (normalized) form from _load_copilot_df().
-- When loading legacy data, map: GithubUserId→user_id,
--   CodeGenerationActivityCount→suggestions, CodeAcceptanceActivityCount→acceptances,
--   LocAddedSum→loc_added.
-- When loading new data, map: AuthorUUID→user_id,
--   suggestionCount→suggestions, acceptedSuggestionCount→acceptances,
--   LineCountAdded→loc_added, Department→department.
CREATE TABLE IF NOT EXISTS copilot_telemetry (
    event_day       DATE    NOT NULL,
    user_id         TEXT    NOT NULL,     -- AuthorUUID (new) or GithubUserId (legacy)
    suggestions     INTEGER NOT NULL DEFAULT 0,
    acceptances     INTEGER NOT NULL DEFAULT 0,
    used_agent      BOOLEAN DEFAULT NULL, -- may be absent in new format
    used_chat       BOOLEAN DEFAULT NULL, -- may be absent in new format
    loc_added       INTEGER NOT NULL DEFAULT 0,
    department      TEXT    DEFAULT NULL  -- new format only; feeds the dev-only
                                          -- adoption series (legacy → NULL)
);


-- ============================================================================
-- VIEW: v_prs — PR rows with the partial trailing week hidden
-- ============================================================================
-- Mirrors: refresh_copilot.py → build_dashboard_data() partial-week filter.
--
-- The pipeline drops PR rows whose Mon-Sun week extends past the observed
-- data cutoff (max pr_end) BEFORE aggregating to tickets. A ticket whose
-- latest PR fell in the partial week therefore slides back to the week of
-- its previous PR — it is the PR rows that are hidden, not the ticket. All
-- ticket/author aggregation below must read v_prs, never pr_jira_metrics
-- directly (the raw table is only used to compute the cutoff itself).

CREATE OR REPLACE VIEW v_prs AS
SELECT p.*
FROM pr_jira_metrics p
WHERE (date_trunc('week', p.pr_end::date) + INTERVAL '6 days')::date
      <= (SELECT MAX(pr_end)::date FROM pr_jira_metrics);


-- ============================================================================
-- VIEW: v_tickets — Aggregate PRs to Jira ticket level (Query 0)
-- ============================================================================
-- Mirrors: refresh_copilot.py → aggregate_to_tickets()
--
-- Groups PRs by jira_ticket. Computes:
--   - pr_count, max_files, total_lines, total_churn_lines, total_qa_churn_lines
--   - pr_end_date (latest PR end across all PRs for the ticket)
--   - week_ending (Sunday end of the Mon-Sun ISO calendar week)
--   - has_qa_churn (boolean: any QA churn lines > 0)
--   - size_bucket ('0-150' or '151+')     — total PR lines for the ticket
--   - complexity_bucket ('1-5' or '6+')   — max files touched by any one PR
--
-- Sunday-ending week logic (Mon-Sun ISO calendar week):
--   pandas: dt.to_period('W-SUN').dt.end_time.dt.normalize()
--   Postgres: date_trunc('week', d) already returns the Monday of the
--             ISO week. Add 6 days to land on Sunday.

CREATE OR REPLACE VIEW v_tickets AS
SELECT
    jira_ticket,
    COUNT(*)                              AS pr_count,
    MAX(pr_end)::date                     AS pr_end_date,
    -- Sunday-ending week (Mon-Sun ISO calendar week)
    (date_trunc('week', MAX(pr_end)::date) + INTERVAL '6 days')::date
                                          AS week_ending,
    MAX(pr_files)                         AS max_files,
    SUM(pr_lines)                         AS total_lines,
    SUM(churn_lines)                      AS total_churn_lines,
    SUM(qa_churn_lines)                   AS total_qa_churn_lines,
    (SUM(qa_churn_lines) > 0)             AS has_qa_churn,
    -- Size bucket: total lines across all PRs for ticket (cut = 150)
    CASE
        WHEN SUM(pr_lines) <= 150 THEN '0-150'
        ELSE '151+'
    END                                   AS size_bucket,
    -- Complexity bucket: max files touched by any single PR (cut = 5)
    CASE
        WHEN MAX(pr_files) <= 5 THEN '1-5'
        ELSE '6+'
    END                                   AS complexity_bucket
FROM v_prs
GROUP BY jira_ticket;


-- ============================================================================
-- QUERY 1: Weekly Team Metrics
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_weekly_team_metrics() and the
-- rolling logic in components/copilot-dashboard/charts/ProductivityChart.tsx
-- and QaChurnChart.tsx.
--
-- Returns one row per fully-observed Sunday-ending week with:
--   - total_tickets, team_authors (unique authors that week)
--   - team_productivity = tickets / (authors × 5 workdays)
--   - team_qa_churn_rate = tickets with QA churn / total tickets
--   - total_prs / total_lines — raw output volume, reconciling ticket-based
--     productivity with PR/commit counts from external tools (Bitbucket/
--     Qlik): PRs per ticket can rise while tickets/FTE-day stays flat.
--     Feeds OutputVolumeChart (PRs-per-ticket ratio, lines/FTE-day mode).
--   - low_confidence flag (< 5 tickets)
--   - phase tag (baseline / transition / mature)
--   - 4-week *calendar-anchored* rolling average of productivity and QA
--     churn: for each Sunday W, average rows in [W-21d, W] that are not
--     low-confidence and not partial. Require ≥2 included points or NULL.
--
-- Partial trailing weeks (week_ending > max observed pr_end) are hidden
-- from the result entirely.

CREATE OR REPLACE VIEW v_weekly_team_metrics AS
WITH data_cutoff AS (
    SELECT MAX(pr_end)::date AS cutoff FROM pr_jira_metrics
),
weekly_raw AS (
    SELECT
        t.week_ending,
        COUNT(*)                                     AS total_tickets,
        -- Unique authors: count distinct from the PR-level data for tickets in this week
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM v_prs p
         WHERE p.jira_ticket IN (SELECT t2.jira_ticket FROM v_tickets t2 WHERE t2.week_ending = t.week_ending)
        )                                            AS team_authors,
        SUM(CASE WHEN t.has_qa_churn THEN 1 ELSE 0 END) AS qa_churn_tickets,
        SUM(t.pr_count)                              AS total_prs,
        SUM(t.total_lines)                           AS total_lines
    FROM v_tickets t
    GROUP BY t.week_ending
),
weekly_metrics AS (
    SELECT
        wr.week_ending,
        wr.total_tickets,
        GREATEST(wr.team_authors, 1)                 AS team_authors,
        wr.total_tickets::numeric
            / (GREATEST(wr.team_authors, 1) * current_setting('app.workdays_per_week')::int)
                                                     AS team_productivity,
        CASE WHEN wr.total_tickets > 0
             THEN wr.qa_churn_tickets::numeric / wr.total_tickets
             ELSE NULL
        END                                          AS team_qa_churn_rate,
        wr.total_prs,
        wr.total_lines,
        wr.total_tickets < current_setting('app.min_tickets_threshold')::int
                                                     AS low_confidence,
        wr.week_ending > (SELECT cutoff FROM data_cutoff)
                                                     AS partial,
        CASE
            WHEN wr.week_ending < current_setting('app.baseline_end')::date   THEN 'baseline'
            WHEN wr.week_ending < current_setting('app.mature_start')::date   THEN 'transition'
            ELSE 'mature'
        END                                          AS phase
    FROM weekly_raw wr
)
SELECT
    m.week_ending,
    m.phase,
    m.total_tickets,
    m.team_authors,
    ROUND(m.team_productivity, 6)                    AS team_productivity,
    ROUND(m.team_qa_churn_rate, 6)                   AS team_qa_churn_rate,
    m.total_prs,
    m.total_lines,
    m.low_confidence,
    -- Calendar-anchored 4-week rolling: average rows in (W-21d .. W] that
    -- are not low-confidence and not partial. NULL when <2 points qualify.
    (SELECT CASE WHEN COUNT(*) >= 2 THEN ROUND(AVG(w2.team_productivity), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN m.week_ending - 21 AND m.week_ending
       AND NOT w2.low_confidence
       AND NOT w2.partial
    )                                                AS team_productivity_rolling,
    (SELECT CASE WHEN COUNT(*) >= 2 THEN ROUND(STDDEV(w2.team_productivity), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN m.week_ending - 21 AND m.week_ending
       AND NOT w2.low_confidence
       AND NOT w2.partial
    )                                                AS team_productivity_std,
    (SELECT CASE WHEN COUNT(*) >= 2 THEN ROUND(AVG(w2.team_qa_churn_rate), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN m.week_ending - 21 AND m.week_ending
       AND NOT w2.low_confidence
       AND NOT w2.partial
       AND w2.team_qa_churn_rate IS NOT NULL
    )                                                AS team_qa_churn_rate_rolling,
    -- 4-week rolling PRs-per-ticket (OutputVolumeChart right-axis line)
    (SELECT CASE WHEN COUNT(*) >= 2
                 THEN ROUND(AVG(w2.total_prs::numeric / NULLIF(w2.total_tickets, 0)), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN m.week_ending - 21 AND m.week_ending
       AND NOT w2.low_confidence
       AND NOT w2.partial
    )                                                AS prs_per_ticket_rolling
FROM weekly_metrics m
WHERE NOT m.partial   -- hide the trailing partial week from the result entirely
ORDER BY m.week_ending;


-- ============================================================================
-- QUERY 2: Baseline Metrics (pre-Oct 2025)
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_baseline()
--
-- productivity is the mean of weekly team_productivity over *confident*
-- baseline weeks, taken straight from v_weekly_team_metrics (same rows the
-- productivity chart plots) so the baseline reference line, the KPI deltas,
-- and the weekly series are all derived from one series.
-- Pooled stats (tickets, authors, workdays, QA churn) are cut on the ticket's
-- pr_end_date; the weekly mean is cut on week_ending — matching the pipeline.

CREATE OR REPLACE VIEW v_baseline_metrics AS
WITH baseline_tickets AS (
    SELECT * FROM v_tickets
    WHERE pr_end_date < current_setting('app.baseline_end')::date
),
baseline_authors AS (
    SELECT COUNT(DISTINCT p.author_uuid) AS author_count
    FROM v_prs p
    WHERE p.jira_ticket IN (SELECT jira_ticket FROM baseline_tickets)
),
baseline_weeks AS (
    SELECT COUNT(DISTINCT week_ending) AS week_count
    FROM baseline_tickets
),
baseline_weekly AS (
    SELECT team_productivity
    FROM v_weekly_team_metrics
    WHERE week_ending < current_setting('app.baseline_end')::date
      AND NOT low_confidence
)
SELECT
    (SELECT COUNT(*) FROM baseline_tickets)                      AS tickets,
    (SELECT author_count FROM baseline_authors)                  AS authors,
    (SELECT week_count FROM baseline_weeks)
        * current_setting('app.workdays_per_week')::int          AS workdays,
    -- Mean-of-weekly productivity over confident baseline weeks
    (SELECT ROUND(AVG(team_productivity), 4) FROM baseline_weekly)
                                                                 AS productivity,
    -- Pooled QA churn rate (ticket-level, not weekly mean)
    (SELECT ROUND(SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric
                  / NULLIF(COUNT(*), 0), 4)
     FROM baseline_tickets)                                      AS qa_churn_rate,
    (SELECT MIN(pr_end_date) FROM baseline_tickets)              AS date_range_start,
    (SELECT MAX(pr_end_date) FROM baseline_tickets)              AS date_range_end;


-- ============================================================================
-- QUERY 3: Team Summary — Mature period (Feb 7, 2026+) vs baseline
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_team_summary()
--
-- Computes mature-period productivity/QA and percentage delta vs baseline.
-- Like Query 2, the mean-of-weekly legs read v_weekly_team_metrics directly.

CREATE OR REPLACE VIEW v_mature_summary AS
WITH baseline_agg AS (
    SELECT
        (SELECT AVG(team_productivity)
         FROM v_weekly_team_metrics
         WHERE week_ending < current_setting('app.baseline_end')::date
           AND NOT low_confidence)                               AS baseline_productivity,
        (SELECT SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0)
         FROM v_tickets
         WHERE pr_end_date < current_setting('app.baseline_end')::date)
                                                                 AS baseline_qa_churn_rate
),
mature_tickets AS (
    SELECT * FROM v_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
      -- Hide partial trailing week (week_ending past max observed pr_end)
      AND week_ending <= (SELECT MAX(pr_end)::date FROM pr_jira_metrics)
),
mature_weekly AS (
    SELECT team_productivity
    FROM v_weekly_team_metrics
    WHERE week_ending >= current_setting('app.mature_start')::date
      AND NOT low_confidence
),
mature_agg AS (
    SELECT AVG(team_productivity) AS team_productivity FROM mature_weekly
),
mature_qa AS (
    SELECT
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric
            / NULLIF(COUNT(*), 0)   AS team_qa_churn
    FROM mature_tickets
),
mature_authors AS (
    SELECT COUNT(DISTINCT p.author_uuid) AS team_authors
    FROM v_prs p
    WHERE p.jira_ticket IN (SELECT jira_ticket FROM mature_tickets)
)
SELECT
    (SELECT COUNT(*) FROM mature_tickets)                                AS total_tickets,
    (SELECT team_authors FROM mature_authors)                            AS team_authors,
    ROUND((SELECT team_productivity FROM mature_agg), 4)                 AS team_productivity,
    -- Productivity delta vs baseline
    ROUND(
        ((SELECT team_productivity FROM mature_agg) - b.baseline_productivity)
        / NULLIF(b.baseline_productivity, 0) * 100, 1
    )                                                                    AS productivity_vs_baseline_pct,
    ROUND((SELECT team_qa_churn FROM mature_qa), 4)                      AS team_qa_churn,
    -- QA churn delta vs baseline
    ROUND(
        ((SELECT team_qa_churn FROM mature_qa) - b.baseline_qa_churn_rate)
        / NULLIF(b.baseline_qa_churn_rate, 0) * 100, 1
    )                                                                    AS qa_vs_baseline_pct,
    (SELECT COUNT(*) FROM mature_weekly)                                 AS weeks_of_data
FROM baseline_agg b;


-- ============================================================================
-- QUERY 4a: Size / Complexity — Weekly per-bucket series
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_size_complexity_weekly()
--
-- One row per (week × size × complexity) combination — including zero rows
-- for weeks where a bucket saw no activity, so consumers can render a
-- continuous time series without reconstructing missing weeks. Feeds the
-- Size × Complexity Trends page, and Query 4b's mean-of-weekly aggregates.
--
--   productivity = tickets / (max(bucket-active authors, 1) × 5 workdays);
--                  0 when the bucket shipped nothing that week
--   qa_churn     = share of the bucket's tickets with QA churn; NULL when
--                  the bucket shipped nothing (never a placeholder value)
--   low_confidence = tickets < 5 (per bucket-week)

CREATE OR REPLACE VIEW v_size_complexity_weekly AS
WITH data_cutoff AS (
    SELECT MAX(pr_end)::date AS cutoff FROM pr_jira_metrics
),
weeks AS (
    SELECT DISTINCT t.week_ending
    FROM v_tickets t
    WHERE t.week_ending <= (SELECT cutoff FROM data_cutoff)
),
bucket_grid AS (
    SELECT s.size_bucket, c.complexity_bucket
    FROM (VALUES ('0-150'), ('151+'))     AS s(size_bucket)
    CROSS JOIN (VALUES ('1-5'), ('6+'))   AS c(complexity_bucket)
),
cell_tickets AS (
    SELECT
        t.week_ending, t.size_bucket, t.complexity_bucket,
        COUNT(*)                                        AS tickets,
        SUM(CASE WHEN t.has_qa_churn THEN 1 ELSE 0 END) AS qa_tickets
    FROM v_tickets t
    WHERE t.week_ending <= (SELECT cutoff FROM data_cutoff)
    GROUP BY t.week_ending, t.size_bucket, t.complexity_bucket
),
cell_authors AS (
    SELECT
        t.week_ending, t.size_bucket, t.complexity_bucket,
        COUNT(DISTINCT p.author_uuid) AS authors
    FROM v_tickets t
    JOIN v_prs p ON p.jira_ticket = t.jira_ticket
    WHERE t.week_ending <= (SELECT cutoff FROM data_cutoff)
    GROUP BY t.week_ending, t.size_bucket, t.complexity_bucket
)
SELECT
    w.week_ending,
    CASE
        WHEN w.week_ending < current_setting('app.baseline_end')::date THEN 'baseline'
        WHEN w.week_ending < current_setting('app.mature_start')::date THEN 'transition'
        ELSE 'mature'
    END                                               AS phase,
    g.size_bucket,
    g.complexity_bucket,
    COALESCE(ct.tickets, 0)                           AS tickets,
    COALESCE(ca.authors, 0)                           AS authors,
    ROUND(
        COALESCE(ct.tickets, 0)::numeric
        / (GREATEST(COALESCE(ca.authors, 0), 1)
           * current_setting('app.workdays_per_week')::int)
    , 6)                                              AS productivity,
    CASE WHEN COALESCE(ct.tickets, 0) > 0
         THEN ROUND(ct.qa_tickets::numeric / ct.tickets, 6)
    END                                               AS qa_churn,
    COALESCE(ct.tickets, 0) < current_setting('app.min_tickets_threshold')::int
                                                      AS low_confidence
FROM weeks w
CROSS JOIN bucket_grid g
LEFT JOIN cell_tickets ct
       ON ct.week_ending = w.week_ending
      AND ct.size_bucket = g.size_bucket
      AND ct.complexity_bucket = g.complexity_bucket
LEFT JOIN cell_authors ca
       ON ca.week_ending = w.week_ending
      AND ca.size_bucket = g.size_bucket
      AND ca.complexity_bucket = g.complexity_bucket
ORDER BY w.week_ending, g.size_bucket, g.complexity_bucket;


-- ============================================================================
-- QUERY 4b: Size / Complexity Heatmap (2×2)
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_size_complexity()
--
-- Compares mature (post-AI) vs baseline (pre-AI) for each bucket:
--   Size:       0-150, 151+
--   Complexity: 1-5, 6+
--
-- Productivity per cell is the **mean of weekly** per-bucket productivity
-- from Query 4a (`tickets / (bucket-active authors × 5)`), averaged over the
-- period's weeks where the bucket shipped ≥1 ticket. This keeps heatmap
-- deltas, trends-page baseline lines, and the headline productivity number
-- directly comparable. (The previous pooled formula divided bucket tickets
-- by the full-period author roster × all weeks, which deflated baselines
-- ~2-4× relative to the weekly series and made every bucket read as "way
-- above baseline" even during the baseline period itself.)
--
-- Ticket counts and QA churn remain pooled per period — QA churn is a share
-- of tickets, so pooling is denominator-consistent.

CREATE OR REPLACE VIEW v_size_complexity_heatmap AS
WITH post_tickets AS (
    SELECT * FROM v_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
      -- Hide partial trailing week
      AND week_ending <= (SELECT MAX(pr_end)::date FROM pr_jira_metrics)
),
pre_tickets AS (
    SELECT * FROM v_tickets WHERE pr_end_date < current_setting('app.baseline_end')::date
),
-- Cross-join the two bucket dimensions to ensure all 4 cells appear
bucket_grid AS (
    SELECT s.size_bucket, c.complexity_bucket
    FROM (VALUES ('0-150'), ('151+'))     AS s(size_bucket)
    CROSS JOIN (VALUES ('1-5'), ('6+'))   AS c(complexity_bucket)
),
post_agg AS (
    SELECT size_bucket, complexity_bucket,
           COUNT(*)                                               AS ticket_count,
           SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric
               / NULLIF(COUNT(*), 0)                              AS qa_churn
    FROM post_tickets
    GROUP BY size_bucket, complexity_bucket
),
pre_agg AS (
    SELECT size_bucket, complexity_bucket,
           COUNT(*)                                               AS ticket_count,
           SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric
               / NULLIF(COUNT(*), 0)                              AS qa_churn
    FROM pre_tickets
    GROUP BY size_bucket, complexity_bucket
),
-- Mean-of-weekly productivity per (bucket × phase), over weeks with activity
weekly_means AS (
    SELECT size_bucket, complexity_bucket, phase,
           AVG(productivity) AS mean_productivity
    FROM v_size_complexity_weekly
    WHERE tickets > 0
      AND phase IN ('baseline', 'mature')
    GROUP BY size_bucket, complexity_bucket, phase
)
SELECT
    g.size_bucket || ' / ' || g.complexity_bucket                 AS label,
    g.size_bucket,
    g.complexity_bucket,
    COALESCE(po.ticket_count, 0)                                  AS post_tickets,
    COALESCE(pr.ticket_count, 0)                                  AS baseline_tickets,
    ROUND(COALESCE(wm_post.mean_productivity, 0), 6)              AS post_productivity,
    ROUND(COALESCE(wm_pre.mean_productivity, 0), 6)               AS baseline_productivity,
    ROUND(COALESCE(po.qa_churn, 0), 6)                            AS post_qa_churn,
    ROUND(COALESCE(pr.qa_churn, 0), 6)                            AS baseline_qa_churn
FROM bucket_grid g
LEFT JOIN post_agg po USING (size_bucket, complexity_bucket)
LEFT JOIN pre_agg  pr USING (size_bucket, complexity_bucket)
LEFT JOIN weekly_means wm_post
       ON wm_post.size_bucket = g.size_bucket
      AND wm_post.complexity_bucket = g.complexity_bucket
      AND wm_post.phase = 'mature'
LEFT JOIN weekly_means wm_pre
       ON wm_pre.size_bucket = g.size_bucket
      AND wm_pre.complexity_bucket = g.complexity_bucket
      AND wm_pre.phase = 'baseline'
WHERE COALESCE(po.ticket_count, 0) + COALESCE(pr.ticket_count, 0) > 0
ORDER BY g.size_bucket, g.complexity_bucket;


-- ============================================================================
-- QUERY 5: Copilot Adoption — Weekly
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_copilot_adoption() (weekly portion).
--
-- Returns weekly active users, code gen/acceptance counts, agent/chat usage,
-- LOC added, the headline `copilot_pct` adoption rate, and the
-- Development-department cohort series.
--
-- Denominator note: `copilot_pct` uses a *rolling 4-week active-user*
-- denominator (distinct users with any Copilot activity in [W-21d, W]),
-- not a lifetime-unique count. The lifetime denominator kept churned/
-- inactive seats in the denominator forever and suppressed the apparent
-- adoption rate (e.g. ~31% where the rolling denom gives ~90%).
--
-- Dev-department cohort: AI seats are increasingly granted to non-engineering
-- roles (Management, SQA, Product, Support, …) who use the tools sporadically
-- and author no PRs; each onboarding wave inflates the rolling denominator
-- and drags the all-users adoption % down without any change in developer
-- behavior. The dev-only series is the like-for-like adoption signal. A
-- user's department = modal Department value in their telemetry rows (ties
-- broken alphabetically, matching pandas mode().iloc[0]). When the export
-- carries no Department column the dev_* columns are NULL.
--
-- Partial trailing week (week_ending > max observed event_day) is hidden
-- from the result entirely.

CREATE OR REPLACE VIEW v_copilot_adoption_weekly AS
WITH telemetry_weekly AS (
    -- Per-user, per-week activity (one row per distinct (user, week))
    SELECT
        user_id,
        (date_trunc('week', event_day) + INTERVAL '6 days')::date AS week_ending
    FROM copilot_telemetry
    -- Mirror _load_copilot_df(): partial trailing telemetry week is dropped,
    -- so its suggestions never classify a PR as assisted
    WHERE (date_trunc('week', event_day) + INTERVAL '6 days')::date
          <= (SELECT MAX(event_day)::date FROM copilot_telemetry)
    GROUP BY user_id, (date_trunc('week', event_day) + INTERVAL '6 days')::date
),
user_department AS (
    -- Modal non-null Department per user; ties broken alphabetically
    SELECT user_id, department
    FROM (
        SELECT user_id, department,
               ROW_NUMBER() OVER (PARTITION BY user_id
                                  ORDER BY COUNT(*) DESC, department) AS rn
        FROM copilot_telemetry
        WHERE department IS NOT NULL
        GROUP BY user_id, department
    ) d
    WHERE rn = 1
),
dev_users AS (
    SELECT user_id FROM user_department WHERE department = 'Development'
),
weekly_copilot AS (
    SELECT
        -- Sunday-ending week (Mon-Sun ISO calendar week)
        (date_trunc('week', event_day) + INTERVAL '6 days')::date      AS week_ending,
        COUNT(DISTINCT user_id)                                        AS active_users,
        SUM(suggestions)                                               AS total_code_gen,
        SUM(acceptances)                                               AS total_code_accept,
        -- Users who used agent at least once this week (NULL-safe for new format)
        COUNT(DISTINCT CASE WHEN used_agent THEN user_id END)          AS agent_users,
        -- Users who used chat at least once this week (NULL-safe for new format)
        COUNT(DISTINCT CASE WHEN used_chat  THEN user_id END)          AS chat_users,
        SUM(loc_added)                                                 AS loc_added
    FROM copilot_telemetry
    GROUP BY (date_trunc('week', event_day) + INTERVAL '6 days')::date
),
data_cutoff_cop AS (
    SELECT MAX(event_day)::date AS cutoff FROM copilot_telemetry
)
SELECT
    w.week_ending,
    w.active_users,
    -- Rolling 4-week distinct-active-user denominator (also exposed raw)
    (SELECT COUNT(DISTINCT tw.user_id)
     FROM telemetry_weekly tw
     WHERE tw.week_ending BETWEEN w.week_ending - 21 AND w.week_ending
    )                                                                  AS rolling_active_users,
    ROUND(
        w.active_users::numeric
        / NULLIF((
            SELECT COUNT(DISTINCT tw.user_id)
            FROM telemetry_weekly tw
            WHERE tw.week_ending BETWEEN w.week_ending - 21 AND w.week_ending
        ), 0) * 100, 1
    )                                                                  AS copilot_pct,
    w.total_code_gen,
    w.total_code_accept,
    w.agent_users,
    w.chat_users,
    w.loc_added,
    -- Development-department cohort (NULL when no Department data at all)
    CASE WHEN EXISTS (SELECT 1 FROM dev_users) THEN
        (SELECT COUNT(DISTINCT tw.user_id)
         FROM telemetry_weekly tw
         JOIN dev_users du ON du.user_id = tw.user_id
         WHERE tw.week_ending = w.week_ending)
    END                                                                AS dev_active_users,
    CASE WHEN EXISTS (SELECT 1 FROM dev_users) THEN
        (SELECT COUNT(DISTINCT tw.user_id)
         FROM telemetry_weekly tw
         JOIN dev_users du ON du.user_id = tw.user_id
         WHERE tw.week_ending BETWEEN w.week_ending - 21 AND w.week_ending)
    END                                                                AS dev_rolling_active_users,
    CASE WHEN EXISTS (SELECT 1 FROM dev_users) THEN
        ROUND(
            (SELECT COUNT(DISTINCT tw.user_id)
             FROM telemetry_weekly tw
             JOIN dev_users du ON du.user_id = tw.user_id
             WHERE tw.week_ending = w.week_ending)::numeric
            / GREATEST((
                SELECT COUNT(DISTINCT tw.user_id)
                FROM telemetry_weekly tw
                JOIN dev_users du ON du.user_id = tw.user_id
                WHERE tw.week_ending BETWEEN w.week_ending - 21 AND w.week_ending
            ), 1) * 100, 1)
    END                                                                AS dev_copilot_pct
FROM weekly_copilot w
CROSS JOIN data_cutoff_cop dc
WHERE w.week_ending <= dc.cutoff   -- hide partial trailing week
ORDER BY w.week_ending;


-- ============================================================================
-- QUERY 6: Copilot User Tiers
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_copilot_adoption() (tier portion)
--
-- Classifies users by total active days:
--   Heavy:  >= 30 days
--   Medium: 10–29 days
--   Light:  < 10 days

CREATE OR REPLACE VIEW v_copilot_user_tiers AS
WITH telemetry AS (
    -- Mirror _load_copilot_df(): the partial trailing telemetry week is
    -- dropped before any tier/trend counting.
    SELECT * FROM copilot_telemetry  -- (raw, for cutoff only)
    WHERE (date_trunc('week', event_day) + INTERVAL '6 days')::date
          <= (SELECT MAX(event_day)::date FROM copilot_telemetry)
),
user_days AS (
    SELECT
        user_id,
        COUNT(DISTINCT event_day) AS days_active
    FROM telemetry
    GROUP BY user_id
),
tiers AS (
    SELECT
        CASE
            WHEN days_active >= 30 THEN 'heavy'
            WHEN days_active >= 10 THEN 'medium'
            ELSE 'light'
        END AS tier,
        COUNT(*) AS user_count
    FROM user_days
    GROUP BY 1
),
recent_daily AS (
    -- Average daily users over the most recent 4 weeks
    SELECT AVG(daily_users) AS avg_daily_users
    FROM (
        SELECT event_day, COUNT(DISTINCT user_id) AS daily_users
        FROM telemetry
        WHERE event_day >= (
            SELECT MIN(week_start) FROM (
                SELECT DISTINCT (date_trunc('week', event_day))::date AS week_start
                FROM telemetry
                ORDER BY week_start DESC
                LIMIT 4
            ) sub
        )
        GROUP BY event_day
    ) daily
),
monthly_trend AS (
    -- First and last month unique user counts for trend string
    SELECT
        MIN(CASE WHEN month_rank = 1 THEN monthly_users END) AS first_month_users,
        MIN(CASE WHEN month_rank = month_count THEN monthly_users END) AS last_month_users
    FROM (
        SELECT
            date_trunc('month', event_day)::date AS month,
            COUNT(DISTINCT user_id) AS monthly_users,
            ROW_NUMBER() OVER (ORDER BY date_trunc('month', event_day)::date) AS month_rank,
            COUNT(*) OVER () AS month_count
        FROM telemetry
        GROUP BY date_trunc('month', event_day)::date
    ) m
)
SELECT
    (SELECT COUNT(DISTINCT user_id) FROM telemetry) AS total_copilot_users,
    MAX(CASE WHEN tier = 'heavy'  THEN user_count ELSE 0 END)     AS heavy_users,
    MAX(CASE WHEN tier = 'medium' THEN user_count ELSE 0 END)     AS medium_users,
    MAX(CASE WHEN tier = 'light'  THEN user_count ELSE 0 END)     AS light_users,
    ROUND((SELECT avg_daily_users FROM recent_daily), 1)           AS avg_daily_users_recent,
    (SELECT first_month_users FROM monthly_trend)
        || ' → '
        || (SELECT last_month_users FROM monthly_trend)
        || ' monthly users'                                        AS adoption_trend
FROM tiers;


-- ============================================================================
-- QUERY 7: Copilot-PR Correlation — Weekly Assisted vs Non-Assisted
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_copilot_pr_correlation()
--
-- Requires the NEW format (AuthorUUID-based telemetry) where user_id matches
-- author_uuid in pr_jira_metrics. Correlates Copilot usage with PRs by
-- matching AuthorUUID + week. A ticket is "Copilot-assisted" if any of its
-- PRs were authored by someone with Copilot suggestions (> 0) that same
-- Mon-Sun ISO week.
--
-- Author counting: each group's productivity denominator counts DISTINCT
-- authors across ALL PRs of the group's tickets that week. (An earlier
-- revision of this file also carried first-author-only `LIMIT 1` columns —
-- the defect behind the warehouse's unreproducible ~0.7 assisted
-- productivity. Do not reintroduce them.)
--
-- Empty groups emit NULL productivity/QA — never placeholder values.

CREATE OR REPLACE VIEW v_copilot_pr_correlation_weekly AS
WITH copilot_weekly_by_user AS (
    -- Aggregate copilot telemetry to (user_id, week) level
    SELECT
        user_id,
        (date_trunc('week', event_day) + INTERVAL '6 days')::date AS week_ending,
        SUM(suggestions)  AS suggestions,
        SUM(acceptances)  AS acceptances
    FROM copilot_telemetry
    -- Mirror _load_copilot_df(): partial trailing telemetry week is dropped,
    -- so its suggestions never classify a PR as assisted
    WHERE (date_trunc('week', event_day) + INTERVAL '6 days')::date
          <= (SELECT MAX(event_day)::date FROM copilot_telemetry)
    GROUP BY user_id, (date_trunc('week', event_day) + INTERVAL '6 days')::date
),
pr_with_copilot AS (
    -- Join each PR with its author's copilot activity for that week
    SELECT
        p.jira_ticket,
        p.author_uuid,
        p.pr_end,
        p.qa_churn_lines,
        (date_trunc('week', p.pr_end::date) + INTERVAL '6 days')::date AS week_ending,
        COALESCE(c.suggestions, 0)  AS copilot_suggestions,
        COALESCE(c.acceptances, 0)  AS copilot_acceptances,
        (COALESCE(c.suggestions, 0) > 0) AS copilot_assisted
    FROM v_prs p
    LEFT JOIN copilot_weekly_by_user c
        ON p.author_uuid::text = c.user_id
        AND (date_trunc('week', p.pr_end::date) + INTERVAL '6 days')::date = c.week_ending
),
corr_tickets AS (
    -- Aggregate to ticket level with copilot flags
    SELECT
        jira_ticket,
        MAX(pr_end)::date AS pr_end_date,
        (date_trunc('week', MAX(pr_end)::date) + INTERVAL '6 days')::date AS week_ending,
        (SUM(qa_churn_lines) > 0)  AS has_qa_churn,
        BOOL_OR(copilot_assisted)  AS copilot_assisted,
        SUM(copilot_suggestions)   AS total_suggestions,
        SUM(copilot_acceptances)   AS total_acceptances
    FROM pr_with_copilot
    GROUP BY jira_ticket
),
mature_corr AS (
    SELECT * FROM corr_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
      -- Hide partial trailing week
      AND week_ending <= (SELECT MAX(pr_end)::date FROM pr_jira_metrics)
),
-- Ticket counts and pooled QA rate per group per week
weekly_assisted AS (
    SELECT
        week_ending,
        COUNT(*) AS assisted_tickets,
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) AS assisted_qa_rate
    FROM mature_corr
    WHERE copilot_assisted
    GROUP BY week_ending
),
weekly_non_assisted AS (
    SELECT
        week_ending,
        COUNT(*) AS non_assisted_tickets,
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) AS non_assisted_qa_rate
    FROM mature_corr
    WHERE NOT copilot_assisted
    GROUP BY week_ending
),
-- Distinct authors per week per group, across ALL PRs of the group's tickets
weekly_assisted_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS author_count
    FROM mature_corr t
    JOIN v_prs p ON p.jira_ticket = t.jira_ticket
    WHERE t.copilot_assisted
    GROUP BY t.week_ending
),
weekly_non_assisted_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS author_count
    FROM mature_corr t
    JOIN v_prs p ON p.jira_ticket = t.jira_ticket
    WHERE NOT t.copilot_assisted
    GROUP BY t.week_ending
),
all_mature_weeks AS (
    SELECT DISTINCT week_ending FROM mature_corr
)
SELECT
    w.week_ending,
    COALESCE(a.assisted_tickets, 0)      AS assisted_tickets,
    COALESCE(na.non_assisted_tickets, 0) AS non_assisted_tickets,
    -- Assisted productivity = tickets / (authors × 5); NULL when the group
    -- shipped nothing that week
    CASE WHEN COALESCE(a.assisted_tickets, 0) > 0
         THEN ROUND(a.assisted_tickets::numeric
              / (GREATEST(COALESCE(aa.author_count, 1), 1) * current_setting('app.workdays_per_week')::int), 6)
         ELSE NULL
    END AS assisted_productivity,
    -- Non-assisted productivity
    CASE WHEN COALESCE(na.non_assisted_tickets, 0) > 0
         THEN ROUND(na.non_assisted_tickets::numeric
              / (GREATEST(COALESCE(naa.author_count, 1), 1) * current_setting('app.workdays_per_week')::int), 6)
         ELSE NULL
    END AS non_assisted_productivity,
    ROUND(a.assisted_qa_rate, 6)       AS assisted_qa_rate,
    ROUND(na.non_assisted_qa_rate, 6)  AS non_assisted_qa_rate
FROM all_mature_weeks w
LEFT JOIN weekly_assisted a USING (week_ending)
LEFT JOIN weekly_non_assisted na USING (week_ending)
LEFT JOIN weekly_assisted_authors aa USING (week_ending)
LEFT JOIN weekly_non_assisted_authors naa USING (week_ending)
ORDER BY w.week_ending;


-- ============================================================================
-- QUERY 7b: Copilot-PR Correlation — Overall Summary
-- ============================================================================
-- Mirrors: the summary portion of compute_copilot_pr_correlation()
--
-- Mean-of-weekly productivity for assisted vs non-assisted (each group's
-- mean is taken over the weeks where that group shipped ≥1 ticket), pooled
-- QA churn per group, plus deltas. This is the source for the "Copilot
-- Impact on Productivity" and "Copilot Impact on QA Churn" KPI cards.

CREATE OR REPLACE VIEW v_copilot_pr_correlation_summary AS
WITH copilot_weekly_by_user AS (
    SELECT
        user_id,
        (date_trunc('week', event_day) + INTERVAL '6 days')::date AS week_ending,
        SUM(suggestions) AS suggestions
    FROM copilot_telemetry
    -- Mirror _load_copilot_df(): partial trailing telemetry week is dropped,
    -- so its suggestions never classify a PR as assisted
    WHERE (date_trunc('week', event_day) + INTERVAL '6 days')::date
          <= (SELECT MAX(event_day)::date FROM copilot_telemetry)
    GROUP BY user_id, (date_trunc('week', event_day) + INTERVAL '6 days')::date
),
pr_with_copilot AS (
    SELECT
        p.jira_ticket,
        p.author_uuid,
        p.pr_end,
        p.qa_churn_lines,
        (COALESCE(c.suggestions, 0) > 0) AS copilot_assisted
    FROM v_prs p
    LEFT JOIN copilot_weekly_by_user c
        ON p.author_uuid::text = c.user_id
        AND (date_trunc('week', p.pr_end::date) + INTERVAL '6 days')::date = c.week_ending
),
corr_tickets AS (
    SELECT
        jira_ticket,
        MAX(pr_end)::date AS pr_end_date,
        (date_trunc('week', MAX(pr_end)::date) + INTERVAL '6 days')::date AS week_ending,
        (SUM(qa_churn_lines) > 0) AS has_qa_churn,
        BOOL_OR(copilot_assisted) AS copilot_assisted
    FROM pr_with_copilot
    GROUP BY jira_ticket
),
mature_corr AS (
    SELECT * FROM corr_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
      -- Hide partial trailing week
      AND week_ending <= (SELECT MAX(pr_end)::date FROM pr_jira_metrics)
),
-- Weekly productivity per group (distinct authors across ALL PRs of the
-- group's tickets — same rule as Query 7)
weekly_stats AS (
    SELECT
        t.week_ending,
        t.copilot_assisted,
        COUNT(DISTINCT t.jira_ticket) AS tickets,
        COUNT(DISTINCT p.author_uuid) AS authors
    FROM mature_corr t
    JOIN v_prs p ON p.jira_ticket = t.jira_ticket
    GROUP BY t.week_ending, t.copilot_assisted
),
avg_prod AS (
    SELECT
        copilot_assisted,
        AVG(tickets::numeric / (GREATEST(authors, 1) * current_setting('app.workdays_per_week')::int))
            AS mean_productivity
    FROM weekly_stats
    GROUP BY copilot_assisted
),
overall_qa AS (
    SELECT
        copilot_assisted,
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) AS qa_churn
    FROM mature_corr
    GROUP BY copilot_assisted
)
SELECT
    (SELECT COUNT(*) FROM mature_corr)                                    AS total_tickets,
    (SELECT COUNT(*) FROM mature_corr WHERE copilot_assisted)             AS assisted_tickets,
    (SELECT COUNT(*) FROM mature_corr WHERE NOT copilot_assisted)         AS non_assisted_tickets,
    ROUND(a_prod.mean_productivity, 4)                                    AS assisted_productivity,
    ROUND(na_prod.mean_productivity, 4)                                   AS non_assisted_productivity,
    -- Productivity lift: (assisted - non_assisted) / non_assisted × 100
    ROUND(
        (a_prod.mean_productivity - na_prod.mean_productivity)
        / NULLIF(na_prod.mean_productivity, 0) * 100, 1
    )                                                                     AS productivity_lift_pct,
    ROUND(a_qa.qa_churn, 4)                                               AS assisted_qa_churn,
    ROUND(na_qa.qa_churn, 4)                                              AS non_assisted_qa_churn,
    -- QA churn delta: (assisted - non_assisted) / non_assisted × 100
    ROUND(
        (a_qa.qa_churn - na_qa.qa_churn)
        / NULLIF(na_qa.qa_churn, 0) * 100, 1
    )                                                                     AS qa_churn_delta_pct
FROM
    (SELECT mean_productivity FROM avg_prod WHERE copilot_assisted)       a_prod,
    (SELECT mean_productivity FROM avg_prod WHERE NOT copilot_assisted)   na_prod,
    (SELECT qa_churn FROM overall_qa WHERE copilot_assisted)              a_qa,
    (SELECT qa_churn FROM overall_qa WHERE NOT copilot_assisted)          na_qa;


-- ============================================================================
-- QUERY 8: Copilot Intensity Buckets
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_copilot_pr_correlation() intensity portion
--
-- Classifies MATURE-PERIOD tickets (only — never transition/baseline) by
-- total Copilot suggestions received:
--   low:    1–10 suggestions
--   medium: 11–50 suggestions
--   high:   51+ suggestions
-- Tickets with zero suggestions are excluded (they are the "non-assisted"
-- group in Query 7, not an intensity tier).
--
-- For each bucket: ticket count, productivity, QA churn rate, avg suggestions.

CREATE OR REPLACE VIEW v_copilot_intensity_buckets AS
WITH copilot_weekly_by_user AS (
    SELECT
        user_id,
        (date_trunc('week', event_day) + INTERVAL '6 days')::date AS week_ending,
        SUM(suggestions) AS suggestions
    FROM copilot_telemetry
    -- Mirror _load_copilot_df(): partial trailing telemetry week is dropped,
    -- so its suggestions never classify a PR as assisted
    WHERE (date_trunc('week', event_day) + INTERVAL '6 days')::date
          <= (SELECT MAX(event_day)::date FROM copilot_telemetry)
    GROUP BY user_id, (date_trunc('week', event_day) + INTERVAL '6 days')::date
),
pr_with_copilot AS (
    SELECT
        p.jira_ticket,
        p.author_uuid,
        p.pr_end,
        p.qa_churn_lines,
        COALESCE(c.suggestions, 0) AS copilot_suggestions
    FROM v_prs p
    LEFT JOIN copilot_weekly_by_user c
        ON p.author_uuid::text = c.user_id
        AND (date_trunc('week', p.pr_end::date) + INTERVAL '6 days')::date = c.week_ending
),
corr_tickets AS (
    SELECT
        jira_ticket,
        MAX(pr_end)::date AS pr_end_date,
        (date_trunc('week', MAX(pr_end)::date) + INTERVAL '6 days')::date AS week_ending,
        (SUM(qa_churn_lines) > 0) AS has_qa_churn,
        SUM(copilot_suggestions)  AS total_suggestions
    FROM pr_with_copilot
    GROUP BY jira_ticket
),
mature_intensity AS (
    SELECT
        *,
        CASE
            WHEN total_suggestions <= 10 THEN 'low'
            WHEN total_suggestions <= 50 THEN 'medium'
            ELSE 'high'
        END AS intensity_bucket
    FROM corr_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
      -- Hide partial trailing week
      AND week_ending <= (SELECT MAX(pr_end)::date FROM pr_jira_metrics)
      -- Mirror refresh_copilot.py: only low/medium/high buckets are reported;
      -- tickets with zero Copilot suggestions are excluded.
      AND total_suggestions > 0
),
-- Ticket-level aggregates per bucket (one row per ticket — must NOT be
-- joined to PR rows, or multi-PR tickets inflate counts and averages)
bucket_tickets AS (
    SELECT
        intensity_bucket,
        COUNT(*)                                      AS ticket_count,
        COUNT(DISTINCT week_ending)                   AS weeks,
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END) AS qa_tickets,
        AVG(total_suggestions)                        AS avg_suggestions
    FROM mature_intensity
    GROUP BY intensity_bucket
),
-- Distinct authors per bucket, across ALL PRs of the bucket's tickets
bucket_authors AS (
    SELECT
        mi.intensity_bucket,
        COUNT(DISTINCT p.author_uuid) AS authors
    FROM mature_intensity mi
    JOIN v_prs p ON p.jira_ticket = mi.jira_ticket
    GROUP BY mi.intensity_bucket
),
bucket_context AS (
    SELECT bt.intensity_bucket, bt.ticket_count, bt.weeks, bt.qa_tickets,
           bt.avg_suggestions, ba.authors
    FROM bucket_tickets bt
    JOIN bucket_authors ba USING (intensity_bucket)
)
SELECT
    intensity_bucket,
    ticket_count,
    -- Productivity = tickets / (authors × weeks × 5)
    ROUND(
        ticket_count::numeric
        / NULLIF(GREATEST(authors, 1) * GREATEST(weeks, 1) * current_setting('app.workdays_per_week')::int, 0)
    , 4)                                                  AS productivity,
    ROUND(qa_tickets::numeric / NULLIF(ticket_count, 0), 4) AS qa_churn,
    ROUND(avg_suggestions::numeric, 1)                    AS avg_suggestions
FROM bucket_context
ORDER BY
    CASE intensity_bucket
        WHEN 'low'    THEN 1
        WHEN 'medium' THEN 2
        WHEN 'high'   THEN 3
    END;
