/**
 * Product identity for the protocol authoring workspace. Mirrors the
 * strategist's brand switch: everything name-shaped reads from here so the
 * workspace can be renamed (or blinded for UX research) in one place.
 */

export const FOUNDRY_BRAND = {
  /** Product name shown in the header, page title, and the model's identity. */
  name: 'Protocol Foundry',
  /** Subtitle under the wordmark. */
  tagline: 'AI protocol authoring workspace',
  /** How the prompt refers to the operations data behind the corpus tools. */
  corpusName: 'the operations corpus',
  showPoweredBy: false,
} as const
