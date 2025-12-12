'use client'

import React, { useState, useEffect, useRef } from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import { Code2, TrendingUp, Users, Target, Zap } from 'lucide-react'

// Timeline data
const timelineData = [
  {
    id: 0,
    era: '2021–2023',
    name: 'GitHub Copilot',
    positioning: 'Autocomplete era: comments & partial code → runnable functions.',
    metric: '20–55% faster',
    metricDetail: 'coding tasks in controlled studies',
    anecdote: 'Teams reported ~40% of new code coming from comments + expansions, with big gains on tests & boilerplate.',
    detailTitle: 'GitHub Copilot · The Autocomplete Era',
    detailCopy: 'Copilot embedded LLMs into existing IDEs and workflows. It proved that large language models could eliminate much of the boilerplate and help developers move faster without changing how teams structure codebases.',
    quant: [
      '20–55% faster completion of typical coding tasks in controlled studies.',
      '20–30% fewer defects per LOC for teams that paired Copilot with good test coverage.',
      'Material reduction in "blank-page" time for new features and test suites.'
    ],
    anecdoteList: [
      'Developers reporting 40% of new code written via comments + Copilot expansions.',
      'One large enterprise cut unit test authoring time by ~60% on new services.'
    ]
  },
  {
    id: 1,
    era: '2023–2024',
    name: 'Cursor',
    positioning: 'First LLM-native IDE with deep repo context and agentic tooling.',
    metric: '2–4× faster',
    metricDetail: 'feature development in early team reports',
    anecdote: 'Startups reported shipping full greenfield products in weeks rather than quarters.',
    detailTitle: 'Cursor · The Agentic IDE',
    detailCopy: 'Cursor moved from completion to collaboration. By indexing the repo and offering multi-file edits, it turned the IDE into a conversation with a knowledgeable teammate who understands architecture and patterns.',
    quant: [
      '2–4× faster delivery of typical features in early pilots.',
      '50–70% reduction in refactor time for large-scale code cleanup.',
      '70–90% faster onboarding reported by teams using Cursor to explain legacy code.'
    ],
    anecdoteList: [
      'Small teams shipping net-new products in <4 weeks, using Cursor to generate the bulk of implementation and tests.',
      'Engineers using Cursor to untangle and modernize complex legacy services over a single weekend.'
    ]
  },
  {
    id: 2,
    era: '2024',
    name: 'Claude 3.5 Sonnet & Claude Code',
    positioning: 'Reasoning breakthrough: full-repo tasks, strong multi-file coherence.',
    metric: '3–6× faster',
    metricDetail: 'multi-file tasks vs. prior tools',
    anecdote: 'Famous for "feels like a senior engineer" and handling end-to-end microservices.',
    detailTitle: 'Claude 3.5 Sonnet & Claude Code · The Reasoning Jump',
    detailCopy: 'Claude 3.5 improved reasoning quality and context handling dramatically. With Claude Code, it could take entire epics—implement a feature, refactor a subsystem, write tests and docs—and handle them in a single, guided conversation.',
    quant: [
      '3–6× speedup on complex, multi-file changes compared to earlier generation tools.',
      'Notable reductions in subtle logic bugs thanks to better reasoning and self-correction.',
      'Higher success rates on full-feature builds from natural-language specs.'
    ],
    anecdoteList: [
      'Teams asking Claude to design and implement new microservices—schemas, endpoints, tests, and docs—in a handful of prompts.',
      'Claude helping teams finally address legacy code issues they had postponed for years.'
    ]
  },
  {
    id: 3,
    era: 'Late 2024–2025',
    name: 'Dedicated Claude Code Mode',
    positioning: 'Repo-centric agents with stronger planning + verification loops.',
    metric: '5–10× throughput',
    metricDetail: 'on routine development workloads',
    anecdote: 'Stories of "25 hours of continuous agent coding" rebuilding entire reporting stacks.',
    detailTitle: 'Claude Code · Dedicated Coding Agents',
    detailCopy: 'Claude Code formalized the idea of a coding-specialist agent. It moved beyond suggestions into managing full workflows: planning tasks, editing multiple files, running tests, and iterating with minimal prompting.',
    quant: [
      '5–10× throughput on routine development (CRUD features, integrations, test coverage).',
      'Consistent improvements in defect discovery before human review, especially where tests existed.',
      'Material reduction in dev time spent on glue code, SDK updates, and migrations.'
    ],
    anecdoteList: [
      'Teams reporting continuous agent runs that rebuilt entire reporting platforms over a weekend.',
      'Engineers using Claude Code to migrate large codebases between frameworks with minimal manual intervention.'
    ]
  },
  {
    id: 4,
    era: '2025+',
    name: 'Opus 4.5 & Agentic Suites',
    positioning: 'Orchestrated agents that open branches, self-review, and raise PRs.',
    metric: '8–12× improvement',
    metricDetail: 'for end-to-end feature workflows in early pilots',
    anecdote: 'Agents implementing complex data pipelines and integrations in days instead of months.',
    detailTitle: 'Opus 4.5 & Modern Agentic Suites · Towards Autonomous Branches',
    detailCopy: 'With models like Opus 4.5 and coordinated agent frameworks, we enter a phase where agents can own entire branches: plan work, implement changes, run tests, self-review, and raise PRs for human approval.',
    quant: [
      '8–12× improvement in throughput for full-stack feature delivery under structured pilots.',
      '90%+ automation of repetitive integration work: dependency updates, SDK migrations, and schema-aligned transformations.',
      'Greater predictability in delivery timelines thanks to agents working continuously between human checkpoints.'
    ],
    anecdoteList: [
      'Agent swarms standing up complex data harmonization pipelines for biopharma analytics in <48 hours.',
      'Senior engineers supervising multiple agent-driven branches in parallel, effectively multiplying individual leverage.'
    ]
  }
]

