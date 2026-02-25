#!/usr/bin/env python3
"""
AI Software Dev KPI Dashboard - Data Pipeline

Single source of truth for dashboard data. Reads xlsx from pipeline/data/exports/,
uses PILOT_UUIDS for pilot identification, computes KPIs, and writes
public/data/dashboard-data.json for the React dashboard.

Usage:
    python pipeline/refresh.py
        # Uses latest xlsx in pipeline/data/exports/; auto-detects sheets
    python pipeline/refresh.py --input path/to/file.xlsx --sheet "Pull 02_11_26"
"""

import argparse
import json
import os
import re
import sys
from collections import Counter
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
PILOT_UUIDS = [
    '5b7b8122-68d5-4d44-b30c-de245a77c85c',
    '92d8106c-b379-443d-aa4c-7bff1d81daf7',
    '315708a7-d25d-44ff-a0c3-069db5ac5974',
    '987bb5a0-e18e-4b08-b48c-7515018a2f99',
    'c2f7dc76-f7ec-4be3-9dd7-caf78b33ab94',
    'bdb6a72b-3bb0-4000-9560-a6d1de234827',
]
PILOT_START = '2025-12-01'
WORKDAYS_PER_WEEK = 5
ROLLING_WINDOW = 4
MIN_TICKETS_THRESHOLD = 5
NON_PILOT_ROSTER = 9

# Paths
PIPELINE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = PIPELINE_DIR.parent
EXPORTS_DIR = PIPELINE_DIR / "data" / "exports"
JSON_OUTPUT = PROJECT_ROOT / "public" / "data" / "dashboard-data.json"

# Sheet names (auto-detect)
DASHBOARD_SHEET_ALTS = ("Current dashboard data", "PRJira metrics", "PR Jira metrics")
SURVEY_SHEET_ALTS = ("Current survey data", "developer survey results", "Developer survey results")
PULL_PATTERN = re.compile(r"^Pull\s+\d{2}_\d{2}_\d{2}$", re.I)


def find_latest_xlsx() -> Path:
    xlsx_files = sorted(EXPORTS_DIR.glob("*.xlsx"), key=os.path.getmtime, reverse=True)
    if not xlsx_files:
        raise FileNotFoundError(f"No xlsx files in {EXPORTS_DIR}")
    return xlsx_files[0]


def find_pull_sheet(xl) -> str | None:
    names = [str(n).strip() for n in xl.sheet_names]
    for candidate in DASHBOARD_SHEET_ALTS:
        if candidate in names:
            return candidate
    for name in names:
        if PULL_PATTERN.match(name):
            return name
    return names[0] if names else None


def find_survey_sheet(xl) -> str | None:
    names = [str(n).strip() for n in xl.sheet_names]
    for candidate in SURVEY_SHEET_ALTS:
        if candidate in names:
            return candidate
    if "Survey 1 results" in names:
        return "Survey 1 results"
    return None


def load_data(input_path, sheet_name=None):
    p = Path(input_path)
    if p.suffix in ('.xlsx', '.xls'):
        return pd.read_excel(p, sheet_name=sheet_name or 0)
    return pd.read_csv(p, parse_dates=['FirstActivity', 'FirstReadyForQADate', 'PRStart', 'PREnd'])


def aggregate_to_tickets(prs):
    prs = prs.copy()
    prs['is_pilot_author'] = prs['AuthorUUID'].isin(PILOT_UUIDS)
    pilot_start_ts = pd.Timestamp(PILOT_START)

    def agg_ticket(g):
        return pd.Series({
            'PRCount': len(g),
            'FirstActivity': g['FirstActivity'].min(),
            'PREnd': g['PREnd'].max(),
            'AuthorUUIDs': ','.join(g['AuthorUUID'].unique().astype(str)),
            'HasPilotUUID': int(g['is_pilot_author'].any()),
            'MaxFiles': g['PRFiles'].max(),
            'TotalLines': g['PRLines'].sum(),
            'TotalChurnLines': g['ChurnLines'].sum(),
            'TotalQAChurnLines': g['QAChurnLines'].sum(),
            'HasPRAI': int((g['PRAI'] > 0).any()),
        })

    tickets = prs.groupby('JiraTicket').apply(agg_ticket).reset_index()
    tickets['PREndDate'] = pd.to_datetime(tickets['PREnd']).dt.normalize()
    tickets['WeekEnding'] = tickets['PREndDate'].dt.to_period('W-SAT').dt.end_time.dt.normalize()
    tickets['IsPilotTicket'] = ((tickets['HasPilotUUID'] == 1) & (tickets['PREndDate'] >= pilot_start_ts)).astype(int)
    tickets['HasQAChurn'] = (tickets['TotalQAChurnLines'] > 0).astype(int)
    tickets['SizeBucket'] = pd.cut(tickets['TotalLines'], bins=[0, 300, 1000, np.inf], labels=['0-300', '301-1000', '1001+'], right=True)
    tickets['ComplexityBucket'] = pd.cut(tickets['MaxFiles'], bins=[0, 3, 10, np.inf], labels=['1-3', '4-10', '11+'], right=True)
    return tickets


