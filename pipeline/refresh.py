#!/usr/bin/env python3
"""
Dashboard data pipeline.

Reads the latest data export from pipeline/data/, renders it into
dashboard_template.html, and writes the result to
content/documents/dashboard.html so the Next.js API route can serve it.

Usage:
    python3 pipeline/refresh.py                 # uses latest CSV in pipeline/data/
    python3 pipeline/refresh.py path/to/data.csv  # explicit file
"""

import csv
import json
import os
import sys
from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = PIPELINE_DIR.parent
TEMPLATE_PATH = PIPELINE_DIR / "dashboard_template.html"
OUTPUT_PATH = PROJECT_ROOT / "content" / "documents" / "dashboard.html"
DATA_DIR = PIPELINE_DIR / "data"
JS_DIR = PROJECT_ROOT / "public" / "js"


def find_latest_csv() -> Path:
    """Return the most-recently-modified CSV in pipeline/data/."""
    csvs = sorted(DATA_DIR.glob("*.csv"), key=os.path.getmtime, reverse=True)
    if not csvs:
        sys.exit(f"No CSV files found in {DATA_DIR}")
    return csvs[0]


def load_data(csv_path: Path) -> list[dict]:
    """Read a CSV file and return a list of row dicts."""
    with open(csv_path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def render(template: str, rows: list[dict]) -> str:
    """Replace placeholders in the template with data and inlined JS libraries."""
    data_json = json.dumps(rows, indent=2)
    html = template.replace("// __DATA_PLACEHOLDER__", f"window.__DASHBOARD_DATA__ = {data_json};")

    # Inline Chart.js and annotation plugin to avoid external script loading issues
    chartjs_path = JS_DIR / "chart.umd.min.js"
    annotation_path = JS_DIR / "chartjs-plugin-annotation.min.js"

    if chartjs_path.exists() and annotation_path.exists():
        chartjs = chartjs_path.read_text(encoding="utf-8")
        annotation = annotation_path.read_text(encoding="utf-8")
        html = html.replace(
            "// __CHARTJS_PLACEHOLDER__",
            f"{chartjs}\n{annotation}"
        )
    else:
        print("WARNING: Chart.js files not found in public/js/, scripts will not be inlined")

    return html


def main():
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else find_latest_csv()
    print(f"Reading data from: {csv_path}")

    rows = load_data(csv_path)
    print(f"Loaded {len(rows)} rows")

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    html = render(template, rows)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(html, encoding="utf-8")
    print(f"Dashboard written to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
