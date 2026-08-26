import { skillPrompt, type SurfaceSkill } from './browser'

export const screenshotSkill: SurfaceSkill = {
  surface: 'screenshot',
  verifiabilityNotes: `The content is text extracted (OCR) from a screenshot a user chose to check — often a message, social post, product pitch, or headline that made them uncertain. OCR text can be fragmentary; reconstruct claims charitably from context. Promotional superlatives ("melts fat fast!") are usually OPINION or TOO_VAGUE, but specific embedded assertions (approvals, endorsements, statistics, "as seen on…") are VERIFIABLE — extract them even when they appear inside hype.`,
  scoringRubric: `V0 default weighting: every verifiable claim counts equally (supported = 1, insufficient = 0.5, contradicted = 0). GREX is not a scam detector — score only the evidence for the claims. Future direction for this surface: claims matching known deceptive patterns (fabricated endorsements, false regulatory status, urgency framing) may warrant heavier weight when contradicted.`,
  tone: `Protective and plain-spoken. The user is deciding whether to trust something suspicious; the summary should say clearly what checked out and what did not, in everyday language, without lecturing. Reference the content as "this message" or "this screenshot".`,
  toPrompt() {
    return skillPrompt(this)
  },
}
