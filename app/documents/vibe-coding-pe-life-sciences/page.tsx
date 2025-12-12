'use client'

import React, { useState } from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import { Code2, TrendingUp, Users, Target, Zap, Shield, BarChart3, Clock, CheckCircle2, Settings, Lock, Eye, Workflow, UserCog, Timer, GraduationCap } from 'lucide-react'

// Timeline data - updated with new content
const timelineData = [
  {
    id: 0,
    tool: 'GitHub Copilot',
    date: 'June 2021',
    source: 'GitHub/Microsoft',
    innovation: 'AI pair programmer with real-time code suggestions. Pioneered acceptance rate (30%) as value metric.',
    metrics: [
      '15-25% productivity uplift',
      '84% increase in successful builds',
      'Source: Accenture RCT Study'
    ],
    anecdote: 'Accenture study: 70% reduction in mental effort on repetitive tasks. 90% of developers reported feeling more fulfilled.'
  },
  {
    id: 1,
    tool: 'Cursor',
    date: 'April 2023',
    source: 'Anysphere',
    innovation: 'First AI-native IDE with deep codebase understanding. "Shadow Workspace" for testing changes in isolation.',
    metrics: [
      '$4M → $500M ARR in 18 months',
      '40% developer speed increase',
      'Source: Sacra, DevGraphiQ'
    ],
    anecdote: 'Fastest SaaS to $100M ARR (12 months). One team: 50% reduction in style-related PR comments after enforcing Cursor rules.'
  },
  {
    id: 2,
    tool: 'Cursor 2.0 + Composer',
    date: 'October 2025',
    source: 'Anysphere',
    innovation: 'Multi-agent interface (8 parallel agents). Custom Composer model optimized for speed. Plan Mode with background execution.',
    metrics: [
      '4× faster than comparable models',
      '<30 sec typical task completion',
      'Source: Cursor Blog'
    ],
    anecdote: 'Can run 8 agents simultaneously on different parts of codebase. Developers report "instant" feel for mid-sized refactors.'
  },
  {
    id: 3,
    tool: 'Claude Code',
    date: 'September 2024',
    source: 'Anthropic',
    innovation: 'Extended autonomous sessions (7+ hours). Agentic search understanding entire codebases without manual context selection.',
    metrics: [
      '10× productivity gains reported',
      '2-3 weeks → 1 day task compression',
      'Source: Treasure Data Case'
    ],
    anecdote: 'Treasure Data engineer built MCP server in 1 day (normally 2-3 weeks). Entrepreneur built 50+ React components during 6-hour flight—18 dev-days of work.'
  },
  {
    id: 4,
    tool: 'Claude Opus 4.5',
    date: 'November 2025',
    source: 'Anthropic',
    innovation: 'Best-in-class reasoning and agentic capability. Self-improving agents that refine autonomously. Effort parameter for token optimization.',
    metrics: [
      '50-65% fewer tokens vs Sonnet 4.5',
      '15% improvement on Terminal Bench',
      'Source: Anthropic Release Notes'
    ],
    anecdote: 'Scored higher than any human candidate on Anthropic\'s 2-hour performance engineering test. Self-improving agents reached peak performance in 4 iterations (other models couldn\'t match after 10).'
  }
]

const stanceData = [
  {
    level: 1,
    title: 'Optional/Voluntary',
    badge: '10-30% Adoption',
    description: 'Tools are available if compliant and interested',
    whenToUse: 'Extremely early-stage exploration with minimal conviction.',
    risk: 'Those who need it most resist it most. Difficult to measure ROI or justify continued investment.',
    outcome: 'Often fizzles without creating competitive advantage.'
  },
  {
    level: 2,
    title: 'Structured Pilot',
    badge: '40-60% Adoption',
    description: 'Let\'s test systematically, then decide based on data',
    whenToUse: 'Board wants proof before broader rollout. Select 1-2 teams, run 8-12 week pilot with clear success metrics.',
    risk: 'Momentum loss during review period. Pilot teams may not represent broader organization.',
    outcome: 'Best for: Conservative boards or companies with compliance-heavy environments.'
  },
  {
    level: 3,
    title: 'Incremental Rollout (Recommended)',
    badge: '60-80% Adoption',
    description: 'These are inevitable. Roll out incrementally without discontinuity',
    whenToUse: 'High conviction on value. Start with early adopters, expand continuously based on capability. Assumes long-term commitment from day one.',
    risk: 'Moderate investment, high ROI.',
    outcome: '60-80% adoption in 6 months. Organic champion network. Sweet spot for most portfolio companies—balances speed with learning.'
  },
  {
    level: 4,
    title: 'Aggressive Top-Down',
    badge: '80-95% Adoption',
    description: 'Mandatory adoption. AI proficiency tied to performance reviews',
    whenToUse: 'Existential competitive threat or post-acquisition integration. Fastest time to organizational impact.',
    risk: 'Initial resistance and friction.',
    outcome: 'Requires: Strong executive sponsor, significant change management support. Example: NBIM (Norway\'s $1.8T fund) made AI proficiency mandatory—saved 213,000 hours annually, equivalent of 100+ FTEs.'
  }
]

