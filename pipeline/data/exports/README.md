# Dashboard Data Exports

> **Preferred flow:** the `refresh-dashboard` skill (`.claude/skills/refresh-dashboard/`)
> pulls the weekly export from email, writes per-sheet CSVs to
> `content/documents/uploads/`, and runs the pipeline — those CSVs take
> precedence over this directory. The xlsx drop below still works as a fallback.

Place your most recent xlsx export here. The `refresh_copilot.py` pipeline reads from this
directory and writes `public/data/copilot-dashboard-data.json`, which is the **only** data
file the live eCS SDLC dashboard (`/clients/ecs/sdlc-dashboard`) renders.

**Usage:**
```bash
python pipeline/refresh_copilot.py
# Uses the latest xlsx (by modification time); auto-detects the Pull sheet
# and the Copilot/AI telemetry sheet (AI All, or legacy Copilot_All)

python pipeline/refresh_copilot.py --input "pipeline/data/exports/your_file.xlsx" --sheet "Pull 02_11_26"
```

The pipeline refuses to run as a no-op: if the regenerated JSON is identical to the
existing one (i.e. the export contains no new data), it exits with an error instead of
bumping the timestamp, and it warns when the newest activity in the export is more than
a week old. After a successful run, commit both the new export and the regenerated
`public/data/copilot-dashboard-data.json`.

## Sheet names

Use these tab names in your xlsx (recommended) so you don’t need to update each export:

- **Current dashboard data** – PR/Jira metrics (preferred over legacy `Pull MM_DD_YY`)
- **AI All** – Copilot/AI telemetry (preferred over legacy `Copilot_All`)
- **Current survey data** – developer survey results (preferred over legacy `Survey 1 results`)

The pipeline will fall back to the legacy names if the generic names are missing.

## Filename convention

Include a date in the filename so exports sort predictably:

- `20260708 PullRequests and AI.xlsx`
- `dashboard_2026-02-16.xlsx`

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
| PRFiles | number | Files changed in PR |
| PRLines | number | Lines changed in PR |
| PRAI | number | AI-related metric |
| ChurnFiles | number | Churn files |
| ChurnLines | number | Churn lines |
| ChurnAI | number | Churn AI metric |
| QAChurnFiles | number | QA rework files (used for QA churn %) |
| QAChurnLines | number | QA rework lines (fallback if QAChurnFiles missing) |
| QAChurnAI | number | QA churn AI metric |

**Date bucketing:** Uses `PREnd` for week assignment.

## Survey sheet (optional)

Sheet name: **Current survey data** (or legacy `Survey 1 results`). Used for developer survey insights. Any column structure; pipeline looks for productivity, quality, and experience-related columns.
