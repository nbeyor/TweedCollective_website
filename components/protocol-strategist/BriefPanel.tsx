'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Coins,
  FileText,
  FlaskConical,
  HelpCircle,
  Landmark,
  MapPin,
  MessageSquare,
  Play,
  Timer,
  Trash2,
  Workflow,
} from 'lucide-react'

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
 * The controls are organised around the decisions a protocol lead actually
 * needs to make — cost, site footprint, timelines, endpoints — not around a
 * flat list of tools or raw data categories. This is the answer to the
 * blank-whiteboard problem: the panel funnels the user from "what do I even
 * ask?" to a short list of grounded, chart-backed questions per decision.
 *
 * Each analysis carries a brief-scoped `prompt` (used with a draft loaded) and,
 * where the same question makes sense before any design exists, a `blankPrompt`
 * phrased at the comparator-cohort level so the groups also work in blank mode.
 */
interface Analysis {
  label: string
  chart: string
  prompt: string
  blankPrompt?: string
}

interface QuestionGroup {
  key: string
  label: string
  question: string
  icon: React.ReactNode
  analyses: Analysis[]
}

const iconProps = { className: 'w-3.5 h-3.5', strokeWidth: 2 }

const QUESTION_GROUPS: QuestionGroup[] = [
  {
    // Structure is the upstream decision — everything downstream (cost,
    // footprint, timeline) is priced against it — so it leads the funnel.
    // Cuts follow the axes a design lead actually weighs: control strategy,
    // blinding, framework (parallel/crossover/dose-escalation), arms &
    // allocation, then the special structures (adaptive, basket).
    key: 'design',
    label: 'Study design',
    question: 'Is this the right structure — arms, control, blinding?',
    icon: <Workflow {...iconProps} style={{ color: wcg.sky }} />,
    analyses: [
      {
        label: 'Designs comparable trials used',
        chart: 'Design structures',
        prompt:
          'What study-design structures did comparable trials use — randomized vs single-arm, blinding, parallel vs crossover vs dose-escalation — and how did each actually enroll?',
        blankPrompt:
          'For a trial like this, what design structures did comparable studies use — control, blinding, framework — and how did each actually enroll?',
      },
      {
        label: 'Single-arm vs randomized, open-label vs blinded',
        chart: 'Design structures',
        prompt:
          'Could this study run single-arm or open-label instead of randomized double-blind? Compare what those designs looked like in comparable trials — enrollment size, duration, amendments — and state the evidence-strength tradeoff.',
        blankPrompt:
          'What do single-arm and open-label designs look like operationally in comparable trials versus randomized blinded ones, and what is the evidence-strength tradeoff?',
      },
      {
        label: 'Arm count vs enrollment load',
        chart: 'Scenario bars',
        prompt:
          'How does arm count relate to total enrollment and duration across comparable trials? What would adding a third arm mean for our sample size and timeline?',
        blankPrompt:
          'How does arm count relate to total enrollment and duration across comparable trials?',
      },
      {
        label: 'Adaptive & basket precedent',
        chart: 'Design structures',
        prompt:
          'Is there precedent for adaptive or basket designs among comparable trials, and how did those trials perform? Be explicit where the evidence is thin.',
        blankPrompt:
          'Is there precedent for adaptive or basket designs in trials like this, and how did those trials perform? Be explicit where the evidence is thin.',
      },
    ],
  },
  {
    key: 'cost',
    label: 'Cost',
    question: 'What will this study cost?',
    icon: <Coins {...iconProps} style={{ color: wcg.teal }} />,
    analyses: [
      {
        label: 'Per-patient & total cost',
        chart: 'Cost buildup',
        prompt:
          'What will this study cost per patient and all-in? Break out direct vs indirect and show the range across SoA intensity.',
        blankPrompt:
          'What does a trial like this typically cost per patient and all-in, direct vs indirect, based on comparable studies in the corpus?',
      },
      {
        label: 'How the SoA drives cost',
        chart: 'Cost buildup',
        prompt:
          'How much of the per-patient cost is the schedule of assessments? Show lean vs as-drafted vs rich.',
      },
      {
        label: 'What an amendment costs',
        chart: 'Amendment-risk view',
        prompt:
          'If we have to amend after first-patient-in, what does that typically cost in dollars and months, and which elements are most likely to force one?',
        blankPrompt:
          'What do mid-flight amendments typically cost in dollars and months for comparable trials, and which elements force them?',
      },
    ],
  },
  {
    key: 'sites',
    label: 'Site footprint',
    question: 'Where should we run it, and how many sites?',
    icon: <MapPin {...iconProps} style={{ color: wcg.blue }} />,
    analyses: [
      {
        label: 'Recommended country footprint',
        chart: 'Site & country map',
        prompt:
          'Build me a country and site footprint that hits my enrollment target with a 20% US floor. Show the allocation on a map and the recruit timeline.',
        blankPrompt:
          'For a trial like this, what country and site footprint would hit enrollment with a 20% US floor, based on where comparable trials ran?',
      },
      {
        label: 'Sites vs recruit timeline',
        chart: 'Scenario bars',
        prompt:
          'How does the recruit timeline and activation cost move if we run a lean vs planned vs aggressive site count? Give me the sensitivity.',
      },
      {
        label: 'Slip drivers by site type',
        chart: 'Site-level bars',
        prompt:
          'Which site types would drive enrollment slip if we required additional screening procedures at every site? Break the friction down by site type.',
      },
    ],
  },
  {
    key: 'timelines',
    label: 'Timelines',
    question: 'How fast can we realistically enroll?',
    icon: <Timer {...iconProps} style={{ color: wcg.amber }} />,
    analyses: [
      {
        label: 'Added-procedure what-if',
        chart: 'Scenario bars',
        prompt:
          'If we added a confirmatory screening procedure for our most burdensome eligibility criterion, how would it hit the enrollment timeline? Give me options with tradeoffs.',
      },
      {
        label: 'Screening burden by criterion',
        chart: 'Criteria waterfall',
        prompt: 'Which criteria in this draft will cost us the most eligible patients?',
      },
      {
        label: 'Enrollment vs comparators',
        chart: 'Comparator scatter',
        prompt:
          'Place this design against comparable trials — is it more burdensome than the trials that enrolled fastest?',
        blankPrompt:
          'How fast did comparable trials enroll, and what enrollment duration is realistic for a trial like this?',
      },
      {
        label: 'Restrictiveness vs enrollment',
        chart: 'Relationship line',
        prompt:
          'How does eligibility restrictiveness relate to screen-fail rate and enrollment duration across comparable trials? Quantify the relationship and chart it.',
        blankPrompt:
          'Across comparable trials, how does eligibility restrictiveness relate to screen-fail rate and enrollment duration? Chart it.',
      },
    ],
  },
  {
    key: 'endpoints',
    label: 'Endpoints',
    question: 'Which endpoints, at what timeline cost?',
    icon: <FlaskConical {...iconProps} style={{ color: wcg.magenta }} />,
    analyses: [
      {
        label: 'Endpoint timeline impact',
        chart: 'Endpoint timeline',
        prompt:
          'How would adding the candidate secondary endpoints hit data collection and the database-lock timeline?',
      },
      {
        label: 'Endpoint load vs database lock',
        chart: 'Endpoint timeline',
        prompt:
          'Rank the candidate endpoints by the days they add to database lock, and show which subset protects the readout timeline.',
      },
    ],
  },
  {
    key: 'regulatory',
    label: 'Regulatory',
    question: 'Will the design hold up with regulators?',
    icon: <Landmark {...iconProps} style={{ color: wcg.purple }} />,
    analyses: [
      {
        label: 'Regional floor compliance',
        chart: 'Site & country map',
        prompt:
          'Does our footprint clear regulatory regional expectations? Check the recommended country allocation against a 20% North America enrollment floor and state the compliance explicitly.',
        blankPrompt:
          'For a trial like this, what regional enrollment mix did comparable trials run, and would a typical footprint clear a 20% North America enrollment floor?',
      },
      {
        label: 'Stricter-floor sensitivity',
        chart: 'Scenario bars',
        prompt:
          'If regulators push for more US enrollment, compare footprints at 20% vs 30% vs 40% North America floors — what does each level cost in recruit timeline and activation?',
      },
      {
        label: 'Amendment exposure',
        chart: 'Amendment-risk view',
        prompt:
          'Which elements of this design are most likely to draw pushback and force an amendment, and what did the historical fixes look like?',
        blankPrompt:
          'Which design-element types most often force amendments in comparable trials, and what did the historical fixes look like?',
      },
    ],
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
  onClearDecisions,
  docLink,
}: {
  brief: DesignBrief | null
  mode: BriefMode
  decisions: ShippedDecision[]
  onPickElement: (prompt: string) => void
  onRunAnalysis: (prompt: string) => void
  onClearDecisions?: () => void
  docLink?: string | null
}) {
  // Analyses lead: the funnel of role-relevant questions is the starting
  // point; the brief's elements are the subset you drill into from there.
  const [tab, setTab] = useState<'brief' | 'analyses'>('analyses')
  const decidedIds = new Set(decisions.map((d) => d.element_id))

  if (mode === 'blank' || !brief) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.blue }}>
            New protocol · blank
          </p>
          <h2 className="text-[15px] font-semibold leading-snug" style={{ color: wcg.ink }}>
            Start from a decision
          </h2>
        </div>
        <div
          className="rounded-lg border px-3 py-3 text-[12.5px] leading-relaxed"
          style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.body }}
        >
          <ClipboardList className="w-4 h-4 mb-2" style={{ color: wcg.blue }} />
          No blank page — pick a question below to see what comparable trials in
          the corpus did, or name an indication and phase in the chat. Every
          answer is grounded in the operations data; the design takes shape here
          as decisions are shipped.
        </div>
        <QuestionExplorer mode={mode} onRunAnalysis={onRunAnalysis} />
        <DecisionLog
          decisions={decisions}
          docLabel="New protocol"
          onReviewInChat={onRunAnalysis}
          onClear={onClearDecisions}
        />
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
        <Tab active={tab === 'analyses'} onClick={() => setTab('analyses')}>
          Analyses
        </Tab>
        <Tab active={tab === 'brief'} onClick={() => setTab('brief')}>
          Brief
        </Tab>
      </div>

      {tab === 'analyses' ? (
        <QuestionExplorer mode={mode} onRunAnalysis={onRunAnalysis} />
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

      <DecisionLog
        decisions={decisions}
        docLabel={brief.title ?? brief.indication}
        onReviewInChat={onRunAnalysis}
        onClear={onClearDecisions}
      />
    </div>
  )
}

