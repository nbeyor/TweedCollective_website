#!/usr/bin/env node
/**
 * One-shot migrate of noted-piglet-2 users onto the Clerk Production instance.
 *
 * Default is dry-run (no writes, no emails). Mutations require --apply or APPLY=1.
 * Secrets are read from the environment only and are never printed.
 *
 * This script does not change Vercel, CSP, middleware, or app routes.
 * It does not copy password hashes.
 */

import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_INVENTORY = join(HERE, 'USER-INVENTORY.json')
const API = 'https://api.clerk.com/v1'
const FIRST_EMAILS = ['nate.beyor@tweedcollective.ai', 'nbeyor@gmail.com']

const HELP = `Usage: node scripts/clerk-prod-migrate/migrate.mjs [options]

Default: dry-run the full USER-INVENTORY.json (every exported dev user,
including inactive accounts and users with no clientSlugs).
No Clerk writes. No invitation or verification emails.

Options:
  --apply                 Create/update users on the target instance (or set APPLY=1)
  --allow-test-target     Permit --apply when CLERK_SECRET_KEY is sk_test_ (local only)
  --send-invites          Email Clerk invitations for missing password-only users.
                          Default is off. Ignored for users who already exist.
                          Not used when private metadata must be written now
                          (isAdmin, or documentAccess values), because invitations
                          cannot carry private metadata.
  --inventory <path>      Inventory JSON. Default: scripts/clerk-prod-migrate/USER-INVENTORY.json
                          Pass MIGRATE-SCOPE.json for the narrower grants-or-admin set.
  --source-secret-env <NAME>
                          Env var holding the source (dev) secret. Default: SOURCE_CLERK_SECRET_KEY.
                          Pass the variable name, never the secret itself.
  --self-test             Run local assertions (no network)
  --help

Environment:
  CLERK_SECRET_KEY            Target instance. Required for --apply. Must be sk_live_
                              unless --allow-test-target. Optional on dry-run: when set,
                              dry-run does read-only lookups and can report update/skip.
  SOURCE_CLERK_SECRET_KEY     Optional. When set, copy privateMetadata.documentAccess
                              from the source instance for users whose inventory lists
                              that key. When unset, those values are skipped (warned).
  APPLY=1                     Same as --apply.

Writes go only to https://api.clerk.com. Nothing in this tool edits Vercel.
`

class ConfigError extends Error {
  constructor(message) {
    super(message)
    this.exitCode = 2
  }
}

/** Module-level interlock. POST/PATCH are rejected until --apply turns this on. */
let allowWrites = false

function scrub(value) {
  return String(value)
    .replace(/sk_(live|test)_[A-Za-z0-9]+/g, 'sk_$1_[REDACTED]')
    .replace(/pk_(live|test)_[A-Za-z0-9]+/g, 'pk_$1_[REDACTED]')
}

function maskKey(key) {
  if (!key) return '(unset)'
  if (key.startsWith('sk_live_')) return 'sk_live_[REDACTED]'
  if (key.startsWith('sk_test_')) return 'sk_test_[REDACTED]'
  return 'unrecognized_[REDACTED]'
}

function keyPrefix(key) {
  if (!key) return 'unset'
  if (key.startsWith('sk_live_')) return 'sk_live_'
  if (key.startsWith('sk_test_')) return 'sk_test_'
  return 'other'
}

function parseArgs(argv) {
  const out = {
    apply: process.env.APPLY === '1',
    allowTestTarget: false,
    sendInvites: false,
    inventory: null,
    sourceSecretEnv: 'SOURCE_CLERK_SECRET_KEY',
    selfTest: false,
    help: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--apply') out.apply = true
    else if (arg === '--allow-test-target') out.allowTestTarget = true
    else if (arg === '--send-invites') out.sendInvites = true
    else if (arg === '--self-test') out.selfTest = true
    else if (arg === '--help' || arg === '-h') out.help = true
    else if (arg === '--inventory') {
      const value = argv[++i]
      if (!value) throw new ConfigError('Missing path after --inventory')
      out.inventory = value
    } else if (arg === '--source-secret-env') {
      const value = argv[++i]
      if (!value) throw new ConfigError('Missing name after --source-secret-env')
      if (/sk_(live|test)_/i.test(value) || value.startsWith('sk_')) {
        throw new ConfigError(
          '--source-secret-env takes an environment variable name, not a secret. The value was not printed.'
        )
      }
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
        throw new ConfigError('--source-secret-env must be an environment variable name')
      }
      out.sourceSecretEnv = value
    } else {
      throw new ConfigError(`Unknown argument: ${scrub(arg)}`)
    }
  }
  return out
}

function emailOf(record) {
  if (typeof record.primary_email === 'string' && record.primary_email.trim()) {
    return record.primary_email.trim().toLowerCase()
  }
  const emails = Array.isArray(record.emails) ? record.emails : []
  const primary = emails.find((entry) => entry && entry.is_primary) || emails[0]
  if (primary && typeof primary.email === 'string' && primary.email.trim()) {
    return primary.email.trim().toLowerCase()
  }
  return ''
}

