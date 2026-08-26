import React from 'react'

import type { ClaimVerdict, Verifiability } from '@/lib/grex/types'

const VERDICT_META: Record<ClaimVerdict, { label: string; varName: string }> = {
  SUPPORTED: { label: 'Supported', varName: '--grex-supported' },
  CONTRADICTED: { label: 'Contradicted', varName: '--grex-contradicted' },
  INSUFFICIENT_EVIDENCE: { label: "Couldn't verify", varName: '--grex-insufficient' },
}

export function VerdictChip({ verdict }: { verdict: ClaimVerdict }) {
  const meta = VERDICT_META[verdict]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-medium uppercase tracking-[0.06em]"
      style={{
        color: `var(${meta.varName})`,
        border: `1px solid var(${meta.varName})`,
        borderRadius: 'var(--grex-radius-chip)',
        background: 'transparent',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: `var(${meta.varName})` }}
      />
      {meta.label}
    </span>
  )
}

const NONVERIFIABLE_LABELS: Record<Exclude<Verifiability, 'VERIFIABLE'>, string> = {
  OPINION: 'Opinion',
  PREDICTION: 'Prediction',
  PERSONAL_EXPERIENCE: 'Personal account',
  TOO_VAGUE: 'Too vague to check',
}

/** Muted chip for claims excluded from scoring. */
export function NonVerifiableChip({ kind }: { kind: Exclude<Verifiability, 'VERIFIABLE'> }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[11.5px] font-medium uppercase tracking-[0.06em]"
      style={{
        color: 'var(--grex-muted)',
        border: '1px dashed var(--grex-border)',
        borderRadius: 'var(--grex-radius-chip)',
      }}
    >
      {NONVERIFIABLE_LABELS[kind]} · not scored
    </span>
  )
}
