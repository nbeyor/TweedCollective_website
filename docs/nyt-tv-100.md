# NYT 100 watchlist

Anyone with the workspace grant swipes the NYT 100 at `/clients/nyt-tv-100`. Right is want, left is skip. The header shows who you're paired with, a pending invite, or an email field. You can swipe before a pair exists. Marketing pages are unchanged.

## Access

Middleware still requires a Clerk session. The deck route (`app/clients/nyt-tv-100/(watch)/layout.tsx`) calls `requireClientAccess('nyt-tv-100')`, the same client-workspace gate as Grex and eCS (PR 117). Votes, pair, match, invites, and digest-preview call `clientAccessError('nyt-tv-100')` before any pair work. The digest cron stays on `CRON_SECRET`.

Admins can open the workspace without a slug grant. Anyone else needs `clientSlugs: ["nyt-tv-100"]`. Opening an invite link whose address matches the signed-in verified email grants that slug and binds the pair. The join route is `/clients/nyt-tv-100/join/<token>` and is not behind the slug gate, so a new partner can land there after sign-up.

## Pairing

Email is the source of truth. Either person enters the partner's verified address. That address has to belong to someone who has already opened this watchlist (they are in the directory written on each visit). An unknown email returns a clear error and does not create a pair.

The header is always visible:

- **Solo:** email field, "Request pair". The deck is already there.
- **Pending:** "Invite pending for {email}". You are not paired yet. Copy the link, or they can enter your email. No shared list until they confirm.
- **Incoming:** "{email} asked to pair", with Confirm. You are not paired yet.
- **Active:** "Paired with {email}", plus Unpair. Unpair deletes the couple and leaves each person's swipes on their account.

The link is `/clients/nyt-tv-100/join/<token>`. The token is 18 random bytes, base64url. The partner's email is not in the URL. They sign up or sign in, verify that email, and the join page binds them. A different email does not bind and does not get the workspace slug. Confirming by entering the inviter's email does the same bind.

An active pair is `{ aUserId, bUserId, aEmail, bEmail, pairedAt }`. Couples are independent. A person is in at most one pair.

`NYT_TV_NATE_EMAIL` (default `nate.beyor@tweedcollective.ai`) and `NYT_TV_JEN_EMAIL` are optional bootstrap only. If the Nate address signs in and the Jen address is already in the directory, one pending invite is created. It does not bind, and it does nothing if that partner has never opened the watchlist. Neither variable admits anyone.

## How swipes persist

Each swipe is `{ userId, showRank, vote: 'want' | 'skip', updatedAt, dayKey }` on the Clerk user id. The API body is still `{ showRank, vote }`. `showRank` is the NYT rank and does not change when the deck is shuffled. `dayKey` is the America/Los_Angeles date of the swipe. Pairing does not copy or move these rows. Older rows that still carry a `pairId` still load; that field is ignored.

The store is the Vercel Blob the repo already uses (`BLOB_READ_WRITE_TOKEN`), under `nyt-tv-100/`. One private blob per user and rank. Pair records, the email directory, and incoming-invite indexes live beside them. A blob wipe is safe; nothing here depends on the old `nate` / `jen` profile keys.

If `BLOB_READ_WRITE_TOKEN` is missing, the app falls back to a JSON file (`.data/nyt-tv-100` locally, `/tmp/nyt-tv-100` on Vercel). That disk is not shared across devices or instances. The deck shows a warning in that mode. Set the existing Blob token in the deployment for real use. `NYT_TV_DATA_DIR` overrides the file path for local tests.

API routes. Middleware requires a Clerk session. Votes, pair, match, and digest-preview also require the `nyt-tv-100` workspace grant:

- `GET /api/clients/nyt-tv-100/votes`
- `PUT /api/clients/nyt-tv-100/votes` with `{ showRank, vote }`
- `DELETE /api/clients/nyt-tv-100/votes?rank=14`
- `GET /api/clients/nyt-tv-100/pair`
- `POST /api/clients/nyt-tv-100/pair` with `{ email }`
- `DELETE /api/clients/nyt-tv-100/pair`
- `GET /api/clients/nyt-tv-100/match` — want overlap for the signed-in user's active pair
- `POST /api/clients/nyt-tv-100/invites` with `{ email }` — same request as `POST /pair`

The page section "Both want" is that overlap. It stays empty until the pair is active and both people have marked the same show want.

## End-of-day email

`vercel.json` schedules `GET /api/clients/nyt-tv-100/digest` at `0 3 * * *` UTC. That is 8:00pm Pacific Daylight Time and 7:00pm Pacific Standard Time. The path is not on the public middleware list. Middleware lets the request through only when `Authorization: Bearer $CRON_SECRET` matches, and the route checks the secret again. Set `CRON_SECRET` on the Vercel project or the cron is redirected to sign-in and nothing sends.

The cron walks active pairs only. Each couple with swipes gets their own email, sent only to that couple's addresses. It lists each person's wants and skips, plus the overlap of wants. Pending invites are not mailed. Until a send actually succeeds, a run includes every swipe so far, so an earlier weekend is not dropped. After that, each run includes swipes recorded since the previous successful send (including anything after 8pm). No swipes means no email.

Nothing is mailed unless both of these are set on **Production** only:

- `NYT_TV_DIGEST_SEND=true`
- `RESEND_API_KEY` (already used by this repo)
- `RESEND_FROM_EMAIL` optional; otherwise `Tweed Collective <onboarding@resend.dev>`

Leave `NYT_TV_DIGEST_SEND` unset on Preview and in CI. Without it, the route logs the full digest text and returns `mode: "dry-run"`. It does not advance the sent marker.

Anyone signed in with the workspace grant can preview their own pair without sending:

`GET /api/clients/nyt-tv-100/digest-preview`

`?scope=all` on the cron (with the secret) or the preview route includes every stored swipe.

## Nate's checklist

The data file is `content/nyt-tv-100/shows.json` (not under `public/`, so the checklist is not a world-readable static file). Ranks 1–20 carry Nate's personal status and notes. The deck still shows all 100 shows to both people. Owner badges and notes render only for an admin or the verified `NYT_TV_NATE_EMAIL` address. `unchecked` has no badge. A partner never receives those fields.

## Card copy and order

Each card leads with the show title, then the one-line description, then a short Pro and a short Con (`reviewPro` and `reviewCon` on the show). The title is an explicit charcoal heading so the global cream `h2` color does not disappear on the cream card.

The page shuffles the deck once per request with Fisher–Yates (`Math.random` in `shuffleDeck`). That array is the order for the mount. Swipes, undo, and a focus reload of votes filter that same array by `showRank`; they do not draw a new order. A refresh or a new visit does. The "Your list" view stays sorted by rank so a decision is easy to find.

Pro and con lines were written for this deck from each show's public reputation and the existing one-line description. They are short, balanced, and avoid plot spoilers where the description already gives the premise.
