# Dashboard Data Exports

Place your most recent xlsx export here. The `refresh.py` pipeline reads from this directory.

**Usage:**
```bash
python pipeline/refresh.py
# Uses the latest xlsx in this directory; specify sheet via --sheet "Tab Name"

python pipeline/refresh.py --input pipeline/data/exports/your_file.xlsx --sheet "Pull 02_11_26"
```

**Expected structure:**  
- Primary tab: PR-level data with columns such as `JiraTicket`, `AuthorUUID`, `IncludeInPilot`, `PRFiles`, `PRLines`, `PRAI`, `QAChurnFiles`, `QAChurnLines`, etc.  
- Optional: `Survey 1 results` tab for developer survey data.
