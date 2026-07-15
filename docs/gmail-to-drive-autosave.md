# Auto-save David's weekly export from Gmail to Drive

The `refresh-dashboard` skill fetches the "Pull Requests and AI" xlsx from
Google Drive, because the Gmail connector cannot download attachment bytes.
This one-time Apps Script setup removes the manual "save attachment to Drive"
step: it runs in your Google account on a timer and files each new export into
the Drive folder the skill already reads from.

## One-time setup (~5 minutes)

1. Go to <https://script.google.com> (logged in as nbeyor@gmail.com) →
   **New project**. Name it e.g. `Save PR-AI exports to Drive`.
2. Replace the editor contents with the script below.
3. Click **Run** once (function `savePrAiExports`) and approve the
   authorization prompts (Gmail read + Drive write, your account only).
4. Left sidebar → **Triggers** (clock icon) → **Add Trigger**:
   - Function: `savePrAiExports`
   - Event source: **Time-driven**
   - Type: **Minutes timer**, every **15 minutes** (or hourly — the email is
     weekly, so latency barely matters)
5. Done. Each new export lands in the Drive folder automatically; duplicates
   are skipped by filename.

## The script

```javascript
// Saves "Pull Requests and AI *.xlsx" attachments from David Hughes into the
// Drive folder the dashboard refresh skill reads from. Dedupes by filename.

const FOLDER_ID = '1TFuZFXtEoE2uRhWSdfLxSuSCF-nNcc4J'; // "Pull Requests and AI" exports folder
const SENDER = 'dhughes@eclinicalsol.com';
const NAME_PATTERN = /^Pull Requests and AI .*\.xlsx$/i;

function savePrAiExports() {
  const folder = DriveApp.getFolderById(FOLDER_ID);

  const existing = new Set();
  const files = folder.getFiles();
  while (files.hasNext()) existing.add(files.next().getName());

  const threads = GmailApp.search(
    'from:' + SENDER + ' has:attachment filename:xlsx newer_than:14d'
  );
  for (const thread of threads) {
    for (const message of thread.getMessages()) {
      for (const attachment of message.getAttachments()) {
        const name = attachment.getName();
        if (NAME_PATTERN.test(name) && !existing.has(name)) {
          folder.createFile(attachment.copyBlob()).setName(name);
          existing.add(name);
          console.log('Saved: ' + name);
        }
      }
    }
  }
}
```

## Notes

- The folder ID above is the folder that already holds the weekly exports
  (`Pull Requests and AI 2026 07 08.xlsx`, etc.). If you ever move to a new
  folder, update `FOLDER_ID` here and re-deploy the script.
- The script only *reads* Gmail and only *writes* new files to that one
  folder; it never modifies or deletes email.
- If a refresh ever fails with "file not in Drive", check
  script.google.com → Executions for errors (expired trigger, changed
  filename pattern, etc.).