function isSourceAdmin(record) {
  return (
    record.is_admin === true ||
    record.private_metadata_isAdmin === true ||
    record.role === 'admin' ||
    record.public_metadata?.role === 'admin'
  )
}

function slugsOf(record) {
  const raw = Array.isArray(record.clientSlugs)
    ? record.clientSlugs
    : Array.isArray(record.public_metadata?.clientSlugs)
      ? record.public_metadata.clientSlugs
      : []
  return raw.filter((slug) => typeof slug === 'string' && slug.trim()).map((slug) => slug.trim())
}

function hasDocumentAccessKey(record) {
  return Array.isArray(record.private_metadata_keys) && record.private_metadata_keys.includes('documentAccess')
}

function stringArray(value) {
  if (!Array.isArray(value)) return []
  return value.filter((item) => typeof item === 'string')
}

function sameArray(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

function cleanName(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function primaryVerified(record) {
  const email = emailOf(record)
  const emails = Array.isArray(record.emails) ? record.emails : []
  const row = emails.find((entry) => String(entry?.email || '').trim().toLowerCase() === email)
  if (!row) return true
  if (row.verified === false) return false
  if (row.verification_status && row.verification_status !== 'verified') return false
  return true
}

function authKind(record) {
  const providers = Array.isArray(record.external_accounts_providers) ? record.external_accounts_providers : []
  const google = providers.includes('oauth_google')
  const password = record.password_enabled === true
  if (google && password) return 'both'
  if (google) return 'google'
  if (password) return 'password'
  return 'none'
}

/**
 * Invitations carry public metadata only. Use them solely when the operator
 * passed --send-invites for a password-only user and we do not need to write
 * private metadata (isAdmin or a known documentAccess array) in this call.
 * Otherwise create the live user with no email.
 */
function chooseCreate(record, { sendInvites, privateNeeded }) {
  if (sendInvites && authKind(record) === 'password' && !privateNeeded) return 'invitation'
  return 'user'
}

function sortUsers(users) {
  const rank = (record) => {
    const pinned = FIRST_EMAILS.indexOf(emailOf(record))
    if (pinned !== -1) return pinned
    if (isSourceAdmin(record)) return FIRST_EMAILS.length
    return FIRST_EMAILS.length + 1
  }
  return [...users].sort((left, right) => {
    const byRank = rank(left) - rank(right)
    if (byRank !== 0) return byRank
    return emailOf(left).localeCompare(emailOf(right))
  })
}

function loadInventory(file) {
  const text = readFileSync(file, 'utf8')
  if (/sk_(live|test)_[A-Za-z0-9]{8,}/.test(text) || /password_digest|password_hasher/.test(text)) {
    throw new ConfigError(`Refusing to load ${file}: it looks like it contains a secret or password hash.`)
  }
  let data
  try {
    data = JSON.parse(text)
  } catch (error) {
    throw new ConfigError(`Inventory is not valid JSON (${file}): ${error.message}`)
  }
  const users = Array.isArray(data) ? data : data?.users
  if (!Array.isArray(users)) throw new ConfigError(`Inventory ${file} must contain a users array.`)
  return { meta: data?.meta || {}, users }
}

function desiredMetadata(record, doc) {
  const clientSlugs = slugsOf(record)
  const admin = isSourceAdmin(record)
  const publicMetadata = { clientSlugs }
  if (record.role === 'admin' || record.public_metadata?.role === 'admin') {
    publicMetadata.role = 'admin'
  }
  const privateMetadata = {}
  if (admin) privateMetadata.isAdmin = true
  if (doc.state === 'value') privateMetadata.documentAccess = doc.value
  return { clientSlugs, admin, publicMetadata, privateMetadata }
}

function exactStringArray(value, expected) {
  return Array.isArray(value) && sameArray(value, expected) && value.every((item) => typeof item === 'string')
}

/** Grants and role to send. Empty clientSlugs are omitted so a live value is not cleared. */
function writePublicMetadata(desired) {
  const publicMetadata = {}
  if (desired.publicMetadata.clientSlugs.length > 0) {
    publicMetadata.clientSlugs = desired.publicMetadata.clientSlugs
  }
  if (desired.publicMetadata.role === 'admin') publicMetadata.role = 'admin'
  return publicMetadata
}

function diffMetadata(live, desired) {
  const patch = { public: {}, private: {} }
  const slugs = desired.publicMetadata.clientSlugs
  if (slugs.length > 0 && !exactStringArray(live?.public_metadata?.clientSlugs, slugs)) {
    patch.public.clientSlugs = slugs
  }
  if (desired.publicMetadata.role === 'admin' && live?.public_metadata?.role !== 'admin') {
    patch.public.role = 'admin'
  }
  if (desired.privateMetadata.isAdmin === true && live?.private_metadata?.isAdmin !== true) {
    patch.private.isAdmin = true
  }
  if (Object.prototype.hasOwnProperty.call(desired.privateMetadata, 'documentAccess')) {
    if (!exactStringArray(live?.private_metadata?.documentAccess, desired.privateMetadata.documentAccess)) {
      patch.private.documentAccess = desired.privateMetadata.documentAccess
    }
  }
  const changed = Object.keys(patch.public).length > 0 || Object.keys(patch.private).length > 0
  return { patch, changed }
}

function docColumn(doc) {
  if (doc.state === 'value') return 'yes'
  if (doc.state === 'skipped') return 'skipped'
  if (doc.state === 'error') return 'error'
  if (doc.state === 'deferred') return 'deferred'
  return 'n/a'
}

function mailPhrase(notify, apply) {
  if (!notify) return 'email not sent'
  return apply ? 'invitation email sent' : 'would send invitation email'
}

function createAuthNote(record, method, sendInvites, apply) {
  const kind = authKind(record)
  if (method === 'invitation') {
    return `invitation; ${mailPhrase(sendInvites, apply)}; set password via invite; password hash not copied`
  }
  if (kind === 'google') return 'create user; Google sign-in; no password copied; no email'
  if (kind === 'both') return 'create user; Google or set-password; password hash not copied; no email'
  if (kind === 'password') return 'create user; password hash not copied; needs set-password or Google; no email'
  return 'create user; no source password or Google; needs set-password or Google; no email'
}

function assertSafeCreateBody(body) {
  const banned = ['password', 'password_digest', 'password_hasher', 'totp_secret', 'backup_codes']
  for (const key of banned) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      throw new ConfigError(`Refusing to send ${key}`)
    }
  }
  if (/sk_(live|test)_/.test(JSON.stringify(body))) {
    throw new ConfigError('Refusing to send a request body that contains a secret key')
  }
}

