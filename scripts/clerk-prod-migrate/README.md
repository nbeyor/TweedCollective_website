# Clerk production user migrate

One-shot tool that copies users from the 2026-09-23 `noted-piglet-2` export onto the **Clerk Production** instance (Backend API). Harness runs it on a box that already has the secrets. This pull request does **not** change Vercel env vars, does **not** flip `pk_` / `sk_` keys, and does **not** touch app routes, CSP, or middleware.

Background (plan only, already executed nowhere by this script): [CUTOVER-PLAN.md](./CUTOVER-PLAN.md).

## Default scope

**Full inventory.** The default file is [USER-INVENTORY.json](./USER-INVENTORY.json) (all 36 prior dev signups). Inactive users are included: there is no filter on last sign-in, empty `clientSlugs`, or admin. Empty grants stay empty. The script does not invent workspace or document grants, and it does not add a Create-account flow to the website.

[MIGRATE-SCOPE.json](./MIGRATE-SCOPE.json) is the older 18-user grants-or-admin slice. It is **not** the default. Pass it only if you intentionally want that narrower set:

```bash
node scripts/clerk-prod-migrate/migrate.mjs --inventory scripts/clerk-prod-migrate/MIGRATE-SCOPE.json
```

Human-readable export: [USER-INVENTORY.md](./USER-INVENTORY.md).

## What gets written

App access (see `lib/client-access.ts` and `lib/document-access.ts`):

| Need | Where it lives |
|---|---|
| Workspace access | `publicMetadata.clientSlugs` (array, copied as-is, may be empty) |
| Admin | `privateMetadata.isAdmin: true` when the export says admin (`is_admin`, `private_metadata_isAdmin`, or `role === 'admin'`). |
| Document grants | `privateMetadata.documentAccess` |

The export lists the key name `documentAccess` but not the values. Those values are copied only when `SOURCE_CLERK_SECRET_KEY` is set (read-only GET against the dev instance). If it is unset, the script logs a WARN and still migrates `clientSlugs` and admin flags.

Password hashes are never copied. Google users are created with no password so they can sign in with Google. Password users are created with no password (`skip_password_requirement`) and must use **Forgot password** or Google afterward. No invitation or verification email is sent unless `--send-invites`.

**Nate’s work email is not API-created.** `nate.beyor@tweedcollective.ai` is on `ADMIN_EMAILS` in `lib/client-access.ts`. A verified Google sign-in is already admin and sees every workspace and document, so the script does not `POST /users` or send an invite for that address. If that user already exists on the live instance, a later run only patches metadata. `nbeyor@gmail.com` is not on the allowlist; that account is still created and gets `privateMetadata.isAdmin: true`.

Order: `nate.beyor@tweedcollective.ai` (skip create), then `nbeyor@gmail.com`, then any other admins, then everyone else by email.

## No email unless you opt in

Dry-run and `--apply` send **zero** invitation or verification emails.

`--send-invites` is the only switch that sends mail. It emails a Clerk invitation only for **missing password-only** users who do **not** need private metadata written in the same call. Invitations cannot carry `privateMetadata`, so an admin, or anyone whose `documentAccess` values are in hand, is still created as a live user and is **not** emailed. Existing users are never emailed on a re-run.

## Secrets

Put secrets in the environment of the shell that runs the script. Do not paste them into the command line, this README, git, or chat.

| Variable | Role |
|---|---|
| `CLERK_SECRET_KEY` | Target. `--apply` refuses to run unless this is `sk_live_`. |
| `SOURCE_CLERK_SECRET_KEY` | Optional source instance, used only to read `documentAccess`. |
| `APPLY=1` | Same as `--apply`. |

`--allow-test-target` lets `--apply` run with an `sk_test_` key for a local drill. Do not point that at production data you care about. The script masks keys in logs (`sk_live_[REDACTED]`).

## How to run

From the repo root.

