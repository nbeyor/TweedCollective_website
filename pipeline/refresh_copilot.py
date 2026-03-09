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

PULL_PATTERN = re.compile(r"^Pull\s+\d{2}_\d{2}_\d{2}$", re.I)


def find_latest_xlsx() -> Path:
    xlsx_files = sorted(EXPORTS_DIR.glob("*.xlsx"), key=os.path.getmtime, reverse=True)
    if not xlsx_files:
        raise FileNotFoundError(f"No xlsx files in {EXPORTS_DIR}")
    return xlsx_files[0]


def find_pull_sheet(xl) -> str | None:
    names = [str(n).strip() for n in xl.sheet_names]
    for name in names:
        if PULL_PATTERN.match(name):
            return name
    return names[0] if names else None


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
                if 'Copilot_All' in xl.sheet_names:
                    return f
            except Exception:
                continue
    return None


def load_prs(input_path, sheet_name=None):
    p = Path(input_path)
    if p.suffix in ('.xlsx', '.xls'):
        return pd.read_excel(p, sheet_name=sheet_name or 0)
    return pd.read_csv(p, parse_dates=['FirstActivity', 'FirstReadyForQADate', 'PRStart', 'PREnd'])


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
    tickets['SizeBucket'] = pd.cut(tickets['TotalLines'], bins=[0, 300, 1000, np.inf], labels=['0-300', '301-1000', '1001+'], right=True)
    tickets['ComplexityBucket'] = pd.cut(tickets['MaxFiles'], bins=[0, 3, 10, np.inf], labels=['1-3', '4-10', '11+'], right=True)
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

    # Rolling averages on high-confidence weeks only
    confident = weekly[~weekly['LowConfidence']].copy()
    for col in ['TeamProductivity', 'TeamQAChurnRate']:
        roll_col = f'{col}_Rolling'
        weekly[roll_col] = None
        if len(confident) >= 2:
            rolled = confident[col].rolling(window=ROLLING_WINDOW, min_periods=2)
            confident[roll_col] = rolled.mean()
            weekly.loc[confident.index, roll_col] = confident[roll_col]

    return weekly


def compute_baseline(tickets):
    """Compute pre-AI baseline metrics for the whole team (before Oct 2025)."""
    baseline_end_ts = pd.Timestamp(BASELINE_END)
    baseline = tickets[tickets['PREndDate'] < baseline_end_ts]
    total = len(baseline)
    authors_set = set()
    for uuids_str in baseline['AuthorUUIDs']:
        authors_set.update(str(uuids_str).split(','))
    authors = len(authors_set)
    workdays = len(baseline['WeekEnding'].unique()) * WORKDAYS_PER_WEEK
    productivity = total / (authors * workdays) if authors * workdays > 0 else 0
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


def compute_cumulative(tickets):
    """Compute cumulative team ticket output from mature adoption period."""
    mature_start_ts = pd.Timestamp(MATURE_START)
    post = tickets[tickets['PREndDate'] >= mature_start_ts]
    weeks = sorted(post['WeekEnding'].unique())
    cum = []
    total = 0
    for w in weeks:
        wk = post[post['WeekEnding'] == w]
        total += len(wk)
        cum.append({
            'week': pd.Timestamp(w).strftime('%Y-%m-%d'),
            'team_cumulative': total,
        })
    return cum


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
    for size in ['0-300', '301-1000', '1001+']:
        for complexity in ['1-3', '4-10', '11+']:
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


def compute_copilot_adoption(copilot_path):
    """Compute weekly Copilot adoption metrics from GitHub telemetry."""
    xl = pd.ExcelFile(copilot_path)
    if 'Copilot_All' not in xl.sheet_names:
        return None

    copilot = pd.read_excel(xl, sheet_name='Copilot_All')
    copilot['EventDay'] = pd.to_datetime(copilot['EventDay']).dt.normalize()
    copilot['week'] = copilot['EventDay'].dt.to_period('W-SAT').dt.end_time.dt.normalize()

    total_users = copilot['GithubUserId'].nunique()

    # User tiers
    user_days = copilot.groupby('GithubUserId')['EventDay'].nunique()
    heavy = int((user_days >= 30).sum())
    medium = int(((user_days >= 10) & (user_days < 30)).sum())
    light = int((user_days < 10).sum())

    # Weekly aggregation
    weekly_rows = []
    for week, grp in copilot.groupby('week'):
        active = grp['GithubUserId'].nunique()
        weekly_rows.append({
            'week': pd.Timestamp(week).strftime('%Y-%m-%d'),
            'activeUsers': int(active),
            'copilotPct': round(active / total_users * 100, 1),
            'totalCodeGen': int(grp['CodeGenerationActivityCount'].sum()),
            'totalCodeAccept': int(grp['CodeAcceptanceActivityCount'].sum()),
            'agentUsers': int((grp.groupby('GithubUserId')['UsedAgent'].sum() > 0).sum()),
            'chatUsers': int((grp.groupby('GithubUserId')['UsedChat'].sum() > 0).sum()),
            'locAdded': int(grp['LocAddedSum'].sum()),
        })

    # Monthly trend for summary
    copilot['month'] = copilot['EventDay'].dt.to_period('M')
    monthly = copilot.groupby('month')['GithubUserId'].nunique()
    first_month_users = monthly.iloc[0] if len(monthly) > 0 else 0
    last_month_users = monthly.iloc[-1] if len(monthly) > 0 else 0

    # Recent avg daily users (last 4 weeks of data)
    recent_weeks = sorted(copilot['week'].unique())[-4:]
    recent = copilot[copilot['week'].isin(recent_weeks)]
    avg_daily = recent.groupby('EventDay')['GithubUserId'].nunique().mean() if len(recent) > 0 else 0

    return {
        'totalCopilotUsers': int(total_users),
        'userTiers': {'heavy': heavy, 'medium': medium, 'light': light},
        'avgDailyUsersRecent': round(float(avg_daily), 1),
        'adoptionTrend': f"{first_month_users} → {last_month_users} monthly users",
        'weekly': weekly_rows,
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
    tickets = aggregate_to_tickets(prs)
    weekly = compute_weekly_team_metrics(tickets)
    baseline = compute_baseline(tickets)
    summary = compute_team_summary(tickets, weekly, baseline)
    cumulative = compute_cumulative(tickets)
    size_complexity = compute_size_complexity(tickets)

    # Copilot adoption data
    copilot_data = None
    if copilot_path:
        copilot_data = compute_copilot_adoption(copilot_path)
        if copilot_data:
            summary['copilot_users'] = copilot_data['totalCopilotUsers']
            summary['copilot_adoption_current'] = copilot_data['weekly'][-1]['copilotPct'] if copilot_data['weekly'] else 0

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
            'teamProductivityRolling': row.get('TeamProductivity_Rolling'),
            'teamQARate': row['TeamQAChurnRate'],
            'teamQARateRolling': row.get('TeamQAChurnRate_Rolling'),
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
        'cumulative': cumulative,
        'availability': availability,
        'copilotAdoption': copilot_data,
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
            print("Warning: No Copilot_All data found. Dashboard will show team metrics without copilot overlay.")

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


if __name__ == '__main__':
    main()
