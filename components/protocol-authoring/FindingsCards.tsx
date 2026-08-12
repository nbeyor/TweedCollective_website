'use client'

import React, { useState } from 'react'
import { CheckCircle2, ChevronDown, MessageSquare, ShieldAlert } from 'lucide-react'

import { wcg } from '@/components/protocol-strategist/wcgTheme'
import type { ReviewFinding, ReviewRound } from '@/lib/protocol-authoring/tools'

// Review-board findings, rendered as cards: one round card per
// file_review_findings call, each finding expandable to its quote,
// recommendation, regulatory basis, and proposed before/after rewrite.
// Adopting a finding is chat-mediated — the button sends a message asking the
// model to ship it, which resolves through the normal decision flow.

const SEVERITY: Record<
  ReviewFinding['severity'],
  { label: string; color: string; bg: string; border: string }
> = {
  critical: { label: 'CRITICAL', color: '#8A3520', bg: '#FDECE7', border: '#E06D4F' },
  major: { label: 'MAJOR', color: '#7A5410', bg: '#FFF7EC', border: wcg.warn },
  minor: { label: 'MINOR', color: wcg.muted, bg: wcg.surfaceMuted, border: wcg.borderStrong },
}

export function FindingsRoundCard({
  round,
  adoptedIds,
  onDiscuss,
  onAdopt,
}: {
  round: ReviewRound
  adoptedIds: Set<string>
  onDiscuss: (finding: ReviewFinding) => void
  onAdopt: (finding: ReviewFinding) => void
}) {
  const counts = {
    critical: round.findings.filter((f) => f.severity === 'critical').length,
    major: round.findings.filter((f) => f.severity === 'major').length,
    minor: round.findings.filter((f) => f.severity === 'minor').length,
  }
  const ordered = [...round.findings].sort((a, b) => {
    const rank = { critical: 0, major: 1, minor: 2 }
    return rank[a.severity] - rank[b.severity]
  })

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: wcg.surface, borderColor: wcg.border }}>
      <div className="px-4 pt-3 pb-2.5 border-b" style={{ borderColor: wcg.border }}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: wcg.magenta }} />
          <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.magenta }}>
            Review board · {round.label}
          </p>
        </div>
        <p className="text-[13px] leading-snug mt-1.5" style={{ color: wcg.ink }}>
          {round.summary}
        </p>
        <p className="text-[11.5px] mt-1 tabular-nums" style={{ color: wcg.muted }}>
          {counts.critical} critical · {counts.major} major · {counts.minor} minor
        </p>
      </div>
      <div className="px-3 py-2.5 space-y-2">
        {ordered.map((f) => (
          <FindingCard
            key={f.id}
            finding={f}
            adopted={adoptedIds.has(f.id)}
            onDiscuss={() => onDiscuss(f)}
            onAdopt={() => onAdopt(f)}
          />
        ))}
      </div>
    </div>
  )
}

function FindingCard({
  finding,
  adopted,
  onDiscuss,
  onAdopt,
}: {
  finding: ReviewFinding
  adopted: boolean
  onDiscuss: () => void
  onAdopt: () => void
}) {
  const [open, setOpen] = useState(finding.severity === 'critical')
  const sev = SEVERITY[finding.severity]

  return (
    <div className="rounded-lg border" style={{ background: sev.bg, borderColor: wcg.border }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-3 py-2" aria-expanded={open}>
        <div className="flex items-center gap-2">
          <span
            className="text-[9.5px] font-bold tracking-wider rounded px-1.5 py-0.5 shrink-0"
            style={{ color: '#fff', background: finding.severity === 'minor' ? wcg.muted : sev.border }}
          >
            {sev.label}
          </span>
          <span className="text-[10.5px] shrink-0" style={{ color: wcg.muted }}>
            {finding.lens} · {finding.section_title}
          </span>
          {adopted && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-auto" style={{ color: wcg.good }} />}
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${adopted ? '' : 'ml-auto'}`}
            style={{ color: wcg.muted, transform: open ? 'rotate(180deg)' : undefined }}
          />
        </div>
        <p className="text-[12.5px] font-medium leading-snug mt-1" style={{ color: wcg.ink }}>
          {finding.title}
        </p>
      </button>

      {open && (
        <div className="px-3 pb-2.5 space-y-2">
          {finding.quote && (
            <blockquote
              className="border-l-2 pl-2.5 text-[12px] italic leading-snug"
              style={{ borderColor: sev.border, color: wcg.body }}
            >
              “{finding.quote}”
            </blockquote>
          )}
          <p className="text-[12px] leading-snug" style={{ color: wcg.body }}>
            {finding.recommendation}
          </p>
          {finding.regulatory_basis && (
            <p className="text-[10.5px] tracking-wide" style={{ color: wcg.muted }}>
              Basis: {finding.regulatory_basis}
            </p>
          )}
          {finding.rewrite && (
            <div className="space-y-1 text-[11.5px] leading-snug">
              <div className="rounded border px-2 py-1.5" style={{ background: '#FDECE7', borderColor: '#F2C4B5', color: '#8A3520' }}>
                <span className="font-semibold">− </span>
                {finding.rewrite.before}
              </div>
              <div className="rounded border px-2 py-1.5" style={{ background: '#ECFBF6', borderColor: '#BDE8DD', color: '#0F5C46' }}>
                <span className="font-semibold">+ </span>
                {finding.rewrite.after}
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-0.5">
            <button
              onClick={onDiscuss}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium"
              style={{ background: wcg.surface, borderColor: wcg.borderStrong, color: wcg.blue }}
            >
              <MessageSquare className="w-3 h-3" /> Discuss
            </button>
            {!adopted && (
              <button
                onClick={onAdopt}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-white"
                style={{ background: wcg.navy }}
              >
                <CheckCircle2 className="w-3 h-3" /> Adopt & ship
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
