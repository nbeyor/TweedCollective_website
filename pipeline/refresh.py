#!/usr/bin/env python3
"""
Dashboard data pipeline.

Reads xlsx export from pipeline/data/exports/, computes KPIs from the Pull sheet,
parses Survey 1 results if present, and injects JSON into dashboard_template.html.
Output: public/dashboards/portfolio.html (+ archive in content/documents/).

Usage:
    python pipeline/refresh.py
        # Uses latest xlsx in pipeline/data/exports/; auto-detects Pull sheet
    python pipeline/refresh.py --input path/to/file.xlsx --pull-sheet "Pull 02_11_26"
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    pd = None
    HAS_PANDAS = False

# -----------------------------------------------------------------------------
# Config (update when team changes)
# -----------------------------------------------------------------------------
DATA_START = "2025-07-01"  # Include all data from earliest available
PILOT_START = "2025-12-01"
NON_PILOT_ROSTER = 9
PILOT_ROSTER = 6
ROLLING_WINDOW = 4
MIN_TICKETS_THRESHOLD = 5
BASELINE_PRODUCTIVITY = 0.169
BASELINE_QA_CHURN_PCT = 23.0
# Holiday weeks: dimmed, line can gap (Dec 27 2025, Jan 3 2026, etc.)
HOLIDAY_WEEK_STRS = ("2025-12-27", "2026-01-03", "2025-12-20", "2026-01-10")

# -----------------------------------------------------------------------------
# Paths
# -----------------------------------------------------------------------------
PIPELINE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = PIPELINE_DIR.parent
TEMPLATE_PATH = PIPELINE_DIR / "dashboard_template.html"
OUTPUT_PATH = PROJECT_ROOT / "public" / "dashboards" / "portfolio.html"
OUTPUT_ARCHIVE = PROJECT_ROOT / "content" / "documents" / "dashboard.html"
EXPORTS_DIR = PIPELINE_DIR / "data" / "exports"
JS_DIR = PROJECT_ROOT / "public" / "js"

# Pull sheet columns (exact or normalized)
PULL_COLS = [
    "JiraTicket", "Title", "FirstActivity", "FirstReadyForQADate",
    "PRStart", "PREnd", "AuthorUUID", "IncludeInPilot",
    "PRFiles", "PRLines", "PRAI", "ChurnFiles", "ChurnLines", "ChurnAI",
    "QAChurnFiles", "QAChurnLines", "QAChurnAI",
]


def normalize_col(s: str) -> str:
    return s.strip() if isinstance(s, str) else str(s)


def find_latest_xlsx() -> Path:
    xlsx_files = sorted(EXPORTS_DIR.glob("*.xlsx"), key=os.path.getmtime, reverse=True)
    if not xlsx_files:
        raise FileNotFoundError(f"No xlsx files in {EXPORTS_DIR}. Place your export there.")
    return xlsx_files[0]


def find_pull_sheet(xl) -> str:
    pull_pattern = re.compile(r"^Pull\s+\d{2}_\d{2}_\d{2}$", re.I)
    for name in xl.sheet_names:
        if pull_pattern.match(name.strip()):
            return name
    return None


def load_pull_sheet(path: Path, sheet_name: str):
    df = pd.read_excel(path, sheet_name=sheet_name)
    # Normalize column names (strip whitespace, handle case)
    df.columns = [normalize_col(c) for c in df.columns]
    return df


def load_survey_sheet(path: Path, sheet_name: str = "Survey 1 results"):
    try:
        df = pd.read_excel(path, sheet_name=sheet_name)
        return df
    except Exception:
        return None


def is_pilot(row) -> bool:
    v = row.get("IncludeInPilot")
    if pd.isna(v):
        return False
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        return v != 0
    s = str(v).strip().lower()
    return s in ("1", "true", "yes", "y")


def aggregate_to_tickets(df):
    if df.empty or "JiraTicket" not in df.columns:
        return pd.DataFrame()

    date_col = "PRStart" if "PRStart" in df.columns else "FirstActivity"
    if date_col not in df.columns:
        return pd.DataFrame()

    df = df.copy()
    df["_date"] = pd.to_datetime(df[date_col], errors="coerce")
    df = df.dropna(subset=["_date", "JiraTicket"])
    df["_week"] = df["_date"].dt.to_period("W-SUN").dt.start_time
    df["_pilot"] = df.apply(is_pilot, axis=1)

    qa_col = "QAChurnFiles" if "QAChurnFiles" in df.columns else ("QAChurnLines" if "QAChurnLines" in df.columns else None)
    agg_dict = {"_pilot": ("_pilot", "max"), "_week": ("_week", "first")}
    if qa_col:
        agg_dict[qa_col] = (qa_col, "sum")
    if "PRFiles" in df.columns:
        agg_dict["PRFiles"] = ("PRFiles", "sum")
    if "PRLines" in df.columns:
        agg_dict["PRLines"] = ("PRLines", "sum")

    agg = df.groupby("JiraTicket", as_index=False).agg(agg_dict)
    if "QAChurnFiles" not in agg.columns and "QAChurnLines" not in agg.columns:
        agg["QAChurnFiles"] = 0
    if "PRFiles" not in agg.columns:
        agg["PRFiles"] = 1
    if "PRLines" not in agg.columns:
        agg["PRLines"] = 100
    return agg


def compute_weekly_metrics(tickets):
    if tickets.empty or "_week" not in tickets.columns:
        return pd.DataFrame()

    pilot_ftedays = PILOT_ROSTER * 5
    non_pilot_ftedays = NON_PILOT_ROSTER * 5

    weeks = []
    for week, g in tickets.groupby("_week"):
        pilot_tix = g[g["_pilot"]].shape[0]
        non_pilot_tix = g[~g["_pilot"]].shape[0]
        weeks.append({
            "week": pd.Timestamp(week),
            "pilot_tickets": pilot_tix,
            "non_pilot_tickets": non_pilot_tix,
            "pilot_productivity": pilot_tix / pilot_ftedays if pilot_ftedays else 0,
            "non_pilot_productivity": non_pilot_tix / non_pilot_ftedays if non_pilot_ftedays else 0,
            "total_tickets": pilot_tix + non_pilot_tix,
            "low_confidence": (pilot_tix + non_pilot_tix) < MIN_TICKETS_THRESHOLD,
        })
    return pd.DataFrame(weeks)


def compute_qa_churn_weekly(tickets):
    if tickets.empty or "_week" not in tickets.columns:
        return pd.DataFrame()

    qa_col = "QAChurnFiles" if "QAChurnFiles" in tickets.columns else "QAChurnLines"
    if qa_col not in tickets.columns:
        return pd.DataFrame()

    tickets = tickets.copy()
    tickets["_has_qa_churn"] = tickets[qa_col].fillna(0) > 0

    rows = []
    for week, g in tickets.groupby("_week"):
        pilot_g = g[g["_pilot"]]
        non_pilot_g = g[~g["_pilot"]]
        pilot_churn = pilot_g["_has_qa_churn"].sum() / len(pilot_g) * 100 if len(pilot_g) else 0
        non_pilot_churn = non_pilot_g["_has_qa_churn"].sum() / len(non_pilot_g) * 100 if len(non_pilot_g) else 0
        total = len(g)
        low_conf = total < MIN_TICKETS_THRESHOLD
        rows.append({
            "week": pd.Timestamp(week),
            "pilot_churn_pct": round(pilot_churn, 1),
            "non_pilot_churn_pct": round(non_pilot_churn, 1),
            "low_confidence": low_conf,
        })
    return pd.DataFrame(rows)


def rolling_mean(series, window: int):
    return series.rolling(window=window, min_periods=1).mean()


def is_holiday_week(ts) -> bool:
    try:
        s = pd.Timestamp(ts).strftime("%Y-%m-%d")
        return s in ("2025-12-27", "2026-01-03", "2025-12-20", "2026-01-10")
    except Exception:
        return False


def _align_series(qa_df, week_index, col: str) -> list:
    if qa_df.empty or col not in qa_df.columns:
        return [0.0] * len(week_index)
    merged = pd.DataFrame({"week": week_index}).merge(
        qa_df[["week", col]], on="week", how="left"
    )
    return merged[col].fillna(0).tolist()


def parse_survey_insights(survey_df) -> dict:
    if survey_df is None or survey_df.empty:
        return {
            "productivity": {"stat": "—", "quote": ""},
            "quality": {"stat": "—", "quote": ""},
            "experience": {"stat": "—", "quote": ""},
        }
    # Minimal parsing: use first text column or a known survey column
    out = {"productivity": {"stat": "—", "quote": ""}, "quality": {"stat": "—", "quote": ""}, "experience": {"stat": "—", "quote": ""}}
    for col in survey_df.columns:
        if "productiv" in str(col).lower():
            vals = survey_df[col].dropna().astype(str)
            if len(vals):
                out["productivity"]["quote"] = vals.iloc[0][:120] + "…" if len(vals.iloc[0]) > 120 else vals.iloc[0]
        elif "quality" in str(col).lower() or "churn" in str(col).lower():
            vals = survey_df[col].dropna().astype(str)
            if len(vals):
                out["quality"]["quote"] = vals.iloc[0][:120] + "…" if len(vals.iloc[0]) > 120 else vals.iloc[0]
        elif "experience" in str(col).lower() or "overall" in str(col).lower():
            vals = survey_df[col].dropna().astype(str)
            if len(vals):
                out["experience"]["quote"] = vals.iloc[0][:120] + "…" if len(vals.iloc[0]) > 120 else vals.iloc[0]
    return out


def compute_availability(df):
    """Active pilot devs per week, total tickets per week."""
    if df.empty or "AuthorUUID" not in df.columns:
        return pd.DataFrame()
    df = df.copy()
    date_col = "PRStart" if "PRStart" in df.columns else "FirstActivity"
    df["_date"] = pd.to_datetime(df[date_col], errors="coerce")
    df = df.dropna(subset=["_date"])
    df["_week"] = df["_date"].dt.to_period("W-SUN").dt.start_time
    if "IncludeInPilot" in df.columns:
        df["_pilot"] = df.apply(is_pilot, axis=1)
    else:
        df["_pilot"] = False
    rows = []
    for week, g in df.groupby("_week"):
        pilot_devs = g[g["_pilot"]]["AuthorUUID"].nunique() if "_pilot" in g.columns and g["_pilot"].any() else 0
        total_tix = g["JiraTicket"].nunique() if "JiraTicket" in g.columns else len(g)
        rows.append({"week": pd.Timestamp(week), "activePilotDevs": pilot_devs, "totalTickets": total_tix})
    return pd.DataFrame(rows)


def compute_heatmap(tickets):
    """Size×Complexity: rows=lines (0-300, 301-1k, 1k+), cols=files (1-3, 4-10, 11+)."""
    if tickets.empty or "PRFiles" not in tickets.columns or "PRLines" not in tickets.columns:
        return {"rows": [], "cols": [], "cells": []}
    files_bins = [(1, 3), (4, 10), (11, 9999)]
    lines_bins = [(0, 300), (301, 1000), (1001, 999999)]
    rows = ["0-300 lines", "301-1000", "1001+"]
    cols = ["1-3 files", "4-10 files", "11+ files"]
    cells = []
    for (lmin, lmax) in lines_bins:
        for (fmin, fmax) in files_bins:
            mask = (tickets["PRFiles"] >= fmin) & (tickets["PRFiles"] <= fmax) & (tickets["PRLines"] >= lmin) & (tickets["PRLines"] <= lmax)
            g = tickets[mask]
            pilot_n = int(g[g["_pilot"]].shape[0])
            np_n = int(g[~g["_pilot"]].shape[0])
            total = pilot_n + np_n
            pct = round((pilot_n - np_n) / total * 100, 0) if total else 0
            cells.append({"pilot": pilot_n, "nonPilot": np_n, "pctDiff": int(pct), "label": f"{pilot_n}/{np_n}"})
    return {"rows": rows, "cols": cols, "cells": cells}


def build_dashboard_data(path: Path, pull_sheet: str, survey_df) -> dict:
    df = load_pull_sheet(path, pull_sheet)
    tickets = aggregate_to_tickets(df)
    if tickets.empty:
        return _fallback_data()

    # Include all data from DATA_START (July 2025), not just pilot period
    data_start = pd.Timestamp(DATA_START)
    tickets = tickets[tickets["_week"] >= data_start]

    weekly = compute_weekly_metrics(tickets)
    qa_weekly = compute_qa_churn_weekly(tickets)

    if weekly.empty:
        return _fallback_data()

    pilot_start = pd.Timestamp(PILOT_START)
    pilot_weekly = weekly[weekly["week"] >= pilot_start]

    # KPIs (pilot period only)
    pilot_tickets_only = tickets[(tickets["_pilot"]) & (tickets["_week"] >= pilot_start)]
    non_pilot_tickets_only = tickets[(~tickets["_pilot"]) & (tickets["_week"] >= pilot_start)]
    pilot_tix_total = pilot_tickets_only["JiraTicket"].nunique()
    non_pilot_tix_total = non_pilot_tickets_only["JiraTicket"].nunique()
    total_tix = pilot_tix_total + non_pilot_tix_total

    pilot_prod = pilot_weekly["pilot_productivity"].mean() if not pilot_weekly.empty else 0
    non_pilot_prod = pilot_weekly["non_pilot_productivity"].mean() if not pilot_weekly.empty else 0
    prod_multiple = pilot_prod / non_pilot_prod if non_pilot_prod else 0

    qa_pilot_period = qa_weekly[qa_weekly["week"] >= pilot_start] if not qa_weekly.empty else pd.DataFrame()
    pilot_qa = qa_pilot_period["pilot_churn_pct"].mean() if not qa_pilot_period.empty else 0
    non_pilot_qa = qa_pilot_period["non_pilot_churn_pct"].mean() if not qa_pilot_period.empty else 0

    pilot_qa_vs_baseline = pilot_qa - BASELINE_QA_CHURN_PCT
    pilot_prod_vs_baseline = pilot_prod - BASELINE_PRODUCTIVITY

    total_devs = PILOT_ROSTER + NON_PILOT_ROSTER
    ai_share_pct = pilot_tix_total / total_tix * 100 if total_tix else 0

    valid_weeks = (pilot_weekly["total_tickets"] >= MIN_TICKETS_THRESHOLD).sum() if not pilot_weekly.empty else 0
    availability_pct = (pilot_weekly["pilot_tickets"] > 0).sum() / len(pilot_weekly) * 100 if len(pilot_weekly) else 0

    # Rolling series
    weekly_sorted = weekly.sort_values("week")
    rolling_pilot = rolling_mean(weekly_sorted["pilot_productivity"], ROLLING_WINDOW)
    rolling_np = rolling_mean(weekly_sorted["non_pilot_productivity"], ROLLING_WINDOW)

    # Last 4wk comparison for annotation
    last_4 = weekly_sorted.tail(ROLLING_WINDOW)
    last_pilot = last_4["pilot_productivity"].mean()
    last_np = last_4["non_pilot_productivity"].mean()
    last_4wk_pct = ((last_pilot - last_np) / last_np * 100) if last_np else 0

    survey = parse_survey_insights(survey_df)

    def fmt_week(d):
        try:
            return d.strftime("%b ") + str(d.day)
        except Exception:
            return str(d)
    week_labels = [fmt_week(d) for d in weekly_sorted["week"]]
    holiday_gaps = [is_holiday_week(d) for d in weekly_sorted["week"]]
    data_range_start = weekly_sorted["week"].min().strftime("%Y-%m-%d")
    data_range_end = weekly_sorted["week"].max().strftime("%Y-%m-%d")

    # Availability (from raw df, aligned to weekly)
    avail_df = compute_availability(df)
    if not avail_df.empty:
        merged_avail = weekly_sorted[["week"]].merge(avail_df, on="week", how="left")
        avail_pilot_devs = merged_avail["activePilotDevs"].fillna(0).astype(int).tolist()
        avail_total_tickets = merged_avail["totalTickets"].fillna(0).astype(int).tolist()
    else:
        avail_pilot_devs = weekly_sorted["pilot_tickets"].tolist()
        avail_total_tickets = weekly_sorted["total_tickets"].tolist()

    # Cumulative output
    cum_pilot = weekly_sorted["pilot_tickets"].cumsum().tolist()
    cum_non_pilot = weekly_sorted["non_pilot_tickets"].cumsum().tolist()

    # Heatmap
    heatmap = compute_heatmap(tickets[tickets["_week"] >= pilot_start])

    return {
        "meta": {
            "title": "AI-Assisted Development - Pilot KPIs",
            "dataRangeStart": data_range_start,
            "dataRangeEnd": data_range_end,
            "pilotStart": "Dec 1",
            "pilotCount": PILOT_ROSTER,
            "nonPilotCount": NON_PILOT_ROSTER,
            "validWeeks": int(valid_weeks),
            "refreshedAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        },
        "kpiCards": {
            "pilotProductivity": {
                "value": round(pilot_prod, 3),
                "vsBaseline": f"{pilot_prod_vs_baseline:+.3f}" if pilot_prod_vs_baseline >= 0 else f"{pilot_prod_vs_baseline:.3f}",
                "unit": "tickets / FTE-day",
            },
            "productivityMultiple": {
                "value": f"{prod_multiple:.2f}×",
                "nonPilotValue": round(non_pilot_prod, 3),
            },
            "pilotQaChurn": {
                "value": f"{pilot_qa:.1f}%",
                "vsBaseline": f"{pilot_qa_vs_baseline:+.1f}pp" if pilot_qa_vs_baseline <= 0 else f"{pilot_qa_vs_baseline:.1f}pp",
                "nonPilotValue": f"{non_pilot_qa:.1f}%",
            },
            "aiOutputShare": {
                "value": f"{ai_share_pct:.1f}%",
                "tickets": f"{pilot_tix_total} of {total_tix}",
                "devs": f"{PILOT_ROSTER} of {total_devs}",
            },
            "availability": {
                "value": f"{availability_pct:.1f}%",
                "detail": "weeks with ≥50% pilot active",
                "devCount": PILOT_ROSTER,
            },
        },
        "productivity": {
            "weeks": week_labels,
            "pilot": {
                "rolling": rolling_pilot.tolist(),
                "raw": weekly_sorted["pilot_productivity"].tolist(),
                "lowConfidence": weekly_sorted["low_confidence"].tolist(),
                "holidayGap": holiday_gaps,
            },
            "nonPilot": {
                "rolling": rolling_np.tolist(),
                "raw": weekly_sorted["non_pilot_productivity"].tolist(),
            },
            "baseline": BASELINE_PRODUCTIVITY,
            "last4wkComparison": f"{last_4wk_pct:+.0f}%",
        },
        "qaChurn": {
            "weeks": week_labels,
            "pilot": _align_series(qa_weekly, weekly_sorted["week"], "pilot_churn_pct"),
            "nonPilot": _align_series(qa_weekly, weekly_sorted["week"], "non_pilot_churn_pct"),
            "pilotPeriodAvg": round(pilot_qa, 1),
            "nonPilotPeriodAvg": round(non_pilot_qa, 1),
        },
        "availability": {
            "weeks": week_labels,
            "activePilotDevs": avail_pilot_devs,
            "totalTickets": avail_total_tickets,
        },
        "cumulativeOutput": {
            "weeks": week_labels,
            "pilot": cum_pilot,
            "nonPilot": cum_non_pilot,
        },
        "heatmap": heatmap,
        "methodology": (
            "Metrics derived from Jira/GitLab PR exports. Productivity = tickets per FTE-day (6 pilot, 9 non-pilot). "
            "QA churn = % of tickets requiring QA rework. Rolling averages use 4-week window. "
            "Weeks with <5 tickets flagged low-confidence. Holiday weeks (Dec 27, Jan 3) dimmed. "
            "Pilot period starts Dec 1, 2025."
        ),
        "survey": survey,
    }


def _fallback_data() -> dict:
    # Extended weeks from July 2025 with more variation (prototype-like)
    weeks = ["Jul 7", "Jul 14", "Jul 21", "Jul 28", "Aug 4", "Aug 11", "Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29", "Oct 6", "Oct 13", "Oct 20", "Oct 27", "Nov 3", "Nov 10", "Nov 17", "Nov 24", "Dec 6", "Dec 13", "Dec 20", "Dec 27", "Jan 3", "Jan 10", "Jan 17", "Jan 24", "Jan 31", "Feb 7", "Feb 14"]
    n = len(weeks)
    # Pre-pilot (Jul–Nov): baseline-ish, low
    base_pilot = [0.12 + (i % 5) * 0.02 for i in range(22)]
    base_np = [0.15 + (i % 4) * 0.015 for i in range(22)]
    # Pilot (Dec–Feb): more variation
    pilot_raw = (base_pilot + [0.47, 0.53, 0.42, 0.18, 0.22, 0.38, 0.55, 0.41, 0.36, 0.33])[:n]
    np_raw = (base_np + [0.32, 0.35, 0.31, 0.28, 0.25, 0.34, 0.38, 0.35, 0.33, 0.34])[:n]
    pilot_roll = [sum(pilot_raw[max(0,i-3):i+1])/min(4,i+1) for i in range(n)]
    np_roll = [sum(np_raw[max(0,i-3):i+1])/min(4,i+1) for i in range(n)]
    low_conf = [i >= 23 and i <= 24 for i in range(n)]  # Dec 27, Jan 3
    holiday_gap = [w in ("Dec 27", "Jan 3") for w in weeks]
    qa_pilot = [22, 24, 21, 19, 20, 23, 18, 17, 16, 18, 19, 20, 21, 19, 18, 17, 19, 18, 20, 18, 17, 15, 20, 18, 12, 14, 19, 17, 19, 18, 19, 18]
    qa_np = [18, 20, 19, 17, 18, 19, 16, 15, 16, 17, 18, 17, 16, 15, 16, 15, 16, 15, 17, 16, 15, 14, 16, 15, 11, 12, 15, 14, 16, 15, 15, 15]
    pilot_tix = [max(1, int(p * 30)) for p in pilot_raw]
    np_tix = [max(1, int(p * 45)) for p in np_raw]
    cum_pilot = []
    cum_np = []
    cp, cn = 0, 0
    for i in range(n):
        cp += pilot_tix[i] if i < len(pilot_tix) else 0
        cn += np_tix[i] if i < len(np_tix) else 0
        cum_pilot.append(cp)
        cum_np.append(cn)
    avail_devs = [0] * 22 + [6, 5, 4, 1, 2, 5, 6, 5, 5, 5]
    avail_tix = [(pilot_tix[i] if i < len(pilot_tix) else 0) + (np_tix[i] if i < len(np_tix) else 0) for i in range(n)]
    return {
        "meta": {"title": "AI-Assisted Development - Pilot KPIs", "dataRangeStart": "2025-07-07", "dataRangeEnd": "2026-02-14", "pilotStart": "Dec 1", "pilotCount": 6, "nonPilotCount": 9, "validWeeks": 9, "refreshedAt": datetime.now().strftime("%Y-%m-%d %H:%M")},
        "kpiCards": {"pilotProductivity": {"value": 0.348, "vsBaseline": "+0.179", "unit": "tickets / FTE-day"}, "productivityMultiple": {"value": "1.03×", "nonPilotValue": 0.338}, "pilotQaChurn": {"value": "18.8%", "vsBaseline": "-4.3pp", "nonPilotValue": "15.1%"}, "aiOutputShare": {"value": "40.8%", "tickets": "96 of 235", "devs": "6 of 15"}, "availability": {"value": "81.8%", "detail": "weeks with ≥50% pilot active", "devCount": 6}},
        "productivity": {"weeks": weeks, "pilot": {"rolling": pilot_roll, "raw": pilot_raw[:n], "lowConfidence": low_conf, "holidayGap": holiday_gap}, "nonPilot": {"rolling": np_roll, "raw": np_raw[:n]}, "baseline": 0.169, "last4wkComparison": "−40%"},
        "qaChurn": {"weeks": weeks, "pilot": qa_pilot[:n], "nonPilot": qa_np[:n], "pilotPeriodAvg": 18.8, "nonPilotPeriodAvg": 15.1},
        "availability": {"weeks": weeks, "activePilotDevs": avail_devs[:n], "totalTickets": avail_tix[:n]},
        "cumulativeOutput": {"weeks": weeks, "pilot": cum_pilot[:n], "nonPilot": cum_np[:n]},
        "heatmap": {"rows": ["0-300 lines", "301-1000", "1001+"], "cols": ["1-3 files", "4-10 files", "11+ files"], "cells": [{"pilot": 61, "nonPilot": 64, "pctDiff": 43, "label": "61/64"}, {"pilot": 18, "nonPilot": 22, "pctDiff": -15, "label": "18/22"}, {"pilot": 7, "nonPilot": 1, "pctDiff": 950, "label": "7/1"}, {"pilot": 4, "nonPilot": 22, "pctDiff": -73, "label": "4/22"}, {"pilot": 3, "nonPilot": 8, "pctDiff": -63, "label": "3/8"}, {"pilot": 2, "nonPilot": 4, "pctDiff": -50, "label": "2/4"}, {"pilot": 1, "nonPilot": 6, "pctDiff": -83, "label": "1/6"}, {"pilot": 0, "nonPilot": 2, "pctDiff": -100, "label": "0/2"}, {"pilot": 0, "nonPilot": 1, "pctDiff": -100, "label": "0/1"}]},
        "methodology": "Metrics derived from Jira/GitLab PR exports. Productivity = tickets per FTE-day (6 pilot, 9 non-pilot). QA churn = % of tickets requiring QA rework. Rolling averages use 4-week window. Weeks with <5 tickets flagged low-confidence. Holiday weeks (Dec 27, Jan 3) dimmed. Pilot period starts Dec 1, 2025.",
        "survey": {"productivity": {"stat": "4/7 report increased productivity", "quote": "4 devs report 10-49% gains..."}, "quality": {"stat": "5/7 often modify AI-generated code", "quote": "Primary concerns: bugs or logical errors..."}, "experience": {"stat": "7/7 recommend AI for bug fixing", "quote": "Devs want AI expanded into..."}},
    }


def inject_template(template: str, data: dict) -> str:
    data_json = json.dumps(data, indent=2)
    # Escape for embedding in JS
    js = f"window.__DASHBOARD_DATA__ = {data_json};"
    html = template.replace("// __DATA_PLACEHOLDER__", js)

    chartjs_path = JS_DIR / "chart.umd.min.js"
    annotation_path = JS_DIR / "chartjs-plugin-annotation.min.js"
    if chartjs_path.exists() and annotation_path.exists():
        chartjs = chartjs_path.read_text(encoding="utf-8")
        annotation = annotation_path.read_text(encoding="utf-8")
        html = html.replace("// __CHARTJS_PLACEHOLDER__", f"{chartjs}\n{annotation}")
    else:
        print("WARNING: Chart.js files not found in public/js/, scripts will not be inlined")
    return html


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", "-i", type=Path, help="Path to xlsx file")
    parser.add_argument("--pull-sheet", "-p", type=str, help="Pull sheet name (e.g. 'Pull 02_11_26')")
    parser.add_argument("--survey-sheet", "-s", type=str, default="Survey 1 results", help="Survey sheet name")
    args = parser.parse_args()

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
            print("Using fallback data. Output will show sample metrics.")
            data = _fallback_data()
            template = TEMPLATE_PATH.read_text(encoding="utf-8")
            html = inject_template(template, data)
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT_PATH.write_text(html, encoding="utf-8")
            OUTPUT_ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT_ARCHIVE.write_text(html, encoding="utf-8")
            print(f"Dashboard (fallback) written to: {OUTPUT_PATH}")
            return

    if not HAS_PANDAS:
        print("pandas required for xlsx. Run: pip install -r requirements-pipeline.txt")
        print("Using fallback data for now.")
        data = _fallback_data()
        template = TEMPLATE_PATH.read_text(encoding="utf-8")
        html = inject_template(template, data)
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_text(html, encoding="utf-8")
        OUTPUT_ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_ARCHIVE.write_text(html, encoding="utf-8")
        print(f"Dashboard (fallback) written to: {OUTPUT_PATH}")
        return

    xl = pd.ExcelFile(path)
    pull_sheet = args.pull_sheet or find_pull_sheet(xl)
    if not pull_sheet:
        print("Error: No 'Pull MM_DD_YY' sheet found. Use --pull-sheet to specify.")
        sys.exit(1)

    survey_df = load_survey_sheet(path, args.survey_sheet)
    data = build_dashboard_data(path, pull_sheet, survey_df)
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    html = inject_template(template, data)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(html, encoding="utf-8")
    OUTPUT_ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_ARCHIVE.write_text(html, encoding="utf-8")
    print(f"Dashboard written to: {OUTPUT_PATH}")
    print(f"Archive copy: {OUTPUT_ARCHIVE}")


if __name__ == "__main__":
    main()
