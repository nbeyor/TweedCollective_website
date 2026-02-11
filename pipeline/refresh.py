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
    """Replace the DATA_PLACEHOLDER in the template with JSON-encoded rows."""
    data_json = json.dumps(rows, indent=2)
    return template.replace("// __DATA_PLACEHOLDER__", f"const DATA = {data_json};")


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
