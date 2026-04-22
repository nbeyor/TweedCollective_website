#!/usr/bin/env python3
"""
Copilot Adoption Dashboard - Data Pipeline

Separate dashboard that reframes the eCS SDLC data around team-wide productivity
vs pre-pilot baseline, with Copilot adoption % as the availability metric.

Usage:
    python pipeline/refresh_copilot.py
    python pipeline/refresh_copilot.py --input path/to/pr.xlsx --copilot path/to/copilot.xlsx
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, date
from pathlib import Path

try:
    import pandas as pd
    import numpy as np
    HAS_PANDAS = True
except ImportError:
    pd = None
    np = None
    HAS_PANDAS = False

# ── CONFIG ──────────────────────────────────────────────────────────────────
# Three-phase model:
#   Phase 1: Pre-Oct baseline — no AI tools (Jul 2 – Sep 30)
#   Phase 2: Transition — AI rollout, uneven adoption (Oct 1 – Feb 6)
#   Phase 3: Mature — 80%+ weekly Copilot adoption (Feb 7+)
BASELINE_END = '2025-10-01'       # End of pre-AI baseline period
MATURE_START = '2026-02-07'       # Start of 80%+ Copilot adoption
WORKDAYS_PER_WEEK = 5
ROLLING_WINDOW = 4
MIN_TICKETS_THRESHOLD = 5

# Paths
PIPELINE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = PIPELINE_DIR.parent
EXPORTS_DIR = PIPELINE_DIR / "data" / "exports"
JSON_OUTPUT = PROJECT_ROOT / "public" / "data" / "copilot-dashboard-data.json"
EXCLUDED_USERS_FILE = PIPELINE_DIR / "excluded_users.json"

PULL_PATTERN = re.compile(r"^Pull\s+\d{2}_\d{2}_\d{2}$", re.I)
AI_ALL_PATTERN = re.compile(r"^AI\s+All\s+\d{2}_\d{2}_\d{2}$", re.I)
PROJECT_KEY_PATTERN = re.compile(r"^([A-Za-z][A-Za-z0-9_]+)-\d+")


def find_latest_xlsx() -> Path:
    xlsx_files = sorted(EXPORTS_DIR.glob("*.xlsx"), key=os.path.getmtime, reverse=True)
    if not xlsx_files:
        raise FileNotFoundError(f"No xlsx files in {EXPORTS_DIR}")
    return xlsx_files[0]


def find_pull_sheet(xl) -> str | None:
    names = [str(n).strip() for n in xl.sheet_names]
    if 'Pull Requests' in names:
        return 'Pull Requests'
    for name in names:
        if PULL_PATTERN.match(name):
            return name
    return names[0] if names else None


def find_copilot_sheet(xl) -> tuple[str, str] | None:
    """Find the best Copilot/AI sheet in an Excel file.

    Returns (sheet_name, format) where format is 'new' (AuthorUUID-based)
    or 'legacy' (GithubUserId-based), or None if no match.
    Prefers the new AI All format over legacy Copilot_All.
    """
    names = [str(n).strip() for n in xl.sheet_names]
    # Prefer new format (AI All MM_DD_YY) — has AuthorUUID for PR correlation
    for name in names:
        if AI_ALL_PATTERN.match(name):
            return (name, 'new')
    # Also accept "AI Usage" as new format
    if 'AI Usage' in names:
        return ('AI Usage', 'new')
    if 'Copilot_All' in names:
        return ('Copilot_All', 'legacy')
    return None


def find_copilot_file() -> Path | None:
    """Auto-detect copilot data file in uploads or exports."""
    search_dirs = [
        PROJECT_ROOT / "content" / "documents" / "uploads",
        EXPORTS_DIR,
    ]
    for d in search_dirs:
        if not d.exists():
            continue
        for f in sorted(d.glob("*.xlsx"), key=os.path.getmtime, reverse=True):
            try:
                xl = pd.ExcelFile(f)
                if find_copilot_sheet(xl) is not None:
                    return f
            except Exception:
                continue
    return None


def load_excluded_uuids():
    """Load the set of AuthorUUIDs to drop from PR and Copilot telemetry data.

    Source: pipeline/excluded_users.json. Accepts either a plain list of uuid
    strings or an object with an "excluded_users" array of {name, uuid} entries.
    Returns an empty set if the file is missing or malformed.
    """
    if not EXCLUDED_USERS_FILE.exists():
        return set()
    try:
        payload = json.loads(EXCLUDED_USERS_FILE.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as e:
        print(f"Warning: could not parse {EXCLUDED_USERS_FILE}: {e}")
        return set()
    items = payload if isinstance(payload, list) else payload.get('excluded_users', [])
    uuids = set()
    for item in items:
        if isinstance(item, str):
            uuids.add(item.strip())
        elif isinstance(item, dict) and item.get('uuid'):
            uuids.add(str(item['uuid']).strip())
    return {u for u in uuids if u}


def load_prs(input_path, sheet_name=None):
    p = Path(input_path)
    if p.suffix in ('.xlsx', '.xls'):
        df = pd.read_excel(p, sheet_name=sheet_name or 0)
    else:
        df = pd.read_csv(p, parse_dates=['FirstActivity', 'FirstReadyForQADate', 'PRStart', 'PREnd'])
    # Exports that ship only FirstReadyForQADate (no separate FirstActivity column)
    # still aggregate cleanly by aliasing the two.
    if 'FirstActivity' not in df.columns and 'FirstReadyForQADate' in df.columns:
        df['FirstActivity'] = df['FirstReadyForQADate']
    for col in ('FirstActivity', 'FirstReadyForQADate', 'PRStart', 'PREnd'):
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
    return df


def extract_project_key(jira_ticket):
    """Extract the Jira project key prefix (part before the first '-') from a ticket ID.

    Examples: 'MYAPP-123' -> 'MYAPP', 'web_ui-42' -> 'WEB_UI', '' -> 'UNKNOWN'.
    Normalizes to uppercase so case variants collapse to one project.
    """
    if jira_ticket is None:
        return 'UNKNOWN'
    s = str(jira_ticket).strip()
    m = PROJECT_KEY_PATTERN.match(s)
    if m:
        return m.group(1).upper()
    return 'UNKNOWN'


def aggregate_to_tickets(prs):
    """Aggregate PRs to Jira tickets with team-wide metrics (no pilot/non-pilot split)."""
    prs = prs.copy()

    def agg_ticket(g):
        return pd.Series({
            'PRCount': len(g),
            'FirstActivity': g['FirstActivity'].min(),
            'PREnd': g['PREnd'].max(),
            'AuthorUUIDs': ','.join(g['AuthorUUID'].unique().astype(str)),
            'MaxFiles': g['PRFiles'].max(),
            'TotalLines': g['PRLines'].sum(),
            'TotalChurnLines': g['ChurnLines'].sum(),
            'TotalQAChurnLines': g['QAChurnLines'].sum(),
        })

    tickets = prs.groupby('JiraTicket').apply(agg_ticket).reset_index()
    tickets['PREndDate'] = pd.to_datetime(tickets['PREnd']).dt.normalize()
    tickets['WeekEnding'] = tickets['PREndDate'].dt.to_period('W-SAT').dt.end_time.dt.normalize()
    tickets['HasQAChurn'] = (tickets['TotalQAChurnLines'] > 0).astype(int)
    tickets['SizeBucket'] = pd.cut(tickets['TotalLines'], bins=[0, 300, np.inf], labels=['0-300', '301+'], right=True)
    tickets['ComplexityBucket'] = pd.cut(tickets['MaxFiles'], bins=[0, 10, np.inf], labels=['1-10', '11+'], right=True)
    tickets['Project'] = tickets['JiraTicket'].apply(extract_project_key)
    return tickets


def compute_weekly_team_metrics(tickets):
    """Compute team-wide productivity and QA churn per week."""
    all_weeks = tickets['WeekEnding'].dropna().unique()
    all_weeks = pd.DatetimeIndex(all_weeks).sort_values()

    rows = []
    for week in all_weeks:
        wk_tickets = tickets[tickets['WeekEnding'] == week]
        total_tickets = len(wk_tickets)

        # Count actual unique authors this week
        authors_set = set()
        for uuids_str in wk_tickets['AuthorUUIDs']:
            authors_set.update(str(uuids_str).split(','))
        team_authors = max(len(authors_set), 1)

        team_prod = total_tickets / (team_authors * WORKDAYS_PER_WEEK)
        team_qa = wk_tickets['HasQAChurn'].sum() / total_tickets if total_tickets > 0 else None

        rows.append({
            'WeekEnding': week,
            'TotalTickets': total_tickets,
            'TeamAuthors': team_authors,
            'TeamProductivity': team_prod,
            'TeamQAChurnRate': team_qa,
            'LowConfidence': total_tickets < MIN_TICKETS_THRESHOLD,
        })

    weekly = pd.DataFrame(rows)

    return weekly


def compute_baseline(tickets, weekly):
    """Compute pre-AI baseline metrics for the whole team (before Oct 2025).

    Uses mean-of-weekly productivity (same method as compute_team_summary)
    to ensure apples-to-apples comparison with the mature period.
    """
    baseline_end_ts = pd.Timestamp(BASELINE_END)
    baseline = tickets[tickets['PREndDate'] < baseline_end_ts]
    total = len(baseline)
    authors_set = set()
    for uuids_str in baseline['AuthorUUIDs']:
        authors_set.update(str(uuids_str).split(','))
    authors = len(authors_set)
    workdays = len(baseline['WeekEnding'].unique()) * WORKDAYS_PER_WEEK

    # Mean of per-week productivity (matching compute_team_summary methodology)
    baseline_weekly = weekly[(weekly['WeekEnding'] < baseline_end_ts) & ~weekly['LowConfidence']]
    productivity = baseline_weekly['TeamProductivity'].mean() if len(baseline_weekly) > 0 else 0

    qa_churn_rate = baseline['HasQAChurn'].sum() / total if total > 0 else 0
    pre_min = baseline['PREndDate'].min()
    pre_max = baseline['PREndDate'].max()
    date_range = f"{pre_min.strftime('%Y-%m-%d')} to {pre_max.strftime('%Y-%m-%d')}" if total > 0 else ''
    return {
        'tickets': int(total),
        'authors': authors,
        'workdays': workdays,
        'productivity': round(productivity, 4),
        'qa_churn_rate': round(qa_churn_rate, 4),
        'date_range': date_range,
    }


def compute_team_summary(tickets, weekly, baseline):
    """Compute overall team summary for mature adoption period (Feb 7+)."""
    mature_start_ts = pd.Timestamp(MATURE_START)
    post_tickets = tickets[tickets['PREndDate'] >= mature_start_ts]
    post_weekly = weekly[(weekly['WeekEnding'] >= mature_start_ts) & ~weekly['LowConfidence']]

    team_prod_avg = post_weekly['TeamProductivity'].mean() if len(post_weekly) > 0 else 0
    team_qa = post_tickets['HasQAChurn'].sum() / len(post_tickets) if len(post_tickets) > 0 else 0

    prod_delta = ((team_prod_avg - baseline['productivity']) / baseline['productivity'] * 100) if baseline['productivity'] > 0 else 0
    qa_delta = ((team_qa - baseline['qa_churn_rate']) / baseline['qa_churn_rate'] * 100) if baseline['qa_churn_rate'] > 0 else 0

    # Unique authors in post-pilot
    authors_set = set()
    for uuids_str in post_tickets['AuthorUUIDs']:
        authors_set.update(str(uuids_str).split(','))

    return {
        'total_tickets': int(len(post_tickets)),
        'team_authors': len(authors_set),
        'team_productivity': round(team_prod_avg, 4),
        'productivity_vs_baseline': f"{'+' if prod_delta >= 0 else ''}{prod_delta:.1f}%",
        'team_qa_churn': round(team_qa, 4),
        'qa_vs_baseline': f"{'+' if qa_delta >= 0 else ''}{qa_delta:.1f}%",
        'weeks_of_data': int(len(post_weekly)),
    }


def compute_size_complexity(tickets):
    """Compute size/complexity distribution for mature adoption vs pre-AI baseline."""
    baseline_end_ts = pd.Timestamp(BASELINE_END)
    mature_start_ts = pd.Timestamp(MATURE_START)
    post = tickets[tickets['PREndDate'] >= mature_start_ts]
    pre = tickets[tickets['PREndDate'] < baseline_end_ts]

    post_weeks = len(post['WeekEnding'].unique())
    pre_weeks = len(pre['WeekEnding'].unique())

    # Count unique authors in each period for FTE normalization
    post_authors = set()
    for uuids_str in post['AuthorUUIDs']:
        post_authors.update(str(uuids_str).split(','))
    pre_authors = set()
    for uuids_str in pre['AuthorUUIDs']:
        pre_authors.update(str(uuids_str).split(','))

    post_fte_days = max(len(post_authors), 1) * max(post_weeks, 1) * WORKDAYS_PER_WEEK
    pre_fte_days = max(len(pre_authors), 1) * max(pre_weeks, 1) * WORKDAYS_PER_WEEK

    buckets = []
    for size in ['0-300', '301+']:
        for complexity in ['1-10', '11+']:
            p = post[(post['SizeBucket'] == size) & (post['ComplexityBucket'] == complexity)]
            b = pre[(pre['SizeBucket'] == size) & (pre['ComplexityBucket'] == complexity)]
            if len(p) > 0 or len(b) > 0:
                post_qa = p['HasQAChurn'].sum() / len(p) if len(p) > 0 else 0
                pre_qa = b['HasQAChurn'].sum() / len(b) if len(b) > 0 else 0
                buckets.append({
                    'label': f'{size} / {complexity}',
                    'size': size,
                    'complexity': complexity,
                    'post_tickets': int(len(p)),
                    'baseline_tickets': int(len(b)),
                    'post_productivity': len(p) / post_fte_days if post_fte_days > 0 else 0,
                    'baseline_productivity': len(b) / pre_fte_days if pre_fte_days > 0 else 0,
                    'post_qa_churn': post_qa,
                    'baseline_qa_churn': pre_qa,
                })
    return buckets


def _fmt_delta(current, base):
    """Format a percentage delta vs a baseline value. Returns 'N/A' when baseline is zero."""
    if base is None or base == 0:
        return 'N/A'
    pct = (current - base) / base * 100
    return f"{'+' if pct >= 0 else ''}{pct:.1f}%"


def compute_project_metrics(tickets):
    """Compute project-level breadth and velocity metrics.

    A "project" is the Jira project key prefix (extracted in aggregate_to_tickets).
    Compares the pre-AI baseline window (< BASELINE_END) against the mature
    adoption window (>= MATURE_START):

    - unique_projects:        how many distinct projects saw ticket completion
    - tickets_per_project:    total tickets / unique projects (overall velocity)
    - avg_projects_per_week:  mean of weekly distinct-project counts (breadth)

    Also emits weekly series (phase-tagged) and a top-10 per-project comparison.
    """
    baseline_end_ts = pd.Timestamp(BASELINE_END)
    mature_start_ts = pd.Timestamp(MATURE_START)

    def summarize_period(period_tickets):
        n = len(period_tickets)
        if n == 0:
            return {
                'unique_projects': 0,
                'total_tickets': 0,
                'tickets_per_project': 0.0,
                'avg_projects_per_week': 0.0,
            }
        unique_projects = period_tickets['Project'].nunique()
        # Per-week tickets/project — time-normalized so it's comparable across
        # windows of different lengths (baseline vs mature).
        weekly = period_tickets.groupby('WeekEnding').agg(
            active=('Project', 'nunique'),
            total=('Project', 'size'),
        )
        weekly = weekly[weekly['active'] > 0]
        weekly['ratio'] = weekly['total'] / weekly['active']
        return {
            'unique_projects': int(unique_projects),
            'total_tickets': int(n),
            'tickets_per_project': round(float(weekly['ratio'].mean()), 2) if len(weekly) else 0.0,
            'avg_projects_per_week': round(float(weekly['active'].mean()), 2) if len(weekly) else 0.0,
        }

    baseline_tickets = tickets[tickets['PREndDate'] < baseline_end_ts]
    mature_tickets = tickets[tickets['PREndDate'] >= mature_start_ts]
    baseline_summary = summarize_period(baseline_tickets)
    mature_summary = summarize_period(mature_tickets)

    def get_phase(week_ts):
        if week_ts < baseline_end_ts:
            return 'baseline'
        if week_ts < mature_start_ts:
            return 'transition'
        return 'mature'

    # Weekly series: unique projects and tickets-per-project each week
    weekly_rows = []
    for week, grp in tickets.groupby('WeekEnding'):
        if pd.isna(week):
            continue
        active = int(grp['Project'].nunique())
        total = int(len(grp))
        weekly_rows.append({
            'week': pd.Timestamp(week).strftime('%Y-%m-%d'),
            'phase': get_phase(pd.Timestamp(week)),
            'activeProjects': active,
            'totalTickets': total,
            'ticketsPerProject': round(total / active, 2) if active else 0.0,
        })
    weekly_rows.sort(key=lambda r: r['week'])

    # Per-project: baseline vs mature comparison. Ranked by mature ticket count.
    def project_period_stats(period_df, project):
        p = period_df[period_df['Project'] == project]
        if len(p) == 0:
            return 0, 0, 0.0
        weeks_active = p['WeekEnding'].nunique()
        velocity = round(len(p) / weeks_active, 2) if weeks_active else 0.0
        return int(len(p)), int(weeks_active), velocity

    all_projects = sorted(set(baseline_tickets['Project'].unique()) | set(mature_tickets['Project'].unique()))
    project_rows = []
    for project in all_projects:
        b_tickets, b_weeks, b_vel = project_period_stats(baseline_tickets, project)
        m_tickets, m_weeks, m_vel = project_period_stats(mature_tickets, project)
        # Skip projects with zero activity in both periods (shouldn't happen, but defensive)
        if b_tickets == 0 and m_tickets == 0:
            continue
        project_rows.append({
            'project': project,
            'baselineTickets': b_tickets,
            'matureTickets': m_tickets,
            'baselineWeeksActive': b_weeks,
            'matureWeeksActive': m_weeks,
            'baselineVelocity': b_vel,
            'matureVelocity': m_vel,
            'velocityDelta': _fmt_delta(m_vel, b_vel),
        })
    # Sort by mature ticket count desc (the "active now" projects), tie-break baseline tickets
    project_rows.sort(key=lambda r: (r['matureTickets'], r['baselineTickets']), reverse=True)
    top_projects = project_rows[:10]

    delta = {
        'projects_vs_baseline': _fmt_delta(mature_summary['unique_projects'], baseline_summary['unique_projects']),
        'velocity_vs_baseline': _fmt_delta(mature_summary['tickets_per_project'], baseline_summary['tickets_per_project']),
        'breadth_vs_baseline': _fmt_delta(mature_summary['avg_projects_per_week'], baseline_summary['avg_projects_per_week']),
    }

    return {
        'baseline': baseline_summary,
        'mature': mature_summary,
        'delta': delta,
        'weekly': weekly_rows,
        'topProjects': top_projects,
    }


def _load_copilot_df(copilot_path):
    """Load and normalize the Copilot/AI telemetry DataFrame.

    Returns (df, format) where format is 'new' or 'legacy', or (None, None).
    The returned df always has canonical columns: user_id, EventDay,
    suggestions, acceptances, loc_added.
    """
    xl = pd.ExcelFile(copilot_path)
    result = find_copilot_sheet(xl)
    if result is None:
        return None, None

    sheet_name, fmt = result
    copilot = pd.read_excel(xl, sheet_name=sheet_name)
    copilot['EventDay'] = pd.to_datetime(copilot['EventDay']).dt.normalize()

    if fmt == 'new':
        copilot = copilot.rename(columns={
            'AuthorUUID': 'user_id',
            'suggestionCount': 'suggestions',
            'acceptedSuggestionCount': 'acceptances',
            'LineCountAdded': 'loc_added',
            'LineCountDeleted': 'loc_deleted',
            'SuggestedLineCountAdd': 'suggested_loc_add',
            'SuggestedLineCountDelete': 'suggested_loc_delete',
        })
    else:
        copilot = copilot.rename(columns={
            'GithubUserId': 'user_id',
            'CodeGenerationActivityCount': 'suggestions',
            'CodeAcceptanceActivityCount': 'acceptances',
            'LocAddedSum': 'loc_added',
            'LocDeletedSum': 'loc_deleted',
        })

    # Fill NaN with 0 for numeric columns
    for col in ['suggestions', 'acceptances', 'loc_added']:
        if col in copilot.columns:
            copilot[col] = copilot[col].fillna(0)

    copilot['week'] = copilot['EventDay'].dt.to_period('W-SAT').dt.end_time.dt.normalize()
    return copilot, fmt


def compute_copilot_adoption(copilot_path, excluded_uuids=None):
    """Compute weekly Copilot adoption metrics from GitHub telemetry."""
    copilot, fmt = _load_copilot_df(copilot_path)
    if copilot is None:
        return None, None, None

    if excluded_uuids:
        copilot = copilot[~copilot['user_id'].isin(excluded_uuids)].copy()

    total_users = copilot['user_id'].nunique()

    # User tiers
    user_days = copilot.groupby('user_id')['EventDay'].nunique()
    heavy = int((user_days >= 30).sum())
    medium = int(((user_days >= 10) & (user_days < 30)).sum())
    light = int((user_days < 10).sum())

    has_agent = 'UsedAgent' in copilot.columns
    has_chat = 'UsedChat' in copilot.columns

    # Weekly aggregation
    weekly_rows = []
    for week, grp in copilot.groupby('week'):
        active = grp['user_id'].nunique()
        agent_users = int((grp.groupby('user_id')['UsedAgent'].sum() > 0).sum()) if has_agent else 0
        chat_users = int((grp.groupby('user_id')['UsedChat'].sum() > 0).sum()) if has_chat else 0
        weekly_rows.append({
            'week': pd.Timestamp(week).strftime('%Y-%m-%d'),
            'activeUsers': int(active),
            'copilotPct': round(active / total_users * 100, 1),
            'totalCodeGen': int(grp['suggestions'].sum()),
            'totalCodeAccept': int(grp['acceptances'].sum()),
            'agentUsers': agent_users,
            'chatUsers': chat_users,
            'locAdded': int(grp['loc_added'].sum()),
        })

    # Monthly trend for summary
    copilot['month'] = copilot['EventDay'].dt.to_period('M')
    monthly = copilot.groupby('month')['user_id'].nunique()
    first_month_users = monthly.iloc[0] if len(monthly) > 0 else 0
    last_month_users = monthly.iloc[-1] if len(monthly) > 0 else 0

    # Recent avg daily users (last 4 weeks of data)
    recent_weeks = sorted(copilot['week'].unique())[-4:]
    recent = copilot[copilot['week'].isin(recent_weeks)]
    avg_daily = recent.groupby('EventDay')['user_id'].nunique().mean() if len(recent) > 0 else 0

    adoption = {
        'totalCopilotUsers': int(total_users),
        'userTiers': {'heavy': heavy, 'medium': medium, 'light': light},
        'avgDailyUsersRecent': round(float(avg_daily), 1),
        'adoptionTrend': f"{first_month_users} → {last_month_users} monthly users",
        'weekly': weekly_rows,
    }
    return adoption, copilot, fmt


def compute_copilot_pr_correlation(prs, copilot_df):
    """Correlate Copilot usage with specific PRs using AuthorUUID + week overlap.

    For each PR, checks if the author had Copilot activity during the same week
    as the PR's completion (PREnd). Week-level matching is used because PRs often
    span only 1-2 days and strict day-range overlap misses most usage.
    Also sums copilot suggestions for the author during the PR's week.
    """
    mature_start_ts = pd.Timestamp(MATURE_START)

    prs = prs.copy()
    prs['PREnd'] = pd.to_datetime(prs['PREnd']).dt.normalize()
    prs['WeekEnding'] = prs['PREnd'].dt.to_period('W-SAT').dt.end_time.dt.normalize()

    # Build set of (AuthorUUID, WeekEnding) pairs with copilot activity
    copilot_weekly = copilot_df.groupby(['user_id', 'week']).agg(
        suggestions=('suggestions', 'sum'),
        acceptances=('acceptances', 'sum'),
    ).reset_index()

    # Merge PRs with copilot weekly data on AuthorUUID + week
    merged = prs.merge(
        copilot_weekly,
        left_on=['AuthorUUID', 'WeekEnding'],
        right_on=['user_id', 'week'],
        how='left',
        suffixes=('', '_copilot'),
    )
    prs['copilot_suggestions'] = merged['suggestions'].fillna(0)
    prs['copilot_acceptances'] = merged['acceptances'].fillna(0)
    prs['copilot_assisted'] = (prs['copilot_suggestions'] > 0).astype(int)

    # Aggregate to ticket level
    def agg_ticket(g):
        return pd.Series({
            'PREnd': g['PREnd'].max(),
            'AuthorUUIDs': ','.join(g['AuthorUUID'].unique().astype(str)),
            'TotalLines': g['PRLines'].sum(),
            'MaxFiles': g['PRFiles'].max(),
            'TotalQAChurnLines': g['QAChurnLines'].sum() if 'QAChurnLines' in g.columns else 0,
            'CopilotAssisted': int(g['copilot_assisted'].any()),
            'TotalSuggestions': g['copilot_suggestions'].sum(),
            'TotalAcceptances': g['copilot_acceptances'].sum(),
        })

    tickets = prs.groupby('JiraTicket').apply(agg_ticket).reset_index()
    tickets['PREndDate'] = pd.to_datetime(tickets['PREnd']).dt.normalize()
    tickets['WeekEnding'] = tickets['PREndDate'].dt.to_period('W-SAT').dt.end_time.dt.normalize()
    tickets['HasQAChurn'] = (tickets['TotalQAChurnLines'] > 0).astype(int)

    # Focus on mature period for the comparison
    mature = tickets[tickets['PREndDate'] >= mature_start_ts]
    assisted = mature[mature['CopilotAssisted'] == 1]
    non_assisted = mature[mature['CopilotAssisted'] == 0]

    # Weekly comparison
    all_weeks = sorted(mature['WeekEnding'].unique())
    weekly_comparison = []
    for week in all_weeks:
        wk = mature[mature['WeekEnding'] == week]
        wk_a = wk[wk['CopilotAssisted'] == 1]
        wk_na = wk[wk['CopilotAssisted'] == 0]

        a_authors = set()
        for uuids_str in wk_a['AuthorUUIDs']:
            a_authors.update(str(uuids_str).split(','))
        na_authors = set()
        for uuids_str in wk_na['AuthorUUIDs']:
            na_authors.update(str(uuids_str).split(','))

        a_prod = len(wk_a) / (max(len(a_authors), 1) * WORKDAYS_PER_WEEK) if len(wk_a) > 0 else None
        na_prod = len(wk_na) / (max(len(na_authors), 1) * WORKDAYS_PER_WEEK) if len(wk_na) > 0 else None
        a_qa = wk_a['HasQAChurn'].sum() / len(wk_a) if len(wk_a) > 0 else None
        na_qa = wk_na['HasQAChurn'].sum() / len(wk_na) if len(wk_na) > 0 else None

        weekly_comparison.append({
            'week': pd.Timestamp(week).strftime('%Y-%m-%d'),
            'assistedTickets': int(len(wk_a)),
            'nonAssistedTickets': int(len(wk_na)),
            'assistedProductivity': a_prod,
            'nonAssistedProductivity': na_prod,
            'assistedQARate': a_qa,
            'nonAssistedQARate': na_qa,
        })

    # Overall summary for mature period
    # Use mean-of-weekly productivity (consistent with other metrics)
    valid_weeks_a = [w for w in weekly_comparison if w['assistedProductivity'] is not None]
    valid_weeks_na = [w for w in weekly_comparison if w['nonAssistedProductivity'] is not None]
    avg_a_prod = sum(w['assistedProductivity'] for w in valid_weeks_a) / len(valid_weeks_a) if valid_weeks_a else 0
    avg_na_prod = sum(w['nonAssistedProductivity'] for w in valid_weeks_na) / len(valid_weeks_na) if valid_weeks_na else 0

    a_qa_overall = assisted['HasQAChurn'].sum() / len(assisted) if len(assisted) > 0 else 0
    na_qa_overall = non_assisted['HasQAChurn'].sum() / len(non_assisted) if len(non_assisted) > 0 else 0

    prod_lift = ((avg_a_prod - avg_na_prod) / avg_na_prod * 100) if avg_na_prod > 0 else 0
    qa_delta = ((a_qa_overall - na_qa_overall) / na_qa_overall * 100) if na_qa_overall > 0 else 0

    # Copilot intensity buckets (by total suggestions on the ticket)
    def intensity_bucket(row):
        s = row['TotalSuggestions']
        if s == 0:
            return 'none'
        elif s <= 10:
            return 'low'
        elif s <= 50:
            return 'medium'
        else:
            return 'high'

    mature = mature.copy()
    mature['IntensityBucket'] = mature.apply(intensity_bucket, axis=1)
    intensity = {}
    for bucket in ['low', 'medium', 'high']:
        b = mature[mature['IntensityBucket'] == bucket]
        if len(b) > 0:
            b_authors = set()
            for uuids_str in b['AuthorUUIDs']:
                b_authors.update(str(uuids_str).split(','))
            b_weeks = len(b['WeekEnding'].unique())
            b_fte_days = max(len(b_authors), 1) * max(b_weeks, 1) * WORKDAYS_PER_WEEK
            intensity[bucket] = {
                'tickets': int(len(b)),
                'productivity': round(len(b) / b_fte_days, 4) if b_fte_days > 0 else 0,
                'qaChurn': round(b['HasQAChurn'].sum() / len(b), 4),
                'avgSuggestions': round(b['TotalSuggestions'].mean(), 1),
            }
        else:
            intensity[bucket] = {'tickets': 0, 'productivity': 0, 'qaChurn': 0, 'avgSuggestions': 0}

    return {
        'totalTickets': int(len(mature)),
        'assistedTickets': int(len(assisted)),
        'nonAssistedTickets': int(len(non_assisted)),
        'assistedProductivity': round(avg_a_prod, 4),
        'nonAssistedProductivity': round(avg_na_prod, 4),
        'productivityLift': f"{'+' if prod_lift >= 0 else ''}{prod_lift:.1f}%",
        'assistedQAChurn': round(a_qa_overall, 4),
        'nonAssistedQAChurn': round(na_qa_overall, 4),
        'qaChurnDelta': f"{'+' if qa_delta >= 0 else ''}{qa_delta:.1f}%",
        'weeklyComparison': weekly_comparison,
        'copilotIntensity': intensity,
    }


def _sanitize_for_json(obj):
    """Recursively replace NaN/Inf with None so JSON is valid."""
    if obj is None:
        return None
    if isinstance(obj, dict):
        return {k: _sanitize_for_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_sanitize_for_json(x) for x in obj]
    if isinstance(obj, (pd.Timestamp, datetime, date)):
        return obj.strftime('%Y-%m-%d')
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating, float)):
        if obj != obj or obj == float('inf') or obj == float('-inf'):
            return None
        return round(float(obj), 6)
    if isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    try:
        if pd.isna(obj):
            return None
    except (TypeError, ValueError):
        pass
    return obj


def serialize(obj):
    if isinstance(obj, (pd.Timestamp, datetime, date)):
        return obj.strftime('%Y-%m-%d')
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return None if np.isnan(obj) else round(float(obj), 6)
    if isinstance(obj, (np.bool_,)):
        return bool(obj)
    if pd.isna(obj):
        return None
    raise TypeError(f"Not serializable: {type(obj)} {obj}")


def build_dashboard_data(input_path, sheet_name=None, copilot_path=None):
    prs = load_prs(input_path, sheet_name)
    excluded_uuids = load_excluded_uuids()
    if excluded_uuids:
        before = len(prs)
        prs = prs[~prs['AuthorUUID'].isin(excluded_uuids)].copy()
        print(f"Excluded {before - len(prs)} PR rows from {len(excluded_uuids)} "
              f"user(s): {sorted(excluded_uuids)}")
    tickets = aggregate_to_tickets(prs)
    weekly = compute_weekly_team_metrics(tickets)
    baseline = compute_baseline(tickets, weekly)
    summary = compute_team_summary(tickets, weekly, baseline)
    size_complexity = compute_size_complexity(tickets)
    projects = compute_project_metrics(tickets)

    # Copilot adoption data
    copilot_data = None
    copilot_df = None
    copilot_fmt = None
    if copilot_path:
        copilot_data, copilot_df, copilot_fmt = compute_copilot_adoption(copilot_path, excluded_uuids)
        if copilot_data:
            summary['copilot_users'] = copilot_data['totalCopilotUsers']
            summary['copilot_adoption_current'] = copilot_data['weekly'][-1]['copilotPct'] if copilot_data['weekly'] else 0

    # Copilot-PR correlation (only possible with new AuthorUUID-based format)
    pr_correlation = None
    if copilot_df is not None and copilot_fmt == 'new':
        pr_correlation = compute_copilot_pr_correlation(prs, copilot_df)

    # Unique authors across all data
    all_authors = set()
    for uuids_str in tickets['AuthorUUIDs']:
        all_authors.update(str(uuids_str).split(','))

    baseline_end_ts = pd.Timestamp(BASELINE_END)
    mature_start_ts = pd.Timestamp(MATURE_START)

    def get_phase(week_ts):
        if week_ts < baseline_end_ts:
            return 'baseline'
        elif week_ts < mature_start_ts:
            return 'transition'
        else:
            return 'mature'

    # Build weekly chart data (all weeks — phase-tagged)
    weekly_chart = []
    for _, row in weekly.iterrows():
        week_str = row['WeekEnding'].strftime('%Y-%m-%d')
        phase = get_phase(row['WeekEnding'])
        entry = {
            'week': week_str,
            'phase': phase,
            'totalTickets': int(row['TotalTickets']),
            'teamAuthors': int(row['TeamAuthors']),
            'teamProductivity': row['TeamProductivity'],
            'teamQARate': row['TeamQAChurnRate'],
            'lowConfidence': bool(row['LowConfidence']),
            'copilotPct': None,
            'copilotActiveUsers': None,
            'copilotCodeGen': None,
        }
        # Merge copilot data by matching week
        if copilot_data:
            for cw in copilot_data['weekly']:
                if cw['week'] == week_str:
                    entry['copilotPct'] = cw['copilotPct']
                    entry['copilotActiveUsers'] = cw['activeUsers']
                    entry['copilotCodeGen'] = cw['totalCodeGen']
                    break
        weekly_chart.append(entry)

    # Baseline weekly data (pre-Oct only — for backward compat)
    pre_weekly = weekly[weekly['WeekEnding'] < baseline_end_ts]
    baseline_weekly = []
    for _, row in pre_weekly.iterrows():
        baseline_weekly.append({
            'week': row['WeekEnding'].strftime('%Y-%m-%d'),
            'totalTickets': int(row['TotalTickets']),
            'teamProductivity': row['TeamProductivity'],
            'teamQARate': row['TeamQAChurnRate'],
            'lowConfidence': bool(row['LowConfidence']),
        })

    # Copilot availability (weekly adoption as the new "availability")
    availability = []
    if copilot_data:
        for cw in copilot_data['weekly']:
            availability.append({
                'week': cw['week'],
                'copilot_active_users': cw['activeUsers'],
                'copilot_total_users': copilot_data['totalCopilotUsers'],
                'copilot_pct': cw['copilotPct'],
                'code_gen': cw['totalCodeGen'],
                'loc_added': cw['locAdded'],
            })

    pre_min = prs['PREnd'].min()
    pre_max = prs['PREnd'].max()
    data_range = f"{pd.Timestamp(pre_min).strftime('%Y-%m-%d')} to {pd.Timestamp(pre_max).strftime('%Y-%m-%d')}"

    return {
        'generated': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'dataRange': data_range,
        'baselineEnd': BASELINE_END,
        'matureStart': MATURE_START,
        'rollingWindow': ROLLING_WINDOW,
        'minTicketsThreshold': MIN_TICKETS_THRESHOLD,
        'config': {
            'teamSize': len(all_authors),
            'workdaysPerWeek': WORKDAYS_PER_WEEK,
            'totalCopilotUsers': copilot_data['totalCopilotUsers'] if copilot_data else None,
            'copilotCoveragePct': round(copilot_data['totalCopilotUsers'] / len(all_authors) * 100) if copilot_data and len(all_authors) > 0 else None,
        },
        'baseline': baseline,
        'summary': summary,
        'weekly': weekly_chart,
        'baselineWeekly': baseline_weekly,
        'sizeComplexity': size_complexity,
        'availability': availability,
        'copilotAdoption': copilot_data,
        'copilotPrCorrelation': pr_correlation,
        'projects': projects,
    }


def main():
    parser = argparse.ArgumentParser(description='Generate Copilot Adoption Dashboard JSON')
    parser.add_argument('--input', '-i', type=Path, help='Path to PR xlsx file (default: latest in exports/)')
    parser.add_argument('--sheet', '-s', type=str, help='PR sheet name (default: auto-detect)')
    parser.add_argument('--copilot', '-c', type=Path, help='Path to xlsx with Copilot_All sheet (default: auto-detect)')
    args = parser.parse_args()

    if not HAS_PANDAS:
        print("pandas not available. Skipping refresh.")
        return

    if args.input:
        path = Path(args.input)
        if not path.exists():
            print(f"Error: File not found: {path}")
            sys.exit(1)
    else:
        try:
            path = find_latest_xlsx()
        except FileNotFoundError as e:
            print(str(e))
            sys.exit(1)

    xl = pd.ExcelFile(path)
    pull_sheet = args.sheet or find_pull_sheet(xl)
    if not pull_sheet:
        print("Error: No Pull sheet found. Use --sheet to specify.")
        sys.exit(1)

    # Find copilot data
    copilot_path = args.copilot
    if copilot_path and not copilot_path.exists():
        print(f"Error: Copilot file not found: {copilot_path}")
        sys.exit(1)
    if not copilot_path:
        copilot_path = find_copilot_file()
        if copilot_path:
            print(f"Auto-detected copilot data: {copilot_path}")
        else:
            print("Warning: No Copilot/AI telemetry data found. Dashboard will show team metrics without copilot overlay.")

    data = build_dashboard_data(path, pull_sheet, copilot_path)
    data = _sanitize_for_json(data)
    json_str = json.dumps(data, default=serialize, indent=2)

    JSON_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUTPUT.write_text(json_str, encoding='utf-8')
    print(f"JSON written to: {JSON_OUTPUT}")

    print(f"\nThree-phase model:")
    print(f"  Baseline: pre-{BASELINE_END} | Transition: {BASELINE_END}–{MATURE_START} | Mature: {MATURE_START}+")
    print(f"\nMature period summary:")
    print(f"  Team: {data['summary']['total_tickets']} tickets, "
          f"productivity {data['summary']['team_productivity']:.3f} tickets/FTE-day")
    print(f"  vs Pre-AI Baseline: {data['summary']['productivity_vs_baseline']}")
    print(f"  QA Churn: {data['summary']['team_qa_churn']:.1%} ({data['summary']['qa_vs_baseline']} vs baseline)")
    if data['copilotAdoption']:
        print(f"  Copilot Users: {data['copilotAdoption']['totalCopilotUsers']} "
              f"({data['config']['copilotCoveragePct']}% of team)")
    if data.get('projects'):
        p = data['projects']
        print(f"\nProject throughput (mature vs baseline):")
        print(f"  Unique projects: {p['mature']['unique_projects']} "
              f"(baseline {p['baseline']['unique_projects']}, {p['delta']['projects_vs_baseline']})")
        print(f"  Tickets/project: {p['mature']['tickets_per_project']:.2f} "
              f"(baseline {p['baseline']['tickets_per_project']:.2f}, {p['delta']['velocity_vs_baseline']})")
        print(f"  Avg projects/week: {p['mature']['avg_projects_per_week']:.2f} "
              f"(baseline {p['baseline']['avg_projects_per_week']:.2f}, {p['delta']['breadth_vs_baseline']})")


if __name__ == '__main__':
    main()
