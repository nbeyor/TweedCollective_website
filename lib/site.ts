export const CONTACT_EMAIL = 'hello@tweedcollective.ai'

export function contactMailto(subject?: string): string {
  if (!subject) return `mailto:${CONTACT_EMAIL}`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}
