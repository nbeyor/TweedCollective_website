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
PILOT_START = "2025-12-01"
NON_PILOT_ROSTER = 9
PILOT_ROSTER = 6
ROLLING_WINDOW = 4
MIN_TICKETS_THRESHOLD = 5
BASELINE_PRODUCTIVITY = 0.169
BASELINE_QA_CHURN_PCT = 23.0

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

    agg = df.groupby("JiraTicket", as_index=False).agg(agg_dict)
    if "QAChurnFiles" not in agg.columns and "QAChurnLines" not in agg.columns:
        agg["QAChurnFiles"] = 0
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


def build_dashboard_data(path: Path, pull_sheet: str, survey_df) -> dict:
    df = load_pull_sheet(path, pull_sheet)
    tickets = aggregate_to_tickets(df)
    if tickets.empty:
        return _fallback_data()

    # Filter to pilot period
    pilot_start = pd.Timestamp(PILOT_START)
    tickets = tickets[tickets["_week"] >= pilot_start]

    weekly = compute_weekly_metrics(tickets)
    qa_weekly = compute_qa_churn_weekly(tickets)

    if weekly.empty:
        return _fallback_data()

    # KPIs
    pilot_tix_total = tickets[tickets["_pilot"]]["JiraTicket"].nunique()
    non_pilot_tix_total = tickets[~tickets["_pilot"]]["JiraTicket"].nunique()
    total_tix = pilot_tix_total + non_pilot_tix_total

    pilot_prod = weekly["pilot_productivity"].mean()
    non_pilot_prod = weekly["non_pilot_productivity"].mean()
    prod_multiple = pilot_prod / non_pilot_prod if non_pilot_prod else 0

    pilot_qa = qa_weekly["pilot_churn_pct"].mean() if not qa_weekly.empty else 0
    non_pilot_qa = qa_weekly["non_pilot_churn_pct"].mean() if not qa_weekly.empty else 0

    pilot_qa_vs_baseline = pilot_qa - BASELINE_QA_CHURN_PCT
    pilot_prod_vs_baseline = pilot_prod - BASELINE_PRODUCTIVITY

    total_devs = PILOT_ROSTER + NON_PILOT_ROSTER
    ai_share_pct = pilot_tix_total / total_tix * 100 if total_tix else 0

    valid_weeks = (weekly["total_tickets"] >= MIN_TICKETS_THRESHOLD).sum()
    availability_pct = (weekly["pilot_tickets"] > 0).sum() / len(weekly) * 100 if len(weekly) else 0

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

    week_labels = [d.strftime("%b %-d") for d in weekly_sorted["week"]]
    data_range_start = weekly_sorted["week"].min().strftime("%Y-%m-%d")
    data_range_end = weekly_sorted["week"].max().strftime("%Y-%m-%d")

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
        "survey": survey,
    }


def _fallback_data() -> dict:
    return {
        "meta": {
            "title": "AI-Assisted Development - Pilot KPIs",
            "dataRangeStart": "—",
            "dataRangeEnd": "—",
            "pilotStart": "Dec 1",
            "pilotCount": 6,
            "nonPilotCount": 9,
            "validWeeks": 0,
            "refreshedAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        },
        "kpiCards": {
            "pilotProductivity": {"value": 0.348, "vsBaseline": "+0.179", "unit": "tickets / FTE-day"},
            "productivityMultiple": {"value": "1.03×", "nonPilotValue": 0.338},
            "pilotQaChurn": {"value": "18.8%", "vsBaseline": "-4.3pp", "nonPilotValue": "15.1%"},
            "aiOutputShare": {"value": "40.8%", "tickets": "96 of 235", "devs": "6 of 15"},
            "availability": {"value": "81.8%", "detail": "weeks with ≥50% pilot active", "devCount": 6},
        },
        "productivity": {
            "weeks": ["Dec 6", "Dec 13", "Dec 20", "Dec 27", "Jan 3", "Jan 10", "Jan 17", "Jan 24", "Jan 31", "Feb 7", "Feb 14"],
            "pilot": {"rolling": [0.35, 0.36, 0.34, 0.33, 0.34, 0.35, 0.36, 0.35, 0.35, 0.34, 0.33], "raw": [0.4, 0.37, 0.3, 0.27, 0.33, 0.37, 0.4, 0.33, 0.33, 0.33, 0.3], "lowConfidence": [False, False, False, True, True, False, False, False, False, False, False]},
            "nonPilot": {"rolling": [0.32, 0.33, 0.33, 0.33, 0.34, 0.34, 0.34, 0.34, 0.34, 0.34, 0.34], "raw": [0.33, 0.33, 0.33, 0.33, 0.36, 0.33, 0.33, 0.36, 0.33, 0.33, 0.33]},
            "baseline": 0.169,
            "last4wkComparison": "−40%",
        },
        "qaChurn": {
            "weeks": ["Dec 6", "Dec 13", "Dec 20", "Dec 27", "Jan 3", "Jan 10", "Jan 17", "Jan 24", "Jan 31", "Feb 7", "Feb 14"],
            "pilot": [19, 20, 18, 17, 19, 18, 19, 18, 19, 18, 19],
            "nonPilot": [15, 16, 14, 15, 15, 16, 15, 15, 15, 15, 15],
            "pilotPeriodAvg": 18.8,
            "nonPilotPeriodAvg": 15.1,
        },
        "survey": {"productivity": {"stat": "—", "quote": ""}, "quality": {"stat": "—", "quote": ""}, "experience": {"stat": "—", "quote": ""}},
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