/**
 * Browse the corpus by decision. Each headline question (cost, site footprint,
 * timelines, endpoints, eligibility & risk) expands to a short list of grounded,
 * chart-backed analyses. This is the funnel that answers the blank-whiteboard
 * problem — the user starts from a decision they have to make, not an empty
 * prompt. In blank mode only the analyses phrased at the cohort level show, so
 * the same panel works before any design exists.
 */
function QuestionExplorer({
  mode,
  onRunAnalysis,
}: {
  mode: BriefMode
  onRunAnalysis: (prompt: string) => void
}) {
  // The first group (study design — the upstream decision) opens by default.
  const [open, setOpen] = useState<string | null>('design')

  const groups = QUESTION_GROUPS.map((g) => {
    const analyses =
      mode === 'blank' ? g.analyses.filter((a) => a.blankPrompt) : g.analyses
    return { ...g, analyses }
  }).filter((g) => g.analyses.length)

  return (
    <div className="space-y-2">
      <p className="text-[11.5px] leading-snug" style={{ color: wcg.muted }}>
        {mode === 'blank'
          ? 'Pick the decision you want to explore — each pulls from comparable trials.'
          : 'Pick the decision you want to pressure-test — each runs a grounded, chart-backed analysis.'}
      </p>
      {groups.map((g) => {
        const isOpen = open === g.key
        return (
          <div key={g.key} className="rounded-lg border" style={{ background: wcg.surface, borderColor: wcg.border }}>
            <button
              onClick={() => setOpen(isOpen ? null : g.key)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-left"
            >
              <span className="shrink-0">{g.icon}</span>
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
                    onClick={() => onRunAnalysis(mode === 'blank' ? a.blankPrompt! : a.prompt)}
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

function DecisionLog({
  decisions,
  docLabel,
  onReviewInChat,
  onClear,
}: {
  decisions: ShippedDecision[]
  docLabel: string
  onReviewInChat?: (prompt: string) => void
  onClear?: () => void
}) {
  if (!decisions.length) return null
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: wcg.teal }}>
          Decision log
        </p>
        <span className="flex items-center gap-1 shrink-0">
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
          {onClear && (
            <button
              onClick={onClear}
              title={`Clear the decision log for ${docLabel} and start the project fresh`}
              className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium transition-colors"
              style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.bad }}
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </span>
      </div>
      {/* The log is a project artifact of THIS document — each protocol keeps its own. */}
      <p className="text-[10.5px] mb-2 truncate" style={{ color: wcg.muted }} title={docLabel}>
        {docLabel} · {decisions.length} decision{decisions.length === 1 ? '' : 's'}
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
