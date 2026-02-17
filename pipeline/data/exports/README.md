# Dashboard Data Exports

Place your most recent xlsx export here. The `refresh.py` pipeline reads from this directory.

**Usage:**
```bash
python pipeline/refresh.py
# Uses the latest xlsx; auto-detects Pull sheet

python pipeline/refresh.py --input pipeline/data/exports/your_file.xlsx --pull-sheet "Pull 02_11_26"
```

## Pull Sheet – Required Columns

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

## Survey Sheet (Optional)

Sheet name: `Survey 1 results`. Used for developer survey insights. Any column structure; pipeline looks for productivity, quality, and experience-related columns.
