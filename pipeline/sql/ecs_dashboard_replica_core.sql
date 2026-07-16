-- ============================================================================
-- eCS SDLC AI KPI Dashboard — Core Replica Views (T-SQL)
--
-- Purpose: Stand up the warehouse layer needed to drive a replica of
--          eCS_SDLC_AI_KPI_v2.pbix in SQL Server / Azure SQL / Fabric
--          Warehouse + Power BI.
--
-- Scope:   CORE metrics only — team productivity, QA churn, baseline
--          comparison, and basic Copilot adoption. The four newer analytical
--          views that also exist in the original warehouse
--          (v_copilot_assisted_summary, v_copilot_assisted_weekly,
--          v_copilot_intensity, v_size_complexity) are intentionally
--          NOT included — see the accompanying README.
--
-- Binding: View and column names match the original pbix imports exactly, so
--          the report's Power Query steps only need the Source server/database
--          swapped:
--            dbo.v_tickets
--            dbo.v_weekly_team_metrics
--            dbo.v_baseline_metrics
--            dbo.v_team_summary
--            dbo.v_copilot_weekly_adoption
--            dbo.v_copilot_user_tiers
--
-- Conventions (must hold everywhere):
--   - Week boundary: Sun 00:00 → Sat 23:59:59, labeled by the SUNDAY that
--     ends the bucket exclusively — i.e. week_ending is the next Sunday
--     STRICTLY AFTER the date (a Sunday date rolls into the FOLLOWING week).
--     Verified against every ticket in the original pbix data; this differs
--     from a pure ISO Mon-Sun week only for Sunday dates. Computed from the
--     fixed Sunday anchor 1899-12-31, so results do not depend on
--     SET DATEFIRST / server locale:
--       week_ending = DATEADD(DAY, 7 - (DATEDIFF(DAY,'18991231',d) % 7), d)
--   - Partial trailing week (week_ending > max observed pr_end / event_day)
--     is hidden entirely from weekly outputs.
--   - Rolling averages: 4-week calendar-anchored window (week_ending - 21
--     days .. week_ending). Low-confidence weeks (< 5 tickets) are dropped
--     from the window; >= 2 remaining points required, else NULL.
--   - Productivity = tickets / (unique authors x 5 workdays). Period-level
--     productivity is MEAN-OF-WEEKLY over confident weeks (never pooled
--     SUM/SUM).
--   - QA churn rate = tickets with any qa_churn_lines > 0 / total tickets.
--     Period-level QA churn is POOLED over all tickets (intentionally
--     different from productivity — see README).
--   - month_start = first day of the month containing (week_ending - 3
--     days). Rule derived empirically; verified against every weekly row
--     of the original pbix data, including all month-boundary weeks.
--   - Boolean-ish flags (has_qa_churn, low_confidence) are emitted as
--     INT 0/1 — that is how the pbix model imports them.
--   - Null-key source rows (NULL jira_ticket, author_uuid, pr_end, user_id,
--     event_day) must be dropped by the loader; NOT NULL constraints below
--     are the safety net.
--
-- Run order: top to bottom. Requires CREATE OR ALTER (SQL Server 2016 SP1+,
-- Azure SQL, Fabric Warehouse).
-- ============================================================================


-- ============================================================================
-- CONFIGURATION
-- ============================================================================
-- Single-row config table replaces the session variables used in the
-- PostgreSQL reference implementation.

