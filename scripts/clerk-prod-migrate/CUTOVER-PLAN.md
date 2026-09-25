# Clerk production live-key cutover plan (draft — no changes applied)

Date: 2026-09-23 PT  
Scope: tweedcollective.ai / Vercel project `tweed-collective-website`  
Status: **plan only**. Do not flip env vars until Nate approves execute.

## Direct answer: does this break everyone?

**Yes, if you only swap production keys.**  
Production today authenticates against Clerk **development** instance `noted-piglet-2` (`pk_test_` / `sk_test_`). Users, passwords, Google OAuth links, sessions, and `publicMetadata.clientSlugs` all live on that instance.

`pk_live_` / `sk_live_` point at a **different** Clerk instance (Production). That instance does not inherit users or metadata. A bare Vercel production key swap → every signed-in session dies and every existing user must re-exist on the live instance before they can open `/clients/*`.

**What does not break if cutover is done cleanly:**
- Development + Preview keep `pk_test_` → `noted-piglet-2` (staging still works).
- Routes that never use Clerk (e.g. Grex Twilio webhook / public report if Clerk-exempt) stay up.
- Migrated or re-invited users with correct `clientSlugs` (and admin flags) work as before on live.

## Current state (from 2026-09-23 dig)

| Item | Fact |
|------|------|
| Prod Clerk keys | Same `pk_test_` / `sk_test_` on development, preview, **and** production |
| Instance | `noted-piglet-2.clerk.accounts.dev` |
| Access model | `publicMetadata.clientSlugs` includes workspace slug (e.g. `"ecs"`); admins bypass via `isAdmin` / role / `nate.beyor@tweedcollective.ai` |
| Venu | Exists on noted-piglet-2; email verified; `clientSlugs: ["ecs"]`; password on; MFA off; last sign-in ~2026-09-16 |
| Nate | Same instance; Google OAuth; also has `ecs` in clientSlugs; last sign-in recent — why admin still works while client email/password/OTP is flaky on **dev** email delivery |

Root problem for Venu is **not** missing allowlist. It is production wired to a **dev** Clerk instance.

## Goal

1. Production uses Clerk **Production** (`pk_live_` / `sk_live_`) only.  
2. Development/Preview stay on test keys / `noted-piglet-2`.  
3. Every user who must reach a client workspace on prod exists on the live instance with the same `clientSlugs` (and admin metadata where needed).  
4. Venu can sign in and open `/clients/ecs` without MFA/OTP dead-ends caused by the dev instance.

## Pre-flight (read-only / Dashboard setup — still no prod flip)

1. **Clerk Dashboard → Production instance**  
   - Confirm Production instance exists for the Tweed Clerk app (or create it).  
   - Copy `pk_live_` + `sk_live_` (store in 1Password / bot secret store; never paste into chat).  
   - Configure: allowed origins / redirect URLs for `https://tweedcollective.ai` (and www if used), sign-in/sign-up URLs matching the Next app, email/OTP provider for Production (custom SMTP or Clerk production email — not the restricted dev path).  
   - Enable the same first factors you want in prod (password and/or Google OAuth). Prefer Google for Nate; password or Google for ECS clients as policy allows.

2. **User inventory from `noted-piglet-2`** (API or Dashboard export)  
   Columns: email, user id, `clientSlugs`, admin flags (`privateMetadata.isAdmin`, `publicMetadata.role`), password_enabled, OAuth providers, last_sign_in_at, banned/locked.  
   **Decision gate (Nate):** migrate **all** users who have any `clientSlugs` / admin, or **v1 = admins + ECS only**. Default recommendation: **all users with any workspace grant or admin**, so no silent lockout of Grex / other clients.

3. **App check (no code required for cutover if metadata model unchanged)**  
   - Access remains `clientSlugs` + admin bypass (`lib/client-access.ts`).  
   - Confirm no hard-coded Frontend API host for `noted-piglet-2` in app code (env-driven Clerk keys only).  
   - List any webhooks / Backend API jobs that use `CLERK_SECRET_KEY` — they must use the **production** secret after flip for prod workers.

4. **Comms**  
   - Short note to affected users: “You’ll get a fresh invite / set-password / use Google once; old sessions end at cutover.”  
   - Hold window: ~30–60 min evening or agreed slot. Nate + one spot-check client (Venu) on call or Slack.

## Migrate users (before or during cutover window)

For each inventory row (order: admins → ECS → other workspaces):

1. Create user on **Production** instance (invite email or Admin create).  
2. Set **identical** `publicMetadata.clientSlugs` (and `privateMetadata` / `documentAccess` if used).  
3. Re-link auth path:  
   - Google OAuth users: sign in once with Google on prod after flip (or pre-connect if Clerk supports).  
   - Password users: invite → set password on live (do **not** assume password hashes copy).  
4. Verify email verified on live.  
5. Spot-check: user id is **new** (expected); metadata matches export.

Optional: Clerk’s official export/import / migration tools if available for this plan — prefer vendor path over hand-copy for large lists. If hand-copy, script against Backend API with live secret **only after** Nate approves execute (still not “flip prod site keys” until users exist).

## Dual-check before flip

On a **preview** deployment or local with live keys pointed at a non-prod host (or Clerk production + preview domain if configured):

- [ ] Nate Google sign-in → admin / `/clients/ecs`  
- [ ] Test ECS user (or Venu if he agrees to early invite) → `/clients/ecs`  
- [ ] User **without** `ecs` → access-denied (not blank 404)  
- [ ] Sign-out / session cookie domain OK  

Do **not** put live keys on production Vercel until this passes.

## Production flip (execute only with Nate go)

1. Vercel project `tweed-collective-website`:  
   - **Production** env: set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_…`, `CLERK_SECRET_KEY` = `sk_live_…`  
   - **Development** + **Preview**: leave `pk_test_` / `sk_test_` on `noted-piglet-2`  
2. Redeploy production.  
3. Immediately verify:  
   - Nate Google login  
   - Venu (password or invite link) → `/clients/ecs`  
   - One other workspace user if in inventory  
4. Watch Clerk Production logs + Vercel logs for auth failures ~30 min.

## Rollback

1. Restore production Vercel Clerk env vars to previous `pk_test_` / `sk_test_` values.  
2. Redeploy production.  
3. Users on noted-piglet-2 work again; live-instance invites remain for a later retry.  
Rollback window: keep old test key values in 1Password until 48h after successful cutover.

## Post-cutover

- Confirm no production env still has `pk_test_`.  
- Leave noted-piglet-2 for local/preview only.  
- Optional: disable production use of test instance in runbooks.  
- Close Venu ticket after he confirms MFA/email OTP or password path on **live**.

## Explicit non-goals (this plan)

- No code change required for the access model if metadata is re-applied.  
- No “fix Venu `clientSlugs`” as the fix (already correct on current instance).  
- No mixing live and test keys on the same production deployment.  
- No auto-execute: Harness/Code wait for Nate **execute** after this plan is accepted.

## Open decision for Nate

1. Inventory scope: **all granted users** vs **admins + ECS only** for v1.  
2. Preferred cutover window (date/time PT).  
3. Whether Venu should be invited to live **before** flip for a dry run.
