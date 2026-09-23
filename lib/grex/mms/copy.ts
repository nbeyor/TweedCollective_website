/**
 * User-facing MMS copy. Evidence strength only.
 * The words true, false, fake, real, lie, misinformation, and valid stay out.
 */

import { countClaims, type ClaimCounts, type Score } from '../types'

export const MMS_COPY = {
  ack: "Tough one — working on it. I'll text the evidence score when it's ready.",
  mid: 'Still working — reading where these claims show up publicly.',
  failure: "GREX couldn't finish that check. Send the image again, or a tighter screenshot of the claim.",
  nothingToCheck: "GREX found nothing factual to check in that image. Opinions and vague lines aren't scored.",
  textOnly: 'Send a screenshot of the claim. GREX reads an image, not a typed message.',
  singleImage: 'Send a single screenshot. GREX checks one image at a time.',
  illegible: 'A screenshot of the text works better than a photo of a page.',
  tooLarge: "That image is too large. Screenshot a smaller crop of the claim.",
  inFlight: 'Still checking the last image.',
  dailyCap: 'GREX is paused until tomorrow on this number.',
  ceiling: 'GREX is paused for today.',
  stop: 'GREX texts are off. No further messages will be sent. Reply START to resume.',
  help: 'GREX checks one screenshot for public evidence strength. Send one image. Reply STOP to opt out. Msg & data rates may apply.',
  start: 'GREX texts are on. Send one screenshot when you want an evidence score.',
  truncated: 'Checked the first 8 claims.',
  degradedSms: 'Web search was limited.',
  degradedPage:
    'Web evidence retrieval was limited during this check, so some claims are marked “couldn\'t verify” that might otherwise have been resolvable.',
  collapseHeading: 'How the mentions collapse',
  collapseNoHits: "The mention search didn't return enough to draw a collapse for this claim.",
  collapseOnePage: 'One page retrieved — nothing to collapse.',
  collapseNoClaims: 'No verifiable claims, so there is no mention diagram.',
  histogramTitle: 'Dates printed on these results',
  histogramOmitted: 'Not enough dates in these results to show a timeline.',
  noDate: 'No date in what we retrieved',
  earliestPrefix: 'Earliest date we could see',
  searchedPrefix: 'Searched',
  capability: 'Anyone with this link can open it.',
  unavailableTitle: "This report isn't available",
  unavailableBody: 'The link may be wrong, or the report has passed its 30-day window.',
  methodology:
    'Scoring methodology v0.1: each verifiable claim counts 1 if supported, 0.5 if evidence was insufficient, 0 if contradicted; the score is the average × 100. A score reflects the strength of publicly available evidence for the claims checked.',
  helpKicker: 'GREX by text',
  helpSteps: [
    'Screenshot the claim.',
    'Send the picture to this contact.',
    'Wait for the evidence score.',
  ],
  helpUsOnly: 'US picture messages only. If the picture does not send, screenshot a smaller crop.',
  helpSmsLink: 'This link opens a text thread. It does not attach the picture.',
  helpUnpublished: "The GREX number isn't published on this deployment yet.",
} as const

export function evidenceClause(counts: ClaimCounts): string {
  const claimWord = counts.verifiable === 1 ? 'claim has' : 'claims have'
  const parts = [`${counts.supported} of ${counts.verifiable} ${claimWord} public support`]
  if (counts.insufficient === 1) parts.push("1 doesn't have enough to judge")
  else if (counts.insufficient > 1) parts.push(`${counts.insufficient} don't have enough to judge`)
  if (counts.contradicted === 1) parts.push('1 is contradicted by public evidence')
  else if (counts.contradicted > 1) parts.push(`${counts.contradicted} are contradicted by public evidence`)
  return parts.join('; ')
}

export function resultSms(args: {
  score: Score
  claims: Parameters<typeof countClaims>[0]
  url: string
  truncated: boolean
  degraded: boolean
}): string {
  const counts = countClaims(args.claims)
  const lead = args.truncated ? `${MMS_COPY.truncated} ` : ''
  const degraded = args.degraded ? ` ${MMS_COPY.degradedSms}` : ''
  if (args.score.value === null || args.score.special === 'NO_VERIFIABLE_CLAIMS') {
    return `${lead}${MMS_COPY.nothingToCheck}${degraded} ${args.url}`.replace(/ +/g, ' ').trim()
  }
  return `${lead}GREX evidence ${args.score.value}/100 (${args.score.label}). ${evidenceClause(counts)}.${degraded} ${args.url}`
    .replace(/ +/g, ' ')
    .trim()
}
