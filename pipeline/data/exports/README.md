# Dashboard Data Exports

Place your most recent xlsx export here. The `refresh.py` pipeline reads from this directory.

**Usage:**
```bash
python pipeline/refresh.py
# Uses the latest xlsx; auto-detects Pull sheet

python pipeline/refresh.py --input pipeline/data/exports/your_file.xlsx --pull-sheet "Pull 02_11_26"
```

## Sheet names

Use these tab names in your xlsx (recommended) so you don’t need to update each export:

- **Current dashboard data** – PR/Jira metrics (preferred over legacy `Pull MM_DD_YY`)
- **Current survey data** – developer survey results (preferred over legacy `Survey 1 results`)

The pipeline will fall back to `Pull 02_11_26`-style and `Survey 1 results` if the generic names are missing.

## Filename convention

Include a date in the filename so the export date appears on the dashboard:

- `dashboard_2026-02-16.xlsx`
- `Pilot_Export_20260216.xlsx`
- `metrics_2026_02_16.xlsx`

Any format with `YYYY-MM-DD`, `YYYY_MM_DD`, or `YYYYMMDD` is parsed. If none is found, the file’s modification date is used.

## Dashboard data sheet – required columns

| Column | Type | Description |
|--------|------|-------------|
| JiraTicket | string | Ticket ID (primary key) |
| Title | string | Ticket title |
| FirstActivity | date | First activity date |
| FirstReadyForQADate | date | Ready for QA date |
| PRStart | date | PR start (used for week bucketing if present) |
| PREnd | date | PR end |
| AuthorUUID | string | Developer identifier |
| IncludeInPilot | bool/number | True/1 = pilot; False/0 = non-pilot. Pilot data only from Dec 1 onward. |
| PRFiles | number | Files changed in PR |
| PRLines | number | Lines changed in PR |
| PRAI | number | AI-related metric |
| ChurnFiles | number | Churn files |
| ChurnLines | number | Churn lines |
| ChurnAI | number | Churn AI metric |
| QAChurnFiles | number | QA rework files (used for QA churn %) |
| QAChurnLines | number | QA rework lines (fallback if QAChurnFiles missing) |
| QAChurnAI | number | QA churn AI metric |

**Date bucketing:** Uses `PRStart` if present, else `FirstActivity`. Weeks are Sunday-start.

**Pilot vs non-pilot:** `IncludeInPilot` true = pilot. Non-pilot spans all weeks. Pilot counts only from Dec 1, 2025 onward.

## Survey sheet (optional)

Sheet name: **Current survey data** (or legacy `Survey 1 results`). Used for developer survey insights. Any column structure; pipeline looks for productivity, quality, and experience-related columns.
