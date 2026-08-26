import { skillPrompt, type SurfaceSkill } from './browser'

export const mcpSkill: SurfaceSkill = {
  surface: 'mcp',
  verifiabilityNotes: `The content is AI-generated output submitted by an agent for independent verification before presentation. Pay particular attention to specific numbers, dates, names, and entity relationships — confident numeric drift (a year off, a figure rounded into fiction) is the characteristic failure mode being checked for. Hedged statements ("approximately", "around") are still VERIFIABLE when they assert a checkable magnitude.`,
  scoringRubric: `V0 default weighting: every verifiable claim counts equally (supported = 1, insufficient = 0.5, contradicted = 0). Future direction for this surface: contradicted claims may warrant heavier weight than insufficient ones, since the consuming agent will repeat whatever survives verification.`,
  tone: `Terse and machine-adjacent. The primary consumer is another AI system; rationales should be compact, specific, and directly usable in a correction ("evidence indicates the acquisition closed in 2022, not 2023"). No consumer softening needed. Reference the content as "the response" or "this answer".`,
  toPrompt() {
    return skillPrompt(this)
  },
}
