/**
 * Canned demo scenarios. All outlets, companies, people, products, and
 * evidence sources are fictional (same synthetic-content discipline as the
 * protocol workspaces). Evidence URLs use the IANA-reserved example.org.
 *
 * Scores follow the v0 methodology exactly (supported=1, insufficient=0.5,
 * contradicted=0, averaged × 100) so the report's math is honest.
 */

import type { GrexSurface, ProcessingState, VerificationResult } from './types'
import { countClaims, scoreFor, v0Score, type Claim } from './types'

export type ScenarioContent =
  | {
      kind: 'article'
      outlet: string
      headline: string
      byline: string
      date: string
      paragraphs: string[]
    }
  | {
      kind: 'messages'
      sender: string
      bubbles: string[]
    }
  | {
      kind: 'agent'
      userPrompt: string
      assistantAnswer: string
    }

export interface GrexScenario {
  id: string
  surface: GrexSurface
  /** Short label for scenario pickers. */
  label: string
  content: ScenarioContent
  /** Playback pacing for the processing animation. */
  timeline: { state: ProcessingState; ms: number }[]
  result: VerificationResult
}

const TIMELINE: { state: ProcessingState; ms: number }[] = [
  { state: 'EXTRACTING', ms: 1300 },
  { state: 'SEARCHING', ms: 2300 },
  { state: 'EVALUATING', ms: 1700 },
  { state: 'COMPLETE', ms: 0 },
]

function buildResult(
  base: Omit<VerificationResult, 'score' | 'checkedAt' | 'mode' | 'evidenceMode'>
): VerificationResult {
  return {
    ...base,
    mode: 'canned',
    evidenceMode: 'web',
    score: scoreFor(v0Score(countClaims(base.claims))),
    checkedAt: '2026-08-24T16:20:00Z',
  }
}

/* ------------------------------------------------------------------ */
/* 1. Browser — news article, mixed evidence                           */
/* ------------------------------------------------------------------ */

const newsArticleClaims: Claim[] = [
  {
    id: 'na-1',
    text: 'Nuvessa Health was founded in 2019.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.95,
      rationale: 'The state corporate registry and two independent press archives agree on a 2019 founding.',
      evidence: [
        {
          id: 'na-1a',
          url: 'https://example.org/registry/nuvessa-health',
          sourceName: 'State corporate registry',
          title: 'Entity record — Nuvessa Health, Inc.',
          snippet: 'Date of incorporation: April 11, 2019.',
          stance: 'supports',
        },
        {
          id: 'na-1b',
          url: 'https://example.org/mbj/nuvessa-launch',
          sourceName: 'Meridian Business Journal',
          title: 'Nuvessa Health emerges from stealth',
          snippet: '…the diagnostics startup, founded in 2019 by two former hospital-lab directors…',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'na-2',
    text: 'Nuvessa raised an $85 million Series B in January.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.9,
      rationale: 'The round is confirmed by the lead investor’s own announcement and independent coverage.',
      evidence: [
        {
          id: 'na-2a',
          url: 'https://example.org/crestline/portfolio-news',
          sourceName: 'Crestline Ventures',
          title: 'Announcing our investment in Nuvessa',
          snippet: 'We led Nuvessa Health’s $85M Series B alongside existing investors.',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'na-3',
    text: 'The HomePanel test received FDA clearance in 2024.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'CONTRADICTED',
      confidence: 0.86,
      rationale:
        'The regulatory database lists clearance in March 2025, not 2024. The 2024 date appears only in the article.',
      evidence: [
        {
          id: 'na-3a',
          url: 'https://example.org/regdb/homepanel-clearance',
          sourceName: 'Device clearance database',
          title: 'Clearance record — HomePanel Dx',
          snippet: 'Decision date: March 14, 2025.',
          stance: 'contradicts',
        },
      ],
    },
  },
  {
    id: 'na-4',
    text: 'The company’s tests are used in more than 300 clinics.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.4,
      rationale:
        'The figure appears only in company marketing materials; no independent source states a clinic count.',
      evidence: [
        {
          id: 'na-4a',
          url: 'https://example.org/nuvessa/about',
          sourceName: 'Nuvessa Health (company site)',
          title: 'About Nuvessa',
          snippet: 'Trusted by 300+ clinics nationwide.',
          stance: 'context',
        },
      ],
    },
  },
  {
    id: 'na-5',
    text: 'HomePanel detected early markers with 97% accuracy in trials.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.35,
      rationale:
        'No published trial data could be located. The accuracy figure is not attributed to a registered study.',
      evidence: [],
    },
  },
  {
    id: 'na-6',
    text: 'Roughly 40% of adults skip recommended screenings each year.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.45,
      rationale:
        'Published estimates range widely by screening type; no source supports a single 40% figure.',
      evidence: [
        {
          id: 'na-6a',
          url: 'https://example.org/nhis/screening-summary',
          sourceName: 'National health survey archive',
          title: 'Preventive screening participation',
          snippet: 'Participation varies from 44% to 81% depending on the screening…',
          stance: 'context',
        },
      ],
    },
  },
  {
    id: 'na-7',
    text: 'Home diagnostics are the most exciting shift in a generation of medicine.',
    verifiability: 'OPINION',
  },
]

