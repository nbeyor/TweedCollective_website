import { MAX_CLAIMS } from './shared'
import { skillPrompt, type SurfaceSkill } from './browser'

/**
 * MMS surface skill. Same v0.1 weights as the screenshot skill.
 * Adds the two instructions the phone product needs: the truncation flag,
 * and a summary whose first clause can stand alone in one SMS.
 * Clustering and the collapse diagram are not model tasks.
 */
export const mmsSkill: SurfaceSkill = {
  surface: 'mms',
  verifiabilityNotes: `The content is text extracted (OCR) from a screenshot or photo a person texted in — often a message, social post, product pitch, headline, or a photo of a screen. OCR text can be fragmentary; reconstruct claims charitably from context. Promotional superlatives ("melts fat fast!") are usually OPINION or TOO_VAGUE, but specific embedded assertions (approvals, endorsements, statistics, "as seen on…") are VERIFIABLE — extract them even when they appear inside hype.`,
  scoringRubric: `V0 default weighting: every verifiable claim counts equally (supported = 1, insufficient = 0.5, contradicted = 0). GREX is not a scam detector — score only the evidence for the claims. Do not change weights because the message arrived by SMS.`,
  tone: `Protective and plain-spoken. The summary's first clause must be able to stand alone in a single text message: what checked out, and what did not have enough public evidence. Everyday language, no lecturing. Reference the content as "this message" or "this screenshot". Do not describe a diagram, a root source, an original paper, or how often a claim appears online.`,
  toPrompt() {
    return `${skillPrompt(this)}

MMS RESULT SHAPE:
Set truncated to true when claims were dropped past ${MAX_CLAIMS}; otherwise false. The summary is evidence strength only. Never use the words true, false, fake, real, lie, misinformation, or valid.`
  },
}
