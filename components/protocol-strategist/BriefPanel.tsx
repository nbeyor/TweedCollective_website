'use client'

import React, { useState } from 'react'
import { BarChart3, CheckCircle2, FilePlus2, FileText, HelpCircle, Play } from 'lucide-react'

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

export type BriefMode = 'hero' | 'corpus' | 'blank'

/**
 * The standard analyses: one-click entry points that each land a known chart in
 * the insight panel, so a first-time user gets a chart-backed answer without
 * composing a prompt. Prompts are phrased to steer the model at the matching
 * tool (and its fixed chart) without naming the tool.
 */
const STANDARD_ANALYSES: Array<{ label: string; chart: string; prompt: string }> = [
  {
    label: 'Screening burden by criterion',
    chart: 'Criteria-burden waterfall',
    prompt: 'Which criteria in this draft will cost us the most eligible patients?',
  },
  {
    label: 'Added-procedure what-if',
    chart: 'Sensitivity comparison',
    prompt:
      'If we added a confirmatory screening procedure for our most burdensome eligibility criterion, how would it hit the enrollment timeline? Give me options with tradeoffs.',
  },
  {
    label: 'Slip drivers by site type',
    chart: 'Generated site-level chart',
    prompt:
      'Which site types would drive enrollment slip if we required additional screening procedures at every site? Break the friction down by site type.',
  },
  {
    label: 'Comparator landscape',
    chart: 'Comparator scatter',
    prompt:
      'Place this design against comparable trials — is it more burdensome than the trials that enrolled fastest?',
  },
  {
    label: 'Amendment risk',
    chart: 'Amendment-risk view',
    prompt:
      'Before this goes to writing, which elements are most likely to force an amendment, and what would one cost us?',
  },
  {
    label: 'Endpoint timeline impact',
    chart: 'Endpoint timeline chart',
    prompt:
      'How would adding the candidate secondary endpoints hit data collection and the database-lock timeline?',
  },
]

/**
 * The document under review. Two tabs: the brief itself (elements are
 * selectable — clicking one drops a starter question into the chat) and the
 * standard analyses (one click sends a chart-producing question immediately).
 * Shipped decisions accumulate in the log below. In blank mode there is no
 * document yet, so the panel explains how the chat builds one.
 */
export function BriefPanel({
  brief,
  mode,
  decisions,
  onPickElement,
  onRunAnalysis,
  docLink,
}: {
  brief: DesignBrief | null
  mode: BriefMode
  decisions: ShippedDecision[]
  onPickElement: (prompt: string) => void
  onRunAnalysis: (prompt: string) => void
  docLink?: string | null
}) {
  const [tab, setTab] = useState<'brief' | 'analyses'>('brief')
  const decidedIds = new Set(decisions.map((d) => d.element_id))

  if (mode === 'blank' || !brief) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.blue }}>
            New protocol · blank
          </p>
          <h2 className="text-[15px] font-semibold leading-snug" style={{ color: wcg.ink }}>
            Nothing drafted yet
          </h2>
        </div>
        <div
          className="rounded-lg border px-3 py-3 text-[12.5px] leading-relaxed"
          style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.body }}
        >
          <FilePlus2 className="w-4 h-4 mb-2" style={{ color: wcg.blue }} />
          Start in the chat: name an indication and phase, and the strategist will
          ground every design choice — target enrollment, site mix, eligibility,
          endpoints — in what comparable trials in the corpus actually did. The
          design takes shape here as decisions are shipped.
        </div>
        <DecisionLog decisions={decisions} />
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
          {mode === 'hero' ? 'Design brief · draft' : 'Corpus protocol · loaded'}
        </p>
        <h2 className="text-[15px] font-semibold leading-snug" style={{ color: wcg.ink }}>
          {brief.indication}
        </h2>
        <p className="text-[12px] mt-0.5" style={{ color: wcg.muted }}>
          Phase {brief.phase} · {brief.line_of_treatment} · N={brief.target_enrollment} · ~{brief.planned_sites} sites
        </p>
        {mode === 'hero' && docLink && (
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

      <div className="flex rounded-lg border p-0.5" style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}>
        <Tab active={tab === 'brief'} onClick={() => setTab('brief')}>
          Brief
        </Tab>
        <Tab active={tab === 'analyses'} onClick={() => setTab('analyses')}>
          Analyses
        </Tab>
      </div>

      {tab === 'analyses' ? (
        <div>
          <p className="text-[11.5px] leading-snug mb-2" style={{ color: wcg.muted }}>
            Standard first questions — one click runs the analysis and lands its chart on the right.
          </p>
          <div className="space-y-1.5">
            {STANDARD_ANALYSES.map((a) => (
              <button
                key={a.label}
                onClick={() => onRunAnalysis(a.prompt)}
                className="w-full text-left rounded-lg border px-2.5 py-2 transition-colors"
                style={{ background: wcg.surface, borderColor: wcg.border }}
              >
                <span className="flex items-start gap-2">
                  <Play className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: wcg.teal }} />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-medium leading-snug" style={{ color: wcg.ink }}>
                      {a.label}
                    </span>
                    <span className="flex items-center gap-1 text-[10.5px] mt-0.5" style={{ color: wcg.muted }}>
                      <BarChart3 className="w-3 h-3" /> {a.chart}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
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
                onPickElement(
                  `Let's pressure-test the primary endpoint: ${brief.primary_endpoint.text}. What is its operational cost?`
                )
              }
            />
            {brief.secondary_endpoints.map((e) => (
              <Element
                key={e.id}
                label={`Secondary — ${e.text}`}
                decided={decidedIds.has(e.id)}
                onClick={() =>
                  onPickElement(
                    brief.candidate_secondary_endpoints.length
                      ? `We're considering adding secondary endpoints (${brief.candidate_secondary_endpoints
                          .map((c) => c.text)
                          .join('; ')}). How could this impact data collection timelines?`
                      : `How does the secondary endpoint "${e.text}" load the schedule and data-collection timeline?`
                  )
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
        </>
      )}

      <DecisionLog decisions={decisions} />
    </div>
  )
}

function DecisionLog({ decisions }: { decisions: ShippedDecision[] }) {
  if (!decisions.length) return null
  return (
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
  )
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-md px-2 py-1 text-[12px] font-medium transition-colors"
      style={{
        background: active ? wcg.surface : 'transparent',
        color: active ? wcg.ink : wcg.muted,
        boxShadow: active ? '0 1px 2px rgba(10, 37, 64, 0.08)' : undefined,
      }}
    >
      {children}
    </button>
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
