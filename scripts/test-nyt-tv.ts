/**
 * NYT 100 swipe deck: profile mapping, Pacific day key, digest grouping, file store.
 *
 * Run with: npm run test:nyt-tv
 */

import { mkdtemp, rm } from 'fs/promises'
import os from 'os'
import path from 'path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  DEFAULT_NATE_EMAIL,
  digestRecipients,
  profileForEmail,
  profileForSubject,
  voteRecord,
  type ProfileSubject,
} from '../lib/nyt-tv/access'
import { cronRequestAuthorized } from '../lib/nyt-tv/cronAuth'
import { pacificDayKey } from '../lib/nyt-tv/day'
import { buildDigest, digestHtml, digestText, voteInDigest } from '../lib/nyt-tv/digest'
import { allShows, deckShows } from '../lib/nyt-tv/shows'
import { createFileVoteStore } from '../lib/nyt-tv/store'
import type { VoteRecord } from '../lib/nyt-tv/types'
import { SwipeDeck } from '../components/nyt-tv/SwipeDeck'

let failures = 0
let checks = 0

function check(label: string, ok: boolean, detail?: string) {
  checks++
  if (ok) {
    console.log(`  ok  ${label}`)
    return
  }
  failures++
  console.error(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
}

function vote(profileId: 'nate' | 'jen', showRank: number, choice: 'want' | 'skip', updatedAt: string, dayKey: string): VoteRecord {
  return { profileId, showRank, vote: choice, updatedAt, dayKey }
}

async function main() {
  const shows = allShows()
  const ranks = new Set(shows.map((show) => show.rank))
  check('pack has 100 unique ranks', shows.length === 100 && ranks.size === 100)

  const nateDeck = deckShows('nate')
  const jenDeck = deckShows('jen')
  check('deck keeps every show', nateDeck.length === 100 && jenDeck.length === 100)
  check('nate sees a seen badge', nateDeck[0]?.ownerBadge === 'Seen')
  check('nate sees partial and the note', nateDeck[4]?.ownerBadge === 'Partial' && Boolean(nateDeck[4]?.ownerNotes))
  check('nate sees a skip badge', nateDeck.find((show) => show.rank === 16)?.ownerBadge === 'Skip')
  check('unchecked has no badge', nateDeck.find((show) => show.rank === 21)?.ownerBadge === null)
  check('jen gets no owner flags', jenDeck.every((show) => show.ownerBadge === null && show.ownerNotes === null))

  const nateHtml = renderToStaticMarkup(
    React.createElement(SwipeDeck, {
      profileId: 'nate',
      profileLabel: 'Nate',
      shows: nateDeck.slice(0, 5),
      initialVotes: [],
      persistence: 'blob',
      source: 'NYT industry poll',
    })
  )
  check(
    'nate card renders title, badge, and actions',
    nateHtml.includes('Breaking Bad') && nateHtml.includes('Seen') && nateHtml.includes('Want') && nateHtml.includes('Skip')
  )
  const jenHtml = renderToStaticMarkup(
    React.createElement(SwipeDeck, {
      profileId: 'jen',
      profileLabel: 'Jen',
      shows: jenDeck.slice(0, 5),
      initialVotes: [],
      persistence: 'file',
      source: 'NYT industry poll',
    })
  )
  check('jen card hides the checklist and warns on file storage', jenHtml.includes('Breaking Bad') && !jenHtml.includes('Seen') && jenHtml.includes('BLOB_READ_WRITE_TOKEN'))

  check('nate default email', DEFAULT_NATE_EMAIL === 'nate.beyor@tweedcollective.ai')
  check(
    'nate email hint maps to nate',
    profileForEmail('Nate.Beyor@tweedcollective.ai', {}) === 'nate'
  )
  check('unknown email hint assigns nobody', profileForEmail('jen@example.com', {}) === null)
  const jenEnv = { NYT_TV_JEN_EMAIL: 'Jen@example.com' }
  check('jen email hint maps to jen', profileForEmail('jen@example.com', jenEnv) === 'jen')
  check(
    'duplicate env does not create a jen profile',
    profileForEmail(DEFAULT_NATE_EMAIL, { NYT_TV_JEN_EMAIL: DEFAULT_NATE_EMAIL }) === 'nate'
  )
  check('digest recipients', digestRecipients(jenEnv).join(',') === `${DEFAULT_NATE_EMAIL},jen@example.com`)
  check('digest omits jen until her address is set', digestRecipients({}).join(',') === DEFAULT_NATE_EMAIL)

  const granted = (overrides: Partial<ProfileSubject>): ProfileSubject => ({
    isAdmin: false,
    email: 'jen@example.com',
    verified: true,
    hasClientAccess: true,
    ...overrides,
  })
  check(
    'admin maps to nate without the nate email',
    profileForSubject(granted({ isAdmin: true, email: 'other@example.com' }), {}) === 'nate'
  )
  check(
    'verified nate email maps to nate',
    profileForSubject(granted({ email: 'Nate.Beyor@tweedcollective.ai', hasClientAccess: false }), {}) === 'nate'
  )
  check(
    'unverified nate email is not nate by address',
    profileForSubject(granted({ email: DEFAULT_NATE_EMAIL, verified: false, hasClientAccess: false }), {}) === null
  )
  check(
    'granted non-nate maps to jen without NYT_TV_JEN_EMAIL',
    profileForSubject(granted({ email: 'jen@example.com' }), {}) === 'jen'
  )
  check(
    'jen email hint maps a verified address before the grant fallback',
    profileForSubject(granted({ hasClientAccess: false }), jenEnv) === 'jen'
  )
  check(
    'unknown email without a grant maps to nobody',
    profileForSubject(granted({ hasClientAccess: false }), {}) === null
  )
  check(
    'admin wins when the same address is also the jen hint',
    profileForSubject(granted({ isAdmin: true }), jenEnv) === 'nate'
  )

  const eightPmPdt = new Date('2026-09-30T03:00:00.000Z')
  check('8pm PDT day key', pacificDayKey(eightPmPdt) === '2026-09-29', pacificDayKey(eightPmPdt))
  const justAfterMidnightPdt = new Date('2026-09-30T07:00:00.000Z')
  check('midnight PDT rolls the day', pacificDayKey(justAfterMidnightPdt) === '2026-09-30')
  const eightPmPst = new Date('2026-11-04T04:00:00.000Z')
  check('8pm PST day key', pacificDayKey(eightPmPst) === '2026-11-03', pacificDayKey(eightPmPst))

  const recorded = voteRecord('jen', 14, 'want', new Date('2026-09-30T03:00:00.000Z'))
  check('vote record stamps the Pacific day', recorded.dayKey === '2026-09-29' && recorded.vote === 'want')

  const sample: VoteRecord[] = [
    vote('nate', 14, 'want', '2026-09-29T18:00:00.000Z', '2026-09-29'),
    vote('jen', 14, 'want', '2026-09-29T19:00:00.000Z', '2026-09-29'),
    vote('nate', 16, 'skip', '2026-09-29T19:30:00.000Z', '2026-09-29'),
    vote('jen', 1, 'skip', '2026-09-28T16:00:00.000Z', '2026-09-28'),
    vote('nate', 2, 'want', '2026-09-30T01:00:00.000Z', '2026-09-29'),
  ]

  check(
    'backlog includes an earlier day before the first send',
    voteInDigest(sample[3], '2026-09-29', null, 'since-last')
  )
  check(
    'after a send, only newer swipes are included',
    voteInDigest(sample[4], '2026-09-29', '2026-09-29T20:00:00.000Z', 'since-last') &&
      !voteInDigest(sample[0], '2026-09-29', '2026-09-29T20:00:00.000Z', 'since-last')
  )

  const digest = buildDigest({
    dayKey: '2026-09-29',
    votes: sample,
    lastSentAt: null,
    shows: allShows(),
  })
  check('overlap is rank 14', digest.bothWanted.map((line) => line.rank).join(',') === '14')
  check('nate has one skip', digest.profiles[0]?.skips.length === 1 && digest.profiles[0]?.wants.length === 2)
  check('jen keeps the earlier skip in the first digest', digest.profiles[1]?.skips.some((line) => line.rank === 1 && line.late))
  const text = digestText(digest)
  check('text names both people and the overlap', text.includes('Both wanted') && text.includes('Friday Night Lights') && text.includes('Jen'))

  const escaped = digestHtml(
    buildDigest({
      dayKey: '2026-09-29',
      votes: [vote('nate', 1, 'want', '2026-09-29T18:00:00.000Z', '2026-09-29')],
      shows: [{ rank: 1, title: '<script>', description: 'a & b', status: 'unchecked', notes: '' }],
    })
  )
  check('html escapes titles', escaped.includes('&lt;script&gt;') && escaped.includes('a &amp; b') && !escaped.includes('<script>'))

  const dir = await mkdtemp(path.join(os.tmpdir(), 'nyt-tv-'))
  try {
    const store = createFileVoteStore(dir)
    check('file store starts empty', (await store.listVotes()).length === 0)
    await store.putVote(recorded)
    await store.putVote(vote('nate', 16, 'skip', '2026-09-29T19:30:00.000Z', '2026-09-29'))
    const jenVotes = await store.listVotes('jen')
    const all = await store.listVotes()
    check('file store keeps profiles apart', jenVotes.length === 1 && jenVotes[0]?.vote === 'want' && all.length === 2)
    await store.deleteVote('jen', 14)
    check('delete removes one swipe', (await store.listVotes()).length === 1)
    await store.markDigestSent({ sentAt: '2026-09-30T03:00:00.000Z', dayKey: '2026-09-29', recipients: [DEFAULT_NATE_EMAIL] })
    const marker = await store.getDigestSent()
    check('digest marker round-trips', marker?.dayKey === '2026-09-29' && marker.recipients[0] === DEFAULT_NATE_EMAIL)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }

  const previousSecret = process.env.CRON_SECRET
  process.env.CRON_SECRET = 'cron-test-secret'
  check('cron bearer matches', cronRequestAuthorized('Bearer cron-test-secret'))
  check('cron bearer rejects a lookalike', !cronRequestAuthorized('Bearer cron-test-secre'))
  check('cron bearer rejects empty', !cronRequestAuthorized(null))
  if (previousSecret === undefined) delete process.env.CRON_SECRET
  else process.env.CRON_SECRET = previousSecret

  console.log(`\n${checks - failures} passed, ${failures} failed`)
  if (failures > 0) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