const newsArticle: GrexScenario = {
  id: 'news-article',
  surface: 'browser',
  label: 'News article',
  content: {
    kind: 'article',
    outlet: 'The Meridian Post',
    headline: 'Nuvessa Health bets big on at-home diagnostics',
    byline: 'By Dana Whitfield, Health Correspondent',
    date: 'August 22, 2026',
    paragraphs: [
      'Nuvessa Health, the at-home diagnostics company founded in 2019, is expanding its flagship HomePanel test to twelve new states this fall, the company said Tuesday.',
      'The push follows an $85 million Series B raised in January and comes at a moment of intense investor interest in home testing. The HomePanel test received FDA clearance in 2024, and the company says its tests are used in more than 300 clinics.',
      'In trials, Nuvessa says, HomePanel detected early markers with 97% accuracy. Executives argue the product meets a real gap: roughly 40% of adults skip recommended screenings each year.',
      '“Home diagnostics are the most exciting shift in a generation of medicine,” chief executive Mara Okafor said in an interview.',
    ],
  },
  timeline: TIMELINE,
  result: buildResult({
    id: 'news-article',
    surface: 'browser',
    contentLabel: 'News article — The Meridian Post',
    submittedText: 'Nuvessa Health bets big on at-home diagnostics…',
    summary:
      'The article’s corporate facts check out, but its regulatory date is contradicted by the clearance record, and its usage and accuracy figures trace only to company marketing.',
    claims: newsArticleClaims,
  }),
}

/* ------------------------------------------------------------------ */
/* 2. Browser — opinion column, nothing to check                       */
/* ------------------------------------------------------------------ */

const opinionClaims: Claim[] = [
  { id: 'op-1', text: 'Remote work is the best thing to happen to family life in decades.', verifiability: 'OPINION' },
  { id: 'op-2', text: 'Within ten years, the office as we know it will be gone.', verifiability: 'PREDICTION' },
  { id: 'op-3', text: 'My own commute used to leave me too drained to cook dinner.', verifiability: 'PERSONAL_EXPERIENCE' },
  { id: 'op-4', text: 'Everyone knows meetings expand to fill the time allotted.', verifiability: 'TOO_VAGUE' },
]

const opinionColumn: GrexScenario = {
  id: 'opinion-column',
  surface: 'browser',
  label: 'Opinion column',
  content: {
    kind: 'article',
    outlet: 'The Meridian Post',
    headline: 'The office is over, and good riddance',
    byline: 'By Theo Brandt, Columnist',
    date: 'August 23, 2026',
    paragraphs: [
      'Remote work is the best thing to happen to family life in decades. I say this without hedging, and I say it as someone whose commute used to leave me too drained to cook dinner.',
      'Within ten years, the office as we know it will be gone. Not shrunk — gone. Everyone knows meetings expand to fill the time allotted; take away the conference room and watch the calendar heal itself.',
    ],
  },
  timeline: [
    { state: 'EXTRACTING', ms: 1400 },
    { state: 'COMPLETE', ms: 0 },
  ],
  result: buildResult({
    id: 'opinion-column',
    surface: 'browser',
    contentLabel: 'Opinion column — The Meridian Post',
    submittedText: 'The office is over, and good riddance…',
    summary:
      'This piece is argument and prediction. GREX found no externally verifiable factual claims, so no score is shown — a deliberate product behavior.',
    claims: opinionClaims,
  }),
}

/* ------------------------------------------------------------------ */
/* 3. Screenshot — forwarded text message, weak evidence               */
/* ------------------------------------------------------------------ */

const screenshotClaims: Claim[] = [
  {
    id: 'ss-1',
    text: 'GlucoTrim is FDA-approved.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'CONTRADICTED',
      confidence: 0.9,
      rationale:
        'Dietary supplements are not FDA-approved, and no GlucoTrim product appears in any approval database.',
      evidence: [
        {
          id: 'ss-1a',
          url: 'https://example.org/regdb/supplement-guidance',
          sourceName: 'Regulatory guidance archive',
          title: 'Supplements and approval claims',
          snippet: 'Dietary supplements are not approved by the agency for safety or effectiveness.',
          stance: 'contradicts',
        },
      ],
    },
  },
  {
    id: 'ss-2',
    text: 'GlucoTrim is clinically proven to melt 10 pounds in one week.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'CONTRADICTED',
      confidence: 0.85,
      rationale:
        'No registered clinical study of this product exists, and published nutrition research does not support one-week weight loss of this size from any supplement.',
      evidence: [
        {
          id: 'ss-2a',
          url: 'https://example.org/trials/search-glucotrim',
          sourceName: 'Clinical trials registry',
          title: 'Search results',
          snippet: '0 registered studies match “GlucoTrim”.',
          stance: 'contradicts',
        },
      ],
    },
  },
  {
    id: 'ss-3',
    text: 'GlucoTrim was featured on the TV show Shark Tank.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.4,
      rationale:
        'No episode listing or coverage connects this product to the show; supplement scams commonly fabricate this association, but absence of evidence is recorded as unverified, not false.',
      evidence: [],
    },
  },
  {
    id: 'ss-4',
    text: 'The offer expires tonight at midnight.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.3,
      rationale: 'Nothing public can confirm or deny a private offer window.',
      evidence: [],
    },
  },
  {
    id: 'ss-5',
    text: 'You have been specially selected.',
    verifiability: 'TOO_VAGUE',
  },
]