function userCreateBody(record, desired) {
  const body = {
    email_address: [emailOf(record)],
    skip_password_requirement: true,
  }
  const publicMetadata = writePublicMetadata(desired)
  if (Object.keys(publicMetadata).length > 0) body.public_metadata = publicMetadata
  const first = cleanName(record.first_name)
  const last = cleanName(record.last_name)
  if (first) body.first_name = first
  if (last) body.last_name = last
  if (record.banned === true) body.banned = true
  if (record.locked === true) body.locked = true
  if (!primaryVerified(record)) body.email_address_identification_status = ['reserved']
  if (Object.keys(desired.privateMetadata).length > 0) body.private_metadata = desired.privateMetadata
  assertSafeCreateBody(body)
  return body
}

function invitationBody(email, publicMetadata, notify) {
  const body = {
    email_address: email,
    public_metadata: publicMetadata,
    notify: notify === true,
    ignore_existing: false,
    expires_in_days: 30,
  }
  assertSafeCreateBody(body)
  return body
}

function inviteMatches(invitation, publicMetadata) {
  const slugs = stringArray(invitation?.public_metadata?.clientSlugs)
  if (!sameArray(slugs, publicMetadata.clientSlugs || [])) return false
  if (publicMetadata.role === 'admin' && invitation?.public_metadata?.role !== 'admin') return false
  return true
}

function classifyInvitations(pending, publicMetadata, notify, apply) {
  const matching = pending.filter((invitation) => inviteMatches(invitation, publicMetadata))
  const mail = mailPhrase(notify, apply)
  if (pending.length > 0 && matching.length === pending.length) {
    return { action: 'skip', auth: 'pending invitation already matches; no email', notify: false, execute: false }
  }
  if (matching.length > 0) {
    return {
      action: 'update',
      auth: 'revoke non-matching duplicate invitations; keep the matching one; no email',
      notify: false,
      execute: 'revoke-extras',
    }
  }
  if (pending.length > 0) {
    return {
      action: 'update',
      auth: `replace pending invitation; ${mail}; password hash not copied`,
      notify: notify === true,
      execute: 'replace',
    }
  }
  return {
    action: 'create',
    auth: `invitation; ${mail}; set password via invite; password hash not copied`,
    notify: notify === true,
    execute: 'create',
  }
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && Array.isArray(payload.data)) return payload.data
  return []
}

function userHasEmail(user, email) {
  const list = user?.email_addresses || user?.emailAddresses || []
  return list.some((entry) => String(entry?.email_address || entry?.emailAddress || '').toLowerCase() === email)
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms))
}

class ClerkError extends Error {
  constructor(method, path, status, body) {
    super(`${method} ${path} failed (${status}): ${scrub(body).slice(0, 400)}`)
    this.status = status
    this.body = scrub(body).slice(0, 800)
  }
}