def compute_weekly_metrics(tickets):
    pilot_start_ts = pd.Timestamp(PILOT_START)
    all_weeks = tickets['WeekEnding'].dropna().unique()
    all_weeks = pd.DatetimeIndex(all_weeks).sort_values()

    rows = []
    for week in all_weeks:
        wk_tickets = tickets[tickets['WeekEnding'] == week]
        pilot_tix = wk_tickets[wk_tickets['IsPilotTicket'] == 1]
        nonpilot_tix = wk_tickets[wk_tickets['IsPilotTicket'] == 0]

        if week >= pilot_start_ts:
            pilot_authors = len(PILOT_UUIDS)
            nonpilot_authors = NON_PILOT_ROSTER
        else:
            all_pre = set()
            for uuids_str in wk_tickets['AuthorUUIDs']:
                all_pre.update(str(uuids_str).split(','))
            nonpilot_authors = max(len(all_pre), 1)
            pilot_authors = 0

        total_tickets = len(wk_tickets)
        pilot_count = len(pilot_tix)
        nonpilot_count = len(nonpilot_tix)

        pilot_prod = pilot_count / (pilot_authors * WORKDAYS_PER_WEEK) if pilot_authors > 0 else 0
        nonpilot_prod = nonpilot_count / (nonpilot_authors * WORKDAYS_PER_WEEK) if nonpilot_authors > 0 else 0

        pilot_qa = pilot_tix['HasQAChurn'].sum() / pilot_count if pilot_count > 0 else None
        nonpilot_qa = nonpilot_tix['HasQAChurn'].sum() / nonpilot_count if nonpilot_count > 0 else None
        ai_share = pilot_count / total_tickets if total_tickets > 0 and week >= pilot_start_ts else None

        rows.append({
            'WeekEnding': week,
            'TotalTickets': total_tickets,
            'PilotTickets': pilot_count,
            'NonPilotTickets': nonpilot_count,
            'PilotAuthors': pilot_authors,
            'NonPilotAuthors': nonpilot_authors,
            'PilotProductivity': pilot_prod,
            'NonPilotProductivity': nonpilot_prod,
            'PilotQAChurnRate': pilot_qa,
            'NonPilotQAChurnRate': nonpilot_qa,
            'AIOutputShare': ai_share,
            'LowConfidence': total_tickets < MIN_TICKETS_THRESHOLD,
        })

    weekly = pd.DataFrame(rows)

    pilot_mask = weekly['WeekEnding'] >= pilot_start_ts
    confident = weekly[pilot_mask & ~weekly['LowConfidence']].copy()

    for col in ['PilotProductivity', 'NonPilotProductivity', 'PilotQAChurnRate', 'NonPilotQAChurnRate']:
        roll_col = f'{col}_Rolling'
        std_col = f'{col}_Std'
        weekly[roll_col] = None
        weekly[std_col] = None
        if len(confident) >= 2:
            rolled = confident[col].rolling(window=ROLLING_WINDOW, min_periods=2)
            confident[roll_col] = rolled.mean()
            confident[std_col] = rolled.std()
            weekly.loc[confident.index, roll_col] = confident[roll_col]
            weekly.loc[confident.index, std_col] = confident[std_col]

    return weekly


