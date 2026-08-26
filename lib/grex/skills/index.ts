import type { GrexSurface } from '../types'
import { browserSkill, type SurfaceSkill } from './browser'
import { mcpSkill } from './mcp'
import { screenshotSkill } from './screenshot'
import { SHARED_PIPELINE_PROMPT } from './shared'

const SKILLS: Record<GrexSurface, SurfaceSkill> = {
  browser: browserSkill,
  screenshot: screenshotSkill,
  mcp: mcpSkill,
}

export function getSkill(surface: GrexSurface): SurfaceSkill {
  return SKILLS[surface]
}

/** System prompt = invariant pipeline contract + the surface's rubric skill. */
export function composeSystemPrompt(surface: GrexSurface): string {
  return `${SHARED_PIPELINE_PROMPT}\n\n${getSkill(surface).toPrompt()}`
}