### 1. Plan-only dry-run (no Clerk key)

```bash
node scripts/clerk-prod-migrate/migrate.mjs
```

Expected: mode `dry-run`, 36 users, first row `nate.beyor@tweedcollective.ai` with action `skip` (self-serve, no API create), then `nbeyor@gmail.com` as `create`. The other 34 rows are `create`, including users with no grants. `invite emails that would be sent: 0`, exit 0. A WARN lists how many users have `documentAccess` keys that were skipped. Existence is not checked.

### 2. Read-only dry-run (live key set, still no writes)

```bash
CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
SOURCE_CLERK_SECRET_KEY="$SOURCE_CLERK_SECRET_KEY" \
node scripts/clerk-prod-migrate/migrate.mjs
```

Expected: same table, but actions can be `create`, `update`, or `skip` based on GET lookups. `documentAccess` is `yes` only when the source secret was set and the value was read. No POST or PATCH. Invite email count stays 0.

### 3. Apply on production (no emails)

```bash
CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
SOURCE_CLERK_SECRET_KEY="$SOURCE_CLERK_SECRET_KEY" \
node scripts/clerk-prod-migrate/migrate.mjs --apply
```

`CLERK_SECRET_KEY` must be the Production `sk_live_` secret. Re-running is safe: existing emails are not duplicated; metadata is patched to match the inventory.

### 4. Apply and email password users (explicit)

```bash
CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
node scripts/clerk-prod-migrate/migrate.mjs --apply --send-invites
```

Only do this when you mean to send mail. Omit it for the normal migrate.

### Local test against a dev instance

```bash
CLERK_SECRET_KEY="$DEV_CLERK_SECRET_KEY" \
node scripts/clerk-prod-migrate/migrate.mjs --apply --allow-test-target
```

`--apply` without a live key, and without that flag, exits non-zero and writes nothing.

Sanity check with no network:

```bash
node scripts/clerk-prod-migrate/migrate.mjs --self-test
```

## Summary table

The run ends with one row per user:

| Column | Meaning |
|---|---|
| email | Primary email |
| action | `create`, `update`, `skip`, or `error` |
| clientSlugs | Inventory array (`(none)` when empty) |
| admin | `yes` / `no` |
| documentAccess | `yes` (copied or already present), `skipped` (no source secret), `n/a`, `deferred`, or `error` |
| auth | Google vs set-password, and whether an email was involved |

Exit 0 when every row succeeded. Exit 1 when any user hit a hard failure (lookup, create, or a required `documentAccess` read). Exit 2 for bad arguments or a refused `--apply` (wrong key prefix, missing key). Fix the cause and re-run; completed users are skipped or updated, not duplicated.

## Rollback

This script does not delete users and does not change the website.

- Production `tweedcollective.ai` keeps whatever Clerk keys Vercel already has. Rolling back the **site** is a separate Vercel env change (see CUTOVER-PLAN.md) and is out of scope here.
- To undo users created on the live Clerk instance, delete those users in the Clerk Dashboard (Production → Users). Re-running this script will recreate inventory users except `nate.beyor@tweedcollective.ai`, who is left to sign in with Google.
- To undo metadata edits on someone who already existed, fix the inventory (or edit them in the Dashboard) and re-run `--apply`. `clientSlugs` is set to the inventory array.
- Invitations from `--send-invites` can be revoked in the Dashboard. They expire after 30 days.
- Password hashes were not copied. There is nothing to restore. People set a new password or use Google.

## Files

| File | Role |
|---|---|
| `migrate.mjs` | The tool (`node`, no extra dependency) |
| `USER-INVENTORY.json` | Default source, 36 users, redacted |
| `MIGRATE-SCOPE.json` | Optional `--inventory` (18 users) |
| `USER-INVENTORY.md` | Human table of the export |
| `CUTOVER-PLAN.md` | Earlier cutover notes; not executed by this script |