def compute_size_complexity(tickets):
    pilot_start_ts = pd.Timestamp(PILOT_START)
    pilot_tix = tickets[tickets['IsPilotTicket'] == 1]
    nonpilot_tix = tickets[(tickets['PREndDate'] >= pilot_start_ts) & (tickets['IsPilotTicket'] == 0)]

    pilot_period_weeks = len(tickets[tickets['PREndDate'] >= pilot_start_ts]['WeekEnding'].unique())
    pilot_fte_days = len(PILOT_UUIDS) * max(pilot_period_weeks, 1) * WORKDAYS_PER_WEEK
    nonpilot_fte_days = NON_PILOT_ROSTER * max(pilot_period_weeks, 1) * WORKDAYS_PER_WEEK

    buckets = []
    for size in ['0-300', '301-1000', '1001+']:
        for complexity in ['1-3', '4-10', '11+']:
            p = pilot_tix[(pilot_tix['SizeBucket'] == size) & (pilot_tix['ComplexityBucket'] == complexity)]
            np_ = nonpilot_tix[(nonpilot_tix['SizeBucket'] == size) & (nonpilot_tix['ComplexityBucket'] == complexity)]
            if len(p) > 0 or len(np_) > 0:
                pilot_qa = p['HasQAChurn'].sum() / len(p) if len(p) > 0 else 0
                nonpilot_qa = np_['HasQAChurn'].sum() / len(np_) if len(np_) > 0 else 0
                buckets.append({
                    'label': f'{size} / {complexity}',
                    'size': size,
                    'complexity': complexity,
                    'pilot_tickets': int(len(p)),
                    'nonpilot_tickets': int(len(np_)),
                    'pilot_productivity': len(p) / pilot_fte_days if pilot_fte_days > 0 else 0,
                    'nonpilot_productivity': len(np_) / nonpilot_fte_days if nonpilot_fte_days > 0 else 0,
                    'pilot_qa_churn': pilot_qa,
                    'nonpilot_qa_churn': nonpilot_qa,
                })
    return buckets


def compute_baseline(tickets):
    pilot_start_ts = pd.Timestamp(PILOT_START)
    baseline = tickets[tickets['PREndDate'] < pilot_start_ts]
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


def compute_pilot_summary(tickets, weekly):
    pilot_start_ts = pd.Timestamp(PILOT_START)
    pilot_tix = tickets[tickets['IsPilotTicket'] == 1]
    nonpilot_tix = tickets[(tickets['PREndDate'] >= pilot_start_ts) & (tickets['IsPilotTicket'] == 0)]
    pilot_weeks = weekly[(weekly['WeekEnding'] >= pilot_start_ts) & ~weekly['LowConfidence']]

    pilot_prod_avg = pilot_weeks['PilotProductivity'].mean() if len(pilot_weeks) > 0 else 0
    nonpilot_prod_avg = pilot_weeks['NonPilotProductivity'].mean() if len(pilot_weeks) > 0 else 0

    pilot_qa = pilot_tix['HasQAChurn'].sum() / len(pilot_tix) if len(pilot_tix) > 0 else 0
    nonpilot_qa = nonpilot_tix['HasQAChurn'].sum() / len(nonpilot_tix) if len(nonpilot_tix) > 0 else 0

    total_tix = len(pilot_tix) + len(nonpilot_tix)
    ai_share = len(pilot_tix) / total_tix if total_tix > 0 else 0

    return {
        'pilot_tickets': int(len(pilot_tix)),
        'nonpilot_tickets': int(len(nonpilot_tix)),
        'total_tickets': total_tix,
        'pilot_authors': len(PILOT_UUIDS),
        'nonpilot_authors': NON_PILOT_ROSTER,
        'pilot_productivity': round(pilot_prod_avg, 4),
        'nonpilot_productivity': round(nonpilot_prod_avg, 4),
        'productivity_ratio': round(pilot_prod_avg / nonpilot_prod_avg, 2) if nonpilot_prod_avg > 0 else 0,
        'pilot_qa_churn': round(pilot_qa, 4),
        'nonpilot_qa_churn': round(nonpilot_qa, 4),
        'ai_output_share': round(ai_share, 4),
        'weeks_of_data': int(len(pilot_weeks)),
    }


def compute_cumulative(tickets):
    pilot_start_ts = pd.Timestamp(PILOT_START)
    pilot_period = tickets[tickets['PREndDate'] >= pilot_start_ts]
    weeks = sorted(pilot_period['WeekEnding'].unique())
    cum = []
    p_total, np_total = 0, 0
    for w in weeks:
        wk = pilot_period[pilot_period['WeekEnding'] == w]
        p_total += len(wk[wk['IsPilotTicket'] == 1])
        np_total += len(wk[wk['IsPilotTicket'] == 0])
        cum.append({
            'week': pd.Timestamp(w).strftime('%Y-%m-%d'),
            'pilot_cumulative': p_total,
            'nonpilot_cumulative': np_total,
            'total_cumulative': p_total + np_total,
            'ai_share': round(p_total / (p_total + np_total), 4) if (p_total + np_total) > 0 else 0,
        })
    return cum


