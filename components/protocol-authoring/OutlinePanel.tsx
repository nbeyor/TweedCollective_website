'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Coins,
  FlaskConical,
  Globe2,
  MessageSquare,
  Play,
  ShieldAlert,
  Sigma,
  Timer,
  Users,
  Weight,
} from 'lucide-react'

import { wcg } from '@/components/protocol-strategist/wcgTheme'
import {
  AUTHORING_GROUPS,
  FULL_BOARD_PROMPT,
  lensReviewPrompt,
  PROTOCOL_OUTLINE,
  REVIEW_LENSES,
} from '@/lib/protocol-authoring/library'
import type { ReviewFinding } from '@/lib/protocol-authoring/tools'

export interface ShippedDecision {
  element_id: string
  element_label: string
  decision: string
  rationale?: string
  alternatives_considered?: Array<{ option: string; tradeoff: string }>
  evidence?: string[]
}

const iconProps = { className: 'w-3.5 h-3.5', strokeWidth: 2 }

/** Icons per analyses group, keyed to library.ts group keys. */
const GROUP_ICONS: Record<string, React.ReactNode> = {
  population: <Users {...iconProps} style={{ color: wcg.blue }} />,
  statistics: <Sigma {...iconProps} style={{ color: wcg.purple }} />,
  burden: <Weight {...iconProps} style={{ color: wcg.amber }} />,
  cost: <Coins {...iconProps} style={{ color: wcg.teal }} />,
  geography: <Globe2 {...iconProps} style={{ color: wcg.sky }} />,
  timelines: <Timer {...iconProps} style={{ color: wcg.amber }} />,
  endpoints: <FlaskConical {...iconProps} style={{ color: wcg.magenta }} />,
  risk: <ShieldAlert {...iconProps} style={{ color: wcg.bad }} />,
}

/**
 * The Foundry's left panel: the protocol's section outline (the structural
 * spine the client's example is organized around), the augmented analyses
 * library, the review-board launcher, and the decision log. Clicking a section
 * tees a section-scoped question; clicking an analysis or a lens runs it.
 */
export function OutlinePanel({
  findings,
  decisions,
  streaming,
  onPickQuestion,
  onRun,
}: {
  findings: ReviewFinding[]
  decisions: ShippedDecision[]
  streaming: boolean
  /** Put a question in the composer for the user to edit/send. */
  onPickQuestion: (q: string) => void
  /** Send a prompt immediately. */
  onRun: (q: string) => void
}) {
  const [tab, setTab] = useState<'protocol' | 'analyses'>('protocol')

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex rounded-lg border p-0.5" style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}>
        <Tab active={tab === 'protocol'} onClick={() => setTab('protocol')}>
          Protocol
        </Tab>
        <Tab active={tab === 'analyses'} onClick={() => setTab('analyses')}>
          Analyses
        </Tab>
      </div>

      {tab === 'protocol' ? (
        <>
          <SectionOutline findings={findings} onPickQuestion={onPickQuestion} />
          <ReviewBoardLauncher streaming={streaming} onRun={onRun} />
        </>
      ) : (
        <AnalysesExplorer onRun={onRun} />
      )}

      <DecisionLog decisions={decisions} onReviewInChat={onRun} />
    </div>
  )
}

// ----------------------------------------------------------------- outline ---

