---
name: refresh-dashboard
description: Refresh the eCS SDLC copilot dashboard from the latest "Pull Requests and AI" export emailed by David Hughes. Pulls the xlsx attachment from Gmail/Drive, converts it to per-sheet CSVs in content/documents/uploads/, regenerates public/data/copilot-dashboard-data.json, verifies the result, and commits + pushes. Use whenever the user says "refresh the dashboard", "pull the latest data from my email", "update the copilot/SDLC dashboard", or a new weekly data email has arrived. Run end-to-end without asking for confirmation — the required permissions are pre-approved in .claude/settings.json.
---

# Refresh the eCS SDLC Dashboard from Email

End-to-end flow: Gmail → CSVs in uploads → dashboard JSON → commit + push.
Run every step without pausing to ask; all tools used here are allowlisted in
`.claude/settings.json`. Keep Bash calls **single simple commands from the repo
root** (no `cd x && ...`, no inline heredocs) so they match the allowlist and
never prompt.

## 0. One-time session setup

```bash
pip install --quiet pandas openpyxl
```
(The cloud container is ephemeral; these are gone each new session.)

## 1. Find the email

Use the Gmail MCP tool `search_threads` (server may appear as `Gmail` or a UUID):

```
query: from:dhughes@eclinicalsol.com has:attachment newer_than:14d
```

Then `get_message` on the newest message to read the attachment filename —
expected form: `Pull Requests and AI YYYY MM DD.xlsx`.

## 2. Download the attachment bytes

The Gmail MCP server cannot download attachment bytes. The same file is synced
to the user's Google Drive, so use the Drive MCP tools:

1. `search_files` with `title contains 'Pull Requests and AI'` — match the
   exact filename from step 1 (verify `fileSize` > 0; ignore 0-byte duds).
2. `download_file_content` with that `fileId`. The result is too large for
   context, so the harness saves it to a file and returns the path
   (JSON: `{content: <base64>, title, mimeType}`). That saved path is the input
   to the next step. Do NOT use `read_file_content` for this — its text
   rendering flattens rows and merges the two sheets (lossy).

If the file is not in Drive, stop and tell the user; do not improvise another
transfer route for the binary.

## 3. Convert to CSVs in uploads

```bash
python3 pipeline/ingest_email_export.py <saved-tool-result-path>
```

Writes one CSV per sheet to `content/documents/uploads/`:
- `Pull Requests and AI YYYY MM DD - Pull Requests.csv` (~19 cols)
- `Pull Requests and AI YYYY MM DD - AI Usage.csv` (~10 cols)

## 4. Refresh the dashboard

```bash
python3 pipeline/refresh_copilot.py
```

With no `--input` it automatically uses the newest `* - Pull Requests.csv` in
uploads and its sibling `* - AI Usage.csv`, and rewrites
`public/data/copilot-dashboard-data.json` (the only file the live
`/clients/ecs/sdlc-dashboard` reads).

Expected behaviors, not errors:
- **"NO NEW DATA INGESTED"** (exit 1): the export contains nothing new; the
  dashboard is already current. Report that and stop — nothing to commit.
- **"STALE SOURCE DATA" warning**: refresh succeeded but the export itself is
  old; relay the warning to the user.

## 5. Verify before committing

Compare old vs new JSON (`git diff --stat`, or load both and check
`dataCutoff`, `dataRange`, and the last few `weekly` entries). Confirm the
cutoff moved forward and the new trailing week looks plausible. Small revisions
to recent historical weeks are normal — upstream corrects PR dates between
exports.

## 6. Commit and push

Commit the new CSVs and the regenerated JSON together with a message like
`Refresh copilot dashboard with <date> export` (include new cutoff + headline
deltas). Push to the current working branch. Do not open a PR unless asked.

## Notes

- CSVs in `content/documents/uploads/` are the canonical dashboard source; the
  xlsx itself is not committed. Legacy xlsx drops in `pipeline/data/exports/`
  still work as a fallback (see `pipeline/data/exports/README.md`).
- `pipeline/output/user-id-map.json` (identity drill-down map) is regenerated
  locally and intentionally not committed.