const screenshotText: GrexScenario = {
  id: 'screenshot-text',
  surface: 'screenshot',
  label: 'Suspicious text',
  content: {
    kind: 'messages',
    sender: '+1 (555) 014-2276',
    bubbles: [
      'You have been specially selected! 🎉',
      'GlucoTrim is FDA-approved and clinically proven to melt 10 lbs in ONE WEEK. As featured on Shark Tank!',
      'Offer expires TONIGHT at midnight. Claim your discount: glucotrim-deals.example.org',
    ],
  },
  timeline: TIMELINE,
  result: buildResult({
    id: 'screenshot-text',
    surface: 'screenshot',
    contentLabel: 'Screenshot — text message',
    submittedText: 'You have been specially selected! GlucoTrim is FDA-approved…',
    summary:
      'The message’s two strongest claims are contradicted by public records, and nothing else in it could be verified. The evidence here is weak.',
    claims: screenshotClaims,
  }),
}

/* ------------------------------------------------------------------ */
/* 4. MCP — AI answer with one subtle error, moderate evidence         */
/* ------------------------------------------------------------------ */

const mcpClaims: Claim[] = [
  {
    id: 'ai-1',
    text: 'Veldt Robotics was founded in 2016.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.93,
      rationale: 'Founding year is consistent across the corporate registry and archived press coverage.',
      evidence: [
        {
          id: 'ai-1a',
          url: 'https://example.org/registry/veldt-robotics',
          sourceName: 'State corporate registry',
          title: 'Entity record — Veldt Robotics, Inc.',
          snippet: 'Date of incorporation: February 3, 2016.',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'ai-2',
    text: 'Veldt Robotics is headquartered in Austin, Texas.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.92,
      rationale: 'The company’s filings and recent coverage both list an Austin headquarters.',
      evidence: [
        {
          id: 'ai-2a',
          url: 'https://example.org/mbj/veldt-hq',
          sourceName: 'Meridian Business Journal',
          title: 'Veldt Robotics doubles Austin footprint',
          snippet: '…expanding its Austin headquarters to a second building…',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'ai-3',
    text: 'Veldt acquired SenseCore in 2023.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'CONTRADICTED',
      confidence: 0.84,
      rationale:
        'The acquisition closed in November 2022 according to both companies’ announcements; the 2023 date is off by a year.',
      evidence: [
        {
          id: 'ai-3a',
          url: 'https://example.org/veldt/sensecore-close',
          sourceName: 'Veldt Robotics (press release)',
          title: 'Veldt completes SenseCore acquisition',
          snippet: 'The transaction closed on November 9, 2022.',
          stance: 'contradicts',
        },
      ],
    },
  },
  {
    id: 'ai-4',
    text: 'Veldt employs about 400 people.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.7,
      rationale: 'Recent coverage cites “just over 400 employees”; close enough to the stated figure.',
      evidence: [
        {
          id: 'ai-4a',
          url: 'https://example.org/mbj/veldt-hiring',
          sourceName: 'Meridian Business Journal',
          title: 'Veldt keeps hiring through the downturn',
          snippet: '…the company, which has just over 400 employees…',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'ai-5',
    text: 'Veldt’s annual revenue is approximately $120 million.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.35,
      rationale: 'The company is private and discloses no financials; the figure could not be confirmed anywhere public.',
      evidence: [],
    },
  },
]

const mcpAiAnswer: GrexScenario = {
  id: 'mcp-ai-answer',
  surface: 'mcp',
  label: 'AI diligence answer',
  content: {
    kind: 'agent',
    userPrompt: 'Give me a quick profile of Veldt Robotics for a diligence memo.',
    assistantAnswer:
      'Veldt Robotics, founded in 2016 and headquartered in Austin, Texas, builds perception systems for warehouse automation. The company acquired sensor maker SenseCore in 2023, employs about 400 people, and generates approximately $120 million in annual revenue.',
  },
  timeline: TIMELINE,
  result: buildResult({
    id: 'mcp-ai-answer',
    surface: 'mcp',
    contentLabel: 'AI answer — verified via verify_facts',
    submittedText: 'Veldt Robotics, founded in 2016 and headquartered in Austin…',
    summary:
      'Most of the answer holds up, but the acquisition date is off by a year and the revenue figure has no public support — exactly the kind of confident numeric drift independent verification exists to catch.',
    claims: mcpClaims,
  }),
}

/* ------------------------------------------------------------------ */

export const SCENARIOS: GrexScenario[] = [newsArticle, opinionColumn, screenshotText, mcpAiAnswer]

export function getScenario(id: string): GrexScenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}

export function scenariosForSurface(surface: GrexSurface): GrexScenario[] {
  return SCENARIOS.filter((s) => s.surface === surface)
}
