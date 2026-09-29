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

import { DEFAULT_NATE_EMAIL, showsOwnerNotes, voteRecord } from '../lib/nyt-tv/access'
import { PairHeaderView } from '../components/nyt-tv/PairHeader'
import { SwipeDeck } from '../components/nyt-tv/SwipeDeck'
import { cronRequestAuthorized } from '../lib/nyt-tv/cronAuth'
import { pacificDayKey } from '../lib/nyt-tv/day'
import { buildDigest, digestHtml, digestText, voteInDigest } from '../lib/nyt-tv/digest'
import { bindInvite, bootstrapInvite, createOrUpdateInvite } from '../lib/nyt-tv/pairing'
import { decideBind, invitePath } from '../lib/nyt-tv/pairs'
import { allShows, deckShows, shuffleDeck } from '../lib/nyt-tv/shows'
import { createFileVoteStore } from '../lib/nyt-tv/store'
import type { VoteRecord } from '../lib/nyt-tv/types'

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

/** Deterministic 32-bit LCG so shuffle tests do not depend on Math.random. */
function lcg(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function vote(
  userId: string,
  pairId: string,
  showRank: number,
  choice: 'want' | 'skip',
  updatedAt: string,
  dayKey: string
): VoteRecord {
  return { userId, pairId, showRank, vote: choice, updatedAt, dayKey }
}

async function main() {
  const shows = allShows()
  const ranks = new Set(shows.map((show) => show.rank))
  check('pack has 100 unique ranks', shows.length === 100 && ranks.size === 100)
  const longReviews = shows.filter(
    (show) =>
      !show.reviewPro.trim() ||
      !show.reviewCon.trim() ||
      show.reviewPro.length > 120 ||
      show.reviewCon.length > 120
  )
  check(
    'every show has a short pro and con',
    longReviews.length === 0,
    longReviews.map((show) => `${show.rank}:${show.reviewPro.length}/${show.reviewCon.length}`).join(' ')
  )

  const nateDeck = deckShows(true)
  const jenDeck = deckShows(false)
  check('deck keeps every show', nateDeck.length === 100 && jenDeck.length === 100)
  check(
    'deck stays in rank order before shuffle',
    nateDeck.every((show, index) => show.rank === index + 1)
  )
  check(
    'deck passes pro and con to both profiles',
    nateDeck.every((show) => show.reviewPro && show.reviewCon) &&
      jenDeck.every((show) => show.reviewPro && show.reviewCon)
  )
  const seeded = shuffleDeck(jenDeck, lcg(7))
  const seededAgain = shuffleDeck(jenDeck, lcg(7))
  check(
    'shuffle is a stable permutation for a seed',
    seeded.map((show) => show.rank).join(',') === seededAgain.map((show) => show.rank).join(',') &&
      new Set(seeded.map((show) => show.rank)).size === 100
  )
  check(
    'shuffle does not walk NYT rank',
    seeded.map((show) => show.rank).join(',') !== jenDeck.map((show) => show.rank).join(',')
  )
  const votedFirst = seeded[0]?.rank
  const remaining = seeded.filter((show) => show.rank !== votedFirst)
  check(
    'unvoted shows keep the shuffled order',
    remaining.map((show) => show.rank).join(',') === seeded.slice(1).map((show) => show.rank).join(',')
  )
  check('nate sees a seen badge', nateDeck[0]?.ownerBadge === 'Seen')
  check('nate sees partial and the note', nateDeck[4]?.ownerBadge === 'Partial' && Boolean(nateDeck[4]?.ownerNotes))
  check('nate sees a skip badge', nateDeck.find((show) => show.rank === 16)?.ownerBadge === 'Skip')
  check('unchecked has no badge', nateDeck.find((show) => show.rank === 21)?.ownerBadge === null)
  check('jen gets no owner flags', jenDeck.every((show) => show.ownerBadge === null && show.ownerNotes === null))

  const nateHtml = renderToStaticMarkup(
    React.createElement(SwipeDeck, {
      userId: 'user_nate',
      pairId: 'pair_test',
      profileLabel: 'nate@example.com',
      shows: nateDeck.slice(0, 5),
      initialVotes: [],
      persistence: 'blob',
      source: 'NYT industry poll',
    })
  )
  const breaking = nateDeck[0]
  const descriptionProbe = (breaking?.description ?? '').split("'")[0]
  const titleAt = nateHtml.indexOf(breaking?.title ?? '')
  const descriptionAt = descriptionProbe ? nateHtml.indexOf(descriptionProbe) : -1
  const proAt = nateHtml.indexOf('>Pro<')
  const conAt = nateHtml.indexOf('>Con<')
  check(
    'nate card leads with title, then tagline, pro, and con',
    Boolean(breaking) &&
      titleAt >= 0 &&
      descriptionAt > titleAt &&
      proAt > descriptionAt &&
      conAt > proAt &&
      nateHtml.includes(breaking?.reviewPro ?? '') &&
      nateHtml.includes(breaking?.reviewCon ?? '') &&
      nateHtml.includes('Seen') &&
      nateHtml.includes('Want') &&
      nateHtml.includes('Skip') &&
      /<h2[^>]*text-charcoal[^>]*>Breaking Bad<\/h2>/.test(nateHtml)
  )
  const wireFirst = jenDeck.filter((show) => show.rank === 2 || show.rank === 1).sort((a, b) => b.rank - a.rank)
  const shuffledHtml = renderToStaticMarkup(
    React.createElement(SwipeDeck, {
      userId: 'user_jen',
      pairId: 'pair_test',
      profileLabel: 'jen@example.com',
      shows: wireFirst,
      initialVotes: [],
      persistence: 'blob',
      source: 'NYT industry poll',
    })
  )
  const wireTitle = shuffledHtml.indexOf('The Wire')
  const breakingTitle = shuffledHtml.indexOf('Breaking Bad')
  check(
    'card follows the given order instead of NYT rank',
    wireTitle >= 0 && (breakingTitle === -1 || wireTitle < breakingTitle)
  )
  const jenHtml = renderToStaticMarkup(
    React.createElement(SwipeDeck, {
      userId: 'user_jen',
      pairId: 'pair_test',
      profileLabel: 'jen@example.com',
      shows: jenDeck.slice(0, 5),
      initialVotes: [],
      persistence: 'file',
      source: 'NYT industry poll',
    })
  )
  const fleabag = nateDeck.find((show) => show.rank === 5)
  const fleabagHtml = renderToStaticMarkup(
    React.createElement(SwipeDeck, {
      userId: 'user_nate',
      pairId: 'pair_test',
      profileLabel: 'nate@example.com',
      shows: fleabag ? [fleabag] : [],
      initialVotes: [],
      persistence: 'blob',
      source: 'NYT industry poll',
    })
  )
  check(
    'nate notes still sit with the review',
    Boolean(fleabag?.ownerNotes) &&
      fleabagHtml.includes(fleabag?.ownerNotes ?? '') &&
      fleabagHtml.includes(fleabag?.reviewPro ?? '') &&
      fleabagHtml.includes('Partial')
  )
  check(
    'jen card hides the checklist, keeps the review, and warns on file storage',
    jenHtml.includes('Breaking Bad') &&
      jenHtml.includes(jenDeck[0]?.reviewPro ?? '') &&
      !jenHtml.includes('Seen') &&
      jenHtml.includes('BLOB_READ_WRITE_TOKEN')
  )

  check('nate default email', DEFAULT_NATE_EMAIL === 'nate.beyor@tweedcollective.ai')
  check('admin sees owner notes', showsOwnerNotes({ isAdmin: true, email: 'other@example.com' }))
  check(
    'verified nate email sees owner notes',
    showsOwnerNotes({ isAdmin: false, email: 'Nate.Beyor@tweedcollective.ai' })
  )
  check('a partner does not see owner notes', !showsOwnerNotes({ isAdmin: false, email: 'jen@example.com' }))

  const pending = {
    id: 'pair_1',
    createdAt: '2026-09-29T00:00:00.000Z',
    status: 'pending' as const,
    inviteEmail: 'jen@example.com',
    inviteToken: 'invite-token',
    members: [{ userId: 'user_nate', email: DEFAULT_NATE_EMAIL, joinedAt: '2026-09-29T00:00:00.000Z' }],
  }
  check(
    'invite link is the join path and hides the email',
    invitePath('invite-token') === '/clients/nyt-tv-100/join/invite-token' && !invitePath('invite-token').includes('jen@')
  )
  check(
    'partner email binds',
    decideBind({
      pair: pending,
      viewerUserId: 'user_jen',
      viewerEmail: 'Jen@example.com',
      viewerVerified: true,
      viewerPairId: null,
    }).kind === 'bind'
  )
  check(
    'wrong email does not bind',
    decideBind({
      pair: pending,
      viewerUserId: 'user_other',
      viewerEmail: 'other@example.com',
      viewerVerified: true,
      viewerPairId: null,
    }).kind === 'email-mismatch'
  )
  check(
    'inviter opening the link is not a bind',
    decideBind({
      pair: pending,
      viewerUserId: 'user_nate',
      viewerEmail: DEFAULT_NATE_EMAIL,
      viewerVerified: true,
      viewerPairId: 'pair_1',
    }).kind === 'already-member'
  )
  const soloHeader = renderToStaticMarkup(
    React.createElement(PairHeaderView, {
      viewerEmail: DEFAULT_NATE_EMAIL,
      status: 'solo',
      partnerEmail: null,
      invitePath: null,
      onCreate: async () => undefined,
    })
  )
  const pendingHeader = renderToStaticMarkup(
    React.createElement(PairHeaderView, {
      viewerEmail: DEFAULT_NATE_EMAIL,
      status: 'pending',
      partnerEmail: 'jen@example.com',
      invitePath: '/clients/nyt-tv-100/join/invite-token',
      onCreate: async () => undefined,
    })
  )
  check('landing invite field is the solo header', soloHeader.includes('Partner email') && soloHeader.includes('Create invite'))
  check(
    'pending header shows the partner and the link',
    pendingHeader.includes('Invite pending for jen@example.com') &&
      pendingHeader.includes('/clients/nyt-tv-100/join/invite-token') &&
      pendingHeader.includes('Copy link') &&
      pendingHeader.includes('Update invite')
  )

  const eightPmPdt = new Date('2026-09-30T03:00:00.000Z')
  check('8pm PDT day key', pacificDayKey(eightPmPdt) === '2026-09-29', pacificDayKey(eightPmPdt))
  const justAfterMidnightPdt = new Date('2026-09-30T07:00:00.000Z')
  check('midnight PDT rolls the day', pacificDayKey(justAfterMidnightPdt) === '2026-09-30')
  const eightPmPst = new Date('2026-11-04T04:00:00.000Z')
  check('8pm PST day key', pacificDayKey(eightPmPst) === '2026-11-03', pacificDayKey(eightPmPst))

  const recorded = voteRecord('user_jen', 'pair_1', 14, 'want', new Date('2026-09-30T03:00:00.000Z'))
  check('vote record stamps the Pacific day', recorded.dayKey === '2026-09-29' && recorded.vote === 'want')

  const members = [
    { userId: 'user_nate', label: 'nate@example.com' },
    { userId: 'user_jen', label: 'jen@example.com' },
  ]
  const sample: VoteRecord[] = [
    vote('user_nate', 'pair_1', 14, 'want', '2026-09-29T18:00:00.000Z', '2026-09-29'),
    vote('user_jen', 'pair_1', 14, 'want', '2026-09-29T19:00:00.000Z', '2026-09-29'),
    vote('user_nate', 'pair_1', 16, 'skip', '2026-09-29T19:30:00.000Z', '2026-09-29'),
    vote('user_jen', 'pair_1', 1, 'skip', '2026-09-28T16:00:00.000Z', '2026-09-28'),
    vote('user_nate', 'pair_1', 2, 'want', '2026-09-30T01:00:00.000Z', '2026-09-29'),
    vote('user_other', 'pair_2', 14, 'want', '2026-09-29T18:00:00.000Z', '2026-09-29'),
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
    votes: sample.filter((item) => item.pairId === 'pair_1'),
    members,
    lastSentAt: null,
    shows: allShows(),
  })
  check('overlap is rank 14', digest.bothWanted.map((line) => line.rank).join(',') === '14')
  check('first member has one skip', digest.profiles[0]?.skips.length === 1 && digest.profiles[0]?.wants.length === 2)
  check('partner keeps the earlier skip in the first digest', digest.profiles[1]?.skips.some((line) => line.rank === 1 && line.late))
  const text = digestText(digest)
  check(
    'text names both people and the overlap',
    text.includes('Both wanted') && text.includes('Friday Night Lights') && text.includes('jen@example.com') && !text.includes('user_other')
  )

  const escaped = digestHtml(
    buildDigest({
      dayKey: '2026-09-29',
      votes: [vote('user_nate', 'pair_1', 1, 'want', '2026-09-29T18:00:00.000Z', '2026-09-29')],
      members: [{ userId: 'user_nate', label: 'nate@example.com' }],
      shows: [{ rank: 1, title: '<script>', description: 'a & b', reviewPro: 'p', reviewCon: 'c', status: 'unchecked', notes: '' }],
    })
  )
  check('html escapes titles', escaped.includes('&lt;script&gt;') && escaped.includes('a &amp; b') && !escaped.includes('<script>'))

  const dir = await mkdtemp(path.join(os.tmpdir(), 'nyt-tv-'))
  try {
    const store = createFileVoteStore(dir)
    check('file store starts empty', (await store.listVotes()).length === 0)
    const created = await createOrUpdateInvite(
      store,
      { userId: 'user_nate', email: DEFAULT_NATE_EMAIL },
      'Jen@example.com',
      new Date('2026-09-29T12:00:00.000Z')
    )
    check('invite starts pending', created.ok && created.pair.status === 'pending' && created.pair.inviteEmail === 'jen@example.com')
    const token = created.ok ? created.pair.inviteToken : ''
    const pendingVote = voteRecord('user_nate', created.ok ? created.pair.id : 'missing', 3, 'want', new Date('2026-09-29T12:05:00.000Z'))
    await store.putVote(pendingVote)
    check(
      'inviter can store a swipe while the invite is pending',
      (await store.listVotes('user_nate')).length === 1 && (await store.listVotes('user_nate'))[0]?.showRank === 3
    )
    const wrong = await bindInvite(store, { userId: 'user_other', email: 'other@example.com', verified: true }, token)
    check('wrong email does not join the pair', wrong.kind === 'email-mismatch' && (await store.getPairForUser('user_other')) == null)
    const bound = await bindInvite(store, { userId: 'user_jen', email: 'jen@example.com', verified: true }, token)
    check('matching email binds the pair', bound.kind === 'bind' && bound.pair?.status === 'active' && bound.pair.members.length === 2)
    const again = await createOrUpdateInvite(store, { userId: 'user_a', email: 'a@example.com' }, 'b@example.com')
    const otherBound = await bindInvite(store, { userId: 'user_b', email: 'b@example.com', verified: true }, again.ok ? again.pair.inviteToken : '')
    check('a second couple is a separate pair', otherBound.kind === 'bind' && otherBound.pair?.id !== bound.pair?.id)
    await store.putVote(recorded.showRank === 14 ? { ...recorded, pairId: created.ok ? created.pair.id : recorded.pairId, userId: 'user_jen' } : recorded)
    await store.putVote(vote('user_nate', created.ok ? created.pair.id : 'pair_1', 16, 'skip', '2026-09-29T19:30:00.000Z', '2026-09-29'))
    const jenVotes = await store.listVotes('user_jen')
    const all = await store.listVotes()
    check('file store keeps people apart', jenVotes.length === 1 && jenVotes[0]?.vote === 'want' && jenVotes[0]?.showRank === 14 && all.length === 3)
    await store.deleteVote('user_jen', 14)
    check('delete removes one swipe', (await store.listVotes('user_jen')).length === 0 && (await store.listVotes()).length === 2)
    const bootDir = await mkdtemp(path.join(os.tmpdir(), 'nyt-boot-'))
    try {
      const boot = createFileVoteStore(bootDir)
      const bootstrapped = await bootstrapInvite(
        boot,
        { userId: 'user_nate', email: DEFAULT_NATE_EMAIL },
        { NYT_TV_JEN_EMAIL: 'Jen@example.com' }
      )
      check(
        'env bootstrap creates a pending invite and does not bind',
        bootstrapped?.status === 'pending' &&
          bootstrapped.inviteEmail === 'jen@example.com' &&
          bootstrapped.members.length === 1 &&
          invitePath(bootstrapped.inviteToken).startsWith('/clients/nyt-tv-100/join/')
      )
      const skipped = await bootstrapInvite(boot, { userId: 'user_other', email: 'other@example.com' }, { NYT_TV_JEN_EMAIL: 'Jen@example.com' })
      check('env bootstrap ignores everyone except the nate address', skipped == null)
    } finally {
      await rm(bootDir, { recursive: true, force: true })
    }
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