def compute_availability(prs):
    prs = prs.copy()
    prs['is_pilot'] = prs['AuthorUUID'].isin(PILOT_UUIDS)
    pilot_prs = prs[prs['is_pilot']]
    pilot_prs = pilot_prs.copy()
    pilot_prs['WeekEnding'] = pd.to_datetime(pilot_prs['PREnd']).dt.to_period('W-SAT').dt.end_time.dt.normalize()

    pilot_start_ts = pd.Timestamp(PILOT_START)
    weeks = sorted(pilot_prs['WeekEnding'].unique())
    result = []
    for w in weeks:
        if w < pilot_start_ts:
            continue
        wk = pilot_prs[pilot_prs['WeekEnding'] == w]
        active_devs = wk['AuthorUUID'].nunique()
        result.append({
            'week': pd.Timestamp(w).strftime('%Y-%m-%d'),
            'active_pilot_devs': active_devs,
            'total_pilot_devs': len(PILOT_UUIDS),
            'availability_pct': round(active_devs / len(PILOT_UUIDS), 4),
        })
    return result


def parse_survey(survey_path, sheet_name=None):
    if sheet_name:
        sheets_to_try = [sheet_name]
    else:
        xl = pd.ExcelFile(survey_path)
        found = find_survey_sheet(xl)
        sheets_to_try = [found] if found else []

    for sn in sheets_to_try:
        try:
            df = pd.read_excel(survey_path, sheet_name=sn)
        except Exception:
            continue

        try:
            prod_col = next(c for c in df.columns if 'productive' in str(c).lower())
            mod_col = next(c for c in df.columns if 'modify' in str(c).lower())
            task_col = next(c for c in df.columns if 'tasks' in str(c).lower())
            scenario_col = next(c for c in df.columns if 'scenarios' in str(c).lower())
            risk_col = next(c for c in df.columns if 'issues or risks' in str(c).lower())
            benefit_col = next(c for c in df.columns if 'biggest benefits' in str(c).lower())
            drawback_col = next(c for c in df.columns if 'drawbacks' in str(c).lower())
            recommend_col = next(c for c in df.columns if 'improvements' in str(c).lower())
        except StopIteration:
            continue

        n = len(df)
        prod_counts = df[prod_col].value_counts().to_dict()
        positive = sum(v for k, v in prod_counts.items() if 'more productive' in str(k).lower())
        neutral = sum(v for k, v in prod_counts.items() if 'no noticeable' in str(k).lower())
        negative = sum(v for k, v in prod_counts.items() if 'less productive' in str(k).lower())
        mod_counts = df[mod_col].value_counts().to_dict()

        def parse_multi(col):
            all_items = []
            for row in df[col]:
                items = [t.strip().rstrip(';') for t in str(row).split(';') if t.strip() and t.strip() != 'nan']
                all_items.extend(items)
            return [{'label': k, 'count': v, 'pct': round(v / n, 4)} for k, v in Counter(all_items).most_common()]

        tasks = parse_multi(task_col)
        scenarios = parse_multi(scenario_col)
        risks = parse_multi(risk_col)

        quotes = []
        for _, row in df.iterrows():
            entry = {}
            name = str(row.get('Name', '')).split()[0] if pd.notna(row.get('Name')) else 'Anon'
            if pd.notna(row.get(benefit_col)):
                entry['benefit'] = str(row[benefit_col])[:500]
            if pd.notna(row.get(drawback_col)):
                entry['drawback'] = str(row[drawback_col])[:500]
            if pd.notna(row.get(recommend_col)):
                entry['recommendation'] = str(row[recommend_col])[:500]
            if entry:
                entry['name'] = name
                quotes.append(entry)

        return {
            'respondents': n,
            'total_pilot': len(PILOT_UUIDS),
            'response_rate': round(n / len(PILOT_UUIDS), 4),
            'productivity_perception': {
                'positive': int(positive),
                'neutral': int(neutral),
                'negative': int(negative),
                'detail': {str(k): int(v) for k, v in prod_counts.items()},
            },
            'modification_frequency': {str(k): int(v) for k, v in mod_counts.items()},
            'tasks_used': tasks,
            'scenarios_encouraged': scenarios,
            'risks_observed': risks,
            'quotes': quotes,
        }
    return None


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
    """Used as json.dumps default for remaining edge cases."""
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


