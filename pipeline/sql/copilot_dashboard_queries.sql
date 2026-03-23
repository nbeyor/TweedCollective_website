-- ============================================================================
-- eCS SDLC Copilot Dashboard — PostgreSQL Analytics Queries
--
-- Converted from: pipeline/refresh_copilot.py
-- Source: Team-wide productivity vs pre-AI baseline with Copilot adoption overlay
--
-- Three-phase model:
--   Phase 1 (Baseline):   pre-Oct 2025 — no AI tools
--   Phase 2 (Transition): Oct 1, 2025 – Feb 6, 2026 — AI rollout, uneven adoption
--   Phase 3 (Mature):     Feb 7, 2026+ — 80%+ weekly Copilot adoption
--
-- Usage: Run each numbered query independently. The VIEW (v_tickets) must be
--        created first as it is referenced by queries 1–4 and 7–8.
-- ============================================================================


-- ── CONFIGURATION ───────────────────────────────────────────────────────────
-- Set these as session-level variables. Referenced in queries via current_setting().
SET app.baseline_end   = '2025-10-01';   -- End of pre-AI baseline period
SET app.mature_start   = '2026-02-07';   -- Start of 80%+ Copilot adoption
SET app.workdays_per_week     = '5';
SET app.rolling_window        = '4';
SET app.min_tickets_threshold = '5';


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
--   LineCountAdded→loc_added.
CREATE TABLE IF NOT EXISTS copilot_telemetry (
    event_day       DATE    NOT NULL,
    user_id         TEXT    NOT NULL,     -- AuthorUUID (new) or GithubUserId (legacy)
    suggestions     INTEGER NOT NULL DEFAULT 0,
    acceptances     INTEGER NOT NULL DEFAULT 0,
    used_agent      BOOLEAN DEFAULT NULL, -- may be absent in new format
    used_chat       BOOLEAN DEFAULT NULL, -- may be absent in new format
    loc_added       INTEGER NOT NULL DEFAULT 0
);


-- ============================================================================
-- VIEW: v_tickets — Aggregate PRs to Jira ticket level
-- ============================================================================
-- Mirrors: refresh_copilot.py → aggregate_to_tickets()
--
-- Groups PRs by jira_ticket. Computes:
--   - pr_count, max_files, total_lines, total_churn_lines, total_qa_churn_lines
--   - pr_end_date (latest PR end across all PRs for the ticket)
--   - week_ending (Saturday-ending week of pr_end_date)
--   - has_qa_churn (boolean: any QA churn lines > 0)
--   - size_bucket ('0-300' or '301+')
--   - complexity_bucket ('1-10' or '11+')
--
-- Saturday-ending week logic:
--   pandas: dt.to_period('W-SAT').dt.end_time.dt.normalize()
--   Postgres: Add 2 days so Saturday maps to Monday, truncate to ISO week,
--             then add 5 days to land back on Saturday.

CREATE OR REPLACE VIEW v_tickets AS
SELECT
    jira_ticket,
    COUNT(*)                              AS pr_count,
    MAX(pr_end)::date                     AS pr_end_date,
    -- Saturday-ending week: shift +2 to align Sat→Mon, truncate, shift +5 back
    (date_trunc('week', MAX(pr_end)::date + 2) + INTERVAL '5 days')::date
                                          AS week_ending,
    MAX(pr_files)                         AS max_files,
    SUM(pr_lines)                         AS total_lines,
    SUM(churn_lines)                      AS total_churn_lines,
    SUM(qa_churn_lines)                   AS total_qa_churn_lines,
    (SUM(qa_churn_lines) > 0)             AS has_qa_churn,
    -- Size bucket: total lines across all PRs for ticket
    CASE
        WHEN SUM(pr_lines) <= 300 THEN '0-300'
        ELSE '301+'
    END                                   AS size_bucket,
    -- Complexity bucket: max files touched by any single PR
    CASE
        WHEN MAX(pr_files) <= 10 THEN '1-10'
        ELSE '11+'
    END                                   AS complexity_bucket
FROM pr_jira_metrics
GROUP BY jira_ticket;


-- ============================================================================
-- QUERY 1: Weekly Team Metrics
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_weekly_team_metrics()
--
-- Returns one row per week with:
--   - total_tickets, team_authors (unique authors that week)
--   - team_productivity = tickets / (authors × 5 workdays)
--   - team_qa_churn_rate = tickets with QA churn / total tickets
--   - low_confidence flag (< 5 tickets)
--   - phase tag (baseline / transition / mature)
--   - 4-week rolling average of productivity (only over confident weeks, min 2 pts)

