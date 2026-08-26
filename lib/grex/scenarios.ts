/**
 * Canned demo scenarios.
 *
 * The browser scenario recreates the public marketing page of a real company
 * (Function Health); its claims, verdicts, and evidence are grounded in real
 * press coverage as of Aug 2026, with real citation URLs — no verdict is
 * asserted that public reporting doesn't support. The screenshot scenario is
 * fully fictional (synthetic-content discipline). Scores follow the v0
 * methodology exactly (supported=1, insufficient=0.5, contradicted=0,
 * averaged × 100).
 */

import type { GrexSurface, ProcessingState, VerificationResult } from './types'
import { countClaims, scoreFor, v0Score, type Claim } from './types'

export type ScenarioContent =
  | {
      kind: 'site'
      brand: string
      url: string
      nav: string[]
      hero: { headline: string; sub: string }
      stats: { value: string; label: string }[]
      priceLine: string
      footnote: string
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
/* 1. Browser — Function Health marketing page (real company,          */
/*    real coverage; verdicts held to what public reporting supports)  */
/* ------------------------------------------------------------------ */

const functionHealthClaims: Claim[] = [
  {
    id: 'fh-1',
    text: 'A Function Health membership includes 160+ lab tests.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.93,
      rationale:
        'Independent coverage of the company consistently describes the membership as 160+ lab tests across heart, hormones, thyroid, nutrients, cancer signals, and more.',
      evidence: [
        {
          id: 'fh-1a',
          url: 'https://www.fiercehealthcare.com/health-tech/function-health-lands-298m-series-b-rolls-out-medical-intelligence-ai-model-health-data',
          sourceName: 'Fierce Healthcare',
          title: 'Function Health lands $298M Series B',
          snippet:
            'Function Health offers a membership-based platform that gives consumers access to more than 160 biomarker lab tests…',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'fh-2',
    text: 'Function raised a $298 million Series B at a $2.5 billion valuation in November 2025.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.96,
      rationale: 'The round, valuation, and lead investor are documented by multiple independent outlets.',
      evidence: [
        {
          id: 'fh-2a',
          url: 'https://techcrunch.com/2025/11/19/function-health-closes-298m-series-b-at-a-2-5b-valuation-launches-medical-intelligence/',
          sourceName: 'TechCrunch',
          title: 'Function Health closes $298M Series B at a $2.5B valuation',
          snippet: 'Function Health raised a $298M Series B at a $2.5B valuation, led by Redpoint Ventures.',
          stance: 'supports',
        },
        {
          id: 'fh-2b',
          url: 'https://www.prnewswire.com/news-releases/with-a-2-5b-valuation-function-becomes-the-new-standard-for-health-and-launches-medical-intelligence-lab-302620193.html',
          sourceName: 'PR Newswire',
          title: 'With a $2.5B valuation, Function becomes the new standard for health',
          snippet: 'The company announced its Series B and Medical Intelligence launch at a $2.5B valuation.',
          stance: 'supports',
        },
      ],
    },
  },
  {
    id: 'fh-3',
    text: 'Membership starts at $365 per year.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'SUPPORTED',
      confidence: 0.85,
      rationale:
        'The company’s pricing page lists membership from $365 per year (lowered from $499 in late 2025). Pricing differs in some states, which the evidence notes as context.',
      evidence: [
        {
          id: 'fh-3a',
          url: 'https://www.functionhealth.com/pricing',
          sourceName: 'functionhealth.com',
          title: 'Function Health pricing',
          snippet: 'Memberships start at $365 per year and include 160+ lab tests and clinician review.',
          stance: 'supports',
        },
        {
          id: 'fh-3b',
          url: 'https://www.bloodtestcomparison.com/function-health',
          sourceName: 'Blood Test Comparison',
          title: 'Function Health review (2026)',
          snippet: 'Pricing is higher in New York and New Jersey, where the plan runs $749 a year.',
          stance: 'context',
        },
      ],
    },
  },
  {
    id: 'fh-4',
    text: 'More than 500,000 members use Function.',
    verifiability: 'VERIFIABLE',
    evaluation: {
      verdict: 'INSUFFICIENT_EVIDENCE',
      confidence: 0.45,
      rationale:
        'The member count originates from the company and is repeated by reviewers; no independent audit or filing confirms the figure. Recorded as unverified, not false.',
      evidence: [
        {
          id: 'fh-4a',
          url: 'https://www.prnewswire.com/news-releases/with-a-2-5b-valuation-function-becomes-the-new-standard-for-health-and-launches-medical-intelligence-lab-302620193.html',
          sourceName: 'PR Newswire (company announcement)',
          title: 'Function company announcement',
          snippet: 'The company reports more than 500,000 members.',
          stance: 'context',
        },
      ],
    },
  },
  {
    id: 'fh-5',
    text: 'Function empowers you to live 100 healthy years.',
    verifiability: 'PREDICTION',
  },
]

const functionHealth: GrexScenario = {
  id: 'function-health',
  surface: 'browser',
  label: 'functionhealth.com',
  content: {
    kind: 'site',
    brand: 'Function',
    url: 'functionhealth.com',
    nav: ['What we test', 'How it works', 'Pricing', 'Log in'],
    hero: {
      headline: 'Live 100 healthy years',
      sub: 'The most comprehensive picture of your health — 160+ lab tests, reviewed by clinicians, tracked over your lifetime.',
    },
    stats: [
      { value: '160+', label: 'lab tests in your membership' },
      { value: '500,000+', label: 'members' },
      { value: '$2.5B', label: 'valuation · $298M Series B (Nov 2025)' },
    ],
    priceLine: 'Membership from $365/year',
    footnote:
      'Recreated snapshot of public marketing content for demonstration. Not affiliated with Function Health.',
  },
  timeline: TIMELINE,
  result: buildResult({
    id: 'function-health',
    surface: 'browser',
    contentLabel: 'Marketing page — functionhealth.com',
    submittedText: 'Live 100 healthy years. 160+ lab tests, reviewed by clinicians…',
    summary:
      'The page’s concrete claims hold up well: the test count, pricing, and funding are confirmed by independent coverage. The member count traces only to the company, and the headline promise is aspiration, not a checkable fact.',
    claims: functionHealthClaims,
  }),
}

/* ------------------------------------------------------------------ */
/* 2. Screenshot — forwarded text message (fictional), weak evidence   */
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
/* 3. MCP — AI answer with one subtle error (fictional company)        */
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

export const SCENARIOS: GrexScenario[] = [functionHealth, screenshotText, mcpAiAnswer]

export function getScenario(id: string): GrexScenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}

export function scenariosForSurface(surface: GrexSurface): GrexScenario[] {
  return SCENARIOS.filter((s) => s.surface === surface)
}
