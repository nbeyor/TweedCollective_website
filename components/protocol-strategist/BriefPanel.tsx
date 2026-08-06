'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  Check,
  CheckCircle2,
  FilePlus2,
  FileText,
  HelpCircle,
  MessageSquare,
  Play,
} from 'lucide-react'

import { DATA_CATEGORIES, matchAnalyses } from '@/lib/mcp/prompts'
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
        <DecisionLog decisions={decisions} onReviewInChat={onRunAnalysis} />
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
        <AnalyticsExplorer onRunAnalysis={onRunAnalysis} />
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

      <DecisionLog decisions={decisions} onReviewInChat={onRunAnalysis} />
    </div>
  )
}

/**
 * Browse the corpus by data category. Nothing checked → the four
 * single-category starters. Checked categories surface the analytics that
 * relate them (cross-category relationships first); if no analysis covers the
 * exact combination, anything touching a checked category shows instead of an
 * empty list.
 */
function AnalyticsExplorer({ onRunAnalysis }: { onRunAnalysis: (prompt: string) => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const shown = matchAnalyses(Array.from(checked))

  const labelFor = (key: string) => DATA_CATEGORIES.find((c) => c.key === key)?.label ?? key

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11.5px] leading-snug mb-2" style={{ color: wcg.muted }}>
          Check the data you want to relate — matching analyses tee up below.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {DATA_CATEGORIES.map((c) => {
            const on = checked.has(c.key)
            return (
              <button
                key={c.key}
                onClick={() => toggle(c.key)}
                aria-pressed={on}
                className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-colors"
                style={{
                  background: on ? '#ECFBF6' : wcg.surface,
                  borderColor: on ? wcg.teal : wcg.border,
                }}
              >
                <span
                  className="w-3.5 h-3.5 shrink-0 rounded-[4px] border flex items-center justify-center"
                  style={{
                    background: on ? wcg.teal : wcg.surface,
                    borderColor: on ? wcg.teal : wcg.borderStrong,
                  }}
                >
                  {on && <Check className="w-2.5 h-2.5" style={{ color: '#fff' }} strokeWidth={3} />}
                </span>
                <span className="text-[11.5px] leading-tight" style={{ color: wcg.ink }}>
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        {shown.map((a) => (
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
                <span className="flex items-center gap-1 text-[10.5px] mt-0.5 flex-wrap" style={{ color: wcg.muted }}>
                  <BarChart3 className="w-3 h-3 shrink-0" /> {a.chart} ·{' '}
                  {a.categories.map(labelFor).join(' × ')}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function DecisionLog({
  decisions,
  onReviewInChat,
}: {
  decisions: ShippedDecision[]
  onReviewInChat?: (prompt: string) => void
}) {
  if (!decisions.length) return null
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.teal }}>
          Decision log
        </p>
        {onReviewInChat && (
          <button
            onClick={() =>
              onReviewInChat(
                'Pull up the decision log — summarize what we have decided so far and what is still open.'
              )
            }
            title="Review the decision log in the chat"
            className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium transition-colors"
            style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.blue }}
          >
            <MessageSquare className="w-3 h-3" /> Review in chat
          </button>
        )}
      </div>
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
          </div>
        ))}
      </div>
      <p className="text-[10.5px] mt-2 leading-snug" style={{ color: wcg.faint }}>
        Decisions live here, not in Drive — “Publish updated protocol” applies them to the published
        document.
      </p>
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