WITH weekly_raw AS (
    SELECT
        t.week_ending,
        COUNT(*)                                     AS total_tickets,
        -- Unique authors: count distinct from the PR-level data for tickets in this week
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM pr_jira_metrics p
         WHERE p.jira_ticket IN (SELECT t2.jira_ticket FROM v_tickets t2 WHERE t2.week_ending = t.week_ending)
        )                                            AS team_authors,
        SUM(CASE WHEN t.has_qa_churn THEN 1 ELSE 0 END) AS qa_churn_tickets
    FROM v_tickets t
    GROUP BY t.week_ending
),
weekly_metrics AS (
    SELECT
        week_ending,
        total_tickets,
        GREATEST(team_authors, 1)                    AS team_authors,
        total_tickets::numeric
            / (GREATEST(team_authors, 1) * current_setting('app.workdays_per_week')::int)
                                                     AS team_productivity,
        CASE WHEN total_tickets > 0
             THEN qa_churn_tickets::numeric / total_tickets
             ELSE NULL
        END                                          AS team_qa_churn_rate,
        total_tickets < current_setting('app.min_tickets_threshold')::int
                                                     AS low_confidence,
        CASE
            WHEN week_ending < current_setting('app.baseline_end')::date   THEN 'baseline'
            WHEN week_ending < current_setting('app.mature_start')::date   THEN 'transition'
            ELSE 'mature'
        END                                          AS phase
    FROM weekly_raw
),
-- Rolling averages: 4-week window over confident (non-low-confidence) weeks only.
-- Only emit a rolling value when there are >= 2 data points in the window.
confident_weeks AS (
    SELECT
        week_ending,
        team_productivity,
        team_qa_churn_rate,
        ROW_NUMBER() OVER (ORDER BY week_ending)     AS rn
    FROM weekly_metrics
    WHERE NOT low_confidence
),
rolling AS (
    SELECT
        week_ending,
        CASE
            WHEN COUNT(*) OVER w >= 2 THEN AVG(team_productivity)    OVER w
            ELSE NULL
        END AS team_productivity_rolling,
        CASE
            WHEN COUNT(*) OVER w >= 2 THEN STDDEV(team_productivity) OVER w
            ELSE NULL
        END AS team_productivity_std,
        CASE
            WHEN COUNT(*) OVER w >= 2 THEN AVG(team_qa_churn_rate)   OVER w
            ELSE NULL
        END AS team_qa_churn_rate_rolling
    FROM confident_weeks
    WINDOW w AS (ORDER BY week_ending ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)
)
SELECT
    m.week_ending,
    m.phase,
    m.total_tickets,
    m.team_authors,
    ROUND(m.team_productivity, 6)                    AS team_productivity,
    ROUND(m.team_qa_churn_rate, 6)                   AS team_qa_churn_rate,
    m.low_confidence,
    ROUND(r.team_productivity_rolling, 6)            AS team_productivity_rolling,
    ROUND(r.team_productivity_std, 6)                AS team_productivity_std,
    ROUND(r.team_qa_churn_rate_rolling, 6)           AS team_qa_churn_rate_rolling
FROM weekly_metrics m
LEFT JOIN rolling r USING (week_ending)
ORDER BY m.week_ending;


-- ============================================================================
-- QUERY 2: Baseline Metrics (pre-Oct 2025)
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_baseline()
--
-- Uses mean-of-weekly productivity (same methodology as team summary)
-- to ensure apples-to-apples comparison with the mature period.

