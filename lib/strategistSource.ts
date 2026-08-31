/**
 * Document-under-review discriminator, shared by the client picker and the
 * server chat/publish routes. This module is client-safe: no fs, no secrets.
 */

export type BriefSource =
  | { kind: 'empty' }
  | { kind: 'blank' }
  | { kind: 'hero' }
  | { kind: 'corpus'; protocolId: string }
  | { kind: 'upload'; docId: string }

export function sourceKey(s: BriefSource): string {
  if (s.kind === 'corpus') return `corpus:${s.protocolId}`
  if (s.kind === 'upload') return `upload:${s.docId}`
  return s.kind
}

/** Coerce a client-sent context object into a BriefSource. Unknown → empty. */
export function parseClientSource(raw: unknown): BriefSource {
  if (!raw || typeof raw !== 'object') return { kind: 'empty' }
  const rec = raw as { kind?: unknown; protocolId?: unknown; docId?: unknown }
  if (rec.kind === 'blank') return { kind: 'blank' }
  if (rec.kind === 'hero') return { kind: 'hero' }
  if (rec.kind === 'empty') return { kind: 'empty' }
  if (rec.kind === 'corpus' && typeof rec.protocolId === 'string' && rec.protocolId.trim()) {
    return { kind: 'corpus', protocolId: rec.protocolId.trim() }
  }
  if (rec.kind === 'upload' && typeof rec.docId === 'string' && rec.docId.trim()) {
    return { kind: 'upload', docId: rec.docId.trim().slice(0, 128) }
  }
  return { kind: 'empty' }
}
