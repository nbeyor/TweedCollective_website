import { randomBytes } from 'crypto'

import { buildCollapseViz, type CollapseSearchHit } from '../collapse'
import { countClaims, scoreFor, v0Score, type Claim, type VerificationResult } from '../types'
import type { PublicReport } from './store'

/**
 * A seeded report so the public page and tests can render a real CollapseViz
 * without Twilio or a model. The score is v0Score of the claims below.
 */
export function buildFixtureReport(id = randomBytes(16).toString('hex')): PublicReport {
  const claims: Claim[] = [
    {
      id: `${id}-c0`,
      text: 'The FDA approved Zircomab in 2019 for adults with rare anemia.',
      verifiability: 'VERIFIABLE',
      evaluation: {
        verdict: 'SUPPORTED',
        confidence: 0.8,
        rationale: 'Public regulatory pages describe an approval for that use.',
        evidence: [
          {
            id: `${id}-c0-e0`,
            url: 'https://www.fda.gov/news/zircomab-approval',
            sourceName: 'FDA',
            title: 'FDA approves Zircomab for rare anemia',
            snippet: 'The agency announced the approval in January 2019.',
            stance: 'supports',
          },
        ],
      },
    },
    {
      id: `${id}-c1`,
      text: 'A clinic bulletin said follow-up visits were unchanged.',
      verifiability: 'VERIFIABLE',
      evaluation: {
        verdict: 'INSUFFICIENT_EVIDENCE',
        confidence: 0.4,
        rationale: 'One page mentions the bulletin and does not settle it.',
        evidence: [
          {
            id: `${id}-c1-e0`,
            url: 'https://www.cdc.gov/bulletins/follow-up',
            sourceName: 'CDC',
            title: 'Clinic bulletin note',
            snippet: 'A short note records the bulletin without further detail.',
            stance: 'context',
          },
        ],
      },
    },
    {
      id: `${id}-c2`,
      text: 'Patients reported fewer hospital stays overall in the pamphlet.',
      verifiability: 'VERIFIABLE',
      evaluation: {
        verdict: 'INSUFFICIENT_EVIDENCE',
        confidence: 0.3,
        rationale: 'The mention search did not return a page for this line.',
        evidence: [],
      },
    },
    {
      id: `${id}-c3`,
      text: 'This is the best treatment anyone could ask for.',
      verifiability: 'OPINION',
    },
  ]

  const phrase = 'patients reported fewer hospital stays overall'
  const clusterB: CollapseSearchHit[] = [
    ['https://www.healthline.com/a', 'Local clinic discusses follow up care'],
    ['https://www.webmd.com/b', 'Evening clinic posts a scheduling note'],
    ['https://www.mayoclinic.org/c', 'Community board lists appointment hours'],
  ].map(([url, title]) => ({ url, title, snippet: `${phrase} in this short recap.`, pageAge: null }))

  const approvalHits: CollapseSearchHit[] = [
    ['https://www.fda.gov/news/zircomab-approval', 'FDA approves Zircomab for rare anemia - FDA', '2019-01-01'],
    ['https://www.nature.com/articles/zircomab', 'FDA approves Zircomab for rare anemia - Nature', '2019-01-02'],
    ['https://www.reuters.com/world/zircomab', 'FDA approves Zircomab for rare anemia - Reuters', '2019-02-03'],
    ['https://apnews.com/article/zircomab', 'FDA approves Zircomab for rare anemia - AP', '2019-06-04'],
    ['https://www.nih.gov/news/zircomab', 'FDA approves Zircomab for rare anemia - NIH', '2019-06-18'],
  ].map(([url, title, pageAge]) => ({
    url,
    title,
    snippet: 'Coverage of the approval announcement.',
    pageAge,
  }))
  const clusterA = [...approvalHits, ...clusterB]

  const checkedAt = '2026-09-23T00:00:00.000Z'
  const result: VerificationResult = {
    id,
    surface: 'mms',
    mode: 'live',
    contentLabel: 'Screenshot — text message',
    submittedText: '',
    summary: 'Public pages support the approval line. Two other lines do not have enough to judge.',
    claims,
    score: scoreFor(v0Score(countClaims(claims))),
    checkedAt,
    evidenceMode: 'web',
    truncated: false,
  }

  const collapse = buildCollapseViz({
    claims,
    hitsByClaimId: {
      [claims[0].id]: clusterA,
      [claims[1].id]: [
        {
          url: 'https://www.cdc.gov/bulletins/follow-up',
          title: 'Clinic bulletin note',
          snippet: 'A short note records the bulletin without further detail.',
          pageAge: '2020-04-01',
        },
      ],
    },
  })

  return {
    id,
    surface: 'mms',
    mode: 'live',
    submittedText: '',
    contentLabel: result.contentLabel,
    summary: result.summary,
    claims: result.claims,
    score: result.score,
    checkedAt,
    evidenceMode: 'web',
    methodologyVersion: 'v0.1',
    truncated: false,
    createdAt: checkedAt,
    expiresAt: '2026-10-23T00:00:00.000Z',
    collapse,
  }
}
