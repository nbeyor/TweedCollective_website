/**
 * VIBE Coding in Enterprise - Document Content
 * 
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'vibe-coding-in-enterprise-for-pe'

// ============================================
// Slide Content Data
// ============================================

export const slides: SlideData[] = [
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'For Private Equity Investors',
      headline: 'The Evolution of VIBE Coding in Enterprise',
      subtitle: 'A Strategic Framework for Accelerating Product Development in Portfolio Companies',
      insightBox: {
        label: 'Why This Matters',
        text: 'In enterprise companies, where product development cycles are long and timelines are fixed, software velocity has become a critical differentiator. This presentation examines how agentic coding tools are fundamentally changing the economics of software development—and why treating this as a growth acceleration play rather than cost reduction unlocks significantly more value.',
      },
      metrics: [
        { value: '84%', label: 'Developer Adoption 2025', sublabel: 'Up from 76% in 2024', source: 'Stack Overflow Survey 2025' },
        { value: '78%', label: 'Market Penetration', sublabel: 'Of teams integrated AI-assisted coding', source: 'GitLab Research 2024' },
        { value: '$500M', label: 'Fastest SaaS Growth', sublabel: 'Cursor ARR in 18 months', source: 'Sacra Analysis 2025' },
      ],
    },
  },
  {
    id: 'definition',
    title: 'Definition',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'What is VIBE Coding?',
      description: 'VIBE Coding (Vision-Intent-Based Engineering) represents a shift where developers describe desired outcomes in natural language, and AI systems generate functional code. Unlike traditional pair programming, VIBE coding emphasizes intuitive, human-in-the-loop interaction through conversational workflows that support rapid iteration and creative exploration.',
      columns: 2,
      items: [
        {
          title: 'VIBE Coding',
          icon: 'Code2',
          items: [
            'Prompt-based, human-guided',
            'Rapid prototyping focus',
            'Developer maintains full control',
            'Best for exploration & MVPs',
          ],
        },
        {
          title: 'Agentic Coding',
          icon: 'Zap',
          items: [
            'Goal-driven autonomous agents',
            'Multi-step execution',
            'Minimal human intervention',
            'Excels at complex refactors',
          ],
        },
      ],
      insightBox: {
        label: 'PE Implications',
        text: "This isn't just faster coding—it's a fundamental shift in software economics. Portfolio companies can now build features that were previously economically unviable, compress 12-month roadmaps into 6 months, and reach revenue milestones with dramatically less capital burn.",
      },
    },
  },
  {
    id: 'timeline',
    title: 'Tool Evolution',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'TimelineSlide',
      props: {
        heading: 'The Path from Autocomplete to Autonomous Development',
        items: [
          {
            id: 0,
            label: 'GitHub Copilot',
            date: 'June 2021',
            source: 'GitHub/Microsoft',
            title: 'GitHub Copilot',
            description: 'AI pair programmer with real-time code suggestions. Pioneered acceptance rate (30%) as value metric.',
            metrics: ['15-25% productivity uplift', '84% increase in successful builds', 'Source: Accenture RCT Study'],
            anecdote: 'Accenture study: 70% reduction in mental effort on repetitive tasks. 90% of developers reported feeling more fulfilled.',
          },
          {
            id: 1,
            label: 'Cursor',
            date: 'April 2023',
            source: 'Anysphere',
            title: 'Cursor',
            description: 'First AI-native IDE with deep codebase understanding. "Shadow Workspace" for testing changes in isolation.',
            metrics: ['$4M → $500M ARR in 18 months', '40% developer speed increase', 'Source: Sacra, DevGraphiQ'],
            anecdote: 'Fastest SaaS to $100M ARR (12 months). One team: 50% reduction in style-related PR comments after enforcing Cursor rules.',
          },
          {
            id: 2,
            label: 'Cursor 2.0 + Composer',
            date: 'October 2025',
            source: 'Anysphere',
            title: 'Cursor 2.0 + Composer',
            description: 'Multi-agent interface (8 parallel agents). Custom Composer model optimized for speed. Plan Mode with background execution.',
            metrics: ['4× faster than comparable models', '<30 sec typical task completion', 'Source: Cursor Blog'],
            anecdote: 'Can run 8 agents simultaneously on different parts of codebase. Developers report "instant" feel for mid-sized refactors.',
          },
          {
            id: 3,
            label: 'Claude Code',
            date: 'September 2024',
            source: 'Anthropic',
            title: 'Claude Code',
            description: 'Extended autonomous sessions (7+ hours). Agentic search understanding entire codebases without manual context selection.',
            metrics: ['10× productivity gains reported', '2-3 weeks → 1 day task compression', 'Source: Treasure Data Case'],
            anecdote: 'Treasure Data engineer built MCP server in 1 day (normally 2-3 weeks). Entrepreneur built 50+ React components during 6-hour flight—18 dev-days of work.',
          },
          {
            id: 4,
            label: 'Claude Opus 4.5',
            date: 'November 2025',
            source: 'Anthropic',
            title: 'Claude Opus 4.5',
            description: 'Best-in-class reasoning and agentic capability. Self-improving agents that refine autonomously. Effort parameter for token optimization.',
            metrics: ['50-65% fewer tokens vs Sonnet 4.5', '15% improvement on Terminal Bench', 'Source: Anthropic Release Notes'],
            anecdote: "Scored higher than any human candidate on Anthropic's 2-hour performance engineering test. Self-improving agents reached peak performance in 4 iterations (other models couldn't match after 10).",
          },
        ],
      },
    },
  },
  {
    id: 'enterprise',
    title: 'Enterprise Adoption',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'Critical Integration Points',
      description: "While these tools appear simple ('just pick up the tool'), successful enterprise deployment requires addressing four critical integration points:",
      columns: 2,
      items: [
        {
          title: 'Infrastructure Layer',
          icon: 'Settings',
          color: 'purple',
          items: [
            'IDE/CLI/Web integration points',
            'Codebase access & semantic search',
            'CI/CD pipeline integration',
            'Compute resources (cloud vs on-prem)',
          ],
        },
        {
          title: 'Security & Governance',
          icon: 'Lock',
          color: 'purple',
          items: [
            'Code privacy & data residency',
            'Access controls by role/team',
            'Audit logging of AI-generated code',
            'Sandboxed execution environments',
          ],
        },
        {
          title: 'Observability',
          icon: 'Eye',
          color: 'green',
          items: [
            'Adoption metrics & usage analytics',
            'Cost tracking (tokens, API calls)',
            'Quality metrics (bug rates, test coverage)',
            'Performance monitoring (latency, errors)',
          ],
        },
        {
          title: 'Workflow Integration',
          icon: 'Workflow',
          color: 'green',
          items: [
            'Code review processes for AI output',
            'Testing strategy (unit, integration, E2E)',
            'Documentation & knowledge management',
            'Deployment pipelines & rollback',
          ],
        },
      ],
      insightBox: {
        label: 'PE Due Diligence Checkpoint',
        text: "Assess portfolio companies on these four dimensions. Companies that address governance and observability early scale adoption faster and show measurable ROI within 90 days. Those that don't often stall at 20-30% adoption with unclear value capture.",
      },
    },
  },
  {
    id: 'stances-detailed',
    title: 'Adoption Stances Detailed',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'AdoptionStancesDetailedSlide',
      props: {
        heading: 'Adoption Stances: Detailed Framework',
        stances: [
          {
            level: 1,
            title: 'Passive / Opt-In',
            subtitle: '"Use it if you want"',
            characteristics: ['Zero mandate', 'Usage limited to motivated developers'],
            messaging: '"Experiment safely; we support learning."',
            changeMgmt: 'Light governance; no workflow change',
            risks: 'Uneven adoption → uneven productivity → fragmentation. Hard to measure ROI.',
          },
          {
            level: 2,
            title: 'Structured Pilot',
            subtitle: '"Let\'s test viability"',
            characteristics: ['Focused teams, defined KPIs', '6–12 week evaluation', 'Onboarding and safety rails in place'],
            messaging: '"We\'re testing value creation."',
            implications: ['Clear KPIs: cycle time, defect rate, PR throughput, onboarding speed', 'Requires training and usage discipline'],
          },
          {
            level: 3,
            title: 'Inevitable & Incremental Rollout',
            subtitle: '"We are adopting; pace TBD"',
            characteristics: ['Assumes VIBE Coding is the future', 'Scaling plan across teams with continuous expansion'],
            messaging: '"This is the new standard; we will support your transition."',
            implications: ['Multi-quarter roadmap', 'Skills transition plans', 'Platform engineering involvement'],
          },
          {
            level: 4,
            title: 'Top-Down Mandate',
            subtitle: '"Everyone uses this now"',
            characteristics: ['Leadership-declared transformation', 'Agents integrated into all workflows', 'Large organizational shift'],
            messaging: '"This is essential to remain competitive."',
            implications: ['Strong training, onboarding, governance', 'Resistance management + cultural shift', 'Immediate ROI but high initial disruption'],
            caseStudy: 'Market Case Study: Sovereign Bank of Norway (Norges Bank) - Rolled out top-down. Reported dramatic engineering productivity improvements. Framing: "Strategic necessity," not experiment.',
          },
        ],
      },
    },
  },
  {
    id: 'stances',
    title: 'Change Management',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'Adoption Stances: A PE Framework',
      levels: [
        {
          level: 1,
          title: 'Optional/Voluntary',
          badge: '10-30% Adoption',
          description: 'Tools are available if compliant and interested',
          details: {
            whenToUse: 'Extremely early-stage exploration with minimal conviction.',
            risk: 'Those who need it most resist it most. Difficult to measure ROI or justify continued investment.',
            outcome: 'Often fizzles without creating competitive advantage.',
          },
        },
        {
          level: 2,
          title: 'Structured Pilot',
          badge: '40-60% Adoption',
          description: "Let's test systematically, then decide based on data",
          details: {
            whenToUse: 'Board wants proof before broader rollout. Select 1-2 teams, run 8-12 week pilot with clear success metrics.',
            risk: 'Momentum loss during review period. Pilot teams may not represent broader organization.',
            outcome: 'Best for: Conservative boards or companies with compliance-heavy environments.',
          },
        },
        {
          level: 3,
          title: 'Incremental Rollout (Recommended)',
          badge: '60-80% Adoption',
          description: 'These are inevitable. Roll out incrementally without discontinuity',
          details: {
            whenToUse: 'High conviction on value. Start with early adopters, expand continuously based on capability. Assumes long-term commitment from day one.',
            risk: 'Moderate investment, high ROI.',
            outcome: "60-80% adoption in 6 months. Organic champion network. Sweet spot for most portfolio companies—balances speed with learning.",
          },
        },
        {
          level: 4,
          title: 'Aggressive Top-Down',
          badge: '80-95% Adoption',
          description: 'Mandatory adoption. AI proficiency tied to performance reviews',
          details: {
            whenToUse: 'Existential competitive threat or post-acquisition integration. Fastest time to organizational impact.',
            risk: 'Initial resistance and friction.',
            outcome: "Requires: Strong executive sponsor, significant change management support. Example: NBIM (Norway's $1.8T fund) made AI proficiency mandatory—saved 213,000 hours annually, equivalent of 100+ FTEs.",
          },
        },
      ],
    },
  },
  {
    id: 'kpis',
    title: 'KPIs & Targets',
    type: 'metrics',
    content: {
      type: 'metrics',
      heading: 'KPIs & Targets for VIBE Coding Adoption (Q4 2025 Benchmarks)',
      kpis: [
        {
          icon: 'Clock',
          title: '1. Individual Productivity',
          metric: 'Lead time per story / feature per dev; PR throughput per dev.',
          target: ['25–40% reduction in median lead time for AI-assisted work', '30%+ increase in completed tickets / PRs per engineer (normalized)'],
          marketAnchor: 'Market anchor: GitHub Copilot lab studies show 15-25% productivity uplift vs control. UK gov trial saw developers save about 1 hour per day (~12–20% of coding time).',
        },
        {
          icon: 'Zap',
          title: '2. Tool Use',
          metric: 'Adoption & intensity of VIBE tool usage.',
          target: ['100% of eligible devs using tools daily'],
          marketAnchor: 'Market anchor: In the UK gov trial, 72% of developers saw good org value; the majority preferred not to go back to pre-AI workflows.',
        },
        {
          icon: 'Users',
          title: '3. Agents Managed',
          metric: 'Human–agent leverage and automation.',
          target: ['Track and start at >1 active agent workflow per squad'],
          marketAnchor: 'Market anchor: Enterprise case studies and Cursor / Claude-code anecdotes report agents routinely handling multi-file refactors and feature scaffolding, with teams describing "tasks that took days now completed in minutes."',
        },
        {
          icon: 'Shield',
          title: '4. Code Quality',
          metric: 'Defects, reopens, and reliability of AI-assisted code.',
          target: ['Start at parity with non-AI code, then show continuous improvement over time'],
          marketAnchor: 'Market anchor: GitHub reports 85% of Copilot users feel more confident in code quality and more satisfied overall. UK gov trial used cautious acceptance (only ~15% of AI code accepted unchanged) but still saw net productivity and perceived quality gains.',
        },
        {
          icon: 'BarChart3',
          title: '5. Segmentation: AI vs Non-AI Code',
          metric: 'Share and performance of AI-assisted code.',
          target: ['Start at 60% of new code being AI-assisted, then increase over time'],
          marketAnchor: 'Market anchor: UK gov trial showed most code still edited by humans (high review discipline), but meaningful time savings even with conservative acceptance.',
        },
        {
          icon: 'Target',
          title: '6. Team Perception & UX',
          metric: 'Developer sentiment, cognitive load, UX friction.',
          target: ["90% of devs reporting positive perception (won't get met, but serves as conversation starter to inform how to make the toolset better)"],
          marketAnchor: "Market anchor (two-sided story): GitHub's research: strong perceived gains; most devs report feeling more productive and happier with their workflow. 2025 METR study: experienced devs using AI tools were actually ~19% slower, though they believed they were ~20% more productive—underscoring the need to triangulate perception with hard metrics.",
        },
      ],
    },
  },
  {
    id: 'nbim',
    title: 'NBIM Case Study',
    type: 'case-study',
    content: {
      type: 'case-study',
      heading: 'NBIM: Top-Down Mandate at Scale',
      metrics: [
        { value: '213K', label: 'Hours Saved Annually', sublabel: 'Equivalent of 100+ FTE employees', source: 'NBIM Reports, Smith Stephen Analysis' },
        { value: '$1.8T', label: 'Assets Under Management', sublabel: 'Managed by only 670 employees', source: 'Norges Bank Investment Management' },
        { value: '50%', label: 'Competitive Advantage', sublabel: '"50% ahead of non-AI competitors"', source: 'CEO Nicolai Tangen, Semafor' },
      ],
      sections: [
        {
          title: 'Leadership Strategy',
          items: [
            'Mandatory Adoption: AI proficiency required for promotion and hiring',
            'CEO Championship: Tangen personally drove adoption ("running around like a maniac")',
            'Cultural Shift: From voluntary to mandatory competency',
          ],
        },
        {
          title: 'Governance Framework',
          items: [
            'Human-in-Loop: All AI outputs require human review',
            'Clear Boundaries: Personal/trading data excluded',
            'Trust Building: Guardrails gave skeptics confidence',
          ],
        },
      ],
      anecdote: {
        label: 'Results',
        text: 'Multilingual reports (16 languages) that took days now complete in minutes. NBIM scaled back hiring plans while managing increasing AUM. CEO\'s view: "Companies not using AI will never catch up."',
      },
      insightBox: {
        label: 'PE Takeaway',
        text: "NBIM's success wasn't about unlimited resources or proprietary technology. It was about treating AI adoption as a change management challenge, not just a technology problem. The lesson: executive sponsorship and mandatory adoption (with governance) drives faster results than voluntary approaches.",
      },
    },
  },
  {
    id: 'value',
    title: 'Value Creation',
    type: 'comparison',
    content: {
      type: 'comparison',
      heading: 'Beyond Cost Reduction: The Growth Acceleration Play',
      left: {
        title: '❌ The Cost Reduction Trap',
        variant: 'negative',
        items: [
          'Questions Asked:',
          '"How many developers can we avoid hiring?"',
          '"Can we reduce engineering headcount?"',
          '"What\'s the cost per seat we\'re saving?"',
          'Why This Fails:',
          'Growth companies depend on technology buildouts',
          'Best engineers leave when growth slows',
          'Misses compounding value of faster iteration',
        ],
        footer: 'Outcome: Modest cost savings at the expense of market position and talent retention.',
      },
      right: {
        title: '✅ The Growth Acceleration Play',
        variant: 'positive',
        items: [
          'Questions Asked:',
          '"How fast can we hit product milestones?"',
          '"Can we compress 12 months into 6?"',
          '"What features become economically viable?"',
          '"How do we accelerate time-to-market?"',
          'Why This Works:',
          'Higher quality code with fewer bugs',
          '40-55% faster development timelines',
          'Enable previously impossible builds',
          'Reach revenue targets ahead of schedule',
        ],
        footer: 'Outcome: Accelerated revenue growth, faster market capture, competitive moats through product velocity.',
      },
      insightBox: {
        label: 'The PE Value Creation Equation',
        text: 'In portfolio companies, where product cycles are long and regulatory timelines are fixed, software velocity becomes a critical differentiator. Companies that build and iterate faster gain months of advantage in bringing products to market. The question isn\'t "How many developers can we save?" but "How much faster can we reach $100M ARR?"',
      },
    },
  },
  {
    id: 'impact',
    title: 'Organizational Impact',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'Talent & Operating Model Implications',
      columns: 2,
      items: [
        {
          title: 'Role Evolution',
          icon: 'UserCog',
          color: 'purple',
          items: [
            'From Typing to Orchestration: Developers manage AI agents, not write every line',
            'Skill Shift: Prompting, context management, review > syntax memorization',
            'Higher-Level Focus: Architecture, system design, business logic',
          ],
        },
        {
          title: '24-Hour Dev Cycle',
          icon: 'Timer',
          color: 'green',
          items: [
            'Always-On Agents: Development continues while humans sleep',
            'Background Execution: Long-running refactors in parallel',
            'Global Velocity: Work never stops across time zones',
          ],
        },
        {
          title: 'New Metrics',
          icon: 'BarChart3',
          color: 'purple',
          items: [
            'Beyond LOC: Feature velocity, test coverage, time to market',
            'Agent Efficiency: Acceptance rates, iteration counts',
            'Business Value: Revenue impact, competitive positioning',
          ],
        },
        {
          title: 'Hiring Shifts',
          icon: 'GraduationCap',
          color: 'green',
          items: [
            'Hire for Judgment: System thinking > coding speed',
            'AI Fluency: Prompt engineering becomes core skill',
            'Junior Acceleration: New grads productive faster with AI assist',
          ],
        },
      ],
      insightBox: {
        label: 'Portfolio Company Action Items',
        text: "Assess Current State: What % of dev team uses AI tools? What's blocking higher adoption? • Set Stance: Choose adoption approach based on competitive urgency and organizational readiness • Implement Observability: Track adoption, cost, quality metrics from day one • Invest in Training: Prompt engineering, agent management, code review of AI output • Communicate Value: Frame as growth acceleration, not headcount reduction",
      },
    },
  },
  {
    id: 'sources',
    title: 'Sources & Citations',
    type: 'sources',
    content: {
      type: 'sources',
      sectionLabel: 'References',
      heading: 'Sources & Citations',
      sections: [
        {
          title: 'Industry Research & Reports',
          startNumber: 1,
          items: [
            { text: 'Stack Overflow Developer Survey 2025 - AI adoption statistics', url: 'https://survey.stackoverflow.co/2025' },
            { text: 'GitLab Research (2024) - "78% of teams have integrated AI-assisted coding tools"', url: 'https://about.gitlab.com/blog/2024/01/16/ai-assisted-coding-tools-research/' },
            { text: 'GitHub Research - "Measuring GitHub Copilot\'s Impact on Productivity" (Communications of the ACM, March 2024)', url: 'https://github.blog/2024-03-06-measuring-github-copilots-impact-on-productivity/' },
            { text: 'Accenture Randomized Controlled Trial - GitHub Copilot productivity metrics (8.69% increase in PRs, 84% increase in successful builds)', url: 'https://www.accenture.com/us-en/insights/technology/github-copilot-productivity-study' },
            { text: 'Opsera Research - "GitHub Copilot Adoption Trends: Insights from Real Data" (time to PR: 9.6 to 2.4 days)', url: 'https://www.opsera.io/blog/github-copilot-adoption-trends' },
          ],
        },
        {
          title: 'Vendor Data & Benchmarks',
          startNumber: 6,
          items: [
            { text: 'Sacra Analysis - "Cursor at $100M ARR" and "$500M ARR" growth trajectory reports', url: 'https://sacra.com/research/cursor-100m-arr' },
            { text: 'Cursor Official Blog - "Introducing Cursor 2.0 and Composer" (October 2025)', url: 'https://cursor.sh/blog/cursor-2' },
            { text: 'Cursor Official Blog - "Composer: Building a fast frontier model with RL"', url: 'https://cursor.sh/blog/composer-fast-model' },
            { text: 'Anthropic - "Introducing Claude Opus 4.5" (November 2025)', url: 'https://www.anthropic.com/news/claude-opus-4-5' },
            { text: 'Anthropic - "Building agents with the Claude Agent SDK"', url: 'https://docs.anthropic.com/claude/docs/agents' },
            { text: 'Anthropic - "How to scale agentic coding across your engineering organization"', url: 'https://www.anthropic.com/news/scaling-agentic-coding' },
            { text: 'DevGraphiQ - "Cursor Statistics 2025: The Complete Data Analysis Report"', url: 'https://devgraphiq.com/cursor-statistics-2025' },
          ],
        },
        {
          title: 'Case Studies',
          startNumber: 13,
          items: [
            { text: 'Treasure Data - "How Our Engineering Team Embraced AI and Claude Code for 10x Productivity"', url: 'https://www.treasuredata.com/blog/claude-code-productivity' },
            { text: 'Norges Bank Investment Management (NBIM) - Smith Stephen Analysis: "How Norway\'s $1.8 Trillion Fund Saved 213,000 Hours with AI"', url: 'https://smithstephen.com/nbim-ai-case-study' },
            { text: 'VentureBeat - "Vibe coding is dead: Agentic swarm coding is the new enterprise moat" (Mark Ruddock case)', url: 'https://venturebeat.com/ai/vibe-coding-agentic-swarm-coding' },
            { text: 'Blockhead Consulting - "How I Manage 400K Lines of Code with Claude Code: A Multi-Agent Development Workflow" (July 2025)', url: 'https://blockhead.consulting/claude-code-400k-loc' },
          ],
        },
        {
          title: 'Academic & Technical Papers',
          startNumber: 17,
          items: [
            { text: 'arXiv 2505.19443 - "Vibe Coding vs. Agentic Coding: Fundamentals and Practical Implications of Agentic AI"', url: 'https://arxiv.org/abs/2505.19443' },
            { text: 'Communications of the ACM - "Claude 4\'s Agency in Practice: Beyond Code Generation" (Jenil Shah)', url: 'https://cacm.acm.org/magazines/2024/3/claude-agency' },
            { text: 'Experience with GitHub Copilot for Developer Productivity at Zoominfo (arXiv 2501.13282v1)', url: 'https://arxiv.org/abs/2501.13282' },
          ],
        },
        {
          title: 'Additional Industry Sources',
          startNumber: 20,
          items: [
            { text: 'Second Talent - "GitHub Copilot Statistics & Adoption Trends [2025]"', url: 'https://www.secondtalent.com/github-copilot-statistics-2025' },
            { text: 'The New Stack - "Vibe Coding in a Post-IDE World: Why Agentic AI Is the Real Disruption"', url: 'https://thenewstack.io/vibe-coding-agentic-ai' },
            { text: 'Datadog - "Monitor Claude Code adoption in your organization with Datadog\'s AI Agents Console"', url: 'https://www.datadoghq.com/blog/ai-agents-console' },
            { text: 'EY Norway - "Eight ways banks can move AI from pilot to performance"', url: 'https://www.ey.com/en_no/insights/banking/banks-ai-pilot-performance' },
            { text: 'GitHub Copilot Lab Studies - Developer productivity metrics showing 15-25% productivity uplift vs control', url: 'https://github.blog/github-copilot-lab-studies' },
            { text: 'UK Government Trial - AI coding assistants trial results showing developers saving ~1 hour per day (~12–20% of coding time) and 72% seeing good org value', url: 'https://www.gov.uk/government/publications/ai-coding-assistants-trial-results' },
            { text: 'METR Study 2025 - Research on experienced developers using AI tools showing perception vs actual productivity metrics', url: 'https://metr.org/ai-developer-productivity-study-2025' },
          ],
        },
      ],
    },
  },
]

export default slides