const stanceData = [
  {
    title: 'Passive / Opt-In',
    badge: 'Low Commitment',
    detail: 'Offer tools to interested engineers with minimal structure. This surfaces enthusiasts, but adoption is uneven and ROI is hard to quantify. Messaging: "Feel free to use these if you\'re curious and compliant."'
  },
  {
    title: 'Structured Pilot',
    badge: 'Recommended Starting Point',
    detail: 'Pick 1–2 squads, define KPIs (cycle time, PR throughput, defect rate, onboarding speed), and run a 6–12 week experiment. Treat this as discovery: what does 3–5× velocity actually look like here, in this codebase, under this regulatory burden?'
  },
  {
    title: 'Inevitable & Incremental Rollout',
    badge: 'Transformation Program',
    detail: 'Assume VIBE tools are part of your future. Establish a multi-quarter rollout roadmap across teams, with continuous training and playbook refinement. Messaging: "This is the new standard; we will support your transition."'
  },
  {
    title: 'Top-Down Mandate',
    badge: 'High Impact / High Change',
    detail: 'Leadership declares agents as mandatory for development workflows, backed with heavy enablement and governance. You get the fastest normalization and largest gains—but also the most cultural shock if unprepared.'
  }
]

const operatorPoints = [
  'Senior engineers spend more time managing agents: decomposing work, reviewing PRs, shaping architecture.',
  'Fewer people writing boilerplate; more focused on systems thinking and product impact.',
  'New roles emerge: agent "shepherds", model/prompt owners, and validation engineers for regulated workflows.',
  'The effective workday becomes 24/7 as agents continue tasks between human review cycles.'
]

const pePoints = [
  'You get more roadmap per FTE: engineering becomes a lever for revenue and product velocity, not just a cost line.',
  'Talent strategy shifts from "how many" to "what mix": senior orchestrators + a smaller bench of implementers.',
  'You can integrate acquired teams faster by deploying a shared agentic toolchain and playbook.',
  'Retention risk changes: high-leverage engineers who master agents become uniquely valuable—but also more mobile.'
]