WITH baseline_tickets AS (
    SELECT * FROM v_tickets
    WHERE pr_end_date < current_setting('app.baseline_end')::date
),
baseline_authors AS (
    SELECT COUNT(DISTINCT p.author_uuid) AS author_count
    FROM pr_jira_metrics p
    WHERE p.jira_ticket IN (SELECT jira_ticket FROM baseline_tickets)
),
baseline_weeks AS (
    SELECT COUNT(DISTINCT week_ending) AS week_count
    FROM baseline_tickets
),
-- Per-week productivity for mean-of-weekly calculation
weekly_prod AS (
    SELECT
        t.week_ending,
        COUNT(*)                                    AS total_tickets,
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM pr_jira_metrics p
         WHERE p.jira_ticket IN (SELECT t2.jira_ticket FROM v_tickets t2 WHERE t2.week_ending = t.week_ending)
           AND p.pr_end < current_setting('app.baseline_end')::date
        )                                           AS week_authors,
        SUM(CASE WHEN t.has_qa_churn THEN 1 ELSE 0 END) AS qa_churn_tickets
    FROM baseline_tickets t
    GROUP BY t.week_ending
    HAVING COUNT(*) >= current_setting('app.min_tickets_threshold')::int  -- exclude low-confidence
)
SELECT
    (SELECT COUNT(*) FROM baseline_tickets)                      AS tickets,
    (SELECT author_count FROM baseline_authors)                  AS authors,
    (SELECT week_count FROM baseline_weeks)
        * current_setting('app.workdays_per_week')::int          AS workdays,
    -- Mean-of-weekly productivity (matching Python's methodology)
    ROUND(AVG(
        total_tickets::numeric / (GREATEST(week_authors, 1) * current_setting('app.workdays_per_week')::int)
    ), 4)                                                        AS productivity,
    -- Overall QA churn rate (ticket-level, not weekly mean)
    ROUND(
        (SELECT SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0)
         FROM baseline_tickets), 4
    )                                                            AS qa_churn_rate,
    (SELECT MIN(pr_end_date) FROM baseline_tickets)              AS date_range_start,
    (SELECT MAX(pr_end_date) FROM baseline_tickets)              AS date_range_end
FROM weekly_prod;


-- ============================================================================
-- QUERY 3: Team Summary — Mature period (Feb 7, 2026+) vs baseline
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_team_summary()
--
-- Computes mature-period productivity/QA and percentage delta vs baseline.

WITH baseline_weekly AS (
    -- Baseline: mean-of-weekly productivity for pre-Oct weeks (confident only)
    SELECT
        t.week_ending,
        COUNT(*) AS total_tickets,
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM pr_jira_metrics p
         WHERE p.jira_ticket IN (SELECT t2.jira_ticket FROM v_tickets t2 WHERE t2.week_ending = t.week_ending)
        ) AS week_authors
    FROM v_tickets t
    WHERE t.pr_end_date < current_setting('app.baseline_end')::date
    GROUP BY t.week_ending
    HAVING COUNT(*) >= current_setting('app.min_tickets_threshold')::int
),
baseline_agg AS (
    SELECT
        AVG(total_tickets::numeric / (GREATEST(week_authors, 1) * current_setting('app.workdays_per_week')::int))
            AS baseline_productivity,
        (SELECT SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0)
         FROM v_tickets
         WHERE pr_end_date < current_setting('app.baseline_end')::date)
            AS baseline_qa_churn_rate
    FROM baseline_weekly
),
mature_tickets AS (
    SELECT * FROM v_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
),
mature_weekly AS (
    SELECT
        t.week_ending,
        COUNT(*) AS total_tickets,
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM pr_jira_metrics p
         WHERE p.jira_ticket IN (SELECT t2.jira_ticket FROM v_tickets t2 WHERE t2.week_ending = t.week_ending)
        ) AS week_authors
    FROM mature_tickets t
    GROUP BY t.week_ending
    HAVING COUNT(*) >= current_setting('app.min_tickets_threshold')::int
),
mature_agg AS (
    SELECT
        AVG(total_tickets::numeric / (GREATEST(week_authors, 1) * current_setting('app.workdays_per_week')::int))
            AS team_productivity
    FROM mature_weekly
),
mature_qa AS (
    SELECT
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric
            / NULLIF(COUNT(*), 0)   AS team_qa_churn
    FROM mature_tickets
),
mature_authors AS (
    SELECT COUNT(DISTINCT p.author_uuid) AS team_authors
    FROM pr_jira_metrics p
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
-- QUERY 4: Size / Complexity Heatmap (2×2)
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_size_complexity()
--
-- Compares mature (post-AI) vs baseline (pre-AI) for each bucket:
--   Size:       0-300, 301+
--   Complexity: 1-10, 11+
-- Productivity = ticket_count / (unique_authors × weeks × 5)

WITH post_tickets AS (
    SELECT * FROM v_tickets WHERE pr_end_date >= current_setting('app.mature_start')::date
),
pre_tickets AS (
    SELECT * FROM v_tickets WHERE pr_end_date < current_setting('app.baseline_end')::date
),
post_context AS (
    SELECT
        COUNT(DISTINCT week_ending) AS weeks,
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM pr_jira_metrics p
         WHERE p.jira_ticket IN (SELECT jira_ticket FROM post_tickets)
        ) AS authors
    FROM post_tickets
),
pre_context AS (
    SELECT
        COUNT(DISTINCT week_ending) AS weeks,
        (SELECT COUNT(DISTINCT p.author_uuid)
         FROM pr_jira_metrics p
         WHERE p.jira_ticket IN (SELECT jira_ticket FROM pre_tickets)
        ) AS authors
    FROM pre_tickets
),
-- Cross-join the two bucket dimensions to ensure all 4 cells appear
bucket_grid AS (
    SELECT s.size_bucket, c.complexity_bucket
    FROM (VALUES ('0-300'), ('301+'))         AS s(size_bucket)
    CROSS JOIN (VALUES ('1-10'), ('11+'))     AS c(complexity_bucket)
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
)
SELECT
    g.size_bucket || ' / ' || g.complexity_bucket                 AS label,
    g.size_bucket,
    g.complexity_bucket,
    COALESCE(po.ticket_count, 0)                                  AS post_tickets,
    COALESCE(pr.ticket_count, 0)                                  AS baseline_tickets,
    -- Productivity = tickets / (authors × weeks × 5)
    ROUND(
        COALESCE(po.ticket_count, 0)::numeric
        / NULLIF(GREATEST((SELECT authors FROM post_context), 1)
                 * GREATEST((SELECT weeks FROM post_context), 1)
                 * current_setting('app.workdays_per_week')::int, 0)
    , 6)                                                          AS post_productivity,
    ROUND(
        COALESCE(pr.ticket_count, 0)::numeric
        / NULLIF(GREATEST((SELECT authors FROM pre_context), 1)
                 * GREATEST((SELECT weeks FROM pre_context), 1)
                 * current_setting('app.workdays_per_week')::int, 0)
    , 6)                                                          AS baseline_productivity,
    ROUND(COALESCE(po.qa_churn, 0), 6)                            AS post_qa_churn,
    ROUND(COALESCE(pr.qa_churn, 0), 6)                            AS baseline_qa_churn
