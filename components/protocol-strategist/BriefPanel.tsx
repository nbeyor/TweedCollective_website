'use client'

import React from 'react'
import { CheckCircle2, FileText, HelpCircle } from 'lucide-react'

import type { DesignBrief } from '@/lib/trialCorpus'
import { wcg } from './wcgTheme'

export interface ShippedDecision {
  element_id: string
  element_label: string
  decision: string
  rationale?: string
  alternatives_considered?: Array<{ option: string; tradeoff: string }>
  evidence?: string[]
  written?: boolean
  doc?: { webViewLink?: string } | null
}

/**
 * The document under review. The brief's elements are listed and selectable —
 * clicking one drops a starter question into the chat, so the loop always begins
 * from an element of the draft. Shipped decisions accumulate in the log below.
 */
export function BriefPanel({
  brief,
  decisions,
  onPickElement,
  docLink,
}: {
  brief: DesignBrief
  decisions: ShippedDecision[]
  onPickElement: (prompt: string) => void
  docLink?: string | null
}) {
  const decidedIds = new Set(decisions.map((d) => d.element_id))

  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
          Design brief · draft
        </p>
        <h2 className="text-[15px] font-semibold leading-snug" style={{ color: wcg.ink }}>
          {brief.indication}
        </h2>
        <p className="text-[12px] mt-0.5" style={{ color: wcg.muted }}>
          Phase {brief.phase} · {brief.line_of_treatment} · N={brief.target_enrollment} · ~{brief.planned_sites} sites
        </p>
        {docLink && (
          <a
            href={docLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-[12px] underline underline-offset-2"
            style={{ color: wcg.blue }}
          >
            <FileText className="w-3.5 h-3.5" /> Open the brief in Google Docs
          </a>
        )}
      </div>

      <Section label="Arms">
        {brief.arms.map((a) => (
          <li key={a.id} className="text-[12.5px] leading-snug" style={{ color: wcg.body }}>
            {a.name}
          </li>
        ))}
      </Section>

      <Section label="Endpoints">
        <Element
          label={`Primary — ${brief.primary_endpoint.text}`}
          decided={decidedIds.has(brief.primary_endpoint.id)}
          onClick={() =>
            onPickElement(`Let's pressure-test the primary endpoint: ${brief.primary_endpoint.text}. What is the operational cost of the central-review imaging it depends on?`)
          }
        />
        {brief.secondary_endpoints.map((e) => (
          <Element
            key={e.id}
            label={`Secondary — ${e.text}`}
            decided={decidedIds.has(e.id)}
            onClick={() =>
              onPickElement(`We're considering adding secondary endpoints (${brief.candidate_secondary_endpoints
                .map((c) => c.text)
                .join('; ')}). How could this impact data collection timelines?`)
            }
          />
        ))}
      </Section>

      <Section label="Eligibility criteria">
        {brief.criteria.map((c) => (
          <Element
            key={c.id}
            label={`${c.type} — ${c.text}`}
            hook={c.hero_hook}
            openQuestion={c.open_question}
            decided={decidedIds.has(c.id)}
            onClick={() =>
              onPickElement(
                c.hero_hook
                  ? 'Medical is telling me I need to add an endoscopy screening to verify this GI disease. How could this impact my recruitment timeline?'
                  : `Which criteria in this draft will cost us the most eligible patients? Start with "${c.text}".`
              )
            }
          />
        ))}
      </Section>

      {decisions.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ color: wcg.teal }}>
            Decision log
          </p>
          <div className="space-y-2">
            {decisions.map((d, i) => (
              <div
                key={i}
                className="rounded-lg border px-3 py-2"
                style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: wcg.good }} />
                  <span className="text-[12.5px] font-medium" style={{ color: wcg.ink }}>
                    {d.element_label}
                  </span>
                </div>
                <p className="text-[12px] mt-1 leading-snug" style={{ color: wcg.body }}>
                  {d.decision}
                </p>
                {d.alternatives_considered && d.alternatives_considered.length > 0 && (
                  <p className="text-[11px] mt-1" style={{ color: wcg.muted }}>
                    vs {d.alternatives_considered.map((a) => a.option).join('; ')}
                  </p>
                )}
                <p className="text-[10.5px] mt-1" style={{ color: wcg.faint }}>
                  {d.written ? 'Written to the brief' : 'Logged on-page'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] mb-1.5" style={{ color: wcg.muted }}>
        {label}
      </p>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  )
}

function Element({
  label,
  onClick,
  decided,
  hook,
  openQuestion,
}: {
  label: string
  onClick: () => void
  decided?: boolean
  hook?: boolean
  openQuestion?: string
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="w-full text-left rounded-lg border px-2.5 py-1.5 transition-colors"
        style={{
          background: hook ? '#FFF7EC' : wcg.surface,
          borderColor: hook ? wcg.warn : wcg.border,
        }}
      >
        <span className="flex items-start gap-1.5">
          {decided && <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: wcg.good }} />}
          {hook && !decided && <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: wcg.warn }} />}
          <span className="text-[12.5px] leading-snug" style={{ color: wcg.body }}>
            {label}
            {openQuestion && (
              <span className="block text-[11px] mt-0.5 italic" style={{ color: wcg.warn }}>
                {openQuestion}
              </span>
            )}
          </span>
        </span>
      </button>
    </li>
  )
}
