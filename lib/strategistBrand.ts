/**
 * Single switch for the Protocol Strategist's product identity.
 *
 * The workspace is periodically run in blinded UX research, where testers must
 * not see (or be told by the model) which company the demo was built around.
 * Everything brand-shaped reads from here: the page chrome, the system prompt,
 * and — via debrand() at the corpus-load choke point — any string inside the
 * corpus JSON that a tool result could echo back to the model.
 *
 * To restore the branded demo, edit this file only.
 */

export const BRAND = {
  /** Product name shown in the header, page title, and the model's identity. */
  name: 'Protocol Strategist',
  /** Subtitle under the wordmark. */
  tagline: 'Clinical trial design workspace',
  /** How the prompt and empty-state copy refer to the data behind the tools. */
  corpusName: 'the operations corpus',
  /** Show the "powered by" attribution in the header. */
  showPoweredBy: false,
} as const

/**
 * Ordered replacements applied to raw corpus JSON before parsing. Longest,
 * most specific patterns first so partial matches never leave fragments.
 * Replacement strings must be JSON-safe (no quotes or backslashes).
 */
const REPLACEMENTS: Array<[RegExp, string]> = [
  [
    /WCG Trial IntelX\(TM\) Data Dictionary v1\.1/g,
    'a synthetic clinical operations data dictionary v1.1',
  ],
  [/Trial IntelX Data Dictionary v1\.1/g, 'the full source data dictionary v1.1'],
  [/KMR Clinical Data Workbook/g, 'clinical benchmarking workbook'],
  [/WCG IntelX/g, BRAND.name],
  [/Trial IntelX(?:\(TM\)|™)?/g, 'the base operations'],
  [/IntelX/g, BRAND.name],
  [/Tweed Collective/g, 'the product team'],
  [/\bTweed\b/g, 'internal'],
  [/\bWCG\b/g, 'the vendor'],
]

/** Strip brand names from a string the model (or a tester) could see. */
export function debrand(text: string): string {
  let out = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement)
  }
  return out
}
