# Dashboard Data Schema

`window.__DASHBOARD_DATA__` must conform to this structure. The template expects these keys.

## meta

| Key | Type | Description |
|-----|------|-------------|
| title | string | Dashboard title |
| dataRangeStart | string | ISO date (YYYY-MM-DD) or empty |
| dataRangeEnd | string | ISO date (YYYY-MM-DD) or empty |
| pilotStart | string | e.g. "Dec 1" |
| pilotCount | number | Number of pilot developers |
| nonPilotCount | number | Number of non-pilot developers |
| validWeeks | number | Weeks with ≥5 tickets |
| refreshedAt | string | Timestamp of last refresh |
| noData | boolean | (optional) True when no xlsx data available |

## kpiCards

| Key | Sub-object | Description |
|-----|------------|-------------|
| pilotProductivity | value (number\|null), vsBaseline (string), unit (string) | Pilot productivity KPI |
| productivityMultiple | value (string), nonPilotValue (number\|null) | Pilot vs non-pilot multiple |
| pilotQaChurn | value (string), vsBaseline (string), nonPilotValue (string) | QA churn % |
| aiOutputShare | value (string), tickets (string), devs (string) | Share of output |
| availability | value (string), detail (string), devCount (number) | Weeks with pilot active |

## productivity

| Key | Type | Description |
|-----|------|-------------|
| weeks | string[] | Week labels (e.g. "Jul 7", "Dec 6") |
| pilot | rolling (number\|null)[], raw (number\|null)[], lowConfidence (boolean)[], holidayGap (boolean)[] | Pilot series; null for weeks before Dec 1 |
| nonPilot | rolling (number)[], raw (number)[] | Non-pilot series |
| baseline | number | Baseline productivity |
| last4wkComparison | string | e.g. "+15%" or "—" |

## qaChurn

| Key | Type | Description |
|-----|------|-------------|
| weeks | string[] | Same as productivity.weeks |
| pilot | (number\|null)[] | % QA churn; null for weeks before Dec 1 |
| nonPilot | number[] | % QA churn |
| pilotPeriodAvg | number\|null | Pilot period average |
| nonPilotPeriodAvg | number\|null | Non-pilot period average |

## availability

| Key | Type | Description |
|-----|------|-------------|
| weeks | string[] | Week labels |
| activePilotDevs | number[] | Active pilot devs per week |
| totalTickets | number[] | Total tickets per week |

## cumulativeOutput

| Key | Type | Description |
|-----|------|-------------|
| weeks | string[] | Week labels |
| pilot | (number\|null)[] | Cumulative pilot tickets; null before Dec 1 |
| nonPilot | number[] | Cumulative non-pilot tickets |

## heatmap

| Key | Type | Description |
|-----|------|-------------|
| rows | string[] | e.g. ["0-300 lines", "301-1000", "1001+"] |
| cols | string[] | e.g. ["1-3 files", "4-10 files", "11+ files"] |
| cells | { pilot, nonPilot, pctDiff, label }[] | Row-major (rows × cols) |

## survey

| Key | Sub-object | Description |
|-----|------------|-------------|
| productivity | stat (string), quote (string) | Survey findings |
| quality | stat (string), quote (string) | |
| experience | stat (string), quote (string) | |

## methodology

string – Methodology description.

## Empty State

When no xlsx or no valid data, use `meta.noData: true` and empty arrays for `weeks`, `pilot`, `nonPilot`, etc. KPI values may be `null` or `"—"`. Never use synthetic/fake metrics.