FROM bucket_grid g
LEFT JOIN post_agg po USING (size_bucket, complexity_bucket)
LEFT JOIN pre_agg  pr USING (size_bucket, complexity_bucket)
WHERE COALESCE(po.ticket_count, 0) + COALESCE(pr.ticket_count, 0) > 0
ORDER BY g.size_bucket, g.complexity_bucket;


-- ============================================================================
-- QUERY 5: Copilot Adoption — Weekly
-- ============================================================================
-- Mirrors: refresh_copilot.py → compute_copilot_adoption() (weekly portion)
--
-- Weekly active users, code generation/acceptance counts, agent/chat usage,
-- and lines of code added from GitHub Copilot telemetry.

WITH total_users AS (
    SELECT COUNT(DISTINCT user_id) AS total FROM copilot_telemetry
),
weekly_copilot AS (
    SELECT
        -- Saturday-ending week (same bucketing as PR data)
        (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date  AS week_ending,
        COUNT(DISTINCT user_id)                                        AS active_users,
        SUM(suggestions)                                               AS total_code_gen,
        SUM(acceptances)                                               AS total_code_accept,
        -- Users who used agent at least once this week (NULL-safe for new format)
        COUNT(DISTINCT CASE WHEN used_agent THEN user_id END)          AS agent_users,
        -- Users who used chat at least once this week (NULL-safe for new format)
        COUNT(DISTINCT CASE WHEN used_chat  THEN user_id END)          AS chat_users,
        SUM(loc_added)                                                 AS loc_added
    FROM copilot_telemetry
    GROUP BY (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date
)
SELECT
    w.week_ending,
    w.active_users,
    ROUND(w.active_users::numeric / NULLIF(tu.total, 0) * 100, 1) AS copilot_pct,
    w.total_code_gen,
    w.total_code_accept,
    w.agent_users,
    w.chat_users,
    w.loc_added
FROM weekly_copilot w
CROSS JOIN total_users tu
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

WITH user_days AS (
    SELECT
        user_id,
        COUNT(DISTINCT event_day) AS days_active
    FROM copilot_telemetry
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
        FROM copilot_telemetry
        WHERE event_day >= (
            SELECT MIN(week_start) FROM (
                SELECT DISTINCT (date_trunc('week', event_day + 2))::date AS week_start
                FROM copilot_telemetry
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
            ROW_NUMBER() OVER (ORDER BY date_trunc('month', event_day)) AS month_rank,
            COUNT(*) OVER () AS month_count
        FROM copilot_telemetry
        GROUP BY date_trunc('month', event_day)::date
    ) m
)
SELECT
    (SELECT COUNT(DISTINCT user_id) FROM copilot_telemetry) AS total_copilot_users,
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
-- PRs were authored by someone with Copilot suggestions that same week.
--
-- Returns:
--   Part A: Weekly comparison (assisted vs non-assisted productivity & QA)
--   Part B: Overall mature-period summary with productivity lift & QA delta

WITH copilot_weekly_by_user AS (
    -- Aggregate copilot telemetry to (user_id, week) level
    SELECT
        user_id,
        (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date AS week_ending,
        SUM(suggestions)  AS suggestions,
        SUM(acceptances)  AS acceptances
    FROM copilot_telemetry
    GROUP BY user_id, (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date
),
pr_with_copilot AS (
    -- Join each PR with its author's copilot activity for that week
    SELECT
        p.jira_ticket,
        p.author_uuid,
        p.pr_end,
        p.pr_files,
        p.pr_lines,
        p.qa_churn_lines,
        (date_trunc('week', p.pr_end::date + 2) + INTERVAL '5 days')::date AS week_ending,
        COALESCE(c.suggestions, 0)  AS copilot_suggestions,
        COALESCE(c.acceptances, 0)  AS copilot_acceptances,
        (COALESCE(c.suggestions, 0) > 0) AS copilot_assisted
    FROM pr_jira_metrics p
    LEFT JOIN copilot_weekly_by_user c
        ON p.author_uuid::text = c.user_id
        AND (date_trunc('week', p.pr_end::date + 2) + INTERVAL '5 days')::date = c.week_ending
),
corr_tickets AS (
    -- Aggregate to ticket level with copilot flags
    SELECT
        jira_ticket,
        MAX(pr_end)::date AS pr_end_date,
        (date_trunc('week', MAX(pr_end)::date + 2) + INTERVAL '5 days')::date AS week_ending,
        SUM(pr_lines)              AS total_lines,
        MAX(pr_files)              AS max_files,
        SUM(qa_churn_lines)        AS total_qa_churn_lines,
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
),
-- Part A: Weekly comparison
weekly_assisted AS (
    SELECT
        week_ending,
        COUNT(*) AS assisted_tickets,
        COUNT(DISTINCT (SELECT p.author_uuid FROM pr_jira_metrics p WHERE p.jira_ticket = t.jira_ticket LIMIT 1))
            AS assisted_authors,
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) AS assisted_qa_rate
    FROM mature_corr t
    WHERE copilot_assisted
    GROUP BY week_ending
),
weekly_non_assisted AS (
    SELECT
        week_ending,
        COUNT(*) AS non_assisted_tickets,
        COUNT(DISTINCT (SELECT p.author_uuid FROM pr_jira_metrics p WHERE p.jira_ticket = t.jira_ticket LIMIT 1))
            AS non_assisted_authors,
        SUM(CASE WHEN has_qa_churn THEN 1 ELSE 0 END)::numeric / NULLIF(COUNT(*), 0) AS non_assisted_qa_rate
    FROM mature_corr t
    WHERE NOT copilot_assisted
    GROUP BY week_ending
),
-- Get unique authors per week per group more accurately
weekly_assisted_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS author_count
    FROM mature_corr t
    JOIN pr_jira_metrics p ON p.jira_ticket = t.jira_ticket
    WHERE t.copilot_assisted
    GROUP BY t.week_ending
),
weekly_non_assisted_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS author_count
    FROM mature_corr t
    JOIN pr_jira_metrics p ON p.jira_ticket = t.jira_ticket
    WHERE NOT t.copilot_assisted
    GROUP BY t.week_ending
),
all_mature_weeks AS (
    SELECT DISTINCT week_ending FROM mature_corr
)
SELECT
    w.week_ending,
    COALESCE(a.assisted_tickets, 0)    AS assisted_tickets,
    COALESCE(na.non_assisted_tickets, 0) AS non_assisted_tickets,
    -- Assisted productivity = tickets / (authors × 5)
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
-- Mean-of-weekly productivity for assisted vs non-assisted, plus deltas.

WITH copilot_weekly_by_user AS (
    SELECT
        user_id,
        (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date AS week_ending,
        SUM(suggestions) AS suggestions
    FROM copilot_telemetry
    GROUP BY user_id, (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date
),
pr_with_copilot AS (
    SELECT
        p.jira_ticket,
        p.author_uuid,
        p.pr_end,
        p.qa_churn_lines,
        (COALESCE(c.suggestions, 0) > 0) AS copilot_assisted
    FROM pr_jira_metrics p
    LEFT JOIN copilot_weekly_by_user c
        ON p.author_uuid::text = c.user_id
        AND (date_trunc('week', p.pr_end::date + 2) + INTERVAL '5 days')::date = c.week_ending
),
corr_tickets AS (
    SELECT
        jira_ticket,
        MAX(pr_end)::date AS pr_end_date,
        (date_trunc('week', MAX(pr_end)::date + 2) + INTERVAL '5 days')::date AS week_ending,
        (SUM(qa_churn_lines) > 0) AS has_qa_churn,
        BOOL_OR(copilot_assisted) AS copilot_assisted
    FROM pr_with_copilot
    GROUP BY jira_ticket
),
mature_corr AS (
    SELECT * FROM corr_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
),
-- Weekly productivity per group
weekly_stats AS (
    SELECT
        t.week_ending,
        t.copilot_assisted,
        COUNT(*) AS tickets,
        COUNT(DISTINCT p.author_uuid) AS authors,
        SUM(CASE WHEN t.has_qa_churn THEN 1 ELSE 0 END) AS qa_tickets
    FROM mature_corr t
    JOIN pr_jira_metrics p ON p.jira_ticket = t.jira_ticket
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
-- Classifies mature-period tickets by total Copilot suggestions received:
--   none:   0 suggestions
--   low:    1–10 suggestions
--   medium: 11–50 suggestions
--   high:   51+ suggestions
--
-- For each bucket: ticket count, productivity, QA churn rate, avg suggestions.

WITH copilot_weekly_by_user AS (
    SELECT
        user_id,
        (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date AS week_ending,
        SUM(suggestions) AS suggestions,
        SUM(acceptances) AS acceptances
    FROM copilot_telemetry
    GROUP BY user_id, (date_trunc('week', event_day + 2) + INTERVAL '5 days')::date
),
pr_with_copilot AS (
    SELECT
        p.jira_ticket,
        p.author_uuid,
        p.pr_end,
        p.pr_files,
        p.pr_lines,
        p.qa_churn_lines,
        COALESCE(c.suggestions, 0) AS copilot_suggestions
    FROM pr_jira_metrics p
    LEFT JOIN copilot_weekly_by_user c
        ON p.author_uuid::text = c.user_id
        AND (date_trunc('week', p.pr_end::date + 2) + INTERVAL '5 days')::date = c.week_ending
),
corr_tickets AS (
    SELECT
        jira_ticket,
        MAX(pr_end)::date AS pr_end_date,
        (date_trunc('week', MAX(pr_end)::date + 2) + INTERVAL '5 days')::date AS week_ending,
        (SUM(qa_churn_lines) > 0) AS has_qa_churn,
        SUM(copilot_suggestions)  AS total_suggestions
    FROM pr_with_copilot
    GROUP BY jira_ticket
),
mature_intensity AS (
    SELECT
        *,
        CASE
            WHEN total_suggestions = 0  THEN 'none'
            WHEN total_suggestions <= 10 THEN 'low'
            WHEN total_suggestions <= 50 THEN 'medium'
            ELSE 'high'
        END AS intensity_bucket
    FROM corr_tickets
    WHERE pr_end_date >= current_setting('app.mature_start')::date
),
-- Per-bucket: authors and weeks for FTE-day normalization
bucket_context AS (
    SELECT
        mi.intensity_bucket,
        COUNT(*)                         AS ticket_count,
        COUNT(DISTINCT mi.week_ending)   AS weeks,
        COUNT(DISTINCT p.author_uuid)    AS authors,
        SUM(CASE WHEN mi.has_qa_churn THEN 1 ELSE 0 END) AS qa_tickets,
        AVG(mi.total_suggestions)        AS avg_suggestions
    FROM mature_intensity mi
    JOIN pr_jira_metrics p ON p.jira_ticket = mi.jira_ticket
    GROUP BY mi.intensity_bucket
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
        WHEN 'none'   THEN 1
        WHEN 'low'    THEN 2
        WHEN 'medium' THEN 3
        WHEN 'high'   THEN 4
    END;