function SectionOutline({
  findings,
  onPickQuestion,
}: {
  findings: ReviewFinding[]
  onPickQuestion: (q: string) => void
}) {
  const bySection = new Map<string, { critical: number; major: number; minor: number }>()
  for (const f of findings) {
    const c = bySection.get(f.section_id) ?? { critical: 0, major: 0, minor: 0 }
    c[f.severity] += 1
    bySection.set(f.section_id, c)
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[11.5px] leading-snug" style={{ color: wcg.muted }}>
        The draft, section by section — click one to pressure-test it. Review findings badge the sections they hit.
      </p>
      {PROTOCOL_OUTLINE.map((ch) => (
        <div key={ch.num}>
          <p className="text-[10.5px] uppercase tracking-[0.12em] mb-1" style={{ color: wcg.muted }}>
            {ch.num}. {ch.title}
          </p>
          <ul className="space-y-1">
            {ch.sections.map((s) => {
              const c = bySection.get(s.id)
              return (
                <li key={s.id}>
                  <button
                    onClick={() => onPickQuestion(s.question)}
                    title={s.question}
                    className="w-full text-left rounded-lg border px-2.5 py-1.5 transition-colors"
                    style={{
                      background: c?.critical ? '#FDECE7' : c?.major ? '#FFF7EC' : wcg.surface,
                      borderColor: c?.critical ? wcg.bad : c?.major ? wcg.warn : wcg.border,
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="min-w-0 flex-1 text-[12.5px] leading-snug" style={{ color: wcg.body }}>
                        {s.title}
                      </span>
                      {c && (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold tabular-nums">
                          {c.critical > 0 && <Badge color="#fff" bg={wcg.bad}>{c.critical}</Badge>}
                          {c.major > 0 && <Badge color="#7A5410" bg="#FBE3BC">{c.major}</Badge>}
                          {c.minor > 0 && <Badge color={wcg.muted} bg={wcg.surfaceMuted}>{c.minor}</Badge>}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span className="rounded px-1 py-px" style={{ color, background: bg }}>
      {children}
    </span>
  )
}

// ------------------------------------------------------------ review board ---

function ReviewBoardLauncher({ streaming, onRun }: { streaming: boolean; onRun: (q: string) => void }) {
  return (
    <div className="rounded-lg border px-3 py-3" style={{ background: wcg.surface, borderColor: wcg.border }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <ShieldAlert className="w-3.5 h-3.5" style={{ color: wcg.magenta }} />
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.magenta }}>
          Review board
        </p>
      </div>
      <p className="text-[11.5px] leading-snug mb-2" style={{ color: wcg.muted }}>
        Six reviewer lenses. Findings file to the rail with severity, quote, basis, and a proposed rewrite.
      </p>
      <button
        onClick={() => onRun(FULL_BOARD_PROMPT)}
        disabled={streaming}
        className="w-full rounded-md px-2.5 py-1.5 text-[12px] font-medium text-white disabled:opacity-40 mb-2"
        style={{ background: wcg.navy }}
      >
        Convene the full board
      </button>
      <div className="flex flex-wrap gap-1">
        {REVIEW_LENSES.map((l) => (
          <button
            key={l.key}
            onClick={() => onRun(lensReviewPrompt(l))}
            disabled={streaming}
            title={l.focus}
            className="rounded-full border px-2 py-0.5 text-[11px] disabled:opacity-40 transition-colors"
            style={{ background: wcg.surfaceMuted, borderColor: wcg.border, color: wcg.body }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// --------------------------------------------------------------- analyses ----

function AnalysesExplorer({ onRun }: { onRun: (q: string) => void }) {
  const [open, setOpen] = useState<string | null>('population')

  return (
    <div className="space-y-2">
      <p className="text-[11.5px] leading-snug" style={{ color: wcg.muted }}>
        Pick the decision you want to pressure-test — each runs a grounded, chart-backed analysis.
      </p>
      {AUTHORING_GROUPS.map((g) => {
        const isOpen = open === g.key
        return (
          <div key={g.key} className="rounded-lg border" style={{ background: wcg.surface, borderColor: wcg.border }}>
            <button
              onClick={() => setOpen(isOpen ? null : g.key)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-left"
            >
              <span className="shrink-0">{GROUP_ICONS[g.key] ?? <BarChart3 {...iconProps} />}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold leading-snug" style={{ color: wcg.ink }}>
                  {g.label}
                </span>
                <span className="block text-[10.5px] leading-snug" style={{ color: wcg.muted }}>
                  {g.question}
                </span>
              </span>
              <ChevronRight
                className="w-4 h-4 shrink-0 transition-transform"
                style={{ color: wcg.muted, transform: isOpen ? 'rotate(90deg)' : undefined }}
              />
            </button>
            {isOpen && (
              <div className="border-t px-2 pb-2 pt-1.5 space-y-1" style={{ borderColor: wcg.border }}>
                {g.analyses.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => onRun(a.prompt)}
                    className="w-full text-left rounded-md border px-2.5 py-1.5 transition-colors"
                    style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}
                  >
                    <span className="flex items-start gap-2">
                      <Play className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: wcg.teal }} />
                      <span className="min-w-0">
                        <span className="block text-[12px] font-medium leading-snug" style={{ color: wcg.ink }}>
                          {a.label}
                        </span>
                        <span className="flex items-center gap-1 text-[10.5px] mt-0.5" style={{ color: wcg.muted }}>
                          <BarChart3 className="w-3 h-3 shrink-0" /> {a.chart}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ------------------------------------------------------------ decision log ---

function DecisionLog({
  decisions,
  onReviewInChat,
}: {
  decisions: ShippedDecision[]
  onReviewInChat: (prompt: string) => void
}) {
  if (!decisions.length) return null
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.teal }}>
          Decision log
        </p>
        <button
          onClick={() =>
            onReviewInChat('Pull up the decision log — summarize what we have decided so far and what is still open.')
          }
          title="Review the decision log in the chat"
          className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium transition-colors"
          style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.blue }}
        >
          <MessageSquare className="w-3 h-3" /> Review in chat
        </button>
      </div>
      <div className="space-y-2">
        {decisions.map((d, i) => (
          <div key={i} className="rounded-lg border px-3 py-2" style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}>
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
