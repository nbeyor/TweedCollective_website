/**
 * Browser-surface rubric skill.
 *
 * V0 rubrics are deliberately near-identical across surfaces; what matters
 * now is that each surface's rubric is its own editable artifact, so the
 * scoring can diverge later (this is the starting point for that work).
 */

import type { GrexSurface } from '../types'

export interface SurfaceSkill {
  surface: GrexSurface
  /** What counts as checkable on this surface. */
  verifiabilityNotes: string
  /** Aggregation/weighting notes. V0: shared defaults, restated per surface. */
  scoringRubric: string
  /** Explanation voice for this surface's audience. */
  tone: string
  toPrompt(): string
}

export function skillPrompt(skill: SurfaceSkill): string {
  return `SURFACE: ${skill.surface}

VERIFIABILITY NOTES FOR THIS SURFACE:
${skill.verifiabilityNotes}

SCORING RUBRIC FOR THIS SURFACE:
${skill.scoringRubric}

EXPLANATION TONE FOR THIS SURFACE:
${skill.tone}`
}

export const browserSkill: SurfaceSkill = {
  surface: 'browser',
  verifiabilityNotes: `The content is text extracted from a webpage the user is reading. It may include stray navigation fragments, bylines, captions, or ad copy — ignore obvious boilerplate and extract claims only from the substantive content. Attribute-aware: when the page quotes someone ("according to Dr. Smith…"), the claim to check is what was asserted, and the attribution is context.`,
  scoringRubric: `V0 default weighting: every verifiable claim counts equally (supported = 1, insufficient = 0.5, contradicted = 0). Do not weight claims by prominence or importance. Future direction for this surface: headline and lede claims may warrant distinct treatment from deep-body claims.`,
  tone: `A calm reading companion. The user is mid-article; the summary should read like a margin note from a careful librarian — specific, neutral, no alarm. Reference the content as "the article" or "this page".`,
  toPrompt() {
    return skillPrompt(this)
  },
}
