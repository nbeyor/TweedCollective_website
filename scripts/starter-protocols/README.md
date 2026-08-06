# Starter protocols — publish to Drive

The three "starting point" documents the Protocol Strategist offers at the top of
its document picker, as standalone HTML ready to become Google Docs:

| File | Picker item |
|---|---|
| `01-nsclc-design-brief.html` | Drafted NSCLC Phase 2 (TCX-LUNG) design brief — the hero brief the tool opens on |
| `02-tcx-0056-fh-phase3.html` | Example protocol TCX-0056 — Familial Hypercholesterolemia, Phase 3 |
| `03-tcx-0028-ra-phase2.html` | Example protocol TCX-0028 — Rheumatoid Arthritis, Phase 2 |

`manifest.json` maps each file to its Google Doc title.

All three are **synthetic**, generated from the trial corpus, and carry a
demonstration-only disclaimer at the top of the document.

## Publishing them to the work Drive

`../publish-starter-protocols.mjs` uses the same machinery as the platform
(`lib/googleDocs.ts`): a Google service account with domain-wide delegation,
impersonating a Workspace user, creating the Docs in a configured folder. It owns
the files as that Workspace user — so they land in the work Drive, not a personal one.

Set the same three environment variables the platform uses, then run it:

```bash
export GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=...      # base64 of the service account key
export GOOGLE_DRIVE_FOLDER_ID=...                   # the "IntelX demo" folder ID (from its URL)
export GOOGLE_IMPERSONATE_USER=nate.beyor@tweedcollective.ai

# from the repo root, with dependencies installed (npm install):
node scripts/publish-starter-protocols.mjs --dry-run   # auth + folder writability check only
node scripts/publish-starter-protocols.mjs             # create the three Docs
```

`--dry-run` authenticates and confirms the target folder is writable without
creating anything. Without it, the script creates the three Docs and prints each
`webViewLink`.

To find `GOOGLE_DRIVE_FOLDER_ID`: open the destination folder in Drive; the ID is
the last path segment of the URL
(`https://drive.google.com/drive/folders/<THIS_ID>`).