IF OBJECT_ID('dbo.dashboard_config', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.dashboard_config (
        baseline_end          DATE NOT NULL,  -- end of pre-AI baseline (exclusive)
        mature_start          DATE NOT NULL,  -- start of 80%+ adoption period
        workdays_per_week     INT  NOT NULL,
        min_tickets_threshold INT  NOT NULL,  -- below this a week is low-confidence
        rolling_window_days   INT  NOT NULL   -- 21 = 4 Sunday-ending weeks
    );
END;

DELETE FROM dbo.dashboard_config;
INSERT INTO dbo.dashboard_config
    (baseline_end, mature_start, workdays_per_week, min_tickets_threshold, rolling_window_days)
VALUES
    ('2025-10-01', '2026-02-07', 5, 5, 21);


-- ============================================================================
-- BASE TABLES
-- ============================================================================

-- One row per pull request, joined with Jira ticket data.
-- Maps to the "Current dashboard data" / "Pull MM_DD_YY" export sheet.
IF OBJECT_ID('dbo.pr_jira_metrics', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.pr_jira_metrics (
        jira_ticket              VARCHAR(64)  NOT NULL,
        title                    VARCHAR(512) NULL,
        author_uuid              VARCHAR(64)  NOT NULL,
        first_activity           DATE         NULL,
        first_ready_for_qa_date  DATE         NULL,
        pr_start                 DATE         NULL,
        pr_end                   DATE         NOT NULL,
        -- Loader must supply 0 (not NULL) for missing counts; DEFAULT
        -- constraints are omitted for Fabric Warehouse compatibility.
        pr_files                 INT          NOT NULL,
        pr_lines                 INT          NOT NULL,
        pr_ai                    INT          NOT NULL,
        churn_lines              INT          NOT NULL,
        qa_churn_lines           INT          NOT NULL
    );
END;

-- Copilot / AI telemetry — one row per user per day.
-- Legacy format:  GithubUserId -> user_id, CodeGenerationActivityCount -> suggestions,
--                 CodeAcceptanceActivityCount -> acceptances, LocAddedSum -> loc_added.
-- New format:     AuthorUUID -> user_id, suggestionCount -> suggestions,
--                 acceptedSuggestionCount -> acceptances, LineCountAdded -> loc_added
--                 (used_agent / used_chat may be absent -> leave NULL).
IF OBJECT_ID('dbo.copilot_telemetry', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.copilot_telemetry (
        event_day   DATE        NOT NULL,
        user_id     VARCHAR(64) NOT NULL,
        -- Loader must supply 0 (not NULL) for missing counts.
        suggestions INT         NOT NULL,
        acceptances INT         NOT NULL,
        used_agent  BIT         NULL,
        used_chat   BIT         NULL,
        loc_added   INT         NOT NULL
    );
END;
GO


-- ============================================================================
-- VIEW 1: dbo.v_tickets — PR -> Jira-ticket aggregation
-- ============================================================================
-- One row per ticket. week_ending is derived from the ticket's LATEST pr_end.
-- Size/complexity cuts are the ORIGINAL dashboard cuts (0-300 lines, 1-10
-- files) — keep them so the replica matches the pbix (see README §4).

CREATE OR ALTER VIEW dbo.v_tickets AS
SELECT
    jira_ticket,
    COUNT(*)                                        AS pr_count,
    MAX(pr_end)                                     AS pr_end_date,
    -- Next Sunday strictly after the latest pr_end (Sun-Sat bucket;
    -- a Sunday pr_end rolls into the following week)
    DATEADD(DAY, 7 - (DATEDIFF(DAY, '18991231', MAX(pr_end)) % 7), MAX(pr_end))
                                                    AS week_ending,
    MAX(pr_files)                                   AS max_files,
    SUM(pr_lines)                                   AS total_lines,
    SUM(churn_lines)                                AS total_churn_lines,
    SUM(qa_churn_lines)                             AS total_qa_churn_lines,
    CASE WHEN SUM(qa_churn_lines) > 0 THEN 1 ELSE 0 END
                                                    AS has_qa_churn,
    CASE WHEN SUM(pr_lines) <= 300 THEN '0-300' ELSE '301+' END
                                                    AS size_bucket,
    CASE WHEN MAX(pr_files) <= 10 THEN '1-10' ELSE '11+' END
                                                    AS complexity_bucket
FROM dbo.pr_jira_metrics
GROUP BY jira_ticket;
GO


-- ============================================================================
-- VIEW 2: dbo.v_weekly_team_metrics — one row per fully-observed week
-- ============================================================================
-- Feeds the productivity chart, QA churn chart, cumulative/velocity chart,
-- and (via DAX) the FTE/ROI measures.
--
-- team_authors for a week = distinct authors across ALL PRs belonging to
-- tickets whose week_ending falls in that week (a ticket "lands" in one week;
-- all of its PR authors count there).

CREATE OR ALTER VIEW dbo.v_weekly_team_metrics AS
WITH cfg AS (
    SELECT * FROM dbo.dashboard_config
),
data_cutoff AS (
    SELECT MAX(pr_end) AS cutoff FROM dbo.pr_jira_metrics
),
weekly_raw AS (
    SELECT
        t.week_ending,
        COUNT(*)            AS total_tickets,
        SUM(t.has_qa_churn) AS qa_churn_tickets
    FROM dbo.v_tickets t
    GROUP BY t.week_ending
),
weekly_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS team_authors
    FROM dbo.v_tickets t
    JOIN dbo.pr_jira_metrics p ON p.jira_ticket = t.jira_ticket
    GROUP BY t.week_ending
),
weekly_metrics AS (
    SELECT
        wr.week_ending,
        wr.total_tickets,
        CASE WHEN wa.team_authors > 1 THEN wa.team_authors ELSE 1 END
                                                     AS team_authors,
        CAST(wr.total_tickets AS DECIMAL(18, 9))
            / (CASE WHEN wa.team_authors > 1 THEN wa.team_authors ELSE 1 END
               * cfg.workdays_per_week)              AS team_productivity,
        CASE WHEN wr.total_tickets > 0
             THEN CAST(wr.qa_churn_tickets AS DECIMAL(18, 9)) / wr.total_tickets
        END                                          AS team_qa_churn_rate,
        CASE WHEN wr.total_tickets < cfg.min_tickets_threshold THEN 1 ELSE 0 END
                                                     AS low_confidence,
        CASE WHEN wr.week_ending > dc.cutoff THEN 1 ELSE 0 END
                                                     AS is_partial,
        CASE
            WHEN wr.week_ending < cfg.baseline_end THEN 'baseline'
            WHEN wr.week_ending < cfg.mature_start THEN 'transition'
            ELSE 'mature'
        END                                          AS phase,
        cfg.rolling_window_days
    FROM weekly_raw wr
    JOIN weekly_authors wa ON wa.week_ending = wr.week_ending
    CROSS JOIN cfg
    CROSS JOIN data_cutoff dc
)
SELECT
    m.week_ending,
    m.phase,
    m.total_tickets,
    m.team_authors,
    ROUND(m.team_productivity, 6)                    AS team_productivity,
    ROUND(m.team_qa_churn_rate, 6)                   AS team_qa_churn_rate,
    m.low_confidence,
    -- Calendar-anchored 4-week rolling stats over confident, non-partial
    -- weeks. NULL when fewer than 2 qualifying points in the window.
    (SELECT CASE WHEN COUNT(*) >= 2 THEN ROUND(AVG(w2.team_productivity), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN DATEADD(DAY, -m.rolling_window_days, m.week_ending)
                              AND m.week_ending
       AND w2.low_confidence = 0
       AND w2.is_partial = 0
    )                                                AS team_productivity_rolling,
    (SELECT CASE WHEN COUNT(*) >= 2 THEN ROUND(AVG(w2.team_qa_churn_rate), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN DATEADD(DAY, -m.rolling_window_days, m.week_ending)
                              AND m.week_ending
       AND w2.low_confidence = 0
       AND w2.is_partial = 0
       AND w2.team_qa_churn_rate IS NOT NULL
    )                                                AS team_qa_churn_rate_rolling,
    (SELECT CASE WHEN COUNT(*) >= 2 THEN ROUND(STDEV(w2.team_productivity), 6) END
     FROM weekly_metrics w2
     WHERE w2.week_ending BETWEEN DATEADD(DAY, -m.rolling_window_days, m.week_ending)
                              AND m.week_ending
       AND w2.low_confidence = 0
       AND w2.is_partial = 0
    )                                                AS team_productivity_std,
    -- Month containing (week_ending - 3 days) — empirical pbix rule
    DATEFROMPARTS(YEAR (DATEADD(DAY, -3, m.week_ending)),
                  MONTH(DATEADD(DAY, -3, m.week_ending)), 1)
                                                     AS month_start
FROM weekly_metrics m
WHERE m.is_partial = 0;   -- hide the trailing partial week entirely
GO


-- ============================================================================
-- VIEW 3: dbo.v_baseline_metrics — single-row pre-AI baseline
-- ============================================================================
-- productivity  = MEAN-OF-WEEKLY over confident baseline weeks
-- qa_churn_rate = POOLED across all baseline tickets
-- workdays      = distinct baseline weeks x workdays_per_week

CREATE OR ALTER VIEW dbo.v_baseline_metrics AS
WITH cfg AS (
    SELECT * FROM dbo.dashboard_config
),
baseline_tickets AS (
    SELECT t.*
    FROM dbo.v_tickets t
    CROSS JOIN cfg
    WHERE t.pr_end_date < cfg.baseline_end
),
-- Distinct authors per week, counted over PRs that themselves ended before
-- the baseline cutoff (matches the reference implementation).
weekly_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS week_authors
    FROM dbo.v_tickets t
    JOIN dbo.pr_jira_metrics p ON p.jira_ticket = t.jira_ticket
    CROSS JOIN cfg
    WHERE p.pr_end < cfg.baseline_end
    GROUP BY t.week_ending
),
weekly_prod AS (
    SELECT
        bt.week_ending,
        COUNT(*) AS total_tickets
    FROM baseline_tickets bt
    CROSS JOIN cfg
    GROUP BY bt.week_ending, cfg.min_tickets_threshold
    HAVING COUNT(*) >= cfg.min_tickets_threshold   -- confident weeks only
)
SELECT
    (SELECT COUNT(*) FROM baseline_tickets)                       AS tickets,
    (SELECT COUNT(DISTINCT p.author_uuid)
     FROM dbo.pr_jira_metrics p
     JOIN baseline_tickets bt ON bt.jira_ticket = p.jira_ticket)  AS authors,
    (SELECT COUNT(DISTINCT week_ending) FROM baseline_tickets)
        * (SELECT workdays_per_week FROM cfg)                     AS workdays,
    -- Mean-of-weekly productivity
    (SELECT ROUND(AVG(
        CAST(wp.total_tickets AS DECIMAL(18, 9))
        / (CASE WHEN wa.week_authors > 1 THEN wa.week_authors ELSE 1 END
           * cfg.workdays_per_week)), 4)
     FROM weekly_prod wp
     JOIN weekly_authors wa ON wa.week_ending = wp.week_ending
     CROSS JOIN cfg)                                              AS productivity,
    -- Pooled QA churn rate
    (SELECT ROUND(CAST(SUM(has_qa_churn) AS DECIMAL(18, 9))
                  / NULLIF(COUNT(*), 0), 4)
     FROM baseline_tickets)                                       AS qa_churn_rate,
    (SELECT MIN(pr_end_date) FROM baseline_tickets)               AS date_range_start,
    (SELECT MAX(pr_end_date) FROM baseline_tickets)               AS date_range_end;
GO


-- ============================================================================
-- VIEW 4: dbo.v_team_summary — single-row mature period vs baseline
-- ============================================================================
-- Drives the headline KPI cards: Team Productivity, QA Churn, Total Output,
-- weeks-of-data / team-size labels.
-- (The PostgreSQL reference file names this view v_mature_summary; the pbix
-- binds to v_team_summary — this script uses the pbix name.)

CREATE OR ALTER VIEW dbo.v_team_summary AS
WITH cfg AS (
    SELECT * FROM dbo.dashboard_config
),
data_cutoff AS (
    SELECT MAX(pr_end) AS cutoff FROM dbo.pr_jira_metrics
),
-- All-PR author counts per week (same rule as v_weekly_team_metrics)
weekly_authors AS (
    SELECT
        t.week_ending,
        COUNT(DISTINCT p.author_uuid) AS week_authors
    FROM dbo.v_tickets t
    JOIN dbo.pr_jira_metrics p ON p.jira_ticket = t.jira_ticket
    GROUP BY t.week_ending
),
-- Baseline: mean-of-weekly productivity over confident pre-AI weeks
baseline_weekly AS (
    SELECT
        t.week_ending,
        COUNT(*) AS total_tickets
    FROM dbo.v_tickets t
    CROSS JOIN cfg
    WHERE t.pr_end_date < cfg.baseline_end
    GROUP BY t.week_ending, cfg.min_tickets_threshold
    HAVING COUNT(*) >= cfg.min_tickets_threshold
),
baseline_agg AS (
    SELECT
        (SELECT AVG(CAST(bw.total_tickets AS DECIMAL(18, 9))
                    / (CASE WHEN wa.week_authors > 1 THEN wa.week_authors ELSE 1 END
                       * cfg.workdays_per_week))
         FROM baseline_weekly bw
         JOIN weekly_authors wa ON wa.week_ending = bw.week_ending
         CROSS JOIN cfg)                                   AS baseline_productivity,
        (SELECT CAST(SUM(t.has_qa_churn) AS DECIMAL(18, 9)) / NULLIF(COUNT(*), 0)
         FROM dbo.v_tickets t
         CROSS JOIN cfg
         WHERE t.pr_end_date < cfg.baseline_end)           AS baseline_qa_churn_rate
),
-- Mature period, partial trailing week excluded
mature_tickets AS (
    SELECT t.*
    FROM dbo.v_tickets t
    CROSS JOIN cfg
    CROSS JOIN data_cutoff dc
    WHERE t.pr_end_date >= cfg.mature_start
      AND t.week_ending <= dc.cutoff
),
mature_weekly AS (
    SELECT
        mt.week_ending,
        COUNT(*) AS total_tickets
    FROM mature_tickets mt
    CROSS JOIN cfg
    GROUP BY mt.week_ending, cfg.min_tickets_threshold
    HAVING COUNT(*) >= cfg.min_tickets_threshold
),
mature_agg AS (
    SELECT
        (SELECT AVG(CAST(mw.total_tickets AS DECIMAL(18, 9))
                    / (CASE WHEN wa.week_authors > 1 THEN wa.week_authors ELSE 1 END
                       * cfg.workdays_per_week))
         FROM mature_weekly mw
         JOIN weekly_authors wa ON wa.week_ending = mw.week_ending
         CROSS JOIN cfg)                                   AS team_productivity,
        (SELECT CAST(SUM(has_qa_churn) AS DECIMAL(18, 9)) / NULLIF(COUNT(*), 0)
         FROM mature_tickets)                              AS team_qa_churn
)
SELECT
    (SELECT COUNT(*) FROM mature_tickets)                          AS total_tickets,
    (SELECT COUNT(DISTINCT p.author_uuid)
     FROM dbo.pr_jira_metrics p
     JOIN mature_tickets mt ON mt.jira_ticket = p.jira_ticket)     AS team_authors,
    ROUND(ma.team_productivity, 4)                                 AS team_productivity,
    ROUND((ma.team_productivity - ba.baseline_productivity)
          / NULLIF(ba.baseline_productivity, 0) * 100, 1)          AS productivity_vs_baseline_pct,
    ROUND(ma.team_qa_churn, 4)                                     AS team_qa_churn,
    ROUND((ma.team_qa_churn - ba.baseline_qa_churn_rate)
          / NULLIF(ba.baseline_qa_churn_rate, 0) * 100, 1)         AS qa_vs_baseline_pct,
    (SELECT COUNT(*) FROM mature_weekly)                           AS weeks_of_data
FROM mature_agg ma
CROSS JOIN baseline_agg ba;
GO


-- ============================================================================
-- VIEW 5: dbo.v_copilot_weekly_adoption — weekly Copilot usage
-- ============================================================================
-- copilot_pct denominator = distinct users with ANY activity in the trailing
-- 4 weeks (week_ending - 21 .. week_ending), NOT lifetime users. A lifetime
-- denominator keeps churned seats forever and suppresses the rate.
-- Partial trailing week (past max event_day) is hidden.

CREATE OR ALTER VIEW dbo.v_copilot_weekly_adoption AS
WITH cfg AS (
    SELECT * FROM dbo.dashboard_config
),
user_weeks AS (
    SELECT DISTINCT
        user_id,
        DATEADD(DAY, 7 - (DATEDIFF(DAY, '18991231', event_day) % 7), event_day) AS week_ending
    FROM dbo.copilot_telemetry
),
weekly AS (
    SELECT
        DATEADD(DAY, 7 - (DATEDIFF(DAY, '18991231', event_day) % 7), event_day) AS week_ending,
        COUNT(DISTINCT user_id)                                   AS active_users,
        SUM(suggestions)                                          AS total_code_gen,
        SUM(acceptances)                                          AS total_code_accept,
        COUNT(DISTINCT CASE WHEN used_agent = 1 THEN user_id END) AS agent_users,
        COUNT(DISTINCT CASE WHEN used_chat  = 1 THEN user_id END) AS chat_users,
        SUM(loc_added)                                            AS loc_added
    FROM dbo.copilot_telemetry
    GROUP BY DATEADD(DAY, 7 - (DATEDIFF(DAY, '18991231', event_day) % 7), event_day)
),
data_cutoff AS (
    SELECT MAX(event_day) AS cutoff FROM dbo.copilot_telemetry
)
SELECT
    w.week_ending,
    w.active_users,
    ROUND(
        CAST(w.active_users AS DECIMAL(18, 9)) * 100
        / NULLIF((SELECT COUNT(DISTINCT uw.user_id)
                  FROM user_weeks uw
                  WHERE uw.week_ending BETWEEN DATEADD(DAY, -cfg.rolling_window_days, w.week_ending)
                                           AND w.week_ending), 0), 1
    )                                                             AS copilot_pct,
    w.total_code_gen,
    w.total_code_accept,
    w.agent_users,
    w.chat_users,
    w.loc_added,
    -- Month containing (week_ending - 3 days) — empirical pbix rule
    DATEFROMPARTS(YEAR (DATEADD(DAY, -3, w.week_ending)),
                  MONTH(DATEADD(DAY, -3, w.week_ending)), 1)      AS month_start
FROM weekly w
CROSS JOIN cfg
CROSS JOIN data_cutoff dc
WHERE w.week_ending <= dc.cutoff;   -- hide partial trailing week
GO


-- ============================================================================
-- VIEW 6: dbo.v_copilot_user_tiers — single-row user tiering + trend
-- ============================================================================
-- Tiers on CUMULATIVE lifetime active days: heavy >= 30, medium 10-29,
-- light < 10. avg_daily_users_recent averages daily distinct users over the
-- most recent 4 telemetry weeks. adoption_trend compares first vs last
-- calendar month of distinct users.

CREATE OR ALTER VIEW dbo.v_copilot_user_tiers AS
WITH user_days AS (
    SELECT user_id, COUNT(DISTINCT event_day) AS days_active
    FROM dbo.copilot_telemetry
    GROUP BY user_id
),
tier_counts AS (
    SELECT
        SUM(CASE WHEN days_active >= 30                     THEN 1 ELSE 0 END) AS heavy_users,
        SUM(CASE WHEN days_active >= 10 AND days_active < 30 THEN 1 ELSE 0 END) AS medium_users,
        SUM(CASE WHEN days_active < 10                      THEN 1 ELSE 0 END) AS light_users
    FROM user_days
),
recent_weeks AS (
    -- Sunday start of the 4 most recent telemetry weeks (Sun-Sat buckets)
    SELECT MIN(week_start) AS window_start
    FROM (
        SELECT DISTINCT TOP (4)
            DATEADD(DAY, -(DATEDIFF(DAY, '18991231', event_day) % 7), event_day) AS week_start
        FROM dbo.copilot_telemetry
        ORDER BY week_start DESC
    ) w
),
recent_daily AS (
    SELECT AVG(CAST(daily_users AS DECIMAL(18, 9))) AS avg_daily_users
    FROM (
        SELECT ct.event_day, COUNT(DISTINCT ct.user_id) AS daily_users
        FROM dbo.copilot_telemetry ct
        CROSS JOIN recent_weeks rw
        WHERE ct.event_day >= rw.window_start
        GROUP BY ct.event_day
    ) d
),
monthly AS (
    SELECT
        DATEFROMPARTS(YEAR(event_day), MONTH(event_day), 1) AS month_start,
        COUNT(DISTINCT user_id)                             AS monthly_users
    FROM dbo.copilot_telemetry
    GROUP BY DATEFROMPARTS(YEAR(event_day), MONTH(event_day), 1)
)
SELECT
    (SELECT COUNT(DISTINCT user_id) FROM dbo.copilot_telemetry)   AS total_copilot_users,
    tc.heavy_users,
    tc.medium_users,
    tc.light_users,
    (SELECT ROUND(avg_daily_users, 1) FROM recent_daily)          AS avg_daily_users_recent,
    CONCAT(
        (SELECT TOP (1) monthly_users FROM monthly ORDER BY month_start ASC),
        N' → ',
        (SELECT TOP (1) monthly_users FROM monthly ORDER BY month_start DESC),
        N' monthly users'
    )                                                             AS adoption_trend
FROM tier_counts tc;
GO


-- ============================================================================
-- SMOKE TEST — run after loading data; each should return rows / one row
-- ============================================================================
-- SELECT TOP (5) * FROM dbo.v_tickets ORDER BY week_ending DESC;
-- SELECT * FROM dbo.v_weekly_team_metrics ORDER BY week_ending;
-- SELECT * FROM dbo.v_baseline_metrics;
-- SELECT * FROM dbo.v_team_summary;
-- SELECT * FROM dbo.v_copilot_weekly_adoption ORDER BY week_ending;
-- SELECT * FROM dbo.v_copilot_user_tiers;