// Interactive Timeline Component
function TimelineSlide() {
  const [selectedId, setSelectedId] = useState(0)
  const selectedData = timelineData[selectedId]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Tool Evolution Timeline</h2>
      <p className="text-cream/60 mb-8 max-w-2xl">
        From "autocomplete on steroids" to agents that can own an entire feature—from spec to PR—
        with 3–10× velocity gains on real-world workloads.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-cream/40 uppercase tracking-wider">Early</span>
            <input
              type="range"
              min="0"
              max="4"
              value={selectedId}
              onChange={(e) => setSelectedId(parseInt(e.target.value))}
              className="flex-1 accent-sage"
            />
            <span className="text-xs text-cream/40 uppercase tracking-wider">Now</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sage/30">
            {timelineData.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`flex-shrink-0 w-64 p-4 rounded-xl border transition-all ${
                  selectedId === item.id
                    ? 'border-sage bg-sage/10 shadow-lg scale-105'
                    : 'border-cream/20 bg-cream/5 hover:border-cream/30'
                }`}
              >
                <div className="text-xs text-cream/50 mb-1">{item.era}</div>
                <div className="text-sm font-semibold text-cream mb-1">{item.name}</div>
                <div className="text-xs text-cream/60 mb-2">{item.positioning}</div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-sage/10 border border-sage/30 text-xs text-sage mb-2">
                  <span className="font-mono">{item.metric}</span>
                  <span className="text-cream/50">· {item.metricDetail}</span>
                </div>
                <div className="text-xs text-cream/50">{item.anecdote}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-dashed border-cream/30 bg-cream/5">
          <h3 className="text-sm font-semibold text-cream mb-3">{selectedData.detailTitle}</h3>
          <p className="text-xs text-cream/70 mb-4">{selectedData.detailCopy}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-cream/50 mb-2">Quantified Impact</h4>
              <ul className="space-y-1.5">
                {selectedData.quant.map((q, i) => (
                  <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                    <span className="text-sage mt-0.5">●</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-cream/50 mb-2">Market Anecdote</h4>
              <ul className="space-y-1.5">
                {selectedData.anecdoteList.map((a, i) => (
                  <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                    <span className="text-sage mt-0.5">●</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Adoption Stance Component
function AdoptionStanceSlide() {
  const [stanceIndex, setStanceIndex] = useState(1)
  const stance = stanceData[stanceIndex]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Adoption Stances & Change Management</h2>
      <p className="text-cream/60 mb-8 max-w-2xl">
        Whether you see VIBE tools as "promising" or "inevitable" determines how aggressively
        you roll them out—and how you manage the culture shock.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="text-xs uppercase tracking-wider text-cream/50 mb-4">Choose stance</div>
          <div className="space-y-4">
            <div>
              <input
                type="range"
                min="0"
                max="3"
                value={stanceIndex}
                onChange={(e) => setStanceIndex(parseInt(e.target.value))}
                className="w-full accent-sage mb-2"
              />
              <div className="flex justify-between text-xs text-cream/50">
                <span>Opt-In</span>
                <span>Pilot</span>
                <span>Inevitable</span>
                <span>Mandate</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-cream">{stance.title}</span>
              <span className="px-2 py-1 rounded-full border border-sage/50 bg-sage/10 text-xs text-sage uppercase tracking-wider">
                {stance.badge}
              </span>
            </div>
            <p className="text-xs text-cream/60">
              <strong className="text-cream/80">{stance.title}:</strong> {stance.detail}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <h3 className="text-xs uppercase tracking-wider text-cream/50 mb-2">Case Study</h3>
            <h4 className="text-sm font-semibold text-cream mb-2">Norges-style Top-Down Approach</h4>
            <p className="text-xs text-cream/60 mb-3">
              A sovereign wealth institution publicly described an aggressive, top-down stance on coding assistants:
              leadership framed them as <strong className="text-cream/80">strategic, not optional</strong>, and made support and training a core part
              of the rollout.
            </p>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-sage/30 bg-sage/10 text-xs text-sage mb-3">
              Outcome <span className="font-mono text-xs">3–10×</span>
            </div>
            <ul className="space-y-1.5">
              {['Fast normalization of agents across teams—no "have vs. have-not" squads.', 'Strong central enablement (training, templates, approved patterns).', 'Clear message: "This is how we build now."'].map((item, i) => (
                <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                  <span className="text-sage mt-0.5">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <h3 className="text-xs uppercase tracking-wider text-cream/50 mb-2">Implications by Stance</h3>
            <p className="text-xs text-cream/60 mb-3">As you move from opt-in to mandate:</p>
            <ul className="space-y-1.5">
              {['Messaging shifts from "feel free to try" to "this is our standard."', 'Change management shifts from light coaching to a structured transformation program.', 'Measurement shifts from anecdotes to tracked KPIs across the portfolio.', 'Risk shifts from missed upside to potential mis-implementation—governance matters.'].map((item, i) => (
                <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                  <span className="text-sage mt-0.5">●</span>
                  <span><strong className="text-cream/80">{item.split(':')[0]}</strong>{item.split(':')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Value Creation Component
function ValueCreationSlide() {
  const [viewMode, setViewMode] = useState<'operator' | 'pe'>('operator')
  const [barsAnimated, setBarsAnimated] = useState(false)

  useEffect(() => {
    setTimeout(() => setBarsAnimated(true), 200)
  }, [])

  const valueData = [
    { label: 'Headcount reduction', width: 1 },
    { label: 'Roadmap velocity', width: 5 },
    { label: 'Quality / reliability', width: 4 },
    { label: 'M&A integration speed', width: 4 }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Value Creation & Talent Mix</h2>
      <p className="text-cream/60 mb-8 max-w-2xl">
        The question is not "how many engineers can I cut?"—it's "how fast can I hit product and
        revenue milestones that used to be impossible?"
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <h3 className="text-xs uppercase tracking-wider text-cream/50 mb-4">From Cost Line Item to Growth Engine</h3>
          <div className="space-y-4">
            {valueData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-xs text-cream/60 w-32 flex-shrink-0">{item.label}</div>
                <div className="flex-1 h-2 rounded-full bg-charcoal/50 overflow-hidden border border-cream/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sage via-terra to-ochre transition-all duration-1000"
                    style={{ width: barsAnimated ? `${item.width * 20}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-cream/50 mt-4">
            For PE investors, the interesting upside is accelerated top-line growth:
            <strong className="text-cream/80"> faster digital product launches, faster integration of add-ons, and fewer costly surprises</strong>
            in engineering-heavy assets.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <h3 className="text-xs uppercase tracking-wider text-cream/50 mb-4">Talent Mix · From Typing to Orchestrating Agents</h3>
          <div className="inline-flex rounded-full border border-cream/20 overflow-hidden mb-4">
            <button
              onClick={() => setViewMode('operator')}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                viewMode === 'operator'
                  ? 'bg-sage/20 text-sage border-r border-cream/20'
                  : 'text-cream/50 hover:text-cream/70'
              }`}
            >
              Operator Lens
            </button>
            <button
              onClick={() => setViewMode('pe')}
              className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                viewMode === 'pe'
                  ? 'bg-sage/20 text-sage'
                  : 'text-cream/50 hover:text-cream/70'
              }`}
            >
              PE Lens
            </button>
          </div>
          <ul className="space-y-2">
            {(viewMode === 'operator' ? operatorPoints : pePoints).map((point, i) => (
              <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                <span className="text-sage mt-0.5">⟶</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Define slides
const slides: Slide[] = [
  {
    id: 'title',
    title: 'Title',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cream/20 bg-cream/5 mb-6">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-sage to-terra shadow-lg shadow-sage/50" />
          <span className="text-xs uppercase tracking-wider text-cream/60">VIBE Coding · Executive Briefing</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-6 leading-tight">
          From Code to Agents
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-4 max-w-2xl">
          VIBE Coding in PE-backed Life Sciences
        </p>
        <p className="text-sm text-cream/50 max-w-xl">
          How next-gen coding agents reshape product velocity, talent, and value creation.
        </p>
      </div>
    )
  },
  {
    id: 'definition',
    title: 'What Is VIBE Coding?',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">01 · What Is VIBE Coding?</h2>
        <p className="text-cream/60 mb-8 max-w-2xl">
          A shift from "writing code" to "specifying behavior" in natural language,
          with agents that understand your systems, data, and constraints.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-xl border border-cream/20 bg-gradient-to-br from-cream/5 to-cream/0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-sage/10 to-transparent opacity-50" />
            <div className="relative">
              <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Definition</div>
              <p className="text-sm text-cream/80 mb-4">
                <strong className="text-cream">VIBE Coding</strong> (Voice-, Instruction-, Behavior-, Environment-based Coding)
                is a development paradigm where engineers describe intent in natural language and
                <strong className="text-cream"> context-aware agents</strong> generate, refactor, test, and document code
                across an entire codebase.
              </p>
              <p className="text-xs text-cream/60 mb-4">
                Agents work inside or alongside the IDE, using repository context, architecture,
                test suites, and policies to continuously plan → code → test → fix.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Natural-language first', 'Agentic, not just autocomplete', 'Full-repo awareness', 'Continuous verification'].map((pill, i) => (
                  <span key={i} className="px-2 py-1 rounded-full border border-cream/20 bg-cream/5 text-xs text-cream/70">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <strong className="text-xs text-cream/80 mb-2 block">Key characteristics</strong>
              <ul className="space-y-2">
                {[
                  'Agentic loops that propose plans, write code, run tests, and iterate.',
                  'Deep repository + infra context (monorepos, data models, APIs, IaC).',
                  'IDE-native or LLM-native environments (e.g., Cursor, Claude Code).',
                  'Emphasis on specifying behavior and constraints, not syntax.'
                ].map((item, i) => (
                  <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                    <span className="text-sage mt-0.5">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-xs text-cream/80 mb-2 block">Why this matters for PE-backed life sciences</strong>
              <ul className="space-y-2">
                {[
                  'Accelerates regulated digital builds: e-clinical, analytics, safety, RWD pipelines.',
                  'Compresses integration timelines in M&A-heavy rollup strategies.',
                  'Improves quality and reproducibility in safety-critical systems.',
                  'Turns engineering from a bottleneck into a valuation lever.'
                ].map((item, i) => (
                  <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                    <span className="text-sage mt-0.5">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'timeline',
    title: 'Tool Evolution Timeline',
    content: <TimelineSlide />
  },
  {
    id: 'integration',
    title: 'Beyond "Just Pick Up the Tool"',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">03 · Beyond "Just Pick Up the Tool"</h2>
        <p className="text-cream/60 mb-8 max-w-2xl">
          Value doesn't come from installing a plugin—it comes from how agents connect to your
          repos, CI/CD, data, and governance model.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <h3 className="text-xs uppercase tracking-wider text-cream/50 mb-3">How VIBE Tools Fit Your Stack</h3>
            <p className="text-xs text-cream/60 mb-4">Think of them as a new execution layer in your SDLC—not a toy gadget.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="text-xs text-cream/80 mb-2 block">Toolchain integration</strong>
                <ul className="space-y-1.5">
                  {['IDE integration (VS Code / JetBrains / Cursor-native).', 'Secure repo indexing (GitHub / GitLab / on-prem).', 'Branch & PR workflows (agents proposing changes, you approve).', 'CI/CD hooks: tests, linters, static analysis as guardrails.'].map((item, i) => (
                    <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                      <span className="text-sage mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-xs text-cream/80 mb-2 block">Data & governance</strong>
                <ul className="space-y-1.5">
                  {['Separation of PHI/PII; private or on-prem LLM endpoints.', 'Policy-aware coding (infra, security, regulatory constraints).', 'Audit trails for AI-generated code & decisions.', 'Alignment with GxP / 21 CFR Part 11 where relevant.'].map((item, i) => (
                    <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                      <span className="text-sage mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-cream/50 mt-4">
              Without this wiring, tools look magical in demos but stall in production—especially in regulated life sciences.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <h3 className="text-xs uppercase tracking-wider text-cream/50 mb-3">Deployment & Publishing Questions</h3>
            <p className="text-xs text-cream/60 mb-4">Mapping these upfront avoids the "we have licenses, but nobody uses them" trap.</p>
            <ul className="space-y-2">
              {[
                'Where do agents run? Local, cloud, VPC, or hybrid?',
                'How do they access secrets, environment configs, and test data?',
                'Who owns configuration: platform team, central AI team, tribes/squads?',
                'How do we version models and prompt configurations over time?',
                'What\'s our roll-back strategy if an agentic refactor goes wrong?'
              ].map((item, i) => (
                <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                  <span className="text-sage mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream/50 mt-4">
              For a PE-backed company, these decisions impact integration timelines post-acquisition
              and the ability to scale a common engineering "operating model" across the platform.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'stances',
    title: 'Adoption Stances',
    content: <AdoptionStanceSlide />
  },
  {
    id: 'value',
    title: 'Value Creation & Talent',
    content: <ValueCreationSlide />
  },
  {
    id: 'closing',
    title: 'PE Lens',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">06 · What This Means for PE-Backed Life Sciences</h2>
        <p className="text-cream/60 mb-8 max-w-2xl">
          Treat VIBE Coding as a lever on valuation, not a tooling curiosity. The firms that move first will
          pull forward revenue, integration, and innovation by multiple years.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <strong className="text-xs text-cream/80 mb-3 block">A simple playbook for investors & boards</strong>
            <ul className="space-y-2 mb-4">
              {[
                'Identify portfolio companies where engineering is the primary bottleneck to growth or integration.',
                'Assess current data, repo, and CI/CD maturity—are they ready for agentic workflows?',
                'Back 1–2 "lighthouse" implementations with clear KPIs and a 3–6 month horizon.',
                'Codify what works into a playbook: patterns, guardrails, training, and metrics.',
                'Scale the playbook across the platform to create a differentiated "VIBE-ready" operating model.'
              ].map((item, i) => (
                <li key={i} className="text-xs text-cream/60 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream/50">
              The right question for any asset isn't "can we reduce developers?", but:
              <strong className="text-cream/80"> "What does our roadmap look like if we deliver 2–3 years of engineering in the next 12 months?"</strong>
            </p>
          </div>
          <div className="p-5 rounded-xl border border-blue-500/50 bg-blue-500/10">
            <div className="text-xs uppercase tracking-wider text-blue-400 mb-2">Board-level takeaway</div>
            <p className="text-xs text-cream/60">
              <strong className="text-cream/80">VIBE Coding tools are inevitable.</strong> The only real choice for a PE platform is whether to
              <strong className="text-cream/80"> experiment slowly and opportunistically</strong>, or to
              <strong className="text-cream/80"> deliberately build an advantage</strong> in how portfolio companies harness agents for code, data,
              and product delivery.
              <br /><br />
              The upside is not marginal efficiency; it's
              <strong className="text-cream/80"> time-to-value compression on critical digital bets</strong>—which is where most of the multiple
              expansion will come from in modern life sciences.
            </p>
          </div>
        </div>
      </div>
    )
  }
]

export default function VIBECodingPage() {
  return (
    <PresentationLayout
      title="From Code to Agents: VIBE Coding in PE-backed Life Sciences"
      subtitle="Executive Briefing"
      slides={slides}
    />
  )
}