def build_dashboard_data(input_path, sheet_name=None):
    prs = load_data(input_path, sheet_name)
    tickets = aggregate_to_tickets(prs)
    weekly = compute_weekly_metrics(tickets)
    size_complexity = compute_size_complexity(tickets)
    baseline = compute_baseline(tickets)
    summary = compute_pilot_summary(tickets, weekly)
    cumulative = compute_cumulative(tickets)
    availability = compute_availability(prs)
    survey = parse_survey(input_path)

    pilot_start_ts = pd.Timestamp(PILOT_START)
    pilot_weekly = weekly[weekly['WeekEnding'] >= pilot_start_ts]
    weekly_chart = []
    for _, row in pilot_weekly.iterrows():
        weekly_chart.append({
            'week': row['WeekEnding'].strftime('%Y-%m-%d'),
            'totalTickets': int(row['TotalTickets']),
            'pilotTickets': int(row['PilotTickets']),
            'nonpilotTickets': int(row['NonPilotTickets']),
            'pilotProductivity': row['PilotProductivity'],
            'nonpilotProductivity': row['NonPilotProductivity'],
            'pilotProductivityRolling': row.get('PilotProductivity_Rolling'),
            'nonpilotProductivityRolling': row.get('NonPilotProductivity_Rolling'),
            'pilotProductivityStd': row.get('PilotProductivity_Std'),
            'nonpilotProductivityStd': row.get('NonPilotProductivity_Std'),
            'pilotQARate': row['PilotQAChurnRate'],
            'nonpilotQARate': row['NonPilotQAChurnRate'],
            'pilotQARateRolling': row.get('PilotQAChurnRate_Rolling'),
            'nonpilotQARateRolling': row.get('NonPilotQAChurnRate_Rolling'),
            'aiOutputShare': row['AIOutputShare'],
            'lowConfidence': bool(row['LowConfidence']),
        })

    pre_pilot = weekly[weekly['WeekEnding'] < pilot_start_ts]
    baseline_weekly = []
    for _, row in pre_pilot.iterrows():
        baseline_weekly.append({
            'week': row['WeekEnding'].strftime('%Y-%m-%d'),
            'totalTickets': int(row['TotalTickets']),
            'nonpilotProductivity': row['NonPilotProductivity'],
            'nonpilotQARate': row['NonPilotQAChurnRate'],
            'lowConfidence': bool(row['LowConfidence']),
        })

    pre_min = prs['PREnd'].min()
    pre_max = prs['PREnd'].max()
    data_range = f"{pd.Timestamp(pre_min).strftime('%Y-%m-%d')} to {pd.Timestamp(pre_max).strftime('%Y-%m-%d')}"

    return {
        'generated': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'dataRange': data_range,
        'pilotStart': PILOT_START,
        'rollingWindow': ROLLING_WINDOW,
        'minTicketsThreshold': MIN_TICKETS_THRESHOLD,
        'config': {
            'pilotCount': len(PILOT_UUIDS),
            'nonPilotCount': NON_PILOT_ROSTER,
            'workdaysPerWeek': WORKDAYS_PER_WEEK,
        },
        'baseline': baseline,
        'summary': summary,
        'weekly': weekly_chart,
        'baselineWeekly': baseline_weekly,
        'sizeComplexity': size_complexity,
        'cumulative': cumulative,
        'availability': availability,
        'survey': survey,
    }


def main():
    parser = argparse.ArgumentParser(description='Generate AI Dev KPI Dashboard JSON')
    parser.add_argument('--input', '-i', type=Path, help='Path to xlsx file (default: latest in exports/)')
    parser.add_argument('--sheet', '-s', type=str, help='PR sheet name (default: auto-detect)')
    args = parser.parse_args()

    if not HAS_PANDAS:
        print("pandas not available. Skipping refresh. Using committed dashboard-data.json.")
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
            print("Skipping refresh. Keeping existing dashboard-data.json.")
            return

    xl = pd.ExcelFile(path)
    pull_sheet = args.sheet or find_pull_sheet(xl)
    if not pull_sheet:
        print("Error: No Pull/dashboard sheet found. Use --sheet to specify.")
        sys.exit(1)

    data = build_dashboard_data(path, pull_sheet)
    data = _sanitize_for_json(data)
    json_str = json.dumps(data, default=serialize, indent=2)

    JSON_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUTPUT.write_text(json_str, encoding='utf-8')
    print(f"JSON written to: {JSON_OUTPUT}")

    print(f"\nSummary:")
    print(f"  Pilot: {data['summary']['pilot_tickets']} tickets, "
          f"productivity {data['summary']['pilot_productivity']:.3f} tickets/FTE-day")
    print(f"  Non-Pilot: {data['summary']['nonpilot_tickets']} tickets, "
          f"productivity {data['summary']['nonpilot_productivity']:.3f} tickets/FTE-day")
    print(f"  Ratio: {data['summary']['productivity_ratio']}×")
    print(f"  QA Churn: Pilot {data['summary']['pilot_qa_churn']:.1%} vs Non-Pilot {data['summary']['nonpilot_qa_churn']:.1%}")


if __name__ == '__main__':
    main()
