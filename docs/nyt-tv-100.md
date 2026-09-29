# NYT 100 watchlist

Shared swipe deck for Nate and Jen at `/clients/nyt-tv-100`. Right is want, left is skip. Marketing pages are unchanged.

## Access

`/clients/nyt-tv-100` uses the same Clerk client-workspace gate as Grex, eCS, and Protocol Strategist. Middleware still requires a Clerk session. `app/clients/nyt-tv-100/layout.tsx` calls `requireClientAccess('nyt-tv-100')`. Votes and digest-preview call `clientAccessError('nyt-tv-100')` before any profile work. The digest cron path stays on `CRON_SECRET` and does not use this grant.

Admins (`privateMetadata.isAdmin`, `publicMetadata.role === 'admin'`, or verified primary email `nate.beyor@tweedcollective.ai`) can open every workspace in `CLIENT_CONFIGS`, including this one. Anyone else needs Clerk public metadata `clientSlugs: ["nyt-tv-100"]`.

## Jen signup

1. She opens `https://tweedcollective.ai/clients/nyt-tv-100`.
2. Clerk sends her to `/sign-in`. The sign-in page links to sign-up and keeps `redirect_url`, so she lands back on the deck.
3. She creates an account with the email she actually wants to use, and verifies it.
4. In the admin panel, grant her the `nyt-tv-100` workspace (`clientSlugs: ["nyt-tv-100"]`). Until that grant exists, she sees the shared access-denied page.
5. She refreshes. The profile chip says **Jen**. Her swipes are stored separately from Nate's.

After the grant, the deck picks a profile:

- **Nate** when the user is an admin, or their verified primary email matches `NYT_TV_NATE_EMAIL` (default `nate.beyor@tweedcollective.ai`).
- **Jen** when their verified primary email matches `NYT_TV_JEN_EMAIL`, or they have the workspace and are not Nate.

`NYT_TV_JEN_EMAIL` is the digest address and an optional profile hint. It is not the admission gate. Set it to her verified address so the end-of-day email includes her. Nate's digest address uses the same default, overridable with `NYT_TV_NATE_EMAIL`. The two addresses must be different.

## How swipes persist

Each swipe is one record: `{ profileId, showRank, vote: 'want' | 'skip', updatedAt, dayKey }`. `dayKey` is the America/Los_Angeles date of the swipe. Profile comes from the signed-in Clerk user (admin, verified email hint, or the non-Nate grant), not from the browser.

The store is the Vercel Blob the repo already uses (`BLOB_READ_WRITE_TOKEN`), under the prefix `nyt-tv-100/`. One private blob per profile and rank, so two devices can swipe different shows without clobbering each other. Refresh and a second device load the same profile's votes.

If `BLOB_READ_WRITE_TOKEN` is missing, the app falls back to a JSON file (`.data/nyt-tv-100` locally, `/tmp/nyt-tv-100` on Vercel). That disk is not shared across devices or instances. The deck shows a warning in that mode. Set the existing Blob token in the deployment for real use. `NYT_TV_DATA_DIR` overrides the file path for local tests.

API routes. Middleware requires a Clerk session. Votes and digest-preview also require the `nyt-tv-100` workspace grant:

- `GET /api/clients/nyt-tv-100/votes`
- `PUT /api/clients/nyt-tv-100/votes` with `{ showRank, vote }`
- `DELETE /api/clients/nyt-tv-100/votes?rank=14`

## End-of-day email

`vercel.json` schedules `GET /api/clients/nyt-tv-100/digest` at `0 3 * * *` UTC. That is 8:00pm Pacific Daylight Time and 7:00pm Pacific Standard Time. The path is not on the public middleware list. Middleware lets the request through only when `Authorization: Bearer $CRON_SECRET` matches, and the route checks the secret again. Set `CRON_SECRET` on the Vercel project or the cron is redirected to sign-in and nothing sends.

The message goes to the digest recipients — Nate's address, plus Jen's when `NYT_TV_JEN_EMAIL` is set — and lists each person's wants and skips, plus a "both wanted" overlap. Until a send actually succeeds, a run includes every swipe so far, so an earlier weekend is not dropped. After that, each run includes swipes recorded since the previous successful send (including anything after 8pm). No swipes means no email.

Nothing is mailed unless both of these are set on **Production** only:

- `NYT_TV_DIGEST_SEND=true`
- `RESEND_API_KEY` (already used by this repo)
- `RESEND_FROM_EMAIL` optional; otherwise `Tweed Collective <onboarding@resend.dev>`

Leave `NYT_TV_DIGEST_SEND` unset on Preview and in CI. Without it, the route logs the full digest text and returns `mode: "dry-run"`. It does not advance the sent marker.

Anyone signed in with the workspace grant can preview without sending:

`GET /api/clients/nyt-tv-100/digest-preview`

`?scope=all` on the cron (with the secret) or the preview route includes every stored swipe.

## Nate's checklist

The data file is `content/nyt-tv-100/shows.json` (not under `public/`, so the checklist is not a world-readable static file). Ranks 1–20 carry Nate's personal status and notes. The deck still shows all 100 shows to both people. On Nate's profile only, decided rows get a small badge (`Seen`, `Partial`, `Not seen`, `Skip`) and the note if there is one. `unchecked` has no badge. Jen's profile never receives those fields.