// Adoption Stances Detailed Component
function AdoptionStancesDetailedSlide() {
  const stances = [
    {
      level: 1,
      title: 'Passive / Opt-In',
      subtitle: '"Use it if you want"',
      characteristics: [
        'Zero mandate',
        'Usage limited to motivated developers'
      ],
      messaging: '"Experiment safely; we support learning."',
      changeMgmt: 'Light governance; no workflow change',
      risks: 'Uneven adoption → uneven productivity → fragmentation. Hard to measure ROI.'
    },
    {
      level: 2,
      title: 'Structured Pilot',
      subtitle: '"Let\'s test viability"',
      characteristics: [
        'Focused teams, defined KPIs',
        '6–12 week evaluation',
        'Onboarding and safety rails in place'
      ],
      messaging: '"We\'re testing value creation."',
      implications: [
        'Clear KPIs: cycle time, defect rate, PR throughput, onboarding speed',
        'Requires training and usage discipline'
      ],
      risks: null
    },
    {
      level: 3,
      title: 'Inevitable & Incremental Rollout',
      subtitle: '"We are adopting; pace TBD"',
      characteristics: [
        'Assumes VIBE Coding is the future',
        'Scaling plan across teams with continuous expansion'
      ],
      messaging: '"This is the new standard; we will support your transition."',
      implications: [
        'Multi-quarter roadmap',
        'Skills transition plans',
        'Platform engineering involvement'
      ],
      risks: null
    },
    {
      level: 4,
      title: 'Top-Down Mandate',
      subtitle: '"Everyone uses this now"',
      characteristics: [
        'Leadership-declared transformation',
        'Agents integrated into all workflows',
        'Large organizational shift'
      ],
      messaging: '"This is essential to remain competitive."',
      implications: [
        'Strong training, onboarding, governance',
        'Resistance management + cultural shift',
        'Immediate ROI but high initial disruption'
      ],
      caseStudy: 'Market Case Study: Sovereign Bank of Norway (Norges Bank) - Rolled out top-down. Reported dramatic engineering productivity improvements. Framing: "Strategic necessity," not experiment.',
      risks: null
    }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Adoption Stances: Detailed Framework</h2>

      <div className="space-y-4">
        {stances.map((stance, index) => (
          <div
            key={index}
            className="p-5 rounded-xl border border-cream/20 bg-cream/5"
          >
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-cream">Stance {stance.level} — {stance.title} ({stance.subtitle})</h3>
            </div>
            
            <div className="space-y-3 text-xs text-cream/70">
              <div>
                <strong className="text-cream">Characteristics:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  {stance.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sage mt-1">•</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <strong className="text-cream">Messaging:</strong> {stance.messaging}
              </div>
              
              {stance.changeMgmt && (
                <div>
                  <strong className="text-cream">Change-Mgmt Needs:</strong> {stance.changeMgmt}
                </div>
              )}
              
              {stance.implications && (
                <div>
                  <strong className="text-cream">Implications:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    {stance.implications.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sage mt-1">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {stance.risks && (
                <div>
                  <strong className="text-cream">Risks:</strong> {stance.risks}
                </div>
              )}
              
              {stance.caseStudy && (
                <div className="p-3 rounded-lg border-l-4 border-purple-500 bg-purple-500/10 mt-2">
                  <strong className="text-purple-300">{stance.caseStudy}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
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
          <span className="text-xs uppercase tracking-wider text-cream/60">For Private Equity Investors</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          The Evolution of VIBE Coding in Enterprise
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-8 max-w-2xl">
          A Strategic Framework for Accelerating Product Development in Portfolio Companies
        </p>
        
        {/* PE Insight Box */}
        <div className="w-full max-w-4xl p-6 rounded-xl border-l-4 border-purple-500 bg-purple-500/10 mb-8 text-left">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Why This Matters</div>
          <p className="text-sm text-cream/80 leading-relaxed">
            In life sciences companies, where product development cycles are long and regulatory timelines are fixed, 
            software velocity has become a critical differentiator. This presentation examines how agentic coding tools 
            are fundamentally changing the economics of software development—and why treating this as a growth acceleration 
            play rather than cost reduction unlocks significantly more value.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">84%</div>
            <div className="text-xs text-cream/60 mb-2">Developer Adoption 2025</div>
            <div className="text-xs text-cream/50">Up from 76% in 2024</div>
            <div className="text-[10px] text-cream/40 mt-2">Stack Overflow Survey 2025</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">78%</div>
            <div className="text-xs text-cream/60 mb-2">Market Penetration</div>
            <div className="text-xs text-cream/50">Of teams integrated AI-assisted coding</div>
            <div className="text-[10px] text-cream/40 mt-2">GitLab Research 2024</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">$500M</div>
            <div className="text-xs text-cream/60 mb-2">Fastest SaaS Growth</div>
            <div className="text-xs text-cream/50">Cursor ARR in 18 months</div>
            <div className="text-[10px] text-cream/40 mt-2">Sacra Analysis 2025</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'definition',
    title: 'Definition',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">What is VIBE Coding?</h2>
        
        <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
          VIBE Coding (Vision-Intent-Based Engineering) represents a shift where developers describe desired outcomes 
          in natural language, and AI systems generate functional code. Unlike traditional pair programming, VIBE coding 
          emphasizes intuitive, human-in-the-loop interaction through conversational workflows that support rapid iteration 
          and creative exploration.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-cream mb-4">The Spectrum of AI Coding Assistance</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
              <h4 className="text-sm font-semibold text-cream mb-3">VIBE Coding</h4>
              <ul className="space-y-2 text-sm text-cream/70">
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Prompt-based, human-guided</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Rapid prototyping focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Developer maintains full control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Best for exploration & MVPs</span>
                </li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
              <h4 className="text-sm font-semibold text-cream mb-3">Agentic Coding</h4>
              <ul className="space-y-2 text-sm text-cream/70">
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Goal-driven autonomous agents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Multi-step execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Minimal human intervention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span>Excels at complex refactors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PE Insight Box */}
        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">PE Implications</div>
          <p className="text-sm text-cream/80">
            This isn't just faster coding—it's a fundamental shift in software economics. Portfolio companies can now 
            build features that were previously economically unviable, compress 12-month roadmaps into 6 months, and 
            reach revenue milestones with dramatically less capital burn.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'timeline',
    title: 'Tool Evolution',
    content: <TimelineSlide />
  },
  {
    id: 'enterprise',
    title: 'Enterprise Adoption',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">Critical Integration Points</h2>
        <p className="text-cream/60 mb-8 max-w-3xl">
          While these tools appear simple ('just pick up the tool'), successful enterprise deployment requires addressing four critical integration points:
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Settings className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Infrastructure Layer</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>IDE/CLI/Web integration points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Codebase access & semantic search</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>CI/CD pipeline integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Compute resources (cloud vs on-prem)</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Security & Governance</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Code privacy & data residency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Access controls by role/team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Audit logging of AI-generated code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Sandboxed execution environments</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Observability</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Adoption metrics & usage analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Cost tracking (tokens, API calls)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Quality metrics (bug rates, test coverage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Performance monitoring (latency, errors)</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Workflow className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Workflow Integration</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Code review processes for AI output</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Testing strategy (unit, integration, E2E)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Documentation & knowledge management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Deployment pipelines & rollback</span>
              </li>
            </ul>
          </div>
        </div>

        {/* PE Insight Box */}
        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">PE Due Diligence Checkpoint</div>
          <p className="text-sm text-cream/80">
            Assess portfolio companies on these four dimensions. Companies that address governance and observability early 
            scale adoption faster and show measurable ROI within 90 days. Those that don't often stall at 20-30% adoption 
            with unclear value capture.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'stances-detailed',
    title: 'Adoption Stances Detailed',
    content: <AdoptionStancesDetailedSlide />
  },
  {
    id: 'stances',
    title: 'Change Management',
    content: <AdoptionStanceSlide />
  },
  {
    id: 'kpis',
    title: 'KPIs & Targets',
    content: <KPIsSlide />
  },
  {
    id: 'nbim',
    title: 'NBIM Case Study',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">NBIM: Top-Down Mandate at Scale</h2>

        {/* 3 Metric Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">213K</div>
            <div className="text-xs text-cream/60 mb-2">Hours Saved Annually</div>
            <div className="text-xs text-cream/50">Equivalent of 100+ FTE employees</div>
            <div className="text-[10px] text-cream/40 mt-2">NBIM Reports, Smith Stephen Analysis</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">$1.8T</div>
            <div className="text-xs text-cream/60 mb-2">Assets Under Management</div>
            <div className="text-xs text-cream/50">Managed by only 670 employees</div>
            <div className="text-[10px] text-cream/40 mt-2">Norges Bank Investment Management</div>
          </div>
          <div className="p-5 rounded-xl border border-sage/30 bg-sage/10">
            <div className="text-3xl font-serif text-sage mb-1">50%</div>
            <div className="text-xs text-cream/60 mb-2">Competitive Advantage</div>
            <div className="text-xs text-cream/50">"50% ahead of non-AI competitors"</div>
            <div className="text-[10px] text-cream/40 mt-2">CEO Nicolai Tangen, Semafor</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-cream mb-4">The Approach</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
              <h4 className="text-sm font-semibold text-cream mb-3">Leadership Strategy</h4>
              <ul className="space-y-2 text-sm text-cream/70">
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span><strong>Mandatory Adoption:</strong> AI proficiency required for promotion and hiring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span><strong>CEO Championship:</strong> Tangen personally drove adoption ("running around like a maniac")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span><strong>Cultural Shift:</strong> From voluntary to mandatory competency</span>
                </li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
              <h4 className="text-sm font-semibold text-cream mb-3">Governance Framework</h4>
              <ul className="space-y-2 text-sm text-cream/70">
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span><strong>Human-in-Loop:</strong> All AI outputs require human review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span><strong>Clear Boundaries:</strong> Personal/trading data excluded</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage mt-1">•</span>
                  <span><strong>Trust Building:</strong> Guardrails gave skeptics confidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Anecdote Box */}
        <div className="p-5 rounded-xl border border-amber-500/50 bg-amber-500/10 mb-6">
          <div className="text-xs uppercase tracking-wider text-amber-300 mb-2">Results</div>
          <p className="text-sm text-cream/80">
            Multilingual reports (16 languages) that took days now complete in minutes. NBIM scaled back hiring plans 
            while managing increasing AUM. CEO's view: "Companies not using AI will never catch up."
          </p>
        </div>

        {/* PE Insight Box */}
        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">PE Takeaway</div>
          <p className="text-sm text-cream/80">
            NBIM's success wasn't about unlimited resources or proprietary technology. It was about treating AI adoption 
            as a change management challenge, not just a technology problem. The lesson: executive sponsorship and mandatory 
            adoption (with governance) drives faster results than voluntary approaches.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'value',
    title: 'Value Creation',
    content: <ValueCreationSlide />
  },
  {
    id: 'impact',
    title: 'Organizational Impact',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Talent & Operating Model Implications</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <UserCog className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Role Evolution</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>From Typing to Orchestration:</strong> Developers manage AI agents, not write every line</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Skill Shift:</strong> Prompting, context management, review &gt; syntax memorization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Higher-Level Focus:</strong> Architecture, system design, business logic</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Timer className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">24-Hour Dev Cycle</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Always-On Agents:</strong> Development continues while humans sleep</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Background Execution:</strong> Long-running refactors in parallel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Global Velocity:</strong> Work never stops across time zones</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">New Metrics</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Beyond LOC:</strong> Feature velocity, test coverage, time to market</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Agent Efficiency:</strong> Acceptance rates, iteration counts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Business Value:</strong> Revenue impact, competitive positioning</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Hiring Shifts</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Hire for Judgment:</strong> System thinking &gt; coding speed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>AI Fluency:</strong> Prompt engineering becomes core skill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span><strong>Junior Acceleration:</strong> New grads productive faster with AI assist</span>
              </li>
            </ul>
          </div>
        </div>

        {/* PE Insight Box */}
        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Portfolio Company Action Items</div>
          <ul className="space-y-2 text-sm text-cream/80">
            <li className="flex items-start gap-2">
              <span className="text-purple-300 mt-1">•</span>
              <span><strong>Assess Current State:</strong> What % of dev team uses AI tools? What's blocking higher adoption?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 mt-1">•</span>
              <span><strong>Set Stance:</strong> Choose adoption approach based on competitive urgency and organizational readiness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 mt-1">•</span>
              <span><strong>Implement Observability:</strong> Track adoption, cost, quality metrics from day one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 mt-1">•</span>
              <span><strong>Invest in Training:</strong> Prompt engineering, agent management, code review of AI output</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 mt-1">•</span>
              <span><strong>Communicate Value:</strong> Frame as growth acceleration, not headcount reduction</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'sources',
    title: 'Sources & Citations',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">References</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-8">Sources & Citations</h2>

        <div className="space-y-6 text-sm text-cream/70 max-w-4xl">
          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Industry Research & Reports</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>
                <a href="https://survey.stackoverflow.co/2025" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Stack Overflow Developer Survey 2025 - AI adoption statistics
                </a>
              </li>
              <li>
                <a href="https://about.gitlab.com/blog/2024/01/16/ai-assisted-coding-tools-research/" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  GitLab Research (2024) - "78% of teams have integrated AI-assisted coding tools"
                </a>
              </li>
              <li>
                <a href="https://github.blog/2024-03-06-measuring-github-copilots-impact-on-productivity/" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  GitHub Research - "Measuring GitHub Copilot's Impact on Productivity" (Communications of the ACM, March 2024)
                </a>
              </li>
              <li>
                <a href="https://www.accenture.com/us-en/insights/technology/github-copilot-productivity-study" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Accenture Randomized Controlled Trial - GitHub Copilot productivity metrics (8.69% increase in PRs, 84% increase in successful builds)
                </a>
              </li>
              <li>
                <a href="https://www.opsera.io/blog/github-copilot-adoption-trends" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Opsera Research - "GitHub Copilot Adoption Trends: Insights from Real Data" (time to PR: 9.6 to 2.4 days)
                </a>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Vendor Data & Benchmarks</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4" start={6}>
              <li>
                <a href="https://sacra.com/research/cursor-100m-arr" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Sacra Analysis - "Cursor at $100M ARR" and "$500M ARR" growth trajectory reports
                </a>
              </li>
              <li>
                <a href="https://cursor.sh/blog/cursor-2" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Cursor Official Blog - "Introducing Cursor 2.0 and Composer" (October 2025)
                </a>
              </li>
              <li>
                <a href="https://cursor.sh/blog/composer-fast-model" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Cursor Official Blog - "Composer: Building a fast frontier model with RL"
                </a>
              </li>
              <li>
                <a href="https://www.anthropic.com/news/claude-opus-4-5" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Anthropic - "Introducing Claude Opus 4.5" (November 2025)
                </a>
              </li>
              <li>
                <a href="https://docs.anthropic.com/claude/docs/agents" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Anthropic - "Building agents with the Claude Agent SDK"
                </a>
              </li>
              <li>
                <a href="https://www.anthropic.com/news/scaling-agentic-coding" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Anthropic - "How to scale agentic coding across your engineering organization"
                </a>
              </li>
              <li>
                <a href="https://devgraphiq.com/cursor-statistics-2025" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  DevGraphiQ - "Cursor Statistics 2025: The Complete Data Analysis Report"
                </a>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Case Studies</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4" start={13}>
              <li>
                <a href="https://www.treasuredata.com/blog/claude-code-productivity" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Treasure Data - "How Our Engineering Team Embraced AI and Claude Code for 10x Productivity"
                </a>
              </li>
              <li>
                <a href="https://smithstephen.com/nbim-ai-case-study" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Norges Bank Investment Management (NBIM) - Smith Stephen Analysis: "How Norway's $1.8 Trillion Fund Saved 213,000 Hours with AI"
                </a>
              </li>
              <li>
                <a href="https://venturebeat.com/ai/vibe-coding-agentic-swarm-coding" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  VentureBeat - "Vibe coding is dead: Agentic swarm coding is the new enterprise moat" (Mark Ruddock case)
                </a>
              </li>
              <li>
                <a href="https://blockhead.consulting/claude-code-400k-loc" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Blockhead Consulting - "How I Manage 400K Lines of Code with Claude Code: A Multi-Agent Development Workflow" (July 2025)
                </a>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Academic & Technical Papers</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4" start={17}>
              <li>
                <a href="https://arxiv.org/abs/2505.19443" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  arXiv 2505.19443 - "Vibe Coding vs. Agentic Coding: Fundamentals and Practical Implications of Agentic AI"
                </a>
              </li>
              <li>
                <a href="https://cacm.acm.org/magazines/2024/3/claude-agency" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Communications of the ACM - "Claude 4's Agency in Practice: Beyond Code Generation" (Jenil Shah)
                </a>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2501.13282" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Experience with GitHub Copilot for Developer Productivity at Zoominfo (arXiv 2501.13282v1)
                </a>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-cream mb-3">Additional Industry Sources</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4" start={20}>
              <li>
                <a href="https://www.secondtalent.com/github-copilot-statistics-2025" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Second Talent - "GitHub Copilot Statistics & Adoption Trends [2025]"
                </a>
              </li>
              <li>
                <a href="https://thenewstack.io/vibe-coding-agentic-ai" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  The New Stack - "Vibe Coding in a Post-IDE World: Why Agentic AI Is the Real Disruption"
                </a>
              </li>
              <li>
                <a href="https://www.datadoghq.com/blog/ai-agents-console" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  Datadog - "Monitor Claude Code adoption in your organization with Datadog's AI Agents Console"
                </a>
              </li>
              <li>
                <a href="https://www.ey.com/en_no/insights/banking/banks-ai-pilot-performance" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  EY Norway - "Eight ways banks can move AI from pilot to performance"
                </a>
              </li>
              <li>
                <a href="https://github.blog/github-copilot-lab-studies" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  GitHub Copilot Lab Studies - Developer productivity metrics showing 15-25% productivity uplift vs control
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/government/publications/ai-coding-assistants-trial-results" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  UK Government Trial - AI coding assistants trial results showing developers saving ~1 hour per day (~12–20% of coding time) and 72% seeing good org value
                </a>
              </li>
              <li>
                <a href="https://metr.org/ai-developer-productivity-study-2025" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream hover:underline transition-colors">
                  METR Study 2025 - Research on experienced developers using AI tools showing perception vs actual productivity metrics
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    )
  }
]

// Interactive Timeline Component
function TimelineSlide() {
  const [selectedId, setSelectedId] = useState(0)
  const selectedData = timelineData[selectedId]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">The Path from Autocomplete to Autonomous Development</h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
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

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sage/30 mb-6">
          {timelineData.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`flex-shrink-0 w-64 p-4 rounded-xl border transition-all ${
                selectedId === item.id
                  ? 'border-sage bg-sage/10 shadow-lg scale-105'
                  : 'border-cream/20 bg-cream/5 hover:border-cream/30'
              }`}
            >
              <div className="text-xs text-cream/50 mb-1">{item.tool}</div>
              <div className="text-xs text-cream/40 mb-2">{item.date}</div>
              <div className="text-sm font-semibold text-cream mb-2">{item.tool}</div>
              <div className="text-xs text-cream/60 mb-3">{item.innovation}</div>
              <div className="space-y-1 mb-2">
                {item.metrics.slice(0, 2).map((m, i) => (
                  <div key={i} className="text-xs text-sage">{m}</div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="text-xs text-cream/50 mb-2">Tool & Date</div>
          <div className="text-sm font-semibold text-cream mb-1">{selectedData.tool}</div>
          <div className="text-xs text-cream/60 mb-4">{selectedData.date} · {selectedData.source}</div>
          
          <div className="text-xs text-cream/50 mb-2">Key Innovation</div>
          <p className="text-sm text-cream/70 mb-4">{selectedData.innovation}</p>
          
          <div className="text-xs text-cream/50 mb-2">Productivity Metric</div>
          <ul className="space-y-1 mb-4">
            {selectedData.metrics.map((m, i) => (
              <li key={i} className="text-sm text-cream/70 flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <div className="text-xs text-cream/50 mb-2">Splashy Anecdote</div>
          <p className="text-sm text-cream/80">{selectedData.anecdote}</p>
        </div>
      </div>
    </div>
  )
}

// Adoption Stance Component
function AdoptionStanceSlide() {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Adoption Stances: A PE Framework</h2>

      <div className="space-y-4">
        {stanceData.map((stance, index) => (
          <div
            key={index}
            className="p-5 rounded-xl border border-cream/20 bg-cream/5"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-cream">Level {stance.level}: {stance.title}</h3>
                <p className="text-xs text-cream/60 mt-1">{stance.description}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-500/10">
              <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">PE Perspective</div>
              <div className="text-xs text-cream space-y-1 mb-2">
                <p><strong className="text-cream">When to use:</strong> <span className="text-cream">{stance.whenToUse}</span></p>
                <p><strong className="text-cream">Risk:</strong> <span className="text-cream">{stance.risk}</span></p>
                <p><strong className="text-cream">Outcome:</strong> <span className="text-cream">{stance.outcome}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// KPIs Slide Component
function KPIsSlide() {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">KPIs & Targets for VIBE Coding Adoption (Q4 2025 Benchmarks)</h2>

      <div className="space-y-4 mb-6">
        {/* Individual Productivity */}
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="flex items-start gap-3 mb-3">
            <Clock className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cream mb-2">1. Individual Productivity</h3>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Metric:</strong> Lead time per story / feature per dev; PR throughput per dev.</p>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Target (6–12 months):</strong></p>
              <ul className="text-xs text-cream/70 ml-4 mb-2 space-y-1">
                <li>• <strong className="text-cream">25–40% reduction</strong> in median lead time for AI-assisted work</li>
                <li>• <strong className="text-cream">30%+ increase</strong> in completed tickets / PRs per engineer (normalized)</li>
              </ul>
              <p className="text-xs text-cream/60 italic">Market anchor: GitHub Copilot lab studies show 15-25% productivity uplift vs control. UK gov trial saw developers save about 1 hour per day (~12–20% of coding time).</p>
            </div>
          </div>
        </div>

        {/* Tool Use */}
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="flex items-start gap-3 mb-3">
            <Zap className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cream mb-2">2. Tool Use</h3>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Metric:</strong> Adoption & intensity of VIBE tool usage.</p>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Target:</strong></p>
              <ul className="text-xs text-cream/70 ml-4 mb-2 space-y-1">
                <li>• <strong className="text-cream">100%</strong> of eligible devs using tools daily</li>
              </ul>
              <p className="text-xs text-cream/60 italic">Market anchor: In the UK gov trial, 72% of developers saw good org value; the majority preferred not to go back to pre-AI workflows.</p>
            </div>
          </div>
        </div>

        {/* Agents Managed */}
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="flex items-start gap-3 mb-3">
            <Users className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cream mb-2">3. Agents Managed</h3>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Metric:</strong> Human–agent leverage and automation.</p>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Target:</strong></p>
              <ul className="text-xs text-cream/70 ml-4 mb-2 space-y-1">
                <li>• Track and start at <strong className="text-cream">&gt;1</strong> active agent workflow per squad</li>
              </ul>
              <p className="text-xs text-cream/60 italic">Market anchor: Enterprise case studies and Cursor / Claude-code anecdotes report agents routinely handling multi-file refactors and feature scaffolding, with teams describing "tasks that took days now completed in minutes."</p>
            </div>
          </div>
        </div>

        {/* Code Quality */}
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="flex items-start gap-3 mb-3">
            <Shield className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cream mb-2">4. Code Quality</h3>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Metric:</strong> Defects, reopens, and reliability of AI-assisted code.</p>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Target:</strong></p>
              <ul className="text-xs text-cream/70 ml-4 mb-2 space-y-1">
                <li>• Start at <strong className="text-cream">parity</strong> with non-AI code, then show <strong className="text-cream">continuous improvement</strong> over time</li>
              </ul>
              <p className="text-xs text-cream/60 italic">Market anchor: GitHub reports 85% of Copilot users feel more confident in code quality and more satisfied overall. UK gov trial used cautious acceptance (only ~15% of AI code accepted unchanged) but still saw net productivity and perceived quality gains.</p>
            </div>
          </div>
        </div>

        {/* Segmentation */}
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="flex items-start gap-3 mb-3">
            <BarChart3 className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cream mb-2">5. Segmentation: AI vs Non-AI Code</h3>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Metric:</strong> Share and performance of AI-assisted code.</p>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Target:</strong></p>
              <ul className="text-xs text-cream/70 ml-4 mb-2 space-y-1">
                <li>• Start at <strong className="text-cream">60%</strong> of new code being AI-assisted, then increase over time</li>
              </ul>
              <p className="text-xs text-cream/60 italic">Market anchor: UK gov trial showed most code still edited by humans (high review discipline), but meaningful time savings even with conservative acceptance.</p>
            </div>
          </div>
        </div>

        {/* Team Perception */}
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="flex items-start gap-3 mb-3">
            <Target className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cream mb-2">6. Team Perception & UX</h3>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Metric:</strong> Developer sentiment, cognitive load, UX friction.</p>
              <p className="text-xs text-cream/70 mb-2"><strong className="text-cream">Target:</strong></p>
              <ul className="text-xs text-cream/70 ml-4 mb-2 space-y-1">
                <li>• <strong className="text-cream">90%</strong> of devs reporting positive perception (won't get met, but serves as conversation starter to inform how to make the toolset better)</li>
              </ul>
              <p className="text-xs text-cream/60 italic">Market anchor (two-sided story): GitHub's research: strong perceived gains; most devs report feeling more productive and happier with their workflow. 2025 METR study: experienced devs using AI tools were actually ~19% slower, though they believed they were ~20% more productive—underscoring the need to triangulate perception with hard metrics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Value Creation Component
function ValueCreationSlide() {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Beyond Cost Reduction: The Growth Acceleration Play</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 rounded-xl border-2 border-red-500/50 bg-red-500/10">
          <h3 className="text-lg font-semibold text-red-300 mb-4">❌ The Cost Reduction Trap</h3>
          <div className="space-y-3 mb-4">
            <p className="text-sm text-cream/80"><strong>Questions Asked:</strong></p>
            <ul className="space-y-1 text-sm text-cream/70 ml-4">
              <li>• "How many developers can we avoid hiring?"</li>
              <li>• "Can we reduce engineering headcount?"</li>
              <li>• "What's the cost per seat we're saving?"</li>
            </ul>
            <p className="text-sm text-cream/80 mt-4"><strong>Why This Fails:</strong></p>
            <ul className="space-y-1 text-sm text-cream/70 ml-4">
              <li>• Growth companies depend on technology buildouts</li>
              <li>• Best engineers leave when growth slows</li>
              <li>• Misses compounding value of faster iteration</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <p className="text-xs text-cream/80"><strong>Outcome:</strong> Modest cost savings at the expense of market position and talent retention.</p>
          </div>
        </div>

        <div className="p-6 rounded-xl border-2 border-green-500/50 bg-green-500/10">
          <h3 className="text-lg font-semibold text-green-300 mb-4">✅ The Growth Acceleration Play</h3>
          <div className="space-y-3 mb-4">
            <p className="text-sm text-cream/80"><strong>Questions Asked:</strong></p>
            <ul className="space-y-1 text-sm text-cream/70 ml-4">
              <li>• "How fast can we hit product milestones?"</li>
              <li>• "Can we compress 12 months into 6?"</li>
              <li>• "What features become economically viable?"</li>
              <li>• "How do we accelerate time-to-market?"</li>
            </ul>
            <p className="text-sm text-cream/80 mt-4"><strong>Why This Works:</strong></p>
            <ul className="space-y-1 text-sm text-cream/70 ml-4">
              <li>• Higher quality code with fewer bugs</li>
              <li>• 40-55% faster development timelines</li>
              <li>• Enable previously impossible builds</li>
              <li>• Reach revenue targets ahead of schedule</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
            <p className="text-xs text-cream/80"><strong>Outcome:</strong> Accelerated revenue growth, faster market capture, competitive moats through product velocity.</p>
          </div>
        </div>
      </div>

      {/* PE Insight Box */}
      <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
        <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">The PE Value Creation Equation</div>
        <p className="text-sm text-cream/80">
          In portfolio companies, where product cycles are long and regulatory timelines are fixed, software velocity becomes 
          a critical differentiator. Companies that build and iterate faster gain months of advantage in bringing products to market. 
          The question isn't "How many developers can we save?" but "How much faster can we reach $100M ARR?"
        </p>
      </div>
    </div>
  )
}

export default function VIBECodingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'TweedCollectiveDocuments') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-cream/20 bg-cream/5">
          <h2 className="text-2xl font-serif text-cream mb-2">Password Required</h2>
          <p className="text-sm text-cream/70 mb-6">This document is password protected. Please enter the password to continue.</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg border border-cream/20 bg-cream/10 text-cream placeholder-cream/40 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 mb-4"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-400 mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-sage text-cream font-semibold hover:bg-sage/90 transition-colors"
            >
              Access Document
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <PresentationLayout
      title="The Evolution of VIBE Coding in Enterprise"
      subtitle="A Strategic Framework for Accelerating Product Development in Portfolio Companies"
      slides={slides}
    />
  )
}