async function clerk(secret, method, path, body) {
  if (method !== 'GET' && !allowWrites) {
    throw new Error(`blocked ${method} ${path}: writes are disabled`)
  }
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${API}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${secret}`,
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      const text = await response.text()
      if (response.status === 429 || response.status >= 500) {
        lastError = new ClerkError(method, path, response.status, text)
        if (attempt < 3) {
          await sleep(attempt * 500)
          continue
        }
        throw lastError
      }
      if (!response.ok) throw new ClerkError(method, path, response.status, text)
      if (!text) return null
      try {
        return JSON.parse(text)
      } catch {
        throw new ClerkError(method, path, response.status, 'response was not JSON')
      }
    } catch (error) {
      if (error instanceof ClerkError) throw error
      lastError = error
      if (attempt < 3) {
        await sleep(attempt * 500)
        continue
      }
      throw error
    }
  }
  throw lastError
}

async function findUser(secret, email) {
  const listed = unwrapList(
    await clerk(secret, 'GET', `/users?email_address=${encodeURIComponent(email)}&limit=10`)
  )
  const matches = listed.filter((user) => userHasEmail(user, email))
  if (matches.length > 1) {
    throw new Error(`multiple live users match ${email}`)
  }
  if (matches.length === 0) return null
  return clerk(secret, 'GET', `/users/${encodeURIComponent(matches[0].id)}`)
}

async function listPendingInvitations(secret, email) {
  const payload = await clerk(
    secret,
    'GET',
    `/invitations?status=pending&query=${encodeURIComponent(email)}&limit=100`
  )
  return unwrapList(payload).filter(
    (invitation) =>
      String(invitation.email_address || '').toLowerCase() === email && invitation.status === 'pending'
  )
}

function metadataApplied(user, patch) {
  if (
    Object.prototype.hasOwnProperty.call(patch.public, 'clientSlugs') &&
    !exactStringArray(user?.public_metadata?.clientSlugs, patch.public.clientSlugs)
  ) {
    return false
  }
  if (patch.public.role && user?.public_metadata?.role !== patch.public.role) return false
  if (patch.private.isAdmin === true && user?.private_metadata?.isAdmin !== true) return false
  if (
    Object.prototype.hasOwnProperty.call(patch.private, 'documentAccess') &&
    !exactStringArray(user?.private_metadata?.documentAccess, patch.private.documentAccess)
  ) {
    return false
  }
  return true
}

async function updateMetadata(secret, userId, patch) {
  const body = {}
  if (Object.keys(patch.public).length > 0) body.public_metadata = patch.public
  if (Object.keys(patch.private).length > 0) body.private_metadata = patch.private
  if (Object.keys(body).length === 0) return
  assertSafeCreateBody(body)
  await clerk(secret, 'PATCH', `/users/${encodeURIComponent(userId)}/metadata`, body)
  const fresh = await clerk(secret, 'GET', `/users/${encodeURIComponent(userId)}`)
  if (!metadataApplied(fresh, patch)) {
    throw new Error(`metadata verify failed for ${userId}`)
  }
}

function isDuplicateIdentifier(error) {
  if (!(error instanceof ClerkError) || error.status !== 422) return false
  const body = error.body.toLowerCase()
  return body.includes('email') && (body.includes('taken') || body.includes('already') || body.includes('exists'))
}

function isPasswordRequirementError(error) {
  if (!(error instanceof ClerkError)) return false
  const body = error.body.toLowerCase()
  return (
    body.includes('skip_password_requirement') ||
    body.includes('password is the only') ||
    (body.includes('password') && body.includes('required') && body.includes('skip'))
  )
}

function readDocumentAccess(user) {
  const value = user?.private_metadata?.documentAccess
  if (value == null) return { ok: false, reason: 'absent on source user' }
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    return { ok: false, reason: 'not a string array on source user' }
  }
  return { ok: true, value }
}

async function resolveDocumentAccess(secret, record) {
  if (!hasDocumentAccessKey(record)) return { state: 'n/a' }
  if (!secret) return { state: 'skipped' }
  const email = emailOf(record)
  const sourceUser = await findUser(secret, email)
  if (!sourceUser) return { state: 'error', reason: 'source user not found' }
  const parsed = readDocumentAccess(sourceUser)
  if (!parsed.ok) return { state: 'error', reason: parsed.reason }
  return { state: 'value', value: parsed.value }
}

function blankRow(record) {
  return {
    email: emailOf(record) || '(missing email)',
    action: 'error',
    clientSlugs: slugsOf(record),
    admin: isSourceAdmin(record),
    documentAccess: 'n/a',
    auth: '',
    notify: false,
    failed: false,
  }
}

async function executeInvitation(secret, email, publicMetadata, decision) {
  const pending = await listPendingInvitations(secret, email)
  if (decision.execute === 'revoke-extras') {
    for (const invitation of pending) {
      if (!inviteMatches(invitation, publicMetadata)) {
        await clerk(secret, 'POST', `/invitations/${encodeURIComponent(invitation.id)}/revoke`)
      }
    }
    return
  }
  if (decision.execute === 'replace') {
    for (const invitation of pending) {
      await clerk(secret, 'POST', `/invitations/${encodeURIComponent(invitation.id)}/revoke`)
    }
  }
  if (decision.execute === 'replace' || decision.execute === 'create') {
    await clerk(secret, 'POST', '/invitations', invitationBody(email, publicMetadata, decision.notify))
  }
}

async function executeUserCreate(ctx, record, desired, row) {
  const body = userCreateBody(record, desired)
  try {
    await clerk(ctx.targetKey, 'POST', '/users', body)
    let created = null
    for (let attempt = 0; attempt < 3 && !created; attempt++) {
      if (attempt > 0) await sleep(300)
      created = await findUser(ctx.targetKey, row.email)
    }
    if (!created) throw new Error('create returned but user lookup missed the email')
    const patch = {
      public: writePublicMetadata(desired),
      private: desired.privateMetadata,
    }
    if (!metadataApplied(created, patch)) throw new Error('created user metadata did not match inventory')
    return
  } catch (error) {
    if (isDuplicateIdentifier(error)) {
      const existing = await findUser(ctx.targetKey, row.email)
      if (!existing) throw error
      const { patch, changed } = diffMetadata(existing, desired)
      row.action = changed ? 'update' : 'skip'
      row.auth = changed ? 'metadata only; no email' : 'already matches; no email'
      row.notify = false
      if (changed) await updateMetadata(ctx.targetKey, existing.id, patch)
      return
    }
    if (!isPasswordRequirementError(error)) throw error
  }

  const decision = classifyInvitations([], writePublicMetadata(desired), ctx.sendInvites, true)
  await executeInvitation(ctx.targetKey, row.email, writePublicMetadata(desired), {
    ...decision,
    execute: 'create',
    notify: ctx.sendInvites === true,
  })
  row.action = 'create'
  row.notify = ctx.sendInvites === true
  row.auth = ctx.sendInvites
    ? 'user create rejected without a password; invitation email sent instead; private metadata deferred until accept'
    : 'user create rejected without a password; invitation created with no email; private metadata deferred until accept'
  const privateNeeded =
    desired.privateMetadata.isAdmin === true ||
    Object.prototype.hasOwnProperty.call(desired.privateMetadata, 'documentAccess')
  if (privateNeeded) {
    row.failed = true
    if (row.documentAccess === 'yes') row.documentAccess = 'deferred'
    row.auth += '; re-run --apply after they accept'
  }
}

async function processOne(ctx, record) {
  const row = blankRow(record)
  if (!row.email || row.email === '(missing email)') {
    row.failed = true
    row.auth = 'missing primary email'
    return row
  }

  let doc = { state: 'n/a' }
  try {
    doc = await resolveDocumentAccess(ctx.sourceKey, record)
  } catch (error) {
    doc = { state: 'error', reason: error.message }
  }
  const desired = desiredMetadata(record, doc)
  row.clientSlugs = desired.clientSlugs
  row.admin = desired.admin
  row.documentAccess = docColumn(doc)

  let live = null
  let existence = 'unknown'
  if (ctx.targetKey) {
    try {
      live = await findUser(ctx.targetKey, row.email)
      existence = live ? 'found' : 'missing'
    } catch (error) {
      row.failed = true
      row.action = 'error'
      row.auth = `lookup failed: ${error.message}`
      return row
    }
  }

  if (existence === 'found') {
    const { patch, changed } = diffMetadata(live, desired)
    if (!changed) {
      row.action = 'skip'
      row.auth = 'already matches; no email'
    } else {
      row.action = 'update'
      row.auth = 'metadata only; no email'
      if (ctx.apply) {
        try {
          await updateMetadata(ctx.targetKey, live.id, patch)
        } catch (error) {
          row.failed = true
          row.action = 'error'
          row.auth = `update failed: ${error.message}`
          return row
        }
      }
    }
    if (doc.state === 'error') {
      row.failed = true
      row.auth += `; documentAccess not copied (${doc.reason})`
    }
    return row
  }

  const privateNeeded =
    desired.privateMetadata.isAdmin === true ||
    Object.prototype.hasOwnProperty.call(desired.privateMetadata, 'documentAccess')
  const method = chooseCreate(record, { sendInvites: ctx.sendInvites, privateNeeded })
  row.action = 'create'
  row.auth = createAuthNote(record, method, ctx.sendInvites, ctx.apply)
  if (existence === 'unknown') row.auth = `existence not checked; ${row.auth}`
  if (doc.state === 'error') {
    row.failed = true
    row.auth += `; documentAccess not copied (${doc.reason})`
  }

  if (method === 'invitation') {
    const publicMetadata = writePublicMetadata(desired)
    let decision = classifyInvitations([], publicMetadata, ctx.sendInvites, ctx.apply)
    if (ctx.targetKey && existence === 'missing') {
      try {
        const pending = await listPendingInvitations(ctx.targetKey, row.email)
        decision = classifyInvitations(pending, publicMetadata, ctx.sendInvites, ctx.apply)
      } catch (error) {
        row.failed = true
        row.action = 'error'
        row.auth = `invitation lookup failed: ${error.message}`
        return row
      }
    }
    row.action = decision.action
    row.auth = existence === 'unknown' ? `existence not checked; ${decision.auth}` : decision.auth
    row.notify = decision.notify === true && decision.action !== 'skip'
    if (ctx.apply && existence === 'missing' && decision.execute) {
      try {
        await executeInvitation(ctx.targetKey, row.email, publicMetadata, decision)
      } catch (error) {
        row.failed = true
        row.action = 'error'
        row.notify = false
        row.auth = `invitation failed: ${error.message}`
      }
    }
    return row
  }

  row.notify = false
  if (ctx.apply && existence === 'missing') {
    try {
      await executeUserCreate(ctx, record, desired, row)
    } catch (error) {
      row.failed = true
      row.action = 'error'
      row.notify = false
      row.auth = `create failed: ${error.message}`
    }
  }
  return row
}

function usableKey(key, label) {
  if (!key) return ''
  const prefix = keyPrefix(key)
  if (prefix === 'sk_live_' || prefix === 'sk_test_') return key
  console.warn(`WARN: ${label} is set but is not sk_live_ or sk_test_. Ignoring it. The value was not printed.`)
  return ''
}

function assertApplyTarget(key, allowTestTarget) {
  const prefix = keyPrefix(key)
  if (prefix === 'unset') throw new ConfigError('Refusing --apply: CLERK_SECRET_KEY is not set.')
  if (prefix === 'sk_live_') return
  if (prefix === 'sk_test_' && allowTestTarget) return
  if (prefix === 'sk_test_') {
    throw new ConfigError(
      'Refusing --apply: CLERK_SECRET_KEY is a test key. Pass --allow-test-target only for a deliberate local test. Live migrate requires sk_live_.'
    )
  }
  throw new ConfigError('Refusing --apply: CLERK_SECRET_KEY must start with sk_live_.')
}

function printTable(rows) {
  const cols = ['email', 'action', 'clientSlugs', 'admin', 'documentAccess', 'auth']
  const shaped = rows.map((row) => ({
    email: row.email,
    action: row.action,
    clientSlugs: row.clientSlugs.length ? row.clientSlugs.join(',') : '(none)',
    admin: row.admin ? 'yes' : 'no',
    documentAccess: row.documentAccess,
    auth: row.auth,
  }))
  const widths = Object.fromEntries(cols.map((col) => [col, col.length]))
  for (const row of shaped) {
    for (const col of cols) {
      if (col === 'auth') continue
      widths[col] = Math.max(widths[col], String(row[col]).length)
    }
  }
  const line = (row) => cols.map((col) => (col === 'auth' ? row[col] : String(row[col]).padEnd(widths[col]))).join('  ')
  console.log(line(Object.fromEntries(cols.map((col) => [col, col]))))
  for (const row of shaped) console.log(line(row))
}

async function run(args) {
  const inventoryPath = args.inventory
    ? isAbsolute(args.inventory)
      ? args.inventory
      : resolve(process.cwd(), args.inventory)
    : DEFAULT_INVENTORY
  const loaded = loadInventory(inventoryPath)
  const seen = new Set()
  const users = []
  const duplicateRows = []
  for (const record of sortUsers(loaded.users)) {
    const email = emailOf(record)
    if (email && seen.has(email)) {
      duplicateRows.push(email)
      continue
    }
    if (email) seen.add(email)
    users.push(record)
  }

  const targetKey = usableKey(process.env.CLERK_SECRET_KEY || '', 'CLERK_SECRET_KEY')
  const sourceKey = usableKey(process.env[args.sourceSecretEnv] || '', args.sourceSecretEnv)
  if (args.apply) assertApplyTarget(process.env.CLERK_SECRET_KEY || '', args.allowTestTarget)

  const docUsers = users.filter(hasDocumentAccessKey).length
  const adminCount = users.filter(isSourceAdmin).length
  const withSlugs = users.filter((record) => slugsOf(record).length > 0).length
  const noGrant = users.filter((record) => slugsOf(record).length === 0 && !isSourceAdmin(record)).length

  console.log('clerk-prod-migrate')
  console.log(`mode: ${args.apply ? 'apply' : 'dry-run'}`)
  console.log(`inventory: ${inventoryPath}`)
  console.log(
    `users: ${users.length} (admins ${adminCount}, with clientSlugs ${withSlugs}, no grant and not admin ${noGrant})`
  )
  if (loaded.meta?.clerk_instance) console.log(`inventory instance label: ${loaded.meta.clerk_instance}`)
  console.log(`target key: ${maskKey(targetKey)}`)
  console.log(`source key (${args.sourceSecretEnv}): ${maskKey(sourceKey)}`)
  console.log(`send invites: ${args.sendInvites ? 'yes' : 'no'}`)
  if (!targetKey) {
    console.log('existence: not checked (no usable CLERK_SECRET_KEY). Missing users are planned as create.')
  } else if (!args.apply) {
    console.log('existence: read-only lookups only. No POST, PATCH, or invitation revoke.')
  }
  if (docUsers > 0 && !sourceKey) {
    console.warn(
      `WARN: ${docUsers} users list private metadata key documentAccess, but ${args.sourceSecretEnv} is unset. Skipping documentAccess values. clientSlugs and admin flags still migrate.`
    )
  }
  if (args.apply && args.sendInvites) {
    console.warn(
      'WARN: --send-invites is on. Missing password-only users without private metadata to write will receive a Clerk invitation email.'
    )
  }
  if (duplicateRows.length > 0) {
    console.warn(`WARN: skipped duplicate inventory emails: ${duplicateRows.join(', ')}`)
  }

  allowWrites = args.apply === true
  const rows = []
  for (const record of users) {
    const row = await processOne(
      {
        apply: args.apply,
        sendInvites: args.sendInvites,
        targetKey,
        sourceKey,
      },
      record
    )
    rows.push(row)
    if (args.apply) await sleep(100)
  }
  allowWrites = false

  console.log('')
  console.log(args.apply ? 'SUMMARY (apply)' : 'SUMMARY (dry-run, no writes)')
  printTable(rows)
  const count = (action) => rows.filter((row) => row.action === action).length
  const emailCount = rows.filter((row) => row.notify).length
  console.log('')
  console.log(
    `counts: create ${count('create')}  update ${count('update')}  skip ${count('skip')}  error ${count('error')}`
  )
  console.log(
    args.apply
      ? `invite emails sent: ${emailCount}`
      : `invite emails that would be sent: ${emailCount}`
  )
  const buckets = printBuckets(rows)
  if (buckets.failures.length > 0) {
    console.error(`FAILED ${buckets.failures.length} user(s).`)
    process.exitCode = 1
  }
}

function summarizeBuckets(rows) {
  const failures = rows
    .filter((row) => row.failed || row.action === 'error')
    .map((row) => ({ email: row.email, reason: scrub(row.auth || 'failed') }))
  return {
    total: rows.length,
    withGrants: rows.filter((row) => Array.isArray(row.clientSlugs) && row.clientSlugs.length > 0).length,
    admins: rows.filter((row) => row.admin).length,
    failures,
  }
}

function printBuckets(rows) {
  const buckets = summarizeBuckets(rows)
  console.log('buckets:')
  console.log(`  total processed: ${buckets.total}`)
  console.log(`  with grants: ${buckets.withGrants}`)
  console.log(`  admins: ${buckets.admins}`)
  console.log(`  failures: ${buckets.failures.length}`)
  for (const failure of buckets.failures) {
    console.log(`    - ${failure.email}: ${failure.reason}`)
  }
  return buckets
}

async function selfTest() {
  const full = loadInventory(DEFAULT_INVENTORY)
  assert.equal(full.users.length, 36)
  const sorted = sortUsers(full.users)
  assert.equal(emailOf(sorted[0]), 'nate.beyor@tweedcollective.ai')
  assert.equal(emailOf(sorted[1]), 'nbeyor@gmail.com')
  assert.equal(emailOf(sorted[2]), 'abanna@eclinicalsol.com')
  assert.equal(emailOf(sorted[sorted.length - 1]), 'vmallarapu@eclinicalsol.com')
  assert.equal(sorted.length, 36)
  const emptyNonAdmin = sorted.filter((record) => slugsOf(record).length === 0 && !isSourceAdmin(record))
  assert.ok(emptyNonAdmin.length > 0)

  const nate = sorted[0]
  const nateDesired = desiredMetadata(nate, { state: 'n/a' })
  assert.deepEqual(nateDesired.publicMetadata.clientSlugs, ['ecs', 'protocol-strategist', 'protocol-authoring'])
  assert.equal(nateDesired.privateMetadata.isAdmin, true)
  assert.equal(Object.hasOwn(nateDesired.privateMetadata, 'documentAccess'), false)

  const nbeyor = sorted[1]
  const nbeyorDesired = desiredMetadata(nbeyor, { state: 'n/a' })
  assert.deepEqual(nbeyorDesired.publicMetadata.clientSlugs, [])
  assert.equal(nbeyorDesired.privateMetadata.isAdmin, true)

  const jen = full.users.find((record) => emailOf(record) === 'jen@wanderpants.com')
  const jenDesired = desiredMetadata(jen, { state: 'n/a' })
  assert.deepEqual(jenDesired.publicMetadata.clientSlugs, [])
  assert.equal(jenDesired.privateMetadata.isAdmin, undefined)
  const jenBody = userCreateBody(jen, jenDesired)
  assert.equal(jenBody.skip_password_requirement, true)
  assert.equal(Object.hasOwn(jenBody, 'password'), false)
  assert.equal(Object.hasOwn(jenBody, 'password_digest'), false)
  assert.equal(Object.hasOwn(jenBody, 'public_metadata'), false)

  const nameless = full.users.find((record) => emailOf(record) === 'takisanya@gipartners.com')
  const namelessBody = userCreateBody(nameless, desiredMetadata(nameless, { state: 'n/a' }))
  assert.equal(Object.hasOwn(namelessBody, 'first_name'), false)
  assert.equal(Object.hasOwn(namelessBody, 'last_name'), false)

  const passwordUser = full.users.find((record) => emailOf(record) === 'vmallarapu@eclinicalsol.com')
  assert.equal(chooseCreate(passwordUser, { sendInvites: false, privateNeeded: false }), 'user')
  assert.equal(chooseCreate(passwordUser, { sendInvites: true, privateNeeded: false }), 'invitation')
  assert.equal(chooseCreate(passwordUser, { sendInvites: true, privateNeeded: true }), 'user')
  assert.deepEqual(writePublicMetadata(nateDesired).clientSlugs, ['ecs', 'protocol-strategist', 'protocol-authoring'])
  assert.equal(Object.hasOwn(writePublicMetadata(jenDesired), 'clientSlugs'), false)

  const quietInvite = invitationBody('person@example.com', { clientSlugs: ['ecs'] }, false)
  assert.equal(quietInvite.notify, false)
  const loudInvite = invitationBody('person@example.com', { clientSlugs: [] }, true)
  assert.equal(loudInvite.notify, true)

  const live = {
    public_metadata: { clientSlugs: ['ecs'], other: 'keep' },
    private_metadata: { isAdmin: true },
  }
  assert.equal(diffMetadata(live, nateDesired).changed, true)
  const same = diffMetadata(
    {
      public_metadata: { clientSlugs: ['ecs', 'protocol-strategist', 'protocol-authoring'] },
      private_metadata: { isAdmin: true },
    },
    nateDesired
  )
  assert.equal(same.changed, false)
  const keepLiveGrants = diffMetadata(
    { public_metadata: { clientSlugs: ['ecs'], note: 'keep' }, private_metadata: { keep: true } },
    jenDesired
  )
  assert.equal(keepLiveGrants.changed, false)
  assert.equal(Object.hasOwn(keepLiveGrants.patch.public, 'clientSlugs'), false)

  const dummyLive = ['sk', 'live', 'abcdefghijklmnopqrstuvwxyz'].join('_')
  const dummyTest = ['sk', 'test', 'abcdefghijklmnopqrstuvwxyz'].join('_')
  assert.equal(maskKey(dummyLive), 'sk_live_[REDACTED]')
  assert.equal(maskKey(dummyLive).includes('abcdefgh'), false)
  assert.equal(scrub(`bearer ${dummyTest}`).includes('abcdefgh'), false)

  const dummyArg = ['sk', 'test', 'shouldnotappear'].join('_')
  assert.throws(() => parseArgs(['--source-secret-env', dummyArg]), (error) => {
    assert.equal(error.message.includes('shouldnotappear'), false)
    return true
  })

  const scoped = loadInventory(join(HERE, 'MIGRATE-SCOPE.json'))
  assert.equal(scoped.users.length, 18)
  assert.equal(emailOf(sortUsers(scoped.users)[0]), 'nate.beyor@tweedcollective.ai')

  const withDocs = desiredMetadata(passwordUser, { state: 'value', value: ['doc-a'] })
  assert.deepEqual(withDocs.privateMetadata.documentAccess, ['doc-a'])
  assert.equal(withDocs.privateMetadata.isAdmin, undefined)

  const offline = { apply: false, sendInvites: false, targetKey: '', sourceKey: '' }
  const planned = []
  for (const record of sorted) planned.push(await processOne(offline, record))
  const buckets = summarizeBuckets(planned)
  assert.equal(buckets.total, 36)
  assert.equal(buckets.withGrants, 17)
  assert.equal(buckets.admins, 2)
  assert.deepEqual(buckets.failures, [])
  assert.equal(planned.filter((row) => row.action === 'create').length, 36)
  assert.equal(planned.filter((row) => row.notify).length, 0)
  assert.equal(planned[0].email, 'nate.beyor@tweedcollective.ai')
  assert.equal(planned[1].email, 'nbeyor@gmail.com')
  const jenRow = planned.find((row) => row.email === 'jen@wanderpants.com')
  assert.equal(jenRow.action, 'create')
  assert.equal(jenRow.clientSlugs.length, 0)
  const failed = summarizeBuckets([
    { email: 'a@example.com', clientSlugs: ['ecs'], admin: false, failed: true, action: 'error', auth: 'lookup failed' },
    { email: 'b@example.com', clientSlugs: [], admin: true, failed: false, action: 'skip', auth: 'already matches' },
  ])
  assert.equal(failed.total, 2)
  assert.equal(failed.withGrants, 1)
  assert.equal(failed.admins, 1)
  assert.equal(failed.failures.length, 1)
  assert.equal(failed.failures[0].email, 'a@example.com')
  assert.equal(failed.failures[0].reason, 'lookup failed')

  console.log('self-test ok')
}

async function cli() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(HELP)
    return
  }
  if (args.selfTest) {
    await selfTest()
    return
  }
  await run(args)
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  cli().catch((error) => {
    const code = error.exitCode || 1
    console.error(scrub(error.message || String(error)))
    process.exit(code)
  })
}
